import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Checkbox,
} from '@mui/material';
import PatientHeader, { PatientData } from '../common/PatientHeader';
import { NavigationFooter, BillingFooter, PrintButtons } from '../common/ModalFooters';

interface ChemistryAnalyte {
  id: string;
  name: string;
  resultado: string;
  unidad: string;
  normalValue: string;
}

const QuimicaSanguinea: React.FC = () => {
  const [patientData, setPatientData] = useState<PatientData>({
    patientId: '',
    patientName: '',
    age: '',
    gender: '',
    doctor: '',
  });

  const [muestra, setMuestra] = useState('SUERO');
  const [tiempo, setTiempo] = useState('');
  const [observations, setObservations] = useState('');
  const [total, setTotal] = useState('0');
  const [discount, setDiscount] = useState('0');
  const [toPay, setToPay] = useState('0');

  const [analytes, setAnalytes] = useState<ChemistryAnalyte[]>([
    { id: '1', name: 'GLUCOSA', resultado: '', unidad: 'mg/dL', normalValue: '70-100' },
    { id: '2', name: 'TRIGLICERIDOS', resultado: '', unidad: 'mg/dL', normalValue: '<150' },
    { id: '3', name: 'ACIDO URICO', resultado: '', unidad: 'mg/dL', normalValue: '3.5-7.2' },
    { id: '4', name: 'CLORO', resultado: '', unidad: 'mEq/L', normalValue: '96-106' },
    { id: '5', name: 'SODIO', resultado: '', unidad: 'mEq/L', normalValue: '136-145' },
    { id: '6', name: 'POTASIO', resultado: '', unidad: 'mEq/L', normalValue: '3.5-5.0' },
    { id: '7', name: 'NITROGENO UREICO', resultado: '', unidad: 'mg/dL', normalValue: '7-20' },
    { id: '8', name: 'CREATININA', resultado: '', unidad: 'mg/dL', normalValue: '0.7-1.3' },
    { id: '9', name: 'UREA', resultado: '', unidad: 'mg/dL', normalValue: '15-45' },
    { id: '10', name: 'AMILASA', resultado: '', unidad: 'U/L', normalValue: '30-110' },
    { id: '11', name: 'COLESTEROL HDL', resultado: '', unidad: 'mg/dL', normalValue: '>40' },
    { id: '12', name: 'COLESTEROL LDL', resultado: '', unidad: 'mg/dL', normalValue: '<130' },
    { id: '13', name: 'COLESTEROL VLDL', resultado: '', unidad: 'mg/dL', normalValue: '<40' },
    { id: '14', name: 'BILIRRUBINA TOTAL', resultado: '', unidad: 'mg/dL', normalValue: '0.1-1.2' },
    { id: '15', name: 'BILIRRUBINA DIRECTA', resultado: '', unidad: 'mg/dL', normalValue: '0.0-0.3' },
    { id: '16', name: 'BILIRRUBINA INDIRECTA', resultado: '', unidad: 'mg/dL', normalValue: '0.1-0.9' },
    { id: '17', name: 'TRANSAMINASA GOT', resultado: '', unidad: 'U/L', normalValue: '10-40' },
    { id: '18', name: 'TRANSAMINASA GPT', resultado: '', unidad: 'U/L', normalValue: '7-56' },
    { id: '19', name: 'FOSFATASA ALCALINA', resultado: '', unidad: 'U/L', normalValue: '44-147' },
    { id: '20', name: 'PROTEINAS TOTALES', resultado: '', unidad: 'g/dL', normalValue: '6.0-8.3' },
    { id: '21', name: 'ALBUMINA', resultado: '', unidad: 'g/dL', normalValue: '3.5-5.5' },
    { id: '22', name: 'GLOBULINA', resultado: '', unidad: 'g/dL', normalValue: '2.3-3.5' },
    { id: '23', name: 'RELACION A/G', resultado: '', unidad: 'ratio', normalValue: '1.0-2.5' },
    { id: '24', name: 'GLUCOSA POSTPRANDIAL', resultado: '', unidad: 'mg/dL', normalValue: '<140' },
    { id: '25', name: 'MAGNESIO', resultado: '', unidad: 'mg/dL', normalValue: '1.7-2.2' },
    { id: '26', name: 'FOSFORO', resultado: '', unidad: 'mg/dL', normalValue: '2.5-4.5' },
  ]);

  const handleAnalyteChange = (id: string, field: keyof ChemistryAnalyte, value: string) => {
    setAnalytes((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  return (
    <Box sx={{ padding: '16px', backgroundColor: '#fff' }}>
      <h1>QUÍMICA SANGUÍNEA</h1>

      <PatientHeader
        patientData={patientData}
        onPatientDataChange={(data) => setPatientData((prev) => ({ ...prev, ...data }))}
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="MUESTRA"
          size="small"
          value={muestra}
          onChange={(e) => setMuestra(e.target.value)}
          sx={{ width: '200px' }}
        />
        <TextField
          label="ETORNI/H"
          size="small"
          value={tiempo}
          onChange={(e) => setTiempo(e.target.value)}
          sx={{ width: '200px' }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ mb: 2, maxHeight: '500px', overflowY: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1e3a5f' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '25%' }}>ANÁLISIS</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '5%' }}>C</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '20%' }}>RESULTADO</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '20%' }}>UNIDAD</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '15%' }}>V. NORMAL</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '15%' }}>GRABA V. NORMAL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {analytes.map((analyte) => (
              <TableRow key={analyte.id}>
                <TableCell>{analyte.name}</TableCell>
                <TableCell>
                  <Checkbox size="small" />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={analyte.resultado}
                    onChange={(e) => handleAnalyteChange(analyte.id, 'resultado', e.target.value)}
                    sx={{ width: '100%' }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    value={analyte.unidad}
                    onChange={(e) => handleAnalyteChange(analyte.id, 'unidad', e.target.value)}
                    sx={{ width: '100%' }}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: '12px' }}>{analyte.normalValue}</TableCell>
                <TableCell>
                  <TextField size="small" sx={{ width: '100%' }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <PrintButtons onPrint={() => window.print()} onPdf={() => console.log('Export PDF')} />

      <BillingFooter
        total={total}
        discount={discount}
        toPay={toPay}
        observations={observations}
        onObservationsChange={setObservations}
        onTotalChange={setTotal}
        onDiscountChange={setDiscount}
        onToPayChange={setToPay}
      />

      <NavigationFooter onSave={() => console.log('Save')} onExit={() => window.close()} disableNavigation />
    </Box>
  );
};

export default QuimicaSanguinea;
