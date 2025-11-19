/**
 * CriticalValueEngine - Service for panic value detection and notification
 * Detects critical laboratory values and triggers urgent notification workflows
 * 
 * Week 2 Phase 1 - RobotCom LIMS Automation Project
 * Author: David Navas
 */

export interface CriticalValueThreshold {
  testId: string;
  testName: string;
  unit: string;
  criticalLow?: number;
  criticalHigh?: number;
  criticalValues?: string[]; // For categorical results (e.g., "POSITIVE", "REACTIVE")
  notificationPriority: 'STAT' | 'URGENT' | 'ROUTINE';
  requiresPhoneCall: boolean;
  requiresFollowupTest?: boolean;
}

export interface CriticalValueAlert {
  detected: boolean;
  testId: string;
  testName: string;
  value: number | string;
  unit: string;
  thresholdExceeded: 'CRITICAL_LOW' | 'CRITICAL_HIGH' | 'CRITICAL_VALUE';
  severity: 'CRITICAL';
  timestamp: Date;
  patientName?: string;
  patientID?: string;
  sampleNumber?: string;
  message: string;
  recommendation: string;
  notificationActions: NotificationAction[];
}

export interface NotificationAction {
  actionType: 'EMAIL' | 'SMS' | 'PHONE_CALL' | 'PAGE' | 'PRINT_ALERT';
  recipient: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';
  timestamp?: Date;
  retryCount?: number;
}

/**
 * CriticalValueEngine detects and manages panic/critical value alerts
 * Implements notification workflows and escalation procedures
 */
export class CriticalValueEngine {
  /**
   * Define critical value thresholds for common tests
   * Based on Clinical and Laboratory Standards Institute (CLSI) guidelines
   */
  private static readonly CRITICAL_VALUE_THRESHOLDS: CriticalValueThreshold[] = [
    // Hematology
    {
      testId: 'HGB',
      testName: 'Hemoglobin',
      unit: 'g/dL',
      criticalLow: 7.0,
      criticalHigh: 20.0,
      notificationPriority: 'STAT',
      requiresPhoneCall: true,
    },
    {
      testId: 'HCT',
      testName: 'Hematocrit',
      unit: '%',
      criticalLow: 20,
      criticalHigh: 60,
      notificationPriority: 'STAT',
      requiresPhoneCall: true,
    },
    {
      testId: 'PLT',
      testName: 'Platelets',
      unit: 'K/μL',
      criticalLow: 20,
      criticalHigh: 1000,
      notificationPriority: 'URGENT',
      requiresPhoneCall: true,
    },
    {
      testId: 'WBC',
      testName: 'White Blood Cells',
      unit: 'K/μL',
      criticalLow: 2.5,
      criticalHigh: 50,
      notificationPriority: 'STAT',
      requiresPhoneCall: true,
    },
    {
      testId: 'INR',
      testName: 'INR',
      unit: 'ratio',
      criticalLow: 0.5,
      criticalHigh: 4.0,
      notificationPriority: 'URGENT',
      requiresPhoneCall: true,
    },

    // Chemistry
    {
      testId: 'GLU',
      testName: 'Glucose',
      unit: 'mg/dL',
      criticalLow: 40,
      criticalHigh: 500,
      notificationPriority: 'STAT',
      requiresPhoneCall: true,
      requiresFollowupTest: true,
    },
    {
      testId: 'K',
      testName: 'Potassium',
      unit: 'mEq/L',
      criticalLow: 2.5,
      criticalHigh: 6.5,
      notificationPriority: 'STAT',
      requiresPhoneCall: true,
    },
    {
      testId: 'NA',
      testName: 'Sodium',
      unit: 'mEq/L',
      criticalLow: 120,
      criticalHigh: 160,
      notificationPriority: 'URGENT',
      requiresPhoneCall: true,
    },
    {
      testId: 'CA',
      testName: 'Calcium (Total)',
      unit: 'mg/dL',
      criticalLow: 6.5,
      criticalHigh: 13.0,
      notificationPriority: 'URGENT',
      requiresPhoneCall: true,
    },
    {
      testId: 'CR',
      testName: 'Creatinine',
      unit: 'mg/dL',
      criticalHigh: 4.0,
      notificationPriority: 'URGENT',
      requiresPhoneCall: false,
    },
    {
      testId: 'BUN',
      testName: 'Blood Urea Nitrogen',
      unit: 'mg/dL',
      criticalHigh: 100,
      notificationPriority: 'URGENT',
      requiresPhoneCall: false,
    },

    // Cardiac Markers
    {
      testId: 'TROP',
      testName: 'Troponin I',
      unit: 'ng/mL',
      criticalHigh: 0.5, // Varies by assay
      notificationPriority: 'STAT',
      requiresPhoneCall: true,
      requiresFollowupTest: true,
    },

    // Immunology
    {
      testId: 'HIV',
      testName: 'HIV Antibody',
      unit: 'result',
      criticalValues: ['POSITIVE', 'REACTIVE'],
      notificationPriority: 'URGENT',
      requiresPhoneCall: true,
    },
    {
      testId: 'HEPATITIS_B',
      testName: 'Hepatitis B Surface Antigen',
      unit: 'result',
      criticalValues: ['POSITIVE', 'REACTIVE'],
      notificationPriority: 'URGENT',
      requiresPhoneCall: false, // Often reported routinely
    },
    {
      testId: 'HEPATITIS_C',
      testName: 'Hepatitis C Antibody',
      unit: 'result',
      criticalValues: ['POSITIVE', 'REACTIVE'],
      notificationPriority: 'URGENT',
      requiresPhoneCall: false,
    },
  ];

  /**
   * Check if a test result is a critical value
   */
  static isCriticalValue(
    testId: string,
    value: number | string
  ): { isCritical: boolean; threshold?: CriticalValueThreshold } {
    const threshold = this.CRITICAL_VALUE_THRESHOLDS.find((t) => t.testId === testId);

    if (!threshold) {
      return { isCritical: false };
    }

    // Check categorical values
    if (threshold.criticalValues) {
      const isCritical = threshold.criticalValues.includes(String(value).toUpperCase());
      return { isCritical, threshold };
    }

    // Check numeric values
    if (typeof value === 'number') {
      if (threshold.criticalLow !== undefined && value < threshold.criticalLow) {
        return { isCritical: true, threshold };
      }
      if (threshold.criticalHigh !== undefined && value > threshold.criticalHigh) {
        return { isCritical: true, threshold };
      }
    }

    return { isCritical: false, threshold };
  }

  /**
   * Generate critical value alert
   */
  static generateCriticalValueAlert(
    testId: string,
    testName: string,
    value: number | string,
    unit: string,
    patientName?: string,
    patientID?: string,
    sampleNumber?: string
  ): CriticalValueAlert | null {
    const { isCritical, threshold } = this.isCriticalValue(testId, value);

    if (!isCritical || !threshold) {
      return null;
    }

    let thresholdExceeded: 'CRITICAL_LOW' | 'CRITICAL_HIGH' | 'CRITICAL_VALUE';
    let message = '';
    let recommendation = '';

    if (threshold.criticalValues) {
      thresholdExceeded = 'CRITICAL_VALUE';
      message = `CRITICAL VALUE ALERT: ${testName} = ${value} (CRITICAL)`;
      recommendation = `Immediate physician notification required. Confirm result and provide counseling per institutional policy.`;
    } else if (typeof value === 'number') {
      if (threshold.criticalLow !== undefined && value < threshold.criticalLow) {
        thresholdExceeded = 'CRITICAL_LOW';
        message = `CRITICAL LOW ALERT: ${testName} = ${value} ${unit} (Critical Low: <${threshold.criticalLow} ${unit})`;
        recommendation = this.generateCriticalLowRecommendation(testId);
      } else {
        thresholdExceeded = 'CRITICAL_HIGH';
        message = `CRITICAL HIGH ALERT: ${testName} = ${value} ${unit} (Critical High: >${threshold.criticalHigh} ${unit})`;
        recommendation = this.generateCriticalHighRecommendation(testId);
      }
    } else {
      return null;
    }

    const notificationActions: NotificationAction[] = [];

    // Determine notification actions based on threshold
    if (threshold.requiresPhoneCall) {
      notificationActions.push({
        actionType: 'PHONE_CALL',
        recipient: 'PHYSICIAN_ON_CALL',
        status: 'PENDING',
      });
    }

    // Always send email notification
    notificationActions.push({
      actionType: 'EMAIL',
      recipient: 'LAB_DIRECTOR',
      status: 'PENDING',
    });

    // Print alert
    notificationActions.push({
      actionType: 'PRINT_ALERT',
      recipient: 'LAB_PRINTER',
      status: 'PENDING',
    });

    // Page if STAT priority
    if (threshold.notificationPriority === 'STAT') {
      notificationActions.push({
        actionType: 'PAGE',
        recipient: 'LAB_SUPERVISOR',
        status: 'PENDING',
      });
    }

    return {
      detected: true,
      testId,
      testName,
      value,
      unit,
      thresholdExceeded,
      severity: 'CRITICAL',
      timestamp: new Date(),
      patientName,
      patientID,
      sampleNumber,
      message,
      recommendation,
      notificationActions,
    };
  }

  /**
   * Generate recommendation for critical low value
   */
  private static generateCriticalLowRecommendation(testId: string): string {
    const recommendations: { [key: string]: string } = {
      HGB: 'Severe anemia. Check for bleeding, hemolysis. Consider transfusion. Obtain reticulocyte count.',
      HCT: 'Severe anemia. Verify with hemoglobin. Assess for ongoing blood loss.',
      PLT: 'Thrombocytopenia - bleeding risk. Check for HIT, DIC, ITP. Obtain blood smear.',
      WBC: 'Leukopenia - infection risk. Check for bone marrow suppression. Obtain differential.',
      K: 'Severe hypokalemia - cardiac arrhythmia risk. IV replacement needed. Obtain ECG.',
      GLU: 'Severe hypoglycemia - neurologic risk. Administer glucose immediately.',
      CA: 'Severe hypocalcemia - tetany/seizure risk. Check albumin and pH. IV calcium if symptomatic.',
      INR: 'Severe anticoagulation reversal. Assess bleeding risk. Check PT/aPTT.',
    };

    return recommendations[testId] || 'Immediate physician notification and intervention required.';
  }

  /**
   * Generate recommendation for critical high value
   */
  private static generateCriticalHighRecommendation(testId: string): string {
    const recommendations: { [key: string]: string } = {
      HGB: 'Severe polycythemia. Check volume status, oxygen saturation. Risk of thrombosis.',
      HCT: 'Severe polycythemia. Assess for dehydration or primary polycythemia.',
      PLT: 'Extreme thrombocytosis. Risk of thrombotic/hemorrhagic complications. Check for clumping.',
      WBC: 'Severe leukocytosis. Assess for infection, leukemia, or other malignancy. Obtain differential.',
      K: 'Severe hyperkalemia - cardiac arrhythmia risk. Obtain ECG. IV therapy indicated.',
      GLU: 'Severe hyperglycemia. Rule out DKA/HHS. Check ketones, pH, electrolytes.',
      NA: 'Severe hypernatremia. Assess fluid balance. Gradual correction required.',
      CA: 'Severe hypercalcemia - renal/cardiac risk. Check albumin, PTH. Hydration indicated.',
      CR: 'Severe renal dysfunction. Assess for acute kidney injury. Check electrolytes, BUN.',
      BUN: 'Severe elevation. Assess kidney function. Check creatinine ratio.',
      TROP: 'Acute myocardial infarction suspected. Cardiology consult indicated. Serial troponins required.',
    };

    return recommendations[testId] || 'Immediate physician notification and intervention required.';
  }

  /**
   * Check for panic value patterns
   * Multiple critical values may indicate systemic issue
   */
  static checkForPanicPattern(alerts: CriticalValueAlert[]): string[] {
    const recommendations: string[] = [];

    if (alerts.length > 3) {
      recommendations.push('Multiple critical values detected - assess for specimen quality or instrument malfunction');
    }

    const categories = new Set(alerts.map((a) => a.testId.substring(0, 3)));
    if (categories.has('HGB') && categories.has('PLT') && categories.has('WBC')) {
      recommendations.push('Multi-lineage hematology abnormalities - suspect DIC, TTP, or bone marrow disorder');
    }

    if (categories.has('K') && categories.has('CR')) {
      recommendations.push('Potassium + Creatinine abnormalities - assess renal function urgently');
    }

    if (categories.has('GLU') && categories.has('K')) {
      recommendations.push('Glucose + Potassium abnormalities - may indicate DKA or HHS');
    }

    return recommendations;
  }

  /**
   * Format critical value alert for notification
   */
  static formatAlertNotification(alert: CriticalValueAlert): string {
    let notification = '\n';
    notification += `╔═══════════════════════════════════════╗\n`;
    notification += `║ CRITICAL VALUE ALERT - IMMEDIATE ACTION REQUIRED\n`;
    notification += `╚═══════════════════════════════════════╝\n\n`;
    notification += `Patient: ${alert.patientName || 'UNKNOWN'}\n`;
    notification += `Patient ID: ${alert.patientID || 'UNKNOWN'}\n`;
    notification += `Sample: ${alert.sampleNumber || 'UNKNOWN'}\n`;
    notification += `Time: ${alert.timestamp.toLocaleString()}\n\n`;
    notification += `TEST RESULT:\n`;
    notification += `${alert.testName} (${alert.testId}): ${alert.value} ${alert.unit}\n`;
    notification += `SEVERITY: ${alert.severity}\n`;
    notification += `MESSAGE: ${alert.message}\n\n`;
    notification += `RECOMMENDATION:\n`;
    notification += `${alert.recommendation}\n\n`;
    notification += `REQUIRED ACTIONS:\n`;
    alert.notificationActions
      .filter((a) => a.status === 'PENDING')
      .forEach((action) => {
        notification += `☐ ${action.actionType}: ${action.recipient}\n`;
      });

    return notification;
  }

  /**
   * Log critical value for regulatory compliance
   * Required for CAP, CLIA audits
   */
  static generateComplianceLog(alert: CriticalValueAlert): string {
    const log = `[${alert.timestamp.toISOString()}] CRITICAL VALUE: Patient=${alert.patientID || 'UNKNOWN'} Test=${alert.testId} Value=${alert.value} ${alert.unit}`;
    return log;
  }

  /**
   * Get threshold for a test
   */
  static getThreshold(testId: string): CriticalValueThreshold | undefined {
    return this.CRITICAL_VALUE_THRESHOLDS.find((t) => t.testId === testId);
  }

  /**
   * Add custom threshold
   */
  static addCustomThreshold(threshold: CriticalValueThreshold): void {
    // Remove existing if present
    const index = this.CRITICAL_VALUE_THRESHOLDS.findIndex((t) => t.testId === threshold.testId);
    if (index >= 0) {
      this.CRITICAL_VALUE_THRESHOLDS[index] = threshold;
    } else {
      this.CRITICAL_VALUE_THRESHOLDS.push(threshold);
    }
  }
}

export default CriticalValueEngine;
