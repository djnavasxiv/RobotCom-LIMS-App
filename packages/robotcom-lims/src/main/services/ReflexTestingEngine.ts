/**
 * ReflexTestingEngine - Service for automated reflex testing
 * Implements automatic follow-up test ordering based on initial result criteria
 * 
 * Week 2 Phase 1 - RobotCom LIMS Automation Project
 * Author: David Navas
 */

export interface ReflexTestRule {
  id: string;
  parentTestId: string;
  parentTestName: string;
  childTestId: string;
  childTestName: string;
  condition: string; // "value > 100", "abnormalFlag == 'HIGH'", "value BETWEEN 50 AND 100"
  priority: number;
  requiresApproval: boolean;
  isActive: boolean;
  description?: string;
}

export interface ReflexTestTrigger {
  triggered: boolean;
  parentTestId: string;
  parentTestValue: number;
  condition: string;
  message: string;
  reflexTests: ReflexTestDefinition[];
  requiresApproval: boolean;
}

export interface ReflexTestDefinition {
  testId: string;
  testName: string;
  priority: number;
  reason: string;
  estimatedTurnaroundTime?: string;
}

/**
 * ReflexTestingEngine manages automatic reflex test orders based on clinical criteria
 * Supports conditional logic and cascading reflex tests
 */
export class ReflexTestingEngine {
  /**
   * Evaluate a condition expression for reflexing
   * Supports conditions like: "value > 100", "value BETWEEN 50 AND 100", "abnormalFlag == 'HIGH'"
   */
  static evaluateCondition(
    condition: string,
    testValue: number,
    abnormalFlag?: string
  ): boolean {
    try {
      let expression = condition;

      // Replace 'value' placeholder
      expression = expression.replace(/\bvalue\b/g, String(testValue));

      // Replace abnormalFlag if provided
      if (abnormalFlag !== undefined) {
        expression = expression.replace(/\babnormalFlag\b/g, `'${abnormalFlag}'`);
      }

      // Handle BETWEEN operator
      if (expression.includes('BETWEEN')) {
        expression = expression.replace(
          /(\d+\.?\d*)\s+BETWEEN\s+(\d+\.?\d*)\s+AND\s+(\d+\.?\d*)/g,
          '($1 >= $2 && $1 <= $3)'
        );
      }

      // Safely evaluate expression
      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${expression})`)();

      return Boolean(result);
    } catch (error) {
      console.error(
        `Error evaluating reflex condition: ${condition}`,
        error
      );
      return false;
    }
  }

  /**
   * Check if hemoglobin result triggers reflex tests
   * Reflex patterns:
   * - Critical low (<7 g/dL): Reticulocyte count, Peripheral blood smear
   * - Severe anemia (7-8 g/dL): Reticulocyte count, Iron studies
   * - Moderate anemia (8-10 g/dL): Reticulocyte count
   */
  static checkHemoglobinReflex(hemoglobin: number): ReflexTestTrigger {
    let triggered = false;
    const reflexTests: ReflexTestDefinition[] = [];

    if (hemoglobin < 7) {
      triggered = true;
      reflexTests.push({
        testId: 'RETC',
        testName: 'Reticulocyte Count',
        priority: 1,
        reason: 'Critical anemia - assess bone marrow response',
        estimatedTurnaroundTime: '1 hour',
      });
      reflexTests.push({
        testId: 'PBS',
        testName: 'Peripheral Blood Smear',
        priority: 1,
        reason: 'Morphologic assessment for critical anemia',
        estimatedTurnaroundTime: '1 hour',
      });
    } else if (hemoglobin < 8) {
      triggered = true;
      reflexTests.push({
        testId: 'RETC',
        testName: 'Reticulocyte Count',
        priority: 1,
        reason: 'Severe anemia - assess bone marrow response',
        estimatedTurnaroundTime: '1 hour',
      });
      reflexTests.push({
        testId: 'IRON',
        testName: 'Iron Studies (Serum Iron, TIBC, Ferritin)',
        priority: 2,
        reason: 'Assess iron metabolism in severe anemia',
        estimatedTurnaroundTime: '4 hours',
      });
    } else if (hemoglobin < 10) {
      triggered = true;
      reflexTests.push({
        testId: 'RETC',
        testName: 'Reticulocyte Count',
        priority: 1,
        reason: 'Moderate anemia - assess bone marrow response',
        estimatedTurnaroundTime: '1 hour',
      });
    }

    return {
      triggered,
      parentTestId: 'HGB',
      parentTestValue: hemoglobin,
      condition: hemoglobin < 10 ? '<10 g/dL' : 'normal',
      message: triggered
        ? `Hemoglobin ${hemoglobin} g/dL triggers ${reflexTests.length} reflex test(s)`
        : `Hemoglobin ${hemoglobin} g/dL - no reflex tests required`,
      reflexTests,
      requiresApproval: hemoglobin < 7, // Critical values require approval
    };
  }

  /**
   * Check if WBC result triggers reflex tests
   * Reflex patterns:
   * - Critical high (>50 K/μL): Differential, Blood smear, Blast count
   * - Marked elevation (>20 K/μL): Differential, Blood smear
   * - Abnormal differential: Blood smear
   */
  static checkWBCReflex(wbc: number, differentialPerformed?: boolean): ReflexTestTrigger {
    let triggered = false;
    const reflexTests: ReflexTestDefinition[] = [];

    if (wbc > 50) {
      triggered = true;
      reflexTests.push({
        testId: 'DIFF',
        testName: 'WBC Differential Count',
        priority: 1,
        reason: 'Critical elevation - assess cell distribution',
        estimatedTurnaroundTime: '2 hours',
      });
      reflexTests.push({
        testId: 'PBS',
        testName: 'Peripheral Blood Smear',
        priority: 1,
        reason: 'Critical leukocytosis - morphologic evaluation',
        estimatedTurnaroundTime: '2 hours',
      });
      reflexTests.push({
        testId: 'BLAST',
        testName: 'Blast Count',
        priority: 1,
        reason: 'Rule out acute leukemia',
        estimatedTurnaroundTime: '4 hours',
      });
    } else if (wbc > 20) {
      triggered = true;
      reflexTests.push({
        testId: 'DIFF',
        testName: 'WBC Differential Count',
        priority: 1,
        reason: 'Marked leukocytosis - assess cell distribution',
        estimatedTurnaroundTime: '2 hours',
      });
      reflexTests.push({
        testId: 'PBS',
        testName: 'Peripheral Blood Smear',
        priority: 2,
        reason: 'Evaluate cellular morphology',
        estimatedTurnaroundTime: '2 hours',
      });
    } else if (wbc < 3.5 && wbc > 0) {
      triggered = true;
      reflexTests.push({
        testId: 'DIFF',
        testName: 'WBC Differential Count',
        priority: 1,
        reason: 'Leukopenia - assess differential count',
        estimatedTurnaroundTime: '2 hours',
      });
    } else if (!differentialPerformed) {
      // Check if differential was already done
      triggered = true;
      reflexTests.push({
        testId: 'DIFF',
        testName: 'WBC Differential Count',
        priority: 2,
        reason: 'Routine differential count',
        estimatedTurnaroundTime: '2 hours',
      });
    }

    return {
      triggered,
      parentTestId: 'WBC',
      parentTestValue: wbc,
      condition: wbc > 20 ? '>20 K/μL' : wbc < 3.5 ? '<3.5 K/μL' : 'normal',
      message: triggered
        ? `WBC ${wbc} K/μL triggers ${reflexTests.length} reflex test(s)`
        : `WBC ${wbc} K/μL - no reflex tests required`,
      reflexTests,
      requiresApproval: wbc > 50 || wbc < 2.5,
    };
  }

  /**
   * Check if platelet result triggers reflex tests
   * Reflex patterns:
   * - Critical low (<20 K/μL): Blood smear, Clotting studies
   * - Moderate low (20-50 K/μL): Blood smear
   * - Pseudothrombocytopenia (<50 K/μL with clumping): EDTA-free tube
   */
  static checkPlateletReflex(platelets: number): ReflexTestTrigger {
    let triggered = false;
    const reflexTests: ReflexTestDefinition[] = [];

    if (platelets < 20) {
      triggered = true;
      reflexTests.push({
        testId: 'PBS',
        testName: 'Peripheral Blood Smear',
        priority: 1,
        reason: 'Critical thrombocytopenia - assess morphology and platelet clumping',
        estimatedTurnaroundTime: '2 hours',
      });
      reflexTests.push({
        testId: 'COAG',
        testName: 'Coagulation Studies (PT, aPTT, INR)',
        priority: 1,
        reason: 'Assess for bleeding risk',
        estimatedTurnaroundTime: '2 hours',
      });
    } else if (platelets < 50) {
      triggered = true;
      reflexTests.push({
        testId: 'PBS',
        testName: 'Peripheral Blood Smear',
        priority: 1,
        reason: 'Thrombocytopenia - assess for pseudothrombocytopenia and morphology',
        estimatedTurnaroundTime: '2 hours',
      });
    } else if (platelets > 1000) {
      triggered = true;
      reflexTests.push({
        testId: 'PBS',
        testName: 'Peripheral Blood Smear',
        priority: 1,
        reason: 'Extreme thrombocytosis - rule out platelet aggregates',
        estimatedTurnaroundTime: '2 hours',
      });
    }

    return {
      triggered,
      parentTestId: 'PLT',
      parentTestValue: platelets,
      condition: platelets < 50 ? '<50 K/μL' : platelets > 1000 ? '>1000 K/μL' : 'normal',
      message: triggered
        ? `Platelets ${platelets} K/μL triggers ${reflexTests.length} reflex test(s)`
        : `Platelets ${platelets} K/μL - no reflex tests required`,
      reflexTests,
      requiresApproval: platelets < 20,
    };
  }

  /**
   * Check if glucose result triggers reflex tests
   * Reflex patterns:
   * - Very low (<50 mg/dL): Repeat, Investigation for accuracy
   * - Low (<70 mg/dL fasting): HbA1c, Fasting insulin (if appropriate)
   * - Very high (>500 mg/dL): Repeat, Ketones, Urinalysis
   */
  static checkGlucoseReflex(glucose: number, isFasting: boolean = false): ReflexTestTrigger {
    let triggered = false;
    const reflexTests: ReflexTestDefinition[] = [];

    if (glucose < 50) {
      triggered = true;
      reflexTests.push({
        testId: 'GLU_REPEAT',
        testName: 'Glucose - Repeat (Critical Low)',
        priority: 1,
        reason: 'Verify critical hypoglycemia',
        estimatedTurnaroundTime: '30 minutes',
      });
    } else if (glucose < 70 && isFasting) {
      triggered = true;
      reflexTests.push({
        testId: 'HBA1C',
        testName: 'Hemoglobin A1c',
        priority: 2,
        reason: 'Assess glycemic control with fasting hypoglycemia',
        estimatedTurnaroundTime: '4 hours',
      });
    } else if (glucose > 500) {
      triggered = true;
      reflexTests.push({
        testId: 'GLU_REPEAT',
        testName: 'Glucose - Repeat (Critical High)',
        priority: 1,
        reason: 'Verify critical hyperglycemia',
        estimatedTurnaroundTime: '30 minutes',
      });
      reflexTests.push({
        testId: 'KETONES',
        testName: 'Serum or Urine Ketones',
        priority: 1,
        reason: 'Rule out diabetic ketoacidosis',
        estimatedTurnaroundTime: '1 hour',
      });
      reflexTests.push({
        testId: 'UA',
        testName: 'Urinalysis with Ketones',
        priority: 2,
        reason: 'Assess for ketones and glycosuria',
        estimatedTurnaroundTime: '1 hour',
      });
    } else if (glucose > 300) {
      triggered = true;
      reflexTests.push({
        testId: 'HBA1C',
        testName: 'Hemoglobin A1c',
        priority: 2,
        reason: 'Assess chronic glycemic control with severe hyperglycemia',
        estimatedTurnaroundTime: '4 hours',
      });
    }

    return {
      triggered,
      parentTestId: 'GLU',
      parentTestValue: glucose,
      condition: glucose < 50 ? '<50 mg/dL' : glucose > 500 ? '>500 mg/dL' : 'normal',
      message: triggered
        ? `Glucose ${glucose} mg/dL triggers ${reflexTests.length} reflex test(s)`
        : `Glucose ${glucose} mg/dL - no reflex tests required`,
      reflexTests,
      requiresApproval: glucose < 50 || glucose > 500,
    };
  }

  /**
   * Check if creatinine result triggers reflex tests
   * Reflex patterns:
   * - High (>2 mg/dL or increase >50%): BUN, Electrolytes, eGFR
   * - Very high (>4 mg/dL): Repeat, Urine analysis, Renal ultrasound
   */
  static checkCreatinineReflex(
    creatinine: number,
    previousCreatinine?: number
  ): ReflexTestTrigger {
    let triggered = false;
    const reflexTests: ReflexTestDefinition[] = [];

    const percentChange = previousCreatinine
      ? ((creatinine - previousCreatinine) / previousCreatinine) * 100
      : 0;

    if (creatinine > 4) {
      triggered = true;
      reflexTests.push({
        testId: 'CR_REPEAT',
        testName: 'Creatinine - Repeat',
        priority: 1,
        reason: 'Verify critically elevated creatinine',
        estimatedTurnaroundTime: '1 hour',
      });
      reflexTests.push({
        testId: 'BUN',
        testName: 'Blood Urea Nitrogen',
        priority: 1,
        reason: 'Assess degree of renal dysfunction',
        estimatedTurnaroundTime: '2 hours',
      });
      reflexTests.push({
        testId: 'UA',
        testName: 'Urinalysis',
        priority: 1,
        reason: 'Assess renal function status',
        estimatedTurnaroundTime: '1 hour',
      });
    } else if (creatinine > 2 || (previousCreatinine && percentChange > 50)) {
      triggered = true;
      reflexTests.push({
        testId: 'BUN',
        testName: 'Blood Urea Nitrogen',
        priority: 1,
        reason: 'Evaluate renal function with elevated creatinine',
        estimatedTurnaroundTime: '2 hours',
      });
      reflexTests.push({
        testId: 'ELECTROLYTES',
        testName: 'Electrolytes (Na, K, Cl, CO2)',
        priority: 1,
        reason: 'Monitor for electrolyte abnormalities',
        estimatedTurnaroundTime: '2 hours',
      });
      reflexTests.push({
        testId: 'eGFR',
        testName: 'Estimated GFR (eGFR)',
        priority: 2,
        reason: 'Calculate renal function estimate',
        estimatedTurnaroundTime: '1 hour',
      });
    }

    return {
      triggered,
      parentTestId: 'CR',
      parentTestValue: creatinine,
      condition: creatinine > 2 ? '>2 mg/dL' : 'normal',
      message: triggered
        ? `Creatinine ${creatinine} mg/dL ${percentChange > 0 ? `(+${percentChange.toFixed(0)}%)` : ''} triggers ${reflexTests.length} reflex test(s)`
        : `Creatinine ${creatinine} mg/dL - no reflex tests required`,
      reflexTests,
      requiresApproval: creatinine > 4,
    };
  }

  /**
   * Check if troponin result triggers reflex tests
   * Reflex patterns:
   * - Elevated (>99th percentile): CK-MB, Myoglobin, BNP, ECG
   * - Critical elevation: Repeat in 3 hours, ECG comparison
   */
  static checkTroponinReflex(troponin: number, isHighSensitivity: boolean = false): ReflexTestTrigger {
    let triggered = false;
    const reflexTests: ReflexTestDefinition[] = [];
    const threshold99 = isHighSensitivity ? 0.04 : 0.04; // Varies by assay

    if (troponin > threshold99 * 10) {
      triggered = true;
      reflexTests.push({
        testId: 'TROP_REPEAT',
        testName: 'Troponin - Repeat (3 hours)',
        priority: 1,
        reason: 'Assess troponin trajectory for acute myocardial infarction',
        estimatedTurnaroundTime: '3 hours',
      });
      reflexTests.push({
        testId: 'CK_MB',
        testName: 'CK-MB (Creatine Kinase-MB)',
        priority: 1,
        reason: 'Cardiac-specific isoenzyme for AMI confirmation',
        estimatedTurnaroundTime: '2 hours',
      });
      reflexTests.push({
        testId: 'BNP',
        testName: 'B-type Natriuretic Peptide (BNP)',
        priority: 2,
        reason: 'Assess for heart failure',
        estimatedTurnaroundTime: '4 hours',
      });
    } else if (troponin > threshold99) {
      triggered = true;
      reflexTests.push({
        testId: 'CK_MB',
        testName: 'CK-MB (Creatine Kinase-MB)',
        priority: 1,
        reason: 'Confirm myocardial injury with elevated troponin',
        estimatedTurnaroundTime: '2 hours',
      });
    }

    return {
      triggered,
      parentTestId: 'TROP',
      parentTestValue: troponin,
      condition: troponin > threshold99 ? `>${threshold99} ng/mL` : 'normal',
      message: triggered
        ? `Troponin ${troponin} ng/mL triggers ${reflexTests.length} reflex test(s)`
        : `Troponin ${troponin} ng/mL - no reflex tests required`,
      reflexTests,
      requiresApproval: troponin > threshold99 * 10,
    };
  }

  /**
   * Check if CRP result triggers reflex tests
   * Reflex patterns:
   * - Markedly elevated (>10 mg/L): ESR, CBC with differential, Blood cultures if febrile
   */
  static checkCRPReflex(crp: number, hasInfectionSigns: boolean = false): ReflexTestTrigger {
    let triggered = false;
    const reflexTests: ReflexTestDefinition[] = [];

    if (crp > 10) {
      triggered = true;
      reflexTests.push({
        testId: 'ESR',
        testName: 'Erythrocyte Sedimentation Rate (ESR)',
        priority: 2,
        reason: 'Additional acute phase reactant for inflammation assessment',
        estimatedTurnaroundTime: '2 hours',
      });
      reflexTests.push({
        testId: 'CBC',
        testName: 'Complete Blood Count with Differential',
        priority: 1,
        reason: 'Assess for infection or immune response',
        estimatedTurnaroundTime: '2 hours',
      });

      if (hasInfectionSigns) {
        reflexTests.push({
          testId: 'BCULTURE',
          testName: 'Blood Cultures',
          priority: 1,
          reason: 'Screen for bacteremia/sepsis',
          estimatedTurnaroundTime: '24-48 hours',
        });
      }
    }

    return {
      triggered,
      parentTestId: 'CRP',
      parentTestValue: crp,
      condition: crp > 10 ? '>10 mg/L' : 'normal',
      message: triggered
        ? `CRP ${crp} mg/L triggers ${reflexTests.length} reflex test(s)`
        : `CRP ${crp} mg/L - no reflex tests required`,
      reflexTests,
      requiresApproval: false,
    };
  }

  /**
   * Format reflex testing trigger for display
   */
  static formatReflexTrigger(trigger: ReflexTestTrigger): string {
    let report = '\n';
    report += `REFLEX TESTING ANALYSIS\n`;
    report += `═══════════════════════════\n`;
    report += `Parent Test: ${trigger.parentTestId}\n`;
    report += `Result: ${trigger.parentTestValue}\n`;
    report += `Triggered: ${trigger.triggered ? 'YES ✓' : 'NO'}\n`;

    if (trigger.triggered) {
      report += `\nReflex Tests (${trigger.reflexTests.length}):\n`;
      report += `─────────────────────────────\n`;

      trigger.reflexTests.forEach((test, idx) => {
        report += `${idx + 1}. ${test.testName} (${test.testId})\n`;
        report += `   Priority: P${test.priority}\n`;
        report += `   Reason: ${test.reason}\n`;
        if (test.estimatedTurnaroundTime) {
          report += `   ETA: ${test.estimatedTurnaroundTime}\n`;
        }
      });

      if (trigger.requiresApproval) {
        report += `\n⚠️  REQUIRES APPROVAL - Clinical review needed\n`;
      }
    }

    return report;
  }
}

export default ReflexTestingEngine;
