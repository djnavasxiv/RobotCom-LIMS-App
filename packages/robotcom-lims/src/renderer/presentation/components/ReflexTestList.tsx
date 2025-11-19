/**
 * ReflexTestList Component
 * Displays automatically-ordered follow-up tests from ReflexTestingEngine
 * 
 * Features:
 * - Test ordering with status tracking
 * - Priority-based display
 * - Clinical reason for ordering
 * - Status badges (pending/ordered/completed)
 * - ETA display for turnaround time
 * 
 * @author David Navas
 * @version 1.0
 */

import React, { useState } from 'react';
import './ReflexTestList.css';

interface ReflexTest {
  testId: string;
  testName: string;
  reason: string;
  priority: number;
  status: 'pending' | 'ordered' | 'completed';
  eta?: string;
  estimatedHours?: number;
}

interface ReflexTestListProps {
  reflexTests: ReflexTest[];
  parentTestName: string;
}

/**
 * Get status CSS class
 */
const getStatusClass = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'status-pending';
    case 'ordered':
      return 'status-ordered';
    case 'completed':
      return 'status-completed';
    default:
      return 'status-pending';
  }
};

/**
 * Get status icon
 */
const getStatusIcon = (status: string): string => {
  switch (status) {
    case 'pending':
      return '⏳';
    case 'ordered':
      return '📋';
    case 'completed':
      return '✅';
    default:
      return '◯';
  }
};

/**
 * Get priority CSS class
 */
const getPriorityClass = (priority: number): string => {
  if (priority <= 1) return 'priority-critical';
  if (priority <= 2) return 'priority-high';
  if (priority <= 3) return 'priority-normal';
  return 'priority-low';
};

/**
 * Get priority label
 */
const getPriorityLabel = (priority: number): string => {
  if (priority <= 1) return 'CRITICAL';
  if (priority <= 2) return 'HIGH';
  if (priority <= 3) return 'NORMAL';
  return 'LOW';
};

/**
 * ReflexTestList Component
 * Displays reflex test recommendations and status
 */
const ReflexTestList: React.FC<ReflexTestListProps> = ({ reflexTests, parentTestName }) => {
  const [expandedTests, setExpandedTests] = useState<Set<string>>(new Set());

  const toggleTestExpansion = (testId: string) => {
    const newExpanded = new Set(expandedTests);
    if (newExpanded.has(testId)) {
      newExpanded.delete(testId);
    } else {
      newExpanded.add(testId);
    }
    setExpandedTests(newExpanded);
  };

  // Sort by priority
  const sortedTests = [...reflexTests].sort((a, b) => a.priority - b.priority);

  return (
    <div className="reflex-test-list">
      <div className="reflex-header">
        <h4 className="reflex-title">
          Reflex Tests Ordered ({sortedTests.length})
        </h4>
        <p className="reflex-subtitle">
          Based on {parentTestName} result
        </p>
      </div>

      <div className="reflex-tests">
        {sortedTests.map((test) => {
          const isExpanded = expandedTests.has(test.testId);

          return (
            <div 
              key={test.testId}
              className={`reflex-test-item ${getStatusClass(test.status)}`}
            >
              {/* Test Header */}
              <div 
                className="test-header"
                onClick={() => toggleTestExpansion(test.testId)}
              >
                <button className="expand-button">
                  {isExpanded ? '▼' : '▶'}
                </button>

                <div className="test-basic-info">
                  <span className="status-icon">
                    {getStatusIcon(test.status)}
                  </span>
                  <div className="test-name-section">
                    <h5 className="test-name">{test.testName}</h5>
                    <span className="test-code">{test.testId}</span>
                  </div>
                </div>

                <div className="test-badges">
                  <span className={`priority-badge ${getPriorityClass(test.priority)}`}>
                    {getPriorityLabel(test.priority)}
                  </span>
                  <span className={`status-badge ${getStatusClass(test.status)}`}>
                    {test.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Test Details (Expandable) */}
              {isExpanded && (
                <div className="test-details">
                  <div className="detail-row">
                    <span className="label">Reason for Order:</span>
                    <span className="value">{test.reason}</span>
                  </div>

                  {test.estimatedHours && (
                    <div className="detail-row">
                      <span className="label">Estimated Turnaround:</span>
                      <span className="value">
                        {test.estimatedHours} hour{test.estimatedHours !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}

                  {test.eta && (
                    <div className="detail-row">
                      <span className="label">Expected Result Time:</span>
                      <span className="value">{test.eta}</span>
                    </div>
                  )}

                  <div className="detail-row status-explanation">
                    <p className="status-text">
                      {test.status === 'pending' && 'Awaiting technician order confirmation'}
                      {test.status === 'ordered' && 'Test has been ordered and is in queue'}
                      {test.status === 'completed' && 'Results available - click to view'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {sortedTests.length === 0 && (
        <div className="empty-state">
          <p>No reflex tests triggered for this result</p>
        </div>
      )}
    </div>
  );
};

export default ReflexTestList;
