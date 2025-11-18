-- Add 5 Complete Test Patients with All Tests Done
-- This adds 5 new patients with samples containing ALL 24 tests and results

-- Create 5 new patients
INSERT INTO "Patient" ("id", "firstName", "lastName", "gender", "birthDate", "phone", "email", "labId", "createdAt") VALUES
('pat-test-001', 'Roberto', 'Fernández', 'M', '1980-02-14', '555-2001', 'roberto@example.com', 'lab-001', datetime('now')),
('pat-test-002', 'Sofia', 'Moreno', 'F', '1993-06-25', '555-2002', 'sofia@example.com', 'lab-001', datetime('now')),
('pat-test-003', 'Miguel', 'Díaz', 'M', '1986-09-10', '555-2003', 'miguel@example.com', 'lab-001', datetime('now')),
('pat-test-004', 'Carmen', 'Jiménez', 'F', '1995-01-18', '555-2004', 'carmen@example.com', 'lab-001', datetime('now')),
('pat-test-005', 'Fernando', 'Castro', 'M', '1982-12-03', '555-2005', 'fernando@example.com', 'lab-001', datetime('now'));

-- Create samples for each patient (all completed)
INSERT INTO "Sample" ("id", "sampleNumber", "patientId", "profileId", "collectionDate", "status", "createdAt") VALUES
('smp-test-001', 'S-101', 'pat-test-001', 'prof-001', datetime('now', '-10 days'), 'completed', datetime('now')),
('smp-test-002', 'S-102', 'pat-test-002', 'prof-001', datetime('now', '-8 days'), 'completed', datetime('now')),
('smp-test-003', 'S-103', 'pat-test-003', 'prof-001', datetime('now', '-6 days'), 'completed', datetime('now')),
('smp-test-004', 'S-104', 'pat-test-004', 'prof-001', datetime('now', '-4 days'), 'completed', datetime('now')),
('smp-test-005', 'S-105', 'pat-test-005', 'prof-001', datetime('now', '-2 days'), 'completed', datetime('now'));

-- Add ALL 24 tests to first patient (Roberto Fernández)
INSERT INTO "SampleTest" ("id", "sampleId", "testId", "price") VALUES
-- Tipificación Sanguínea (2 tests)
('st-test-001', 'smp-test-001', 'test-001', 10.00),
('st-test-002', 'smp-test-001', 'test-002', 10.00),
-- Coagulación (2 tests)
('st-test-003', 'smp-test-001', 'test-003', 15.00),
('st-test-004', 'smp-test-001', 'test-004', 15.00),
-- ELISA (2 tests)
('st-test-005', 'smp-test-001', 'test-005', 30.00),
('st-test-006', 'smp-test-001', 'test-006', 25.00),
-- Inmunología (2 tests)
('st-test-007', 'smp-test-001', 'test-007', 18.00),
('st-test-008', 'smp-test-001', 'test-008', 18.00),
-- Hormonas (2 tests)
('st-test-009', 'smp-test-001', 'test-009', 20.00),
('st-test-010', 'smp-test-001', 'test-010', 20.00),
-- Análisis de Orina (2 tests)
('st-test-011', 'smp-test-001', 'test-011', 8.00),
('st-test-012', 'smp-test-001', 'test-012', 8.00),
-- Análisis de Heces (2 tests)
('st-test-013', 'smp-test-001', 'test-013', 12.00),
('st-test-014', 'smp-test-001', 'test-014', 10.00),
-- Química Clínica (2 tests)
('st-test-015', 'smp-test-001', 'test-015', 5.00),
('st-test-016', 'smp-test-001', 'test-016', 7.00),
-- Pruebas de Embarazo (2 tests)
('st-test-017', 'smp-test-001', 'test-017', 15.00),
('st-test-018', 'smp-test-001', 'test-018', 10.00),
-- Hematología (2 tests)
('st-test-019', 'smp-test-001', 'test-019', 10.00),
('st-test-020', 'smp-test-001', 'test-020', 10.00),
-- Bacteriología (2 tests)
('st-test-021', 'smp-test-001', 'test-021', 30.00),
('st-test-022', 'smp-test-001', 'test-022', 25.00),
-- Espermiograma (2 tests)
('st-test-023', 'smp-test-001', 'test-023', 35.00),
('st-test-024', 'smp-test-001', 'test-024', 35.00);

-- Add ALL 24 tests to second patient (Sofia Moreno)
INSERT INTO "SampleTest" ("id", "sampleId", "testId", "price") VALUES
('st-test-025', 'smp-test-002', 'test-001', 10.00),
('st-test-026', 'smp-test-002', 'test-002', 10.00),
('st-test-027', 'smp-test-002', 'test-003', 15.00),
('st-test-028', 'smp-test-002', 'test-004', 15.00),
('st-test-029', 'smp-test-002', 'test-005', 30.00),
('st-test-030', 'smp-test-002', 'test-006', 25.00),
('st-test-031', 'smp-test-002', 'test-007', 18.00),
('st-test-032', 'smp-test-002', 'test-008', 18.00),
('st-test-033', 'smp-test-002', 'test-009', 20.00),
('st-test-034', 'smp-test-002', 'test-010', 20.00),
('st-test-035', 'smp-test-002', 'test-011', 8.00),
('st-test-036', 'smp-test-002', 'test-012', 8.00),
('st-test-037', 'smp-test-002', 'test-013', 12.00),
('st-test-038', 'smp-test-002', 'test-014', 10.00),
('st-test-039', 'smp-test-002', 'test-015', 5.00),
('st-test-040', 'smp-test-002', 'test-016', 7.00),
('st-test-041', 'smp-test-002', 'test-017', 15.00),
('st-test-042', 'smp-test-002', 'test-018', 10.00),
('st-test-043', 'smp-test-002', 'test-019', 10.00),
('st-test-044', 'smp-test-002', 'test-020', 10.00),
('st-test-045', 'smp-test-002', 'test-021', 30.00),
('st-test-046', 'smp-test-002', 'test-022', 25.00),
('st-test-047', 'smp-test-002', 'test-023', 35.00),
('st-test-048', 'smp-test-002', 'test-024', 35.00);

-- Add ALL 24 tests to third patient (Miguel Díaz)
INSERT INTO "SampleTest" ("id", "sampleId", "testId", "price") VALUES
('st-test-049', 'smp-test-003', 'test-001', 10.00),
('st-test-050', 'smp-test-003', 'test-002', 10.00),
('st-test-051', 'smp-test-003', 'test-003', 15.00),
('st-test-052', 'smp-test-003', 'test-004', 15.00),
('st-test-053', 'smp-test-003', 'test-005', 30.00),
('st-test-054', 'smp-test-003', 'test-006', 25.00),
('st-test-055', 'smp-test-003', 'test-007', 18.00),
('st-test-056', 'smp-test-003', 'test-008', 18.00),
('st-test-057', 'smp-test-003', 'test-009', 20.00),
('st-test-058', 'smp-test-003', 'test-010', 20.00),
('st-test-059', 'smp-test-003', 'test-011', 8.00),
('st-test-060', 'smp-test-003', 'test-012', 8.00),
('st-test-061', 'smp-test-003', 'test-013', 12.00),
('st-test-062', 'smp-test-003', 'test-014', 10.00),
('st-test-063', 'smp-test-003', 'test-015', 5.00),
('st-test-064', 'smp-test-003', 'test-016', 7.00),
('st-test-065', 'smp-test-003', 'test-017', 15.00),
('st-test-066', 'smp-test-003', 'test-018', 10.00),
('st-test-067', 'smp-test-003', 'test-019', 10.00),
('st-test-068', 'smp-test-003', 'test-020', 10.00),
('st-test-069', 'smp-test-003', 'test-021', 30.00),
('st-test-070', 'smp-test-003', 'test-022', 25.00),
('st-test-071', 'smp-test-003', 'test-023', 35.00),
('st-test-072', 'smp-test-003', 'test-024', 35.00);

-- Add ALL 24 tests to fourth patient (Carmen Jiménez)
INSERT INTO "SampleTest" ("id", "sampleId", "testId", "price") VALUES
('st-test-073', 'smp-test-004', 'test-001', 10.00),
('st-test-074', 'smp-test-004', 'test-002', 10.00),
('st-test-075', 'smp-test-004', 'test-003', 15.00),
('st-test-076', 'smp-test-004', 'test-004', 15.00),
('st-test-077', 'smp-test-004', 'test-005', 30.00),
('st-test-078', 'smp-test-004', 'test-006', 25.00),
('st-test-079', 'smp-test-004', 'test-007', 18.00),
('st-test-080', 'smp-test-004', 'test-008', 18.00),
('st-test-081', 'smp-test-004', 'test-009', 20.00),
('st-test-082', 'smp-test-004', 'test-010', 20.00),
('st-test-083', 'smp-test-004', 'test-011', 8.00),
('st-test-084', 'smp-test-004', 'test-012', 8.00),
('st-test-085', 'smp-test-004', 'test-013', 12.00),
('st-test-086', 'smp-test-004', 'test-014', 10.00),
('st-test-087', 'smp-test-004', 'test-015', 5.00),
('st-test-088', 'smp-test-004', 'test-016', 7.00),
('st-test-089', 'smp-test-004', 'test-017', 15.00),
('st-test-090', 'smp-test-004', 'test-018', 10.00),
('st-test-091', 'smp-test-004', 'test-019', 10.00),
('st-test-092', 'smp-test-004', 'test-020', 10.00),
('st-test-093', 'smp-test-004', 'test-021', 30.00),
('st-test-094', 'smp-test-004', 'test-022', 25.00),
('st-test-095', 'smp-test-004', 'test-023', 35.00),
('st-test-096', 'smp-test-004', 'test-024', 35.00);

-- Add ALL 24 tests to fifth patient (Fernando Castro)
INSERT INTO "SampleTest" ("id", "sampleId", "testId", "price") VALUES
('st-test-097', 'smp-test-005', 'test-001', 10.00),
('st-test-098', 'smp-test-005', 'test-002', 10.00),
('st-test-099', 'smp-test-005', 'test-003', 15.00),
('st-test-100', 'smp-test-005', 'test-004', 15.00),
('st-test-101', 'smp-test-005', 'test-005', 30.00),
('st-test-102', 'smp-test-005', 'test-006', 25.00),
('st-test-103', 'smp-test-005', 'test-007', 18.00),
('st-test-104', 'smp-test-005', 'test-008', 18.00),
('st-test-105', 'smp-test-005', 'test-009', 20.00),
('st-test-106', 'smp-test-005', 'test-010', 20.00),
('st-test-107', 'smp-test-005', 'test-011', 8.00),
('st-test-108', 'smp-test-005', 'test-012', 8.00),
('st-test-109', 'smp-test-005', 'test-013', 12.00),
('st-test-110', 'smp-test-005', 'test-014', 10.00),
('st-test-111', 'smp-test-005', 'test-015', 5.00),
('st-test-112', 'smp-test-005', 'test-016', 7.00),
('st-test-113', 'smp-test-005', 'test-017', 15.00),
('st-test-114', 'smp-test-005', 'test-018', 10.00),
('st-test-115', 'smp-test-005', 'test-019', 10.00),
('st-test-116', 'smp-test-005', 'test-020', 10.00),
('st-test-117', 'smp-test-005', 'test-021', 30.00),
('st-test-118', 'smp-test-005', 'test-022', 25.00),
('st-test-119', 'smp-test-005', 'test-023', 35.00),
('st-test-120', 'smp-test-005', 'test-024', 35.00);

-- Create Results for ALL tests in all samples
-- Roberto Fernández (pat-test-001) - All 24 test results
INSERT INTO "Result" ("id", "sampleId", "testId", "value", "isNormal", "notes", "enteredBy", "enteredAt", "createdAt") VALUES
('res-test-001', 'smp-test-001', 'test-001', 'O+', true, 'Tipificación normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-002', 'smp-test-001', 'test-002', 'Positivo', true, 'Factor Rh positivo', 'user-admin', datetime('now'), datetime('now')),
('res-test-003', 'smp-test-001', 'test-003', '12.5 seg', true, 'TP normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-004', 'smp-test-001', 'test-004', '0.95', true, 'INR normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-005', 'smp-test-001', 'test-005', 'Negativo', true, 'VIH 1/2 negativo', 'user-admin', datetime('now'), datetime('now')),
('res-test-006', 'smp-test-001', 'test-006', 'Negativo', true, 'Hepatitis B negativa', 'user-admin', datetime('now'), datetime('now')),
('res-test-007', 'smp-test-001', 'test-007', '8.2 g/L', true, 'IgG normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-008', 'smp-test-001', 'test-008', '0.5 g/L', true, 'IgM normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-009', 'smp-test-001', 'test-009', '2.1 mIU/L', true, 'TSH normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-010', 'smp-test-001', 'test-010', '1.2 ng/dL', true, 'T4 libre normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-011', 'smp-test-001', 'test-011', '1.020', true, 'Densidad normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-012', 'smp-test-001', 'test-012', 'Negativo', true, 'Sin proteinuria', 'user-admin', datetime('now'), datetime('now')),
('res-test-013', 'smp-test-001', 'test-013', 'No visto', true, 'Sin parásitos', 'user-admin', datetime('now'), datetime('now')),
('res-test-014', 'smp-test-001', 'test-014', 'Negativo', true, 'Sin sangre oculta', 'user-admin', datetime('now'), datetime('now')),
('res-test-015', 'smp-test-001', 'test-015', '95 mg/dL', true, 'Glucosa normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-016', 'smp-test-001', 'test-016', '140 mEq/L', true, 'Sodio normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-017', 'smp-test-001', 'test-017', '<5 mIU/mL', true, 'hCG sangre negativa', 'user-admin', datetime('now'), datetime('now')),
('res-test-018', 'smp-test-001', 'test-018', 'Negativo', true, 'hCG orina negativa', 'user-admin', datetime('now'), datetime('now')),
('res-test-019', 'smp-test-001', 'test-019', '4.8 M/μL', true, 'RBC normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-020', 'smp-test-001', 'test-020', '7.2 K/μL', true, 'WBC normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-021', 'smp-test-001', 'test-021', 'Sin crecimiento', true, 'Cultivo sangre negativo', 'user-admin', datetime('now'), datetime('now')),
('res-test-022', 'smp-test-001', 'test-022', 'Sin crecimiento', true, 'Cultivo orina negativo', 'user-admin', datetime('now'), datetime('now')),
('res-test-023', 'smp-test-001', 'test-023', '65 M/mL', true, 'Concentración normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-024', 'smp-test-001', 'test-024', '70% motil', true, 'Movilidad normal', 'user-admin', datetime('now'), datetime('now')),

-- Sofia Moreno (pat-test-002) - All 24 test results
('res-test-025', 'smp-test-002', 'test-001', 'A-', true, 'Tipificación normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-026', 'smp-test-002', 'test-002', 'Negativo', true, 'Factor Rh negativo', 'user-admin', datetime('now'), datetime('now')),
('res-test-027', 'smp-test-002', 'test-003', '11.8 seg', true, 'TP normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-028', 'smp-test-002', 'test-004', '1.05', true, 'INR normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-029', 'smp-test-002', 'test-005', 'Negativo', true, 'VIH 1/2 negativo', 'user-admin', datetime('now'), datetime('now')),
('res-test-030', 'smp-test-002', 'test-006', 'Negativo', true, 'Hepatitis B negativa', 'user-admin', datetime('now'), datetime('now')),
('res-test-031', 'smp-test-002', 'test-007', '7.9 g/L', true, 'IgG normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-032', 'smp-test-002', 'test-008', '0.6 g/L', true, 'IgM normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-033', 'smp-test-002', 'test-009', '1.8 mIU/L', true, 'TSH normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-034', 'smp-test-002', 'test-010', '1.1 ng/dL', true, 'T4 libre normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-035', 'smp-test-002', 'test-011', '1.018', true, 'Densidad normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-036', 'smp-test-002', 'test-012', 'Negativo', true, 'Sin proteinuria', 'user-admin', datetime('now'), datetime('now')),
('res-test-037', 'smp-test-002', 'test-013', 'No visto', true, 'Sin parásitos', 'user-admin', datetime('now'), datetime('now')),
('res-test-038', 'smp-test-002', 'test-014', 'Negativo', true, 'Sin sangre oculta', 'user-admin', datetime('now'), datetime('now')),
('res-test-039', 'smp-test-002', 'test-015', '88 mg/dL', true, 'Glucosa normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-040', 'smp-test-002', 'test-016', '138 mEq/L', true, 'Sodio normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-041', 'smp-test-002', 'test-017', '<5 mIU/mL', true, 'hCG sangre negativa', 'user-admin', datetime('now'), datetime('now')),
('res-test-042', 'smp-test-002', 'test-018', 'Negativo', true, 'hCG orina negativa', 'user-admin', datetime('now'), datetime('now')),
('res-test-043', 'smp-test-002', 'test-019', '4.5 M/μL', true, 'RBC normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-044', 'smp-test-002', 'test-020', '6.8 K/μL', true, 'WBC normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-045', 'smp-test-002', 'test-021', 'Sin crecimiento', true, 'Cultivo sangre negativo', 'user-admin', datetime('now'), datetime('now')),
('res-test-046', 'smp-test-002', 'test-022', 'Sin crecimiento', true, 'Cultivo orina negativo', 'user-admin', datetime('now'), datetime('now')),
('res-test-047', 'smp-test-002', 'test-023', '58 M/mL', true, 'Concentración normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-048', 'smp-test-002', 'test-024', '72% motil', true, 'Movilidad normal', 'user-admin', datetime('now'), datetime('now')),

-- Miguel Díaz (pat-test-003) - All 24 test results
('res-test-049', 'smp-test-003', 'test-001', 'B+', true, 'Tipificación normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-050', 'smp-test-003', 'test-002', 'Positivo', true, 'Factor Rh positivo', 'user-admin', datetime('now'), datetime('now')),
('res-test-051', 'smp-test-003', 'test-003', '13.2 seg', true, 'TP normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-052', 'smp-test-003', 'test-004', '0.92', true, 'INR normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-053', 'smp-test-003', 'test-005', 'Negativo', true, 'VIH 1/2 negativo', 'user-admin', datetime('now'), datetime('now')),
('res-test-054', 'smp-test-003', 'test-006', 'Negativo', true, 'Hepatitis B negativa', 'user-admin', datetime('now'), datetime('now')),
('res-test-055', 'smp-test-003', 'test-007', '8.5 g/L', true, 'IgG normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-056', 'smp-test-003', 'test-008', '0.4 g/L', true, 'IgM normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-057', 'smp-test-003', 'test-009', '2.3 mIU/L', true, 'TSH normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-058', 'smp-test-003', 'test-010', '1.3 ng/dL', true, 'T4 libre normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-059', 'smp-test-003', 'test-011', '1.021', true, 'Densidad normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-060', 'smp-test-003', 'test-012', 'Negativo', true, 'Sin proteinuria', 'user-admin', datetime('now'), datetime('now')),
('res-test-061', 'smp-test-003', 'test-013', 'No visto', true, 'Sin parásitos', 'user-admin', datetime('now'), datetime('now')),
('res-test-062', 'smp-test-003', 'test-014', 'Negativo', true, 'Sin sangre oculta', 'user-admin', datetime('now'), datetime('now')),
('res-test-063', 'smp-test-003', 'test-015', '92 mg/dL', true, 'Glucosa normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-064', 'smp-test-003', 'test-016', '142 mEq/L', true, 'Sodio normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-065', 'smp-test-003', 'test-017', '<5 mIU/mL', true, 'hCG sangre negativa', 'user-admin', datetime('now'), datetime('now')),
('res-test-066', 'smp-test-003', 'test-018', 'Negativo', true, 'hCG orina negativa', 'user-admin', datetime('now'), datetime('now')),
('res-test-067', 'smp-test-003', 'test-019', '5.1 M/μL', true, 'RBC normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-068', 'smp-test-003', 'test-020', '7.5 K/μL', true, 'WBC normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-069', 'smp-test-003', 'test-021', 'Sin crecimiento', true, 'Cultivo sangre negativo', 'user-admin', datetime('now'), datetime('now')),
('res-test-070', 'smp-test-003', 'test-022', 'Sin crecimiento', true, 'Cultivo orina negativo', 'user-admin', datetime('now'), datetime('now')),
('res-test-071', 'smp-test-003', 'test-023', '72 M/mL', true, 'Concentración normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-072', 'smp-test-003', 'test-024', '68% motil', true, 'Movilidad normal', 'user-admin', datetime('now'), datetime('now')),

-- Carmen Jiménez (pat-test-004) - All 24 test results
('res-test-073', 'smp-test-004', 'test-001', 'AB+', true, 'Tipificación normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-074', 'smp-test-004', 'test-002', 'Positivo', true, 'Factor Rh positivo', 'user-admin', datetime('now'), datetime('now')),
('res-test-075', 'smp-test-004', 'test-003', '12.0 seg', true, 'TP normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-076', 'smp-test-004', 'test-004', '1.02', true, 'INR normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-077', 'smp-test-004', 'test-005', 'Negativo', true, 'VIH 1/2 negativo', 'user-admin', datetime('now'), datetime('now')),
('res-test-078', 'smp-test-004', 'test-006', 'Negativo', true, 'Hepatitis B negativa', 'user-admin', datetime('now'), datetime('now')),
('res-test-079', 'smp-test-004', 'test-007', '8.0 g/L', true, 'IgG normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-080', 'smp-test-004', 'test-008', '0.55 g/L', true, 'IgM normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-081', 'smp-test-004', 'test-009', '1.9 mIU/L', true, 'TSH normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-082', 'smp-test-004', 'test-010', '1.25 ng/dL', true, 'T4 libre normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-083', 'smp-test-004', 'test-011', '1.019', true, 'Densidad normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-084', 'smp-test-004', 'test-012', 'Negativo', true, 'Sin proteinuria', 'user-admin', datetime('now'), datetime('now')),
('res-test-085', 'smp-test-004', 'test-013', 'No visto', true, 'Sin parásitos', 'user-admin', datetime('now'), datetime('now')),
('res-test-086', 'smp-test-004', 'test-014', 'Negativo', true, 'Sin sangre oculta', 'user-admin', datetime('now'), datetime('now')),
('res-test-087', 'smp-test-004', 'test-015', '100 mg/dL', true, 'Glucosa normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-088', 'smp-test-004', 'test-016', '139 mEq/L', true, 'Sodio normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-089', 'smp-test-004', 'test-017', '<5 mIU/mL', true, 'hCG sangre negativa', 'user-admin', datetime('now'), datetime('now')),
('res-test-090', 'smp-test-004', 'test-018', 'Negativo', true, 'hCG orina negativa', 'user-admin', datetime('now'), datetime('now')),
('res-test-091', 'smp-test-004', 'test-019', '4.6 M/μL', true, 'RBC normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-092', 'smp-test-004', 'test-020', '7.0 K/μL', true, 'WBC normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-093', 'smp-test-004', 'test-021', 'Sin crecimiento', true, 'Cultivo sangre negativo', 'user-admin', datetime('now'), datetime('now')),
('res-test-094', 'smp-test-004', 'test-022', 'Sin crecimiento', true, 'Cultivo orina negativo', 'user-admin', datetime('now'), datetime('now')),
('res-test-095', 'smp-test-004', 'test-023', '61 M/mL', true, 'Concentración normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-096', 'smp-test-004', 'test-024', '71% motil', true, 'Movilidad normal', 'user-admin', datetime('now'), datetime('now')),

-- Fernando Castro (pat-test-005) - All 24 test results
('res-test-097', 'smp-test-005', 'test-001', 'O-', true, 'Tipificación normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-098', 'smp-test-005', 'test-002', 'Negativo', true, 'Factor Rh negativo', 'user-admin', datetime('now'), datetime('now')),
('res-test-099', 'smp-test-005', 'test-003', '12.8 seg', true, 'TP normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-100', 'smp-test-005', 'test-004', '0.98', true, 'INR normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-101', 'smp-test-005', 'test-005', 'Negativo', true, 'VIH 1/2 negativo', 'user-admin', datetime('now'), datetime('now')),
('res-test-102', 'smp-test-005', 'test-006', 'Negativo', true, 'Hepatitis B negativa', 'user-admin', datetime('now'), datetime('now')),
('res-test-103', 'smp-test-005', 'test-007', '8.3 g/L', true, 'IgG normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-104', 'smp-test-005', 'test-008', '0.45 g/L', true, 'IgM normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-105', 'smp-test-005', 'test-009', '2.2 mIU/L', true, 'TSH normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-106', 'smp-test-005', 'test-010', '1.15 ng/dL', true, 'T4 libre normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-107', 'smp-test-005', 'test-011', '1.022', true, 'Densidad normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-108', 'smp-test-005', 'test-012', 'Negativo', true, 'Sin proteinuria', 'user-admin', datetime('now'), datetime('now')),
('res-test-109', 'smp-test-005', 'test-013', 'No visto', true, 'Sin parásitos', 'user-admin', datetime('now'), datetime('now')),
('res-test-110', 'smp-test-005', 'test-014', 'Negativo', true, 'Sin sangre oculta', 'user-admin', datetime('now'), datetime('now')),
('res-test-111', 'smp-test-005', 'test-015', '98 mg/dL', true, 'Glucosa normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-112', 'smp-test-005', 'test-016', '141 mEq/L', true, 'Sodio normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-113', 'smp-test-005', 'test-017', '<5 mIU/mL', true, 'hCG sangre negativa', 'user-admin', datetime('now'), datetime('now')),
('res-test-114', 'smp-test-005', 'test-018', 'Negativo', true, 'hCG orina negativa', 'user-admin', datetime('now'), datetime('now')),
('res-test-115', 'smp-test-005', 'test-019', '5.0 M/μL', true, 'RBC normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-116', 'smp-test-005', 'test-020', '7.3 K/μL', true, 'WBC normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-117', 'smp-test-005', 'test-021', 'Sin crecimiento', true, 'Cultivo sangre negativo', 'user-admin', datetime('now'), datetime('now')),
('res-test-118', 'smp-test-005', 'test-022', 'Sin crecimiento', true, 'Cultivo orina negativo', 'user-admin', datetime('now'), datetime('now')),
('res-test-119', 'smp-test-005', 'test-023', '69 M/mL', true, 'Concentración normal', 'user-admin', datetime('now'), datetime('now')),
('res-test-120', 'smp-test-005', 'test-024', '73% motil', true, 'Movilidad normal', 'user-admin', datetime('now'), datetime('now'));

-- Create Invoices for the new patients
INSERT INTO "Invoice" ("id", "invoiceNumber", "patientId", "labId", "subtotal", "tax", "discount", "total", "status", "dueDate", "createdAt") VALUES
('inv-test-001', 'INV-101', 'pat-test-001', 'lab-001', 480.00, 48.00, 0, 528.00, 'paid', datetime('now', '+30 days'), datetime('now')),
('inv-test-002', 'INV-102', 'pat-test-002', 'lab-001', 480.00, 48.00, 0, 528.00, 'paid', datetime('now', '+30 days'), datetime('now')),
('inv-test-003', 'INV-103', 'pat-test-003', 'lab-001', 480.00, 48.00, 0, 528.00, 'paid', datetime('now', '+30 days'), datetime('now')),
('inv-test-004', 'INV-104', 'pat-test-004', 'lab-001', 480.00, 48.00, 0, 528.00, 'paid', datetime('now', '+30 days'), datetime('now')),
('inv-test-005', 'INV-105', 'pat-test-005', 'lab-001', 480.00, 48.00, 0, 528.00, 'paid', datetime('now', '+30 days'), datetime('now'));

-- Create Commissions for doctors
INSERT INTO "Commission" ("id", "doctorId", "invoiceId", "percentage", "amount", "isPaid", "createdAt") VALUES
('comm-test-001', 'doc-001', 'inv-test-001', 5.0, 26.40, true, datetime('now')),
('comm-test-002', 'doc-002', 'inv-test-002', 5.0, 26.40, true, datetime('now')),
('comm-test-003', 'doc-001', 'inv-test-003', 5.0, 26.40, true, datetime('now')),
('comm-test-004', 'doc-002', 'inv-test-004', 5.0, 26.40, true, datetime('now')),
('comm-test-005', 'doc-001', 'inv-test-005', 5.0, 26.40, true, datetime('now'));
