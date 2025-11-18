// Complete list of laboratory test categories with all components
export const allTestCategories = [
  // Blood Typing
  {
    code: 'tipeo',
    name: 'Tipificación Sanguínea',
    icon: '🩸',
    description: 'ABO, Rh, Subgrupos, Antiglobalulinas, Compatibilidad',
    tests: [
      { id: 'abo', name: 'Grupo ABO', unit: 'Group' },
      { id: 'rh', name: 'Factor Rh', unit: 'Positive/Negative' },
      { id: 'subgrupo', name: 'Subgrupos de Antígenos', unit: 'Antigenic' },
      { id: 'antiglobulina', name: 'Test de Antiglobulinas (Coombs)', unit: 'Positive/Negative' },
      { id: 'compatibilidad', name: 'Prueba de Compatibilidad', unit: 'Compatible/Incompatible' },
    ],
  },
  // Coagulation
  {
    code: 'coagulacion',
    name: 'Pruebas de Coagulación',
    icon: '🩸',
    description: 'TP, APTT, Fibrinógeno, Plaquetas, Dímeros D',
    tests: [
      { id: 'pt', name: 'Tiempo de Protrombina (TP)', unit: 'segundos' },
      { id: 'inr', name: 'INR (Índice Normalizado Internacional)', unit: 'ratio' },
      { id: 'aptt', name: 'Tiempo de Tromboplastina Parcial Activado (APTT)', unit: 'segundos' },
      { id: 'fibrinogen', name: 'Fibrinógeno', unit: 'mg/dL' },
      { id: 'dd', name: 'Dímero D', unit: 'ng/mL' },
    ],
  },
  // Serology
  {
    code: 'elisa',
    name: 'ELISA y Serologías',
    icon: '🧪',
    description: 'VIH, VHB, VHC, Sífilis, Toxoplasma, CMV',
    tests: [
      { id: 'hiv', name: 'VIH 1/2 (Anticuerpos)', unit: 'Positive/Negative' },
      { id: 'hbsag', name: 'VHB (HBsAg)', unit: 'mIU/mL' },
      { id: 'hvc', name: 'VHC (Anti-HCV)', unit: 'Positive/Negative' },
      { id: 'rpr', name: 'Sífilis RPR/VDRL', unit: 'Dilución' },
      { id: 'tppa', name: 'Sífilis TPPA/FTA', unit: 'Positive/Negative' },
    ],
  },
  // Immunology
  {
    code: 'inmunologia',
    name: 'Inmunología',
    icon: '🛡️',
    description: 'Inmunoglobulinas, Proteínas, Factores Complemento',
    tests: [
      { id: 'igg', name: 'Inmunoglobulina G (IgG)', unit: 'mg/dL' },
      { id: 'igm', name: 'Inmunoglobulina M (IgM)', unit: 'mg/dL' },
      { id: 'iga', name: 'Inmunoglobulina A (IgA)', unit: 'mg/dL' },
      { id: 'c3', name: 'Proteína C3 del Complemento', unit: 'mg/dL' },
      { id: 'c4', name: 'Proteína C4 del Complemento', unit: 'mg/dL' },
    ],
  },
  // Hormones
  {
    code: 'hormonas',
    name: 'Panel de Hormonas',
    icon: '⚗️',
    description: 'TSH, T3, T4, Cortisol, Prolactina, LH, FSH',
    tests: [
      { id: 'tsh', name: 'TSH (Hormona Estimulante Tiroides)', unit: 'mIU/L' },
      { id: 't4', name: 'T4 Libre (Tiroxina)', unit: 'ng/dL' },
      { id: 't3', name: 'T3 Libre (Triyodotironina)', unit: 'pg/mL' },
      { id: 'cortisol', name: 'Cortisol en Sangre', unit: 'μg/dL' },
      { id: 'prolactina', name: 'Prolactina', unit: 'ng/mL' },
    ],
  },
  // Urinalysis
  {
    code: 'urinalisis',
    name: 'Análisis de Orina',
    icon: '💛',
    description: 'Células, Proteína, Glucosa, Densidad, Nitrato, Bacterias',
    tests: [
      { id: 'densidad_urina', name: 'Densidad de Orina', unit: 'g/mL' },
      { id: 'proteina_urina', name: 'Proteína en Orina', unit: 'mg/dL' },
      { id: 'glucosa_urina', name: 'Glucosa en Orina', unit: 'mg/dL' },
      { id: 'hemoglobina_urina', name: 'Hemoglobina/Mioglobina', unit: 'Positive/Negative' },
      { id: 'cel_blancas', name: 'Células Blancas en Orina', unit: 'por campo' },
    ],
  },
  // Fecal Analysis
  {
    code: 'heces',
    name: 'Análisis de Heces',
    icon: '🔬',
    description: 'Parásitos, Sangre Oculta, Grasa, Leucocitos, Bacterias',
    tests: [
      { id: 'parasitos', name: 'Búsqueda de Parásitos', unit: 'Positive/Negative' },
      { id: 'sangre_oculta', name: 'Sangre Oculta', unit: 'Positive/Negative' },
      { id: 'grasa_fecal', name: 'Grasa en Heces', unit: 'g/día' },
      { id: 'leucocitos_heces', name: 'Leucocitos en Heces', unit: 'por campo' },
      { id: 'cultivo_heces', name: 'Cultivo para Bacterias Patógenas', unit: 'Positive/Negative' },
    ],
  },
  // Clinical Chemistry
  {
    code: 'quimica',
    name: 'Panel de Química Clínica',
    icon: '🧬',
    description: 'Glucosa, Electrolitos, Hígado, Riñones, Lípidos',
    tests: [
      { id: 'glucosa', name: 'Glucosa en Ayunas', unit: 'mg/dL' },
      { id: 'sodio', name: 'Sodio', unit: 'mEq/L' },
      { id: 'potasio', name: 'Potasio', unit: 'mEq/L' },
      { id: 'cloruro', name: 'Cloruro', unit: 'mEq/L' },
      { id: 'calcio', name: 'Calcio Total', unit: 'mg/dL' },
    ],
  },
  // Pregnancy Tests
  {
    code: 'embarazo',
    name: 'Pruebas de Embarazo',
    icon: '🤰',
    description: 'hCG en sangre, hCG en orina, Progesterona',
    tests: [
      { id: 'bhcg_sangre', name: 'Beta hCG en Sangre Cuantitativo', unit: 'mIU/mL' },
      { id: 'hcg_orina', name: 'hCG en Orina (Cualitativo)', unit: 'Positive/Negative' },
      { id: 'progesterona', name: 'Progesterona Sérica', unit: 'ng/mL' },
      { id: 'estriol', name: 'Estriol No Conjugado (Segundo Trimestre)', unit: 'ng/mL' },
      { id: 'alphafeto', name: 'Alfa-fetoproteína (AFP)', unit: 'ng/mL' },
    ],
  },
  // Hematology
  {
    code: 'hematologia',
    name: 'Hematología Completa',
    icon: '🩸',
    description: 'RBC, WBC, Hemoglobina, Hematocrito, Plaquetas, Diferencial',
    tests: [
      { id: 'rbc', name: 'Glóbulos Rojos (RBC)', unit: 'millones/μL' },
      { id: 'wbc', name: 'Glóbulos Blancos (WBC)', unit: '1000/μL' },
      { id: 'hemoglobina', name: 'Hemoglobina', unit: 'g/dL' },
      { id: 'hematocrito', name: 'Hematocrito', unit: '%' },
      { id: 'plaquetas', name: 'Plaquetas', unit: '1000/μL' },
    ],
  },
  // Bacteriology
  {
    code: 'bacteriologicas',
    name: 'Pruebas Bacteriológicas',
    icon: '🦠',
    description: 'Cultivos, Gram, Antibiograma, Tinción',
    tests: [
      { id: 'cultivo_sangre', name: 'Cultivo de Sangre (Hemocultivo)', unit: 'Positive/Negative' },
      { id: 'cultivo_orina', name: 'Cultivo de Orina', unit: 'CFU/mL' },
      { id: 'gram', name: 'Tinción de Gram', unit: 'morphology' },
      { id: 'antibiograma', name: 'Antibiograma (Sensibilidad)', unit: 'Susceptible/Resistant' },
      { id: 'cultivo_general', name: 'Cultivo General/Mixto', unit: 'Positive/Negative' },
    ],
  },
  // Semen Analysis
  {
    code: 'espermatozoides',
    name: 'Análisis de Esperma (Espermatograma)',
    icon: '🔬',
    description: 'Concentración, Movilidad, Morfología, Viabilidad, Volume',
    tests: [
      { id: 'concentracion', name: 'Concentración de Espermatozoides', unit: 'millones/mL' },
      { id: 'movilidad', name: 'Movilidad de Espermatozoides', unit: '%' },
      { id: 'morfologia', name: 'Morfología Normal', unit: '%' },
      { id: 'viabilidad', name: 'Viabilidad de Espermatozoides', unit: '%' },
      { id: 'volumen', name: 'Volumen de Semen', unit: 'mL' },
    ],
  },
  // Viral Serology/Bacteriology
  {
    code: 'virus_bacterianas',
    name: 'Virus - Serologías Bacterianas',
    icon: '🦠',
    description: 'Rubeola, Sarampión, Varicela, Herpes, Chlamydia',
    tests: [
      { id: 'rubeola_igg', name: 'Rubeola IgG (Inmunidad)', unit: 'Positive/Negative' },
      { id: 'rubeola_igm', name: 'Rubeola IgM (Infección Aguda)', unit: 'Positive/Negative' },
      { id: 'varicela_igg', name: 'Varicela-Zóster IgG', unit: 'Positive/Negative' },
      { id: 'herpes_igg', name: 'Herpes Simple 1/2 IgG', unit: 'Positive/Negative' },
      { id: 'chlamydia', name: 'Chlamydia trachomatis (Cultivo/PCR)', unit: 'Positive/Negative' },
    ],
  },
  // Viral Stool
  {
    code: 'virus_heces',
    name: 'Virus - Análisis de Heces',
    icon: '🔬',
    description: 'Rotavirus, Norovirus, Adenovirus, Enterovirus',
    tests: [
      { id: 'rotavirus', name: 'Rotavirus en Heces (Antígeno)', unit: 'Positive/Negative' },
      { id: 'norovirus', name: 'Norovirus en Heces', unit: 'Positive/Negative' },
      { id: 'adenovirus', name: 'Adenovirus Entérico', unit: 'Positive/Negative' },
      { id: 'enterovirus', name: 'PCR de Enterovirus en Heces', unit: 'Positive/Negative' },
      { id: 'virus_respiratorio', name: 'Virus Respiratorio en Heces', unit: 'Positive/Negative' },
    ],
  },
  // Viral Blood/Hematological
  {
    code: 'virus_hematologicas',
    name: 'Virus - Pruebas Hematológicas',
    icon: '🩸',
    description: 'CMV, EBV, Dengue, Malaria, Mononucleosis',
    tests: [
      { id: 'cmv_igg', name: 'CMV IgG (Citomegalovirus)', unit: 'Positive/Negative' },
      { id: 'cmv_igm', name: 'CMV IgM (Infección Aguda)', unit: 'Positive/Negative' },
      { id: 'ebv', name: 'EBV (Virus de Epstein-Barr)', unit: 'Positive/Negative' },
      { id: 'dengue', name: 'Dengue NS1/IgM/IgG', unit: 'Positive/Negative' },
      { id: 'malaria', name: 'Gota Gruesa / PCR Malaria', unit: 'Positive/Negative' },
    ],
  },
];
