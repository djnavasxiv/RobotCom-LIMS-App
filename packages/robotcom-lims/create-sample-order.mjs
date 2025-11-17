#!/usr/bin/env node

import { PrismaClient } from './src/generated/prisma-client/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${path.join(__dirname, 'prisma', 'dev.db')}`,
    },
  },
});

async function main() {
  try {
    console.log('=== Creating Sample Order via Direct Database ===\n');

    // Get first patient and tests
    const patient = await prisma.patient.findFirst({
      orderBy: { createdAt: 'asc' },
    });

    if (!patient) {
      console.error('❌ No patients found in database');
      process.exit(1);
    }

    const tests = await prisma.test.findMany({
      take: 3,
      orderBy: { createdAt: 'asc' },
    });

    if (tests.length === 0) {
      console.error('❌ No tests found in database');
      process.exit(1);
    }

    console.log(`1. Selected Patient: ${patient.firstName} ${patient.lastName} (${patient.id})`);
    console.log(`2. Selected Tests (${tests.length}):`);
    tests.forEach((t) => {
      console.log(`   - ${t.name} (${t.code}): $${t.price}`);
    });
    console.log();

    // Calculate totals
    const subtotal = tests.reduce((sum, t) => sum + t.price, 0);
    const discountPercentage = 10;
    const discountAmount = subtotal * (discountPercentage / 100);
    const total = subtotal - discountAmount;

    console.log(`3. Billing Calculation:`);
    console.log(`   - Subtotal: $${subtotal.toFixed(2)}`);
    console.log(`   - Discount (${discountPercentage}%): -$${discountAmount.toFixed(2)}`);
    console.log(`   - Total: $${total.toFixed(2)}`);
    console.log();
    console.log();

    // Generate order number
    const now = new Date();
    const monthYear = String(now.getMonth() + 1).padStart(2, '0') + String(now.getFullYear()).slice(-2);
    
    const existingSamples = await prisma.sample.findMany({
      where: {
        sampleNumber: {
          startsWith: monthYear,
        },
      },
    });
    
    const orderNum = String(existingSamples.length + 1).padStart(3, '0');
    const sampleNumber = `${monthYear}-${orderNum}`;

    console.log(`4. Generated Order Number: ${sampleNumber}`);
    console.log();

    // Create sample
    console.log('5. Creating Sample...');
    const sample = await prisma.sample.create({
      data: {
        sampleNumber,
        patientId: patient.id,
        collectionDate: new Date(),
        status: 'pending',
      },
    });
    console.log(`   ✓ Sample created: ${sample.id}`);

    // Associate tests with sample
    console.log('6. Associating Tests with Sample...');
    const sampleTests = await Promise.all(
      tests.map((test) =>
        prisma.sampleTest.create({
          data: {
            sampleId: sample.id,
            testId: test.id,
            price: test.price,
          },
        })
      )
    );
    console.log(`   ✓ Associated ${sampleTests.length} tests`);

    // Create invoice
    console.log('7. Creating Invoice...');
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-${sampleNumber}`,
        sampleId: sample.id,
        patientId: patient.id,
        labId: (await prisma.lab.findFirst())?.id || 'lab-001',
        subtotal,
        discount: discountAmount,
        total,
        status: 'pending',
        items: {
          create: tests.map((test) => ({
            description: test.name,
            quantity: 1,
            unitPrice: test.price,
            total: test.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });
    console.log(`   ✓ Invoice created: ${invoice.invoiceNumber}`);
    console.log(`   ✓ Invoice Items: ${invoice.items.length}`);

    console.log('\n✅ Sample Order Created Successfully!\n');

    // Verify in database
    console.log('8. Database Verification:');
    const verifyOrder = await prisma.sample.findUnique({
      where: { id: sample.id },
      include: {
        patient: true,
        tests: {
          include: {
            test: true,
          },
        },
        invoice: {
          include: {
            items: true,
          },
        },
      },
    });

    if (verifyOrder) {
      console.log(`   ✓ Sample: ${verifyOrder.sampleNumber}`);
      console.log(`   ✓ Patient: ${verifyOrder.patient.firstName} ${verifyOrder.patient.lastName}`);
      console.log(`   ✓ Tests Ordered: ${verifyOrder.tests.length}`);
      console.log(`   ✓ Invoice Number: ${verifyOrder.invoice?.invoiceNumber}`);
      console.log(`   ✓ Total Amount: $${verifyOrder.invoice?.total.toFixed(2)}`);
    }

    console.log('\n📊 Summary:');
    console.log(`   - Sample Number: ${sample.sampleNumber}`);
    console.log(`   - Order ID: ${sample.id}`);
    console.log(`   - Invoice ID: ${invoice.id}`);
    console.log(`   - Total: $${total.toFixed(2)}`);
  } catch (error) {
    console.error('\n❌ Error creating sample order:', error.message);
    if (error.meta) {
      console.error('Details:', error.meta);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
