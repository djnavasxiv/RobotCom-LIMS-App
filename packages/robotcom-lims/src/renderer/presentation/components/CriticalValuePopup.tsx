/**
 * CriticalValuePopup Component
 * Modal for displaying and acknowledging panic value alerts
 * 
 * Features:
 * - Prominent critical value display
 * - Notification actions (phone, email, SMS, paging)
 * - Acknowledgment tracking
 * - Professional styling with warning colors
 * 
 * @author David Navas
 * @version 1.0
 */

import React from 'react';
import './CriticalValuePopup.css';

interface CriticalValuePopupProps {
  criticalValue: {
    testId: string;
    testName: string;
    value: number;
    unit: string;
    message: string;
    notificationActions: string[];
    severity: 'CRITICAL' | 'PANIC';
  };
  onClose: () => void;
  onAcknowledge: () => void;
}

/**
 * Get notification icon
 */
const getNotificationIcon = (action: string): string => {
  switch (action.toUpperCase()) {
    case 'PHONE_CALL':
      return '📞';
    case 'EMAIL':
      return '📧';
    case 'SMS':
      return '💬';
    case 'PAGE':
      return '📟';
    case 'PRINT_ALERT':
      return '🖨️';
    default:
      return '📌';
  }
};

/**
 * Get notification label
 */
const getNotificationLabel = (action: string): string => {
  switch (action.toUpperCase()) {
    case 'PHONE_CALL':
      return 'Phone Call';
    case 'EMAIL':
      return 'Email';
    case 'SMS':
      return 'Text Message';
    case 'PAGE':
      return 'Pager';
    case 'PRINT_ALERT':
      return 'Printed Alert';
    default:
      return action;
  }
};

/**
 * CriticalValuePopup Component
 * Displays critical value alerts in a modal dialog
 */
const CriticalValuePopup: React.FC<CriticalValuePopupProps> = ({
  criticalValue,
  onClose,
  onAcknowledge
}) => {
  const isPanic = criticalValue.severity === 'PANIC';

  const handleAcknowledge = () => {
    onAcknowledge();
    onClose();
  };

  return (
    <div className="critical-value-modal-overlay">
      <div className={`critical-value-modal ${isPanic ? 'severity-panic' : 'severity-critical'}`}>
        {/* Header */}
        <div className="modal-header">
          <div className="header-title">
            <span className="severity-icon">
              {isPanic ? '🚨' : '⚠️'}
            </span>
            <h2 className="modal-title">
              {isPanic ? 'PANIC VALUE ALERT' : 'CRITICAL VALUE ALERT'}
            </h2>
          </div>
          <button 
            className="close-button"
            onClick={onClose}
            aria-label="Close alert"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          {/* Value Display */}
          <div className="critical-value-display">
            <div className="test-name">{criticalValue.testName}</div>
            <div className="test-value">
              <span className="value-number">{criticalValue.value}</span>
              <span className="value-unit">{criticalValue.unit}</span>
            </div>
            <div className="test-id">({criticalValue.testId})</div>
          </div>

          {/* Alert Message */}
          <div className="alert-message">
            <p>{criticalValue.message}</p>
          </div>

          {/* Notification Status */}
          <div className="notifications-section">
            <h3 className="section-title">Notifications Sent To:</h3>
            <div className="notifications-list">
              {criticalValue.notificationActions.length > 0 ? (
                criticalValue.notificationActions.map((action, index) => (
                  <div key={index} className="notification-item">
                    <span className="notification-icon">
                      {getNotificationIcon(action)}
                    </span>
                    <span className="notification-label">
                      {getNotificationLabel(action)}
                    </span>
                    <span className="notification-status">✓ Sent</span>
                  </div>
                ))
              ) : (
                <p className="no-notifications">No notifications configured</p>
              )}
            </div>
          </div>

          {/* Clinical Actions */}
          <div className="clinical-actions-section">
            <h3 className="section-title">Required Actions:</h3>
            <ul className="actions-list">
              <li>✓ Notify physician immediately</li>
              <li>✓ Verify result accuracy</li>
              <li>✓ Consider repeat analysis</li>
              <li>✓ Initiate emergency protocol if needed</li>
              <li>✓ Document physician notification in LIS</li>
            </ul>
          </div>

          {/* Timestamp */}
          <div className="timestamp">
            Alert generated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button 
            className="button secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className={`button primary ${isPanic ? 'panic' : 'critical'}`}
            onClick={handleAcknowledge}
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CriticalValuePopup;
