/**
 * ClinicalAlertsPanel.tsx - Clinical Alerts with Service Integration
 * 
 * Comprehensive alert and notification system for laboratory results with:
 * - Critical value alerts
 * - Delta change notifications
 * - QC failure alerts
 * - Reflex test recommendations
 * - Alert acknowledgment and history
 * - Real-time alert filtering and grouping
 * - Alert severity indicators
 * - Backend service integration for alert fetching
 * 
 * Author: David Navas
 * Date: November 19, 2025
 */

import { FC, useState, useMemo, useEffect } from 'react';
import { useAlerts } from '../hooks/useAlerts';

/**
 * Alert severity levels
 */
type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

/**
 * Alert types
 */
type AlertType = 'CRITICAL_VALUE' | 'DELTA_CHANGE' | 'QC_FAILURE' | 'REFLEX_REQUIRED' | 'DUPLICATE' | 'REVIEW_PENDING';

/**
 * Alert data structure
 */
interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  patientId?: string;
  patientName?: string;
  testId?: string;
  testName?: string;
  resultId?: string;
  value?: number;
  unit?: string;
  referenceRange?: string;
  deltaPercent?: number;
  createdAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  actionRequired: boolean;
  relatedAlerts?: string[];
}

interface ClinicalAlertsPanelProps {
  alerts?: Alert[];
  labId?: string;
  onAcknowledgeAlert?: (alertId: string) => Promise<void>;
  onResolveAlert?: (alertId: string) => Promise<void>;
  onViewResult?: (resultId: string) => void;
  maxAlerts?: number;
  autoFetchAlerts?: boolean;
}

/**
 * Severity badge component
 */
const SeverityBadge: FC<{ severity: AlertSeverity }> = ({ severity }): JSX.Element => {
  const config: Record<AlertSeverity, { bg: string; text: string; border: string; icon: string }> = {
    CRITICAL: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', icon: 'C' },
    HIGH: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300', icon: 'H' },
    MEDIUM: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', icon: 'M' },
    LOW: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', icon: 'L' },
    INFO: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', icon: 'I' },
  };

  const c = config[severity];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      {c.icon} {severity}
    </span>
  );
};

/**
 * Alert type badge component
 */
const AlertTypeBadge: FC<{ type: AlertType }> = ({ type }): JSX.Element => {
  const typeLabels: Record<AlertType, string> = {
    CRITICAL_VALUE: '⚠️ Critical Value',
    DELTA_CHANGE: '📊 Delta Change',
    QC_FAILURE: '❌ QC Failure',
    REFLEX_REQUIRED: '🔄 Reflex Required',
    DUPLICATE: '⚡ Duplicate',
    REVIEW_PENDING: '👁️ Review Pending',
  };

  return (
    <span className="inline-flex items-center text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-800 rounded">
      {typeLabels[type]}
    </span>
  );
};

/**
 * Alert item component
 */
const AlertItem: FC<{
  alert: Alert;
  onAcknowledge?: () => void;
  onResolve?: () => void;
  onViewResult?: () => void;
  isLoading?: boolean;
}> = ({ alert, onAcknowledge, onResolve, onViewResult, isLoading }): JSX.Element => {
  return (
    <div className={`border-l-4 p-4 rounded-r-lg ${
      alert.severity === 'CRITICAL' ? 'border-red-500 bg-red-50' :
      alert.severity === 'HIGH' ? 'border-orange-500 bg-orange-50' :
      alert.severity === 'MEDIUM' ? 'border-yellow-500 bg-yellow-50' :
      alert.severity === 'LOW' ? 'border-blue-500 bg-blue-50' :
      'border-gray-500 bg-gray-50'
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold text-gray-900">{alert.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
        </div>
        <div className="flex items-center gap-2">
          <SeverityBadge severity={alert.severity} />
          <AlertTypeBadge type={alert.type} />
        </div>
      </div>

      {(alert.patientName || alert.testName) && (
        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
          {alert.patientName && (
            <div>
              <span className="font-medium text-gray-700">Patient:</span>
              <span className="text-gray-600 ml-2">{alert.patientName}</span>
            </div>
          )}
          {alert.testName && (
            <div>
              <span className="font-medium text-gray-700">Test:</span>
              <span className="text-gray-600 ml-2">{alert.testName}</span>
            </div>
          )}
          {alert.value !== undefined && (
            <div>
              <span className="font-medium text-gray-700">Value:</span>
              <span className="text-gray-600 ml-2 font-mono">{alert.value} {alert.unit} {alert.referenceRange && `(${alert.referenceRange})`}</span>
            </div>
          )}
          {alert.deltaPercent !== undefined && (
            <div>
              <span className="font-medium text-gray-700">Delta:</span>
              <span className="text-gray-600 ml-2">{alert.deltaPercent.toFixed(1)}%</span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
        <div>
          Created: {alert.createdAt.toLocaleString()}
          {alert.acknowledgedAt && (
            <div>Acknowledged by {alert.acknowledgedBy} on {alert.acknowledgedAt.toLocaleString()}</div>
          )}
        </div>
        {!alert.acknowledgedAt && (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded font-medium">
            Unacknowledged
          </span>
        )}
      </div>

      <div className="flex gap-2">
        {!alert.acknowledgedAt && onAcknowledge && (
          <button
            onClick={onAcknowledge}
            disabled={isLoading}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Acknowledge
          </button>
        )}
        {alert.actionRequired && onViewResult && alert.resultId && (
          <button
            onClick={onViewResult}
            className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
          >
            View Result
          </button>
        )}
        {onResolve && alert.acknowledgedAt && (
          <button
            onClick={onResolve}
            disabled={isLoading}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Resolve
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Clinical Alerts Panel Component
 */
/**
 * Clinical Alerts Panel Component with Service Integration
 */
export const ClinicalAlertsPanel: FC<ClinicalAlertsPanelProps> = ({
  alerts: initialAlerts = [],
  labId,
  onAcknowledgeAlert,
  onResolveAlert,
  onViewResult,
  maxAlerts = 10,
  autoFetchAlerts = true,
}): JSX.Element => {
  // Data state from hook
  const { alerts: fetchedAlerts, loading, error: hookError } = useAlerts({
    labId,
    autoFetch: autoFetchAlerts,
  });

  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [error, setError] = useState<string>('');

  // UI state
  const [filterSeverity, setFilterSeverity] = useState<AlertSeverity | 'ALL'>('ALL');
  const [filterType, setFilterType] = useState<AlertType | 'ALL'>('ALL');
  const [showAcknowledged, setShowAcknowledged] = useState(false);
  const [loadingAlerts, setLoadingAlerts] = useState<Set<string>>(new Set());

  // Update error state from hook
  useEffect(() => {
    if (hookError) {
      setError(hookError);
    }
  }, [hookError]);

  // Merge fetched alerts with initial alerts
  useEffect(() => {
    if (fetchedAlerts.length > 0) {
      // Transform hook alerts to component alerts
      const transformedAlerts = fetchedAlerts.map(a => ({
        id: a.id,
        type: 'CRITICAL_VALUE' as AlertType,
        severity: a.severity,
        title: a.message,
        message: `Alert for ${a.severity} severity`,
        patientId: a.patientId,
        testId: a.testId,
        value: a.value,
        referenceRange: `${a.normalRange.min}-${a.normalRange.max}`,
        createdAt: new Date(a.timestamp),
        acknowledgedAt: a.acknowledged ? new Date() : undefined,
        acknowledgedBy: a.acknowledgedBy,
        actionRequired: a.severity === 'CRITICAL' || a.severity === 'HIGH',
      }));
      setAlerts(transformedAlerts);
    } else if (initialAlerts.length > 0) {
      setAlerts(initialAlerts);
    }
  }, [fetchedAlerts, initialAlerts]);

  const filteredAlerts = useMemo(() => {
    let filtered = alerts.filter(
      (a) => showAcknowledged || !a.acknowledgedAt
    );

    if (filterSeverity !== 'ALL') {
      filtered = filtered.filter((a) => a.severity === filterSeverity);
    }

    if (filterType !== 'ALL') {
      filtered = filtered.filter((a) => a.type === filterType);
    }

    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return filtered.slice(0, maxAlerts);
  }, [alerts, filterSeverity, filterType, showAcknowledged, maxAlerts]);

  const stats = useMemo(() => {
    return {
      total: alerts.length,
      critical: alerts.filter((a) => a.severity === 'CRITICAL').length,
      high: alerts.filter((a) => a.severity === 'HIGH').length,
      unacknowledged: alerts.filter((a) => !a.acknowledgedAt).length,
      actionRequired: alerts.filter((a) => a.actionRequired).length,
    };
  }, [alerts]);

  const handleAcknowledge = async (alertId: string) => {
    if (!onAcknowledgeAlert) return;
    setLoadingAlerts(new Set(loadingAlerts).add(alertId));
    try {
      await onAcknowledgeAlert(alertId);
    } finally {
      const updated = new Set(loadingAlerts);
      updated.delete(alertId);
      setLoadingAlerts(updated);
    }
  };

  const handleResolve = async (alertId: string) => {
    if (!onResolveAlert) return;
    setLoadingAlerts(new Set(loadingAlerts).add(alertId));
    try {
      await onResolveAlert(alertId);
    } finally {
      const updated = new Set(loadingAlerts);
      updated.delete(alertId);
      setLoadingAlerts(updated);
    }
  };

  return (
    <div className="w-full bg-gray-50 rounded-lg shadow">
      <div className="bg-white border-b border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Clinical Alerts & Notifications</h2>

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
            <p className="text-blue-700 font-semibold">Loading Alerts...</p>
          </div>
        )}

        <div className="grid grid-cols-5 gap-3 mb-6">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs font-medium text-blue-600">Total Alerts</p>
            <p className="text-xl font-bold text-blue-900">{stats.total}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-xs font-medium text-red-600">Critical</p>
            <p className="text-xl font-bold text-red-900">{stats.critical}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <p className="text-xs font-medium text-orange-600">High</p>
            <p className="text-xl font-bold text-orange-900">{stats.high}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <p className="text-xs font-medium text-yellow-600">Unacknowledged</p>
            <p className="text-xl font-bold text-yellow-900">{stats.unacknowledged}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-xs font-medium text-purple-600">Action Required</p>
            <p className="text-xl font-bold text-purple-900">{stats.actionRequired}</p>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as AlertSeverity | 'ALL')}
            className="px-3 py-2 border border-gray-300 rounded text-sm"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">🔴 Critical</option>
            <option value="HIGH">🟠 High</option>
            <option value="MEDIUM">🟡 Medium</option>
            <option value="LOW">🔵 Low</option>
            <option value="INFO">ℹ️ Info</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as AlertType | 'ALL')}
            className="px-3 py-2 border border-gray-300 rounded text-sm"
          >
            <option value="ALL">All Alert Types</option>
            <option value="CRITICAL_VALUE">⚠️ Critical Value</option>
            <option value="DELTA_CHANGE">📊 Delta Change</option>
            <option value="QC_FAILURE">❌ QC Failure</option>
            <option value="REFLEX_REQUIRED">🔄 Reflex Required</option>
            <option value="DUPLICATE">⚡ Duplicate</option>
            <option value="REVIEW_PENDING">👁️ Review Pending</option>
          </select>

          <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded text-sm cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={showAcknowledged}
              onChange={(e) => setShowAcknowledged(e.target.checked)}
              className="w-4 h-4"
            />
            Show Acknowledged
          </label>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">
              {stats.total === 0
                ? 'No alerts at this time.'
                : 'No alerts matching the selected filters.'}
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <AlertItem
              key={alert.id}
              alert={alert}
              onAcknowledge={() => handleAcknowledge(alert.id)}
              onResolve={() => handleResolve(alert.id)}
              onViewResult={() => alert.resultId && onViewResult?.(alert.resultId)}
              isLoading={loadingAlerts.has(alert.id)}
            />
          ))
        )}
      </div>

      {filteredAlerts.length < alerts.filter((a) => showAcknowledged || !a.acknowledgedAt).length && (
        <div className="bg-gray-100 border-t border-gray-200 px-6 py-3 text-sm text-gray-600">
          Showing {filteredAlerts.length} of {alerts.filter((a) => showAcknowledged || !a.acknowledgedAt).length} alerts (limited to {maxAlerts})
        </div>
      )}
    </div>
  );
};

export default ClinicalAlertsPanel;