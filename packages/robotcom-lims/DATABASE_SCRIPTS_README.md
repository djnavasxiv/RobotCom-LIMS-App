# Database Management Scripts

Quick scripts to manage test patient data in the RobotComLab LIMS application.

## Scripts

### `add-patients.sh`
Populates the database with 5 test patients (patient-201 to patient-205) with complete test data.

**Usage:**
```bash
./add-patients.sh
```

**What it does:**
- Adds 5 patients with full demographic information
- Creates 5 samples (one per patient)
- Generates 24 test results for each patient (120 total)
- Displays final database counts

**Database impact:**
- Patients: +5 (total 15)
- Samples: +5 (total 15)
- Test Results: +120 (total 244)

---

### `clear-patients.sh`
Removes the 5 test patients and all their associated data from the database.

**Usage:**
```bash
./clear-patients.sh
```

**What it does:**
- Prompts for confirmation before deleting
- Removes all results for test patients (201-205)
- Removes all samples for test patients
- Removes the test patient records
- Displays final database counts

**Database impact:**
- Patients: -5 (total 10)
- Samples: -5 (total 10)
- Test Results: -120 (total 124)

---

## Test Patients Created

| ID | Name | Birth Date | Gender | Blood Type |
|----|------|-----------|--------|-----------|
| patient-201 | Juan Carlos Mendez | 1985-03-15 | M | O+ |
| patient-202 | Maria Elena Rodriguez | 1990-07-22 | F | A- |
| patient-203 | Luis Antonio Garcia | 1978-11-08 | M | B+ |
| patient-204 | Patricia Isabel Morales | 1992-05-30 | F | AB+ |
| patient-205 | Roberto Javier López | 1988-09-14 | M | O- |

---

## Test Results

Each patient has 24 test results covering all laboratory tests:
- Blood type
- Hemoglobin, Hematocrit
- Glucose
- Cholesterol, Triglycerides
- Bilirubin, Protein
- Creatinine, Urea
- Uric Acid
- TSH, T4
- Hormones
- Urinalysis, Stool Test
- Coagulation
- Pregnancy Test
- Blood Count
- Platelets
- Immunoglobulin
- Cultures

---

## Source Files

- `prisma/add-5-patients.sql` - SQL script to insert patients and test data
- `prisma/clear-patients.sql` - SQL script to remove test patients
- Database: `prisma/dev.db`

---

## Requirements

- SQLite3 installed and accessible via `sqlite3` command
- Bash shell
- Proper database file at `./prisma/dev.db`

---

## Notes

- Scripts are idempotent - running add-patients.sh multiple times will fail after the first run (duplicate patient IDs)
- Use clear-patients.sh to remove test data before adding it again
- The scripts display a summary of database counts after execution
- All test patients use lab ID: `lab-001`
