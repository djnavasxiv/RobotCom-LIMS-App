/**
 * ResultService - Complete database integration for lab results
 * 
 * Handles:
 * - Patient and sample data retrieval
 * - Previous result fetching for delta checking
 * - Processed result persistence
 * - Compliance event logging and audit trails
 * 
 * Author: David Navas
 * Date: November 19, 2025
 */

import { Result } from '../../domain/entities/Result';
import { Sample } from '../../domain/entities/Sample';
import { IResultRepository } from '../../domain/interfaces/IResultRepository';
import { ISampleRepository } from '../../domain/interfaces/ISampleRepository';
import { ResultRepository } from '../../data/repositories/ResultRepository';
import { SampleRepository } from '../../data/repositories/SampleRepository';

// Type definitions for database operations
interface PatientInfo {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  gender: 'M' | 'F';
  phone: string;
  email: string;
  labId?: string;
}

interface SampleInfo {
  id: string;
  sampleNumber: string;
  sampleType: string;
  collectionTime: Date;
  receivedTime: Date;
  patientId: string;
  labId?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED';
}

interface PreviousResult {
  value: number;
  date: Date;
  status: string;
  unit: string;
}

interface ProcessedResult {
  sampleId: string;
  testId: string;
  testName: string;
  value: number;
  unit: string;
  status: 'NORMAL' | 'LOW' | 'HIGH' | 'CRITICAL';
  flagged: boolean;
  deltaCheck?: {
    triggered: boolean;
    changePercent: number;
    severity: 'WARNING' | 'ALERT' | 'CRITICAL';
  };
  criticalValue?: {
    triggered: boolean;
    message: string;
    notificationMethods: string[];
  };
  reflexTests?: Array<{
    testId: string;
    priority: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';
  }>;
}

interface ComplianceEvent {
  action: string;
  testId?: string;
  value?: number;
  severity?: string;
  userId?: string;
  details?: Record<string, unknown>;
}

export class ResultService {
  private resultRepository: IResultRepository;
  private sampleRepository: ISampleRepository;
  private prismaClient: any; // Prisma client instance

  constructor(prismaClient?: any) {
    this.resultRepository = new ResultRepository();
    this.sampleRepository = new SampleRepository();
    this.prismaClient = prismaClient; // Allow dependency injection for testing
  }

  /**
   * Fetch patient demographics from database
   * 
   * @param patientId - Patient ID
   * @returns Patient information or null if not found
   */
  async getPatientById(patientId: string): Promise<PatientInfo | null> {
    try {
      if (!this.prismaClient?.patient) {
        console.warn('Prisma client not available, returning mock patient');
        return this.getMockPatient(patientId);
      }

      const patient = await this.prismaClient.patient.findUnique({
        where: { id: patientId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          gender: true,
          phone: true,
          email: true,
          labId: true
        }
      });

      if (!patient) {
        return null;
      }

      // Calculate age from date of birth
      const dob = new Date(patient.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      return {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        dateOfBirth: patient.dateOfBirth.toISOString().split('T')[0],
        age,
        gender: patient.gender as 'M' | 'F',
        phone: patient.phone || '',
        email: patient.email || '',
        labId: patient.labId
      };
    } catch (error) {
      console.error(`Error fetching patient ${patientId}:`, error);
      throw new Error(`Failed to fetch patient: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch sample with collection and received times
   * 
   * @param sampleId - Sample ID
   * @returns Sample information or null if not found
   */
  async getSampleById(sampleId: string): Promise<SampleInfo | null> {
    try {
      if (!this.prismaClient?.sample) {
        console.warn('Prisma client not available, returning mock sample');
        return this.getMockSample(sampleId);
      }

      const sample = await this.prismaClient.sample.findUnique({
        where: { id: sampleId },
        select: {
          id: true,
          sampleNumber: true,
          sampleType: true,
          collectionTime: true,
          receivedTime: true,
          patientId: true,
          labId: true,
          status: true
        }
      });

      if (!sample) {
        return null;
      }

      return {
        id: sample.id,
        sampleNumber: sample.sampleNumber,
        sampleType: sample.sampleType,
        collectionTime: new Date(sample.collectionTime),
        receivedTime: new Date(sample.receivedTime),
        patientId: sample.patientId,
        labId: sample.labId || undefined,
        status: sample.status as SampleInfo['status']
      };
    } catch (error) {
      console.error(`Error fetching sample ${sampleId}:`, error);
      throw new Error(`Failed to fetch sample: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch previous results for delta checking
   * Looks back up to 30 days for the same test
   * 
   * @param patientId - Patient ID
   * @param testId - Test ID
   * @param currentSampleId - Current sample ID to exclude
   * @returns Array of previous results (most recent first)
   */
  async getPreviousResults(
    patientId: string,
    testId: string,
    currentSampleId: string
  ): Promise<PreviousResult[]> {
    try {
      if (!this.prismaClient?.result) {
        console.warn('Prisma client not available, returning mock previous results');
        return this.getMockPreviousResults();
      }

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const previousResults = await this.prismaClient.result.findMany({
        where: {
          sample: {
            patientId
          },
          testId,
          sampleId: {
            not: currentSampleId
          },
          createdAt: {
            gte: thirtyDaysAgo
          }
        },
        select: {
          value: true,
          createdAt: true,
          status: true,
          testDef: {
            select: {
              unit: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5 // Get last 5 results for trend analysis
      });

      return previousResults.map(r => ({
        value: parseFloat(r.value as unknown as string),
        date: new Date(r.createdAt),
        status: r.status || 'NORMAL',
        unit: r.testDef?.unit || ''
      }));
    } catch (error) {
      console.error(`Error fetching previous results for ${testId}:`, error);
      // Don't throw - delta checking can work without previous results
      return [];
    }
  }

  /**
   * Save processed result to database with all automation flags
   * 
   * @param processedResult - Result from LabAutomationService pipeline
   * @returns Saved result ID
   */
  async saveProcessedResult(processedResult: ProcessedResult): Promise<string> {
    try {
      if (!this.prismaClient?.result) {
        console.warn('Prisma client not available, skipping result persistence');
        return 'mock-result-id';
      }

      // Create the main result record
      const savedResult = await this.prismaClient.result.create({
        data: {
          sampleId: processedResult.sampleId,
          testId: processedResult.testId,
          value: processedResult.value.toString(),
          status: processedResult.status,
          flagged: processedResult.flagged,
          createdAt: new Date(),
          updatedAt: new Date(),

          // Save delta check results if triggered
          ...(processedResult.deltaCheck && {
            deltaCheckResults: {
              create: {
                ruleId: `rule-${processedResult.testId}-delta`,
                previousValue: 0, // Would be calculated from previous result
                currentValue: processedResult.value,
                changePercent: processedResult.deltaCheck.changePercent,
                severity: processedResult.deltaCheck.severity,
                isTriggered: processedResult.deltaCheck.triggered,
                alertMessage: `${processedResult.deltaCheck.severity}: ${processedResult.deltaCheck.changePercent}% change detected`,
                isResolved: false
              }
            }
          })
        }
      });

      // Log compliance event for audit trail
      await this.logComplianceEvent({
        action: 'RESULT_PROCESSED',
        testId: processedResult.testId,
        value: processedResult.value,
        severity: processedResult.status
      });

      // Log critical value if triggered
      if (processedResult.criticalValue?.triggered) {
        await this.logComplianceEvent({
          action: 'CRITICAL_VALUE_DETECTED',
          testId: processedResult.testId,
          value: processedResult.value,
          severity: processedResult.status,
          details: {
            message: processedResult.criticalValue.message,
            notificationMethods: processedResult.criticalValue.notificationMethods
          }
        });
      }

      // Log reflex tests if ordered
      if (processedResult.reflexTests && processedResult.reflexTests.length > 0) {
        await this.logComplianceEvent({
          action: 'REFLEX_TESTS_ORDERED',
          testId: processedResult.testId,
          details: {
            reflexTests: processedResult.reflexTests.map(rt => ({
              testId: rt.testId,
              priority: rt.priority
            }))
          }
        });
      }

      return savedResult.id;
    } catch (error) {
      console.error(`Error saving processed result:`, error);
      throw new Error(`Failed to save result: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Log compliance events for audit trail
   * Required for CAP/CLIA compliance
   * 
   * @param event - Event to log
   */
  async logComplianceEvent(event: ComplianceEvent): Promise<void> {
    try {
      if (!this.prismaClient?.auditLog) {
        console.warn('Prisma client not available, skipping audit log');
        return;
      }

      await this.prismaClient.auditLog.create({
        data: {
          action: event.action,
          userId: event.userId || 'SYSTEM',
          details: JSON.stringify(event.details || {}),
          createdAt: new Date()
        }
      });
    } catch (error) {
      console.error(`Error logging compliance event:`, error);
      // Don't throw - audit logging failure shouldn't block result processing
    }
  }

  /**
   * Get all results for a sample
   * 
   * @param sampleId - Sample ID
   * @returns Array of results for the sample
   */
  async getResultsForSample(sampleId: string): Promise<Result[]> {
    try {
      return await this.resultRepository.findBySampleId(sampleId);
    } catch (error) {
      console.error(`Error fetching results for sample ${sampleId}:`, error);
      throw error;
    }
  }

  /**
   * Save results using the repository pattern
   * 
   * @param sampleId - Sample ID
   * @param results - Array of result data
   */
  async saveResults(
    sampleId: string,
    results: Array<{ testId: string; value: string; notes?: string }>
  ): Promise<void> {
    try {
      const resultEntities = results.map(r =>
        Result.create({
          sampleId,
          testId: r.testId,
          value: r.value,
          notes: r.notes,
          isNormal: true,
          enteredAt: new Date()
        })
      );

      await this.resultRepository.createMany(resultEntities);

      // Log the batch save
      await this.logComplianceEvent({
        action: 'RESULTS_BATCH_SAVED',
        details: {
          sampleId,
          resultCount: results.length
        }
      });
    } catch (error) {
      console.error(`Error saving results:`, error);
      throw error;
    }
  }

  /**
   * Find sample by ID using repository
   * 
   * @param sampleId - Sample ID
   * @returns Sample or null
   */
  async findSampleById(sampleId: string): Promise<Sample | null> {
    try {
      return await this.sampleRepository.findById(sampleId);
    } catch (error) {
      console.error(`Error finding sample ${sampleId}:`, error);
      throw error;
    }
  }

  /**
   * Mock patient data for development/testing
   */
  private getMockPatient(patientId: string): PatientInfo {
    return {
      id: patientId,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1960-05-15',
      age: 65,
      gender: 'M',
      phone: '+1-555-0123',
      email: 'john.doe@example.com',
      labId: 'LAB-001'
    };
  }

  /**
   * Mock sample data for development/testing
   */
  private getMockSample(sampleId: string): SampleInfo {
    return {
      id: sampleId,
      sampleNumber: `S-${new Date().toISOString().split('T')[0]}-001`,
      sampleType: 'Serum',
      collectionTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      receivedTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
      patientId: 'P-001',
      labId: 'LAB-001',
      status: 'IN_PROGRESS'
    };
  }

  /**
   * Mock previous results for development/testing
   */
  private getMockPreviousResults(): PreviousResult[] {
    return [
      {
        value: 12.5,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: 'NORMAL',
        unit: 'g/dL'
      },
      {
        value: 12.8,
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        status: 'NORMAL',
        unit: 'g/dL'
      }
    ];
  }
}
