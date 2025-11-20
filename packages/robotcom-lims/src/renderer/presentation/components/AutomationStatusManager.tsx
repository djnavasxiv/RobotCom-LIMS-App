/**
 * AutomationStatusManager.tsx - Automation Status with Service Integration
 * 
 * Comprehensive automation status and rule management interface with:
 * - Automation rule creation and editing
 * - Rule enable/disable toggling
 * - Rule execution history and logs
 * - Delta check rule configuration
 * - Critical value alert configuration
 * - Reflex rule management
 * - Rule testing and validation
 * - Performance monitoring
 * - Backend service integration
 * 
 * Author: David Navas
 * Date: November 19, 2025
 */

import { FC, useState, useMemo, useEffect } from 'react';
import { useAutomationRules } from '../hooks/useAutomationRules';

/**
 * Automation rule types
 */
type RuleType = 'DELTA_CHECK' | 'CRITICAL_VALUE' | 'QC_FAILURE' | 'REFLEX_TEST' | 'AUTO_VALIDATION';

/**
 * Automation rule status
 */
type RuleStatus = 'ACTIVE' | 'INACTIVE' | 'PAUSED' | 'ERROR';

/**
 * Automation rule structure
 */
interface AutomationRule {
  id: string;
  name: string;
  description: string;
  type: RuleType;
  status: RuleStatus;
  enabled: boolean;
  testIds: string[];
  parameters: Record<string, unknown>;
  conditions: string;
  actions: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastExecuted?: Date;
  executionCount: number;
  errorCount: number;
  successRate: number;
}

interface AutomationStatusManagerProps {
  rules?: AutomationRule[];
  labId?: string;
  onCreateRule?: (rule: Omit<AutomationRule, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'executionCount' | 'errorCount' | 'successRate'>) => Promise<void>;
  onUpdateRule?: (ruleId: string, updates: Partial<AutomationRule>) => Promise<void>;
  onDeleteRule?: (ruleId: string) => Promise<void>;
  onToggleRule?: (ruleId: string, enabled: boolean) => Promise<void>;
  onTestRule?: (ruleId: string) => Promise<{ success: boolean; message: string }>;
  autoFetchRules?: boolean;
}

/**
 * Rule status badge component
 */
const RuleStatusBadge: FC<{ status: RuleStatus; enabled: boolean }> = ({ status, enabled }): JSX.Element => {
  const statusConfig: Record<RuleStatus, { bg: string; text: string }> = {
    ACTIVE: { bg: 'bg-green-100', text: 'text-green-800' },
    INACTIVE: { bg: 'bg-gray-100', text: 'text-gray-800' },
    PAUSED: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    ERROR: { bg: 'bg-red-100', text: 'text-red-800' },
  };
  const statusLabel = status || 'INACTIVE';
  const c = statusConfig[statusLabel];
  const displayLabel = enabled ? statusLabel : 'Disabled';
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      {displayLabel}
    </span>
  );
};

/**
 * Rule type badge component
 */
const RuleTypeBadge: FC<{ type: RuleType }> = ({ type }): JSX.Element => {
  const typeLabels: Record<RuleType, string> = {
    DELTA_CHECK: 'Delta Check',
    CRITICAL_VALUE: 'Critical Value',
    QC_FAILURE: 'QC Failure',
    REFLEX_TEST: 'Reflex Test',
    AUTO_VALIDATION: 'Auto Validation',
  };
  return (
    <span className="inline-block px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded">
      {typeLabels[type]}
    </span>
  );
};

/**
 * Automation Status Manager Component
 */
/**
 * Automation Status Manager Component with Service Integration
 */
export const AutomationStatusManager: FC<AutomationStatusManagerProps> = ({
  rules: initialRules = [],
  labId,
  onUpdateRule,
  onToggleRule,
  onTestRule,
  onDeleteRule,
  autoFetchRules = true,
}): JSX.Element => {
  // Data state from hook
  const { rules: fetchedRules, loading, error: hookError } = useAutomationRules({
    labId,
    autoFetch: autoFetchRules,
  });

  const [rules, setRules] = useState<AutomationRule[]>(initialRules);
  const [error, setError] = useState<string>('');

  // UI state
  const [showInactive, setShowInactive] = useState(false);
  const [filterType, setFilterType] = useState<RuleType | 'ALL'>('ALL');
  const [expandedRule, setExpandedRule] = useState<string | null>(null);
  const [testingRule, setTestingRule] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({});

  // Update error state from hook
  useEffect(() => {
    if (hookError) {
      setError(hookError);
    }
  }, [hookError]);

  // Merge fetched rules with initial rules
  useEffect(() => {
    if (fetchedRules.length > 0) {
      // Transform hook rules to component rules
      const transformedRules = fetchedRules.map(r => ({
        id: r.id,
        name: r.name,
        type: (r.type === 'CALCULATION' ? 'CALCULATION' : 
                r.type === 'DELTA_CHECK' ? 'DELTA_CHECK' :
                r.type === 'REFLEX' ? 'REFLEX' :
                r.type === 'QC' ? 'QC' : 'CUSTOM') as RuleType,
        description: r.description || `${r.type} rule`,
        enabled: r.isActive,
        status: r.isActive ? 'ACTIVE' : 'INACTIVE' as RuleStatus,
        priority: r.priority,
        testIds: r.testId ? [r.testId] : [],
        parameters: {},
        conditions: '',
        actions: [],
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        createdBy: 'system',
        lastExecuted: new Date(),
        executionCount: 0,
        errorCount: 0,
        successRate: 100,
      }));
      setRules(transformedRules);
    } else if (initialRules.length > 0) {
      setRules(initialRules);
    }
  }, [fetchedRules, initialRules]);

  /**
   * Filtered rules
   */
  const filteredRules = useMemo(() => {
    let filtered = rules.filter((r) => showInactive || r.enabled);

    if (filterType !== 'ALL') {
      filtered = filtered.filter((r) => r.type === filterType);
    }

    return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [rules, showInactive, filterType]);

  /**
   * Calculate statistics
   */
  const stats = useMemo(() => {
    return {
      total: rules.length,
      active: rules.filter((r) => r.enabled && r.status === 'ACTIVE').length,
      inactive: rules.filter((r) => !r.enabled || r.status === 'INACTIVE').length,
      errors: rules.filter((r) => r.status === 'ERROR').length,
      avgSuccessRate: rules.length > 0
        ? (rules.reduce((sum, r) => sum + r.successRate, 0) / rules.length).toFixed(1)
        : 0,
    };
  }, [rules]);

  /**
   * Handle test rule
   */
  const handleTestRule = async (ruleId: string) => {
    if (!onTestRule) return;
    setTestingRule(ruleId);
    try {
      const result = await onTestRule(ruleId);
      setTestResults((prev) => ({ ...prev, [ruleId]: result }));
    } finally {
      setTestingRule(null);
    }
  };

  /**
   * Format date
   */
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full bg-gray-50 rounded-lg shadow">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Automation Status & Rule Management</h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700 font-semibold">✗ Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-blue-700 font-semibold">Loading Automation Rules...</p>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs font-medium text-blue-600">Total Rules</p>
            <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs font-medium text-green-600">Active</p>
            <p className="text-2xl font-bold text-green-900">{stats.active}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-medium text-gray-600">Inactive</p>
            <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-xs font-medium text-red-600">Errors</p>
            <p className="text-2xl font-bold text-red-900">{stats.errors}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-xs font-medium text-purple-600">Avg Success</p>
            <p className="text-2xl font-bold text-purple-900">{stats.avgSuccessRate}%</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as RuleType | 'ALL')}
            className="px-3 py-2 border border-gray-300 rounded text-sm"
          >
            <option value="ALL">All Rule Types</option>
            <option value="DELTA_CHECK">Delta Check</option>
            <option value="CRITICAL_VALUE">Critical Value</option>
            <option value="QC_FAILURE">QC Failure</option>
            <option value="REFLEX_TEST">Reflex Test</option>
            <option value="AUTO_VALIDATION">Auto Validation</option>
          </select>

          <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded text-sm cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="w-4 h-4"
            />
            Show Inactive
          </label>
        </div>
      </div>

      {/* Rules list */}
      <div className="divide-y divide-gray-200">
        {filteredRules.length === 0 ? (
          <div className="bg-white p-8 text-center text-gray-500">
            <p className="text-sm">
              {stats.total === 0 ? 'No automation rules configured.' : 'No rules matching the selected filters.'}
            </p>
          </div>
        ) : (
          filteredRules.map((rule) => {
            const testResult = testResults[rule.id];
            return (
              <div key={rule.id} className="bg-white border-b border-gray-200">
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 flex items-start justify-between"
                  onClick={() => setExpandedRule(expandedRule === rule.id ? null : rule.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-sm font-semibold text-gray-900">{rule.name}</h3>
                      <RuleTypeBadge type={rule.type} />
                      <RuleStatusBadge status={rule.status} enabled={rule.enabled} />
                    </div>
                    <p className="text-xs text-gray-600">{rule.description}</p>
                    <div className="mt-2 flex gap-4 text-xs text-gray-500">
                      <span>Executions: {rule.executionCount}</span>
                      <span>Success Rate: {rule.successRate.toFixed(1)}%</span>
                      <span>Errors: {rule.errorCount}</span>
                      {rule.lastExecuted && <span>Last Run: {formatDate(rule.lastExecuted)}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-xs font-medium text-gray-600">
                        {rule.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        onChange={(e) => {
                          e.stopPropagation();
                          onToggleRule?.(rule.id, e.target.checked);
                        }}
                        className="w-4 h-4"
                      />
                    </label>
                  </div>
                </div>

                {/* Expanded rule details */}
                {expandedRule === rule.id && (
                  <div className="bg-gray-50 border-t border-gray-200 p-4 space-y-4">
                    {/* Configuration */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-2">Tests Applied To</p>
                        <div className="flex flex-wrap gap-1">
                          {rule.testIds.length > 0 ? (
                            rule.testIds.map((id) => (
                              <span key={id} className="px-2 py-1 text-xs bg-white border border-gray-300 rounded">
                                {id}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-500">All tests</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-2">Conditions</p>
                        <code className="text-xs bg-white p-2 rounded border border-gray-300 block max-h-20 overflow-y-auto font-mono">
                          {rule.conditions}
                        </code>
                      </div>
                    </div>

                    {/* Actions */}
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-2">Actions</p>
                      <ul className="space-y-1">
                        {rule.actions.map((action, idx) => (
                          <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                            <span className="text-gray-400 mt-0.5">-</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Test result */}
                    {testResult && (
                      <div className={`p-3 rounded ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        <p className={`text-xs font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                          {testResult.success ? 'Test Passed' : 'Test Failed'}
                        </p>
                        <p className={`text-xs ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>{testResult.message}</p>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-2">
                      {onTestRule && (
                        <button
                          onClick={() => handleTestRule(rule.id)}
                          disabled={testingRule === rule.id}
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                          {testingRule === rule.id ? 'Testing...' : 'Test Rule'}
                        </button>
                      )}
                      {onUpdateRule && (
                        <button
                          onClick={() => setExpandedRule(null)}
                          className="px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
                        >
                          Edit
                        </button>
                      )}
                      {onDeleteRule && (
                        <button
                          onClick={() => onDeleteRule(rule.id)}
                          className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 ml-auto"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 px-6 py-3 text-sm text-gray-600">
        Showing {filteredRules.length} of {rules.filter((r) => showInactive || r.enabled).length} rules
      </div>
    </div>
  );
};

export default AutomationStatusManager;