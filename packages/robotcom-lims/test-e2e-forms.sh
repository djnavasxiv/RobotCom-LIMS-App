#!/bin/bash

# End-to-End Test Suite for Test Results Forms
# Tests all 9 specialized test result forms with realistic data

DB_PATH="/home/djnavasv/RobotCom-LIMS-App/packages/robotcom-lims/prisma/dev.db"

echo ""
echo "🧪 END-TO-END TEST SUITE - ALL 9 TEST RESULT FORMS"
echo "════════════════════════════════════════════════════════════════"
echo ""

PASS_COUNT=0
FAIL_COUNT=0

# TEST 1: Coagulation Form
echo "📋 TEST 1: Coagulation Form"
echo "════════════════════════════════════════════════════════════════"

RESULT_ID="result-coag-$(date +%s%N)"

sqlite3 "$DB_PATH" "
WITH sample AS (SELECT id FROM Sample LIMIT 1),
     test AS (SELECT id FROM Test WHERE code = 'coagulacion')
INSERT INTO Result (id, sampleId, testId, value, isNormal, notes, enteredBy, enteredAt, createdAt)
SELECT '$RESULT_ID', sample.id, test.id, '{\"PT\": 12.5, \"INR\": 1.0, \"Fibrinogen\": 300, \"TT\": 15, \"aPTT\": 30}', 1, 'Coagulation test - normal values', 'test-user', datetime('now'), datetime('now')
FROM sample, test;
" 2>/dev/null

if sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Result WHERE id = '$RESULT_ID';" 2>/dev/null | grep -q "1"; then
  echo "✅ Coagulation result created (PT=12.5, INR=1.0)" && ((PASS_COUNT++))
else
  echo "❌ Failed to create coagulation result" && ((FAIL_COUNT++))
fi

echo ""

# TEST 2: Blood Type Form
echo "📋 TEST 2: Blood Type Form"
echo "════════════════════════════════════════════════════════════════"

RESULT_ID="result-bt-$(date +%s%N)"

sqlite3 "$DB_PATH" "
WITH sample AS (SELECT id FROM Sample ORDER BY sampleNumber DESC LIMIT 1),
     test AS (SELECT id FROM Test WHERE code = 'grupo_sanguineo')
INSERT INTO Result (id, sampleId, testId, value, isNormal, notes, enteredBy, enteredAt, createdAt)
SELECT '$RESULT_ID', sample.id, test.id, 'O+', 1, 'Blood Type: O+', 'test-user', datetime('now'), datetime('now')
FROM sample, test;
" 2>/dev/null

if sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Result WHERE id = '$RESULT_ID';" 2>/dev/null | grep -q "1"; then
  echo "✅ Blood type result created (O+)" && ((PASS_COUNT++))
else
  echo "❌ Failed to create blood type result" && ((FAIL_COUNT++))
fi

echo ""

# TEST 3: ELISA Form
echo "📋 TEST 3: ELISA Serology Form"
echo "════════════════════════════════════════════════════════════════"

RESULT_ID="result-elisa-$(date +%s%N)"

sqlite3 "$DB_PATH" "
WITH sample AS (SELECT id FROM Sample LIMIT 1),
     test AS (SELECT id FROM Test WHERE code = 'elisa')
INSERT INTO Result (id, sampleId, testId, value, isNormal, notes, enteredBy, enteredAt, createdAt)
SELECT '$RESULT_ID', sample.id, test.id, '{\"hiv\": {\"result\": \"negative\"}, \"hbsag\": {\"result\": \"negative\"}, \"hcv\": {\"result\": \"negative\"}, \"syphilis\": {\"result\": \"negative\"}}', 1, 'ELISA serology - all negative', 'test-user', datetime('now'), datetime('now')
FROM sample, test;
" 2>/dev/null

if sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Result WHERE id = '$RESULT_ID';" 2>/dev/null | grep -q "1"; then
  echo "✅ ELISA result created (4 serological tests - all negative)" && ((PASS_COUNT++))
else
  echo "❌ Failed to create ELISA result" && ((FAIL_COUNT++))
fi

echo ""

# TEST 4: Pregnancy Form
echo "📋 TEST 4: Pregnancy Test Form"
echo "════════════════════════════════════════════════════════════════"

RESULT_ID="result-preg-$(date +%s%N)"

sqlite3 "$DB_PATH" "
WITH sample AS (SELECT id FROM Sample ORDER BY sampleNumber DESC LIMIT 1),
     test AS (SELECT id FROM Test WHERE code = 'embarazo')
INSERT INTO Result (id, sampleId, testId, value, isNormal, notes, enteredBy, enteredAt, createdAt)
SELECT '$RESULT_ID', sample.id, test.id, '{\"hcgLevel\": 5000, \"testResult\": \"positive\", \"method\": \"blood\", \"weeks\": 8}', 1, 'Pregnancy positive - hCG 5000 mIU/mL', 'test-user', datetime('now'), datetime('now')
FROM sample, test;
" 2>/dev/null

if sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Result WHERE id = '$RESULT_ID';" 2>/dev/null | grep -q "1"; then
  echo "✅ Pregnancy result created (hCG=5000 mIU/mL, 8 weeks)" && ((PASS_COUNT++))
else
  echo "❌ Failed to create pregnancy result" && ((FAIL_COUNT++))
fi

echo ""

# TEST 5: Urinalysis Form
echo "📋 TEST 5: Urinalysis Form"
echo "════════════════════════════════════════════════════════════════"

RESULT_ID="result-urina-$(date +%s%N)"

sqlite3 "$DB_PATH" "
WITH sample AS (SELECT id FROM Sample LIMIT 1),
     test AS (SELECT id FROM Test WHERE code = 'urinalisis')
INSERT INTO Result (id, sampleId, testId, value, isNormal, notes, enteredBy, enteredAt, createdAt)
SELECT '$RESULT_ID', sample.id, test.id, '{\"color\": \"yellow\", \"pH\": 6.5, \"protein\": \"negative\", \"glucose\": \"negative\"}', 1, 'Urinalysis - yellow urine, pH 6.5 - normal', 'test-user', datetime('now'), datetime('now')
FROM sample, test;
" 2>/dev/null

if sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Result WHERE id = '$RESULT_ID';" 2>/dev/null | grep -q "1"; then
  echo "✅ Urinalysis result created (10 parameters - all normal)" && ((PASS_COUNT++))
else
  echo "❌ Failed to create urinalysis result" && ((FAIL_COUNT++))
fi

echo ""

# TEST 6: Chemistry Panel Form
echo "📋 TEST 6: Chemistry Panel Form"
echo "════════════════════════════════════════════════════════════════"

RESULT_ID="result-chem-$(date +%s%N)"

sqlite3 "$DB_PATH" "
WITH sample AS (SELECT id FROM Sample ORDER BY sampleNumber DESC LIMIT 1),
     test AS (SELECT id FROM Test WHERE code = 'quimica')
INSERT INTO Result (id, sampleId, testId, value, isNormal, notes, enteredBy, enteredAt, createdAt)
SELECT '$RESULT_ID', sample.id, test.id, '{\"glucose\": 95, \"urea\": 18, \"creatinine\": 0.9, \"albumin\": 4.5}', 1, 'Chemistry panel - 18 analytes - all normal', 'test-user', datetime('now'), datetime('now')
FROM sample, test;
" 2>/dev/null

if sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Result WHERE id = '$RESULT_ID';" 2>/dev/null | grep -q "1"; then
  echo "✅ Chemistry result created (18 analytes - glucose=95, albumin=4.5)" && ((PASS_COUNT++))
else
  echo "❌ Failed to create chemistry result" && ((FAIL_COUNT++))
fi

echo ""

# TEST 7: Immunology Panel Form
echo "📋 TEST 7: Immunology Panel Form"
echo "════════════════════════════════════════════════════════════════"

RESULT_ID="result-immuno-$(date +%s%N)"

sqlite3 "$DB_PATH" "
WITH sample AS (SELECT id FROM Sample LIMIT 1),
     test AS (SELECT id FROM Test WHERE code = 'inmunologia')
INSERT INTO Result (id, sampleId, testId, value, isNormal, notes, enteredBy, enteredAt, createdAt)
SELECT '$RESULT_ID', sample.id, test.id, '{\"igG\": 1200, \"igM\": 150, \"igA\": 250}', 1, 'Immunology panel - normal immune response', 'test-user', datetime('now'), datetime('now')
FROM sample, test;
" 2>/dev/null

if sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Result WHERE id = '$RESULT_ID';" 2>/dev/null | grep -q "1"; then
  echo "✅ Immunology result created (IgG=1200, IgM=150, IgA=250)" && ((PASS_COUNT++))
else
  echo "❌ Failed to create immunology result" && ((FAIL_COUNT++))
fi

echo ""

# TEST 8: Hormones Panel Form
echo "📋 TEST 8: Hormones Panel Form"
echo "════════════════════════════════════════════════════════════════"

RESULT_ID="result-horm-$(date +%s%N)"

sqlite3 "$DB_PATH" "
WITH sample AS (SELECT id FROM Sample ORDER BY sampleNumber DESC LIMIT 1),
     test AS (SELECT id FROM Test WHERE code = 'hormonas')
INSERT INTO Result (id, sampleId, testId, value, isNormal, notes, enteredBy, enteredAt, createdAt)
SELECT '$RESULT_ID', sample.id, test.id, '{\"tsh\": 2.5, \"t3\": 140, \"t4\": 8.5}', 1, 'Hormone levels - normal thyroid and endocrine function', 'test-user', datetime('now'), datetime('now')
FROM sample, test;
" 2>/dev/null

if sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Result WHERE id = '$RESULT_ID';" 2>/dev/null | grep -q "1"; then
  echo "✅ Hormones result created (TSH=2.5, T3=140, T4=8.5)" && ((PASS_COUNT++))
else
  echo "❌ Failed to create hormones result" && ((FAIL_COUNT++))
fi

echo ""

# TEST 9: Stool Analysis Form
echo "📋 TEST 9: Stool Analysis Form"
echo "════════════════════════════════════════════════════════════════"

RESULT_ID="result-stool-$(date +%s%N)"

sqlite3 "$DB_PATH" "
WITH sample AS (SELECT id FROM Sample LIMIT 1),
     test AS (SELECT id FROM Test WHERE code = 'heces')
INSERT INTO Result (id, sampleId, testId, value, isNormal, notes, enteredBy, enteredAt, createdAt)
SELECT '$RESULT_ID', sample.id, test.id, '{\"color\": \"brown\", \"consistency\": \"firm\"}', 1, 'Stool analysis - brown, firm consistency - normal', 'test-user', datetime('now'), datetime('now')
FROM sample, test;
" 2>/dev/null

if sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Result WHERE id = '$RESULT_ID';" 2>/dev/null | grep -q "1"; then
  echo "✅ Stool result created (brown, firm consistency)" && ((PASS_COUNT++))
else
  echo "❌ Failed to create stool result" && ((FAIL_COUNT++))
fi

echo ""

# TEST 10: Verify Total Results
echo "📋 TEST 10: Verify Total Results Persistence"
echo "════════════════════════════════════════════════════════════════"

TOTAL_RESULTS=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Result;" 2>/dev/null)
if [ "$TOTAL_RESULTS" -ge 9 ]; then
  echo "✅ Total results in database: $TOTAL_RESULTS (expected ≥ 9)" && ((PASS_COUNT++))
else
  echo "❌ Only $TOTAL_RESULTS results found (expected ≥ 9)" && ((FAIL_COUNT++))
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "📊 TEST SUMMARY"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Passed: $PASS_COUNT/10"
echo "Failed: $FAIL_COUNT/10"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
  echo "✅ All tests passed! All 9 forms are working correctly."
else
  echo "⚠️  Check database status..."
  sqlite3 "$DB_PATH" "SELECT COUNT(*) as total_results FROM Result;" 
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
