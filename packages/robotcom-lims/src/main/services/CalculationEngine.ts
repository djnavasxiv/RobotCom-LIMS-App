/**
 * CalculationEngine - Automated calculation service for clinical lab values
 * Implements all formulas for Hematology, Chemistry, Coagulation, Sperm, Immunology, and Urinalysis
 * 
 * Week 1 Phase 1 - RobotCom LIMS Automation Project
 */

export interface CalculationRule {
  id: string;
  testDefId: string;
  name: string;
  formula: string; // Mathematical expression with variable references
  unit?: string;
  normalMin?: number;
  normalMax?: number;
  isActive: boolean;
}

export interface RawValues {
  [fieldName: string]: number | string | undefined;
}

export interface CalculatedValues {
  [fieldName: string]: number | string;
}

export interface CalculationResult {
  success: boolean;
  values: CalculatedValues;
  errors: string[];
}

/**
 * CalculationEngine handles all automated calculations for clinical tests
 * Supports formulas with variable substitution and conditional logic
 */
export class CalculationEngine {
  /**
   * Calculate MCV (Mean Corpuscular Volume)
   * Formula: (Hematocrit × 10) / RBC
   * Unit: fL (femtoliters)
   */
  static calculateMCV(hematocrit: number, rbc: number): number {
    if (rbc === 0) throw new Error('RBC cannot be zero');
    return (hematocrit * 10) / rbc;
  }

  /**
   * Calculate MCH (Mean Corpuscular Hemoglobin)
   * Formula: (Hemoglobin × 10) / RBC
   * Unit: pg (picograms)
   */
  static calculateMCH(hemoglobin: number, rbc: number): number {
    if (rbc === 0) throw new Error('RBC cannot be zero');
    return (hemoglobin * 10) / rbc;
  }

  /**
   * Calculate MCHC (Mean Corpuscular Hemoglobin Concentration)
   * Formula: (Hemoglobin / Hematocrit) × 100
   * Unit: g/dL
   */
  static calculateMCHC(hemoglobin: number, hematocrit: number): number {
    if (hematocrit === 0) throw new Error('Hematocrit cannot be zero');
    return (hemoglobin / hematocrit) * 100;
  }

  /**
   * Calculate RDW (Red Cell Distribution Width)
   * Formula: (Standard Deviation / Mean RBC) × 100
   * Unit: %
   */
  static calculateRDW(stdDevRbc: number, meanRbc: number): number {
    if (meanRbc === 0) throw new Error('Mean RBC cannot be zero');
    return (stdDevRbc / meanRbc) * 100;
  }

  /**
   * Calculate LDL Cholesterol (Friedewald Formula)
   * Formula: Total Cholesterol - HDL - (Triglycerides / 5)
   * Valid when Triglycerides < 400 mg/dL
   * Unit: mg/dL
   */
  static calculateLDL(
    totalCholesterol: number,
    hdl: number,
    triglycerides: number
  ): number {
    if (triglycerides >= 400) {
      throw new Error(
        'Friedewald formula invalid for triglycerides >= 400 mg/dL'
      );
    }
    return totalCholesterol - hdl - triglycerides / 5;
  }

  /**
   * Calculate AST/ALT Ratio
   * Formula: AST / ALT
   * Used for liver disease assessment
   */
  static calculateASTALTRatio(ast: number, alt: number): number {
    if (alt === 0) throw new Error('ALT cannot be zero');
    return ast / alt;
  }

  /**
   * Calculate BUN/Creatinine Ratio
   * Formula: BUN / Creatinine
   * Helps assess kidney function
   */
  static calculateBUNCrRatio(bun: number, creatinine: number): number {
    if (creatinine === 0) throw new Error('Creatinine cannot be zero');
    return bun / creatinine;
  }

  /**
   * Calculate Anion Gap
   * Formula: Na - (Cl + HCO3)
   * Unit: mEq/L
   * Normal: 8-16 mEq/L
   */
  static calculateAnionGap(
    sodium: number,
    chloride: number,
    bicarbonate: number
  ): number {
    return sodium - (chloride + bicarbonate);
  }

  /**
   * Calculate eGFR (Estimated Glomerular Filtration Rate) - MDRD Formula
   * MDRD: GFR = 186 × (Creatinine)^-1.154 × (Age)^-0.203 × (0.742 if female) × (1.212 if African American)
   * Unit: mL/min/1.73m²
   */
  static calculateEGFR(
    creatinine: number,
    age: number,
    isFemale: boolean,
    isAfricanAmerican: boolean = false
  ): number {
    let gfr = 186 * Math.pow(creatinine, -1.154) * Math.pow(age, -0.203);
    if (isFemale) gfr *= 0.742;
    if (isAfricanAmerican) gfr *= 1.212;
    return gfr;
  }

  /**
   * Calculate Corrected Calcium
   * Formula: Measured Ca + 0.8 × (4 - Albumin)
   * When albumin is low, total calcium appears low
   * Unit: mg/dL
   */
  static calculateCorrectedCalcium(
    measuredCalcium: number,
    albumin: number
  ): number {
    return measuredCalcium + 0.8 * (4 - albumin);
  }

  /**
   * Calculate INR (International Normalized Ratio)
   * Formula: (PT patient / PT control) ^ ISI
   * ISI varies by reagent/lab (typically 0.8-1.2)
   */
  static calculateINR(ptPatient: number, ptControl: number, isi: number): number {
    if (ptControl === 0) throw new Error('PT control cannot be zero');
    return Math.pow(ptPatient / ptControl, isi);
  }

  /**
   * Calculate PT Ratio
   * Formula: PT patient / PT control
   */
  static calculatePTRatio(ptPatient: number, ptControl: number): number {
    if (ptControl === 0) throw new Error('PT control cannot be zero');
    return ptPatient / ptControl;
  }

  /**
   * Calculate APTT Ratio
   * Formula: APTT patient / APTT control
   */
  static calculateAPTTRatio(apttPatient: number, apttControl: number): number {
    if (apttControl === 0) throw new Error('APTT control cannot be zero');
    return apttPatient / apttControl;
  }

  /**
   * Calculate Total Sperm Count
   * Formula: Concentration × Volume
   * Unit: million/ejaculate
   */
  static calculateTotalSpermCount(
    concentration: number,
    volume: number
  ): number {
    return concentration * volume;
  }

  /**
   * Classify Sperm Analysis per WHO 2021 criteria
   * Returns classification based on count
   */
  static classifySpermCount(totalCount: number): string {
    if (totalCount >= 39) return 'NORMAL';
    if (totalCount >= 20) return 'OLIGOZOOSPERMIA_MILD';
    if (totalCount >= 10) return 'OLIGOZOOSPERMIA_MODERATE';
    if (totalCount > 0) return 'OLIGOZOOSPERMIA_SEVERE';
    return 'AZOOSPERMIA';
  }

  /**
   * Calculate Antibody Titer
   * Returns the reciprocal of the last positive dilution
   */
  static calculateAntibodyTiter(lastPositiveDilution: number): number {
    if (lastPositiveDilution === 0) return 0;
    return 1 / lastPositiveDilution;
  }

  /**
   * Calculate Risk Score for Immunology tests
   * Weighted formula: (Value × Weight) / Sum of Weights
   */
  static calculateRiskScore(
    values: number[],
    weights: number[]
  ): number {
    if (values.length !== weights.length) {
      throw new Error('Values and weights arrays must have same length');
    }
    const weightedSum = values.reduce((sum, val, idx) => sum + val * weights[idx], 0);
    const weightSum = weights.reduce((sum, w) => sum + w, 0);
    return weightSum === 0 ? 0 : weightedSum / weightSum;
  }

  /**
   * Calculate per-field average for Urinalysis
   * Formula: Sum / Number of fields
   */
  static calculateUrinalysisAverage(fieldCounts: number[]): number {
    if (fieldCounts.length === 0) return 0;
    const sum = fieldCounts.reduce((a, b) => a + b, 0);
    return sum / fieldCounts.length;
  }

  /**
   * Evaluate a custom formula with variable substitution
   * Supports expressions like: "hematocrit * 10 / rbc"
   */
  static evaluateFormula(formula: string, variables: RawValues): number {
    try {
      // Create safe evaluation context
      let expression = formula;

      // Replace variable references with their values
      for (const [key, value] of Object.entries(variables)) {
        if (value === undefined) {
          throw new Error(`Missing value for variable: ${key}`);
        }
        // Replace variable names with their values, handling word boundaries
        const regex = new RegExp(`\\b${key}\\b`, 'g');
        expression = expression.replace(regex, String(value));
      }

      // Validate expression only contains allowed characters
      if (!/^[\d+\-*/(). ]+$/.test(expression)) {
        throw new Error('Formula contains invalid characters');
      }

      // Evaluate the expression safely
      // eslint-disable-next-line no-eval
      const result = Function('"use strict"; return (' + expression + ')')();

      if (typeof result !== 'number' || isNaN(result)) {
        throw new Error('Formula evaluation resulted in non-numeric value');
      }

      return result;
    } catch (error) {
      throw new Error(`Formula evaluation error: ${(error as Error).message}`);
    }
  }

  /**
   * Process raw test values and calculate derived values
   * Returns all calculated values or errors
   */
  static processTestValues(
    testCategory: string,
    rawValues: RawValues
  ): CalculationResult {
    const errors: string[] = [];
    const calculatedValues: CalculatedValues = {};

    try {
      switch (testCategory.toLowerCase()) {
        case 'hematology':
          calculatedValues.mCV = this.calculateMCV(
            Number(rawValues.hematocrit),
            Number(rawValues.rbc)
          );
          calculatedValues.mCH = this.calculateMCH(
            Number(rawValues.hemoglobin),
            Number(rawValues.rbc)
          );
          calculatedValues.mCHC = this.calculateMCHC(
            Number(rawValues.hemoglobin),
            Number(rawValues.hematocrit)
          );
          if (rawValues.stdDevRbc !== undefined) {
            calculatedValues.rdW = this.calculateRDW(
              Number(rawValues.stdDevRbc),
              Number(rawValues.rbc)
            );
          }
          break;

        case 'chemistry':
          if (
            rawValues.totalCholesterol &&
            rawValues.hdl &&
            rawValues.triglycerides
          ) {
            calculatedValues.ldL = this.calculateLDL(
              Number(rawValues.totalCholesterol),
              Number(rawValues.hdl),
              Number(rawValues.triglycerides)
            );
          }
          if (rawValues.ast && rawValues.alt) {
            calculatedValues.astAltRatio = this.calculateASTALTRatio(
              Number(rawValues.ast),
              Number(rawValues.alt)
            );
          }
          if (rawValues.bun && rawValues.creatinine) {
            calculatedValues.bunCrRatio = this.calculateBUNCrRatio(
              Number(rawValues.bun),
              Number(rawValues.creatinine)
            );
          }
          if (
            rawValues.sodium &&
            rawValues.chloride &&
            rawValues.bicarbonate
          ) {
            calculatedValues.anionGap = this.calculateAnionGap(
              Number(rawValues.sodium),
              Number(rawValues.chloride),
              Number(rawValues.bicarbonate)
            );
          }
          if (rawValues.albumin) {
            calculatedValues.correctedCalcium = this.calculateCorrectedCalcium(
              Number(rawValues.measuredCalcium),
              Number(rawValues.albumin)
            );
          }
          break;

        case 'coagulation':
          if (rawValues.ptPatient && rawValues.ptControl) {
            calculatedValues.ptRatio = this.calculatePTRatio(
              Number(rawValues.ptPatient),
              Number(rawValues.ptControl)
            );
            if (rawValues.isi) {
              calculatedValues.inr = this.calculateINR(
                Number(rawValues.ptPatient),
                Number(rawValues.ptControl),
                Number(rawValues.isi)
              );
            }
          }
          if (rawValues.apttPatient && rawValues.apttControl) {
            calculatedValues.apttRatio = this.calculateAPTTRatio(
              Number(rawValues.apttPatient),
              Number(rawValues.apttControl)
            );
          }
          break;

        case 'sperm':
          if (rawValues.concentration && rawValues.volume) {
            const totalCount = this.calculateTotalSpermCount(
              Number(rawValues.concentration),
              Number(rawValues.volume)
            );
            calculatedValues.totalSpermCount = totalCount;
            calculatedValues.whoClassification = this.classifySpermCount(
              totalCount
            );
          }
          break;

        case 'immunology':
          if (rawValues.lastPositiveDilution) {
            calculatedValues.antibodyTiter = this.calculateAntibodyTiter(
              Number(rawValues.lastPositiveDilution)
            );
          }
          break;

        case 'urinalysis':
          if (rawValues.fieldCounts) {
            const counts = Array.isArray(rawValues.fieldCounts)
              ? (rawValues.fieldCounts as number[])
              : [Number(rawValues.fieldCounts)];
            calculatedValues.averagePerField = this.calculateUrinalysisAverage(
              counts
            );
          }
          break;

        default:
          errors.push(`Unknown test category: ${testCategory}`);
      }
    } catch (error) {
      errors.push(`Calculation error: ${(error as Error).message}`);
    }

    return {
      success: errors.length === 0,
      values: calculatedValues,
      errors,
    };
  }
}

export default CalculationEngine;
