/**
 * QualityControlEngine - Service for QC monitoring and Levey-Jennings analysis
 * Implements Westgard rules and QC validation for analyzer quality assurance
 * 
 * Week 2 Phase 1 - RobotCom LIMS Automation Project
 * Author: David Navas
 */

export interface QCRun {
  id: string;
  testId: string;
  testName: string;
  levelId: string;
  levelName: string; // 'Low', 'Normal', 'High'
  value: number;
  expectedMean: number;
  expectedSD: number;
  timestamp: Date;
  operatorId?: string;
  instrumentId?: string;
  lotNumber?: string;
  expiryDate?: Date;
}

export interface QCAnalysis {
  passed: boolean;
  violations: WestgardViolation[];
  zScore: number;
  controlType: string;
  message: string;
  recommendations?: string[];
}

export interface WestgardViolation {
  ruleName: string;
  description: string;
  severity: 'WARNING' | 'CRITICAL';
  requiresAction: boolean;
  recommendedAction: string;
}

export interface LeveyJenningsPoint {
  runNumber: number;
  value: number;
  zScore: number;
  timestamp: Date;
  isOutOfControl: boolean;
}

/**
 * QualityControlEngine manages QC runs and applies Westgard multirule quality control
 * Implements Levey-Jennings charting and statistical process control
 */
export class QualityControlEngine {
  /**
   * Calculate Z-score (standard deviations from mean)
   * Formula: Z = (Value - Mean) / SD
   */
  static calculateZScore(value: number, mean: number, standardDeviation: number): number {
    if (standardDeviation === 0) {
      throw new Error('Standard deviation cannot be zero');
    }
    return (value - mean) / standardDeviation;
  }

  /**
   * Apply Rule 1-2s: Single observation exceeds ±2 SD
   * Violation when: |Z| > 2
   * Severity: WARNING - suggests random error
   */
  static checkRule1_2s(zScore: number): WestgardViolation | null {
    if (Math.abs(zScore) > 2) {
      return {
        ruleName: '1-2s',
        description: 'Single observation exceeds ±2 SD',
        severity: 'WARNING',
        requiresAction: false,
        recommendedAction: 'Monitor next run - may indicate random error',
      };
    }
    return null;
  }

  /**
   * Apply Rule 1-3s: Single observation exceeds ±3 SD
   * Violation when: |Z| > 3
   * Severity: CRITICAL - reject run
   */
  static checkRule1_3s(zScore: number): WestgardViolation | null {
    if (Math.abs(zScore) > 3) {
      return {
        ruleName: '1-3s',
        description: 'Single observation exceeds ±3 SD',
        severity: 'CRITICAL',
        requiresAction: true,
        recommendedAction: 'REJECT RUN - Investigate instrument malfunction or calibration error',
      };
    }
    return null;
  }

  /**
   * Apply Rule 2-2s: Two consecutive observations exceed same side of ±2 SD
   * Violation when: Two consecutive Z-scores both >+2 or both <-2
   * Severity: CRITICAL - suggests systematic error
   */
  static checkRule2_2s(previousZScore: number, currentZScore: number): WestgardViolation | null {
    const bothPositive = previousZScore > 2 && currentZScore > 2;
    const bothNegative = previousZScore < -2 && currentZScore < -2;

    if (bothPositive || bothNegative) {
      return {
        ruleName: '2-2s',
        description: 'Two consecutive observations exceed same side of ±2 SD',
        severity: 'CRITICAL',
        requiresAction: true,
        recommendedAction: 'REJECT RUN - Investigate systematic error (calibration or reagent issue)',
      };
    }
    return null;
  }

  /**
   * Apply Rule R-4s: Range of two consecutive observations exceeds 4 SD
   * Violation when: |Z1 - Z2| > 4
   * Severity: CRITICAL - rejects when range is large
   */
  static checkRuleR_4s(previousZScore: number, currentZScore: number): WestgardViolation | null {
    const range = Math.abs(previousZScore - currentZScore);

    if (range > 4) {
      return {
        ruleName: 'R-4s',
        description: 'Range between two consecutive observations exceeds 4 SD',
        severity: 'CRITICAL',
        requiresAction: true,
        recommendedAction: 'REJECT RUN - Investigate increased random error or instrument malfunction',
      };
    }
    return null;
  }

  /**
   * Apply Rule 4-1s: Four consecutive observations exceed same side of ±1 SD
   * Violation when: Four consecutive Z-scores all >+1 or all <-1
   * Severity: CRITICAL - suggests systematic drift
   */
  static checkRule4_1s(zScores: number[]): WestgardViolation | null {
    if (zScores.length < 4) return null;

    const lastFour = zScores.slice(-4);
    const allPositive = lastFour.every((z) => z > 1);
    const allNegative = lastFour.every((z) => z < -1);

    if (allPositive || allNegative) {
      return {
        ruleName: '4-1s',
        description: 'Four consecutive observations exceed same side of ±1 SD',
        severity: 'CRITICAL',
        requiresAction: true,
        recommendedAction: 'REJECT RUN - Investigate systematic drift (recalibration needed)',
      };
    }
    return null;
  }

  /**
   * Apply Rule 10-x: Ten consecutive observations exceed same side of mean (±1 SD or less)
   * Violation when: Ten consecutive values all above or all below mean
   * Severity: CRITICAL - suggests calibration drift
   */
  static checkRule10_x(zScores: number[]): WestgardViolation | null {
    if (zScores.length < 10) return null;

    const lastTen = zScores.slice(-10);
    const allPositive = lastTen.every((z) => z > 0);
    const allNegative = lastTen.every((z) => z < 0);

    if (allPositive || allNegative) {
      return {
        ruleName: '10-x',
        description: 'Ten consecutive observations exceed same side of mean',
        severity: 'CRITICAL',
        requiresAction: true,
        recommendedAction: 'REJECT RUN - Systematic drift detected; recalibration and reagent change required',
      };
    }
    return null;
  }

  /**
   * Apply Westgard Multirule QC
   * Checks all applicable rules and returns any violations
   */
  static applyWestgardRules(
    currentRun: QCRun,
    previousRuns: QCRun[] = []
  ): QCAnalysis {
    const currentZScore = this.calculateZScore(currentRun.value, currentRun.expectedMean, currentRun.expectedSD);
    const violations: WestgardViolation[] = [];

    // Rule 1-3s: Single observation exceeds ±3 SD
    const violation1_3s = this.checkRule1_3s(currentZScore);
    if (violation1_3s) violations.push(violation1_3s);

    // Rule 1-2s: Single observation exceeds ±2 SD (only if 1-3s not violated)
    if (!violation1_3s) {
      const violation1_2s = this.checkRule1_2s(currentZScore);
      if (violation1_2s) violations.push(violation1_2s);
    }

    // Rule 2-2s: Two consecutive observations exceed same side
    if (previousRuns.length > 0) {
      const previousZScore = this.calculateZScore(
        previousRuns[previousRuns.length - 1].value,
        previousRuns[previousRuns.length - 1].expectedMean,
        previousRuns[previousRuns.length - 1].expectedSD
      );
      const violation2_2s = this.checkRule2_2s(previousZScore, currentZScore);
      if (violation2_2s) violations.push(violation2_2s);

      // Rule R-4s: Range exceeds 4 SD
      const violationR_4s = this.checkRuleR_4s(previousZScore, currentZScore);
      if (violationR_4s) violations.push(violationR_4s);
    }

    // Rule 4-1s: Four consecutive observations exceed same side of ±1 SD
    if (previousRuns.length >= 3) {
      const zScores = previousRuns.slice(-3).map((run) =>
        this.calculateZScore(run.value, run.expectedMean, run.expectedSD)
      );
      zScores.push(currentZScore);
      const violation4_1s = this.checkRule4_1s(zScores);
      if (violation4_1s) violations.push(violation4_1s);
    }

    // Rule 10-x: Ten consecutive observations exceed same side of mean
    if (previousRuns.length >= 9) {
      const zScores = previousRuns.slice(-9).map((run) =>
        this.calculateZScore(run.value, run.expectedMean, run.expectedSD)
      );
      zScores.push(currentZScore);
      const violation10_x = this.checkRule10_x(zScores);
      if (violation10_x) violations.push(violation10_x);
    }

    const passed = violations.length === 0;
    const criticalViolations = violations.filter((v) => v.severity === 'CRITICAL');

    return {
      passed,
      violations,
      zScore: currentZScore,
      controlType: currentRun.levelName,
      message: passed
        ? `✓ QC Run PASSED (Z-score: ${currentZScore.toFixed(2)})`
        : `✗ QC Run FAILED - ${criticalViolations.length} critical violation(s)`,
      recommendations: violations
        .filter((v) => v.requiresAction)
        .map((v) => v.recommendedAction),
    };
  }

  /**
   * Calculate control limits for Levey-Jennings chart
   * Returns mean ±1SD, ±2SD, and ±3SD lines
   */
  static calculateControlLimits(mean: number, standardDeviation: number) {
    return {
      upperLimitCritical: mean + 3 * standardDeviation, // +3 SD
      upperLimitWarning: mean + 2 * standardDeviation, // +2 SD
      mean,
      lowerLimitWarning: mean - 2 * standardDeviation, // -2 SD
      lowerLimitCritical: mean - 3 * standardDeviation, // -3 SD
    };
  }

  /**
   * Evaluate if a QC run is within control limits
   */
  static isWithinControlLimits(value: number, mean: number, standardDeviation: number): boolean {
    const zScore = this.calculateZScore(value, mean, standardDeviation);
    return Math.abs(zScore) <= 3; // Within ±3 SD
  }

  /**
   * Calculate moving average for trend analysis
   * Helps identify gradual systematic errors
   */
  static calculateMovingAverage(runs: QCRun[], windowSize: number = 5): number[] {
    const movingAverages: number[] = [];

    for (let i = windowSize - 1; i < runs.length; i++) {
      const window = runs.slice(i - windowSize + 1, i + 1);
      const average = window.reduce((sum, run) => sum + run.value, 0) / windowSize;
      movingAverages.push(average);
    }

    return movingAverages;
  }

  /**
   * Generate Levey-Jennings chart data points
   */
  static generateLeveyJenningsData(runs: QCRun[]): LeveyJenningsPoint[] {
    if (runs.length === 0) return [];

    // Use first run's expected values for the control level
    const firstRun = runs[0];
    const mean = firstRun.expectedMean;
    const sd = firstRun.expectedSD;

    return runs.map((run, index) => {
      const zScore = this.calculateZScore(run.value, mean, sd);
      return {
        runNumber: index + 1,
        value: run.value,
        zScore,
        timestamp: run.timestamp,
        isOutOfControl: Math.abs(zScore) > 3,
      };
    });
  }

  /**
   * Detect trends in QC data
   * Returns true if trend is detected (increasing or decreasing pattern)
   */
  static detectTrend(zScores: number[], minRunsForTrend: number = 6): boolean {
    if (zScores.length < minRunsForTrend) return false;

    const lastN = zScores.slice(-minRunsForTrend);
    
    // Check for increasing trend
    const increasingTrend = lastN.every((z, i) => i === 0 || z >= lastN[i - 1]);
    
    // Check for decreasing trend
    const decreasingTrend = lastN.every((z, i) => i === 0 || z <= lastN[i - 1]);

    return increasingTrend || decreasingTrend;
  }

  /**
   * Check QC stability over time
   * Returns coefficient of variation (CV%)
   */
  static calculateCoeffcientOfVariation(runs: QCRun[]): number {
    if (runs.length === 0) return 0;

    const values = runs.map((run) => run.value);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;

    if (mean === 0) return 0;

    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const sd = Math.sqrt(variance);

    return (sd / mean) * 100; // Percentage
  }

  /**
   * Generate QC report summary
   */
  static generateQCReport(
    currentRun: QCRun,
    analysis: QCAnalysis,
    historicalRuns: QCRun[] = []
  ): string {
    let report = '\n';
    report += `QC ANALYSIS REPORT\n`;
    report += `═══════════════════════════════════\n`;
    report += `Test: ${currentRun.testName} (${currentRun.testId})\n`;
    report += `Control Level: ${currentRun.levelName}\n`;
    report += `Date/Time: ${currentRun.timestamp.toLocaleString()}\n`;
    report += `\nRESULT:\n`;
    report += `Value: ${currentRun.value}\n`;
    report += `Expected Mean: ${currentRun.expectedMean}\n`;
    report += `Expected SD: ${currentRun.expectedSD}\n`;
    report += `Z-Score: ${analysis.zScore.toFixed(2)}\n`;
    report += `Status: ${analysis.passed ? '✓ PASSED' : '✗ FAILED'}\n`;

    if (!analysis.passed) {
      report += `\nVIOLATIONS:\n`;
      analysis.violations.forEach((v) => {
        report += `• ${v.ruleName}: ${v.description} [${v.severity}]\n`;
      });
    }

    if (analysis.recommendations && analysis.recommendations.length > 0) {
      report += `\nRECOMMENDED ACTIONS:\n`;
      analysis.recommendations.forEach((rec) => {
        report += `• ${rec}\n`;
      });
    }

    if (historicalRuns.length > 0) {
      const cv = this.calculateCoeffcientOfVariation(historicalRuns);
      report += `\nHISTORICAL ANALYSIS (${historicalRuns.length} recent runs):\n`;
      report += `Coefficient of Variation: ${cv.toFixed(2)}%\n`;

      const zScores = historicalRuns.map((run) =>
        this.calculateZScore(run.value, currentRun.expectedMean, currentRun.expectedSD)
      );
      const trendDetected = this.detectTrend(zScores);
      report += `Trend Detected: ${trendDetected ? 'YES - Investigate' : 'NO'}\n`;
    }

    return report;
  }

  /**
   * Determine if QC needs replacement
   * Suggests replacement if CV% > 5% or trend detected
   */
  static shouldReplaceQC(runs: QCRun[], trendDetected: boolean = false): boolean {
    if (runs.length < 5) return false;

    const cv = this.calculateCoeffcientOfVariation(runs);

    // Flag if CV > 5% or trend exists
    return cv > 5 || trendDetected;
  }
}

export default QualityControlEngine;
