/**
 * ClinicalResultsDashboard.tsx - Clinical Results Dashboard with Service Integration
 * 
 * Comprehensive dashboard for viewing and analyzing laboratory results with:
 * - Results table with sorting and filtering
 * - Status indicators (Normal, Low, High, Critical)
 * - Result charts and trend visualization
 * - Quick actions for result management
 * - QC tracking and quality indicators
 * - Search and filtering capabilities
 * - Backend service integration for result fetching
 * 
 * Author: David Navas
 * Date: November 19, 2025
 */

import { useState, useMemo, FC, useEffect } from 'react';
import { useResults } from '../hooks/useResults';

/**
 * Result data structure
 */
interface Result {
  id: string;
  patientId: string;
  patientName: string;
  sampleId: string;
  testId: string;
  testName: string;
  value: number;
  unit: string;
  status: 'NORMAL' | 'LOW' | 'HIGH' | 'CRITICAL';
  referenceMin: number;
  referenceMax: number;
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  qcFlag: boolean;
  notes?: string;
}

interface ClinicalResultsDashboardProps {
  results?: Result[];
  labId?: string;
  onViewDetails?: (resultId: string) => void;
  onReviewResult?: (resultId: string) => void;
  onExportResults?: (resultIds: string[]) => void;
  autoFetchResults?: boolean;
}

/**
 * Status badge component
 */
const StatusBadge: FC<{ status: Result['status'] }> = ({ status }) => {
  const statusConfig = {
    NORMAL: { bg: 'bg-green-100', text: 'text-green-800', icon: '✓' },
    LOW: { bg: 'bg-orange-100', text: 'text-orange-800', icon: '↓' },
    HIGH: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '↑' },
    CRITICAL: { bg: 'bg-red-100', text: 'text-red-800', icon: '⚠️' },
  };

  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.icon} {status}
    </span>
  );
};

/**
 * QC Badge component
 */
const QCBadge: FC<{ qcFlag: boolean }> = ({ qcFlag }) => {
  return qcFlag ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
      QC
    </span>
  ) : null;
};

/**
 * Clinical Results Dashboard Component with Service Integration
 */
export const ClinicalResultsDashboard: FC<ClinicalResultsDashboardProps> = ({
  results: initialResults = [],
  labId,
  onViewDetails,
  onReviewResult,
  onExportResults,
  autoFetchResults = true,
}) => {
  // Use custom hook for result fetching
  const { results: fetchedResults, loading, error } = useResults({
    labId,
    autoFetch: autoFetchResults,
  });

  // Data state
  const [results, setResults] = useState<Result[]>(initialResults);

  // Update results when fetched from service
  useEffect(() => {
    if (fetchedResults && fetchedResults.length > 0) {
      setResults(fetchedResults as unknown as Result[]);
    }
  }, [fetchedResults]);

  // Filter and sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Result['status'] | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'patient'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedResults, setSelectedResults] = useState<Set<string>>(new Set());

  /**
   * Filtered and sorted results
   */
  const filteredResults = useMemo(() => {
    let filtered = results;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.patientName.toLowerCase().includes(term) ||
          r.patientId.toLowerCase().includes(term) ||
          r.testName.toLowerCase().includes(term) ||
          r.sampleId.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    // Apply sorting
    filtered = filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'status':
          const statusOrder = { CRITICAL: 3, HIGH: 2, LOW: 1, NORMAL: 0 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        case 'patient':
          comparison = a.patientName.localeCompare(b.patientName);
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [results, searchTerm, statusFilter, sortBy, sortOrder]);

  /**
   * Calculate statistics
   */
  const statistics = useMemo(() => {
    return {
      total: results.length,
      normal: results.filter((r) => r.status === 'NORMAL').length,
      abnormal: results.filter((r) => r.status !== 'NORMAL').length,
      critical: results.filter((r) => r.status === 'CRITICAL').length,
      qc: results.filter((r) => r.qcFlag).length,
      reviewPending: results.filter((r) => !r.reviewedAt).length,
    };
  }, [results]);

  /**
   * Toggle result selection
   */
  const toggleResultSelection = (resultId: string) => {
    const newSelected = new Set(selectedResults);
    if (newSelected.has(resultId)) {
      newSelected.delete(resultId);
    } else {
      newSelected.add(resultId);
    }
    setSelectedResults(newSelected);
  };

  /**
   * Select all visible results
   */
  const toggleSelectAll = () => {
    if (selectedResults.size === filteredResults.length) {
      setSelectedResults(new Set());
    } else {
      setSelectedResults(new Set(filteredResults.map((r) => r.id)));
    }
  };

  /**
   * Format date
   */
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Format value with unit
   */
  const formatValue = (value: number, unit: string, refMin: number, refMax: number) => {
    return `${value} ${unit} (${refMin}-${refMax})`;
  };

  return (
    <div className="w-full bg-gray-50 rounded-lg shadow">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Clinical Results Dashboard</h2>

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
            <p className="text-blue-700 font-semibold">Loading Results...</p>
            <p className="text-blue-600 text-sm">Fetching data from server</p>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-600">Total Results</p>
            <p className="text-2xl font-bold text-blue-900">{statistics.total}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm font-medium text-green-600">Normal</p>
            <p className="text-2xl font-bold text-green-900">{statistics.normal}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm font-medium text-yellow-600">Abnormal</p>
            <p className="text-2xl font-bold text-yellow-900">{statistics.abnormal}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm font-medium text-red-600">Critical</p>
            <p className="text-2xl font-bold text-red-900">{statistics.critical}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm font-medium text-purple-600">QC Samples</p>
            <p className="text-2xl font-bold text-purple-900">{statistics.qc}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-sm font-medium text-orange-600">Pending Review</p>
            <p className="text-2xl font-bold text-orange-900">{statistics.reviewPending}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Search by patient name, ID, test name, or sample ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Result['status'] | 'ALL')}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="ALL">All Status</option>
              <option value="NORMAL">✓ Normal</option>
              <option value="LOW">↓ Low</option>
              <option value="HIGH">↑ High</option>
              <option value="CRITICAL">⚠️ Critical</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'status' | 'patient')}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="date">Sort by Date</option>
              <option value="status">Sort by Status</option>
              <option value="patient">Sort by Patient</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
            </button>
          </div>
        </div>
      </div>

      {/* Bulk actions toolbar */}
      {selectedResults.size > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex items-center justify-between">
          <p className="text-sm font-medium text-blue-900">
            {selectedResults.size} result{selectedResults.size !== 1 ? 's' : ''} selected
          </p>
          {onExportResults && (
            <button
              onClick={() => onExportResults(Array.from(selectedResults))}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Export Selected
            </button>
          )}
        </div>
      )}

      {/* Results Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedResults.size === filteredResults.length && filteredResults.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 cursor-pointer"
                />
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Patient</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Test</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Value</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Review</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  No results found matching the selected criteria.
                </td>
              </tr>
            ) : (
              filteredResults.map((result) => (
                <tr key={result.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={selectedResults.has(result.id)}
                      onChange={() => toggleResultSelection(result.id)}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <div className="font-medium text-gray-900">{result.patientName}</div>
                    <div className="text-gray-500 text-xs">{result.patientId}</div>
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <div className="font-medium text-gray-900">{result.testName}</div>
                    <div className="text-gray-500 text-xs">{result.sampleId}</div>
                  </td>
                  <td className="px-6 py-3 text-sm font-mono">
                    {formatValue(result.value, result.unit, result.referenceMin, result.referenceMax)}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={result.status} />
                      {result.qcFlag && <QCBadge qcFlag={true} />}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {formatDate(result.createdAt)}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    {result.reviewedAt ? (
                      <div>
                        <p className="text-gray-900">✓ Reviewed</p>
                        <p className="text-gray-500 text-xs">by {result.reviewedBy}</p>
                      </div>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <div className="flex gap-2">
                      {onViewDetails && (
                        <button
                          onClick={() => onViewDetails(result.id)}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          Details
                        </button>
                      )}
                      {onReviewResult && !result.reviewedAt && (
                        <button
                          onClick={() => onReviewResult(result.id)}
                          className="text-green-600 hover:text-green-900 font-medium"
                        >
                          Review
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 border-t border-gray-200 px-6 py-3 text-sm text-gray-600">
        Showing {filteredResults.length} of {results.length} results
      </div>
    </div>
  );
};

export default ClinicalResultsDashboard;