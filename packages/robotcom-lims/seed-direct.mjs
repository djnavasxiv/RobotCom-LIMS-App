import { PrismaClient } from './src/generated/prisma-client/index.js';
import bcrypt from 'bcrypt';
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
const SALT_ROUNDS = 10;

async function main() {
  try {
    // Create a lab
    const lab = await prisma.lab.create({
      data: {
        id: 'lab-001',
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
        id: 'user-admin',
        username: 'admin',
        password: passwordHash,
        fullName: 'Admin User',
        email: 'admin@robotcomlab.com',
        role: 'admin',
        labId: lab.id,
      },
    });
    console.log(`✓ Created user: ${user.username}`);

    // Create patients
    const patients = await Promise.all([
      prisma.patient.create({
        data: {
          id: 'pat-001',
          firstName: 'Juan',
          lastName: 'González',
          email: 'juan@example.com',
          phone: '555-0001',
          birthDate: new Date('1990-05-15'),
          gender: 'M',
          address: '123 Elm St, Anytown USA',
          labId: lab.id,
        },
      }),
      prisma.patient.create({
        data: {
          id: 'pat-002',
          firstName: 'María',
          lastName: 'Rodríguez',
          email: 'maria@example.com',
          phone: '555-0002',
          birthDate: new Date('1985-03-22'),
          gender: 'F',
          address: '456 Oak St, Anytown USA',
          labId: lab.id,
        },
      }),
      prisma.patient.create({
        data: {
          id: 'pat-003',
          firstName: 'Carlos',
          lastName: 'López',
          email: 'carlos@example.com',
          phone: '555-0003',
          birthDate: new Date('1992-08-10'),
          gender: 'M',
          address: '789 Pine St, Anytown USA',
          labId: lab.id,
        },
      }),
    ]);
    console.log(`✓ Created ${patients.length} patients`);

    // Create tests
    const tests = await Promise.all([
      prisma.test.create({
        data: {
          id: 'test-001',
          code: 'CBC',
          name: 'Conteo Completo de Células de Sangre',
          price: 150.00,
          category: 'Hematología',
          unit: 'cel/µL',
        },
      }),
      prisma.test.create({
        data: {
          id: 'test-002',
          code: 'TSH',
          name: 'Hormona Estimulante de la Tiroides',
          price: 200.00,
          category: 'Hormonas',
          unit: 'mIU/L',
        },
      }),
      prisma.test.create({
        data: {
          id: 'test-003',
          code: 'GLUC',
          name: 'Glucosa en Ayunas',
          price: 100.00,
          category: 'Química Clínica',
          unit: 'mg/dL',
        },
      }),
      prisma.test.create({
        data: {
          id: 'test-004',
          code: 'CREAT',
          name: 'Creatinina',
          price: 120.00,
          category: 'Química Clínica',
          unit: 'mg/dL',
        },
      }),
      prisma.test.create({
        data: {
          id: 'test-005',
          code: 'HIVAb',
          name: 'Anticuerpos VIH',
          price: 250.00,
          category: 'Serología',
          unit: 'Cualitativo',
        },
      }),
    ]);
    console.log(`✓ Created ${tests.length} tests`);

    console.log('\n✓ Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
