
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});

exports.Prisma.LabScalarFieldEnum = {
  id: 'id',
  name: 'name',
  address: 'address',
  phone: 'phone',
  email: 'email',
  logo: 'logo',
  customText1: 'customText1',
  customText2: 'customText2',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  username: 'username',
  password: 'password',
  fullName: 'fullName',
  email: 'email',
  role: 'role',
  isActive: 'isActive',
  labId: 'labId',
  createdAt: 'createdAt'
};

exports.Prisma.PatientScalarFieldEnum = {
  id: 'id',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  phone: 'phone',
  birthDate: 'birthDate',
  gender: 'gender',
  address: 'address',
  labId: 'labId',
  createdAt: 'createdAt'
};

exports.Prisma.TestScalarFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name',
  price: 'price',
  category: 'category',
  normalRange: 'normalRange',
  unit: 'unit',
  isActive: 'isActive',
  createdAt: 'createdAt'
};

exports.Prisma.TestProfileScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  isActive: 'isActive',
  createdAt: 'createdAt'
};

exports.Prisma.TestProfileItemScalarFieldEnum = {
  id: 'id',
  profileId: 'profileId',
  testId: 'testId'
};

exports.Prisma.SampleScalarFieldEnum = {
  id: 'id',
  sampleNumber: 'sampleNumber',
  patientId: 'patientId',
  profileId: 'profileId',
  collectionDate: 'collectionDate',
  status: 'status',
  notes: 'notes',
  createdAt: 'createdAt'
};

exports.Prisma.SampleTestScalarFieldEnum = {
  id: 'id',
  sampleId: 'sampleId',
  testId: 'testId',
  price: 'price'
};

exports.Prisma.ResultScalarFieldEnum = {
  id: 'id',
  sampleId: 'sampleId',
  testId: 'testId',
  testDefId: 'testDefId',
  value: 'value',
  calculatedValues: 'calculatedValues',
  isNormal: 'isNormal',
  abnormalFlags: 'abnormalFlags',
  interpretationId: 'interpretationId',
  notes: 'notes',
  enteredBy: 'enteredBy',
  enteredAt: 'enteredAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InvoiceScalarFieldEnum = {
  id: 'id',
  invoiceNumber: 'invoiceNumber',
  patientId: 'patientId',
  sampleId: 'sampleId',
  labId: 'labId',
  subtotal: 'subtotal',
  tax: 'tax',
  discount: 'discount',
  total: 'total',
  status: 'status',
  dueDate: 'dueDate',
  paidDate: 'paidDate',
  notes: 'notes',
  createdAt: 'createdAt'
};

exports.Prisma.InvoiceItemScalarFieldEnum = {
  id: 'id',
  invoiceId: 'invoiceId',
  description: 'description',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  total: 'total'
};

exports.Prisma.DoctorScalarFieldEnum = {
  id: 'id',
  firstName: 'firstName',
  lastName: 'lastName',
  specialty: 'specialty',
  phone: 'phone',
  email: 'email',
  commissionRate: 'commissionRate',
  isActive: 'isActive',
  createdAt: 'createdAt'
};

exports.Prisma.CommissionScalarFieldEnum = {
  id: 'id',
  doctorId: 'doctorId',
  invoiceId: 'invoiceId',
  amount: 'amount',
  percentage: 'percentage',
  isPaid: 'isPaid',
  paidDate: 'paidDate',
  notes: 'notes',
  createdAt: 'createdAt'
};

exports.Prisma.InventoryItemScalarFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name',
  description: 'description',
  category: 'category',
  quantity: 'quantity',
  minQuantity: 'minQuantity',
  unit: 'unit',
  unitPrice: 'unitPrice',
  supplier: 'supplier',
  notes: 'notes',
  isActive: 'isActive',
  createdAt: 'createdAt'
};

exports.Prisma.StockAdjustmentScalarFieldEnum = {
  id: 'id',
  itemId: 'itemId',
  type: 'type',
  quantity: 'quantity',
  reason: 'reason',
  adjustedBy: 'adjustedBy',
  createdAt: 'createdAt'
};

exports.Prisma.LicenseScalarFieldEnum = {
  id: 'id',
  licenseKey: 'licenseKey',
  machineId: 'machineId',
  subscriptionType: 'subscriptionType',
  isActive: 'isActive',
  activatedAt: 'activatedAt',
  expiresAt: 'expiresAt',
  lastCheckAt: 'lastCheckAt',
  gracePeriodEnds: 'gracePeriodEnds',
  createdAt: 'createdAt'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  action: 'action',
  entity: 'entity',
  entityId: 'entityId',
  oldValues: 'oldValues',
  newValues: 'newValues',
  ipAddress: 'ipAddress',
  createdAt: 'createdAt'
};

exports.Prisma.SettingScalarFieldEnum = {
  id: 'id',
  key: 'key',
  value: 'value',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TestCategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  code: 'code',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TestDefinitionScalarFieldEnum = {
  id: 'id',
  testId: 'testId',
  categoryId: 'categoryId',
  name: 'name',
  code: 'code',
  unit: 'unit',
  sampleType: 'sampleType',
  testFields: 'testFields',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NormalRangeScalarFieldEnum = {
  id: 'id',
  testDefId: 'testDefId',
  minAge: 'minAge',
  maxAge: 'maxAge',
  gender: 'gender',
  minValue: 'minValue',
  maxValue: 'maxValue',
  criticalLow: 'criticalLow',
  criticalHigh: 'criticalHigh',
  unit: 'unit',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CalculationRuleScalarFieldEnum = {
  id: 'id',
  testDefId: 'testDefId',
  name: 'name',
  formula: 'formula',
  requiredFields: 'requiredFields',
  outputField: 'outputField',
  priority: 'priority',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InterpretationRuleScalarFieldEnum = {
  id: 'id',
  testDefId: 'testDefId',
  name: 'name',
  condition: 'condition',
  interpretation: 'interpretation',
  severity: 'severity',
  priority: 'priority',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DeltaCheckRuleScalarFieldEnum = {
  id: 'id',
  testDefId: 'testDefId',
  name: 'name',
  alertThreshold: 'alertThreshold',
  criticalThreshold: 'criticalThreshold',
  checkDays: 'checkDays',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ReflexTestRuleScalarFieldEnum = {
  id: 'id',
  parentTestDefId: 'parentTestDefId',
  childTestDefId: 'childTestDefId',
  condition: 'condition',
  priority: 'priority',
  requiresApproval: 'requiresApproval',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DeltaCheckResultScalarFieldEnum = {
  id: 'id',
  resultId: 'resultId',
  ruleId: 'ruleId',
  previousValue: 'previousValue',
  currentValue: 'currentValue',
  changePercent: 'changePercent',
  previousDate: 'previousDate',
  alertMessage: 'alertMessage',
  severity: 'severity',
  isResolved: 'isResolved',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EmailTemplateScalarFieldEnum = {
  id: 'id',
  name: 'name',
  subject: 'subject',
  htmlContent: 'htmlContent',
  plainTextContent: 'plainTextContent',
  templateType: 'templateType',
  requiredVariables: 'requiredVariables',
  isActive: 'isActive',
  version: 'version',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EmailLogScalarFieldEnum = {
  id: 'id',
  templateId: 'templateId',
  resultId: 'resultId',
  sampleId: 'sampleId',
  invoiceId: 'invoiceId',
  recipientEmail: 'recipientEmail',
  subject: 'subject',
  content: 'content',
  status: 'status',
  sentAt: 'sentAt',
  failureReason: 'failureReason',
  retryCount: 'retryCount',
  nextRetryAt: 'nextRetryAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EmailSettingScalarFieldEnum = {
  id: 'id',
  key: 'key',
  value: 'value',
  description: 'description',
  isEncrypted: 'isEncrypted',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  Lab: 'Lab',
  User: 'User',
  Patient: 'Patient',
  Test: 'Test',
  TestProfile: 'TestProfile',
  TestProfileItem: 'TestProfileItem',
  Sample: 'Sample',
  SampleTest: 'SampleTest',
  Result: 'Result',
  Invoice: 'Invoice',
  InvoiceItem: 'InvoiceItem',
  Doctor: 'Doctor',
  Commission: 'Commission',
  InventoryItem: 'InventoryItem',
  StockAdjustment: 'StockAdjustment',
  License: 'License',
  AuditLog: 'AuditLog',
  Setting: 'Setting',
  TestCategory: 'TestCategory',
  TestDefinition: 'TestDefinition',
  NormalRange: 'NormalRange',
  CalculationRule: 'CalculationRule',
  InterpretationRule: 'InterpretationRule',
  DeltaCheckRule: 'DeltaCheckRule',
  ReflexTestRule: 'ReflexTestRule',
  DeltaCheckResult: 'DeltaCheckResult',
  EmailTemplate: 'EmailTemplate',
  EmailLog: 'EmailLog',
  EmailSetting: 'EmailSetting'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
