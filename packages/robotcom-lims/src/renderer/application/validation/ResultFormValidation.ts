/**
 * ResultFormValidation.ts - Form validation utilities
 * 
 * Provides validation utilities for result entry form with:
 * - Field-level validation
 * - Error messaging
 * - Value calculations
 * 
 * Author: David Navas
 * Date: November 19, 2025
 */

/**
 * Result Entry Form Data Type
 */
export interface ResultEntryFormData {
  patientId: string;
  sampleId: string;
  testId: string;
  value: number;
  unit: string;
  status: 'NORMAL' | 'LOW' | 'HIGH' | 'CRITICAL';
  notes?: string;
  interpretation?: string;
  referenceMin?: number;
  referenceMax?: number;
  qcFlag?: boolean;
  reviewedBy?: string;
  reviewedAt?: Date;
}

/**
 * Validation error result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate patient ID
 */
export function validatePatientId(patientId: string): string | null {
  if (!patientId || patientId.trim() === '') {
    return 'Patient is required';
  }
  return null;
}

/**
 * Validate sample ID
 */
export function validateSampleId(sampleId: string): string | null {
  if (!sampleId || sampleId.trim() === '') {
    return 'Sample is required';
  }
  return null;
}

/**
 * Validate test ID
 */
export function validateTestId(testId: string): string | null {
  if (!testId || testId.trim() === '') {
    return 'Test is required';
  }
  return null;
}

/**
 * Validate result value
 */
export function validateValue(value: unknown): string | null {
  if (typeof value !== 'number') {
    return 'Value must be a number';
  }
  if (value < 0) {
    return 'Value must be positive';
  }
  if (!isFinite(value)) {
    return 'Value must be a valid number';
  }
  return null;
}

/**
 * Validate unit
 */
export function validateUnit(unit: string): string | null {
  if (!unit || unit.trim() === '') {
    return 'Unit is required';
  }
  if (unit.length > 50) {
    return 'Unit is too long';
  }
  return null;
}

/**
 * Validate status
 */
export function validateStatus(status: string): string | null {
  const validStatuses = ['NORMAL', 'LOW', 'HIGH', 'CRITICAL'];
  if (!validStatuses.includes(status)) {
    return `Status must be one of: ${validStatuses.join(', ')}`;
  }
  return null;
}

/**
 * Validate notes
 */
export function validateNotes(notes: string | undefined): string | null {
  if (notes && notes.length > 500) {
    return 'Notes must be less than 500 characters';
  }
  return null;
}

/**
 * Validate interpretation
 */
export function validateInterpretation(interpretation: string | undefined): string | null {
  if (interpretation && interpretation.length > 300) {
    return 'Interpretation must be less than 300 characters';
  }
  return null;
}

/**
 * Validate complete result form data
 */
export function validateResultForm(data: Partial<ResultEntryFormData>): ValidationResult {
  const errors: Record<string, string> = {};

  const patientError = validatePatientId(data.patientId || '');
  if (patientError) errors.patientId = patientError;

  const sampleError = validateSampleId(data.sampleId || '');
  if (sampleError) errors.sampleId = sampleError;

  const testError = validateTestId(data.testId || '');
  if (testError) errors.testId = testError;

  const valueError = validateValue(data.value);
  if (valueError) errors.value = valueError;

  const unitError = validateUnit(data.unit || '');
  if (unitError) errors.unit = unitError;

  const statusError = validateStatus(data.status || '');
  if (statusError) errors.status = statusError;

  const notesError = validateNotes(data.notes);
  if (notesError) errors.notes = notesError;

  const interpretationError = validateInterpretation(data.interpretation);
  if (interpretationError) errors.interpretation = interpretationError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Check for duplicate result
 */
export async function checkForDuplicateResult(
  _sampleId: string,
  _testId: string
): Promise<boolean> {
  try {
    // This would call a service to check the database
    // For now, return false (no duplicate)
    return false;
  } catch {
    return false;
  }
}

/**
 * Check if value is critical
 */
export function isCriticalValue(
  value: number,
  criticalLow?: number,
  criticalHigh?: number
): boolean {
  if (criticalLow !== undefined && value < criticalLow) return true;
  if (criticalHigh !== undefined && value > criticalHigh) return true;
  return false;
}

/**
 * Calculate status from value and reference ranges
 */
export function calculateStatus(
  value: number,
  referenceMin?: number,
  referenceMax?: number,
  criticalLow?: number,
  criticalHigh?: number
): 'NORMAL' | 'LOW' | 'HIGH' | 'CRITICAL' {
  // Check critical first
  if (isCriticalValue(value, criticalLow, criticalHigh)) {
    return 'CRITICAL';
  }

  // Check reference range
  if (referenceMin !== undefined && value < referenceMin) {
    return 'LOW';
  }
  if (referenceMax !== undefined && value > referenceMax) {
    return 'HIGH';
  }

  return 'NORMAL';
}

/**
 * Format value with proper decimal places based on unit
 */
export function formatResultValue(value: number, unit: string): string {
  // Define decimal places by unit type
  const decimalPlaces: Record<string, number> = {
    'mg/dL': 1,
    'mmol/L': 1,
    'g/dL': 2,
    '%': 1,
    'mEq/L': 1,
    'U/L': 0,
    'ng/mL': 2,
    'pg/mL': 1,
  };

  const places = decimalPlaces[unit] ?? 2;
  return value.toFixed(places);
}

/**
 * Calculate delta change percentage
 */
export function calculateDeltaChange(
  previousValue: number,
  currentValue: number
): number {
  if (previousValue === 0) return 0;
  return Math.abs((currentValue - previousValue) / previousValue) * 100;
}

/**
 * Check if delta change exceeds threshold
 */
export function isDeltaSignificant(
  previousValue: number,
  currentValue: number,
  thresholdPercent: number = 50
): boolean {
  const deltaPercent = calculateDeltaChange(previousValue, currentValue);
  return deltaPercent > thresholdPercent;
}
