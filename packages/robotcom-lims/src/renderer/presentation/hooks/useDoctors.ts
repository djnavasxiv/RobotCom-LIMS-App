import { useState, useEffect, useCallback } from 'react';
import { DoctorService } from '../../application/services/DoctorService';
import { Doctor } from '../../domain/entities/Doctor';

export interface UseDoctorsReturn {
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDoctors = (): UseDoctorsReturn => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doctorService = new DoctorService();

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await doctorService.getAllDoctors();
      setDoctors(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch doctors';
      setError(message);
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    doctors,
    loading,
    error,
    refetch,
  };
};
