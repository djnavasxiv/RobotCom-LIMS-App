-- CreateTable
CREATE TABLE "Lab" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "logo" TEXT,
    "customText1" TEXT,
    "customText2" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "labId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_labId_fkey" FOREIGN KEY ("labId") REFERENCES "Lab" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "address" TEXT,
    "labId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Patient_labId_fkey" FOREIGN KEY ("labId") REFERENCES "Lab" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Test" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "category" TEXT,
    "normalRange" TEXT,
    "unit" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TestProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TestProfileItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    CONSTRAINT "TestProfileItem_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "TestProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TestProfileItem_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Sample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sampleNumber" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "profileId" TEXT,
    "collectionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Sample_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Sample_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "TestProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SampleTest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sampleId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "price" REAL NOT NULL,
    CONSTRAINT "SampleTest_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "Sample" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SampleTest_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sampleId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "testDefId" TEXT,
    "value" TEXT NOT NULL,
    "calculatedValues" TEXT,
    "isNormal" BOOLEAN NOT NULL DEFAULT true,
    "abnormalFlags" TEXT,
    "interpretationId" TEXT,
    "notes" TEXT,
    "enteredBy" TEXT,
    "enteredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Result_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "Sample" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Result_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Result_testDefId_fkey" FOREIGN KEY ("testDefId") REFERENCES "TestDefinition" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Result_interpretationId_fkey" FOREIGN KEY ("interpretationId") REFERENCES "InterpretationRule" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceNumber" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "sampleId" TEXT,
    "labId" TEXT NOT NULL,
    "subtotal" REAL NOT NULL,
    "tax" REAL NOT NULL DEFAULT 0,
    "discount" REAL NOT NULL DEFAULT 0,
    "total" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "dueDate" DATETIME,
    "paidDate" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Invoice_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invoice_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "Sample" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Invoice_labId_fkey" FOREIGN KEY ("labId") REFERENCES "Lab" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InvoiceItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" REAL NOT NULL,
    "total" REAL NOT NULL,
    CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Doctor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "specialty" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "commissionRate" REAL NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Commission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "doctorId" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "percentage" REAL NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paidDate" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Commission_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Commission_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "minQuantity" INTEGER NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL,
    "unitPrice" REAL,
    "supplier" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "StockAdjustment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reason" TEXT,
    "adjustedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StockAdjustment_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "License" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "licenseKey" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "subscriptionType" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "activatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "lastCheckAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gracePeriodEnds" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT,
    "entityId" TEXT,
    "oldValues" TEXT,
    "newValues" TEXT,
    "ipAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TestCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TestDefinition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "testId" TEXT,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "unit" TEXT,
    "sampleType" TEXT,
    "testFields" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TestDefinition_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TestDefinition_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TestCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NormalRange" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "testDefId" TEXT NOT NULL,
    "minAge" INTEGER,
    "maxAge" INTEGER,
    "gender" TEXT,
    "minValue" REAL NOT NULL,
    "maxValue" REAL NOT NULL,
    "criticalLow" REAL,
    "criticalHigh" REAL,
    "unit" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "NormalRange_testDefId_fkey" FOREIGN KEY ("testDefId") REFERENCES "TestDefinition" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CalculationRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "testDefId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "formula" TEXT NOT NULL,
    "requiredFields" TEXT NOT NULL,
    "outputField" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CalculationRule_testDefId_fkey" FOREIGN KEY ("testDefId") REFERENCES "TestDefinition" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InterpretationRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "testDefId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "interpretation" TEXT NOT NULL,
    "severity" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InterpretationRule_testDefId_fkey" FOREIGN KEY ("testDefId") REFERENCES "TestDefinition" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DeltaCheckRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "testDefId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alertThreshold" REAL NOT NULL,
    "criticalThreshold" REAL,
    "checkDays" INTEGER NOT NULL DEFAULT 30,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DeltaCheckRule_testDefId_fkey" FOREIGN KEY ("testDefId") REFERENCES "TestDefinition" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReflexTestRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parentTestDefId" TEXT NOT NULL,
    "childTestDefId" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ReflexTestRule_parentTestDefId_fkey" FOREIGN KEY ("parentTestDefId") REFERENCES "TestDefinition" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReflexTestRule_childTestDefId_fkey" FOREIGN KEY ("childTestDefId") REFERENCES "TestDefinition" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DeltaCheckResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "resultId" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "previousValue" REAL,
    "currentValue" REAL NOT NULL,
    "changePercent" REAL NOT NULL,
    "previousDate" DATETIME,
    "alertMessage" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'INFO',
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DeltaCheckResult_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DeltaCheckResult_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "DeltaCheckRule" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmailTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "htmlContent" TEXT NOT NULL,
    "plainTextContent" TEXT,
    "templateType" TEXT NOT NULL,
    "requiredVariables" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "templateId" TEXT,
    "resultId" TEXT,
    "sampleId" TEXT,
    "invoiceId" TEXT,
    "recipientEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "sentAt" DATETIME,
    "failureReason" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "nextRetryAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EmailLog_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "EmailTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "EmailLog_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "EmailLog_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "Sample" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "EmailLog_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmailSetting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "isEncrypted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_labId_idx" ON "User"("labId");

-- CreateIndex
CREATE INDEX "Patient_labId_idx" ON "Patient"("labId");

-- CreateIndex
CREATE INDEX "Patient_phone_idx" ON "Patient"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Test_code_key" ON "Test"("code");

-- CreateIndex
CREATE INDEX "Test_code_idx" ON "Test"("code");

-- CreateIndex
CREATE INDEX "TestProfileItem_profileId_idx" ON "TestProfileItem"("profileId");

-- CreateIndex
CREATE INDEX "TestProfileItem_testId_idx" ON "TestProfileItem"("testId");

-- CreateIndex
CREATE UNIQUE INDEX "TestProfileItem_profileId_testId_key" ON "TestProfileItem"("profileId", "testId");

-- CreateIndex
CREATE UNIQUE INDEX "Sample_sampleNumber_key" ON "Sample"("sampleNumber");

-- CreateIndex
CREATE INDEX "Sample_patientId_idx" ON "Sample"("patientId");

-- CreateIndex
CREATE INDEX "Sample_sampleNumber_idx" ON "Sample"("sampleNumber");

-- CreateIndex
CREATE INDEX "SampleTest_sampleId_idx" ON "SampleTest"("sampleId");

-- CreateIndex
CREATE INDEX "SampleTest_testId_idx" ON "SampleTest"("testId");

-- CreateIndex
CREATE UNIQUE INDEX "SampleTest_sampleId_testId_key" ON "SampleTest"("sampleId", "testId");

-- CreateIndex
CREATE INDEX "Result_sampleId_idx" ON "Result"("sampleId");

-- CreateIndex
CREATE INDEX "Result_testDefId_idx" ON "Result"("testDefId");

-- CreateIndex
CREATE INDEX "Result_interpretationId_idx" ON "Result"("interpretationId");

-- CreateIndex
CREATE UNIQUE INDEX "Result_sampleId_testId_key" ON "Result"("sampleId", "testId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_sampleId_key" ON "Invoice"("sampleId");

-- CreateIndex
CREATE INDEX "Invoice_patientId_idx" ON "Invoice"("patientId");

-- CreateIndex
CREATE INDEX "Invoice_labId_idx" ON "Invoice"("labId");

-- CreateIndex
CREATE INDEX "Invoice_invoiceNumber_idx" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE INDEX "InvoiceItem_invoiceId_idx" ON "InvoiceItem"("invoiceId");

-- CreateIndex
CREATE INDEX "Doctor_email_idx" ON "Doctor"("email");

-- CreateIndex
CREATE INDEX "Commission_doctorId_idx" ON "Commission"("doctorId");

-- CreateIndex
CREATE INDEX "Commission_invoiceId_idx" ON "Commission"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryItem_code_key" ON "InventoryItem"("code");

-- CreateIndex
CREATE INDEX "InventoryItem_code_idx" ON "InventoryItem"("code");

-- CreateIndex
CREATE INDEX "StockAdjustment_itemId_idx" ON "StockAdjustment"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "License_licenseKey_key" ON "License"("licenseKey");

-- CreateIndex
CREATE UNIQUE INDEX "License_machineId_key" ON "License"("machineId");

-- CreateIndex
CREATE INDEX "License_licenseKey_idx" ON "License"("licenseKey");

-- CreateIndex
CREATE INDEX "License_machineId_idx" ON "License"("machineId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key");

-- CreateIndex
CREATE INDEX "Setting_key_idx" ON "Setting"("key");

-- CreateIndex
CREATE UNIQUE INDEX "TestCategory_name_key" ON "TestCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TestCategory_code_key" ON "TestCategory"("code");

-- CreateIndex
CREATE INDEX "TestCategory_code_idx" ON "TestCategory"("code");

-- CreateIndex
CREATE INDEX "TestDefinition_categoryId_idx" ON "TestDefinition"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "TestDefinition_code_categoryId_key" ON "TestDefinition"("code", "categoryId");

-- CreateIndex
CREATE INDEX "NormalRange_testDefId_idx" ON "NormalRange"("testDefId");

-- CreateIndex
CREATE INDEX "CalculationRule_testDefId_idx" ON "CalculationRule"("testDefId");

-- CreateIndex
CREATE INDEX "InterpretationRule_testDefId_idx" ON "InterpretationRule"("testDefId");

-- CreateIndex
CREATE INDEX "DeltaCheckRule_testDefId_idx" ON "DeltaCheckRule"("testDefId");

-- CreateIndex
CREATE INDEX "ReflexTestRule_parentTestDefId_idx" ON "ReflexTestRule"("parentTestDefId");

-- CreateIndex
CREATE INDEX "ReflexTestRule_childTestDefId_idx" ON "ReflexTestRule"("childTestDefId");

-- CreateIndex
CREATE UNIQUE INDEX "ReflexTestRule_parentTestDefId_childTestDefId_key" ON "ReflexTestRule"("parentTestDefId", "childTestDefId");

-- CreateIndex
CREATE INDEX "DeltaCheckResult_resultId_idx" ON "DeltaCheckResult"("resultId");

-- CreateIndex
CREATE INDEX "DeltaCheckResult_ruleId_idx" ON "DeltaCheckResult"("ruleId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailTemplate_name_key" ON "EmailTemplate"("name");

-- CreateIndex
CREATE INDEX "EmailTemplate_templateType_idx" ON "EmailTemplate"("templateType");

-- CreateIndex
CREATE INDEX "EmailLog_resultId_idx" ON "EmailLog"("resultId");

-- CreateIndex
CREATE INDEX "EmailLog_sampleId_idx" ON "EmailLog"("sampleId");

-- CreateIndex
CREATE INDEX "EmailLog_invoiceId_idx" ON "EmailLog"("invoiceId");

-- CreateIndex
CREATE INDEX "EmailLog_status_idx" ON "EmailLog"("status");

-- CreateIndex
CREATE INDEX "EmailLog_recipientEmail_idx" ON "EmailLog"("recipientEmail");

-- CreateIndex
CREATE UNIQUE INDEX "EmailSetting_key_key" ON "EmailSetting"("key");

-- CreateIndex
CREATE INDEX "EmailSetting_key_idx" ON "EmailSetting"("key");
