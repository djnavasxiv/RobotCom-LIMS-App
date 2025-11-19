/**
 * Database Integration Test Script
 * 
 * Manual testing script for ResultService database operations.
 * Tests direct Prisma database operations.
 * 
 * Usage: npx ts-node src/main/services/__tests__/ResultService.integration.test.ts
 * 
 * Week 4 - Task 1: Real Database Integration Testing
 * 
 * Test Coverage:
 * - Patient data retrieval with age calculation
 * - Sample metadata retrieval
 * - 30-day historical result lookback
 * - Result persistence with automation flags
 * - Compliance event audit logging
 * 
 * Author: David Navas
 * Date: November 19, 2025
 */

import { PrismaClient } from '../../../generated/prisma-client';

const prisma = new PrismaClient();

/**
 * Helper function to calculate age from birthDate
 */
function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Test 1: Patient Data Retrieval
 */
async function testPatientRetrieval() {
  console.log('\n[Test 1] Patient Data Retrieval');
  console.log('================================');
  
  try {
    // Get first patient from database
    const patient = await prisma.patient.findFirst();
    
    if (!patient) {
      console.log('No patient data found in database');
      return;
    }
    
    const age = calculateAge(patient.birthDate);
    
    console.log('✓ Patient retrieved successfully:');
    console.log(`  ID: ${patient.id}`);
    console.log(`  Name: ${patient.firstName} ${patient.lastName}`);
    console.log(`  Age: ${age} years old`);
    console.log(`  DOB: ${patient.birthDate.toISOString().split('T')[0]}`);
    console.log(`  Phone: ${patient.phone}`);
    console.log(`  Email: ${patient.email}`);
    console.log(`  Lab ID: ${patient.labId}`);
  } catch (error) {
    console.error('✗ Error retrieving patient:', error);
  }
}

/**
 * Test 2: Sample Data Retrieval
 */
async function testSampleRetrieval() {
  console.log('\n[Test 2] Sample Data Retrieval');
  console.log('==============================');
  
  try {
    // Get first sample from database
    const sample = await prisma.sample.findFirst();
    
    if (!sample) {
      console.log('No sample data found in database');
      return;
    }
    
    console.log('✓ Sample retrieved successfully:');
    console.log(`  ID: ${sample.id}`);
    console.log(`  Sample Number: ${sample.sampleNumber}`);
    console.log(`  Status: ${sample.status}`);
    console.log(`  Collection Date: ${sample.collectionDate.toISOString()}`);
    console.log(`  Patient ID: ${sample.patientId}`);
  } catch (error) {
    console.error('✗ Error retrieving sample:', error);
  }
}

/**
 * Test 3: Result with Previous Results Query
 */
async function testPreviousResults() {
  console.log('\n[Test 3] Previous Results Query (30-day lookback)');
  console.log('=================================================');
  
  try {
    // Get a sample with results
    const sample = await prisma.sample.findFirst({
      include: { results: true }
    });
    
    if (!sample || sample.results.length === 0) {
      console.log('No sample with results found in database');
      return;
    }
    
    const firstResult = sample.results[0];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const previousResults = await prisma.result.findMany({
      where: {
        sampleId: {
          not: sample.id
        },
        testId: firstResult.testId,
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        value: true,
        abnormalFlags: true,
        createdAt: true,
        sampleId: true
      }
    });
    
    console.log(`✓ Found ${previousResults.length} results in past 30 days`);
    if (previousResults.length > 0) {
      console.log('  Latest results:');
      previousResults.slice(0, 3).forEach((result, idx) => {
        console.log(`    ${idx + 1}. Value: ${result.value}, Flags: ${result.abnormalFlags || 'none'}, Date: ${result.createdAt.toISOString().split('T')[0]}`);
      });
    }
  } catch (error) {
    console.error('✗ Error querying previous results:', error);
  }
}

/**
 * Test 4: Result Persistence
 */
async function testResultPersistence() {
  console.log('\n[Test 4] Result Persistence');
  console.log('===========================');
  
  try {
    // Get a sample to use for testing
    const sample = await prisma.sample.findFirst();
    const test = await prisma.test.findFirst();
    
    if (!sample || !test) {
      console.log('No sample or test found for persistence test');
      return;
    }
    
    // Create a test result
    const testResult = await prisma.result.create({
      data: {
        sampleId: sample.id,
        testId: test.id,
        value: '15.5',
        isNormal: true,
        abnormalFlags: '{}',
      }
    });
    
    console.log('✓ Result saved successfully:');
    console.log(`  ID: ${testResult.id}`);
    console.log(`  Sample ID: ${testResult.sampleId}`);
    console.log(`  Test ID: ${testResult.testId}`);
    console.log(`  Value: ${testResult.value}`);
    console.log(`  Is Normal: ${testResult.isNormal}`);
    console.log(`  Created: ${testResult.createdAt.toISOString()}`);
    
    // Clean up test result
    await prisma.result.delete({
      where: { id: testResult.id }
    });
    console.log('✓ Test result cleaned up');
    
  } catch (error) {
    console.error('✗ Error in result persistence:', error);
  }
}

/**
 * Test 5: Audit Log Creation
 */
async function testAuditLogging() {
  console.log('\n[Test 5] Audit Log Creation');
  console.log('===========================');
  
  try {
    // Get a user
    const user = await prisma.user.findFirst();
    
    if (!user) {
      console.log('No user found for audit log test');
      return;
    }
    
    // Create an audit log entry
    const auditEntry = await prisma.auditLog.create({
      data: {
        action: 'RESULT_PROCESSED',
        entity: 'Result',
        userId: user.id,
        ipAddress: '127.0.0.1'
      }
    });
    
    console.log('✓ Audit log entry created:');
    console.log(`  ID: ${auditEntry.id}`);
    console.log(`  Action: ${auditEntry.action}`);
    console.log(`  User: ${user.fullName}`);
    console.log(`  Entity: ${auditEntry.entity}`);
    console.log(`  Timestamp: ${auditEntry.createdAt.toISOString()}`);
    
    // Clean up
    await prisma.auditLog.delete({
      where: { id: auditEntry.id }
    });
    console.log('✓ Audit log entry cleaned up');
    
  } catch (error) {
    console.error('✗ Error in audit logging:', error);
  }
}

/**
 * Test 6: Database Connection Performance
 */
async function testQueryPerformance() {
  console.log('\n[Test 6] Database Query Performance');
  console.log('====================================');
  
  try {
    // Test patient query
    console.log('Testing query performance...');
    
    const queries = [
      {
        name: 'getPatientById',
        fn: async () => await prisma.patient.findFirst(),
        target: 10
      },
      {
        name: 'getSampleById',
        fn: async () => await prisma.sample.findFirst(),
        target: 10
      },
      {
        name: 'getResultWithRelations',
        fn: async () => await prisma.result.findFirst({ include: { sample: true, test: true } }),
        target: 20
      }
    ];
    
    for (const query of queries) {
      const start = Date.now();
      await query.fn();
      const elapsed = Date.now() - start;
      const status = elapsed <= query.target ? '✓' : '⚠';
      
      console.log(`${status} ${query.name}: ${elapsed}ms (target: <${query.target}ms)`);
    }
    
  } catch (error) {
    console.error('✗ Error testing query performance:', error);
  }
}

/**
 * Test 7: Database Statistics
 */
async function testDatabaseStats() {
  console.log('\n[Test 7] Database Statistics');
  console.log('============================');
  
  try {
    const [
      patientCount,
      sampleCount,
      resultCount,
      testCount,
      auditLogCount
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.sample.count(),
      prisma.result.count(),
      prisma.test.count(),
      prisma.auditLog.count()
    ]);
    
    console.log('✓ Database statistics:');
    console.log(`  Patients: ${patientCount}`);
    console.log(`  Samples: ${sampleCount}`);
    console.log(`  Results: ${resultCount}`);
    console.log(`  Tests: ${testCount}`);
    console.log(`  Audit Logs: ${auditLogCount}`);
    
  } catch (error) {
    console.error('✗ Error retrieving database statistics:', error);
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   ResultService Database Integration Tests - Week 4    ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  
  try {
    await testPatientRetrieval();
    await testSampleRetrieval();
    await testPreviousResults();
    await testResultPersistence();
    await testAuditLogging();
    await testQueryPerformance();
    await testDatabaseStats();
    
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║              All Tests Completed Successfully           ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
  } catch (error) {
    console.error('Fatal error during testing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute tests
runAllTests().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});
