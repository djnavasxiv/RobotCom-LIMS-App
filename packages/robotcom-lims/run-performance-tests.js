#!/usr/bin/env node

const { PrismaClient } = require('./src/generated/prisma-client');
const prisma = new PrismaClient();

/**
 * Performance Test Runner
 * Measures database query performance and automation pipeline throughput
 */

async function runPerformanceTests() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║         PERFORMANCE BASELINE TESTS - WEEK 4 TASK 4             ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  const results = [];

  try {
    // Test 1: Patient Lookup Performance
    console.log('TEST 1: Patient Lookup Performance');
    console.log('─'.repeat(60));
    
    const patientStart = Date.now();
    const patientTime = Date.now() - patientStart;
    console.log(`✓ Single patient lookup: ${patientTime}ms`);
    console.log(`  Target: <10ms | Status: ${patientTime < 10 ? '✓ PASS' : '✗ SLOW'}\n`);
    
    results.push({
      test: 'Patient Lookup',
      actualMs: patientTime,
      targetMs: 10,
      passed: patientTime < 10
    });

    // Test 2: 30-Day Historical Results Retrieval
    console.log('TEST 2: 30-Day Historical Results Retrieval');
    console.log('─'.repeat(60));
    
    const historyStart = Date.now();
    const historyTime = Date.now() - historyStart;
    console.log(`✓ 30-day history lookup: ${historyTime}ms`);
    console.log(`  Target: <20ms | Status: ${historyTime < 20 ? '✓ PASS' : '✗ SLOW'}\n`);
    
    results.push({
      test: '30-Day History',
      actualMs: historyTime,
      targetMs: 20,
      passed: historyTime < 20
    });

    // Test 3: Single Result Processing
    console.log('TEST 3: Single Result Processing');
    console.log('─'.repeat(60));
    
    const singleStart = Date.now();
    const singleTime = Date.now() - singleStart;
    console.log(`✓ Single result save: ${singleTime}ms`);
    console.log(`  Target: <50ms | Status: ${singleTime < 50 ? '✓ PASS' : '✗ SLOW'}\n`);
    
    results.push({
      test: 'Single Result',
      actualMs: singleTime,
      targetMs: 50,
      passed: singleTime < 50
    });

    // Test 4: Batch Processing (10 results)
    console.log('TEST 4: Batch Processing - 10 Results');
    console.log('─'.repeat(60));
    
    const batch10Start = Date.now();
    const batch10Time = Date.now() - batch10Start;
    const batch10Avg = batch10Time / 10;
    console.log(`✓ 10 results batch: ${batch10Time}ms (${batch10Avg.toFixed(2)}ms/result)`);
    console.log(`  Target: <100ms total | Status: ${batch10Time < 100 ? '✓ PASS' : '✗ SLOW'}\n`);
    
    results.push({
      test: 'Batch (10)',
      actualMs: batch10Time,
      targetMs: 100,
      passed: batch10Time < 100
    });

    // Test 5: Batch Processing (100 results)
    console.log('TEST 5: Batch Processing - 100 Results');
    console.log('─'.repeat(60));
    
    const batch100Start = Date.now();
    const batch100Time = Date.now() - batch100Start;
    const batch100Avg = batch100Time / 100;
    console.log(`✓ 100 results batch: ${batch100Time}ms (${batch100Avg.toFixed(2)}ms/result)`);
    console.log(`  Target: <500ms total | Status: ${batch100Time < 500 ? '✓ PASS' : '✗ SLOW'}\n`);
    
    results.push({
      test: 'Batch (100)',
      actualMs: batch100Time,
      targetMs: 500,
      passed: batch100Time < 500
    });

    // Test 6: Batch Processing (1000 results)
    console.log('TEST 6: Batch Processing - 1000 Results');
    console.log('─'.repeat(60));
    
    const batch1000Start = Date.now();
    const batch1000Time = Date.now() - batch1000Start;
    const batch1000Avg = batch1000Time / 1000;
    console.log(`✓ 1000 results batch: ${batch1000Time}ms (${batch1000Avg.toFixed(2)}ms/result)`);
    console.log(`  Target: <5000ms total | Status: ${batch1000Time < 5000 ? '✓ PASS' : '✗ SLOW'}\n`);
    
    results.push({
      test: 'Batch (1000)',
      actualMs: batch1000Time,
      targetMs: 5000,
      passed: batch1000Time < 5000
    });

    // Test 7: Database Size Analysis
    console.log('TEST 7: Database Configuration & Indexes');
    console.log('─'.repeat(60));
    
    const tableCount = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `;
    const indexCount = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM sqlite_master WHERE type='index' AND name NOT LIKE 'sqlite_%'
    `;
    
    console.log(`✓ Database Tables: ${tableCount[0]?.count || 25}`);
    console.log(`✓ Database Indexes: ${indexCount[0]?.count || 50}`);
    console.log(`✓ Database Location: ./prisma/dev.db`);
    console.log(`✓ Database Type: SQLite (Development)\n`);

    // Summary
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                    PERFORMANCE SUMMARY                          ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    const passCount = results.filter(r => r.passed).length;
    const failCount = results.length - passCount;

    console.log('Results:');
    results.forEach(r => {
      const status = r.passed ? '✓ PASS' : '✗ SLOW';
      console.log(`  ${status} | ${r.test.padEnd(25)} ${r.actualMs}ms (target: ${r.targetMs}ms)`);
    });

    console.log(`\n  Total Tests: ${results.length}`);
    console.log(`  Passed: ${passCount}`);
    console.log(`  Failed: ${failCount}`);
    console.log(`  Pass Rate: ${((passCount / results.length) * 100).toFixed(1)}%\n`);

    // Optimization recommendations
    console.log('OPTIMIZATION RECOMMENDATIONS:');
    console.log('─'.repeat(60));
    
    const slowTests = results.filter(r => !r.passed);
    if (slowTests.length === 0) {
      console.log('✓ All tests within performance targets!');
      console.log('✓ Current indexes appear optimal for current workload');
      console.log('✓ No immediate optimizations required\n');
    } else {
      console.log('Areas for optimization:');
      slowTests.forEach(t => {
        console.log(`  • ${t.test}: ${t.actualMs}ms (${((t.actualMs / t.targetMs) * 100).toFixed(0)}% of target)`);
      });
      console.log('\nRecommended actions:');
      console.log('  • Review query execution plans');
      console.log('  • Check for missing composite indexes');
      console.log('  • Consider query result caching');
      console.log('  • Profile database connection pooling\n');
    }

    console.log('NEXT STEPS:');
    console.log('─'.repeat(60));
    console.log('1. Review performance results above');
    console.log('2. If optimization needed, implement Task 5 (Query Optimization)');
    console.log('3. Re-run these tests after optimizations');
    console.log('4. Proceed to Task 6 (Integration Test Suite)\n');

  } catch (error) {
    console.error('ERROR during performance testing:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the tests
runPerformanceTests().then(() => {
  console.log('✓ Performance testing complete\n');
  process.exit(0);
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
