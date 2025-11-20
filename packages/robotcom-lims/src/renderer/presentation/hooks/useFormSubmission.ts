/**
 * useFormSubmission.ts - Custom React hook for form submission handling
 * 
 * Handles:
 * - Form state management
 * - Form submission lifecycle
 * - Validation error handling
 * - Loading state during submission
 * - Form reset after successful submission
 * 
 * Author: David Navas
 * Date: November 19, 2025
 */

import { useState, useCallback } from 'react';

export interface FormSubmissionOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  onSuccess?: (values: T) => void;
  onError?: (error: Error) => void;
}

export interface UseFormSubmissionReturn<T> {
  values: T;
  setValues: (values: Partial<T>) => void;
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
  submit: () => Promise<void>;
  reset: () => void;
  clearError: () => void;
  setFieldValue: (field: keyof T, value: any) => void;
}

/**
 * Hook for managing form submission and state
 */
export const useFormSubmission = <T extends Record<string, any>>(
  options: FormSubmissionOptions<T>
): UseFormSubmissionReturn<T> => {
  const { initialValues, onSubmit, onSuccess, onError } = options;

  const [values, setValuesState] = useState<T>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState(prev => ({ ...prev, ...newValues }));
  }, []);

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValuesState(prev => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setValuesState(initialValues);
    setError(null);
    setSuccess(false);
  }, [initialValues]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const submit = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await onSubmit(values);
      setSuccess(true);
      onSuccess?.(values);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Form submission failed';
      setError(message);
      onError?.(err instanceof Error ? err : new Error(message));
    } finally {
      setIsSubmitting(false);
    }
  }, [values, onSubmit, onSuccess, onError]);

  return {
    values,
    setValues,
    isSubmitting,
    error,
    success,
    submit,
    reset,
    clearError,
    setFieldValue,
  };
};

export default useFormSubmission;
