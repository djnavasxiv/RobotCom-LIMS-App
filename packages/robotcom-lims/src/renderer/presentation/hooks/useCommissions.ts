import { useState, useEffect, useCallback } from 'react';
import { CommissionService } from '../../application/services/CommissionService';
import { Commission } from '../../domain/entities/Commission';

export interface UseCommissionsReturn {
  commissions: Commission[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCommissions = (): UseCommissionsReturn => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const commissionService = new CommissionService();

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await commissionService.getAllCommissions();
      setCommissions(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch commissions';
      setError(message);
      console.error('Error fetching commissions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    commissions,
    loading,
    error,
    refetch,
  };
};
