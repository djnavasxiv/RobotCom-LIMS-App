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
    console.log('=== Creating Second Sample Order ===\n');

    // Get second patient and tests
    const patient = await prisma.patient.findFirst({
      where: { id: 'pat-001' },
    });

    const tests = await prisma.test.findMany({
      where: { code: { in: ['CBC', 'CREAT'] } },
    });

    console.log(`Patient: ${patient.firstName} ${patient.lastName}`);
    console.log(`Tests: ${tests.map(t => t.name).join(', ')}`);

    const subtotal = tests.reduce((sum, t) => sum + t.price, 0);
    const discountAmount = subtotal * 0.05; // 5% discount
    const total = subtotal - discountAmount;

    const now = new Date();
    const monthYear = String(now.getMonth() + 1).padStart(2, '0') + String(now.getFullYear()).slice(-2);
    const existingSamples = await prisma.sample.count({
      where: { sampleNumber: { startsWith: monthYear } },
    });
    const sampleNumber = `${monthYear}-${String(existingSamples + 1).padStart(3, '0')}`;

    const sample = await prisma.sample.create({
      data: {
        sampleNumber,
        patientId: patient.id,
        collectionDate: new Date(),
        status: 'pending',
      },
    });

    await Promise.all(
      tests.map((test) =>
        prisma.sampleTest.create({
          data: { sampleId: sample.id, testId: test.id, price: test.price },
        })
      )
    );

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-${sampleNumber}`,
        sampleId: sample.id,
        patientId: patient.id,
        labId: 'lab-001',
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
    });

    console.log(`\n✅ Order Created: ${sampleNumber}`);
    console.log(`   Invoice: ${invoice.invoiceNumber}`);
    console.log(`   Total: $${total.toFixed(2)}`);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
