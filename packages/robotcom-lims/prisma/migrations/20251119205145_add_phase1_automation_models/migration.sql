/*
  Warnings:

  - Added the required column `updatedAt` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
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

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Result" (
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
INSERT INTO "new_Result" ("createdAt", "enteredAt", "enteredBy", "id", "isNormal", "notes", "sampleId", "testId", "value") SELECT "createdAt", "enteredAt", "enteredBy", "id", "isNormal", "notes", "sampleId", "testId", "value" FROM "Result";
DROP TABLE "Result";
ALTER TABLE "new_Result" RENAME TO "Result";
CREATE INDEX "Result_sampleId_idx" ON "Result"("sampleId");
CREATE INDEX "Result_testDefId_idx" ON "Result"("testDefId");
CREATE INDEX "Result_interpretationId_idx" ON "Result"("interpretationId");
CREATE UNIQUE INDEX "Result_sampleId_testId_key" ON "Result"("sampleId", "testId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

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
