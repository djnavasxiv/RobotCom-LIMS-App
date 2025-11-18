import React, { useState } from 'react';
import { Box, TextField, Grid, Paper, Typography } from '@mui/material';
import PatientHeader, { PatientData } from '../common/PatientHeader';
import { NavigationFooter, BillingFooter, PrintButtons } from '../common/ModalFooters';

interface UrinalysisData {
  // Physical-Chemical
  color: string;
  aspecto: string;
  densidad: string;
  pH: string;
  nitritos: string;
  proteinas: string;
  glucosa: string;
  cetonicos: string;
  urobilinogeno: string;
  bilirrubina: string;
  sangreOculta: string;
  hemoglobina: string;
  leucocitaria: string;

  // Microscopic - Casts
  cilindros: string;
  cilindrosLeucocitarios: string;
  cilindrosHematicos: string;
  cilindrosHialinos: string;
  cilindrosCereos: string;
  cilindrosGranuloso: string;
  cilindrosGranulososG: string;
  cilindroOides: string;
  cilindrosMixtos: string;

  // Microscopic - Other
  hematies: string;
  leucocitos: string;
  celEpiteliales: string;
  cristales: string;
  bacterias: string;
  parasitologico: string;
  otros: string;
  observaciones: string;
}

const GeneralOrina: React.FC = () => {
  const [patientData, setPatientData] = useState<PatientData>({
    patientId: '',
    patientName: '',
    age: '',
    gender: '',
    doctor: '',
  });

  const [data, setData] = useState<UrinalysisData>({
    color: '',
    aspecto: '',
    densidad: '',
    pH: '',
    nitritos: '',
    proteinas: '',
    glucosa: '',
    cetonicos: '',
    urobilinogeno: '',
    bilirrubina: '',
    sangreOculta: '',
    hemoglobina: '',
    leucocitaria: '',
    cilindros: '',
    cilindrosLeucocitarios: '',
    cilindrosHematicos: '',
    cilindrosHialinos: '',
    cilindrosCereos: '',
    cilindrosGranuloso: '',
    cilindrosGranulososG: '',
    cilindroOides: '',
    cilindrosMixtos: '',
    hematies: '',
    leucocitos: '',
    celEpiteliales: '',
    cristales: '',
    bacterias: '',
    parasitologico: '',
    otros: '',
    observaciones: '',
  });

  const [total, setTotal] = useState('0');
  const [discount, setDiscount] = useState('0');
  const [toPay, setToPay] = useState('0');

  const handleFieldChange = (field: keyof UrinalysisData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Box sx={{ padding: '16px', backgroundColor: '#fff' }}>
      <h1>GENERAL DE ORINA</h1>

      <PatientHeader
        patientData={patientData}
        onPatientDataChange={(upd) => setPatientData((prev) => ({ ...prev, ...upd }))}
      />

      <Paper sx={{ padding: '16px', mb: 2 }}>
        {/* Physical-Chemical Section */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1e3a5f' }}>
          EXAMEN FISICO - QUIMICO
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: 'COLOR', field: 'color' },
            { label: 'ASPECTO', field: 'aspecto' },
            { label: 'DENSIDAD', field: 'densidad' },
            { label: 'PH', field: 'pH' },
            { label: 'NITRITOS', field: 'nitritos' },
            { label: 'PROTEINAS', field: 'proteinas' },
            { label: 'GLUCOSA', field: 'glucosa' },
            { label: 'C. CETONICOS', field: 'cetonicos' },
            { label: 'UROBILINOGENO', field: 'urobilinogeno' },
            { label: 'BILIRRUBINA', field: 'bilirrubina' },
            { label: 'SANGRE OCULTA', field: 'sangreOculta' },
            { label: 'HEMOGLOBINA', field: 'hemoglobina' },
            { label: 'E. LEUCOCITARIA', field: 'leucocitaria' },
          ].map(({ label, field }) => (
            <Grid item xs={4} key={field}>
              <TextField
                label={label}
                fullWidth
                size="small"
                value={(data as any)[field]}
                onChange={(e) => handleFieldChange(field as keyof UrinalysisData, e.target.value)}
              />
            </Grid>
          ))}
        </Grid>

        {/* Microscopic - Casts */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1e3a5f' }}>
          EXAMEN MICROSCOPICO - CILINDROS
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: 'CILINDROS', field: 'cilindros' },
            { label: 'LEUCOCITARIOS', field: 'cilindrosLeucocitarios' },
            { label: 'HEMATICOS', field: 'cilindrosHematicos' },
            { label: 'HIALINOS', field: 'cilindrosHialinos' },
            { label: 'CEREOS', field: 'cilindrosCereos' },
            { label: 'GRANULOSO F', field: 'cilindrosGranuloso' },
            { label: 'GRANULOSO G', field: 'cilindrosGranulososG' },
            { label: 'CILINDROIDAS', field: 'cilindroOides' },
            { label: 'MIXTOS', field: 'cilindrosMixtos' },
          ].map(({ label, field }) => (
            <Grid item xs={4} key={field}>
              <TextField
                label={label}
                fullWidth
                size="small"
                value={(data as any)[field]}
                onChange={(e) => handleFieldChange(field as keyof UrinalysisData, e.target.value)}
              />
            </Grid>
          ))}
        </Grid>

        {/* Microscopic - Other */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1e3a5f' }}>
          EXAMEN MICROSCOPICO - OTROS
        </Typography>

        <Grid container spacing={2}>
          {[
            { label: 'HEMATIES', field: 'hematies' },
            { label: 'LEUCOCITOS', field: 'leucocitos' },
            { label: 'CEL. EPITELIALES', field: 'celEpiteliales' },
            { label: 'CRISTALES', field: 'cristales' },
            { label: 'BACTERIAS', field: 'bacterias' },
            { label: 'PARASITOLOGICO', field: 'parasitologico' },
            { label: 'OTROS', field: 'otros' },
          ].map(({ label, field }) => (
            <Grid item xs={4} key={field}>
              <TextField
                label={label}
                fullWidth
                size="small"
                value={(data as any)[field]}
                onChange={(e) => handleFieldChange(field as keyof UrinalysisData, e.target.value)}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      <PrintButtons onPrint={() => window.print()} onPdf={() => console.log('Export PDF')} />

      <BillingFooter
        total={total}
        discount={discount}
        toPay={toPay}
        observations={data.observaciones}
        onObservationsChange={(val) => handleFieldChange('observaciones', val)}
        onTotalChange={setTotal}
        onDiscountChange={setDiscount}
        onToPayChange={setToPay}
      />

      <NavigationFooter onSave={() => console.log('Save')} onExit={() => window.close()} disableNavigation />
    </Box>
  );
};

export default GeneralOrina;
