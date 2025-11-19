/**
 * DeltaCheckAlert Component
 * Displays visual warnings for anomalous lab value changes detected by DeltaCheckEngine
 * 
 * Features:
 * - Color-coded severity indicators (WARNING/ALERT/CRITICAL)
 * - Percentage change display
 * - Clinical recommendation messaging
 * - Professional styling with icons
 * 
 * @author David Navas
 * @version 1.0
 */

import React from 'react';
import './DeltaCheckAlert.css';

interface DeltaCheckAlertProps {
  deltaCheck: {
    testId: string;
    triggered: boolean;
    percentChange?: number;
    message?: string;
    recommendation?: string;
    severity?: 'WARNING' | 'ALERT' | 'CRITICAL';
  };
}

/**
 * DeltaCheckAlert Component
 * Displays delta check anomaly warnings with clinical context
 */
const DeltaCheckAlert: React.FC<DeltaCheckAlertProps> = ({ deltaCheck }) => {
  if (!deltaCheck.triggered) {
    return null;
  }

  const getSeverityClass = (): string => {
    switch (deltaCheck.severity) {
      case 'CRITICAL':
        return 'severity-critical';
      case 'ALERT':
        return 'severity-alert';
      case 'WARNING':
      default:
        return 'severity-warning';
    }
  };

  const getSeverityIcon = (): string => {
    switch (deltaCheck.severity) {
      case 'CRITICAL':
        return '🚨';
      case 'ALERT':
        return '⚠️';
      case 'WARNING':
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={`delta-check-alert ${getSeverityClass()}`}>
      <div className="alert-header">
        <span className="severity-icon">{getSeverityIcon()}</span>
        <h4 className="alert-title">Delta Check Alert</h4>
        <span className="severity-badge">{deltaCheck.severity}</span>
      </div>

      <div className="alert-content">
        {deltaCheck.percentChange !== undefined && (
          <div className="percent-change">
            <span className="label">Change:</span>
            <span className={`value ${deltaCheck.percentChange > 0 ? 'positive' : 'negative'}`}>
              {deltaCheck.percentChange > 0 ? '+' : ''}{deltaCheck.percentChange.toFixed(1)}%
            </span>
          </div>
        )}

        {deltaCheck.message && (
          <div className="alert-message">
            <p>{deltaCheck.message}</p>
          </div>
        )}

        {deltaCheck.recommendation && (
          <div className="alert-recommendation">
            <strong>Recommendation:</strong>
            <p>{deltaCheck.recommendation}</p>
          </div>
        )}
      </div>

      <div className="alert-footer">
        <span className="alert-type">Previous result anomaly detected</span>
      </div>
    </div>
  );
};

export default DeltaCheckAlert;
