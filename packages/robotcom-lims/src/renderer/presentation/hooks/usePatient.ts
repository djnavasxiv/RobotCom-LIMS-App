/**
 * usePatient.ts - Custom React hook for patient data fetching
 * 
 * Handles:
 * - Fetching patient demographics
 * - Patient history and test results
 * - Error handling and loading states
 * 
 * Author: David Navas
 * Date: November 19, 2025
 */

import { useState, useEffect, useCallback } from 'react';
import { PatientService } from '../../application/services/PatientService';

export interface UsePatientOptions {
  patientId?: string;
  autoFetch?: boolean;
}

export interface UsePatientReturn {
  patient: any | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and managing patient data
 */
export const usePatient = (options: UsePatientOptions = {}): UsePatientReturn => {
  const { patientId, autoFetch = true } = options;

  const [patient, setPatient] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patientService = new PatientService();

  const fetchPatient = useCallback(async () => {
    if (!patientId) {
      setPatient(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const patientData = await patientService.getPatientById(patientId);
      setPatient(patientData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch patient';
      setError(message);
      console.error('Error fetching patient:', err);
    } finally {
      setLoading(false);
    }
  }, [patientId, patientService]);

  useEffect(() => {
    if (autoFetch && patientId) {
      fetchPatient();
    }
  }, [patientId, autoFetch, fetchPatient]);

  return {
    patient,
    loading,
    error,
    refetch: fetchPatient,
  };
};

export default usePatient;
