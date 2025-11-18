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

    // Create comprehensive test list
    const testData = [
      // Tipificación Sanguínea
      { code: 'abo', name: 'Grupo ABO', price: 10.00, category: 'Tipificación Sanguínea' },
      { code: 'rh', name: 'Factor Rh', price: 10.00, category: 'Tipificación Sanguínea' },
      { code: 'subgrupo', name: 'Subgrupos de Antígenos', price: 15.00, category: 'Tipificación Sanguínea' },
      { code: 'antiglobulina', name: 'Test de Antiglobulinas (Coombs)', price: 20.00, category: 'Tipificación Sanguínea' },
      { code: 'compatibilidad', name: 'Prueba de Compatibilidad', price: 25.00, category: 'Tipificación Sanguínea' },
      
      // Coagulación
      { code: 'pt', name: 'Tiempo de Protrombina (TP)', price: 15.00, category: 'Coagulación' },
      { code: 'inr', name: 'INR', price: 15.00, category: 'Coagulación' },
      { code: 'aptt', name: 'Tiempo de Tromboplastina Parcial Activado', price: 15.00, category: 'Coagulación' },
      { code: 'fibrinogen', name: 'Fibrinógeno', price: 15.00, category: 'Coagulación' },
      { code: 'dd', name: 'Dímero D', price: 20.00, category: 'Coagulación' },
      
      // ELISA
      { code: 'hiv', name: 'VIH 1/2', price: 30.00, category: 'ELISA' },
      { code: 'hbsag', name: 'Hepatitis B', price: 25.00, category: 'ELISA' },
      { code: 'hvc', name: 'Hepatitis C', price: 25.00, category: 'ELISA' },
      { code: 'rpr', name: 'Sífilis RPR/VDRL', price: 20.00, category: 'ELISA' },
      
      // Inmunología
      { code: 'igg', name: 'Inmunoglobulina G (IgG)', price: 18.00, category: 'Inmunología' },
      { code: 'igm', name: 'Inmunoglobulina M (IgM)', price: 18.00, category: 'Inmunología' },
      { code: 'iga', name: 'Inmunoglobulina A (IgA)', price: 18.00, category: 'Inmunología' },
      { code: 'c3', name: 'Proteína C3 del Complemento', price: 20.00, category: 'Inmunología' },
      { code: 'c4', name: 'Proteína C4 del Complemento', price: 20.00, category: 'Inmunología' },
      
      // Hormonas
      { code: 'tsh', name: 'TSH', price: 20.00, category: 'Hormonas' },
      { code: 't4', name: 'T4 Libre', price: 20.00, category: 'Hormonas' },
      { code: 't3', name: 'T3 Libre', price: 20.00, category: 'Hormonas' },
      { code: 'cortisol', name: 'Cortisol', price: 25.00, category: 'Hormonas' },
      { code: 'prolactina', name: 'Prolactina', price: 20.00, category: 'Hormonas' },
      
      // Análisis de Orina
      { code: 'densidad_urina', name: 'Densidad de Orina', price: 8.00, category: 'Análisis de Orina' },
      { code: 'proteina_urina', name: 'Proteína en Orina', price: 8.00, category: 'Análisis de Orina' },
      { code: 'glucosa_urina', name: 'Glucosa en Orina', price: 8.00, category: 'Análisis de Orina' },
      { code: 'hemoglobina_urina', name: 'Hemoglobina en Orina', price: 8.00, category: 'Análisis de Orina' },
      
      // Análisis de Heces
      { code: 'parasitos', name: 'Búsqueda de Parásitos', price: 12.00, category: 'Análisis de Heces' },
      { code: 'sangre_oculta', name: 'Sangre Oculta en Heces', price: 10.00, category: 'Análisis de Heces' },
      { code: 'grasa_fecal', name: 'Grasa en Heces', price: 15.00, category: 'Análisis de Heces' },
      
      // Química Clínica
      { code: 'glucosa', name: 'Glucosa', price: 5.00, category: 'Química' },
      { code: 'sodio', name: 'Sodio', price: 7.00, category: 'Química' },
      { code: 'potasio', name: 'Potasio', price: 7.00, category: 'Química' },
      { code: 'cloruro', name: 'Cloruro', price: 7.00, category: 'Química' },
      { code: 'calcio', name: 'Calcio Total', price: 8.00, category: 'Química' },
      { code: 'colesterol', name: 'Colesterol Total', price: 8.00, category: 'Química' },
      { code: 'ldl', name: 'LDL', price: 8.00, category: 'Química' },
      { code: 'hdl', name: 'HDL', price: 8.00, category: 'Química' },
      { code: 'trigliceridos', name: 'Triglicéridos', price: 8.00, category: 'Química' },
      { code: 'ast', name: 'AST (GOT)', price: 8.00, category: 'Química' },
      { code: 'alt', name: 'ALT (GPT)', price: 8.00, category: 'Química' },
      
      // Pruebas de Embarazo
      { code: 'bhcg_sangre', name: 'Beta hCG en Sangre', price: 15.00, category: 'Embarazo' },
      { code: 'hcg_orina', name: 'hCG en Orina', price: 10.00, category: 'Embarazo' },
      
      // Hematología
      { code: 'rbc', name: 'Glóbulos Rojos', price: 10.00, category: 'Hematología' },
      { code: 'wbc', name: 'Glóbulos Blancos', price: 10.00, category: 'Hematología' },
      { code: 'hemoglobina', name: 'Hemoglobina', price: 10.00, category: 'Hematología' },
      { code: 'hematocrito', name: 'Hematocrito', price: 10.00, category: 'Hematología' },
      { code: 'plaquetas', name: 'Plaquetas', price: 10.00, category: 'Hematología' },
      
      // Bacteriología
      { code: 'cultivo_sangre', name: 'Cultivo de Sangre', price: 30.00, category: 'Bacteriología' },
      { code: 'cultivo_orina', name: 'Cultivo de Orina', price: 25.00, category: 'Bacteriología' },
      { code: 'gram', name: 'Tinción de Gram', price: 15.00, category: 'Bacteriología' },
      { code: 'antibiograma', name: 'Antibiograma', price: 20.00, category: 'Bacteriología' },
      
      // Espermatobioscopia
      { code: 'concentracion', name: 'Concentración de Espermatozoides', price: 35.00, category: 'Espermatobioscopia' },
      { code: 'movilidad', name: 'Movilidad de Espermatozoides', price: 35.00, category: 'Espermatobioscopia' },
      { code: 'morfologia', name: 'Morfología Normal', price: 35.00, category: 'Espermatobioscopia' },
      
      // Virus Bacterianas
      { code: 'rubeola_igg', name: 'Rubeola IgG', price: 20.00, category: 'Virus Bacterianas' },
      { code: 'varicela_igg', name: 'Varicela-Zóster IgG', price: 20.00, category: 'Virus Bacterianas' },
      
      // Virus Heces
      { code: 'rotavirus', name: 'Rotavirus', price: 20.00, category: 'Virus Heces' },
      { code: 'norovirus', name: 'Norovirus', price: 20.00, category: 'Virus Heces' },
      
      // Virus Hematológicas
      { code: 'cmv_igg', name: 'CMV IgG', price: 25.00, category: 'Virus Hematológicas' },
      { code: 'ebv', name: 'EBV', price: 25.00, category: 'Virus Hematológicas' },
      { code: 'dengue', name: 'Dengue', price: 30.00, category: 'Virus Hematológicas' },
    ];

    await prisma.test.createMany({
      data: testData,
    });
    console.log(`✓ Created ${testData.length} tests`);

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
        birthDate: new Date('1990-03-22'),
        phone: '555-0102',
        email: 'maria@example.com',
        labId: lab.id,
      },
    });
    console.log(`✓ Created patient: ${patient2.firstName} ${patient2.lastName}`);

    // Create sample test profile
    const testProfile = await prisma.testProfile.create({
      data: {
        name: 'Perfil Básico',
        description: 'Panel básico de análisis químico',
        tests: {
          create: [
            { testId: (await prisma.test.findFirst({ where: { code: 'GLU' } }))!.id },
            { testId: (await prisma.test.findFirst({ where: { code: 'CHO' } }))!.id },
            { testId: (await prisma.test.findFirst({ where: { code: 'TRI' } }))!.id },
          ],
        },
      },
    });
    console.log(`✓ Created test profile: ${testProfile.name}`);

    // Create sample orders
    const sample1 = await prisma.sample.create({
      data: {
        sampleNumber: 'S001',
        patientId: patient1.id,
        status: 'pending',
        collectionDate: new Date(),
        tests: {
          create: [
            {
              testId: (await prisma.test.findFirst({ where: { code: 'GLU' } }))!.id,
              price: 5.00,
            },
            {
              testId: (await prisma.test.findFirst({ where: { code: 'CHO' } }))!.id,
              price: 7.50,
            },
          ],
        },
      },
    });
    console.log(`✓ Created sample: ${sample1.sampleNumber}`);

    const sample2 = await prisma.sample.create({
      data: {
        sampleNumber: 'S002',
        patientId: patient2.id,
        status: 'completed',
        collectionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        tests: {
          create: [
            {
              testId: (await prisma.test.findFirst({ where: { code: 'CBC' } }))!.id,
              price: 15.00,
            },
          ],
        },
      },
    });
    console.log(`✓ Created sample: ${sample2.sampleNumber}`);

    // Create invoices
    const invoice1 = await prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-001',
        patientId: patient1.id,
        sampleId: sample1.id,
        labId: lab.id,
        subtotal: 12.50,
        discount: 0,
        total: 12.50,
        status: 'pending',
        items: {
          create: [
            {
              description: 'Glucosa',
              quantity: 1,
              unitPrice: 5.00,
              total: 5.00,
            },
            {
              description: 'Colesterol Total',
              quantity: 1,
              unitPrice: 7.50,
              total: 7.50,
            },
          ],
        },
      },
    });
    console.log(`✓ Created invoice: ${invoice1.invoiceNumber}`);

    const invoice2 = await prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-002',
        patientId: patient2.id,
        sampleId: sample2.id,
        labId: lab.id,
        subtotal: 15.00,
        discount: 0,
        total: 15.00,
        status: 'paid',
        items: {
          create: [
            {
              description: 'Hemograma Completo',
              quantity: 1,
              unitPrice: 15.00,
              total: 15.00,
            },
          ],
        },
      },
    });
    console.log(`✓ Created invoice: ${invoice2.invoiceNumber}`);

    console.log('✓ Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
