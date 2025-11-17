/**
 * Test Results Entry Type Definitions
 * Defines the structure for all 9 test result entry forms
 */

// Test result form data
export interface TestResultData {
  id?: string;
  sampleId: string;
  testId: string;
  value: string | number | boolean;
  isNormal: boolean;
  notes?: string;
  enteredBy?: string;
  enteredAt?: string;
}

// COAGULACION (Coagulation Tests)
export interface CoagulacionResults extends TestResultData {
  testType: 'coagulacion';
  protrombinaTime?: number; // PT in seconds
  INR?: number; // International Normalized Ratio
  fibrinogenLevel?: number; // mg/dL
  thrombinTime?: number; // TT in seconds
  activatedPartialThromboplastinTime?: number; // aPTT in seconds
}

// GRUPO_SANGUINEO (Blood Type)
export interface GrupoSanguneoResults extends TestResultData {
  testType: 'grupo_sanguineo';
  bloodType: 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | '';
  rhFactor: '+' | '-' | '';
  antiDPositive?: boolean;
}

// ELISA (Enzyme-Linked Immunosorbent Assay)
export interface ELISAResults extends TestResultData {
  testType: 'elisa';
  testName: string; // Specific ELISA test (HIV, HBsAg, HCV, etc.)
  result: 'positive' | 'negative' | 'inconclusive' | '';
  opticalDensity?: number;
  cutoffValue?: number;
  interpretation?: string;
}

// EMBARAZO (Pregnancy)
export interface EmbarazoResults extends TestResultData {
  testType: 'embarazo';
  hCGLevel?: number; // mIU/mL
  result: 'positive' | 'negative' | '';
  weekEstimate?: number;
  testMethod: 'blood' | 'urine' | '';
}

// URINALISIS (Urinalysis)
export interface UrinalisisResults extends TestResultData {
  testType: 'urinalisis';
  appearance: string; // Clear, Turbid, etc.
  color: string; // Yellow, Pale, Dark, etc.
  pH?: number;
  specificGravity?: number;
  protein?: string; // Negative, Trace, 1+, 2+, etc.
  glucose?: string;
  ketones?: string;
  bilirubin?: string;
  leukocyteEsterase?: string;
  nitrites?: string;
  redBloodCells?: string;
  whiteBloodCells?: string;
  casts?: string;
  crystals?: string;
  bacteria?: string;
  squamousEpithelial?: string;
}

// QUIMICA (Chemistry/Chemistry Panel)
export interface QuimicaResults extends TestResultData {
  testType: 'quimica';
  glucose?: number; // mg/dL
  BUN?: number; // mg/dL
  creatinine?: number; // mg/dL
  sodium?: number; // mEq/L
  potassium?: number; // mEq/L
  chloride?: number; // mEq/L
  CO2?: number; // mEq/L
  calcium?: number; // mg/dL
  albumin?: number; // g/dL
  totalProtein?: number; // g/dL
  ALT?: number; // U/L
  AST?: number; // U/L
  alkalinePhosphatase?: number; // U/L
  totalBilirubin?: number; // mg/dL
  directBilirubin?: number; // mg/dL
  triglycerides?: number; // mg/dL
  totalCholesterol?: number; // mg/dL
  HDL?: number; // mg/dL
  LDL?: number; // mg/dL
}

// INMUNOLOGIA (Immunology)
export interface InmunologiaResults extends TestResultData {
  testType: 'inmunologia';
  testName: string; // Specific immunology test
  IgG?: number; // mg/dL
  IgM?: number; // mg/dL
  IgA?: number; // mg/dL
  complement?: string;
  rheumatoidFactor?: string; // Positive/Negative
  ANA?: string; // Positive/Negative
  result?: string;
  titer?: string;
}

// HORMONAS (Hormones)
export interface HormonasResults extends TestResultData {
  testType: 'hormonas';
  hormoneType: string; // TSH, T3, T4, Cortisol, etc.
  units: string;
  referenceRange?: string;
  phase?: string; // For menstrual cycle-dependent hormones
}

// HECES (Stool Analysis)
export interface hecesResults extends TestResultData {
  testType: 'heces';
  appearance: string; // Normal, Loose, Hard, Pale, Dark, etc.
  color: string;
  consistency: string;
  odor?: string;
  bloodOccult: string; // Positive/Negative
  fat?: string; // Positive/Negative/Trace
  muscleFibers?: string;
  vegetableFibers?: string;
  starchGranules?: string;
  parasites?: string;
  protozoa?: string;
  bacteria?: string;
  leucocytes?: string;
  erythrocytes?: string;
  crystals?: string;
  charcotLeydenCrystals?: string;
}

// Union type for all test results
export type AllTestResults =
  | CoagulacionResults
  | GrupoSanguneoResults
  | ELISAResults
  | EmbarazoResults
  | UrinalisisResults
  | QuimicaResults
  | InmunologiaResults
  | HormonasResults
  | hecesResults;

// Sample with results
export interface SampleWithResults {
  id: string;
  sampleNumber: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    gender: string;
    birthDate: string;
  };
  tests: Array<{
    id: string;
    code: string;
    name: string;
    category: string;
  }>;
  results?: TestResultData[];
}

// Test entry configuration
export interface TestEntryConfig {
  testType: string;
  displayName: string;
  category: string;
  icon: string;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'radio' | 'checkbox' | 'textarea';
    required?: boolean;
    options?: Array<{ value: string; label: string }>;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    units?: string;
    helpText?: string;
  }>;
}
