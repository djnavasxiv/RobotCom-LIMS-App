import { useState, useEffect, useCallback } from 'react';
import { TestService } from '../../application/services/TestService';
import { Test } from '../../domain/entities/Test';

export interface UseTestsReturn {
  tests: Test[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTests = (): UseTestsReturn => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testService = new TestService();

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await testService.getAllTests();
      setTests(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tests';
      setError(message);
      console.error('Error fetching tests:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    tests,
    loading,
    error,
    refetch,
  };
};
