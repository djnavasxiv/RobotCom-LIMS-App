# Test Patient Data Management

## Quick Start

You now have two convenient bash scripts to manage test patient data:

### Add Test Data
```bash
cd packages/robotcom-lims
./add-patients.sh
```

This will add:
- **5 patients** (patient-201 through patient-205)
- **5 samples** (one per patient)
- **120 test results** (24 tests per patient)

### Clear Test Data
```bash
cd packages/robotcom-lims
./clear-patients.sh
```

This will remove all test patients and their associated data (with confirmation prompt).

---

## Current Database State

**After running `add-patients.sh`:**
- Total Patients: **15** (10 existing + 5 new)
- Total Samples: **15**
- Total Test Results: **244**

**Dashboard (Panel de Control) will show:**
- Pacientes: **15**
- Muestras: **15**
- Exámenes: **244**

---

## Test Patient Details

All 5 patients have complete demographic information and all 24 laboratory tests completed:

1. **Juan Carlos Mendez** (patient-201)
   - Birth: 1985-03-15 | Gender: M | Blood: O+
   - All test results normal

2. **Maria Elena Rodriguez** (patient-202)
   - Birth: 1990-07-22 | Gender: F | Blood: A-
   - Elevated glucose (diabetic)

3. **Luis Antonio Garcia** (patient-203)
   - Birth: 1978-11-08 | Gender: M | Blood: B+
   - All test results normal

4. **Patricia Isabel Morales** (patient-204)
   - Birth: 1992-05-30 | Gender: F | Blood: AB+
   - All test results normal

5. **Roberto Javier López** (patient-205)
   - Birth: 1988-09-14 | Gender: M | Blood: O-
   - Elevated cholesterol

---

## Files Created

1. **add-patients.sh** - Bash script to populate test data
2. **clear-patients.sh** - Bash script to clear test data (with confirmation)
3. **prisma/add-5-patients.sql** - SQL insert statements for patients and results
4. **prisma/clear-patients.sql** - SQL delete statements for cleanup
5. **DATABASE_SCRIPTS_README.md** - Complete documentation

---

## Next Steps

1. Run `./add-patients.sh` in the robotcom-lims folder
2. Start the application
3. Login with: `admin` / `password`
4. You should now see:
   - **PANEL DE CONTROL** button in top menu
   - Dashboard showing 15 pacientes, 15 muestras, 244 exámenes
   - **PACIENTES** page showing all 15 patients with their test results
   - Full lab data for testing the application

---

## Notes

- Scripts work on Linux and macOS (requires bash and sqlite3)
- For Windows, run the SQL files directly in SQLite or use WSL
- The scripts are idempotent for clearing (safe to run multiple times)
- Adding data when it already exists will fail - clear first
- All test patients are assigned to lab `lab-001` (RobotComLab Principal)
