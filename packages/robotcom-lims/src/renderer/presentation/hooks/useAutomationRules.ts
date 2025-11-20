/**
 * useAutomationRules.ts - Custom React hook for automation rule data fetching
 * 
 * Handles:
 * - Fetching automation rules from LabAutomationService
 * - Rule filtering by type
 * - Error handling and loading states
 * - Automatic rule refresh
 * 
 * Author: David Navas
 * Date: November 19, 2025
 */

import { useState, useEffect, useCallback } from 'react';
import LabAutomationService from '../../application/services/LabAutomationService';

export interface AutomationRule {
  id: string;
  testId?: string;
  name: string;
  type: 'CALCULATION' | 'DELTA_CHECK' | 'REFLEX' | 'INTERPRETATION' | 'QC';
  description?: string;
  priority: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UseAutomationRulesOptions {
  labId?: string;
  ruleType?: string;
  includeInactive?: boolean;
  autoFetch?: boolean;
}

export interface UseAutomationRulesReturn {
  rules: AutomationRule[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and managing automation rule data
 */
export const useAutomationRules = (options: UseAutomationRulesOptions = {}): UseAutomationRulesReturn => {
  const {
    labId,
    ruleType,
    includeInactive = false,
    autoFetch = true,
  } = options;

  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const automationService = new LabAutomationService();

  const fetchRules = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Implement service method for fetching automation rules
      // For now, return empty array with placeholder structure
      let fetchedRules: AutomationRule[] = [];
      
      // Filter by rule type if provided
      if (ruleType) {
        fetchedRules = fetchedRules.filter(rule => rule.type === ruleType);
      }
      
      // Filter by active status if not including inactive
      if (!includeInactive) {
        fetchedRules = fetchedRules.filter(rule => rule.isActive);
      }
      
      // Sort by priority (higher first)
      fetchedRules.sort((a, b) => b.priority - a.priority);
      
      setRules(fetchedRules);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch automation rules';
      setError(message);
      console.error('Error fetching automation rules:', err);
    } finally {
      setLoading(false);
    }
  }, [labId, ruleType, includeInactive, automationService]);

  useEffect(() => {
    if (autoFetch && labId) {
      fetchRules();
    }
  }, [labId, autoFetch, fetchRules]);

  return {
    rules,
    loading,
    error,
    refetch: fetchRules,
  };
};

export default useAutomationRules;
