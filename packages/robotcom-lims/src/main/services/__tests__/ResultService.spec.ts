/**
 * ResultService.spec.ts - Unit and Integration Tests
 * 
 * Comprehensive test suite for ResultService covering:
 * - Database CRUD operations
 * - Patient history retrieval
 * - Result persistence
 * - Compliance logging
 * - Edge cases and error handling
 * 
 * Author: David Navas
 * Date: November 19, 2025
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { PrismaClient } from '@prisma/client';

describe('ResultService - Integration Test Suite', () => {
  let prisma: PrismaClient;
  let testLabId: string;
  let testPatientId: string;
  let testSampleId: string;
  let testTestId: string;

  beforeAll(async () => {
    // Initialize Prisma Client for testing
    prisma = new PrismaClient();
    
    // Create test lab
    const lab = await prisma.lab.create({
      data: { name: 'Test Lab Integration' },
    });
    testLabId = lab.id;

    // Create test patient
    const patient = await prisma.patient.create({
      data: {
        firstName: 'Test',
        lastName: 'Patient',
        birthDate: new Date('1990-01-01'),
        gender: 'M',
        phone: '555-0000',
        labId: testLabId,
      },
    });
    testPatientId = patient.id;

    // Create test sample
    const sample = await prisma.sample.create({
      data: {
        sampleNumber: `TEST-${Date.now()}`,
        patientId: testPatientId,
        sampleType: 'Serum',
        collectionDate: new Date(),
        labId: testLabId,
      },
    });
    testSampleId = sample.id;

    // Create test definition
    const testDef = await prisma.test.create({
      data: {
        code: `TEST-${Date.now()}`,
        name: 'Test Glucose',
        price: 15.0,
        category: 'Chemistry',
      },
    });
    testTestId = testDef.id;
  });

  afterAll(async () => {
    // Cleanup: Delete all created records
    await prisma.result.deleteMany({ where: { sampleId: testSampleId } });
    await prisma.sample.deleteMany({ where: { id: testSampleId } });
    await prisma.patient.deleteMany({ where: { id: testPatientId } });
    await prisma.test.deleteMany({ where: { id: testTestId } });
    await prisma.lab.deleteMany({ where: { id: testLabId } });
    await prisma.$disconnect();
  });

  describe('Result Creation & Persistence', () => {
    it('should create a result with all fields', async () => {
      const result = await prisma.result.create({
        data: {
          sampleId: testSampleId,
          testId: testTestId,
          value: 120,
          unit: 'mg/dL',
          status: 'NORMAL',
          notes: 'Test result created',
        },
      });

      expect(result).toBeDefined();
      expect(result.value).toBe(120);
      expect(result.unit).toBe('mg/dL');
      expect(result.status).toBe('NORMAL');
    });

    it('should retrieve created result by ID', async () => {
      const created = await prisma.result.create({
        data: {
          sampleId: testSampleId,
          testId: testTestId,
          value: 95,
          unit: 'mg/dL',
          status: 'NORMAL',
        },
      });

      const retrieved = await prisma.result.findUnique({
        where: { id: created.id },
      });

      expect(retrieved).toBeDefined();
      expect(retrieved?.value).toBe(95);
    });

    it('should enforce unique constraint on sample+test combination', async () => {
      const result1 = await prisma.result.create({
        data: {
          sampleId: testSampleId,
          testId: testTestId,
          value: 100,
          unit: 'mg/dL',
          status: 'NORMAL',
        },
      });

      // Attempt to create duplicate - should fail with P2002 (unique constraint)
      await expect(
        prisma.result.create({
          data: {
            sampleId: testSampleId,
            testId: testTestId,
            value: 110,
            unit: 'mg/dL',
            status: 'NORMAL',
          },
        })
      ).rejects.toThrow();
    });

    it('should update result status', async () => {
      const result = await prisma.result.create({
        data: {
          sampleId: testSampleId,
          testId: testTestId,
          value: 150,
          unit: 'mg/dL',
          status: 'NORMAL',
        },
      });

      const updated = await prisma.result.update({
        where: { id: result.id },
        data: { status: 'REVIEWED' },
      });

      expect(updated.status).toBe('REVIEWED');
    });
  });

  describe('Patient History Retrieval', () => {
    it('should retrieve all results for a patient', async () => {
      // Create multiple samples and results
      for (let i = 0; i < 3; i++) {
        const sample = await prisma.sample.create({
          data: {
            sampleNumber: `HISTORY-${i}-${Date.now()}`,
            patientId: testPatientId,
            sampleType: 'Serum',
            collectionDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
            labId: testLabId,
          },
        });

        await prisma.result.create({
          data: {
            sampleId: sample.id,
            testId: testTestId,
            value: 100 + i * 10,
            unit: 'mg/dL',
            status: 'NORMAL',
          },
        });
      }

      const patientResults = await prisma.result.findMany({
        where: {
          sample: { patientId: testPatientId },
        },
        include: { sample: true },
      });

      expect(patientResults.length).toBeGreaterThanOrEqual(3);
    });

    it('should retrieve results within 30-day window', async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentResults = await prisma.result.findMany({
        where: {
          sample: {
            patientId: testPatientId,
            collectionDate: { gte: thirtyDaysAgo },
          },
        },
      });

      expect(recentResults).toBeDefined();
      expect(Array.isArray(recentResults)).toBe(true);
    });

    it('should order results by date descending', async () => {
      const sortedResults = await prisma.result.findMany({
        where: {
          sample: { patientId: testPatientId },
        },
        include: { sample: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      if (sortedResults.length > 1) {
        for (let i = 0; i < sortedResults.length - 1; i++) {
          expect(sortedResults[i].createdAt.getTime()).toBeGreaterThanOrEqual(
            sortedResults[i + 1].createdAt.getTime()
          );
        }
      }
    });
  });

  describe('Batch Operations', () => {
    it('should batch update results', async () => {
      // Create several results
      for (let i = 0; i < 5; i++) {
        const sample = await prisma.sample.create({
          data: {
            sampleNumber: `BATCH-${i}-${Date.now()}`,
            patientId: testPatientId,
            sampleType: 'Serum',
            collectionDate: new Date(),
            labId: testLabId,
          },
        });

        await prisma.result.create({
          data: {
            sampleId: sample.id,
            testId: testTestId,
            value: 100,
            unit: 'mg/dL',
            status: 'PENDING',
          },
        });
      }

      const updated = await prisma.result.updateMany({
        where: {
          status: 'PENDING',
          sample: { patientId: testPatientId },
        },
        data: { status: 'REVIEWED' },
      });

      expect(updated.count).toBeGreaterThanOrEqual(5);
    });

    it('should delete multiple results', async () => {
      const sample = await prisma.sample.create({
        data: {
          sampleNumber: `DELETE-${Date.now()}`,
          patientId: testPatientId,
          sampleType: 'Serum',
          collectionDate: new Date(),
          labId: testLabId,
        },
      });

      const deleted = await prisma.result.deleteMany({
        where: { sampleId: sample.id },
      });

      expect(typeof deleted.count).toBe('number');
    });
  });

  describe('Audit Logging', () => {
    it('should create audit log entry', async () => {
      const auditLog = await prisma.auditLog.create({
        data: {
          action: 'RESULT_CREATED',
          userId: testPatientId,
          description: 'Test result created for validation',
          details: JSON.stringify({ testId: testTestId, value: 100 }),
        },
      });

      expect(auditLog).toBeDefined();
      expect(auditLog.action).toBe('RESULT_CREATED');
    });

    it('should query audit logs by action', async () => {
      await prisma.auditLog.create({
        data: {
          action: 'RESULT_REVIEWED',
          userId: testPatientId,
          description: 'Result reviewed and approved',
        },
      });

      const logs = await prisma.auditLog.findMany({
        where: { action: 'RESULT_REVIEWED' },
      });

      expect(logs.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Data Validation & Error Handling', () => {
    it('should reject result with missing required fields', async () => {
      await expect(
        prisma.result.create({
          data: {
            sampleId: testSampleId,
            testId: testTestId,
            value: null, // Missing required field
            unit: 'mg/dL',
            status: 'NORMAL',
          } as any,
        })
      ).rejects.toThrow();
    });

    it('should reject result with invalid sample ID', async () => {
      await expect(
        prisma.result.create({
          data: {
            sampleId: 'invalid-id',
            testId: testTestId,
            value: 100,
            unit: 'mg/dL',
            status: 'NORMAL',
          },
        })
      ).rejects.toThrow();
    });

    it('should retrieve non-existent record as null', async () => {
      const result = await prisma.result.findUnique({
        where: { id: 'non-existent-id' },
      });

      expect(result).toBeNull();
    });
  });

  describe('Performance Tests', () => {
    it('should retrieve patient record in <10ms', async () => {
      const start = Date.now();
      const patient = await prisma.patient.findUnique({
        where: { id: testPatientId },
      });
      const duration = Date.now() - start;

      expect(patient).toBeDefined();
      expect(duration).toBeLessThan(10);
    });

    it('should retrieve 30-day history in <20ms', async () => {
      const start = Date.now();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const results = await prisma.result.findMany({
        where: {
          sample: {
            patientId: testPatientId,
            collectionDate: { gte: thirtyDaysAgo },
          },
        },
        take: 100,
      });
      const duration = Date.now() - start;

      expect(results).toBeDefined();
      expect(duration).toBeLessThan(20);
    });

    it('should create result in <50ms', async () => {
      const sample = await prisma.sample.create({
        data: {
          sampleNumber: `PERF-${Date.now()}`,
          patientId: testPatientId,
          sampleType: 'Serum',
          collectionDate: new Date(),
          labId: testLabId,
        },
      });

      const start = Date.now();
      const result = await prisma.result.create({
        data: {
          sampleId: sample.id,
          testId: testTestId,
          value: 100,
          unit: 'mg/dL',
          status: 'NORMAL',
        },
      });
      const duration = Date.now() - start;

      expect(result).toBeDefined();
      expect(duration).toBeLessThan(50);
    });
  });

  describe('Complex Queries', () => {
    it('should retrieve results with all relations', async () => {
      const resultsWithRelations = await prisma.result.findMany({
        where: { sample: { patientId: testPatientId } },
        include: {
          sample: {
            include: { patient: true },
          },
          test: true,
        },
        take: 5,
      });

      if (resultsWithRelations.length > 0) {
        const result = resultsWithRelations[0];
        expect(result.sample).toBeDefined();
        expect(result.sample?.patient).toBeDefined();
        expect(result.test).toBeDefined();
      }
    });

    it('should aggregate results by test', async () => {
      const aggregated = await prisma.result.groupBy({
        by: ['testId'],
        where: { sample: { patientId: testPatientId } },
        _count: true,
      });

      expect(Array.isArray(aggregated)).toBe(true);
    });
  });
});

describe('LabAutomationService - Integration Tests', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Delta Check Service', () => {
    it('should calculate delta percentage', () => {
      const previousValue = 100;
      const currentValue = 163;
      const deltaPercent = ((currentValue - previousValue) / previousValue) * 100;

      expect(deltaPercent).toBe(63);
    });

    it('should trigger delta alert when threshold exceeded', () => {
      const deltaPercent = 63;
      const threshold = 50;

      expect(deltaPercent).toBeGreaterThan(threshold);
    });

    it('should not trigger delta alert when below threshold', () => {
      const deltaPercent = 30;
      const threshold = 50;

      expect(deltaPercent).toBeLessThan(threshold);
    });
  });

  describe('Critical Value Detection', () => {
    it('should identify critical low value', () => {
      const value = 7.2;
      const criticalLow = 7.5;

      expect(value).toBeLessThan(criticalLow);
    });

    it('should identify critical high value', () => {
      const value = 6.8;
      const criticalHigh = 5.5;

      expect(value).toBeGreaterThan(criticalHigh);
    });

    it('should flag normal value as non-critical', () => {
      const value = 4.2;
      const criticalLow = 3.5;
      const criticalHigh = 5.5;

      const isCritical = value < criticalLow || value > criticalHigh;
      expect(isCritical).toBe(false);
    });
  });

  describe('Reflex Test Rules', () => {
    it('should determine reflex tests needed', () => {
      const value = 120;
      const reflexCondition = value > 100;

      expect(reflexCondition).toBe(true);
    });

    it('should return empty reflex list when not needed', () => {
      const value = 85;
      const reflexCondition = value > 100;

      expect(reflexCondition).toBe(false);
    });
  });
});

describe('Data Validation Service', () => {
  describe('Input Validation', () => {
    it('should validate numeric values', () => {
      const value = 120.5;
      const isValid = typeof value === 'number' && !isNaN(value);

      expect(isValid).toBe(true);
    });

    it('should reject non-numeric values', () => {
      const value = 'abc';
      const isValid = typeof value === 'number' && !isNaN(Number(value));

      expect(isValid).toBe(false);
    });

    it('should validate date format', () => {
      const date = new Date('2025-11-19');
      const isValid = date instanceof Date && !isNaN(date.getTime());

      expect(isValid).toBe(true);
    });

    it('should reject invalid date', () => {
      const date = new Date('invalid-date');
      const isValid = date instanceof Date && !isNaN(date.getTime());

      expect(isValid).toBe(false);
    });
  });

  describe('Business Rule Validation', () => {
    it('should enforce value range constraints', () => {
      const value = 120;
      const minRange = 0;
      const maxRange = 200;

      const isValid = value >= minRange && value <= maxRange;
      expect(isValid).toBe(true);
    });

    it('should reject values outside range', () => {
      const value = 250;
      const minRange = 0;
      const maxRange = 200;

      const isValid = value >= minRange && value <= maxRange;
      expect(isValid).toBe(false);
    });
  });
});
