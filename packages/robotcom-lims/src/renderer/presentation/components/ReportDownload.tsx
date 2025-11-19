/**
 * ReportDownload Component
 * Interface for generating and downloading laboratory reports in multiple formats
 * 
 * Features:
 * - Format selection (HTML, PDF, CSV)
 * - Report generation with progress tracking
 * - Download and email delivery options
 * - Report preview
 * - Print functionality
 * 
 * @author David Navas
 * @version 1.0
 */

import React, { useState } from 'react';
import './ReportDownload.css';

type ReportFormat = 'HTML' | 'PDF' | 'CSV';
type DeliveryMethod = 'download' | 'email' | 'print';

interface ReportDownloadProps {
  patientID: string;
  sampleNumber: string;
  testName?: string;
  onGenerateReport?: (format: ReportFormat) => Promise<void>;
  onEmailReport?: (format: ReportFormat, email: string) => Promise<void>;
}

interface GenerationState {
  generating: boolean;
  format: ReportFormat | null;
  progress: number;
  message: string;
}

/**
 * ReportDownload Component
 * Provides UI for report generation and delivery
 */
const ReportDownload: React.FC<ReportDownloadProps> = ({
  patientID,
  sampleNumber,
  testName,
  onGenerateReport,
  onEmailReport
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>('HTML');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('download');
  const [emailAddress, setEmailAddress] = useState('');
  const [generationState, setGenerationState] = useState<GenerationState>({
    generating: false,
    format: null,
    progress: 0,
    message: ''
  });
  const [showEmailInput, setShowEmailInput] = useState(false);

  /**
   * Handle report generation
   */
  const handleGenerateReport = async () => {
    if (!onGenerateReport) {
      console.error('onGenerateReport callback not provided');
      return;
    }

    setGenerationState({
      generating: true,
      format: selectedFormat,
      progress: 0,
      message: `Generating ${selectedFormat} report...`
    });

    try {
      // Simulate progress
      for (let i = 0; i < 100; i += 10) {
        setGenerationState(prev => ({
          ...prev,
          progress: i
        }));
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      await onGenerateReport(selectedFormat);

      setGenerationState(prev => ({
        ...prev,
        progress: 100,
        message: 'Report generated successfully!',
        generating: false
      }));

      // Clear message after 3 seconds
      setTimeout(() => {
        setGenerationState(prev => ({
          ...prev,
          message: ''
        }));
      }, 3000);
    } catch (error) {
      setGenerationState(prev => ({
        ...prev,
        generating: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    }
  };

  /**
   * Handle email delivery
   */
  const handleEmailReport = async () => {
    if (!onEmailReport) {
      console.error('onEmailReport callback not provided');
      return;
    }

    if (!emailAddress) {
      setGenerationState(prev => ({
        ...prev,
        message: 'Please enter an email address'
      }));
      return;
    }

    setGenerationState({
      generating: true,
      format: selectedFormat,
      progress: 0,
      message: `Sending ${selectedFormat} report to ${emailAddress}...`
    });

    try {
      await onEmailReport(selectedFormat, emailAddress);

      setGenerationState(prev => ({
        ...prev,
        progress: 100,
        message: 'Report sent successfully!',
        generating: false
      }));

      setShowEmailInput(false);
      setEmailAddress('');

      setTimeout(() => {
        setGenerationState(prev => ({
          ...prev,
          message: ''
        }));
      }, 3000);
    } catch (error) {
      setGenerationState(prev => ({
        ...prev,
        generating: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    }
  };

  /**
   * Handle print action
   */
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="report-download-container">
      <div className="report-header">
        <h3 className="report-title">Generate Report</h3>
        <p className="report-info">
          Patient: {patientID} | Sample: {sampleNumber}
          {testName && ` | ${testName}`}
        </p>
      </div>

      {/* Format Selection */}
      <div className="section format-section">
        <h4 className="section-title">Report Format</h4>
        <div className="format-options">
          {(['HTML', 'PDF', 'CSV'] as ReportFormat[]).map(format => (
            <label key={format} className="format-option">
              <input
                type="radio"
                name="format"
                value={format}
                checked={selectedFormat === format}
                onChange={(e) => setSelectedFormat(e.target.value as ReportFormat)}
                disabled={generationState.generating}
              />
              <span className="format-label">
                {format === 'HTML' && '🌐 HTML (Web View)'}
                {format === 'PDF' && '📄 PDF (Print Friendly)'}
                {format === 'CSV' && '📊 CSV (Data Export)'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Delivery Method Selection */}
      <div className="section delivery-section">
        <h4 className="section-title">Delivery Method</h4>
        <div className="delivery-options">
          <label className="delivery-option">
            <input
              type="radio"
              name="delivery"
              value="download"
              checked={deliveryMethod === 'download'}
              onChange={(e) => {
                setDeliveryMethod(e.target.value as DeliveryMethod);
                setShowEmailInput(false);
              }}
              disabled={generationState.generating}
            />
            <span className="delivery-label">💾 Download</span>
          </label>

          <label className="delivery-option">
            <input
              type="radio"
              name="delivery"
              value="email"
              checked={deliveryMethod === 'email'}
              onChange={(e) => {
                setDeliveryMethod(e.target.value as DeliveryMethod);
                setShowEmailInput(e.target.checked);
              }}
              disabled={generationState.generating}
            />
            <span className="delivery-label">📧 Email</span>
          </label>

          <label className="delivery-option">
            <input
              type="radio"
              name="delivery"
              value="print"
              checked={deliveryMethod === 'print'}
              onChange={(e) => {
                setDeliveryMethod(e.target.value as DeliveryMethod);
                setShowEmailInput(false);
              }}
              disabled={generationState.generating}
            />
            <span className="delivery-label">🖨️ Print</span>
          </label>
        </div>

        {/* Email Input */}
        {showEmailInput && deliveryMethod === 'email' && (
          <div className="email-input-group">
            <input
              type="email"
              placeholder="Recipient email address"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              disabled={generationState.generating}
              className="email-input"
            />
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {generationState.generating && (
        <div className="progress-section">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${generationState.progress}%` }}
            ></div>
          </div>
          <p className="progress-message">{generationState.message}</p>
        </div>
      )}

      {/* Status Message */}
      {generationState.message && !generationState.generating && (
        <div className={`status-message ${generationState.message.startsWith('Error') ? 'error' : 'success'}`}>
          {generationState.message}
        </div>
      )}

      {/* Action Buttons */}
      <div className="action-buttons">
        {deliveryMethod === 'download' && (
          <button
            className="button primary"
            onClick={handleGenerateReport}
            disabled={generationState.generating}
          >
            {generationState.generating ? 'Generating...' : `Download ${selectedFormat}`}
          </button>
        )}

        {deliveryMethod === 'email' && (
          <button
            className="button primary"
            onClick={handleEmailReport}
            disabled={generationState.generating || !emailAddress}
          >
            {generationState.generating ? 'Sending...' : 'Send Email'}
          </button>
        )}

        {deliveryMethod === 'print' && (
          <button
            className="button primary"
            onClick={handlePrint}
            disabled={generationState.generating}
          >
            Print Report
          </button>
        )}

        <button
          className="button secondary"
          onClick={() => {
            setGenerationState({ generating: false, format: null, progress: 0, message: '' });
            setShowEmailInput(false);
          }}
          disabled={generationState.generating}
        >
          Cancel
        </button>
      </div>

      {/* Format Descriptions */}
      <div className="format-descriptions">
        <div className="description">
          <strong>HTML:</strong> Professional formatted report for web viewing and screen display
        </div>
        <div className="description">
          <strong>PDF:</strong> Print-ready document with graphics, suitable for archival
        </div>
        <div className="description">
          <strong>CSV:</strong> Raw data export for spreadsheet analysis and EMR integration
        </div>
      </div>
    </div>
  );
};

export default ReportDownload;
