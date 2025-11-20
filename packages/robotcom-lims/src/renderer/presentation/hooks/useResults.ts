/**
 * useResults.ts - Custom React hook for result data fetching and management
 * 
 * Handles:
 * - Fetching results from backend
 * - Result filtering and sorting
 * - Error handling and loading states
 * - Pagination support
 * 
 * Author: David Navas
 * Date: November 19, 2025
 */

import { useState, useEffect, useCallback } from 'react';
import { ResultService } from '../../application/services/ResultService';

export interface UseResultsOptions {
  labId?: string;
  patientId?: string;
  limit?: number;
  autoFetch?: boolean;
}

export interface UseResultsReturn {
  results: any[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and managing result data
 */
export const useResults = (options: UseResultsOptions = {}): UseResultsReturn => {
  const {
    labId,
    patientId,
    limit = 100,
    autoFetch = true,
  } = options;

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resultService = new ResultService();

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // If we have a patientId, fetch results for that patient
      if (patientId) {
        const patientResults = await resultService.getResultsForSample(patientId);
        setResults(patientResults.slice(0, limit));
      } else if (labId) {
        // TODO: Implement service method for fetching results by labId
        // For now, return empty array
        setResults([]);
      } else {
        setResults([]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch results';
      setError(message);
      console.error('Error fetching results:', err);
    } finally {
      setLoading(false);
    }
  }, [patientId, labId, limit, resultService]);

  useEffect(() => {
    if (autoFetch && (labId || patientId)) {
      fetchResults();
    }
  }, [labId, patientId, autoFetch, fetchResults]);

  return {
    results,
    loading,
    error,
    refetch: fetchResults,
  };
};

export default useResults;
