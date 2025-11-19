-- Clear all test patients and related data
-- This script removes the 5 test patients (patient-201 through patient-205) and their associated data

-- Delete results for test patients
DELETE FROM Result 
WHERE sampleId IN (
  SELECT id FROM Sample WHERE patientId IN (
    'patient-201', 'patient-202', 'patient-203', 'patient-204', 'patient-205'
  )
);

-- Delete samples for test patients
DELETE FROM Sample 
WHERE patientId IN (
  'patient-201', 'patient-202', 'patient-203', 'patient-204', 'patient-205'
);

-- Delete test patients
DELETE FROM Patient 
WHERE id IN (
  'patient-201', 'patient-202', 'patient-203', 'patient-204', 'patient-205'
);
