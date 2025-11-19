/**
 * DeltaCheckEngine - Service for detecting anomalous changes in lab values
 * Compares current results with previous results to detect significant changes
 * 
 * Week 2 Phase 1 - RobotCom LIMS Automation Project
 */

export interface PreviousResult {
  id: string;
  value: number;
  date: Date;
}

export interface DeltaCheckAlert {
  triggered: boolean;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  currentValue: number;
  previousValue: number;
  changePercent: number;
  changeAbsolute: number;
  daysAgo: number;
  message: string;
  recommendation?: string;
}

/**
 * DeltaCheckEngine detects anomalous changes in sequential test results
 * Uses percentage and absolute value thresholds to identify concerning patterns
 */
export class DeltaCheckEngine {
  /**
   * Calculate percentage change between two values
   * Formula: ((current - previous) / previous) * 100
   */
  static calculatePercentChange(currentValue: number, previousValue: number): number {
    if (previousValue === 0) {
      // If previous was 0, treat as infinite change or use absolute difference
      return currentValue !== 0 ? 100 : 0;
    }
    return ((currentValue - previousValue) / previousValue) * 100;
  }

  /**
   * Calculate absolute change between values
   */
  static calculateAbsoluteChange(currentValue: number, previousValue: number): number {
    return Math.abs(currentValue - previousValue);
  }

  /**
   * Calculate days elapsed between two dates
   */
  static calculateDaysElapsed(previousDate: Date, currentDate: Date = new Date()): number {
    const diffTime = Math.abs(currentDate.getTime() - previousDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Perform delta check on hemoglobin
   * Critical changes: >2 g/dL drop or >1 g/dL increase in 1 day
   */
  static deltaCheckHemoglobin(currentValue: number, previousResult: PreviousResult): DeltaCheckAlert {
    const change = DeltaCheckEngine.calculateAbsoluteChange(currentValue, previousResult.value);
    const daysElapsed = DeltaCheckEngine.calculateDaysElapsed(previousResult.date);

    if (currentValue < previousResult.value && change > 2) {
      return {
        triggered: true,
        severity: 'CRITICAL',
        currentValue,
        previousValue: previousResult.value,
        changePercent: DeltaCheckEngine.calculatePercentChange(currentValue, previousResult.value),
        changeAbsolute: change,
        daysAgo: daysElapsed,
        message: `DELTA CHECK ALERT: Hemoglobin dropped ${change.toFixed(2)} g/dL in ${daysElapsed} days (from ${previousResult.value} to ${currentValue})`,
        recommendation: 'Possible acute blood loss or hemolysis. Check for bleeding or transfusion status.',
      };
    }

    if (currentValue > previousResult.value && change > 1 && daysElapsed === 1) {
      return {
        triggered: true,
        severity: 'WARNING',
        currentValue,
        previousValue: previousResult.value,
        changePercent: DeltaCheckEngine.calculatePercentChange(currentValue, previousResult.value),
        changeAbsolute: change,
        daysAgo: daysElapsed,
        message: `DELTA CHECK ALERT: Hemoglobin increased ${change.toFixed(2)} g/dL in 1 day (from ${previousResult.value} to ${currentValue})`,
        recommendation: 'Verify sample integrity. Consider rechecking.',
      };
    }

    return {
      triggered: false,
      severity: 'INFO',
      currentValue,
      previousValue: previousResult.value,
      changePercent: DeltaCheckEngine.calculatePercentChange(currentValue, previousResult.value),
      changeAbsolute: change,
      daysAgo: daysElapsed,
      message: 'Hemoglobin delta check normal',
    };
  }

  /**
   * Perform delta check on hematocrit
   * Critical changes: >3% drop in 1 day
   */
  static deltaCheckHematocrit(
    currentValue: number,
    previousResult: PreviousResult
  ): DeltaCheckAlert {
    const change = DeltaCheckEngine.calculateAbsoluteChange(currentValue, previousResult.value);
    const daysElapsed = DeltaCheckEngine.calculateDaysElapsed(previousResult.date);

    if (currentValue < previousResult.value && change > 3 && daysElapsed === 1) {
      return {
        triggered: true,
        severity: 'CRITICAL',
        currentValue,
        previousValue: previousResult.value,
        changePercent: DeltaCheckEngine.calculatePercentChange(currentValue, previousResult.value),
        changeAbsolute: change,
        daysAgo: daysElapsed,
        message: `DELTA CHECK ALERT: Hematocrit dropped ${change.toFixed(2)}% in 1 day (from ${previousResult.value}% to ${currentValue}%)`,
        recommendation: 'Possible acute anemia or blood loss. Verify and correlate with hemoglobin.',
      };
    }

    return {
      triggered: false,
      severity: 'INFO',
      currentValue,
      previousValue: previousResult.value,
      changePercent: DeltaCheckEngine.calculatePercentChange(currentValue, previousResult.value),
      changeAbsolute: change,
      daysAgo: daysElapsed,
      message: 'Hematocrit delta check normal',
    };
  }

  /**
   * Perform delta check on glucose
   * Critical changes: >200 mg/dL increase or drop below 50
   */
  static deltaCheckGlucose(
    currentValue: number,
    previousResult: PreviousResult
  ): DeltaCheckAlert {
    const change = DeltaCheckEngine.calculateAbsoluteChange(currentValue, previousResult.value);
    const percentChange = DeltaCheckEngine.calculatePercentChange(currentValue, previousResult.value);

    if (currentValue > previousResult.value && change > 200) {
      return {
        triggered: true,
        severity: 'CRITICAL',
        currentValue,
        previousValue: previousResult.value,
        changePercent: percentChange,
        changeAbsolute: change,
        daysAgo: DeltaCheckEngine.calculateDaysElapsed(previousResult.date),
        message: `DELTA CHECK ALERT: Glucose increased ${change.toFixed(0)} mg/dL (from ${previousResult.value} to ${currentValue})`,
        recommendation: 'Possible acute hyperglycemia. Check for infection or insulin omission.',
      };
    }

    if (currentValue < 50 && previousResult.value > 100) {
      return {
        triggered: true,
        severity: 'CRITICAL',
        currentValue,
        previousValue: previousResult.value,
        changePercent: percentChange,
        changeAbsolute: change,
        daysAgo: DeltaCheckEngine.calculateDaysElapsed(previousResult.date),
        message: `DELTA CHECK ALERT: Glucose critically low at ${currentValue} mg/dL (was ${previousResult.value})`,
        recommendation: 'Possible severe hypoglycemia. Requires immediate clinical action.',
      };
    }

    return {
      triggered: false,
      severity: 'INFO',
      currentValue,
      previousValue: previousResult.value,
      changePercent: percentChange,
      changeAbsolute: change,
      daysAgo: DeltaCheckEngine.calculateDaysElapsed(previousResult.date),
      message: 'Glucose delta check normal',
    };
  }

  /**
   * Perform delta check on creatinine (kidney function)
   * Critical changes: >0.5 increase or >50% change
   */
  static deltaCheckCreatinine(
    currentValue: number,
    previousResult: PreviousResult
  ): DeltaCheckAlert {
    const change = DeltaCheckEngine.calculateAbsoluteChange(currentValue, previousResult.value);
    const percentChange = DeltaCheckEngine.calculatePercentChange(currentValue, previousResult.value);
    const daysElapsed = DeltaCheckEngine.calculateDaysElapsed(previousResult.date);

    if (change > 0.5 && percentChange > 25) {
      return {
        triggered: true,
        severity: 'WARNING',
        currentValue,
        previousValue: previousResult.value,
        changePercent: percentChange,
        changeAbsolute: change,
        daysAgo: daysElapsed,
        message: `DELTA CHECK ALERT: Creatinine increased ${change.toFixed(2)} (${percentChange.toFixed(1)}%) in ${daysElapsed} days (from ${previousResult.value} to ${currentValue})`,
        recommendation: 'Possible acute kidney injury. Check fluid status and medications.',
      };
    }

    if (currentValue < previousResult.value && percentChange < -30) {
      return {
        triggered: true,
        severity: 'INFO',
        currentValue,
        previousValue: previousResult.value,
        changePercent: percentChange,
        changeAbsolute: change,
        daysAgo: daysElapsed,
        message: `DELTA CHECK ALERT: Creatinine decreased significantly (${percentChange.toFixed(1)}%) in ${daysElapsed} days`,
        recommendation: 'Verify sample and renal function status.',
      };
    }

    return {
      triggered: false,
      severity: 'INFO',
      currentValue,
      previousValue: previousResult.value,
      changePercent: percentChange,
      changeAbsolute: change,
      daysAgo: daysElapsed,
      message: 'Creatinine delta check normal',
    };
  }

  /**
   * Perform delta check on potassium
   * Critical changes: >0.5 increase or >30% change
   */
  static deltaCheckPotassium(
    currentValue: number,
    previousResult: PreviousResult
  ): DeltaCheckAlert {
    const change = DeltaCheckEngine.calculateAbsoluteChange(currentValue, previousResult.value);
    const percentChange = DeltaCheckEngine.calculatePercentChange(currentValue, previousResult.value);

    if (change > 0.5 && Math.abs(percentChange) > 20) {
      const direction = currentValue > previousResult.value ? 'increased' : 'decreased';
      const severity =
        (currentValue > 6.5 || currentValue < 2.5) ? 'CRITICAL' : 'WARNING';

      return {
        triggered: true,
        severity,
        currentValue,
        previousValue: previousResult.value,
        changePercent: percentChange,
        changeAbsolute: change,
        daysAgo: DeltaCheckEngine.calculateDaysElapsed(previousResult.date),
        message: `DELTA CHECK ALERT: Potassium ${direction} ${change.toFixed(2)} (${percentChange.toFixed(1)}%) (from ${previousResult.value} to ${currentValue})`,
        recommendation:
          currentValue > 6.5
            ? 'Hyperkalemia risk. Check ECG, medications, and kidney function.'
            : currentValue < 2.5
              ? 'Hypokalemia risk. Check for losses and medications.'
              : 'Verify sample integrity.',
      };
    }

    return {
      triggered: false,
      severity: 'INFO',
      currentValue,
      previousValue: previousResult.value,
      changePercent: percentChange,
      changeAbsolute: change,
      daysAgo: DeltaCheckEngine.calculateDaysElapsed(previousResult.date),
      message: 'Potassium delta check normal',
    };
  }

  /**
   * Generic delta check for any test
   * Uses percentage and absolute thresholds
   */
  static genericDeltaCheck(
    currentValue: number,
    previousResult: PreviousResult,
    percentThreshold: number = 25, // 25% change triggers alert
    absoluteThreshold?: number
  ): DeltaCheckAlert {
    const change = DeltaCheckEngine.calculateAbsoluteChange(currentValue, previousResult.value);
    const percentChange = DeltaCheckEngine.calculatePercentChange(currentValue, previousResult.value);
    const daysElapsed = DeltaCheckEngine.calculateDaysElapsed(previousResult.date);

    const triggerByPercent = Math.abs(percentChange) > percentThreshold;
    const triggerByAbsolute = absoluteThreshold !== undefined && change > absoluteThreshold;

    if (triggerByPercent || triggerByAbsolute) {
      return {
        triggered: true,
        severity: 'WARNING',
        currentValue,
        previousValue: previousResult.value,
        changePercent: percentChange,
        changeAbsolute: change,
        daysAgo: daysElapsed,
        message: `DELTA CHECK ALERT: Value changed ${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}% in ${daysElapsed} days (from ${previousResult.value} to ${currentValue})`,
        recommendation: 'Verify sample integrity and clinical context.',
      };
    }

    return {
      triggered: false,
      severity: 'INFO',
      currentValue,
      previousValue: previousResult.value,
      changePercent: percentChange,
      changeAbsolute: change,
      daysAgo: daysElapsed,
      message: 'Delta check normal',
    };
  }

  /**
   * Determine severity based on alert characteristics
   */
  static determineSeverity(
    alert: DeltaCheckAlert,
    criticalValues: { min?: number; max?: number }
  ): 'INFO' | 'WARNING' | 'CRITICAL' {
    // If outside critical range
    if (criticalValues.min !== undefined && alert.currentValue < criticalValues.min) {
      return 'CRITICAL';
    }
    if (criticalValues.max !== undefined && alert.currentValue > criticalValues.max) {
      return 'CRITICAL';
    }

    // If extreme percent change
    if (Math.abs(alert.changePercent) > 100) {
      return 'CRITICAL';
    }

    // Otherwise use alert's own severity
    return alert.severity;
  }

  /**
   * Format delta check alert for display
   */
  static formatAlert(alert: DeltaCheckAlert): string {
    let report = '\n';
    report += `Status: ${alert.triggered ? '⚠️ ALERT' : '✓ NORMAL'}\n`;
    report += `Severity: ${alert.severity}\n`;
    report += `Current Value: ${alert.currentValue}\n`;
    report += `Previous Value: ${alert.previousValue} (${alert.daysAgo} days ago)\n`;
    report += `Change: ${alert.changeAbsolute.toFixed(2)} (${alert.changePercent > 0 ? '+' : ''}${alert.changePercent.toFixed(1)}%)\n`;
    report += `Message: ${alert.message}\n`;
    if (alert.recommendation) {
      report += `Recommendation: ${alert.recommendation}\n`;
    }
    return report;
  }
}

export default DeltaCheckEngine;
