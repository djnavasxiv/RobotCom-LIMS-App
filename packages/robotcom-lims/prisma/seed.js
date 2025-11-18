const { PrismaClient } = require('../src/generated/prisma-client');
const bcrypt = require('bcrypt');

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
      { code: 'tppa', name: 'TPPA Sífilis', price: 20.00, category: 'ELISA' },
      
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
      { code: 'celulas_blancas_orina', name: 'Células Blancas en Orina', price: 8.00, category: 'Análisis de Orina' },
      
      // Análisis de Heces
      { code: 'parasitos', name: 'Búsqueda de Parásitos', price: 12.00, category: 'Análisis de Heces' },
      { code: 'sangre_oculta', name: 'Sangre Oculta en Heces', price: 10.00, category: 'Análisis de Heces' },
      { code: 'grasa_fecal', name: 'Grasa en Heces', price: 15.00, category: 'Análisis de Heces' },
      { code: 'leucocitos_heces', name: 'Leucocitos en Heces', price: 10.00, category: 'Análisis de Heces' },
      { code: 'cultivo_heces', name: 'Cultivo de Heces', price: 20.00, category: 'Análisis de Heces' },
      
      // Química Clínica
      { code: 'glucosa', name: 'Glucosa', price: 5.00, category: 'Química Clínica' },
      { code: 'sodio', name: 'Sodio', price: 7.00, category: 'Química Clínica' },
      { code: 'potasio', name: 'Potasio', price: 7.00, category: 'Química Clínica' },
      { code: 'cloruro', name: 'Cloruro', price: 7.00, category: 'Química Clínica' },
      { code: 'calcio', name: 'Calcio Total', price: 8.00, category: 'Química Clínica' },
      { code: 'colesterol', name: 'Colesterol Total', price: 8.00, category: 'Química Clínica' },
      { code: 'ldl', name: 'LDL', price: 8.00, category: 'Química Clínica' },
      { code: 'hdl', name: 'HDL', price: 8.00, category: 'Química Clínica' },
      { code: 'trigliceridos', name: 'Triglicéridos', price: 8.00, category: 'Química Clínica' },
      { code: 'ast', name: 'AST (GOT)', price: 8.00, category: 'Química Clínica' },
      
      // Pruebas de Embarazo
      { code: 'bhcg_sangre', name: 'Beta hCG en Sangre', price: 15.00, category: 'Embarazo' },
      { code: 'hcg_orina', name: 'hCG en Orina', price: 10.00, category: 'Embarazo' },
      { code: 'progesterona', name: 'Progesterona', price: 20.00, category: 'Embarazo' },
      { code: 'estriol', name: 'Estriol', price: 20.00, category: 'Embarazo' },
      { code: 'afp', name: 'Alfa Fetoproteína (AFP)', price: 25.00, category: 'Embarazo' },
      
      // Hematología Completa
      { code: 'rbc', name: 'Glóbulos Rojos (RBC)', price: 10.00, category: 'Hematología' },
      { code: 'wbc', name: 'Glóbulos Blancos (WBC)', price: 10.00, category: 'Hematología' },
      { code: 'hemoglobina', name: 'Hemoglobina', price: 10.00, category: 'Hematología' },
      { code: 'hematocrito', name: 'Hematocrito', price: 10.00, category: 'Hematología' },
      { code: 'plaquetas', name: 'Plaquetas', price: 10.00, category: 'Hematología' },
      
      // Pruebas Bacteriológicas
      { code: 'cultivo_sangre', name: 'Cultivo de Sangre', price: 30.00, category: 'Bacteriología' },
      { code: 'cultivo_orina', name: 'Cultivo de Orina', price: 25.00, category: 'Bacteriología' },
      { code: 'gram', name: 'Tinción de Gram', price: 15.00, category: 'Bacteriología' },
      { code: 'antibiograma', name: 'Antibiograma', price: 20.00, category: 'Bacteriología' },
      { code: 'cultivo_general', name: 'Cultivo General', price: 20.00, category: 'Bacteriología' },
      
      // Análisis de Esperma
      { code: 'concentracion', name: 'Concentración de Espermatozoides', price: 35.00, category: 'Espermatobioscopia' },
      { code: 'movilidad', name: 'Movilidad de Espermatozoides', price: 35.00, category: 'Espermatobioscopia' },
      { code: 'morfologia', name: 'Morfología Normal', price: 35.00, category: 'Espermatobioscopia' },
      { code: 'viabilidad', name: 'Viabilidad de Espermatozoides', price: 35.00, category: 'Espermatobioscopia' },
      { code: 'volumen_semen', name: 'Volumen de Semen', price: 35.00, category: 'Espermatobioscopia' },
      
      // Virus Bacterianas
      { code: 'rubeola_igg', name: 'Rubeola IgG', price: 20.00, category: 'Virus Bacterianas' },
      { code: 'varicela_igg', name: 'Varicela-Zóster IgG', price: 20.00, category: 'Virus Bacterianas' },
      { code: 'herpes_igg', name: 'Herpes Simplex IgG', price: 20.00, category: 'Virus Bacterianas' },
      { code: 'chlamydia', name: 'Chlamydia Trachomatis', price: 25.00, category: 'Virus Bacterianas' },
      { code: 'gonorrea', name: 'Neisseria Gonorrhoeae', price: 25.00, category: 'Virus Bacterianas' },
      
      // Virus Heces
      { code: 'rotavirus', name: 'Rotavirus', price: 20.00, category: 'Virus Heces' },
      { code: 'norovirus', name: 'Norovirus', price: 20.00, category: 'Virus Heces' },
      { code: 'adenovirus', name: 'Adenovirus', price: 20.00, category: 'Virus Heces' },
      { code: 'enterovirus', name: 'Enterovirus', price: 20.00, category: 'Virus Heces' },
      { code: 'respiratorio', name: 'Panel Respiratorio Viral', price: 25.00, category: 'Virus Heces' },
      
      // Virus Hematológicas
      { code: 'cmv_igg', name: 'CMV IgG', price: 25.00, category: 'Virus Hematológicas' },
      { code: 'ebv', name: 'EBV (Heterófilo)', price: 25.00, category: 'Virus Hematológicas' },
      { code: 'dengue', name: 'Dengue NS1', price: 30.00, category: 'Virus Hematológicas' },
      { code: 'malaria', name: 'Malaria (Gota Gruesa)', price: 20.00, category: 'Virus Hematológicas' },
      { code: 'dengue_igg', name: 'Dengue IgG', price: 30.00, category: 'Virus Hematológicas' },
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
    const testSubset = allTests.slice(0, 15); // Get first 15 tests
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
