/**
 * ResultDashboard Component
 * Displays laboratory test results with interpretations, delta checks, and reflex test suggestions
 * 
 * Features:
 * - Test result display with abnormality flags (NORMAL/LOW/HIGH/CRITICAL)
 * - Delta check alerts for anomalous value changes
 * - Reflex test suggestions from ReflexTestingEngine
 * - Critical value warnings with visual highlighting
 * - Result interpretation with clinical guidance
 * 
 * @author David Navas
 * @version 1.0
 */

import React, { useState } from 'react';
import './ResultDashboard.css';
import DeltaCheckAlert from './DeltaCheckAlert';
import ReflexTestList from './ReflexTestList';
import CriticalValuePopup from './CriticalValuePopup';

/**
 * Type definitions for result data structures
 */
interface TestResult {
  testId: string;
  testName: string;
  value: number;
  unit: string;
  normalRange: string;
  abnormalStatus: 'NORMAL' | 'LOW' | 'HIGH' | 'CRITICAL';
  referenceRange?: string;
  collectionTime?: Date;
  resultTime?: Date;
  analyzerId?: string;
  technician?: string;
}

interface PatientInfo {
  patientID: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'M' | 'F';
  dateOfBirth: Date;
}

interface SampleInfo {
  sampleNumber: string;
  sampleType: string;
  collectionDate: Date;
  receivedDate: Date;
  status: 'pending' | 'processing' | 'complete' | 'error';
}

interface DeltaCheckData {
  testId: string;
  triggered: boolean;
  percentChange?: number;
  message?: string;
  recommendation?: string;
  severity?: 'WARNING' | 'ALERT' | 'CRITICAL';
}

interface ReflexTestData {
  testId: string;
  testName: string;
  reason: string;
  priority: number;
  status: 'pending' | 'ordered' | 'completed';
}

interface CriticalValueData {
  testId: string;
  testName: string;
  value: number;
  unit: string;
  message: string;
  notificationActions: string[];
  severity: 'CRITICAL' | 'PANIC';
}

interface ResultDashboardProps {
  patientInfo: PatientInfo;
  sampleInfo: SampleInfo;
  results: TestResult[];
  deltaChecks?: DeltaCheckData[];
  reflexTests?: ReflexTestData[];
  criticalValues?: CriticalValueData[];
  onPrintReport?: () => void;
  onExportCSV?: () => void;
  onRefresh?: () => void;
}

/**
 * ResultDashboard Component
 * Main dashboard for displaying laboratory results with all automation features
 */
const ResultDashboard: React.FC<ResultDashboardProps> = ({
  patientInfo,
  sampleInfo,
  results,
  deltaChecks = [],
  reflexTests = [],
  criticalValues = [],
  onPrintReport,
  onExportCSV,
  onRefresh
}) => {
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());
  const [selectedCritical, setSelectedCritical] = useState<CriticalValueData | null>(null);
  const [filterAbnormal, setFilterAbnormal] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'value' | 'status'>('name');

  /**
   * Toggle result expansion to show details
   */
  const toggleResultExpansion = (testId: string) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(testId)) {
      newExpanded.delete(testId);
    } else {
      newExpanded.add(testId);
    }
    setExpandedResults(newExpanded);
  };

  /**
   * Get CSS class for abnormal status badge
   */
  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'NORMAL':
        return 'status-normal';
      case 'LOW':
        return 'status-low';
      case 'HIGH':
        return 'status-high';
      case 'CRITICAL':
        return 'status-critical';
      default:
        return 'status-normal';
    }
  };

  /**
   * Filter results based on selected filters
   */
  const getFilteredResults = (): TestResult[] => {
    let filtered = results;
    
    if (filterAbnormal) {
      filtered = filtered.filter(r => r.abnormalStatus !== 'NORMAL');
    }

    // Sort results
    switch (sortBy) {
      case 'value':
        filtered.sort((a, b) => a.value - b.value);
        break;
      case 'status':
        const statusOrder = { CRITICAL: 0, HIGH: 1, LOW: 2, NORMAL: 3 };
        filtered.sort((a, b) => 
          (statusOrder[a.abnormalStatus as keyof typeof statusOrder] || 4) - 
          (statusOrder[b.abnormalStatus as keyof typeof statusOrder] || 4)
        );
        break;
      case 'name':
      default:
        filtered.sort((a, b) => a.testName.localeCompare(b.testName));
        break;
    }

    return filtered;
  };

  /**
   * Get delta check alert for a specific test
   */
  const getDeltaCheckForTest = (testId: string): DeltaCheckData | undefined => {
    return deltaChecks.find(dc => dc.testId === testId && dc.triggered);
  };

  /**
   * Get reflex tests for a specific result
   */
  const getReflexTestsForResult = (testId: string): ReflexTestData[] => {
    return reflexTests.filter(rt => rt.testId === testId);
  };

  /**
   * Format time for display
   */
  const formatTime = (date?: Date): string => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  /**
   * Format date for display
   */
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const filteredResults = getFilteredResults();
  const hasCriticalValues = criticalValues.length > 0;

  return (
    <div className="result-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="patient-section">
          <h1 className="patient-name">
            {patientInfo.firstName} {patientInfo.lastName}
          </h1>
          <div className="patient-info-grid">
            <div className="info-item">
              <span className="label">Patient ID:</span>
              <span className="value">{patientInfo.patientID}</span>
            </div>
            <div className="info-item">
              <span className="label">Age/Gender:</span>
              <span className="value">{patientInfo.age} / {patientInfo.gender}</span>
            </div>
            <div className="info-item">
              <span className="label">Sample #:</span>
              <span className="value">{sampleInfo.sampleNumber}</span>
            </div>
            <div className="info-item">
              <span className="label">Sample Type:</span>
              <span className="value">{sampleInfo.sampleType}</span>
            </div>
            <div className="info-item">
              <span className="label">Collected:</span>
              <span className="value">{formatDate(sampleInfo.collectionDate)}</span>
            </div>
            <div className="info-item">
              <span className="label">Status:</span>
              <span className={`status-badge status-${sampleInfo.status}`}>
                {sampleInfo.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Critical Value Alert Banner */}
        {hasCriticalValues && (
          <div className="critical-alert-banner">
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
              <h3>CRITICAL VALUES DETECTED</h3>
              <p>{criticalValues.length} test(s) require immediate attention</p>
              <button 
                className="alert-button"
                onClick={() => setSelectedCritical(criticalValues[0])}
              >
                View Critical Values
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toolbar Section */}
      <div className="dashboard-toolbar">
        <div className="toolbar-left">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={filterAbnormal}
              onChange={(e) => setFilterAbnormal(e.target.checked)}
            />
            Show abnormal results only
          </label>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'value' | 'status')}
            className="sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="value">Sort by Value</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>

        <div className="toolbar-right">
          <button className="action-button secondary" onClick={onRefresh} title="Refresh results">
            🔄 Refresh
          </button>
          <button className="action-button secondary" onClick={onPrintReport} title="Print report">
            🖨️ Print
          </button>
          <button className="action-button secondary" onClick={onExportCSV} title="Export to CSV">
            📊 Export
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="results-section">
        <h2 className="section-title">
          Test Results ({filteredResults.length})
        </h2>

        {filteredResults.length === 0 ? (
          <div className="empty-state">
            <p>No results to display</p>
          </div>
        ) : (
          <div className="results-list">
            {filteredResults.map((result) => {
              const deltaCheck = getDeltaCheckForTest(result.testId);
              const reflexes = getReflexTestsForResult(result.testId);
              const isExpanded = expandedResults.has(result.testId);

              return (
                <div key={result.testId} className="result-card">
                  {/* Result Header (Always Visible) */}
                  <div 
                    className="result-header"
                    onClick={() => toggleResultExpansion(result.testId)}
                  >
                    <div className="result-main-info">
                      <button className="expand-button">
                        {isExpanded ? '▼' : '▶'}
                      </button>
                      <div className="test-info">
                        <h3 className="test-name">{result.testName}</h3>
                        <p className="test-code">{result.testId}</p>
                      </div>
                      <div className="test-value">
                        <span className="value-number">{result.value}</span>
                        <span className="value-unit">{result.unit}</span>
                      </div>
                      <span className={`status-badge ${getStatusClass(result.abnormalStatus)}`}>
                        {result.abnormalStatus}
                      </span>
                    </div>

                    {/* Delta Check Indicator */}
                    {deltaCheck && (
                      <div className="delta-indicator">
                        <span className="delta-icon">⚡</span>
                      </div>
                    )}

                    {/* Reflex Indicator */}
                    {reflexes.length > 0 && (
                      <div className="reflex-indicator">
                        <span className="reflex-badge">{reflexes.length}</span>
                      </div>
                    )}
                  </div>

                  {/* Result Details (Expandable) */}
                  {isExpanded && (
                    <div className="result-details">
                      {/* Normal Range Information */}
                      <div className="detail-section">
                        <h4>Reference Information</h4>
                        <div className="detail-grid">
                          <div className="detail-item">
                            <span className="label">Normal Range:</span>
                            <span className="value">{result.normalRange}</span>
                          </div>
                          {result.referenceRange && (
                            <div className="detail-item">
                              <span className="label">Reference Range:</span>
                              <span className="value">{result.referenceRange}</span>
                            </div>
                          )}
                          {result.collectionTime && (
                            <div className="detail-item">
                              <span className="label">Collection Time:</span>
                              <span className="value">{formatTime(result.collectionTime)}</span>
                            </div>
                          )}
                          {result.resultTime && (
                            <div className="detail-item">
                              <span className="label">Result Time:</span>
                              <span className="value">{formatTime(result.resultTime)}</span>
                            </div>
                          )}
                          {result.analyzerId && (
                            <div className="detail-item">
                              <span className="label">Analyzer:</span>
                              <span className="value">{result.analyzerId}</span>
                            </div>
                          )}
                          {result.technician && (
                            <div className="detail-item">
                              <span className="label">Technician:</span>
                              <span className="value">{result.technician}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Delta Check Alert */}
                      {deltaCheck && (
                        <DeltaCheckAlert deltaCheck={deltaCheck} />
                      )}

                      {/* Reflex Tests */}
                      {reflexes.length > 0 && (
                        <ReflexTestList reflexTests={reflexes} parentTestName={result.testName} />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Critical Value Modal */}
      {selectedCritical && (
        <CriticalValuePopup 
          criticalValue={selectedCritical}
          onClose={() => setSelectedCritical(null)}
          onAcknowledge={() => {
            // Handle acknowledgment
            setSelectedCritical(null);
          }}
        />
      )}
    </div>
  );
};

export default ResultDashboard;
