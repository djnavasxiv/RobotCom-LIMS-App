/**
 * CalculationEngine - Service for computing derived lab values
 * Calculates secondary values from primary lab results using clinical formulas
 * 
 * Week 2 Phase 1 - RobotCom LIMS Automation Project
 * Author: David Navas
 */

export interface CalculationInput {
  [key: string]: number | undefined;
}

export interface CalculationResult {
  name: string;
  value: number;
  unit: string;
  formula: string;
  isValid: boolean;
  errorMessage?: string;
}

/**
 * CalculationEngine provides clinical calculation methods for derived lab values
 * Supports hematology, chemistry, and renal function calculations
 */
export class CalculationEngine {
  /**
   * Calculate Hematocrit from Hemoglobin (Hb)
   * Formula: Hct = Hb × 3 (approximate)
   * More accurate: Hct = Hb × 2.8 to Hb × 3.2
   */
  static calculateHematocritFromHb(hemoglobin: number): CalculationResult {
    if (hemoglobin < 0 || hemoglobin > 20) {
      return {
        name: 'Hematocrit (calculated)',
        value: 0,
        unit: '%',
        formula: 'Hct = Hb × 3',
        isValid: false,
        errorMessage: `Invalid hemoglobin value: ${hemoglobin} g/dL`,
      };
    }

    const hematocrit = hemoglobin * 3;
    return {
      name: 'Hematocrit (calculated)',
      value: Math.round(hematocrit * 10) / 10,
      unit: '%',
      formula: 'Hct = Hb × 3',
      isValid: true,
    };
  }

  /**
   * Calculate Hemoglobin from Hematocrit
   * Formula: Hb = Hct ÷ 3
   */
  static calculateHemoglobinFromHct(hematocrit: number): CalculationResult {
    if (hematocrit < 0 || hematocrit > 60) {
      return {
        name: 'Hemoglobin (calculated)',
        value: 0,
        unit: 'g/dL',
        formula: 'Hb = Hct ÷ 3',
        isValid: false,
        errorMessage: `Invalid hematocrit value: ${hematocrit}%`,
      };
    }

    const hemoglobin = hematocrit / 3;
    return {
      name: 'Hemoglobin (calculated)',
      value: Math.round(hemoglobin * 100) / 100,
      unit: 'g/dL',
      formula: 'Hb = Hct ÷ 3',
      isValid: true,
    };
  }

  /**
   * Calculate Mean Corpuscular Hemoglobin Concentration (MCHC)
   * Formula: MCHC = (Hemoglobin / Hematocrit) × 100
   * Normal: 32-36 g/dL
   */
  static calculateMCHC(hemoglobin: number, hematocrit: number): CalculationResult {
    if (hemoglobin <= 0 || hematocrit <= 0) {
      return {
        name: 'MCHC (Mean Corpuscular Hemoglobin Concentration)',
        value: 0,
        unit: 'g/dL',
        formula: 'MCHC = (Hb / Hct) × 100',
        isValid: false,
        errorMessage: 'Invalid hemoglobin or hematocrit value',
      };
    }

    const mchc = (hemoglobin / hematocrit) * 100;
    return {
      name: 'MCHC',
      value: Math.round(mchc * 10) / 10,
      unit: 'g/dL',
      formula: 'MCHC = (Hb / Hct) × 100',
      isValid: true,
    };
  }

  /**
   * Calculate Mean Corpuscular Volume (MCV)
   * Formula: MCV = (Hematocrit × 10) / RBC count
   * Normal: 80-100 fL
   */
  static calculateMCV(hematocrit: number, rbcCount: number): CalculationResult {
    if (hematocrit <= 0 || rbcCount <= 0) {
      return {
        name: 'MCV (Mean Corpuscular Volume)',
        value: 0,
        unit: 'fL',
        formula: 'MCV = (Hct × 10) / RBC',
        isValid: false,
        errorMessage: 'Invalid hematocrit or RBC count',
      };
    }

    const mcv = (hematocrit * 10) / rbcCount;
    return {
      name: 'MCV',
      value: Math.round(mcv * 10) / 10,
      unit: 'fL',
      formula: 'MCV = (Hct × 10) / RBC',
      isValid: true,
    };
  }

  /**
   * Calculate Hematocrit from MCV and RBC
   * Formula: Hct = (MCV × RBC) / 10
   */
  static calculateHctFromMCVandRBC(mcv: number, rbc: number): CalculationResult {
    if (mcv <= 0 || rbc <= 0) {
      return {
        name: 'Hematocrit (calculated)',
        value: 0,
        unit: '%',
        formula: 'Hct = (MCV × RBC) / 10',
        isValid: false,
        errorMessage: 'Invalid MCV or RBC value',
      };
    }

    const hct = (mcv * rbc) / 10;
    return {
      name: 'Hematocrit (calculated)',
      value: Math.round(hct * 10) / 10,
      unit: '%',
      formula: 'Hct = (MCV × RBC) / 10',
      isValid: true,
    };
  }

  /**
   * Calculate Corrected WBC (for nucleated RBCs)
   * Formula: Corrected WBC = (WBC × 100) / (100 + NRBC count)
   * Used when immature RBCs are present
   */
  static calculateCorrectedWBC(wbc: number, nrbcCount: number): CalculationResult {
    if (wbc < 0 || nrbcCount < 0) {
      return {
        name: 'Corrected WBC',
        value: 0,
        unit: 'K/μL',
        formula: 'Corrected WBC = (WBC × 100) / (100 + NRBC)',
        isValid: false,
        errorMessage: 'Invalid WBC or NRBC count',
      };
    }

    if (nrbcCount === 0) {
      return {
        name: 'Corrected WBC',
        value: wbc,
        unit: 'K/μL',
        formula: 'Corrected WBC = (WBC × 100) / (100 + NRBC)',
        isValid: true,
      };
    }

    const correctedWbc = (wbc * 100) / (100 + nrbcCount);
    return {
      name: 'Corrected WBC',
      value: Math.round(correctedWbc * 100) / 100,
      unit: 'K/μL',
      formula: 'Corrected WBC = (WBC × 100) / (100 + NRBC)',
      isValid: true,
    };
  }

  /**
   * Calculate eGFR (estimated Glomerular Filtration Rate) using MDRD equation
   * Formula: eGFR = 186 × (Cr)^-1.154 × (Age)^-0.203 × (0.742 if female) × (1.212 if African American)
   * Normal: >60 mL/min/1.73m²
   */
  static calculateEGFR_MDRD(
    creatinine: number, // mg/dL
    age: number, // years
    gender: 'M' | 'F',
    isAfricanAmerican: boolean = false
  ): CalculationResult {
    if (creatinine <= 0 || age <= 0) {
      return {
        name: 'eGFR (MDRD)',
        value: 0,
        unit: 'mL/min/1.73m²',
        formula: 'MDRD: 186 × Cr^-1.154 × Age^-0.203',
        isValid: false,
        errorMessage: 'Invalid creatinine or age value',
      };
    }

    let egfr = 186 * Math.pow(creatinine, -1.154) * Math.pow(age, -0.203);
    if (gender === 'F') egfr *= 0.742;
    if (isAfricanAmerican) egfr *= 1.212;

    return {
      name: 'eGFR (MDRD)',
      value: Math.round(egfr * 10) / 10,
      unit: 'mL/min/1.73m²',
      formula: 'MDRD: 186 × Cr^-1.154 × Age^-0.203',
      isValid: true,
    };
  }

  /**
   * Calculate eGFR using CKD-EPI equation (preferred, more accurate especially for higher GFR values)
   * Formula varies by gender and creatinine level
   * More accurate than MDRD for GFR > 60
   */
  static calculateEGFR_CKD_EPI(
    creatinine: number, // mg/dL
    age: number, // years
    gender: 'M' | 'F'
  ): CalculationResult {
    if (creatinine <= 0 || age <= 0) {
      return {
        name: 'eGFR (CKD-EPI)',
        value: 0,
        unit: 'mL/min/1.73m²',
        formula: 'CKD-EPI (gender-specific)',
        isValid: false,
        errorMessage: 'Invalid creatinine or age value',
      };
    }

    // CKD-EPI constants
    const kappa = gender === 'M' ? 0.9 : 0.7;
    const alpha = gender === 'M' ? -0.411 : -0.329;
    const sexMultiplier = gender === 'M' ? 1 : 1.018;
    const raceMultiplier = 1; // Set to 1.159 for African American

    let egfr = 141 * Math.pow(creatinine / kappa, alpha) * Math.pow(age / 40, -0.203) * sexMultiplier * raceMultiplier;

    return {
      name: 'eGFR (CKD-EPI)',
      value: Math.round(egfr * 10) / 10,
      unit: 'mL/min/1.73m²',
      formula: 'CKD-EPI: 141 × (Cr/κ)^α × (Age/40)^-0.203',
      isValid: true,
    };
  }

  /**
   * Calculate BUN/Creatinine Ratio
   * Formula: BUN / Creatinine
   * Normal ratio: 10:1 to 20:1
   * Elevated ratio suggests dehydration or prerenal azotemia
   */
  static calculateBUNCreatinineRatio(bun: number, creatinine: number): CalculationResult {
    if (creatinine <= 0 || bun < 0) {
      return {
        name: 'BUN/Creatinine Ratio',
        value: 0,
        unit: 'ratio',
        formula: 'BUN / Creatinine',
        isValid: false,
        errorMessage: 'Invalid BUN or creatinine value',
      };
    }

    const ratio = bun / creatinine;
    return {
      name: 'BUN/Creatinine Ratio',
      value: Math.round(ratio * 10) / 10,
      unit: 'ratio',
      formula: 'BUN / Creatinine',
      isValid: true,
    };
  }

  /**
   * Calculate Serum Osmolality (calculated)
   * Formula: 2 × [Na] + [Glucose]/18 + [BUN]/2.8
   * Normal: 280-295 mOsm/kg
   */
  static calculateSerumsOsmolality(
    sodium: number, // mEq/L
    glucose: number, // mg/dL
    bun: number // mg/dL
  ): CalculationResult {
    if (sodium <= 0 || glucose < 0 || bun < 0) {
      return {
        name: 'Serum Osmolality (calculated)',
        value: 0,
        unit: 'mOsm/kg',
        formula: '2 × [Na] + [Glucose]/18 + [BUN]/2.8',
        isValid: false,
        errorMessage: 'Invalid sodium, glucose, or BUN value',
      };
    }

    const osmolality = 2 * sodium + glucose / 18 + bun / 2.8;
    return {
      name: 'Serum Osmolality (calculated)',
      value: Math.round(osmolality * 10) / 10,
      unit: 'mOsm/kg',
      formula: '2 × [Na] + [Glucose]/18 + [BUN]/2.8',
      isValid: true,
    };
  }

  /**
   * Calculate Anion Gap (AG)
   * Formula: AG = Na - (Cl + HCO3)
   * Normal: 8-16 mEq/L
   * High AG suggests metabolic acidosis with organic acids
   */
  static calculateAnionGap(sodium: number, chloride: number, bicarbonate: number): CalculationResult {
    if (sodium < 0 || chloride < 0 || bicarbonate < 0) {
      return {
        name: 'Anion Gap',
        value: 0,
        unit: 'mEq/L',
        formula: 'AG = Na - (Cl + HCO3)',
        isValid: false,
        errorMessage: 'Invalid sodium, chloride, or bicarbonate value',
      };
    }

    const ag = sodium - (chloride + bicarbonate);
    return {
      name: 'Anion Gap',
      value: Math.round(ag * 10) / 10,
      unit: 'mEq/L',
      formula: 'AG = Na - (Cl + HCO3)',
      isValid: true,
    };
  }

  /**
   * Calculate Corrected Calcium (accounts for albumin levels)
   * Formula: Corrected Ca = Total Ca + 0.8 × (4.0 - Albumin)
   * Used when albumin is low (affects calcium binding)
   */
  static calculateCorrectedCalcium(totalCalcium: number, albumin: number): CalculationResult {
    if (totalCalcium < 0 || albumin < 0) {
      return {
        name: 'Corrected Calcium',
        value: 0,
        unit: 'mg/dL',
        formula: 'Corrected Ca = Total Ca + 0.8 × (4.0 - Albumin)',
        isValid: false,
        errorMessage: 'Invalid calcium or albumin value',
      };
    }

    const correctedCa = totalCalcium + 0.8 * (4.0 - albumin);
    return {
      name: 'Corrected Calcium',
      value: Math.round(correctedCa * 100) / 100,
      unit: 'mg/dL',
      formula: 'Corrected Ca = Total Ca + 0.8 × (4.0 - Albumin)',
      isValid: true,
    };
  }

  /**
   * Calculate BMI (Body Mass Index)
   * Formula: BMI = Weight (kg) / Height (m)²
   * Classification: <18.5 (underweight), 18.5-24.9 (normal), 25-29.9 (overweight), ≥30 (obese)
   */
  static calculateBMI(weightKg: number, heightM: number): CalculationResult {
    if (weightKg <= 0 || heightM <= 0) {
      return {
        name: 'BMI',
        value: 0,
        unit: 'kg/m²',
        formula: 'BMI = Weight (kg) / Height (m)²',
        isValid: false,
        errorMessage: 'Invalid weight or height value',
      };
    }

    const bmi = weightKg / (heightM * heightM);
    return {
      name: 'BMI',
      value: Math.round(bmi * 100) / 100,
      unit: 'kg/m²',
      formula: 'BMI = Weight (kg) / Height (m)²',
      isValid: true,
    };
  }

  /**
   * Calculate BSA (Body Surface Area) using Mosteller formula
   * Formula: BSA = √[(Height (cm) × Weight (kg)) / 3600]
   * Unit: m²
   */
  static calculateBSA(heightCm: number, weightKg: number): CalculationResult {
    if (heightCm <= 0 || weightKg <= 0) {
      return {
        name: 'BSA',
        value: 0,
        unit: 'm²',
        formula: 'BSA = √[(Height (cm) × Weight (kg)) / 3600]',
        isValid: false,
        errorMessage: 'Invalid height or weight value',
      };
    }

    const bsa = Math.sqrt((heightCm * weightKg) / 3600);
    return {
      name: 'BSA',
      value: Math.round(bsa * 100) / 100,
      unit: 'm²',
      formula: 'BSA = √[(Height (cm) × Weight (kg)) / 3600]',
      isValid: true,
    };
  }

  /**
   * Calculate Estimated Plasma Glucose from HbA1c
   * Formula: eAG = (46.7 × A1c) - 23.3
   * Unit: mg/dL
   */
  static calculateEstimatedPlasmaGlucose(hba1c: number): CalculationResult {
    if (hba1c < 4 || hba1c > 14) {
      return {
        name: 'Estimated Average Glucose (eAG)',
        value: 0,
        unit: 'mg/dL',
        formula: 'eAG = (46.7 × A1c) - 23.3',
        isValid: false,
        errorMessage: `Invalid HbA1c value: ${hba1c}%`,
      };
    }

    const eag = 46.7 * hba1c - 23.3;
    return {
      name: 'Estimated Average Glucose (eAG)',
      value: Math.round(eag),
      unit: 'mg/dL',
      formula: 'eAG = (46.7 × A1c) - 23.3',
      isValid: true,
    };
  }

  /**
   * Execute custom calculation with formula parsing
   * Supports simple mathematical expressions
   * Example: "hemoglobin * 10 / rbc"
   */
  static executeCustomCalculation(formula: string, inputs: CalculationInput): CalculationResult {
    try {
      // Sanitize formula - only allow alphanumeric, operators, and spaces
      const sanitized = formula.replace(/[^a-zA-Z0-9+\-*/().\/\s]/g, '');

      // Replace variable names with values
      let expression = sanitized;
      for (const [key, value] of Object.entries(inputs)) {
        if (value !== undefined) {
          expression = expression.replace(new RegExp(`\\b${key}\\b`, 'g'), `${value}`);
        }
      }

      // Safely evaluate expression
      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${expression})`)();

      if (typeof result !== 'number' || !isFinite(result)) {
        return {
          name: 'Custom Calculation',
          value: 0,
          unit: 'units',
          formula,
          isValid: false,
          errorMessage: 'Invalid calculation result',
        };
      }

      return {
        name: 'Custom Calculation',
        value: Math.round(result * 1000) / 1000,
        unit: 'units',
        formula,
        isValid: true,
      };
    } catch (error) {
      return {
        name: 'Custom Calculation',
        value: 0,
        unit: 'units',
        formula,
        isValid: false,
        errorMessage: `Formula evaluation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Format calculation result for display
   */
  static formatResult(result: CalculationResult): string {
    let report = '\n';
    report += `Calculation: ${result.name}\n`;
    report += `Formula: ${result.formula}\n`;
    if (result.isValid) {
      report += `Result: ${result.value} ${result.unit}\n`;
    } else {
      report += `Status: INVALID\n`;
      report += `Error: ${result.errorMessage}\n`;
    }
    return report;
  }
}

export default CalculationEngine;
