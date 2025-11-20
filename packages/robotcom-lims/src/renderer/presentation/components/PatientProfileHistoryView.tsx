/**
 * PatientProfileHistoryView.tsx - Patient Profile & History with Service Integration
 * 
 * Comprehensive patient profile view with:
 * - Patient demographics and contact information
 * - Complete test history with results and trends
 * - Test result trends visualization
 * - Previous values and delta calculations
 * - Patient notes and clinical history
 * - Recent abnormal results highlighting
 * - Test frequency and patterns
 * - Patient comparison and reference ranges
 * - Backend service integration for patient data fetching
 * 
 * Author: David Navas
 * Date: November 19, 2025
 */

import { FC, useState, useMemo, useEffect } from 'react';
import { usePatient } from '../hooks/usePatient';

/**
 * Patient data structure
 */
interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'M' | 'F' | 'O';
  mrn: string;
  email?: string;
  phone?: string;
  address?: string;
  emergencyContact?: string;
  referringPhysician?: string;
  notes?: string;
}

/**
 * Test result structure
 */
interface TestResult {
  id: string;
  testId: string;
  testName: string;
  value: number;
  unit: string;
  status: 'NORMAL' | 'LOW' | 'HIGH' | 'CRITICAL';
  referenceMin: number;
  referenceMax: number;
  createdAt: Date;
  notes?: string;
}

interface PatientProfileHistoryViewProps {
  patient?: Patient;
  testResults?: TestResult[];
  patientId?: string;
  onEditPatient?: () => void;
  onViewTestDetails?: (testId: string) => void;
  onExportHistory?: () => void;
  autoFetchData?: boolean;
}

/**
 * Status indicator badge
 */
const StatusIndicator: FC<{ status: TestResult['status'] }> = ({ status }): JSX.Element => {
  const config: Record<TestResult['status'], { bg: string; text: string; label: string }> = {
    NORMAL: { bg: 'bg-green-100', text: 'text-green-800', label: 'Normal' },
    LOW: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Low' },
    HIGH: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'High' },
    CRITICAL: { bg: 'bg-red-100', text: 'text-red-800', label: 'Critical' },
  };
  const c = config[status];
  return <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${c.bg} ${c.text}`}>{c.label}</span>;
};

/**
 * Calculate age from date of birth
 */
const calculateAge = (dob: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

/**
 * Format date
 */
const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Patient Profile & History View Component with Service Integration
 */
export const PatientProfileHistoryView: FC<PatientProfileHistoryViewProps> = ({
  patient: initialPatient,
  testResults: initialResults = [],
  patientId: initialPatientId,
  onEditPatient,
  onViewTestDetails,
  onExportHistory,
  autoFetchData = true,
}): JSX.Element => {
  // Use custom hook for patient data fetching
  const { patient: fetchedPatient, loading, error } = usePatient({
    patientId: initialPatientId || initialPatient?.id,
    autoFetch: autoFetchData,
  });

  // Data state
  const [patient, setPatient] = useState<Patient | undefined>(initialPatient || fetchedPatient);

  // Update patient when fetched from service
  useEffect(() => {
    if (fetchedPatient) {
      setPatient(fetchedPatient as unknown as Patient);
    }
  }, [fetchedPatient]);

  const [testResults] = useState<TestResult[]>(initialResults);

  // UI state
  const [sortBy, setSortBy] = useState<'date' | 'test' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  /**
   * Sorted and grouped results
   */
  const processedResults = useMemo(() => {
    const sorted = [...testResults].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'test':
          comparison = a.testName.localeCompare(b.testName);
          break;
        case 'status':
          const statusOrder = { CRITICAL: 3, HIGH: 2, LOW: 1, NORMAL: 0 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    // Group by test
    const grouped: Record<string, TestResult[]> = {};
    sorted.forEach((result) => {
      if (!grouped[result.testId]) {
        grouped[result.testId] = [];
      }
      grouped[result.testId].push(result);
    });

    return { sorted, grouped };
  }, [testResults, sortBy, sortOrder]);

  /**
   * Calculate statistics
   */
  const stats = useMemo(() => {
    const abnormal = testResults.filter((r) => r.status !== 'NORMAL').length;
    const critical = testResults.filter((r) => r.status === 'CRITICAL').length;
    const recentAbnormal = testResults
      .filter((r) => r.status !== 'NORMAL' && new Date(r.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000)
      .length;

    return {
      total: testResults.length,
      unique: Object.keys(processedResults.grouped).length,
      abnormal,
      critical,
      recentAbnormal,
      lastTestDate: testResults.length > 0 ? new Date(testResults[0].createdAt) : null,
    };
  }, [testResults, processedResults.grouped]);

  /**
   * Get trend for a test
   */
  const getTrendForTest = (testId: string): { trend: string; percent: number } | null => {
    const results = processedResults.grouped[testId];
    if (!results || results.length < 2) return null;

    const latest = results[results.length - 1].value;
    const previous = results[results.length - 2].value;
    const change = ((latest - previous) / previous) * 100;

    return {
      trend: change > 0 ? '↑' : change < 0 ? '↓' : '→',
      percent: Math.abs(change),
    };
  };

  const age = patient ? calculateAge(new Date(patient.dateOfBirth)) : 0;

  // Show loading state
  if (loading) {
    return (
      <div className="w-full bg-gray-50 rounded-lg shadow p-6">
        <p className="text-center text-gray-600">Loading patient data...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full bg-gray-50 rounded-lg shadow p-6">
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-red-700 font-semibold">✗ Error</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Show message if no patient data
  if (!patient) {
    return (
      <div className="w-full bg-gray-50 rounded-lg shadow p-6">
        <p className="text-center text-gray-600">No patient data available</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 rounded-lg shadow">
      {/* Header with patient info */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{patient.firstName} {patient.lastName}</h1>
            <p className="text-gray-600 mt-1">MRN: {patient.mrn} | DOB: {formatDate(new Date(patient.dateOfBirth))} ({age} years)</p>
          </div>
          {onEditPatient && (
            <button
              onClick={onEditPatient}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Edit Patient
            </button>
          )}
        </div>

        {/* Demographics grid */}
        <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Gender</p>
            <p className="text-sm font-semibold text-gray-900">{patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Email</p>
            <p className="text-sm font-semibold text-gray-900">{patient.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Phone</p>
            <p className="text-sm font-semibold text-gray-900">{patient.phone || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Physician</p>
            <p className="text-sm font-semibold text-gray-900">{patient.referringPhysician || 'N/A'}</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-5 gap-3">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs font-medium text-blue-600">Total Results</p>
            <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-xs font-medium text-purple-600">Unique Tests</p>
            <p className="text-2xl font-bold text-purple-900">{stats.unique}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <p className="text-xs font-medium text-orange-600">Abnormal</p>
            <p className="text-2xl font-bold text-orange-900">{stats.abnormal}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-xs font-medium text-red-600">Critical</p>
            <p className="text-2xl font-bold text-red-900">{stats.critical}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <p className="text-xs font-medium text-yellow-600">Recent Abnormal</p>
            <p className="text-2xl font-bold text-yellow-900">{stats.recentAbnormal}</p>
          </div>
        </div>
      </div>

      {/* Patient notes */}
      {patient.notes && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Clinical Notes</h3>
          <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded">{patient.notes}</p>
        </div>
      )}

      {/* Test history controls */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex gap-4 items-center">
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'test' | 'status')}
            className="px-3 py-2 border border-gray-300 rounded text-sm"
          >
            <option value="date">Sort by Date</option>
            <option value="test">Sort by Test</option>
            <option value="status">Sort by Status</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
          >
            {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
          </button>
        </div>
        {onExportHistory && (
          <button
            onClick={onExportHistory}
            className="ml-auto px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            Export History
          </button>
        )}
      </div>

      {/* Test history table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white">
          <thead className="bg-gray-100 border-b border-gray-200 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Test Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Value</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Trend</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {processedResults.sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No test results available for this patient.
                </td>
              </tr>
            ) : (
              processedResults.sorted.map((result) => {
                const trend = getTrendForTest(result.testId);
                return (
                  <tr
                    key={result.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${selectedTest === result.testId ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedTest(selectedTest === result.testId ? null : result.testId)}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{result.testName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(new Date(result.createdAt))}</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">
                      {result.value} {result.unit}
                      <span className="text-xs text-gray-500 ml-2">({result.referenceMin}-{result.referenceMax})</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <StatusIndicator status={result.status} />
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {trend ? (
                        <span className={trend.trend === '↑' ? 'text-red-600' : trend.trend === '↓' ? 'text-blue-600' : 'text-gray-600'}>
                          {trend.trend} {trend.percent.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {onViewTestDetails && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewTestDetails(result.testId);
                          }}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          Details
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Test details panel */}
      {selectedTest && processedResults.grouped[selectedTest] && (
        <div className="bg-white border-t border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {processedResults.grouped[selectedTest][0].testName} - History
          </h3>
          <div className="space-y-2">
            {processedResults.grouped[selectedTest].reverse().map((result, idx) => (
              <div key={result.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="text-sm font-medium text-gray-900">{formatDate(new Date(result.createdAt))}</p>
                  {result.notes && <p className="text-xs text-gray-600 mt-1">{result.notes}</p>}
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-semibold text-gray-900">{result.value} {result.unit}</p>
                  <div className="flex gap-2 items-center mt-1">
                    <StatusIndicator status={result.status} />
                    {idx > 0 && processedResults.grouped[selectedTest][idx - 1] && (
                      <span className="text-xs text-gray-600">
                        {((result.value - processedResults.grouped[selectedTest][idx - 1].value) / processedResults.grouped[selectedTest][idx - 1].value * 100).toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientProfileHistoryView;