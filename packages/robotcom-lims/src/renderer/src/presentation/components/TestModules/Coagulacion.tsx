import React, { useState } from 'react';
import {
  Box,
  TextField,
  Grid,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import PatientHeader, { PatientData } from '../common/PatientHeader';
import { NavigationFooter, BillingFooter, PrintButtons } from '../common/ModalFooters';

interface CoagulationAnalyte {
  name: string;
  result: string;
  unit: string;
}

const Coagulacion: React.FC = () => {
  const [patientData, setPatientData] = useState<PatientData>({
    patientId: '',
    patientName: '',
    age: '',
    gender: '',
    doctor: '',
  });

  const [muestra, setMuestra] = useState('');
  const [isi, setIsi] = useState('');
  const [inr, setInr] = useState('');
  const [ptControlNormal, setPtControlNormal] = useState('');

  const [analytes, setAnalytes] = useState<CoagulationAnalyte[]>([
    { name: 'PT (Protrombin Time)', result: '', unit: 'segundos' },
    { name: 'PTT (Activated Partial Thromboplastin Time)', result: '', unit: 'segundos' },
    { name: 'FIBRINÓGENO', result: '', unit: 'mg/dL' },
    { name: 'DÍMERO D', result: '', unit: 'μg/mL' },
    { name: 'RECUENTO DE PLAQUETAS', result: '', unit: 'K/μL' },
  ]);

  const [observaciones, setObservaciones] = useState('');
  const [total, setTotal] = useState('0');
  const [discount, setDiscount] = useState('0');
  const [toPay, setToPay] = useState('0');

  const handleAnalyteChange = (index: number, field: keyof CoagulationAnalyte, value: string) => {
    const newAnalytes = [...analytes];
    newAnalytes[index] = { ...newAnalytes[index], [field]: value };
    setAnalytes(newAnalytes);
  };

  return (
    <Box sx={{ padding: '16px', backgroundColor: '#fff' }}>
      <h1>COAGULACIÓN</h1>

      <PatientHeader
        patientData={patientData}
        onPatientDataChange={(upd) => setPatientData((prev) => ({ ...prev, ...upd }))}
      />

      <Paper sx={{ padding: '16px', mb: 2 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={3}>
            <TextField
              label="MUESTRA"
              fullWidth
              size="small"
              value={muestra}
              onChange={(e) => setMuestra(e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="ISI"
              fullWidth
              size="small"
              value={isi}
              onChange={(e) => setIsi(e.target.value)}
            />
            <Button size="small" sx={{ mt: 1 }}>
              GUARDAR ISI
            </Button>
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="INR"
              fullWidth
              size="small"
              value={inr}
              onChange={(e) => setInr(e.target.value)}
            />
            <Button size="small" sx={{ mt: 1 }}>
              GUARDAR INR
            </Button>
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="T. de P. CONTROL NORMAL"
              fullWidth
              size="small"
              value={ptControlNormal}
              onChange={(e) => setPtControlNormal(e.target.value)}
            />
          </Grid>
        </Grid>

        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1e3a5f' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ANÁLISIS</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>RESULT.</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>UNIDAD</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>GUARDAR VALOR NORMAL</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytes.map((analyte, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ fontSize: '12px' }}>{analyte.name}</TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={analyte.result}
                      onChange={(e) => handleAnalyteChange(idx, 'result', e.target.value)}
                      sx={{ width: '100%' }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      value={analyte.unit}
                      onChange={(e) => handleAnalyteChange(idx, 'unit', e.target.value)}
                      sx={{ width: '100%' }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField size="small" sx={{ width: '100%' }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <PrintButtons onPrint={() => window.print()} onPdf={() => console.log('Export PDF')} />

      <BillingFooter
        total={total}
        discount={discount}
        toPay={toPay}
        observations={observaciones}
        onObservationsChange={setObservaciones}
        onTotalChange={setTotal}
        onDiscountChange={setDiscount}
        onToPayChange={setToPay}
      />

      <NavigationFooter onSave={() => console.log('Save')} onExit={() => window.close()} disableNavigation />
    </Box>
  );
};

export default Coagulacion;
