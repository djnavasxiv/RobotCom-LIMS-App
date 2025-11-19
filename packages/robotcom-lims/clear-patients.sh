#!/bin/bash
# Script to clear test patients from the database

DB_PATH="./prisma/dev.db"
SQL_FILE="./prisma/clear-patients.sql"

if [ ! -f "$DB_PATH" ]; then
  echo "Error: Database file not found at $DB_PATH"
  exit 1
fi

if [ ! -f "$SQL_FILE" ]; then
  echo "Error: SQL file not found at $SQL_FILE"
  exit 1
fi

echo "Clearing test patients from database..."
echo "Warning: This will delete patients 201-205 and all their associated data."
read -p "Are you sure? (yes/no) " -n 3 -r
echo ""

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
  echo "Cancelled."
  exit 0
fi

sqlite3 "$DB_PATH" < "$SQL_FILE"

if [ $? -eq 0 ]; then
  echo "✓ Successfully cleared test patients"
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
  echo "✗ Error clearing database"
  exit 1
fi
