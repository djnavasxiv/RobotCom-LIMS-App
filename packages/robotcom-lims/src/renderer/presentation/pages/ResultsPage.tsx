/**
 * ResultsPage.tsx - Complete integration example
 * 
 * Demonstrates:
 * 1. Fetching patient and sample data from database
 * 2. Processing test results through LabAutomationService pipeline
 * 3. Displaying results in ResultDashboard component
 * 4. Handling critical values and reflex tests
 * 5. Managing report generation
 * 
 * Author: David Navas
 */

import React, { useState, useEffect, useCallback } from 'react';
import ResultDashboard from '../components/ResultDashboard';
import CriticalValuePopup from '../components/CriticalValuePopup';
import LabAutomationService from '../../application/services/LabAutomationService';
import './ResultsPage.css';

// Type definitions for component state
interface ProcessedTestResult {
  testId: string;
  testName: string;
  value: number;
  unit: string;
  status: 'NORMAL' | 'LOW' | 'HIGH' | 'CRITICAL';
  previousValue?: number;
  previousDate?: Date;
  deltaCheck?: {
    triggered: boolean;
    changePercent: number;
    severity: 'WARNING' | 'ALERT' | 'CRITICAL';
    message: string;
    recommendation: string;
  };
  reflexTests?: {
    testId: string;
    testName: string;
    priority: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';
    status: 'PENDING' | 'ORDERED' | 'COMPLETED';
    reason: string;
    estimatedTurnaround: string;
  }[];
  criticalValue?: {
    triggered: boolean;
    value: number;
    unit: string;
    thresholdLow?: number;
    thresholdHigh?: number;
    message: string;
    notificationMethods: ('phone_call' | 'email' | 'sms' | 'paging' | 'print_alert')[];
  };
}

interface PatientInfo {
  patientID: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  gender: 'M' | 'F';
  phone: string;
  email: string;
}

interface SampleInfo {
  sampleID: string;
  sampleNumber: string;
  sampleType: string;
  collectionTime: string;
  receivedTime: string;
}

interface CriticalValueAlert {
  testId: string;
  testName: string;
  value: number;
  unit: string;
  message: string;
  notificationMethods: string[];
}

const ResultsPage: React.FC = () => {
  // State management
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [sampleInfo, setSampleInfo] = useState<SampleInfo | null>(null);
  const [testResults, setTestResults] = useState<ProcessedTestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCriticalAlert, setActiveCriticalAlert] = useState<CriticalValueAlert | null>(null);
  const [processedCount, setProcessedCount] = useState(0);

  /**
   * STEP 1: Mock database query to fetch patient and sample data
   * In production, this would query the Prisma database
   */
  const fetchPatientAndSample = useCallback(async (patientId: string, sampleId: string) => {
    try {
      // Mock data - replace with actual Prisma queries
      const mockPatient: PatientInfo = {
        patientID: patientId,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1960-05-15',
        age: 65,
        gender: 'M',
        phone: '+1-555-0123',
        email: 'john.doe@example.com'
      };

      const mockSample: SampleInfo = {
        sampleID: sampleId,
        sampleNumber: 'S-20251119-001',
        sampleType: 'Serum',
        collectionTime: '2025-11-19T08:30:00Z',
        receivedTime: '2025-11-19T09:15:00Z'
      };

      setPatientInfo(mockPatient);
      setSampleInfo(mockSample);
      return { patient: mockPatient, sample: mockSample };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch patient data';
      setError(errorMsg);
      throw err;
    }
  }, []);

  /**
   * STEP 2: Mock database query to fetch previous results for delta checking
   * In production, this would query Result table where sampleId != current and patientId = current
   */
  const fetchPreviousResults = useCallback(async (patientId: string, testIds: string[]) => {
    try {
      // Mock previous results
      const mockPreviousResults: Record<string, { value: number; date: Date }> = {
        'HGB': { value: 12.5, date: new Date('2025-11-12') },
        'HCT': { value: 38.5, date: new Date('2025-11-12') },
        'GLU': { value: 95, date: new Date('2025-11-12') },
        'CR': { value: 0.9, date: new Date('2025-11-12') },
        'K': { value: 4.2, date: new Date('2025-11-12') }
      };

      return mockPreviousResults;
    } catch (err) {
      console.error('Error fetching previous results:', err);
      return {};
    }
  }, []);

  /**
   * STEP 3: Process raw test results through automation pipeline
   * This is where all the magic happens - delta checking, critical values, reflex tests, etc.
   */
  const processTestResults = useCallback(async (
    patient: PatientInfo,
    sample: SampleInfo,
    rawResults: Array<{ testId: string; testName: string; value: number; unit: string }>
  ) => {
    try {
      const processedResults: ProcessedTestResult[] = [];
      const allReflexTests: any[] = [];
      const allCriticalAlerts: CriticalValueAlert[] = [];

      for (const rawResult of rawResults) {
        // Create test value object for LabAutomationService
        const testValue = {
          testId: rawResult.testId,
          testName: rawResult.testName,
          value: rawResult.value,
          unit: rawResult.unit
        };

        // Create patient context
        const patientContext = {
          patientID: patient.patientID,
          firstName: patient.firstName,
          lastName: patient.lastName,
          age: patient.age,
          gender: patient.gender
        };

        // Create sample context
        const sampleContext = {
          sampleID: sample.sampleID,
          sampleNumber: sample.sampleNumber,
          sampleType: sample.sampleType,
          collectionTime: new Date(sample.collectionTime),
          receivedTime: new Date(sample.receivedTime)
        };

        // Fetch previous result for this test
        const previousResults = await fetchPreviousResults(patient.patientID, [rawResult.testId]);
        const previousResult = previousResults[rawResult.testId];

        // CRITICAL: Process through LabAutomationService pipeline
        const processedResult = await LabAutomationService.processResult(
          testValue,
          patientContext,
          sampleContext,
          previousResult || { value: 0, date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        );

        // Map LabAutomationService output to component-friendly format
        const componentResult: ProcessedTestResult = {
          testId: rawResult.testId,
          testName: rawResult.testName,
          value: rawResult.value,
          unit: rawResult.unit,
          status: determineMappedStatus(processedResult.status),
          previousValue: previousResult?.value,
          previousDate: previousResult?.date,
          deltaCheck: processedResult.deltaCheck ? {
            triggered: processedResult.deltaCheck.triggered,
            changePercent: processedResult.deltaCheck.changePercent,
            severity: processedResult.deltaCheck.severity,
            message: processedResult.deltaCheck.message,
            recommendation: processedResult.deltaCheck.recommendation
          } : undefined,
          reflexTests: processedResult.reflexTests?.map(rt => ({
            testId: rt.testId,
            testName: rt.testName,
            priority: rt.priority,
            status: 'PENDING' as const,
            reason: rt.reason,
            estimatedTurnaround: rt.estimatedTurnaround
          })),
          criticalValue: processedResult.criticalValue ? {
            triggered: processedResult.criticalValue.triggered,
            value: rawResult.value,
            unit: rawResult.unit,
            thresholdLow: processedResult.criticalValue.thresholdLow,
            thresholdHigh: processedResult.criticalValue.thresholdHigh,
            message: processedResult.criticalValue.message,
            notificationMethods: processedResult.criticalValue.notificationMethods
          } : undefined
        };

        processedResults.push(componentResult);

        // Collect critical alerts for popup
        if (processedResult.criticalValue?.triggered) {
          allCriticalAlerts.push({
            testId: rawResult.testId,
            testName: rawResult.testName,
            value: rawResult.value,
            unit: rawResult.unit,
            message: processedResult.criticalValue.message,
            notificationMethods: processedResult.criticalValue.notificationMethods
          });
        }

        // Collect reflex tests
        if (processedResult.reflexTests && processedResult.reflexTests.length > 0) {
          allReflexTests.push(...processedResult.reflexTests);
        }
      }

      setTestResults(processedResults);
      setProcessedCount(rawResults.length);

      // Show first critical alert if any
      if (allCriticalAlerts.length > 0) {
        setActiveCriticalAlert(allCriticalAlerts[0]);
      }

      return processedResults;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to process results';
      setError(errorMsg);
      console.error('Error processing results:', err);
      throw err;
    }
  }, [fetchPreviousResults]);

  /**
   * Helper function to map LabAutomationService status to component status
   */
  const determineMappedStatus = (status: string): ProcessedTestResult['status'] => {
    if (status === 'CRITICAL') return 'CRITICAL';
    if (status === 'HIGH') return 'HIGH';
    if (status === 'LOW') return 'LOW';
    return 'NORMAL';
  };

  /**
   * Load and process sample data on component mount
   */
  useEffect(() => {
    const loadSampleData = async () => {
      try {
        setLoading(true);
        const patientId = 'P-001'; // In production, get from URL/navigation params
        const sampleId = 'S-001';

        // Step 1: Fetch patient and sample info
        const { patient, sample } = await fetchPatientAndSample(patientId, sampleId);

        // Step 2: Mock raw test results from analyzer
        const rawTestResults = [
          { testId: 'HGB', testName: 'Hemoglobin', value: 7.2, unit: 'g/dL' },
          { testId: 'HCT', testName: 'Hematocrit', value: 22.0, unit: '%' },
          { testId: 'GLU', testName: 'Glucose', value: 250, unit: 'mg/dL' },
          { testId: 'CR', testName: 'Creatinine', value: 2.1, unit: 'mg/dL' },
          { testId: 'K', testName: 'Potassium', value: 6.8, unit: 'mEq/L' },
          { testId: 'TROP', testName: 'Troponin I', value: 0.08, unit: 'ng/mL' },
          { testId: 'INR', testName: 'INR', value: 8.5, unit: 'ratio' }
        ];

        // Step 3: Process through automation pipeline
        await processTestResults(patient, sample, rawTestResults);

        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error('Error loading sample:', err);
      }
    };

    loadSampleData();
  }, [fetchPatientAndSample, processTestResults]);

  /**
   * Handle critical value acknowledgment
   */
  const handleAcknowledgeCriticalValue = useCallback(() => {
    setActiveCriticalAlert(null);
    // In production, log acknowledgment to database for compliance
  }, []);

  if (loading) {
    return (
      <div className="results-page loading">
        <div className="loader">Processing test results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-page error">
        <div className="error-message">
          <h2>Error Loading Results</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="results-page">
      <div className="page-header">
        <h1>Laboratory Test Results</h1>
        <div className="status-bar">
          <span className="status-item">
            <strong>Patient:</strong> {patientInfo?.firstName} {patientInfo?.lastName}
          </span>
          <span className="status-item">
            <strong>Sample:</strong> {sampleInfo?.sampleNumber}
          </span>
          <span className="status-item">
            <strong>Results Processed:</strong> {processedCount}
          </span>
        </div>
      </div>

      {/* Main dashboard component */}
      {patientInfo && sampleInfo && (
        <ResultDashboard
          patientInfo={{
            id: patientInfo.patientID,
            name: `${patientInfo.firstName} ${patientInfo.lastName}`,
            age: patientInfo.age,
            gender: patientInfo.gender,
            dob: patientInfo.dateOfBirth
          }}
          sampleInfo={{
            id: sampleInfo.sampleID,
            number: sampleInfo.sampleNumber,
            type: sampleInfo.sampleType,
            collectionTime: sampleInfo.collectionTime,
            receivedTime: sampleInfo.receivedTime
          }}
          results={testResults.map(tr => ({
            id: tr.testId,
            name: tr.testName,
            value: tr.value,
            unit: tr.unit,
            status: tr.status,
            previousValue: tr.previousValue,
            previousDate: tr.previousDate?.toISOString()
          }))}
          deltaChecks={testResults
            .filter(tr => tr.deltaCheck)
            .map(tr => ({
              testId: tr.testId,
              testName: tr.testName,
              triggered: tr.deltaCheck!.triggered,
              changePercent: tr.deltaCheck!.changePercent,
              severity: tr.deltaCheck!.severity,
              message: tr.deltaCheck!.message,
              recommendation: tr.deltaCheck!.recommendation
            }))}
          reflexTests={testResults
            .flatMap(tr => tr.reflexTests || [])
            .map(rt => ({
              testId: rt.testId,
              testName: rt.testName,
              priority: rt.priority,
              status: rt.status,
              reason: rt.reason,
              estimatedTurnaround: rt.estimatedTurnaround
            }))}
          criticalValues={testResults
            .filter(tr => tr.criticalValue?.triggered)
            .map(tr => ({
              testId: tr.testId,
              testName: tr.testName,
              value: tr.value,
              unit: tr.unit,
              thresholdLow: tr.criticalValue!.thresholdLow,
              thresholdHigh: tr.criticalValue!.thresholdHigh,
              message: tr.criticalValue!.message,
              notificationMethods: tr.criticalValue!.notificationMethods
            }))}
        />
      )}

      {/* Critical value popup modal */}
      {activeCriticalAlert && (
        <CriticalValuePopup
          testName={activeCriticalAlert.testName}
          value={activeCriticalAlert.value}
          unit={activeCriticalAlert.unit}
          message={activeCriticalAlert.message}
          notificationMethods={activeCriticalAlert.notificationMethods}
          onClose={() => setActiveCriticalAlert(null)}
          onAcknowledge={handleAcknowledgeCriticalValue}
        />
      )}
    </div>
  );
};

export default ResultsPage;
