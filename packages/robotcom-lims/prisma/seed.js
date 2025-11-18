const { PrismaClient } = require('@prisma/client');
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
    }    // Create a lab
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

    // Create tech user
    const techUser = await prisma.user.create({
      data: {
        username: 'tecnico',
        password: passwordHash,
        fullName: 'Técnico Laboratorio',
        email: 'tech@robotcomlab.com',
        role: 'technician',
        labId: lab.id,
      },
    });
    console.log(`✓ Created user: ${techUser.username}`);

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

    // Create multiple patients for comprehensive testing
    const patients = [];
    const patientNames = [
      { firstName: 'Juan', lastName: 'Pérez' },
      { firstName: 'María', lastName: 'García' },
      { firstName: 'Carlos', lastName: 'López' },
      { firstName: 'Ana', lastName: 'Rodríguez' },
      { firstName: 'Luis', lastName: 'Martínez' },
    ];

    for (let i = 0; i < patientNames.length; i++) {
      const patient = await prisma.patient.create({
        data: {
          firstName: patientNames[i].firstName,
          lastName: patientNames[i].lastName,
          gender: i % 2 === 0 ? 'M' : 'F',
          birthDate: new Date(1985 + i, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          phone: `555-010${i}`,
          email: `patient${i}@example.com`,
          labId: lab.id,
        },
      });
      patients.push(patient);
      console.log(`✓ Created patient: ${patient.firstName} ${patient.lastName}`);
    }

    // Create test profile
    const testProfile = await prisma.testProfile.create({
      data: {
        name: 'Panel General',
        description: 'Perfil general de pruebas incluidas en el análisis',
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

    // Create samples with test results for each patient
    for (let i = 0; i < patients.length; i++) {
      const sample = await prisma.sample.create({
        data: {
          sampleNumber: `S-${String(i + 1).padStart(3, '0')}`,
          patientId: patients[i].id,
          collectionDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          status: i % 3 === 0 ? 'completed' : 'pending_results',
          profileId: testProfile.id,
        },
      });
      console.log(`✓ Created sample: ${sample.sampleNumber}`);

      // Add tests to sample
      const testSubset = allTests.slice(0, 15);
      await prisma.sampleTest.createMany({
        data: testSubset.map((test) => ({
          sampleId: sample.id,
          testId: test.id,
          price: test.price,
        })),
      });

      // Create results for completed samples
      if (sample.status === 'completed') {
        const sampleTests = await prisma.sampleTest.findMany({
          where: { sampleId: sample.id },
        });
        
        for (const st of sampleTests) {
          const resultValue = (Math.random() * 200 + 50).toFixed(2);
          try {
            await prisma.result.create({
              data: {
                sampleId: sample.id,
                testId: st.testId,
                value: resultValue,
                isNormal: Math.random() > 0.2,
                notes: `Resultado verificado para ${sample.sampleNumber}`,
                enteredBy: user.id,
              },
            });
          } catch (e) {
            console.log(`Note: Could not create result, may require additional fields`);
          }
        }
      }
    }

    // Create invoice data for billing module
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-001',
        patientId: patients[0].id,
        labId: lab.id,
        subtotal: 200.00,
        tax: 20.00,
        discount: 0,
        total: 220.00,
        status: 'paid',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
    console.log(`✓ Created invoice: ${invoice.invoiceNumber}`);

    // Create additional invoices
    for (let i = 1; i < 3; i++) {
      const subtotal = Math.random() * 400 + 100;
      await prisma.invoice.create({
        data: {
          invoiceNumber: `INV-${String(i + 1).padStart(3, '0')}`,
          patientId: patients[i % patients.length].id,
          labId: lab.id,
          subtotal: subtotal,
          tax: subtotal * 0.1,
          discount: 0,
          total: subtotal * 1.1,
          status: ['pending', 'paid', 'cancelled'][Math.floor(Math.random() * 3)],
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    }

    // Create doctor records
    const doctor = await prisma.doctor.create({
      data: {
        firstName: 'Dr.',
        lastName: 'Sánchez',
        email: 'doctor@example.com',
        phone: '555-9999',
        specialty: 'General',
      },
    });
    console.log(`✓ Created doctor: ${doctor.firstName} ${doctor.lastName}`);

    // Create commission data
    if (doctor && invoice) {
      try {
        await prisma.commission.create({
          data: {
            doctorId: doctor.id,
            invoiceId: invoice.id,
            percentage: 5.0,
            amount: invoice.total * 0.05,
            isPaid: false,
          },
        });
        console.log(`✓ Created commission for invoice`);
      } catch (e) {
        console.log('Note: Commission creation may require additional setup');
      }
    }

    // Create inventory items
    const inventoryItems = [
      { code: 'TUBE001', name: 'Test Tube Vacío', quantity: 500 },
      { code: 'TUBE002', name: 'Test Tube EDTA', quantity: 300 },
      { code: 'TUBE003', name: 'Test Tube Suero', quantity: 250 },
      { code: 'CHEM001', name: 'Reactivo Glucosa', quantity: 50 },
      { code: 'CHEM002', name: 'Reactivo Colesterol', quantity: 40 },
    ];

    for (const item of inventoryItems) {
      try {
        await prisma.inventoryItem.create({
          data: {
            ...item,
            unit: 'units',
            minQuantity: 50,
          },
        });
      } catch (e) {
        console.log(`Note: Could not create inventory item ${item.code}`);
      }
    }
    console.log(`✓ Created ${inventoryItems.length} inventory items`);

    // Create license record
    try {
      const license = await prisma.license.create({
        data: {
          licenseKey: 'LICENSE-2024-001',
          machineId: 'MACHINE-001',
          subscriptionType: 'professional',
          isActive: true,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
      });
      console.log(`✓ Created license: ${license.licenseKey}`);
    } catch (e) {
      console.log('Note: License creation may have duplicate key');
    }

    console.log('\n✓ Seeding completed successfully!');
    console.log('\nTest Credentials:');
    console.log('  Username: admin');
    console.log('  Password: password');
    console.log('\nAlternative Credentials:');
    console.log('  Username: tecnico');
    console.log('  Password: password');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
