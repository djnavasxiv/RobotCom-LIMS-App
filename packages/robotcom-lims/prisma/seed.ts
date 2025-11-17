import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  try {
    console.log('Starting seeding...');
    
    // Check if already seeded
    const existingLabs = await prisma.lab.findMany();
    if (existingLabs.length > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }

    // Create a lab
    const lab = await prisma.lab.create({
      data: {
        name: 'RobotComLab Principal',
        address: '123 Main St, Anytown USA',
        phone: '555-1234',
        email: 'contact@robotcomlab.com',
      },
    });
    console.log(`✓ Created lab: ${lab.name}`);

    // Create a user
    const passwordHash = await bcrypt.hash('password', SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        username: 'admin',
        password: passwordHash,
        fullName: 'Admin User',
        email: 'admin@robotcomlab.com',
        role: 'admin',
        labId: lab.id,
      },
    });
    console.log(`✓ Created user: ${user.username}`);

    // Create some tests
    await prisma.test.createMany({
      data: [
        { code: 'GLU', name: 'Glucosa', price: 5.00, category: 'Química' },
        { code: 'CHO', name: 'Colesterol Total', price: 7.50, category: 'Química' },
        { code: 'TRI', name: 'Triglicéridos', price: 7.50, category: 'Química' },
        { code: 'URI', name: 'Ácido Úrico', price: 6.00, category: 'Química' },
        { code: 'CBC', name: 'Hemograma Completo', price: 15.00, category: 'Hematología' },
        // Test Results module tests
        { code: 'coagulacion', name: 'Pruebas de Coagulación', price: 20.00, category: 'Hematología' },
        { code: 'grupo_sanguineo', name: 'Grupo Sanguíneo', price: 10.00, category: 'Hematología' },
        { code: 'elisa', name: 'ELISA', price: 25.00, category: 'Serología' },
        { code: 'embarazo', name: 'Prueba de Embarazo', price: 15.00, category: 'Química' },
        { code: 'urinalisis', name: 'Urinalisis', price: 10.00, category: 'Análisis de Orina' },
        { code: 'quimica', name: 'Panel de Química', price: 30.00, category: 'Química' },
        { code: 'inmunologia', name: 'Panel Inmunológico', price: 35.00, category: 'Inmunología' },
        { code: 'hormonas', name: 'Panel de Hormonas', price: 40.00, category: 'Endocrinología' },
        { code: 'heces', name: 'Análisis de Heces', price: 15.00, category: 'Análisis Especiales' },
      ],
    });
    console.log('✓ Created 14 tests');

    // Create sample patients
    const patient1 = await prisma.patient.create({
      data: {
        firstName: 'Juan',
        lastName: 'Pérez',
        gender: 'M',
        birthDate: new Date('1985-05-15'),
        phone: '555-0101',
        email: 'juan@example.com',
        labId: lab.id,
      },
    });
    console.log(`✓ Created patient: ${patient1.firstName} ${patient1.lastName}`);

    const patient2 = await prisma.patient.create({
      data: {
        firstName: 'María',
        lastName: 'García',
        gender: 'F',
        birthDate: new Date('1990-08-22'),
        phone: '555-0102',
        email: 'maria@example.com',
        labId: lab.id,
      },
    });
    console.log(`✓ Created patient: ${patient2.firstName} ${patient2.lastName}`);

    // Create test profile
    const testProfile = await prisma.testProfile.create({
      data: {
        name: 'Panel General',
        description: 'Perfil general de pruebas',
      },
    });
    console.log(`✓ Created test profile: ${testProfile.name}`);

    // Get all tests for adding to profile
    const allTests = await prisma.test.findMany();
    
    // Add tests to profile
    await prisma.testProfileItem.createMany({
      data: allTests.map((test) => ({
        profileId: testProfile.id,
        testId: test.id,
      })),
    });
    console.log(`✓ Added ${allTests.length} tests to profile`);

    // Create samples with tests (for testing test results entry)
    const sample1 = await prisma.sample.create({
      data: {
        sampleNumber: 'S-001',
        patientId: patient1.id,
        collectionDate: new Date(),
        status: 'pending_results',
        profileId: testProfile.id,
      },
    });
    console.log(`✓ Created sample: ${sample1.sampleNumber}`);

    // Add tests to sample
    const testSubset = allTests.slice(5, 9); // Get the test results module tests
    await prisma.sampleTest.createMany({
      data: testSubset.map((test) => ({
        sampleId: sample1.id,
        testId: test.id,
        price: test.price,
      })),
    });
    console.log(`✓ Added ${testSubset.length} tests to sample`);

    // Create another sample with different patient
    const sample2 = await prisma.sample.create({
      data: {
        sampleNumber: 'S-002',
        patientId: patient2.id,
        collectionDate: new Date(),
        status: 'pending_results',
        profileId: testProfile.id,
      },
    });
    console.log(`✓ Created sample: ${sample2.sampleNumber}`);

    await prisma.sampleTest.createMany({
      data: testSubset.map((test) => ({
        sampleId: sample2.id,
        testId: test.id,
        price: test.price,
      })),
    });
    console.log(`✓ Added ${testSubset.length} tests to sample`);

    console.log('\n✓ Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
