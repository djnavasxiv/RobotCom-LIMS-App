-- Clear existing data (in reverse foreign key order)
DELETE FROM "Commission";
DELETE FROM "InvoiceItem";
DELETE FROM "Invoice";
DELETE FROM "Result";
DELETE FROM "SampleTest";
DELETE FROM "Sample";
DELETE FROM "StockAdjustment";
DELETE FROM "InventoryItem";
DELETE FROM "TestProfileItem";
DELETE FROM "TestProfile";
DELETE FROM "Test";
DELETE FROM "AuditLog";
DELETE FROM "Patient";
DELETE FROM "User";
DELETE FROM "Doctor";
DELETE FROM "License";
DELETE FROM "Setting";

-- Create Lab
INSERT INTO "Lab" ("id", "name", "address", "phone", "email", "createdAt", "updatedAt") 
VALUES ('lab-001', 'RobotComLab Principal', '123 Main St, Anytown USA', '555-1234', 'contact@robotcomlab.com', datetime('now'), datetime('now'));

-- Create Users (password hashed with bcrypt for 'password')
-- Note: This uses bcrypt hash of 'password' - $2b$10$...
INSERT INTO "User" ("id", "username", "password", "fullName", "email", "role", "isActive", "labId", "createdAt")
VALUES 
('user-admin', 'admin', '$2b$10$slYQmyNdGzin7olVN3p5be4DKBaWxzuKIAu.xkiHu5F/IYWJ.n5nS', 'Admin User', 'admin@robotcomlab.com', 'admin', true, 'lab-001', datetime('now')),
('user-tech', 'tecnico', '$2b$10$slYQmyNdGzin7olVN3p5be4DKBaWxzuKIAu.xkiHu5F/IYWJ.n5nS', 'Técnico Laboratorio', 'tech@robotcomlab.com', 'technician', true, 'lab-001', datetime('now'));

-- Create Tests for all 14 modules
INSERT INTO "Test" ("id", "code", "name", "price", "category", "isActive", "createdAt") VALUES
-- Tipificación Sanguínea
('test-001', 'abo', 'Grupo ABO', 10.00, 'Tipificación Sanguínea', true, datetime('now')),
('test-002', 'rh', 'Factor Rh', 10.00, 'Tipificación Sanguínea', true, datetime('now')),

-- Coagulación
('test-003', 'pt', 'Tiempo de Protrombina (TP)', 15.00, 'Coagulación', true, datetime('now')),
('test-004', 'inr', 'INR', 15.00, 'Coagulación', true, datetime('now')),

-- ELISA
('test-005', 'hiv', 'VIH 1/2', 30.00, 'ELISA', true, datetime('now')),
('test-006', 'hbsag', 'Hepatitis B', 25.00, 'ELISA', true, datetime('now')),

-- Inmunología  
('test-007', 'igg', 'Inmunoglobulina G (IgG)', 18.00, 'Inmunología', true, datetime('now')),
('test-008', 'igm', 'Inmunoglobulina M (IgM)', 18.00, 'Inmunología', true, datetime('now')),

-- Hormonas
('test-009', 'tsh', 'TSH', 20.00, 'Hormonas', true, datetime('now')),
('test-010', 't4', 'T4 Libre', 20.00, 'Hormonas', true, datetime('now')),

-- Análisis de Orina
('test-011', 'densidad_orina', 'Densidad de Orina', 8.00, 'Análisis de Orina', true, datetime('now')),
('test-012', 'proteina_orina', 'Proteína en Orina', 8.00, 'Análisis de Orina', true, datetime('now')),

-- Análisis de Heces
('test-013', 'parasitos', 'Búsqueda de Parásitos', 12.00, 'Análisis de Heces', true, datetime('now')),
('test-014', 'sangre_oculta', 'Sangre Oculta en Heces', 10.00, 'Análisis de Heces', true, datetime('now')),

-- Química Clínica
('test-015', 'glucosa', 'Glucosa', 5.00, 'Química Clínica', true, datetime('now')),
('test-016', 'sodio', 'Sodio', 7.00, 'Química Clínica', true, datetime('now')),

-- Pruebas de Embarazo
('test-017', 'bhcg_sangre', 'Beta hCG en Sangre', 15.00, 'Embarazo', true, datetime('now')),
('test-018', 'hcg_orina', 'hCG en Orina', 10.00, 'Embarazo', true, datetime('now')),

-- Hematología
('test-019', 'rbc', 'Glóbulos Rojos (RBC)', 10.00, 'Hematología', true, datetime('now')),
('test-020', 'wbc', 'Glóbulos Blancos (WBC)', 10.00, 'Hematología', true, datetime('now')),

-- Bacteriología
('test-021', 'cultivo_sangre', 'Cultivo de Sangre', 30.00, 'Bacteriología', true, datetime('now')),
('test-022', 'cultivo_orina', 'Cultivo de Orina', 25.00, 'Bacteriología', true, datetime('now')),

-- Espermiograma
('test-023', 'concentracion', 'Concentración de Espermatozoides', 35.00, 'Espermatobioscopia', true, datetime('now')),
('test-024', 'movilidad', 'Movilidad de Espermatozoides', 35.00, 'Espermatobioscopia', true, datetime('now'));

-- Create Patients
INSERT INTO "Patient" ("id", "firstName", "lastName", "gender", "birthDate", "phone", "email", "labId", "createdAt") VALUES
('pat-001', 'Juan', 'Pérez', 'M', '1985-05-15', '555-0101', 'juan@example.com', 'lab-001', datetime('now')),
('pat-002', 'María', 'García', 'F', '1990-08-22', '555-0102', 'maria@example.com', 'lab-001', datetime('now')),
('pat-003', 'Carlos', 'López', 'M', '1988-03-10', '555-0103', 'carlos@example.com', 'lab-001', datetime('now')),
('pat-004', 'Ana', 'Rodríguez', 'F', '1992-11-30', '555-0104', 'ana@example.com', 'lab-001', datetime('now')),
('pat-005', 'Luis', 'Martínez', 'M', '1987-07-20', '555-0105', 'luis@example.com', 'lab-001', datetime('now'));

-- Create Test Profile
INSERT INTO "TestProfile" ("id", "name", "description", "isActive", "createdAt") 
VALUES ('prof-001', 'Panel General', 'Perfil general de pruebas incluidas en el análisis', true, datetime('now'));

-- Add Tests to Profile
INSERT INTO "TestProfileItem" ("id", "profileId", "testId") 
SELECT 'prof-item-' || ROW_NUMBER() OVER(ORDER BY "id"), 'prof-001', "id" FROM "Test";

-- Create Samples
INSERT INTO "Sample" ("id", "sampleNumber", "patientId", "profileId", "collectionDate", "status", "createdAt") VALUES
('smp-001', 'S-001', 'pat-001', 'prof-001', datetime('now', '-5 days'), 'completed', datetime('now')),
('smp-002', 'S-002', 'pat-002', 'prof-001', datetime('now', '-3 days'), 'pending_results', datetime('now')),
('smp-003', 'S-003', 'pat-003', 'prof-001', datetime('now', '-1 days'), 'pending_results', datetime('now')),
('smp-004', 'S-004', 'pat-004', 'prof-001', datetime('now'), 'pending_results', datetime('now')),
('smp-005', 'S-005', 'pat-005', 'prof-001', datetime('now'), 'completed', datetime('now'));

-- Add Tests to Samples
INSERT INTO "SampleTest" ("id", "sampleId", "testId", "price") VALUES
('st-001', 'smp-001', 'test-001', 10.00),
('st-002', 'smp-001', 'test-003', 15.00),
('st-003', 'smp-001', 'test-005', 30.00),
('st-004', 'smp-002', 'test-001', 10.00),
('st-005', 'smp-002', 'test-009', 20.00),
('st-006', 'smp-003', 'test-015', 5.00),
('st-007', 'smp-004', 'test-017', 15.00),
('st-008', 'smp-005', 'test-019', 10.00);

-- Create Results for completed samples
INSERT INTO "Result" ("id", "sampleId", "testId", "value", "isNormal", "notes", "enteredBy", "enteredAt", "createdAt") VALUES
('res-001', 'smp-001', 'test-001', 'O+', true, 'Resultado verificado para S-001', 'user-admin', datetime('now'), datetime('now')),
('res-002', 'smp-001', 'test-003', '12.5', true, 'Resultado verificado para S-001', 'user-admin', datetime('now'), datetime('now')),
('res-003', 'smp-001', 'test-005', 'Negativo', true, 'Resultado verificado para S-001', 'user-admin', datetime('now'), datetime('now')),
('res-004', 'smp-005', 'test-019', '4.5', true, 'Resultado verificado para S-005', 'user-admin', datetime('now'), datetime('now'));

-- Create Invoices
INSERT INTO "Invoice" ("id", "invoiceNumber", "patientId", "labId", "subtotal", "tax", "discount", "total", "status", "dueDate", "createdAt") VALUES
('inv-001', 'INV-001', 'pat-001', 'lab-001', 200.00, 20.00, 0, 220.00, 'paid', datetime('now', '+30 days'), datetime('now')),
('inv-002', 'INV-002', 'pat-002', 'lab-001', 150.00, 15.00, 0, 165.00, 'pending', datetime('now', '+30 days'), datetime('now')),
('inv-003', 'INV-003', 'pat-003', 'lab-001', 100.00, 10.00, 0, 110.00, 'paid', datetime('now', '+30 days'), datetime('now'));

-- Create Doctors
INSERT INTO "Doctor" ("id", "firstName", "lastName", "email", "phone", "specialty", "isActive", "createdAt") VALUES
('doc-001', 'Dr.', 'Sánchez', 'doctor@example.com', '555-9999', 'General', true, datetime('now')),
('doc-002', 'Dr.', 'García', 'doctor2@example.com', '555-8888', 'Cardiology', true, datetime('now'));

-- Create Commissions
INSERT INTO "Commission" ("id", "doctorId", "invoiceId", "percentage", "amount", "isPaid", "createdAt") VALUES
('comm-001', 'doc-001', 'inv-001', 5.0, 11.00, false, datetime('now')),
('comm-002', 'doc-001', 'inv-003', 5.0, 5.50, true, datetime('now'));

-- Create Inventory Items
INSERT INTO "InventoryItem" ("id", "code", "name", "quantity", "minQuantity", "unit", "isActive", "createdAt") VALUES
('inv-item-001', 'TUBE001', 'Test Tube Vacío', 500, 50, 'units', true, datetime('now')),
('inv-item-002', 'TUBE002', 'Test Tube EDTA', 300, 50, 'units', true, datetime('now')),
('inv-item-003', 'TUBE003', 'Test Tube Suero', 250, 50, 'units', true, datetime('now')),
('inv-item-004', 'CHEM001', 'Reactivo Glucosa', 50, 10, 'bottles', true, datetime('now')),
('inv-item-005', 'CHEM002', 'Reactivo Colesterol', 40, 10, 'bottles', true, datetime('now'));

-- Create License
INSERT INTO "License" ("id", "licenseKey", "machineId", "subscriptionType", "isActive", "expiresAt", "createdAt") VALUES
('lic-001', 'LICENSE-2024-001', 'MACHINE-001', 'professional', true, datetime('now', '+365 days'), datetime('now'));
