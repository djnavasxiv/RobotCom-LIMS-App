import { useState, useEffect, useCallback } from 'react';
import { TestProfileService } from '../../application/services/TestProfileService';
import { TestProfile } from '../../domain/entities/TestProfile';

export interface UseTestProfilesReturn {
  profiles: TestProfile[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTestProfiles = (): UseTestProfilesReturn => {
  const [profiles, setProfiles] = useState<TestProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testProfileService = new TestProfileService();

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await testProfileService.getAllTestProfiles();
      setProfiles(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch test profiles';
      setError(message);
      console.error('Error fetching test profiles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    profiles,
    loading,
    error,
    refetch,
  };
};
