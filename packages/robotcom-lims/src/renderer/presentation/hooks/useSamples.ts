import { useState, useEffect, useCallback } from 'react';
import { SampleService } from '../../application/services/SampleService';
import { Sample } from '../../domain/entities/Sample';

export interface UseSamplesReturn {
  samples: Sample[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useSamples = (): UseSamplesReturn => {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sampleService = new SampleService();

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await sampleService.getAllSamples();
      setSamples(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch samples';
      setError(message);
      console.error('Error fetching samples:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    samples,
    loading,
    error,
    refetch,
  };
};
