/**
 * AuditLogComplianceDashboard.tsx - Audit Log & Compliance with Service Integration
 * 
 * Comprehensive audit logging and compliance reporting interface with:
 * - Complete audit trail of all laboratory system activities
 * - User action tracking and accountability
 * - Data modification history with before/after values
 * - Compliance violation detection and reporting
 * - HIPAA audit log requirements
 * - Result approval chain tracking
 * - System event logging
 * - Compliance export and reporting
 * - Backend service integration
 * 
 * Author: David Navas
 * Date: November 19, 2025
 */

import { FC, useState, useMemo, useEffect } from 'react';
import { useAuditLogs } from '../hooks/useAuditLogs';

/**
 * Audit log event types
 */
type EventType = 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'EXPORT' | 'APPROVE' | 'REJECT' | 'LOGIN' | 'LOGOUT' | 'ERROR';

/**
 * Entity types that can be audited
 */
type EntityType = 'RESULT' | 'PATIENT' | 'USER' | 'RULE' | 'SAMPLE' | 'TEST' | 'SYSTEM';

/**
 * Audit log entry structure
 */
interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  eventType: EventType;
  entityType: EntityType;
  entityId: string;
  entityName: string;
  action: string;
  description: string;
  beforeValue?: string;
  afterValue?: string;
  ipAddress?: string;
  userAgent?: string;
  status: 'SUCCESS' | 'FAILED';
  complianceViolation: boolean;
  comments?: string;
}

interface AuditLogComplianceDashboardProps {
  auditLogs?: AuditLogEntry[];
  labId?: string;
  onViewDetails?: (logId: string) => void;
  onExportLogs?: (logIds: string[], format: 'csv' | 'pdf') => Promise<void>;
  onAddComment?: (logId: string, comment: string) => Promise<void>;
  autoFetchLogs?: boolean;
}

/**
 * Event type badge component
 */
const EventTypeBadge: FC<{ type: EventType }> = ({ type }): JSX.Element => {
  const iconMap: Record<EventType, string> = {
    CREATE: '+', UPDATE: '~', DELETE: 'X', VIEW: 'V', EXPORT: 'E',
    APPROVE: 'A', REJECT: 'R', LOGIN: 'L', LOGOUT: 'O', ERROR: 'E',
  };
  const bgMap: Record<EventType, string> = {
    CREATE: 'bg-green-100', UPDATE: 'bg-blue-100', DELETE: 'bg-red-100', VIEW: 'bg-gray-100', EXPORT: 'bg-purple-100',
    APPROVE: 'bg-green-100', REJECT: 'bg-orange-100', LOGIN: 'bg-cyan-100', LOGOUT: 'bg-slate-100', ERROR: 'bg-red-100',
  };
  const textMap: Record<EventType, string> = {
    CREATE: 'text-green-800', UPDATE: 'text-blue-800', DELETE: 'text-red-800', VIEW: 'text-gray-800', EXPORT: 'text-purple-800',
    APPROVE: 'text-green-800', REJECT: 'text-orange-800', LOGIN: 'text-cyan-800', LOGOUT: 'text-slate-800', ERROR: 'text-red-800',
  };

  return (
    <span className={`inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full ${bgMap[type]} ${textMap[type]}`}>
      {iconMap[type]}
    </span>
  );
};

/**
 * Entity type badge component
 */
const EntityTypeBadge: FC<{ type: EntityType }> = ({ type }): JSX.Element => {
  const labels: Record<EntityType, string> = {
    RESULT: 'Result',
    PATIENT: 'Patient',
    USER: 'User',
    RULE: 'Rule',
    SAMPLE: 'Sample',
    TEST: 'Test',
    SYSTEM: 'System',
  };
  return (
    <span className="inline-block px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded">
      {labels[type]}
    </span>
  );
};

/**
 * Audit Log & Compliance Dashboard Component
 */
/**
 * Audit Log Compliance Dashboard Component with Service Integration
 */
export const AuditLogComplianceDashboard: FC<AuditLogComplianceDashboardProps> = ({
  auditLogs: initialLogs = [],
  labId,
  onExportLogs,
  onAddComment,
  autoFetchLogs = true,
}): JSX.Element => {
  // Data state from hook
  const { logs: fetchedLogs, loading, error: hookError } = useAuditLogs({
    labId,
    autoFetch: autoFetchLogs,
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialLogs);
  const [error, setError] = useState<string>('');

  // UI state
  const [sortBy, setSortBy] = useState<'time' | 'user' | 'type'>('time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterEvent, setFilterEvent] = useState<EventType | 'ALL'>('ALL');
  const [filterEntity, setFilterEntity] = useState<EntityType | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'SUCCESS' | 'FAILED' | 'VIOLATION'>('ALL');
  const [selectedLog, setSelectedLog] = useState<string | null>(null);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<string>('');

  // Update error state from hook
  useEffect(() => {
    if (hookError) {
      setError(hookError);
    }
  }, [hookError]);

  // Merge fetched logs with initial logs
  useEffect(() => {
    if (fetchedLogs.length > 0) {
      // Transform hook logs to component logs
      const transformedLogs = fetchedLogs.map(l => ({
        id: l.id,
        userId: l.userId,
        userName: l.userId,
        action: l.action,
        eventType: l.action as EventType,
        entityType: l.entityType as EntityType,
        entityId: l.entityId,
        entityName: `${l.entityType} ${l.entityId.substring(0, 8)}`,
        timestamp: new Date(l.timestamp),
        status: l.status as 'SUCCESS' | 'FAILED',
        ipAddress: l.ipAddress || '',
        userAgent: l.userAgent || '',
        beforeValue: l.oldValue,
        afterValue: l.newValue,
        description: l.errorMessage || `${l.action} on ${l.entityType}`,
        complianceViolation: l.status === 'FAILED',
        comments: l.comments,
      }));
      setAuditLogs(transformedLogs);
    } else if (initialLogs.length > 0) {
      setAuditLogs(initialLogs);
    }
  }, [fetchedLogs, initialLogs]);

  /**
   * Filtered and sorted logs
   */
  const filteredLogs = useMemo(() => {
    let filtered = auditLogs;

    if (filterEvent !== 'ALL') {
      filtered = filtered.filter((l) => l.eventType === filterEvent);
    }

    if (filterEntity !== 'ALL') {
      filtered = filtered.filter((l) => l.entityType === filterEntity);
    }

    if (filterStatus === 'VIOLATION') {
      filtered = filtered.filter((l) => l.complianceViolation);
    } else if (filterStatus !== 'ALL') {
      filtered = filtered.filter((l) => l.status === filterStatus);
    }

    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'time':
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
        case 'user':
          comparison = a.userName.localeCompare(b.userName);
          break;
        case 'type':
          comparison = a.eventType.localeCompare(b.eventType);
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [auditLogs, filterEvent, filterEntity, filterStatus, sortBy, sortOrder]);

  /**
   * Calculate statistics
   */
  const stats = useMemo(() => {
    return {
      total: auditLogs.length,
      violations: auditLogs.filter((l) => l.complianceViolation).length,
      errors: auditLogs.filter((l) => l.status === 'FAILED').length,
      creates: auditLogs.filter((l) => l.eventType === 'CREATE').length,
      updates: auditLogs.filter((l) => l.eventType === 'UPDATE').length,
      deletes: auditLogs.filter((l) => l.eventType === 'DELETE').length,
      uniqueUsers: new Set(auditLogs.map((l) => l.userId)).size,
    };
  }, [auditLogs]);

  /**
   * Format date and time
   */
  const formatDateTime = (date: Date): string => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  /**
   * Handle export
   */
  const handleExport = async (format: 'csv' | 'pdf') => {
    if (!onExportLogs) return;
    await onExportLogs(
      selectedLog ? [selectedLog] : filteredLogs.map((l) => l.id),
      format
    );
  };

  /**
   * Handle add comment
   */
  const handleAddComment = async (logId: string) => {
    if (!onAddComment || !newComment.trim()) return;
    await onAddComment(logId, newComment);
    setNewComment('');
  };

  return (
    <div className="w-full bg-gray-50 rounded-lg shadow">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Audit Log & Compliance Dashboard</h2>

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
            <p className="text-blue-700 font-semibold">Loading Audit Logs...</p>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs font-medium text-blue-600">Total Events</p>
            <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-xs font-medium text-red-600">Violations</p>
            <p className="text-2xl font-bold text-red-900">{stats.violations}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <p className="text-xs font-medium text-orange-600">Errors</p>
            <p className="text-2xl font-bold text-orange-900">{stats.errors}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs font-medium text-green-600">Creates</p>
            <p className="text-2xl font-bold text-green-900">{stats.creates}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs font-medium text-blue-600">Updates</p>
            <p className="text-2xl font-bold text-blue-900">{stats.updates}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-xs font-medium text-purple-600">Deletes</p>
            <p className="text-2xl font-bold text-purple-900">{stats.deletes}</p>
          </div>
          <div className="bg-cyan-50 rounded-lg p-3">
            <p className="text-xs font-medium text-cyan-600">Users</p>
            <p className="text-2xl font-bold text-cyan-900">{stats.uniqueUsers}</p>
          </div>
        </div>

        {/* Filters and controls */}
        <div className="space-y-3">
          <div className="flex gap-3 flex-wrap">
            <select
              value={filterEvent}
              onChange={(e) => setFilterEvent(e.target.value as EventType | 'ALL')}
              className="px-3 py-2 border border-gray-300 rounded text-sm"
            >
              <option value="ALL">All Events</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="VIEW">View</option>
              <option value="EXPORT">Export</option>
              <option value="APPROVE">Approve</option>
              <option value="REJECT">Reject</option>
            </select>

            <select
              value={filterEntity}
              onChange={(e) => setFilterEntity(e.target.value as EntityType | 'ALL')}
              className="px-3 py-2 border border-gray-300 rounded text-sm"
            >
              <option value="ALL">All Entities</option>
              <option value="RESULT">Result</option>
              <option value="PATIENT">Patient</option>
              <option value="USER">User</option>
              <option value="RULE">Rule</option>
              <option value="SAMPLE">Sample</option>
              <option value="TEST">Test</option>
              <option value="SYSTEM">System</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'ALL' | 'SUCCESS' | 'FAILED' | 'VIOLATION')}
              className="px-3 py-2 border border-gray-300 rounded text-sm"
            >
              <option value="ALL">All Status</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
              <option value="VIOLATION">Violations Only</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'time' | 'user' | 'type')}
              className="px-3 py-2 border border-gray-300 rounded text-sm"
            >
              <option value="time">Sort by Time</option>
              <option value="user">Sort by User</option>
              <option value="type">Sort by Type</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
            </button>
          </div>

          {selectedLog && onExportLogs && (
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('csv')}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Export CSV
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Export PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Audit logs table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white">
          <thead className="bg-gray-100 border-b border-gray-200 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedLog !== null}
                  onChange={() => setSelectedLog(selectedLog ? null : (filteredLogs[0]?.id || null))}
                  className="w-4 h-4"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Time</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">User</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Event</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Entity</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No audit logs matching the selected filters.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className={`border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                    log.complianceViolation ? 'bg-red-50' : ''
                  } ${expandedLog === log.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedLog === log.id}
                      onChange={(e) => {
                        e.stopPropagation();
                        setSelectedLog(selectedLog === log.id ? null : log.id);
                      }}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDateTime(new Date(log.timestamp))}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{log.userName}</td>
                  <td className="px-4 py-3">
                    <EventTypeBadge type={log.eventType} />
                  </td>
                  <td className="px-4 py-3">
                    <EntityTypeBadge type={log.entityType} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{log.description}</td>
                  <td className="px-4 py-3 text-sm">
                    {log.complianceViolation ? (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                        VIOLATION
                      </span>
                    ) : log.status === 'FAILED' ? (
                      <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded">
                        FAILED
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                        SUCCESS
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Expanded log details */}
      {expandedLog && filteredLogs.find((l) => l.id === expandedLog) && (
        <div className="bg-gray-50 border-t border-gray-200 p-6">
          {(() => {
            const log = filteredLogs.find((l) => l.id === expandedLog)!;
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Entity</p>
                    <p className="text-sm font-semibold text-gray-900">{log.entityName}</p>
                    <p className="text-xs text-gray-600">ID: {log.entityId}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">IP Address</p>
                    <p className="text-sm font-mono text-gray-900">{log.ipAddress || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">User Agent</p>
                    <p className="text-xs text-gray-600 truncate">{log.userAgent || 'N/A'}</p>
                  </div>
                </div>

                {(log.beforeValue || log.afterValue) && (
                  <div className="grid grid-cols-2 gap-4">
                    {log.beforeValue && (
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-2">Before Value</p>
                        <code className="text-xs bg-white p-2 rounded border border-gray-300 block max-h-20 overflow-y-auto font-mono">
                          {log.beforeValue}
                        </code>
                      </div>
                    )}
                    {log.afterValue && (
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-2">After Value</p>
                        <code className="text-xs bg-white p-2 rounded border border-gray-300 block max-h-20 overflow-y-auto font-mono">
                          {log.afterValue}
                        </code>
                      </div>
                    )}
                  </div>
                )}

                {log.comments && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">Comments</p>
                    <p className="text-sm text-gray-700 p-2 bg-white rounded border border-gray-300">{log.comments}</p>
                  </div>
                )}

                {onAddComment && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-2">Add Comment</p>
                    <div className="flex gap-2">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a compliance note or comment..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm resize-none"
                        rows={2}
                      />
                      <button
                        onClick={() => handleAddComment(log.id)}
                        className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 px-6 py-3 text-sm text-gray-600">
        Showing {filteredLogs.length} of {auditLogs.length} audit log entries
      </div>
    </div>
  );
};

export default AuditLogComplianceDashboard;