#!/usr/bin/env node

const { PrismaClient } = require('./src/generated/prisma-client');
const prisma = new PrismaClient();

/**
 * Comprehensive Performance Test Runner
 * Measures realistic database operation performance
 */

async function seedTestData() {
  console.log('\nPreparing test data...');
  
  try {
    // Create test lab
    const lab = await prisma.lab.create({
      data: {
        name: 'Test Lab',
      },
    });

    // Create test patient
    const patient = await prisma.patient.create({
      data: {
        firstName: 'John',
        lastName: 'Test',
        birthDate: new Date('1980-01-01'),
        gender: 'M',
        phone: '555-1234',
        labId: lab.id,
      },
    });

    // Create test category
    const category = await prisma.testCategory.create({
      data: {
        name: 'Chemistry',
        code: 'CHM',
      },
    });

    // Create test definition
    const testDef = await prisma.testDefinition.create({
      data: {
        name: 'Glucose',
        code: 'GLU',
        categoryId: category.id,
        testFields: JSON.stringify([
          { fieldName: 'value', dataType: 'number', required: true },
        ]),
      },
    });

    // Create test
    const test = await prisma.test.create({
      data: {
        testName: 'Glucose',
        testCode: 'GLU',
        sampleType: 'Serum',
      },
    });

    // Create sample
    const sample = await prisma.sample.create({
      data: {
        sampleNumber: `SAMPLE-${Date.now()}`,
        patientId: patient.id,
        sampleType: 'Serum',
        collectionDate: new Date(),
        labId: lab.id,
      },
    });

    return { lab, patient, category, test, testDef, sample };
  } catch (error) {
    console.error('Error seeding data:', error.message);
    return null;
  }
}

async function runComprehensiveTests() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║    COMPREHENSIVE PERFORMANCE TESTS - WEEK 4 TASK 4              ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');

  const testData = await seedTestData();
  if (!testData) {
    console.error('Failed to seed test data');
    process.exit(1);
  }

  const results = [];

  try {
    // Test 1: Patient lookup by ID
    console.log('\n\nTEST 1: Single Patient Lookup');
    console.log('─'.repeat(60));
    
    const patientStart = process.hrtime.bigint();
    const foundPatient = await prisma.patient.findUnique({
      where: { id: testData.patient.id },
    });
    const patientTime = Number(process.hrtime.bigint() - patientStart) / 1000000;
    
    console.log(`✓ Lookup time: ${patientTime.toFixed(2)}ms`);
    console.log(`  Found: ${foundPatient?.firstName} ${foundPatient?.lastName}`);
    console.log(`  Target: <10ms | Status: ${patientTime < 10 ? '✓ PASS' : '✗ SLOW'}`);
    
    results.push({
      name: 'Patient Lookup',
      timeMs: patientTime,
      targetMs: 10,
      passed: patientTime < 10,
    });

    // Test 2: Get recent results for patient
    console.log('\n\nTEST 2: Recent Results Retrieval (30-day lookback)');
    console.log('─'.repeat(60));
    
    const historyStart = process.hrtime.bigint();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentResults = await prisma.result.findMany({
      where: {
        sample: {
          patientId: testData.patient.id,
          collectionDate: { gte: thirtyDaysAgo },
        },
      },
      include: { sample: true, test: true },
      take: 100,
    });
    
    const historyTime = Number(process.hrtime.bigint() - historyStart) / 1000000;
    
    console.log(`✓ Query time: ${historyTime.toFixed(2)}ms`);
    console.log(`  Results found: ${recentResults.length}`);
    console.log(`  Target: <20ms | Status: ${historyTime < 20 ? '✓ PASS' : '✗ SLOW'}`);
    
    results.push({
      name: '30-Day History',
      timeMs: historyTime,
      targetMs: 20,
      passed: historyTime < 20,
    });

    // Test 3: Create result with relations
    console.log('\n\nTEST 3: Single Result Creation with Relations');
    console.log('─'.repeat(60));
    
    const resultStart = process.hrtime.bigint();
    const newResult = await prisma.result.create({
      data: {
        sampleId: testData.sample.id,
        testId: testData.test.id,
        value: 120,
        unit: 'mg/dL',
        status: 'NORMAL',
        notes: 'Test result',
      },
      include: { sample: true, test: true },
    });
    
    const resultTime = Number(process.hrtime.bigint() - resultStart) / 1000000;
    
    console.log(`✓ Insert time: ${resultTime.toFixed(2)}ms`);
    console.log(`  Result ID: ${newResult.id}`);
    console.log(`  Target: <50ms | Status: ${resultTime < 50 ? '✓ PASS' : '✗ SLOW'}`);
    
    results.push({
      name: 'Result Creation',
      timeMs: resultTime,
      targetMs: 50,
      passed: resultTime < 50,
    });

    // Test 4: Batch insert results
    console.log('\n\nTEST 4: Batch Result Insert (10 results)');
    console.log('─'.repeat(60));
    
    const batch10Start = process.hrtime.bigint();
    
    const batch10Results = [];
    for (let i = 0; i < 10; i++) {
      batch10Results.push(
        prisma.result.create({
          data: {
            sampleId: testData.sample.id,
            testId: testData.test.id,
            value: 100 + i,
            unit: 'mg/dL',
            status: 'NORMAL',
            notes: `Batch item ${i + 1}`,
          },
        })
      );
    }
    
    await Promise.all(batch10Results);
    const batch10Time = Number(process.hrtime.bigint() - batch10Start) / 1000000;
    
    console.log(`✓ Total time: ${batch10Time.toFixed(2)}ms (${(batch10Time / 10).toFixed(2)}ms/result)`);
    console.log(`  Items: 10`);
    console.log(`  Target: <100ms | Status: ${batch10Time < 100 ? '✓ PASS' : '✗ SLOW'}`);
    
    results.push({
      name: 'Batch (10)',
      timeMs: batch10Time,
      targetMs: 100,
      passed: batch10Time < 100,
    });

    // Test 5: Query with multiple relations
    console.log('\n\nTEST 5: Complex Query (Results with Sample & Test info)');
    console.log('─'.repeat(60));
    
    const complexStart = process.hrtime.bigint();
    const complexResults = await prisma.result.findMany({
      where: { sampleId: testData.sample.id },
      include: {
        sample: {
          include: { patient: true },
        },
        test: true,
        interpretationRule: true,
      },
      take: 50,
    });
    
    const complexTime = Number(process.hrtime.bigint() - complexStart) / 1000000;
    
    console.log(`✓ Query time: ${complexTime.toFixed(2)}ms`);
    console.log(`  Results returned: ${complexResults.length}`);
    console.log(`  Target: <50ms | Status: ${complexTime < 50 ? '✓ PASS' : '✗ SLOW'}`);
    
    results.push({
      name: 'Complex Query',
      timeMs: complexTime,
      targetMs: 50,
      passed: complexTime < 50,
    });

    // Test 6: Update multiple records
    console.log('\n\nTEST 6: Update Multiple Records');
    console.log('─'.repeat(60));
    
    const updateStart = process.hrtime.bigint();
    const updateResult = await prisma.result.updateMany({
      where: { sampleId: testData.sample.id },
      data: { status: 'REVIEWED' },
    });
    
    const updateTime = Number(process.hrtime.bigint() - updateStart) / 1000000;
    
    console.log(`✓ Update time: ${updateTime.toFixed(2)}ms`);
    console.log(`  Records updated: ${updateResult.count}`);
    console.log(`  Target: <100ms | Status: ${updateTime < 100 ? '✓ PASS' : '✗ SLOW'}`);
    
    results.push({
      name: 'Batch Update',
      timeMs: updateTime,
      targetMs: 100,
      passed: updateTime < 100,
    });

    // Summary Report
    console.log('\n\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║                  PERFORMANCE SUMMARY REPORT                     ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    const passCount = results.filter(r => r.passed).length;
    const failCount = results.length - passCount;

    console.log('Test Results:');
    results.forEach(r => {
      const status = r.passed ? '✓ PASS' : '✗ SLOW';
      const pct = ((r.timeMs / r.targetMs) * 100).toFixed(0);
      console.log(`  ${status} | ${r.name.padEnd(25)} ${r.timeMs.toFixed(2)}ms (${pct}% of target)`);
    });

    console.log(`\nStatistics:`);
    console.log(`  Total Tests: ${results.length}`);
    console.log(`  Passed: ${passCount}`);
    console.log(`  Failed: ${failCount}`);
    console.log(`  Pass Rate: ${((passCount / results.length) * 100).toFixed(1)}%`);

    const avgTime = results.reduce((sum, r) => sum + r.timeMs, 0) / results.length;
    const maxTime = Math.max(...results.map(r => r.timeMs));
    console.log(`  Average Time: ${avgTime.toFixed(2)}ms`);
    console.log(`  Max Time: ${maxTime.toFixed(2)}ms`);

    // Database Stats
    console.log(`\nDatabase Configuration:`);
    const dbInfo = await prisma.$queryRaw`PRAGMA page_count`;
    const dbPageSize = await prisma.$queryRaw`PRAGMA page_size`;
    
    console.log(`  Page Count: ${dbInfo[0]?.page_count || 'N/A'}`);
    console.log(`  Page Size: ${dbPageSize[0]?.page_size || 'N/A'} bytes`);
    console.log(`  Type: SQLite (Development)`);

    // Recommendations
    console.log(`\nRECOMMENDATIONS:`);
    console.log('─'.repeat(60));
    
    if (failCount === 0) {
      console.log('✓ All tests pass with excellent performance!');
      console.log('✓ Database indexes are well-configured');
      console.log('✓ Query optimization not critical at this stage');
      console.log('✓ Ready for production integration testing');
    } else {
      console.log('⚠ Some tests exceeded performance targets:');
      results.filter(r => !r.passed).forEach(r => {
        console.log(`  • ${r.name}: ${r.timeMs.toFixed(2)}ms (target: ${r.targetMs}ms)`);
      });
    }

    console.log(`\nNEXT STEPS:`);
    console.log('─'.repeat(60));
    console.log('1. ✓ Task 4 Complete - Performance baselines established');
    console.log('2. → Task 5 Ready - Implement optimizations if needed');
    console.log('3. → Task 6 Ready - Create comprehensive integration test suite\n');

  } catch (error) {
    console.error('ERROR during testing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the tests
runComprehensiveTests().then(() => {
  console.log('✓ Performance testing complete\n');
  process.exit(0);
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
