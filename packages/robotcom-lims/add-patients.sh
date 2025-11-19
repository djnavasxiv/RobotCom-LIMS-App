#!/bin/bash
# Script to populate the database with 5 test patients and their complete test results

DB_PATH="./prisma/dev.db"
SQL_FILE="./prisma/add-5-patients.sql"

if [ ! -f "$DB_PATH" ]; then
  echo "Error: Database file not found at $DB_PATH"
  exit 1
fi

if [ ! -f "$SQL_FILE" ]; then
  echo "Error: SQL file not found at $SQL_FILE"
  exit 1
fi

echo "Populating database with 5 test patients..."
sqlite3 "$DB_PATH" < "$SQL_FILE"

if [ $? -eq 0 ]; then
  echo "✓ Successfully added 5 test patients with all test results"
  echo ""
  echo "Database summary:"
  sqlite3 "$DB_PATH" << EOF
.mode column
.headers on
SELECT 'Patients' as Entity, COUNT(*) as Count FROM Patient
UNION ALL
SELECT 'Samples', COUNT(*) FROM Sample
UNION ALL
SELECT 'Test Results', COUNT(*) FROM Result;
EOF
else
  echo "✗ Error populating database"
  exit 1
fi
