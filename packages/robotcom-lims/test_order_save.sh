#!/bin/bash

echo "=========================================="
echo "RobotCom LIMS - Order Save Test Script"
echo "=========================================="
echo ""

DB_PATH="prisma/dev.db"

echo "1. Checking database file..."
if [ -f "$DB_PATH" ]; then
    echo "   ✓ Database file exists"
    ls -lh "$DB_PATH"
else
    echo "   ✗ Database file not found at $DB_PATH"
    exit 1
fi

echo ""
echo "2. Current Patients in database:"
sqlite3 "$DB_PATH" "SELECT id, firstName, lastName, phone FROM Patient LIMIT 3;"

echo ""
echo "3. Current Tests in database:"
sqlite3 "$DB_PATH" "SELECT id, code, name, price FROM Test LIMIT 3;"

echo ""
echo "4. Current Samples (Orders) in database:"
sqlite3 "$DB_PATH" "SELECT id, sampleNumber, patientId, status FROM Sample ORDER BY createdAt DESC LIMIT 3;"

echo ""
echo "5. Current Invoices in database:"
sqlite3 "$DB_PATH" "SELECT id, invoiceNumber, patientId, total FROM Invoice ORDER BY createdAt DESC LIMIT 3;"

echo ""
echo "6. Total Record Counts:"
PATIENT_COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Patient;")
TEST_COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Test;")
SAMPLE_COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Sample;")
INVOICE_COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Invoice;")

echo "   Patients: $PATIENT_COUNT"
echo "   Tests: $TEST_COUNT"
echo "   Samples: $SAMPLE_COUNT"
echo "   Invoices: $INVOICE_COUNT"

echo ""
echo "=========================================="
echo "Database Ready - Awaiting Test Order"
echo "=========================================="
