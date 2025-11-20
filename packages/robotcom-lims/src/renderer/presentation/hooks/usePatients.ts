/**
 * usePatients.ts - Custom React hook for patient data fetching and management
 * 
 * Handles:
 * - Fetching patients from backend
 * - Patient search and filtering
 * - Create, update, delete operations
 * - Error handling and loading states
 * 
 * Author: David Navas
 * Date: November 19, 2025
 */

import { useState, useEffect, useCallback } from 'react';
import { PatientService } from '../../application/services/PatientService';
import { Patient } from '../../domain/entities/Patient';

export interface UsePatientsOptions {
  labId?: string;
  autoFetch?: boolean;
}

export interface UsePatientsReturn {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  searchPatients: (query: string) => Promise<void>;
}

/**
 * Hook for fetching and managing patient data
 */
export const usePatients = (options: UsePatientsOptions = {}): UsePatientsReturn => {
  const { labId, autoFetch = true } = options;

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patientService = new PatientService();

  const refetch = useCallback(async () => {
    if (!labId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await patientService.getPatientsByLab(labId);
      setPatients(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch patients';
      setError(message);
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  }, [labId]);

  const searchPatients = useCallback(
    async (query: string) => {
      if (!labId) return;

      setLoading(true);
      setError(null);

      try {
        if (!query.trim()) {
          await refetch();
          return;
        }

        const results = await patientService.searchPatients(labId, query);
        setPatients(results);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to search patients';
        setError(message);
        console.error('Error searching patients:', err);
      } finally {
        setLoading(false);
      }
    },
    [labId, refetch]
  );

  useEffect(() => {
    if (autoFetch && labId) {
      refetch();
    }
  }, [labId, autoFetch, refetch]);

  return {
    patients,
    loading,
    error,
    refetch,
    searchPatients,
  };
};
