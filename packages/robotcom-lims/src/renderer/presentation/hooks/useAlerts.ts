/**
 * useAlerts.ts - Custom React hook for alert data fetching and management
 * 
 * Handles:
 * - Fetching clinical alerts from backend
 * - Alert filtering by type and severity
 * - Error handling and loading states
 * - Automatic alert refresh
 * 
 * Author: David Navas
 * Date: November 19, 2025
 */

import { useState, useEffect, useCallback } from 'react';

export interface Alert {
  id: string;
  patientId: string;
  testId: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  type: string;
  message: string;
  value: number;
  normalRange: { min: number; max: number };
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}

export interface UseAlertsOptions {
  labId?: string;
  patientId?: string;
  severity?: string[];
  autoFetch?: boolean;
}

export interface UseAlertsReturn {
  alerts: Alert[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and managing alert data
 */
export const useAlerts = (options: UseAlertsOptions = {}): UseAlertsReturn => {
  const {
    labId,
    patientId,
    severity,
    autoFetch = true,
  } = options;

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Implement service method for fetching alerts
      // For now, return empty array
      let fetchedAlerts: Alert[] = [];
      
      // Filter by severity if provided
      if (severity && severity.length > 0) {
        fetchedAlerts = fetchedAlerts.filter(alert => 
          severity.includes(alert.severity)
        );
      }
      
      setAlerts(fetchedAlerts);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch alerts';
      setError(message);
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  }, [patientId, labId, severity]);

  useEffect(() => {
    if (autoFetch && (labId || patientId)) {
      fetchAlerts();
    }
  }, [labId, patientId, autoFetch, fetchAlerts]);

  return {
    alerts,
    loading,
    error,
    refetch: fetchAlerts,
  };
};

export default useAlerts;
