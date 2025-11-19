# Lab Automation Services - Quick Reference Guide
**Author: David Navas**

## Service Overview

### Import Pattern
All services follow the same pattern:
```typescript
import DeltaCheckEngine from '@main/services/DeltaCheckEngine';
import CalculationEngine from '@main/services/CalculationEngine';
// etc...
```

---

## DeltaCheckEngine Usage

### Check for anomalous changes
```typescript
// Hemoglobin delta check
const previousResult: PreviousResult = {
  id: 'res-1',
  value: 12.5,
  date: new Date('2025-11-18')
};

const alert = DeltaCheckEngine.deltaCheckHemoglobin(
  7.2, // current hemoglobin
  previousResult
);

if (alert.triggered) {
  console.log(alert.message); // "DELTA CHECK ALERT: Hemoglobin dropped..."
  console.log(alert.recommendation); // Clinical guidance
}
```

### Supported Tests
- `deltaCheckHemoglobin()` - Anemia detection
- `deltaCheckHematocrit()` - Fluid status changes
- `deltaCheckGlucose()` - Diabetes control
- `deltaCheckCreatinine()` - Kidney function
- `deltaCheckPotassium()` - Electrolyte emergencies
- `genericDeltaCheck()` - Any test with thresholds

---

## CalculationEngine Usage

### Calculate derived values
```typescript
// Calculate eGFR for kidney function
const egfr = CalculationEngine.calculateEGFR_CKD_EPI(
  1.8,  // creatinine mg/dL
  65,   // age
  'M'   // gender
);

console.log(`eGFR: ${egfr.value} ${egfr.unit}`); // eGFR: 45.3 mL/min/1.73m²
```

### Supported Calculations
- **Renal:** eGFR (MDRD, CKD-EPI), BUN/Cr ratio, osmolality
- **Hematology:** MCV, MCHC, Hct from Hb, corrected WBC
- **Chemistry:** Anion gap, corrected calcium
- **Anthropometric:** BMI, BSA
- **Glycemic:** Estimated plasma glucose from HbA1c

---

## ReflexTestingEngine Usage

### Order follow-up tests
```typescript
// Check if hemoglobin result needs reflex tests
const reflexTrigger = ReflexTestingEngine.checkHemoglobinReflex(7.2);

if (reflexTrigger.triggered) {
  console.log(`Reflex tests needed: ${reflexTrigger.reflexTests.length}`);
  reflexTrigger.reflexTests.forEach(test => {
    console.log(`- ${test.testName} (P${test.priority})`);
    console.log(`  Reason: ${test.reason}`);
  });
}
```

### Available Checks
- `checkHemoglobinReflex()` - Severity-based reflexing
- `checkWBCReflex()` - Differential + smear
- `checkPlateletReflex()` - Morphology assessment
- `checkGlucoseReflex()` - HbA1c for control
- `checkCreatinineReflex()` - Renal workup
- `checkTroponinReflex()` - Cardiac assessment
- `checkCRPReflex()` - Infection workup

---

## QualityControlEngine Usage

### Validate QC runs
```typescript
const currentRun: QCRun = {
  id: 'qc-123',
  testId: 'HGB',
  testName: 'Hemoglobin',
  levelId: 'L2',
  levelName: 'Normal',
  value: 12.1,
  expectedMean: 12.0,
  expectedSD: 0.3,
  timestamp: new Date()
};

const analysis = QualityControlEngine.applyWestgardRules(
  currentRun,
  previousRuns
);

if (!analysis.passed) {
  console.log('QC FAILED!');
  analysis.violations.forEach(v => {
    console.log(`${v.ruleName}: ${v.description}`);
    console.log(`Action: ${v.recommendedAction}`);
  });
}
```

### Westgard Rules Implemented
- 1-2s: Single >±2 SD (warning)
- 1-3s: Single >±3 SD (reject)
- 2-2s: Two consecutive same side ±2 SD (reject)
- R-4s: Range >4 SD (reject)
- 4-1s: Four consecutive >±1 SD (reject)
- 10-x: Ten consecutive on same side (reject)

### Additional Methods
- `calculateZScore()` - Z-score from mean/SD
- `calculateControlLimits()` - Get ±1, ±2, ±3 SD lines
- `generateLeveyJenningsData()` - Chart data points
- `detectTrend()` - Identify systematic drift
- `calculateCoeffcientOfVariation()` - CV% analysis

---

## CriticalValueEngine Usage

### Detect panic values
```typescript
const alert = CriticalValueEngine.generateCriticalValueAlert(
  'HGB',           // test ID
  'Hemoglobin',    // test name
  6.8,             // value
  'g/dL',          // unit
  'John Doe',      // patient name
  'P-123456',      // patient ID
  'S-987654'       // sample number
);

if (alert) {
  console.log(alert.message);
  // "CRITICAL LOW ALERT: Hemoglobin = 6.8 g/dL"
  
  // Send notifications
  alert.notificationActions.forEach(action => {
    if (action.actionType === 'PHONE_CALL') {
      // Initiate phone call
    }
  });
}
```

### Available Checks
- Hematology: HGB, HCT, PLT, WBC, INR
- Chemistry: GLU, K, NA, CA, CR, BUN
- Cardiac: TROP, CK-MB
- Immunology: HIV, HBsAg, HCV

### Notification Types
- `PHONE_CALL` - Physician notification
- `EMAIL` - Lab director alert
- `SMS` - Text message
- `PAGE` - Beeper alert
- `PRINT_ALERT` - Physical printout

---

## ReportGeneratorEngine Usage

### Generate reports
```typescript
const config = ReportGeneratorEngine.createDefaultConfig(
  'Central Hospital Laboratory',
  'HTML'
);

const report = ReportGeneratorEngine.generateHTMLReport(
  {
    patientID: 'P-123456',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('1960-01-15'),
    gender: 'M'
  },
  {
    sampleNumber: 'S-987654',
    collectionDate: new Date(),
    receivedDate: new Date(),
    sampleType: 'Serum'
  },
  [
    {
      testId: 'HGB',
      testName: 'Hemoglobin',
      value: 13.5,
      unit: 'g/dL',
      normalRange: '13.5-17.5 (M)',
      abnormalStatus: 'NORMAL'
    }
    // ... more results
  ],
  config
);

// Save or send report
console.log(report.filename); // Report_P-123456_123456789.html
```

### Report Methods
- `generateHTMLReport()` - Professional HTML
- `generateTextReport()` - Plain text
- `generateCSVReport()` - Data export
- `getMimeType()` - Get content type
- `validateReportConfig()` - Validate settings

---

## Integration Pattern

### ResultService Integration
```typescript
import ResultService from '@main/services/ResultService';

async function processResult(sample: Sample, test: Test, value: number) {
  // 1. Validate result
  const interpretation = ResultInterpreter.interpretResult(
    test.id,
    value,
    patient.age,
    patient.gender
  );
  
  // 2. Check for anomalies
  const deltaCheck = DeltaCheckEngine.deltaCheck(
    test.id,
    value,
    previousResult
  );
  
  // 3. Order reflex tests
  const reflex = ReflexTestingEngine.check(test.id, value);
  
  // 4. Check critical values
  const critical = CriticalValueEngine.generateAlert(
    test.id,
    test.name,
    value,
    test.unit
  );
  
  // 5. Calculate derived values
  const calculations = CalculationEngine.process(test.category, values);
  
  // 6. Generate report
  const report = ReportGeneratorEngine.generateHTMLReport(...);
  
  // 7. Store in database
  return ResultService.createResult({
    sample,
    test,
    value,
    interpretation,
    deltaCheck,
    reflexTests: reflex,
    criticalValue: critical,
    derivedValues: calculations
  });
}
```

---

## Error Handling

### All services return result objects
```typescript
// Calculations return CalculationResult
const result = CalculationEngine.calculateEGFR_CKD_EPI(-1, 65, 'M');
if (!result.isValid) {
  console.error(result.errorMessage); // "Invalid creatinine or age value"
}

// Delta checks always return alerts
const alert = DeltaCheckEngine.deltaCheckGlucose(25, prev);
if (alert.triggered) {
  // Process alert
}

// Critical values return null if not critical
const critical = CriticalValueEngine.generateCriticalValueAlert(...);
if (critical === null) {
  // Not a critical value
}
```

---

## Performance Tips

1. **Batch Operations:** Process multiple samples in parallel
   ```typescript
   const results = await Promise.all(
     samples.map(s => processResult(s))
   );
   ```

2. **Cache Thresholds:** Store critical value thresholds in memory

3. **Lazy Calculation:** Only calculate what's needed
   ```typescript
   // Only calculate eGFR if creatinine abnormal
   if (creatinine > 1.5) {
     const egfr = CalculationEngine.calculateEGFR_CKD_EPI(...);
   }
   ```

4. **Async Notifications:** Don't block result processing
   ```typescript
   // Queue notifications asynchronously
   notificationQueue.add(critical);
   ```

---

## Testing Examples

```typescript
// DeltaCheckEngine
expect(DeltaCheckEngine.calculatePercentChange(15, 10)).toBe(50);
expect(DeltaCheckEngine.deltaCheckHemoglobin(6, prev).triggered).toBe(true);

// CalculationEngine
expect(CalculationEngine.calculateBMI(80, 1.75).value).toBeCloseTo(26.1);

// ReflexTestingEngine
expect(ReflexTestingEngine.evaluateCondition('value > 100', 150)).toBe(true);

// QualityControlEngine
expect(QualityControlEngine.calculateZScore(12.3, 12.0, 0.3)).toBeCloseTo(1.0);

// CriticalValueEngine
expect(CriticalValueEngine.isCriticalValue('HGB', 6.5).isCritical).toBe(true);

// ReportGeneratorEngine
const report = ReportGeneratorEngine.generateHTMLReport(...);
expect(report.mimeType).toBe('text/html');
```

---

## Debugging

### Enable detailed logging
```typescript
const alert = DeltaCheckEngine.deltaCheckHemoglobin(7.0, prev);
console.log(DeltaCheckEngine.formatAlert(alert));

const qc = QualityControlEngine.applyWestgardRules(run, history);
console.log(QualityControlEngine.generateQCReport(run, qc, history));

const critical = CriticalValueEngine.generateCriticalValueAlert(...);
console.log(CriticalValueEngine.formatAlertNotification(critical));
```

---

## Related Documentation

- **Database Schema:** See `prisma/schema.prisma` for models
- **Test Definitions:** Lab-specific configuration in database
- **Clinical Standards:** CLSI, CAP, CLIA guidelines
- **Week 2 Summary:** See `WEEK2_PHASE1_SUMMARY.md`

---

**Last Updated:** November 19, 2025  
**Author:** David Navas  
**Version:** 1.0
