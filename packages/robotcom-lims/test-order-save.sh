#!/bin/bash

# Test script to verify order save functionality

DB_PATH="/home/djnavasv/RobotCom-LIMS-App/packages/robotcom-lims/prisma/dev.db"

echo "=== Testing Order Save Functionality ==="
echo ""

# Check initial state
echo "1. Initial Database State:"
INITIAL_SAMPLES=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Sample;")
INITIAL_INVOICES=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Invoice;")
INITIAL_ITEMS=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM InvoiceItem;")

echo "   - Samples: $INITIAL_SAMPLES"
echo "   - Invoices: $INITIAL_INVOICES"
echo "   - Invoice Items: $INITIAL_ITEMS"
echo ""

# Get a test patient and tests
echo "2. Available Test Data:"
PATIENT=$(sqlite3 "$DB_PATH" "SELECT id, firstName, lastName FROM Patient LIMIT 1;")
echo "   - Test Patient: $PATIENT"

TESTS=$(sqlite3 "$DB_PATH" "SELECT id, name, price FROM Test LIMIT 3;")
echo "   - Available Tests:"
echo "$TESTS" | while read line; do
  echo "     $line"
done
echo ""

echo "3. Instructions:"
echo "   - Open the Electron app (should be running on http://localhost:5173)"
echo "   - Navigate to Órdenes (Order Entry)"
echo "   - Select a patient"
echo "   - Select 2-3 tests"
echo "   - Set a discount percentage (optional)"
echo "   - Click 'Guardar Orden'"
echo "   - Check the database after creation"
echo ""

echo "4. Verification Query (run after creating an order):"
echo "   sqlite3 $DB_PATH \"SELECT s.id, s.sampleNumber, p.firstName, p.lastName, COUNT(st.id) as test_count FROM Sample s JOIN Patient p ON s.patientId = p.id LEFT JOIN SampleTest st ON s.id = st.sampleId GROUP BY s.id ORDER BY s.createdAt DESC LIMIT 1;\""
echo ""

echo "5. Invoice Details:"
echo "   sqlite3 $DB_PATH \"SELECT i.id, i.invoiceNumber, i.subtotal, i.discountAmount, i.total FROM Invoice i ORDER BY i.createdAt DESC LIMIT 1;\""
echo ""
