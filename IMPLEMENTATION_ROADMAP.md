# Complete Implementation Roadmap: RobotCom-LIMS React App

**Date:** November 19, 2025  
**Priority:** Critical - Automate all FoxPro functionality + add clinical calculations  
**Scope:** Full-stack implementation covering Frontend, Backend, Database, API integration

---

## TABLE OF CONTENTS

1. [Database Schema Updates](#1-database-schema-updates)
2. [Backend Services](#2-backend-services)
3. [Frontend Components](#3-frontend-components)
4. [Email System Overhaul](#4-email-system-overhaul)
5. [Clinical Calculation Engine](#5-clinical-calculation-engine)
6. [API Integration (El Salvador)](#6-api-integration-el-salvador)
7. [Implementation Timeline](#7-implementation-timeline)
8. [Testing Strategy](#8-testing-strategy)

---

## 1. DATABASE SCHEMA UPDATES

### Current State
- ✅ Prisma schema exists
- ✅ Basic Patient, Sample, Invoice models
- ❌ Missing test-specific data structures
- ❌ Missing clinical calculations storage
- ❌ Missing normal range references
- ❌ Missing result interpretation data

### A. Test Category & Definition Schema

**File:** `packages/robotcom-lims/prisma/schema.prisma`

```prisma
// ========== TEST MANAGEMENT ==========

model TestCategory {
  id String @id @default(cuid())
  name String // "Chemistry", "Hematology", "Urinalysis"
  code String @unique
  description String?
  displayOrder Int @default(0)
  
  // Metadata
  hasSubTests Boolean @default(false)
  requiresInterpretation Boolean @default(true)
  
  // Relationships
  testDefinitions TestDefinition[]
  testResults TestResult[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model TestDefinition {
  id String @id @default(cuid())
  categoryId String
  category TestCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  
  // Basic info
  name String // e.g., "Hemoglobin"
  code String @unique // Medical code/abbreviation
  foxProId String? // Reference to FoxPro test ID
  price Decimal @db.Decimal(10, 2)
  description String?
  
  // Field structure - JSON defining what data this test needs
  fieldSchema Json // Defines all input fields required
  
  // Example structure:
  // {
  //   "fields": [
  //     { "name": "value", "type": "number", "required": true, "unit": "g/dL" },
  //     { "name": "interpretation", "type": "string", "required": false }
  //   ]
  // }
  
  // Calculation rules
  calculations Json? // Defines auto-calculations
  
  // Quality rules
  validationRules Json? // Min/max, data type validation
  
  // Reporting
  reportTemplate String? // Report template ID
  categoryDisplayName String? // How to display in reports
  
  // Status
  isActive Boolean @default(true)
  
  // Relationships
  testResults TestResult[]
  normalRanges NormalRange[]
  interpretationRules InterpretationRule[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([categoryId])
}

model TestResult {
  id String @id @default(cuid())
  
  // Core relationships
  sampleId String
  sample Sample @relation(fields: [sampleId], references: [id], onDelete: Cascade)
  
  testDefinitionId String
  testDefinition TestDefinition @relation(fields: [testDefinitionId], references: [id])
  
  // Result data (stored as JSON for flexibility)
  // Dynamic based on test type
  values Json // Raw input values
  
  // Calculated values (auto-computed)
  calculatedValues Json? // MCV, MCH, etc.
  
  // Status tracking
  status String @default("pending") // pending, reviewed, completed, approved
  resultDate DateTime?
  
  // Interpretation
  interpretation String? // Clinical interpretation
  normalRange String? // Reference range for this result
  isAbnormal Boolean @default(false)
  isCritical Boolean @default(false)
  abnormalityType String? // "LOW", "HIGH", "CRITICAL"
  
  // Quality & audit
  enteredBy String? // Technician ID
  reviewedBy String? // Reviewer ID
  comments String?
  
  // Previous result comparison (for delta checks)
  previousResultId String?
  deltaValue Float?
  deltaPercentage Float?
  
  // Relationships
  interpretationRules InterpretationRule[]
  emailsSent EmailLog[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([sampleId])
  @@index([testDefinitionId])
  @@index([status])
}

model NormalRange {
  id String @id @default(cuid())
  
  testDefinitionId String
  testDefinition TestDefinition @relation(fields: [testDefinitionId], references: [id], onDelete: Cascade)
  
  // Demographic filters
  ageMin Int? // Minimum age (null = no limit)
  ageMax Int? // Maximum age (null = no limit)
  gender String? // "M", "F", "Both"
  
  // Range values
  lowerBound Float?
  upperBound Float?
  unit String
  
  // Critical values (panic values)
  criticalLow Float?
  criticalHigh Float?
  
  // Display
  displayText String? // "12.0 - 16.0 g/dL (male)", "11.0 - 15.0 g/dL (female)"
  
  // WHO reference version
  referenceStandard String? // "WHO 5th edition", "CLSI", etc.
  
  isActive Boolean @default(true)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([testDefinitionId, ageMin, ageMax, gender])
  @@index([testDefinitionId])
}

model InterpretationRule {
  id String @id @default(cuid())
  
  testDefinitionId String
  testDefinition TestDefinition @relation(fields: [testDefinitionId], references: [id], onDelete: Cascade)
  
  testResultId String?
  testResult TestResult? @relation(fields: [testResultId], references: [id], onDelete: SetNull)
  
  // Condition evaluation
  condition String // JSON expression: {"field": "value", "operator": ">", "value": 100}
  
  // Result of condition
  interpretation String // Clinical interpretation text
  actionRequired String? // "CRITICAL_ALERT", "REFLEX_TEST", "REVIEW", "ARCHIVE"
  reflixTestId String? // If reflex testing needed
  
  priority Int @default(0) // Order of evaluation
  isActive Boolean @default(true)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([testDefinitionId])
}

// ========== CALCULATION RULES ==========

model CalculationRule {
  id String @id @default(cuid())
  
  // Which test category uses this
  categoryId String
  category TestCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  
  // Rule identification
  name String // "MCV Calculation", "INR Calculation"
  formula String // JavaScript/Math formula or reference
  
  // Inputs and outputs
  inputFields String[] // Field names needed
  outputField String // Where result goes
  unit String // Result unit
  
  // Formula example:
  // (hematocrit * 10) / erythrocytes
  // (pt_patient / pt_control) * isi
  
  isActive Boolean @default(true)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// ========== DELTA CHECKING ==========

model DeltaCheckRule {
  id String @id @default(cuid())
  
  testDefinitionId String
  testDefinition TestDefinition @relation("DeltaCheck", fields: [testDefinitionId], references: [id], onDelete: Cascade)
  
  // Delta check parameters
  deltaPercentage Float? // Percentage change threshold (e.g., 20%)
  deltaAbsolute Float? // Absolute value change (e.g., 2.0)
  
  // Time window
  hoursWindow Int @default(24) // Hours to look back
  
  // Action
  requiresReview Boolean @default(true)
  alertSeverity String @default("WARN") // INFO, WARN, CRITICAL
  
  isActive Boolean @default(true)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([testDefinitionId])
}

// ========== REFLEX TESTING ==========

model ReflexTestRule {
  id String @id @default(cuid())
  
  // Trigger test
  triggerTestId String
  triggerTest TestDefinition @relation("TriggerTest", fields: [triggerTestId], references: [id], onDelete: Cascade)
  
  // Reflex test to order
  reflexTestId String
  reflexTest TestDefinition @relation("ReflexTest", fields: [reflexTestId], references: [id], onDelete: Cascade)
  
  // Condition
  condition String // JSON: {"field": "value", "operator": ">", "threshold": 100}
  
  // Automatic or manual
  isAutomatic Boolean @default(false)
  requiresApproval Boolean @default(true)
  
  isActive Boolean @default(true)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([triggerTestId, reflexTestId])
  @@index([triggerTestId])
}

model TestCategory {
  id String @id @default(cuid())
  // ... existing fields ...
  deltaCheckRules DeltaCheckRule[]
  reflexTestRulesAsTrigger ReflexTestRule[] @relation("TriggerTest")
  reflexTestRulesAsReflex ReflexTestRule[] @relation("ReflexTest")
  calculationRules CalculationRule[]
}

model TestDefinition {
  id String @id @default(cuid())
  // ... existing fields ...
  deltaCheckRules DeltaCheckRule[]
  reflexTestRulesAsTrigger ReflexTestRule[] @relation("TriggerTest")
  reflexTestRulesAsReflex ReflexTestRule[] @relation("ReflexTest")
}
```

### B. Enhanced Email System Schema

```prisma
// ========== EMAIL SYSTEM ==========

model EmailTemplate {
  id String @id @default(cuid())
  
  // Template identification
  name String // "Payment Confirmation", "Test Results"
  code String @unique // EMAIL_PAYMENT_CONF, EMAIL_RESULTS
  description String?
  
  // Template content (HTML)
  htmlTemplate String // Full HTML template
  
  // Variables that can be used
  variables Json // ["patientName", "invoiceNumber", "totalAmount", "testResults"]
  
  // Email configuration
  subject String // Email subject line
  fromName String // "RobotCom Lab"
  fromEmail String? // Sender (uses default if null)
  
  // Options
  includeAttachments Boolean @default(false)
  attachmentType String? // "PDF", "CSV", etc.
  
  // Status
  isActive Boolean @default(true)
  isDefault Boolean @default(false)
  
  // Relationships
  emailLogs EmailLog[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([code])
}

model EmailLog {
  id String @id @default(cuid())
  
  // What triggered the email
  invoiceId String?
  invoice Invoice? @relation(fields: [invoiceId], references: [id], onDelete: SetNull)
  
  testResultId String?
  testResult TestResult? @relation(fields: [testResultId], references: [id], onDelete: SetNull)
  
  // Email details
  templateId String
  template EmailTemplate @relation(fields: [templateId], references: [id])
  
  recipientEmail String
  recipientName String?
  
  // Content sent
  subject String
  htmlContent String
  attachmentPath String? // Path to attachment if sent
  
  // Status
  status String @default("pending") // pending, sent, failed, bounced
  sentAt DateTime?
  failureReason String?
  
  // Retry tracking
  attemptCount Int @default(0)
  lastAttemptAt DateTime?
  
  // User tracking
  sentBy String? // User ID who triggered
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([invoiceId])
  @@index([testResultId])
  @@index([status])
}

model EmailSetting {
  id String @id @default(cuid())
  
  // SMTP Configuration
  smtpHost String
  smtpPort Int
  smtpSecure Boolean @default(true) // TLS/SSL
  
  // Authentication
  smtpUser String
  smtpPassword String // Encrypted in production
  
  // Sender info
  fromEmail String
  fromName String
  
  // Features
  enablePaymentConfirmation Boolean @default(true)
  enableResultsDelivery Boolean @default(true)
  enableAutomaticPaymentEmail Boolean @default(true)
  
  // Retry policy
  maxRetries Int @default(3)
  retryIntervalMinutes Int @default(30)
  
  // Rate limiting
  dailyLimit Int? // Max emails per day
  
  // Logging
  logEmailContent Boolean @default(false) // For debugging
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Invoice {
  id String @id @default(cuid())
  // ... existing fields ...
  emailLogs EmailLog[]
}
```

### C. Sample Schema Enhancement

```prisma
model Sample {
  id String @id @default(cuid())
  // ... existing fields ...
  
  // Add fields for automation
  testResults TestResult[] // Relationships to results
  
  // Track what's been automated
  resultsEmailSent Boolean @default(false)
  resultsEmailSentAt DateTime?
  resultsEmailRecipient String?
}
```

---

## 2. BACKEND SERVICES

### A. Clinical Calculation Service

**File:** `packages/robotcom-lims/src/main/services/CalculationEngine.ts`

**Purpose:** Auto-calculate all clinical indices based on test type

```typescript
// Key Calculations Needed:

// HEMATOLOGY INDICES
- MCV (Mean Corpuscular Volume) = (Hematocrit × 10) / RBC count
- MCH (Mean Corpuscular Hemoglobin) = (Hemoglobin × 10) / RBC count
- MCHC = (Hemoglobin / Hematocrit) × 100
- RDW = Standard Deviation / Mean RBC × 100

// CHEMISTRY CALCULATIONS
- AST/ALT Ratio
- Albumin/Total Protein Ratio
- BUN/Creatinine Ratio
- Corrected Calcium
- LDL = Total Cholesterol - HDL - (Triglycerides / 5)
- Anion Gap = Na - (Cl + HCO3)

// COAGULATION CALCULATIONS
- INR = (PT patient / PT control) × ISI
- PT Ratio = PT patient / PT control
- APPT Ratio

// SPERM ANALYSIS CALCULATIONS
- Total Sperm Count = Concentration × Volume
- Progressive Motility % = (Progressive cells / Total) × 100
- Rapid Progressive % = (Rapid cells / Total) × 100
- Slow Progressive % = (Slow cells / Total) × 100
- Non-Progressive % = (Non-progressive / Total) × 100
- Immotile % = (Immotile / Total) × 100
- Normal Morphology %
- Vitality % = (Live sperm / Total) × 100

// IMMUNOLOGY CALCULATIONS
- Antibody Titer = Last positive dilution
- Seropositivity = Positive/Negative determination
- Risk Score = Weighted calculation of markers

// URINALYSIS CALCULATIONS
- Crystal Count per Field Average
- Cell Count per Field Average

Methods to implement:
- calculateMCVIndex(hematocrit, rbcCount)
- calculateINR(ptPatient, ptControl, isi)
- calculateSpermMotility(counts)
- calculateChemistryRatios(values)
- validateCalculations(inputData, outputData)
```

### B. Result Interpretation Service

**File:** `packages/robotcom-lims/src/main/services/ResultInterpreter.ts`

**Purpose:** Auto-interpret results, flag abnormal/critical values

```typescript
// FEATURES:

1. Automatic Normal Range Selection
   - Select based on patient age
   - Select based on patient gender
   - Select based on pregnancy status
   - Select based on reference standard (WHO, CLSI)

2. Abnormality Detection
   - Compare value vs normal range
   - Flag LOW, HIGH, CRITICAL
   - Set isCritical flag
   - Determine severity level

3. Critical Value Detection
   - Check if panic value thresholds exceeded
   - Auto-generate critical alerts
   - Trigger escalation notification
   - Log for compliance

4. Result Interpretation Generation
   - Auto-generate clinical interpretation text
   - Examples:
     - Hemoglobin 8.5: "LOW - Possible anemia. Recommend review."
     - Glucose 450: "CRITICALLY HIGH - Hyperglycemic crisis possible."
     - INR 9.2: "CRITICAL - High bleeding risk. Urgent physician contact."

5. Contextual Interpretation
   - Consider patient history
   - Consider concurrent medications
   - Consider recent changes (delta checking)
   - Consider related test results

Methods:
- getNormalRange(testId, patientAge, patientGender)
- isAbnormal(value, normalRange)
- isCritical(value, criticalThresholds)
- generateInterpretation(testResult, context)
- getActionRequired(severity)
```

### C. Delta Check Service

**File:** `packages/robotcom-lims/src/main/services/DeltaCheckEngine.ts`

**Purpose:** Compare with previous results, detect suspicious patterns

```typescript
// FEATURES:

1. Previous Result Retrieval
   - Get last result for same test
   - Filter by time window (e.g., last 24 hours)
   - Handle missing previous results

2. Delta Calculation
   - Percentage change: ((new - old) / old) × 100
   - Absolute change: new - old
   - Rate of change over time

3. Anomaly Detection
   - Flag if change > threshold (e.g., 20%)
   - Flag if direction opposite to treatment
   - Flag if critical value reached suddenly

4. Alert Generation
   - Generate review alerts
   - Auto-escalate if critical
   - Notify technician/physician

Methods:
- getPreviousResult(testId, timeWindowHours)
- calculateDelta(newValue, oldValue)
- isAnomalousChange(delta, threshold)
- generateDeltaAlert(currentResult, previousResult)
```

### D. Reflex Testing Service

**File:** `packages/robotcom-lims/src/main/services/ReflexTestingEngine.ts`

**Purpose:** Auto-order additional tests based on initial results

```typescript
// FEATURES:

1. Rule Evaluation
   - Evaluate reflex test triggers
   - Check if conditions met
   - Handle multiple triggers

2. Automatic Test Ordering
   - Auto-create new test orders
   - Link to original sample
   - Set priority

3. Approval Workflow
   - Route to supervisor if required
   - Email notifications
   - Track approvals

4. Tracking
   - Log reflex tests ordered
   - Track completion
   - Link to trigger test

Methods:
- evaluateReflexRules(testResult)
- shouldOrderReflexTest(trigger, result)
- createReflexTestOrder(testId, sampleId)
- getReflexTestsNeeded(testResults)
```

### E. Enhanced Email Service

**File:** `packages/robotcom-lims/src/main/services/EmailService.ts` (MAJOR OVERHAUL)

**Current Issues:**
- ❌ Outdated CDO/SMTP approach
- ❌ No template support
- ❌ Limited customization
- ❌ No retry mechanism
- ❌ No attachment flexibility

**New Implementation:**

```typescript
// FEATURES:

1. Template Engine
   - Load HTML templates from database
   - Variable substitution ({{patientName}}, {{invoiceNumber}})
   - Conditional sections ({{#if isCritical}}...{{/if}})
   - Loop support for result tables

2. Dynamic Attachment Generation
   - Generate PDF from test results
   - Generate CSV export
   - Generate invoice PDF
   - Generate test report
   - Support multiple attachments per email

3. Professional HTML Emails
   - Modern, responsive design
   - Lab branding
   - Contact information
   - Payment links (for later El Salvador API)
   - Patient portal links

4. Retry & Delivery Tracking
   - Automatic retry on failure
   - Exponential backoff
   - Track delivery status
   - Log failures for analysis
   - Bounce handling

5. Compliance & Audit
   - Log all sent emails
   - Track recipients
   - Store email content
   - Timestamp proof of delivery
   - HIPAA logging considerations

6. Advanced Features
   - Bulk email sending
   - Scheduled sends
   - Unsubscribe support
   - Delivery confirmation
   - Read receipts (optional)

Methods:
- loadTemplate(templateCode)
- compileTemplate(template, variables)
- generatePDFAttachment(testResults)
- generateInvoicePDF(invoice)
- sendEmail(recipient, templateCode, variables, attachments)
- sendBulkEmail(recipients, templateCode, variables)
- getEmailStatus(emailId)
- retryFailedEmails()
```

### F. Payment Integration Service

**File:** `packages/robotcom-lims/src/main/services/PaymentService.ts` (NEW)

**Purpose:** Handle payment processing and automated email triggers

```typescript
// FEATURES:

1. Payment Processing
   - Record payment received
   - Update invoice status
   - Calculate change/refund
   - Track payment method

2. Automatic Email Triggers
   - Detect payment completion
   - Auto-send payment confirmation email
   - Include invoice details
   - Include receipt

3. Email Content Options
   - Payment confirmation
   - Receipt/invoice PDF
   - Tax receipt (if applicable)
   - Payment method details
   - Next steps (when results ready)

4. Audit Trail
   - Log all payments
   - Log all emails sent
   - Track who processed payment
   - Timestamp everything

Methods:
- recordPayment(invoiceId, amount, method)
- processPayment(invoiceId, paymentData)
- triggerPaymentConfirmationEmail(invoiceId)
- generatePaymentReceipt(invoiceId)
- getPaymentHistory(invoiceId)
```

### G. Quality Control Service

**File:** `packages/robotcom-lims/src/main/services/QualityControlEngine.ts` (NEW)

**Purpose:** Implement QC rules and validations

```typescript
// FEATURES:

1. Result Validation
   - Data type validation
   - Range validation
   - Format validation
   - Mandatory field checks

2. Duplicate Detection
   - Detect duplicate tests for same patient/sample
   - Flag for review
   - Prevent accidental duplicates

3. Quality Rules
   - Check calculation accuracy
   - Check internal consistency
   - Check medical logic
   - Check trending

4. Report Generation
   - Daily QC reports
   - Error logs
   - Validation failure logs
   - Trending analysis

Methods:
- validateResultData(testResult)
- checkForDuplicates(testId, patientId)
- applyQCRules(testResult)
- generateQCReport(dateRange)
```

### H. Bulk Import/Export Service

**File:** `packages/robotcom-lims/src/main/services/BulkDataService.ts` (NEW)

**Purpose:** Import FoxPro data, export for integration

```typescript
// FEATURES:

1. FoxPro Data Import
   - Import historical test definitions
   - Import historical patient data
   - Import historical results
   - Map FoxPro codes to new system

2. Data Export
   - Export test results (CSV, JSON, XML)
   - Export for integration APIs
   - Export for reporting
   - Export for backup

3. Data Mapping
   - Map test categories
   - Map field definitions
   - Map normal ranges
   - Handle data conversions

Methods:
- importTestDefinitions(foxProData)
- importHistoricalResults(foxProData)
- exportResults(format, dateRange)
- mapFoxProCode(code)
```

---

## 3. FRONTEND COMPONENTS

### A. Test Data Entry Forms (MAJOR EXPANSION)

**Location:** `packages/robotcom-lims/src/renderer/presentation/components/TestForms/`

**Components Needed (one per category):**

1. **ChemistryTestForm.tsx**
   - Dynamic field entry for all chemistry analytes
   - Unit selection
   - Auto-calculation of indices
   - Real-time validation
   - Normal range display
   - Abnormality flags display

2. **HematologyTestForm.tsx**
   - Hemoglobin, Hematocrit, RBC entry
   - WBC differential fields
   - Auto-calculation of MCV, MCH, MCHC
   - Blood smear observations
   - Real-time index calculation display

3. **UrinalysisTestForm.tsx**
   - Per-field microscopy entry
   - Crystal type selection
   - Cell counting
   - Bacteria/organisms
   - Chemistry results (dipstick)

4. **BacteriologyTestForm.tsx**
   - Organism identification
   - Culture type
   - Sensitivity results (AST)
   - Comments field

5. **CoagulationTestForm.tsx**
   - PT, PTT, Thrombin time entry
   - ISI input
   - Auto-calculation of INR
   - Control values
   - Result interpretation

6. **PregnancyTestForm.tsx**
   - hCG values
   - Qualitative/Quantitative
   - Week calculation if available

7. **SpermAnalysisTestForm.tsx**
   - Volume, concentration, count entry
   - Motility percentages
   - Morphology assessment
   - Vitality
   - Auto-calculation of WHO classifications

8. **ImmunologyTestForm.tsx**
   - Antibody/antigen selection
   - Titer values
   - Positive/Negative results
   - Interpretation text

9. **TumorMarkerTestForm.tsx**
   - Marker selection
   - Numeric values
   - Units
   - Reference ranges

10. **BloodTypingForm.tsx**
    - ABO group selection
    - Rh factor
    - Coombs test results
    - Antibody screen

**Features for All Forms:**
- ✅ Real-time calculation display
- ✅ Auto-fill from previous results (optional)
- ✅ Normal range highlighting
- ✅ Abnormality warnings
- ✅ Reflex test indicators
- ✅ Comments/notes field
- ✅ Technician signature
- ✅ Save/Cancel buttons
- ✅ Validation error messages

### B. Result Review/Approval Component

**File:** `packages/robotcom-lims/src/renderer/presentation/components/ResultReview/ResultReviewPanel.tsx`

**Features:**
- Display calculated values
- Show interpretation text
- Flag abnormal/critical values
- Show previous results (delta check)
- Show recommended reflex tests
- Approve/reject options
- Add final comments
- Digital signature

### C. Email Management Interface

**Location:** `packages/robotcom-lims/src/renderer/presentation/components/EmailManagement/`

**Components:**

1. **EmailTemplateManager.tsx**
   - List all email templates
   - Create new template
   - Edit existing templates
   - Preview templates
   - Test send
   - Track usage

2. **EmailHistoryViewer.tsx**
   - View all sent emails
   - Search/filter by date, recipient
   - View email content
   - Resend if needed
   - Track delivery status

3. **EmailSendPanel.tsx**
   - Select template
   - Choose recipient(s)
   - Preview email
   - Attach files if needed
   - Send button
   - Confirmation

4. **EmailSettingsPanel.tsx**
   - SMTP configuration
   - From address/name
   - Enable/disable features
   - Rate limiting
   - Retry settings
   - Logging options

5. **ResultEmailWizard.tsx**
   - Step 1: Select results to send
   - Step 2: Choose template/customize
   - Step 3: Select recipients
   - Step 4: Review/Send
   - Step 5: Confirmation

6. **PaymentEmailTrigger.tsx**
   - Display when payment is being recorded
   - Auto-generate payment confirmation email
   - Option to customize message
   - Preview
   - Send confirmation

### D. Clinical Dashboard

**File:** `packages/robotcom-lims/src/renderer/presentation/pages/ClinicalDashboard.tsx`

**Features:**
- Display pending results
- Show critical values (highlighted)
- Show reflex tests pending approval
- Show delta check alerts
- Show quality control issues
- Quick action buttons
- Filter by status/severity

### E. Report Generation & Preview

**Location:** `packages/robotcom-lims/src/renderer/presentation/components/Reports/`

**Components:**

1. **ReportPreview.tsx**
   - Display formatted report
   - Show all calculations
   - Show interpretations
   - Professional formatting
   - Lab header/footer

2. **ReportPDFGenerator.tsx**
   - Generate professional PDF
   - Include all calculated values
   - Include interpretations
   - Include normal ranges
   - Technician signature
   - Physician sign-off space

3. **ReportEmailAttachment.tsx**
   - Generate email-friendly PDF
   - Simplified layout
   - Patient-friendly language
   - Include next steps

### F. Calculation Display Component

**File:** `packages/robotcom-lims/src/renderer/presentation/components/CalculationDisplay.tsx`

**Features:**
- Real-time calculation preview
- Show calculation formula (optional)
- Display unit conversions
- Show abnormality flags
- Color-coding (Normal/Warning/Critical)

---

## 4. EMAIL SYSTEM OVERHAUL

### Current State (FoxPro)
- ❌ Uses outdated CDO.Message
- ❌ Hardcoded credentials
- ❌ No templates
- ❌ Limited customization
- ❌ No retry mechanism
- ❌ No delivery tracking

### New Architecture

#### A. Email Template System

**Database Templates:**

1. **Payment Confirmation Email**
   - Patient name
   - Invoice number
   - Amount paid
   - Payment date
   - Receipt number
   - Thank you message
   - Next steps (when results ready)
   - Lab contact info

2. **Test Results Email**
   - Patient name
   - Test results table
   - All calculated values
   - Interpretations
   - Critical value warnings
   - Normal ranges
   - Physician recommendations
   - Follow-up instructions
   - PDF attachment

3. **Critical Result Alert Email**
   - Patient name
   - Critical value details
   - Immediate action needed
   - Physician contact info
   - Lab contact
   - Timestamp

4. **Invoice/Bill Email**
   - Invoice number
   - Patient name
   - Itemized charges
   - Total amount
   - Payment due date
   - Payment instructions
   - PDF invoice attachment

5. **Appointment Reminder Email** (Future)
   - Patient name
   - Test name
   - Date/Time
   - Location
   - Preparation instructions
   - Contact to reschedule

#### B. Email Options for Users

**When Results Complete:**
- [ ] Send results email to patient
- [ ] Select template
- [ ] Choose attachments (PDF, CSV)
- [ ] Customize message
- [ ] Add notes

**When Payment Recorded:**
- [ ] Auto-send payment confirmation (if enabled)
- [ ] Or manually trigger from button
- [ ] Include receipt
- [ ] Include next steps

**Additional Send Options:**
- [ ] Send to multiple recipients (patient + family)
- [ ] Send to physician for review
- [ ] Send to patient portal link
- [ ] Schedule send for later
- [ ] Request delivery confirmation

#### C. HTML Email Templates

**Structure:**
```html
<!-- Professional header with lab logo -->
<!-- Patient/recipient info -->
<!-- Dynamic content based on template type -->
<!-- Result table with formatting -->
<!-- Calculated values displayed -->
<!-- Interpretation text -->
<!-- Critical value warnings -->
<!-- Attachment notice -->
<!-- Lab footer with contact -->
<!-- Legal/privacy disclaimer -->
```

**Design Considerations:**
- Responsive (mobile-friendly)
- Professional lab branding
- Color-coded results (Normal/Warning/Critical)
- Easy to print
- Clear typography
- Accessibility compliant

#### D. Automatic Email Triggers

**Payment Completion:**
```
1. Payment recorded in Invoice
2. Email service detects status change
3. Load EmailTemplate for "Payment Confirmation"
4. Compile variables (patient name, amount, etc.)
5. Generate receipt PDF
6. Send email with attachment
7. Log email sent
8. Handle bounce/failures with retry
```

**Results Completion:**
```
1. All test results entered
2. Results approved/finalized
3. User clicks "Send Results" button
4. Wizard opens:
   - Select template
   - Review content
   - Choose recipients
   - Confirm attachments
5. Send email
6. Log email sent
7. Update Sample.resultsEmailSent flag
```

**Critical Value:**
```
1. Result marked as critical
2. System generates alert email
3. Send to physician (immediately)
4. Send to supervisor (immediately)
5. Log timestamp for compliance
6. Flag in system for audit trail
```

### Email Content Options

**What Can Be Sent:**
- ✅ Test results with interpretations
- ✅ Calculated values (MCV, MCH, INR, etc.)
- ✅ Normal ranges (patient's age/gender specific)
- ✅ Critical value warnings
- ✅ Abnormality flags
- ✅ Recommendations for follow-up
- ✅ PDF invoice/receipt
- ✅ PDF test report
- ✅ CSV result export
- ✅ Patient-friendly interpretation
- ✅ Physician-level details
- ✅ Lab accreditation/certification info
- ✅ Contact information
- ✅ Patient portal link (future)
- ✅ Payment links (future - El Salvador API)

**What Should NOT Be Sent (Privacy):**
- ❌ Full patient medical history (send only relevant tests)
- ❌ Other patients' results
- ❌ System credentials
- ❌ Sensitive personal information beyond needed

---

## 5. CLINICAL CALCULATION ENGINE

### Hematology Calculations

```typescript
// COMPLETE HEMATOLOGY INDEX CALCULATION

type HematologyData = {
  erythrocytes: number; // RBC (millions/µL)
  hematocrit: number; // (%)
  hemoglobin: number; // (g/dL)
  leucocytes: number; // WBC (thousands/µL)
  platelets: number; // (thousands/µL)
};

type HematologyCalculations = {
  mcv: number; // Mean Corpuscular Volume (fL)
  mch: number; // Mean Corpuscular Hemoglobin (pg)
  mchc: number; // MCH Concentration (g/dL)
  rdw: number; // Red Cell Distribution Width (%)
};

// MCV = (Hematocrit × 10) / RBC count
const calculateMCV = (hematocrit: number, rbc: number): number => {
  return (hematocrit * 10) / rbc;
};

// MCH = (Hemoglobin × 10) / RBC count
const calculateMCH = (hemoglobin: number, rbc: number): number => {
  return (hemoglobin * 10) / rbc;
};

// MCHC = (Hemoglobin / Hematocrit) × 100
const calculateMCHC = (hemoglobin: number, hematocrit: number): number => {
  return (hemoglobin / hematocrit) * 100;
};

// RDW requires cell size distribution data (more complex)
const calculateRDW = (meanCellVolume: number, stdDeviation: number): number => {
  return (stdDeviation / meanCellVolume) * 100;
};

// ALL RESULTS IN STANDARDIZED FORMAT
const calculateHematologyIndices = (data: HematologyData): HematologyCalculations => {
  return {
    mcv: calculateMCV(data.hematocrit, data.erythrocytes),
    mch: calculateMCH(data.hemoglobin, data.erythrocytes),
    mchc: calculateMCHC(data.hemoglobin, data.hematocrit),
    rdw: 0, // Requires additional data
  };
};
```

### Chemistry Calculations

```typescript
// LIPID PANEL CALCULATION
type LipidData = {
  totalCholesterol: number; // mg/dL
  hdl: number; // HDL (mg/dL)
  triglycerides: number; // (mg/dL)
};

type LipidCalculations = {
  ldl: number; // Calculated LDL
  vldl: number; // Very low density
  cholesterolRatio: number;
};

// LDL = Total Cholesterol - HDL - (Triglycerides / 5)
const calculateLDL = (
  totalChol: number,
  hdl: number,
  triglycerides: number
): number => {
  return totalChol - hdl - triglycerides / 5;
};

// LIVER FUNCTION RATIOS
type LiverData = {
  ast: number; // Aspartate aminotransferase (U/L)
  alt: number; // Alanine aminotransferase (U/L)
  totalBilirubin: number; // (mg/dL)
};

type LiverCalculations = {
  astAltRatio: number;
  bilirubin2albumin: number;
};

const calculateASTALTRatio = (ast: number, alt: number): number => {
  return alt > 0 ? ast / alt : 0;
};

// KIDNEY FUNCTION RATIO
type KidneyData = {
  bun: number; // Blood urea nitrogen (mg/dL)
  creatinine: number; // (mg/dL)
};

const calculateBUNCr = (bun: number, creatinine: number): number => {
  return creatinine > 0 ? bun / creatinine : 0;
};

// ELECTROLYTE BALANCE
type ElectrolyteData = {
  sodium: number;
  chloride: number;
  bicarbonate: number;
};

const calculateAnionGap = (
  sodium: number,
  chloride: number,
  bicarbonate: number
): number => {
  return sodium - (chloride + bicarbonate);
};

// GLUCOSE CONTROL (if HbA1c available)
type GlucoseData = {
  fastingGlucose: number; // mg/dL
  hba1c?: number; // % or mmol/mol
};

const estimateAverageGlucose = (hba1c: number): number => {
  // Formula: (28.7 × HbA1c) - 46.7
  return 28.7 * hba1c - 46.7;
};
```

### Coagulation Calculations

```typescript
// INR CALCULATION (Most Critical)
type CoagulationData = {
  ptPatient: number; // Patient PT (seconds)
  ptControl: number; // Control PT (seconds)
  isi: number; // International Sensitivity Index
};

type CoagulationCalculations = {
  inr: number;
  ptRatio: number;
};

// INR = (PT patient / PT control) ^ ISI
const calculateINR = (
  ptPatient: number,
  ptControl: number,
  isi: number
): number => {
  if (ptControl === 0) return 0;
  const ratio = ptPatient / ptControl;
  return Math.pow(ratio, isi);
};

// APTT RATIO
type ApttData = {
  apptPatient: number; // Patient APPT (seconds)
  apptControl: number; // Normal APPT (seconds)
};

const calculateAPTTRatio = (apptPatient: number, apptControl: number): number => {
  return apptControl > 0 ? apptPatient / apptControl : 0;
};
```

### Sperm Analysis Calculations

```typescript
// WHO 5th Edition Classifications
type SpermData = {
  volume: number; // mL
  concentration: number; // million/mL
  progressiveMotility: number; // %
  nonprogressiveMotility: number; // %
  immotility: number; // %
  normalMorphology: number; // %
  vitality: number; // % live
};

type SpermCalculations = {
  totalSpermCount: number;
  fertility: string; // "Fertile" | "Subfertile" | "Infertile"
  abnormalities: string[];
};

const calculateTotalSpermCount = (
  volume: number,
  concentration: number
): number => {
  return volume * concentration;
};

const classifyFertility = (data: SpermData): string => {
  const criteria = {
    volume: data.volume >= 1.4,
    concentration: data.concentration >= 15,
    totalCount: calculateTotalSpermCount(data.volume, data.concentration) >= 39,
    progressiveMotility: data.progressiveMotility >= 32,
    normalMorphology: data.normalMorphology >= 4,
    vitality: data.vitality >= 54,
  };

  if (Object.values(criteria).every(v => v)) return "Fertile";
  if (Object.values(criteria).filter(v => v).length >= 4) return "Subfertile";
  return "Infertile";
};
```

### Immunology/Serology Calculations

```typescript
// ANTIBODY TITER CALCULATION
type TiterData = {
  dilutions: number[];
  lastPositive: number; // Index of last positive dilution
};

const calculateTiter = (lastPositiveDilution: number): number => {
  // Titer is inverse of dilution
  return Math.pow(2, lastPositiveDilution);
};

// RISK SCORE CALCULATION (Multiple markers)
type RiskMarkers = {
  markers: { name: string; value: number; weight: number }[];
};

const calculateRiskScore = (markers: RiskMarkers): number => {
  return markers.markers.reduce((total, marker) => {
    return total + marker.value * marker.weight;
  }, 0);
};
```

---

## 6. API INTEGRATION (El Salvador)

### A. Payment Processing API Integration

**Future Implementation (Placeholder Structure):**

```typescript
// Location: packages/robotcom-lims/src/main/services/PaymentGatewayService.ts

interface PaymentProvider {
  processPayment(invoice: Invoice): Promise<PaymentResult>;
  getTransactionStatus(transactionId: string): Promise<TransactionStatus>;
  refundPayment(transactionId: string, amount: number): Promise<RefundResult>;
}

// El Salvador provider would implement this interface
class ElSalvadorPaymentGateway implements PaymentProvider {
  private apiKey: string;
  private apiUrl: string;

  async processPayment(invoice: Invoice): Promise<PaymentResult> {
    // 1. Format invoice data for El Salvador API
    // 2. Call payment gateway API
    // 3. Handle response
    // 4. Update invoice status
    // 5. Trigger email confirmation
    // 6. Log transaction
  }

  async getTransactionStatus(transactionId: string): Promise<TransactionStatus> {
    // Check payment status with API
  }

  async refundPayment(transactionId: string, amount: number): Promise<RefundResult> {
    // Process refund through API
  }
}

// Email would auto-trigger on successful payment:
async onPaymentSuccess(invoice: Invoice) {
  // 1. Update invoice status to "PAID"
  // 2. Trigger payment confirmation email
  // 3. Log transaction
  // 4. Update invoice.paidAt timestamp
}
```

### B. Result Delivery API (Future)

```typescript
// Send results to patient portal or external system
interface ResultDeliveryAPI {
  deliverResults(patient: Patient, testResults: TestResult[]): Promise<void>;
  notifyPatient(patient: Patient, message: string): Promise<void>;
}
```

---

## 7. IMPLEMENTATION TIMELINE

### Phase 1: Database & Core Backend (Weeks 1-3)

**Week 1:**
- [ ] Create Prisma schema additions (TestCategory, TestDefinition, NormalRange, etc.)
- [ ] Run database migration
- [ ] Seed test definitions from FoxPro data
- [ ] Create CalculationEngine service

**Week 2:**
- [ ] Create ResultInterpreter service
- [ ] Create DeltaCheckEngine service
- [ ] Create ReflexTestingEngine service
- [ ] Create QualityControlEngine service

**Week 3:**
- [ ] Create EmailTemplate model and CRUD
- [ ] Overhaul EmailService with new architecture
- [ ] Create EmailLog tracking
- [ ] Create PaymentService

### Phase 2: Frontend Components (Weeks 4-6)

**Week 4:**
- [ ] Create base test form component template
- [ ] Create ChemistryTestForm with calculations
- [ ] Create HematologyTestForm with indices
- [ ] Create UrinalysisTestForm

**Week 5:**
- [ ] Create remaining test forms (Coagulation, Sperm, Immunology)
- [ ] Create ResultReviewPanel component
- [ ] Create CalculationDisplay component
- [ ] Integrate with existing ResultService

**Week 6:**
- [ ] Create EmailManagement UI components
- [ ] Create EmailTemplateManager
- [ ] Create EmailHistoryViewer
- [ ] Create ResultEmailWizard

### Phase 3: Integration & Testing (Weeks 7-8)

**Week 7:**
- [ ] Integrate calculation engine with forms
- [ ] Integrate result interpreter with results
- [ ] Integrate email triggers with payments
- [ ] Create ClinicalDashboard

**Week 8:**
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Security review
- [ ] User acceptance testing

### Phase 4: Advanced Features (Weeks 9-10)

**Week 9:**
- [ ] Bulk email sending
- [ ] Scheduled emails
- [ ] Email retry mechanism
- [ ] Advanced reporting

**Week 10:**
- [ ] Mobile optimization
- [ ] Patient portal links (preparation)
- [ ] API integration framework (El Salvador)
- [ ] Documentation

---

## 8. TESTING STRATEGY

### A. Unit Tests

**For Each Service:**
- CalculationEngine: Test all formulas with known values
- ResultInterpreter: Test abnormality detection
- DeltaCheckEngine: Test delta calculations
- EmailService: Test template rendering, variable substitution
- PaymentService: Test payment recording and email triggering

**Example Test:**
```typescript
describe('CalculationEngine', () => {
  it('should calculate MCV correctly', () => {
    const result = calculateMCV(45, 5);
    expect(result).toBeCloseTo(90, 1); // Normal MCV
  });

  it('should calculate INR correctly', () => {
    const inr = calculateINR(18, 12, 1.1);
    expect(inr).toBeCloseTo(1.65, 2); // Within normal
  });
});
```

### B. Integration Tests

- Test full result entry → calculation → interpretation flow
- Test email generation from results
- Test payment → email trigger flow
- Test delta check detection

### C. Functional Tests

- User enters hematology results
- System auto-calculates indices
- System shows abnormality warnings
- System generates proper email
- Email sends successfully
- Patient receives email with correct content

### D. Data Validation Tests

- Test with FoxPro historical data
- Verify calculations match FoxPro
- Verify normal ranges match FoxPro
- Test edge cases (missing values, zero values)

### E. Performance Tests

- Test calculation speed (should be instant)
- Test email generation with 100+ recipients
- Test report PDF generation
- Test bulk import from FoxPro

---

## SUMMARY OF CHANGES

### Database
- [ ] Add 10+ new models for test management
- [ ] Add calculation and interpretation rules
- [ ] Add email templates and logging
- [ ] Migrate historical test data

### Backend Services (900+ lines of code)
- [ ] CalculationEngine.ts (150 lines)
- [ ] ResultInterpreter.ts (200 lines)
- [ ] DeltaCheckEngine.ts (100 lines)
- [ ] ReflexTestingEngine.ts (100 lines)
- [ ] EmailService rewrite (300 lines)
- [ ] PaymentService.ts (150 lines)
- [ ] QualityControlEngine.ts (100 lines)

### Frontend Components (1500+ lines of code)
- [ ] 10 test-specific forms (800 lines)
- [ ] Email management UI (400 lines)
- [ ] Result review/approval (150 lines)
- [ ] Clinical dashboard (150 lines)

### Total Effort: 10 weeks
### Lines of Code: ~2500+
### Database Changes: 10+ new models

---

## NEXT STEPS

1. **Review & Approve** this roadmap
2. **Start Phase 1** - Database schema updates
3. **Import FoxPro Data** - Load test definitions
4. **Build CalculationEngine** - Core calculations
5. **Create Test Forms** - Frontend components
6. **Implement Email** - Email system overhaul
7. **Testing & Validation** - Comprehensive testing
8. **Deploy & Launch** - Production ready

**Ready to begin implementation?**
