-- Add 5 New Patients with Complete Test Data

-- Patient 1: Juan Carlos Mendez
INSERT INTO Patient (id, firstName, lastName, email, phone, birthDate, gender, address, labId)
VALUES ('patient-201', 'Juan Carlos', 'Mendez', 'juan.mendez@email.com', '555-0101', '1985-03-15', 'M', 'Calle 1 #100', 'lab-001');

-- Patient 2: Maria Elena Rodriguez
INSERT INTO Patient (id, firstName, lastName, email, phone, birthDate, gender, address, labId)
VALUES ('patient-202', 'Maria Elena', 'Rodriguez', 'maria.rodriguez@email.com', '555-0102', '1990-07-22', 'F', 'Calle 2 #200', 'lab-001');

-- Patient 3: Luis Antonio Garcia
INSERT INTO Patient (id, firstName, lastName, email, phone, birthDate, gender, address, labId)
VALUES ('patient-203', 'Luis Antonio', 'Garcia', 'luis.garcia@email.com', '555-0103', '1978-11-08', 'M', 'Calle 3 #300', 'lab-001');

-- Patient 4: Patricia Isabel Morales
INSERT INTO Patient (id, firstName, lastName, email, phone, birthDate, gender, address, labId)
VALUES ('patient-204', 'Patricia Isabel', 'Morales', 'patricia.morales@email.com', '555-0104', '1992-05-30', 'F', 'Calle 4 #400', 'lab-001');

-- Patient 5: Roberto Javier López
INSERT INTO Patient (id, firstName, lastName, email, phone, birthDate, gender, address, labId)
VALUES ('patient-205', 'Roberto Javier', 'López', 'roberto.lopez@email.com', '555-0105', '1988-09-14', 'M', 'Calle 5 #500', 'lab-001');

-- Create samples for each patient with unique sample numbers
INSERT INTO Sample (id, sampleNumber, patientId, collectionDate, status, notes)
VALUES 
  ('sample-201', 'SAM-201-001', 'patient-201', datetime('now'), 'Completed', 'Todas las pruebas completadas'),
  ('sample-202', 'SAM-202-001', 'patient-202', datetime('now'), 'Completed', 'Todas las pruebas completadas'),
  ('sample-203', 'SAM-203-001', 'patient-203', datetime('now'), 'Completed', 'Todas las pruebas completadas'),
  ('sample-204', 'SAM-204-001', 'patient-204', datetime('now'), 'Completed', 'Todas las pruebas completadas'),
  ('sample-205', 'SAM-205-001', 'patient-205', datetime('now'), 'Completed', 'Todas las pruebas completadas');

-- Patient 1 - Juan Carlos Mendez - Results for all 24 tests
INSERT INTO Result (id, sampleId, testId, value, isNormal, notes, enteredAt)
SELECT 
  'result-201-' || ROW_NUMBER() OVER (ORDER BY Test.id),
  'sample-201',
  Test.id,
  CASE 
    WHEN Test.name LIKE '%Tipo%' THEN 'O+'
    WHEN Test.name LIKE '%Hemoglobina%' THEN '14.5'
    WHEN Test.name LIKE '%Hematocrito%' THEN '43.5'
    WHEN Test.name LIKE '%Glucosa%' THEN '95'
    WHEN Test.name LIKE '%Colesterol%' THEN '200'
    WHEN Test.name LIKE '%Triglicéridos%' THEN '150'
    WHEN Test.name LIKE '%Bilirrubina%' THEN '0.8'
    WHEN Test.name LIKE '%Proteína%' THEN '7.0'
    WHEN Test.name LIKE '%Creatinina%' THEN '0.9'
    WHEN Test.name LIKE '%Urea%' THEN '35'
    WHEN Test.name LIKE '%Ácido%' THEN '6.5'
    WHEN Test.name LIKE '%TSH%' THEN '2.5'
    WHEN Test.name LIKE '%T4%' THEN '8.0'
    WHEN Test.name LIKE '%Testosterona%' THEN '650'
    WHEN Test.name LIKE '%Orina%' THEN 'Negativo'
    WHEN Test.name LIKE '%Heces%' THEN 'Normal'
    WHEN Test.name LIKE '%Coagulación%' THEN '12'
    WHEN Test.name LIKE '%Embarazo%' THEN 'Negativo'
    WHEN Test.name LIKE '%Recuento%' THEN '5.5'
    WHEN Test.name LIKE '%Plaquetas%' THEN '250'
    WHEN Test.name LIKE '%Inmunoglobulina%' THEN '9.5'
    WHEN Test.name LIKE '%Cultivo%' THEN 'Negativo'
    ELSE '0'
  END,
  1,
  'Resultados normales para paciente sano',
  datetime('now')
FROM Test
ORDER BY Test.id;

-- Patient 2 - Maria Elena Rodriguez - Results for all 24 tests
INSERT INTO Result (id, sampleId, testId, value, isNormal, notes, enteredAt)
SELECT 
  'result-202-' || ROW_NUMBER() OVER (ORDER BY Test.id),
  'sample-202',
  Test.id,
  CASE 
    WHEN Test.name LIKE '%Tipo%' THEN 'A-'
    WHEN Test.name LIKE '%Hemoglobina%' THEN '13.2'
    WHEN Test.name LIKE '%Hematocrito%' THEN '39.5'
    WHEN Test.name LIKE '%Glucosa%' THEN '125'
    WHEN Test.name LIKE '%Colesterol%' THEN '220'
    WHEN Test.name LIKE '%Triglicéridos%' THEN '175'
    WHEN Test.name LIKE '%Bilirrubina%' THEN '0.9'
    WHEN Test.name LIKE '%Proteína%' THEN '6.8'
    WHEN Test.name LIKE '%Creatinina%' THEN '0.85'
    WHEN Test.name LIKE '%Urea%' THEN '38'
    WHEN Test.name LIKE '%Ácido%' THEN '7.2'
    WHEN Test.name LIKE '%TSH%' THEN '3.2'
    WHEN Test.name LIKE '%T4%' THEN '7.5'
    WHEN Test.name LIKE '%Estrógeno%' THEN '45'
    WHEN Test.name LIKE '%Orina%' THEN 'Positivo Glucosa'
    WHEN Test.name LIKE '%Heces%' THEN 'Normal'
    WHEN Test.name LIKE '%Coagulación%' THEN '13'
    WHEN Test.name LIKE '%Embarazo%' THEN 'Negativo'
    WHEN Test.name LIKE '%Recuento%' THEN '5.2'
    WHEN Test.name LIKE '%Plaquetas%' THEN '240'
    WHEN Test.name LIKE '%Inmunoglobulina%' THEN '8.8'
    WHEN Test.name LIKE '%Cultivo%' THEN 'Negativo'
    ELSE '0'
  END,
  1,
  'Glucosa elevada, paciente diabética',
  datetime('now')
FROM Test
ORDER BY Test.id;

-- Patient 3 - Luis Antonio Garcia - Results for all 24 tests
INSERT INTO Result (id, sampleId, testId, value, isNormal, notes, enteredAt)
SELECT 
  'result-203-' || ROW_NUMBER() OVER (ORDER BY Test.id),
  'sample-203',
  Test.id,
  CASE 
    WHEN Test.name LIKE '%Tipo%' THEN 'B+'
    WHEN Test.name LIKE '%Hemoglobina%' THEN '15.0'
    WHEN Test.name LIKE '%Hematocrito%' THEN '45.0'
    WHEN Test.name LIKE '%Glucosa%' THEN '100'
    WHEN Test.name LIKE '%Colesterol%' THEN '190'
    WHEN Test.name LIKE '%Triglicéridos%' THEN '130'
    WHEN Test.name LIKE '%Bilirrubina%' THEN '0.7'
    WHEN Test.name LIKE '%Proteína%' THEN '7.2'
    WHEN Test.name LIKE '%Creatinina%' THEN '1.0'
    WHEN Test.name LIKE '%Urea%' THEN '32'
    WHEN Test.name LIKE '%Ácido%' THEN '6.0'
    WHEN Test.name LIKE '%TSH%' THEN '2.0'
    WHEN Test.name LIKE '%T4%' THEN '8.5'
    WHEN Test.name LIKE '%Testosterona%' THEN '700'
    WHEN Test.name LIKE '%Orina%' THEN 'Negativo'
    WHEN Test.name LIKE '%Heces%' THEN 'Normal'
    WHEN Test.name LIKE '%Coagulación%' THEN '11'
    WHEN Test.name LIKE '%Embarazo%' THEN 'Negativo'
    WHEN Test.name LIKE '%Recuento%' THEN '5.8'
    WHEN Test.name LIKE '%Plaquetas%' THEN '260'
    WHEN Test.name LIKE '%Inmunoglobulina%' THEN '10.2'
    WHEN Test.name LIKE '%Cultivo%' THEN 'Negativo'
    ELSE '0'
  END,
  1,
  'Resultados normales',
  datetime('now')
FROM Test
ORDER BY Test.id;

-- Patient 4 - Patricia Isabel Morales - Results for all 24 tests
INSERT INTO Result (id, sampleId, testId, value, isNormal, notes, enteredAt)
SELECT 
  'result-204-' || ROW_NUMBER() OVER (ORDER BY Test.id),
  'sample-204',
  Test.id,
  CASE 
    WHEN Test.name LIKE '%Tipo%' THEN 'AB+'
    WHEN Test.name LIKE '%Hemoglobina%' THEN '13.8'
    WHEN Test.name LIKE '%Hematocrito%' THEN '41.0'
    WHEN Test.name LIKE '%Glucosa%' THEN '92'
    WHEN Test.name LIKE '%Colesterol%' THEN '185'
    WHEN Test.name LIKE '%Triglicéridos%' THEN '120'
    WHEN Test.name LIKE '%Bilirrubina%' THEN '0.6'
    WHEN Test.name LIKE '%Proteína%' THEN '7.1'
    WHEN Test.name LIKE '%Creatinina%' THEN '0.82'
    WHEN Test.name LIKE '%Urea%' THEN '30'
    WHEN Test.name LIKE '%Ácido%' THEN '5.8'
    WHEN Test.name LIKE '%TSH%' THEN '2.2'
    WHEN Test.name LIKE '%T4%' THEN '8.2'
    WHEN Test.name LIKE '%Estrógeno%' THEN '52'
    WHEN Test.name LIKE '%Orina%' THEN 'Negativo'
    WHEN Test.name LIKE '%Heces%' THEN 'Normal'
    WHEN Test.name LIKE '%Coagulación%' THEN '12'
    WHEN Test.name LIKE '%Embarazo%' THEN 'Negativo'
    WHEN Test.name LIKE '%Recuento%' THEN '5.5'
    WHEN Test.name LIKE '%Plaquetas%' THEN '245'
    WHEN Test.name LIKE '%Inmunoglobulina%' THEN '9.8'
    WHEN Test.name LIKE '%Cultivo%' THEN 'Negativo'
    ELSE '0'
  END,
  1,
  'Todos los parámetros normales',
  datetime('now')
FROM Test
ORDER BY Test.id;

-- Patient 5 - Roberto Javier López - Results for all 24 tests
INSERT INTO Result (id, sampleId, testId, value, isNormal, notes, enteredAt)
SELECT 
  'result-205-' || ROW_NUMBER() OVER (ORDER BY Test.id),
  'sample-205',
  Test.id,
  CASE 
    WHEN Test.name LIKE '%Tipo%' THEN 'O-'
    WHEN Test.name LIKE '%Hemoglobina%' THEN '14.8'
    WHEN Test.name LIKE '%Hematocrito%' THEN '44.5'
    WHEN Test.name LIKE '%Glucosa%' THEN '110'
    WHEN Test.name LIKE '%Colesterol%' THEN '230'
    WHEN Test.name LIKE '%Triglicéridos%' THEN '160'
    WHEN Test.name LIKE '%Bilirrubina%' THEN '0.85'
    WHEN Test.name LIKE '%Proteína%' THEN '7.3'
    WHEN Test.name LIKE '%Creatinina%' THEN '0.95'
    WHEN Test.name LIKE '%Urea%' THEN '36'
    WHEN Test.name LIKE '%Ácido%' THEN '6.8'
    WHEN Test.name LIKE '%TSH%' THEN '2.8'
    WHEN Test.name LIKE '%T4%' THEN '8.3'
    WHEN Test.name LIKE '%Testosterona%' THEN '680'
    WHEN Test.name LIKE '%Orina%' THEN 'Negativo'
    WHEN Test.name LIKE '%Heces%' THEN 'Normal'
    WHEN Test.name LIKE '%Coagulación%' THEN '12'
    WHEN Test.name LIKE '%Embarazo%' THEN 'Negativo'
    WHEN Test.name LIKE '%Recuento%' THEN '5.4'
    WHEN Test.name LIKE '%Plaquetas%' THEN '255'
    WHEN Test.name LIKE '%Inmunoglobulina%' THEN '9.5'
    WHEN Test.name LIKE '%Cultivo%' THEN 'Negativo'
    ELSE '0'
  END,
  1,
  'Colesterol elevado, requiere control',
  datetime('now')
FROM Test
ORDER BY Test.id;
