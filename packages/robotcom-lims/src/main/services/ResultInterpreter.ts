/**
 * ResultInterpreter - Service for interpreting test results
 * Handles normal range selection, abnormality detection, and clinical interpretation
 * 
 * Week 2 Phase 1 - RobotCom LIMS Automation Project
 */

export interface NormalRangeInfo {
  id: string;
  minValue: number;
  maxValue: number;
  criticalLow?: number;
  criticalHigh?: number;
  unit?: string;
  ageRange?: { min?: number; max?: number };
  gender?: string;
}

export interface AbnormalFlag {
  status: 'NORMAL' | 'LOW' | 'HIGH' | 'CRITICAL_LOW' | 'CRITICAL_HIGH';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
}

export interface InterpretationResult {
  value: number;
  normalRange: NormalRangeInfo;
  abnormalFlag: AbnormalFlag;
  interpretation: string;
  recommendations?: string[];
}

/**
 * ResultInterpreter handles clinical interpretation of test results
 * Uses normal ranges, rules, and clinical context to generate interpretations
 */
export class ResultInterpreter {
  /**
   * Check if age falls within specified range
   */
  private static isInAgeRange(
    age: number,
    ageRange?: { min?: number; max?: number }
  ): boolean {
    if (!ageRange) return true;
    if (ageRange.min !== undefined && age < ageRange.min) return false;
    if (ageRange.max !== undefined && age > ageRange.max) return false;
    return true;
  }

  /**
   * Select appropriate normal range based on age and gender
   * Prioritizes: age+gender > age only > gender only > default
   */
  static selectNormalRange(
    normalRanges: NormalRangeInfo[],
    age: number,
    gender?: string
  ): NormalRangeInfo {
    if (normalRanges.length === 0) {
      throw new Error('No normal ranges available');
    }

    // First, try age + gender match
    if (gender) {
      const ageGenderMatch = normalRanges.find(
        (range) =>
          ResultInterpreter.isInAgeRange(age, range.ageRange) &&
          range.gender?.toUpperCase() === gender.toUpperCase()
      );
      if (ageGenderMatch) return ageGenderMatch;
    }

    // Then, try age-only match
    const ageOnlyMatch = normalRanges.find(
      (range) =>
        ResultInterpreter.isInAgeRange(age, range.ageRange) && !range.gender
    );
    if (ageOnlyMatch) return ageOnlyMatch;

    // Then, try gender-only match (for adult ranges without age specifics)
    if (gender) {
      const genderMatch = normalRanges.find(
        (range) =>
          range.gender?.toUpperCase() === gender.toUpperCase() &&
          !range.ageRange
      );
      if (genderMatch) return genderMatch;
    }

    // Finally, use default (no age or gender restrictions)
    const defaultRange = normalRanges.find(
      (range) => !range.ageRange && !range.gender
    );
    if (defaultRange) return defaultRange;

    // If nothing matches, use first available
    return normalRanges[0];
  }

  /**
   * Determine abnormality status and severity
   */
  static determineAbnormalFlag(
    value: number,
    normalRange: NormalRangeInfo
  ): AbnormalFlag {
    // Check critical values first
    if (normalRange.criticalLow !== undefined && value < normalRange.criticalLow) {
      return {
        status: 'CRITICAL_LOW',
        severity: 'CRITICAL',
        message: `CRITICAL LOW: ${value} (critical threshold: ${normalRange.criticalLow})`,
      };
    }

    if (normalRange.criticalHigh !== undefined && value > normalRange.criticalHigh) {
      return {
        status: 'CRITICAL_HIGH',
        severity: 'CRITICAL',
        message: `CRITICAL HIGH: ${value} (critical threshold: ${normalRange.criticalHigh})`,
      };
    }

    // Check normal range
    if (value < normalRange.minValue) {
      return {
        status: 'LOW',
        severity: 'WARNING',
        message: `Low: ${value} (normal range: ${normalRange.minValue}-${normalRange.maxValue})`,
      };
    }

    if (value > normalRange.maxValue) {
      return {
        status: 'HIGH',
        severity: 'WARNING',
        message: `High: ${value} (normal range: ${normalRange.minValue}-${normalRange.maxValue})`,
      };
    }

    return {
      status: 'NORMAL',
      severity: 'INFO',
      message: `Normal: ${value} (normal range: ${normalRange.minValue}-${normalRange.maxValue})`,
    };
  }

  /**
   * Generate clinical interpretation based on test type and abnormality status
   */
  static generateInterpretation(
    testType: string,
    status: string
  ): string {
    if (status === 'NORMAL') {
      return `Result is within normal limits.`;
    }

    // Generate test-specific interpretations
    const lowInterpretations: Record<string, string> = {
      hemoglobin: 'Low hemoglobin may indicate anemia. Consider evaluation for iron deficiency, B12 deficiency, or chronic disease.',
      hematocrit: 'Low hematocrit supports anemia diagnosis. Correlate with hemoglobin and RBC values.',
      wbc: 'Low WBC (leukopenia) may indicate bone marrow suppression, infection, or medication effect. Consider differential.',
      platelets: 'Low platelets (thrombocytopenia) increases bleeding risk. Evaluate for immune or bone marrow causes.',
      albumin: 'Low albumin indicates poor nutritional status or liver disease. Monitor closely.',
      glucose: 'Low glucose (hypoglycemia) requires immediate clinical attention. Symptoms should be assessed.',
      sodium: 'Low sodium (hyponatremia) affects fluid balance. Determine cause (SIADH, dehydration, medication).',
      potassium: 'Low potassium (hypokalemia) affects cardiac function. May need supplementation.',
      calcium: 'Low calcium affects bone health and neuromuscular function. Evaluate vitamin D and PTH.',
      phosphorus: 'Low phosphorus affects energy metabolism. Correlate with calcium.',
      magnesium: 'Low magnesium affects muscle and nerve function. May cause weakness and arrhythmias.',
      creatinine: 'Low creatinine may indicate muscle loss or malnutrition rather than improved kidney function.',
      bun: 'Low BUN may indicate liver disease, malnutrition, or pregnancy.',
      cholesterol: 'Low cholesterol may indicate malnutrition, liver disease, or medication effect.',
      hdl: 'Low HDL (good cholesterol) increases cardiovascular risk. Recommend lifestyle modifications.',
      ldl: 'Low LDL is generally favorable and reduces cardiovascular risk.',
      triglycerides: 'Low triglycerides are favorable for cardiovascular health.',
    };

    const highInterpretations: Record<string, string> = {
      hemoglobin: 'High hemoglobin (polycythemia) may indicate dehydration, smoking, or bone marrow disorder. Evaluate plasma volume.',
      hematocrit: 'High hematocrit supports polycythemia. May increase thrombotic risk.',
      wbc: 'High WBC (leukocytosis) suggests infection, leukemia, or inflammatory condition. Review differential.',
      platelets: 'High platelets (thrombocytosis) may indicate reactive condition or myeloproliferative disorder.',
      glucose: 'High glucose (hyperglycemia) suggests diabetes or stress response. Consider HbA1c and glucose tolerance test.',
      sodium: 'High sodium (hypernatremia) indicates dehydration or excessive sodium intake. Assess fluid status.',
      potassium: 'High potassium (hyperkalemia) affects cardiac function. Consider ECG and treatment if severe.',
      calcium: 'High calcium may indicate hyperparathyroidism, malignancy, or vitamin D toxicity. Evaluate PTH.',
      phosphorus: 'High phosphorus often correlates with kidney disease. Assess renal function.',
      magnesium: 'High magnesium is rare but can cause neuromuscular dysfunction.',
      creatinine: 'High creatinine indicates reduced kidney function. Calculate eGFR for proper assessment.',
      bun: 'High BUN suggests kidney dysfunction or dehydration. Compare with creatinine ratio.',
      cholesterol: 'High total cholesterol increases cardiovascular risk. Review lipid panel and risk factors.',
      hdl: 'High HDL (good cholesterol) is protective against cardiovascular disease.',
      ldl: 'High LDL increases cardiovascular risk. Recommend statin therapy per guidelines.',
      triglycerides: 'High triglycerides increase pancreatitis and cardiovascular risk. Consider lipid-lowering therapy.',
      ast: 'High AST suggests liver, heart, or muscle damage. Evaluate AST/ALT ratio and other liver tests.',
      alt: 'High ALT is more specific for liver damage. Evaluate viral hepatitis and fatty liver.',
      alp: 'High ALP may indicate liver, bone, or biliary disease. Check liver enzymes and GGT.',
      bilirubin: 'High bilirubin indicates jaundice. Determine if conjugated or unconjugated.',
    };

    const isLow = status === 'LOW';
    const interpretations = isLow ? lowInterpretations : highInterpretations;

    return (
      interpretations[testType.toLowerCase()] ||
      `${isLow ? 'Low' : 'High'} result detected. Correlate with clinical presentation and other laboratory values.`
    );
  }

  /**
   * Generate clinical recommendations based on result
   */
  static generateRecommendations(
    testType: string,
    status: string
  ): string[] {
    const recommendations: string[] = [];

    if (status === 'CRITICAL_LOW' || status === 'CRITICAL_HIGH') {
      recommendations.push('⚠️ CRITICAL VALUE - Notify ordering physician immediately');
      recommendations.push('Consider repeat testing to confirm result');
    }

    // Test-specific recommendations
    switch (testType.toLowerCase()) {
      case 'glucose':
        if (status === 'LOW') recommendations.push('Assess for hypoglycemic symptoms');
        if (status === 'HIGH') recommendations.push('Order HbA1c and glucose tolerance test');
        break;

      case 'hemoglobin':
      case 'hematocrit':
        if (status === 'LOW') {
          recommendations.push('Check peripheral blood smear');
          recommendations.push('Consider iron studies');
        }
        if (status === 'HIGH') {
          recommendations.push('Assess hydration status');
          recommendations.push('Consider phlebotomy if confirmed');
        }
        break;

      case 'creatinine':
      case 'bun':
        if (status === 'HIGH') {
          recommendations.push('Calculate eGFR');
          recommendations.push('Check urine protein and microscopy');
          recommendations.push('Monitor blood pressure');
        }
        break;

      case 'potassium':
        if (status === 'LOW') recommendations.push('May need potassium supplementation');
        if (status === 'HIGH') recommendations.push('Restrict dietary potassium');
        if (status === 'CRITICAL_LOW' || status === 'CRITICAL_HIGH') {
          recommendations.push('Obtain ECG');
          recommendations.push('Consider emergency treatment');
        }
        break;

      case 'cholesterol':
      case 'ldl':
        if (status === 'HIGH') {
          recommendations.push('Assess cardiovascular risk factors');
          recommendations.push('Consider statin therapy');
          recommendations.push('Recommend lifestyle modifications (diet, exercise)');
        }
        break;

      case 'ast':
      case 'alt':
        if (status === 'HIGH') {
          recommendations.push('Check hepatitis serology');
          recommendations.push('Assess for alcohol use and medications');
          recommendations.push('Ultrasound may be indicated');
        }
        break;
    }

    if (recommendations.length === 0) {
      recommendations.push('Follow up as clinically indicated');
    }

    return recommendations;
  }

  /**
   * Interpret a single test result
   * Combines normal range selection, abnormality detection, and interpretation
   */
  static interpretResult(
    testType: string,
    value: number,
    normalRanges: NormalRangeInfo[],
    age: number,
    gender?: string
  ): InterpretationResult {
    // Select appropriate normal range
    const normalRange = this.selectNormalRange(normalRanges, age, gender);

    // Determine abnormality status
    const abnormalFlag = this.determineAbnormalFlag(value, normalRange);

    // Generate interpretation
    const interpretation = this.generateInterpretation(
      testType,
      abnormalFlag.status
    );

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      testType,
      abnormalFlag.status
    );

    return {
      value,
      normalRange,
      abnormalFlag,
      interpretation,
      recommendations: recommendations.length > 0 ? recommendations : undefined,
    };
  }

  /**
   * Batch interpret multiple results
   */
  static interpretResults(
    results: Array<{
      testType: string;
      value: number;
      normalRanges: NormalRangeInfo[];
      age: number;
      gender?: string;
    }>
  ): InterpretationResult[] {
    return results.map((result) =>
      this.interpretResult(
        result.testType,
        result.value,
        result.normalRanges,
        result.age,
        result.gender
      )
    );
  }

  /**
   * Determine if result requires immediate physician notification
   */
  static requiresImmediateNotification(abnormalFlag: AbnormalFlag): boolean {
    return (
      abnormalFlag.severity === 'CRITICAL' ||
      abnormalFlag.status === 'CRITICAL_LOW' ||
      abnormalFlag.status === 'CRITICAL_HIGH'
    );
  }

  /**
   * Generate a formatted report of interpretation
   */
  static formatReport(
    testType: string,
    result: InterpretationResult
  ): string {
    let report = `\n${'='.repeat(60)}\n`;
    report += `Test: ${testType}\n`;
    report += `Result: ${result.value} ${result.normalRange.unit || ''}\n`;
    report += `Status: ${result.abnormalFlag.status}\n`;
    report += `Severity: ${result.abnormalFlag.severity}\n`;
    report += `Normal Range: ${result.normalRange.minValue}-${result.normalRange.maxValue}\n`;
    report += `\nInterpretation:\n${result.interpretation}\n`;

    if (result.recommendations && result.recommendations.length > 0) {
      report += `\nRecommendations:\n`;
      result.recommendations.forEach((rec) => {
        report += `  • ${rec}\n`;
      });
    }

    report += `${'='.repeat(60)}\n`;
    return report;
  }
}

export default ResultInterpreter;
