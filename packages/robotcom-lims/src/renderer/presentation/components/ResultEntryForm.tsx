/**
 * ResultEntryForm.tsx - Enhanced Result Entry Component with Service Integration
 * 
 * Advanced form for entering laboratory results with:
 * - Real-time field validation
 * - Duplicate detection
 * - Inline clinical notes
 * - Auto-calculated fields (delta, ratios)
 * - Critical value alerts
 * - Backend service integration
 * - Comprehensive error handling
 * 
 * Author: David Navas
 * Date: November 19, 2025
 */

import React, { useState, useCallback } from 'react';
import {
  validateResultForm,
  checkForDuplicateResult,
  calculateStatus,
  formatResultValue,
  calculateDeltaChange,
  isDeltaSignificant,
  isCriticalValue,
  type ResultEntryFormData,
  type ValidationResult,
} from '../../application/validation/ResultFormValidation';
import { ResultService } from '../../application/services/ResultService';

interface ResultEntryFormProps {
  onSubmit?: (data: ResultEntryFormData) => Promise<void>;
  patientId?: string;
  sampleId?: string;
  previousResults?: Array<{ testId: string; value: number }>;
  isLoading?: boolean;
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

/**
 * Enhanced Result Entry Form Component with Service Integration
 */
export const ResultEntryForm: React.FC<ResultEntryFormProps> = ({
  onSubmit: onFormSubmit,
  patientId: initialPatientId,
  sampleId: initialSampleId,
  previousResults = [],
  isLoading = false,
  onSuccess,
  onError,
}) => {
  const resultService = new ResultService();

  // Form state
  const [formData, setFormData] = useState<Partial<ResultEntryFormData>>({
    patientId: initialPatientId || '',
    sampleId: initialSampleId || '',
    testId: '',
    value: 0,
    unit: '',
    status: 'NORMAL',
    notes: '',
    interpretation: '',
    qcFlag: false,
  });

  // Validation state
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    errors: {},
  });

  // UI state
  const [duplicateChecking, setDuplicateChecking] = useState(false);
  const [duplicateFound, setDuplicateFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showCriticalAlert, setShowCriticalAlert] = useState(false);
  const [showDeltaAlert, setShowDeltaAlert] = useState(false);
  const [deltaChangePercent, setDeltaChangePercent] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Handle field changes
   */
  const handleFieldChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;

      const newFormData: Partial<ResultEntryFormData> = {
        ...formData,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      };

      // Parse numeric fields
      if (name === 'value') {
        newFormData.value = parseFloat(value) || 0;
      }
      if (name === 'referenceMin') {
        newFormData.referenceMin = value ? parseFloat(value) : undefined;
      }
      if (name === 'referenceMax') {
        newFormData.referenceMax = value ? parseFloat(value) : undefined;
      }

      setFormData(newFormData);

      // Auto-validate on field change
      const validation = validateResultForm(newFormData);
      setValidationResult(validation);

      // Check for duplicate on sample+test change
      if ((name === 'sampleId' || name === 'testId') && newFormData.sampleId && newFormData.testId) {
        setDuplicateChecking(true);
        const isDuplicate = await checkForDuplicateResult(newFormData.sampleId, newFormData.testId);
        setDuplicateFound(isDuplicate);
        setDuplicateChecking(false);
      }

      // Calculate status and alerts when value changes
      if (name === 'value' && newFormData.value) {
        const calculatedStatus = calculateStatus(
          newFormData.value,
          newFormData.referenceMin,
          newFormData.referenceMax,
          newFormData.referenceMin ? newFormData.referenceMin * 0.5 : undefined,
          newFormData.referenceMax ? newFormData.referenceMax * 1.5 : undefined
        );
        newFormData.status = calculatedStatus;
        setFormData(newFormData);

        // Check critical value
        const isCritical = isCriticalValue(
          newFormData.value,
          newFormData.referenceMin ? newFormData.referenceMin * 0.5 : undefined,
          newFormData.referenceMax ? newFormData.referenceMax * 1.5 : undefined
        );
        setShowCriticalAlert(isCritical);

        // Check delta change
        if (newFormData.testId) {
          const previousResult = previousResults.find((r) => r.testId === newFormData.testId);
          if (previousResult) {
            const deltaPercent = calculateDeltaChange(previousResult.value, newFormData.value);
            setDeltaChangePercent(deltaPercent);

            const isSignificant = isDeltaSignificant(previousResult.value, newFormData.value);
            setShowDeltaAlert(isSignificant);
          }
        }
      }
    },
    [formData, previousResults]
  );

  /**
   * Handle form submission with service integration
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validate form
    const validation = validateResultForm(formData);
    setValidationResult(validation);

    if (!validation.isValid) {
      const errors = Object.values(validation.errors).join(', ');
      setErrorMessage(`Validation failed: ${errors}`);
      return;
    }

    // Check for duplicate
    if (duplicateFound) {
      const confirmOverwrite = window.confirm(
        'A result already exists for this sample and test. Continue anyway?'
      );
      if (!confirmOverwrite) {
        return;
      }
    }

    // Submit
    setSubmitting(true);
    try {
      const resultData = formData as ResultEntryFormData;

      // Call backend service if available
      if (onFormSubmit) {
        await onFormSubmit(resultData);
      } else {
        // Use ResultService to save the processed result
        const processedResult = {
          sampleId: resultData.sampleId,
          testId: resultData.testId,
          testName: resultData.testId, // TODO: map to actual test name
          value: resultData.value,
          unit: resultData.unit,
          status: resultData.status as 'NORMAL' | 'LOW' | 'HIGH' | 'CRITICAL',
          flagged: resultData.status === 'CRITICAL',
        };
        await resultService.saveProcessedResult(processedResult);
      }

      // Success
      const message = `Result successfully submitted for ${resultData.testId}`;
      setSuccessMessage(message);
      if (onSuccess) {
        onSuccess(message);
      }

      // Reset form on success
      setFormData({
        patientId: initialPatientId || '',
        sampleId: initialSampleId || '',
        testId: '',
        value: 0,
        unit: '',
        status: 'NORMAL',
        notes: '',
        interpretation: '',
        qcFlag: false,
      });
      setValidationResult({ isValid: true, errors: {} });
      setShowCriticalAlert(false);
      setShowDeltaAlert(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit result';
      setErrorMessage(message);
      if (onError) {
        onError(message);
      }
      console.error('Result submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Get error message for field
   */
  const getFieldError = (fieldName: string): string | null => {
    return validationResult.errors[fieldName] || null;
  };

  /**
   * Check if field has error
   */
  const hasFieldError = (fieldName: string): boolean => {
    return fieldName in validationResult.errors;
  };

  const formattedValue = formData.value ? formatResultValue(formData.value, formData.unit || '') : '';

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Lab Result Entry</h2>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded">
          <p className="text-green-700 font-semibold">✓ Success</p>
          <p className="text-green-600 text-sm">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-red-700 font-semibold">✗ Error</p>
          <p className="text-red-600 text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Critical Alert */}
      {showCriticalAlert && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-red-700 font-semibold">⚠️ Critical Value Alert</p>
          <p className="text-red-600 text-sm">This result is outside critical thresholds.</p>
        </div>
      )}

      {/* Delta Change Alert */}
      {showDeltaAlert && (
        <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
          <p className="text-yellow-700 font-semibold">⚠️ Significant Delta Change</p>
          <p className="text-yellow-600 text-sm">
            Result differs by {deltaChangePercent.toFixed(1)}% from previous result.
          </p>
        </div>
      )}

      {/* Duplicate Alert */}
      {duplicateFound && (
        <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-blue-700 font-semibold">ℹ️ Duplicate Detection</p>
          <p className="text-blue-600 text-sm">A result already exists for this sample/test combination.</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Patient ID */}
        <div>
          <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">
            Patient ID
          </label>
          <input
            type="text"
            id="patientId"
            name="patientId"
            value={formData.patientId || ''}
            onChange={handleFieldChange}
            disabled={!!initialPatientId}
            className={`w-full px-3 py-2 border rounded-md text-sm ${
              hasFieldError('patientId') ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {getFieldError('patientId') && (
            <p className="text-red-500 text-xs mt-1">{getFieldError('patientId')}</p>
          )}
        </div>

        {/* Sample ID */}
        <div>
          <label htmlFor="sampleId" className="block text-sm font-medium text-gray-700 mb-1">
            Sample ID
          </label>
          <input
            type="text"
            id="sampleId"
            name="sampleId"
            value={formData.sampleId || ''}
            onChange={handleFieldChange}
            disabled={!!initialSampleId}
            className={`w-full px-3 py-2 border rounded-md text-sm ${
              hasFieldError('sampleId') ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {getFieldError('sampleId') && (
            <p className="text-red-500 text-xs mt-1">{getFieldError('sampleId')}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Test ID */}
        <div>
          <label htmlFor="testId" className="block text-sm font-medium text-gray-700 mb-1">
            Test
          </label>
          <select
            id="testId"
            name="testId"
            value={formData.testId || ''}
            onChange={handleFieldChange}
            className={`w-full px-3 py-2 border rounded-md text-sm ${
              hasFieldError('testId') ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Select test...</option>
            <option value="test-1">Glucose (mg/dL)</option>
            <option value="test-2">Hemoglobin (g/dL)</option>
            <option value="test-3">Creatinine (mg/dL)</option>
            <option value="test-4">Potassium (mEq/L)</option>
          </select>
          {getFieldError('testId') && (
            <p className="text-red-500 text-xs mt-1">{getFieldError('testId')}</p>
          )}
          {duplicateChecking && <p className="text-gray-500 text-xs mt-1">Checking for duplicates...</p>}
        </div>

        {/* Value */}
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
            Value
          </label>
          <input
            type="number"
            id="value"
            name="value"
            value={formData.value || ''}
            onChange={handleFieldChange}
            step="0.01"
            className={`w-full px-3 py-2 border rounded-md text-sm ${
              hasFieldError('value') ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          {getFieldError('value') && (
            <p className="text-red-500 text-xs mt-1">{getFieldError('value')}</p>
          )}
          {formattedValue && (
            <p className="text-gray-500 text-xs mt-1">Formatted: {formattedValue}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Unit */}
        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
            Unit
          </label>
          <select
            id="unit"
            name="unit"
            value={formData.unit || ''}
            onChange={handleFieldChange}
            className={`w-full px-3 py-2 border rounded-md text-sm ${
              hasFieldError('unit') ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Select unit...</option>
            <option value="mg/dL">mg/dL</option>
            <option value="mmol/L">mmol/L</option>
            <option value="g/dL">g/dL</option>
            <option value="mEq/L">mEq/L</option>
            <option value="U/L">U/L</option>
          </select>
          {getFieldError('unit') && (
            <p className="text-red-500 text-xs mt-1">{getFieldError('unit')}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status || 'NORMAL'}
            onChange={handleFieldChange}
            className={`w-full px-3 py-2 border rounded-md text-sm font-semibold ${
              formData.status === 'CRITICAL' ? 'bg-red-100 border-red-500' :
              formData.status === 'HIGH' ? 'bg-yellow-100 border-yellow-500' :
              formData.status === 'LOW' ? 'bg-orange-100 border-orange-500' :
              'bg-green-100 border-green-500'
            }`}
          >
            <option value="NORMAL">✓ Normal</option>
            <option value="LOW">↓ Low</option>
            <option value="HIGH">↑ High</option>
            <option value="CRITICAL">⚠️ Critical</option>
          </select>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-4">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Clinical Notes (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes || ''}
          onChange={handleFieldChange}
          rows={3}
          placeholder="Add clinical observations or notes..."
          className={`w-full px-3 py-2 border rounded-md text-sm resize-none ${
            hasFieldError('notes') ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
        <p className="text-gray-500 text-xs mt-1">
          {formData.notes?.length || 0} / 500 characters
        </p>
        {getFieldError('notes') && (
          <p className="text-red-500 text-xs mt-1">{getFieldError('notes')}</p>
        )}
      </div>

      {/* Interpretation */}
      <div className="mb-4">
        <label htmlFor="interpretation" className="block text-sm font-medium text-gray-700 mb-1">
          Interpretation (optional)
        </label>
        <textarea
          id="interpretation"
          name="interpretation"
          value={formData.interpretation || ''}
          onChange={handleFieldChange}
          rows={2}
          placeholder="Add clinical interpretation..."
          className={`w-full px-3 py-2 border rounded-md text-sm resize-none ${
            hasFieldError('interpretation') ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
        <p className="text-gray-500 text-xs mt-1">
          {formData.interpretation?.length || 0} / 300 characters
        </p>
        {getFieldError('interpretation') && (
          <p className="text-red-500 text-xs mt-1">{getFieldError('interpretation')}</p>
        )}
      </div>

      {/* QC Flag */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="qcFlag"
            checked={formData.qcFlag || false}
            onChange={handleFieldChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Quality Control Result</span>
        </label>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting || isLoading || !validationResult.isValid}
          className={`flex-1 px-4 py-2 bg-blue-600 text-white rounded-md font-medium ${
            submitting || isLoading || !validationResult.isValid
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {submitting ? 'Submitting...' : 'Submit Result'}
        </button>
        <button
          type="reset"
          disabled={submitting}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50"
        >
          Clear
        </button>
      </div>

      {/* Form validation summary */}
      {!validationResult.isValid && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 font-semibold text-sm mb-2">Please fix the following errors:</p>
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(validationResult.errors).map(([field, error]) => (
              <li key={field} className="text-red-600 text-xs">
                <strong>{field}:</strong> {error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};

export default ResultEntryForm;