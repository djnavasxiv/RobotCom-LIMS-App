import React, { useState } from 'react';
import { Box, TextField, Grid, Button, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import PatientHeader, { PatientData } from '../common/PatientHeader';
import { NavigationFooter, BillingFooter, PrintButtons } from '../common/ModalFooters';

const TipoSangre: React.FC = () => {
  const [patientData, setPatientData] = useState<PatientData>({
    patientId: '',
    patientName: '',
    age: '',
    gender: '',
    doctor: '',
  });

  const [muestra, setMuestra] = useState('');
  const [grupo, setGrupo] = useState('A');
  const [factorRh, setFactorRh] = useState('Positivo');
  const [du, setDu] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const [total, setTotal] = useState('0');
  const [discount, setDiscount] = useState('0');
  const [toPay, setToPay] = useState('0');

  return (
    <Box sx={{ padding: '16px', backgroundColor: '#fff' }}>
      <h1>PRUEBAS TIPO SANGRE</h1>

      <PatientHeader
        patientData={patientData}
        onPatientDataChange={(upd) => setPatientData((prev) => ({ ...prev, ...upd }))}
      />

      <Paper sx={{ padding: '16px', mb: 2 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <TextField
              label="MUESTRA"
              fullWidth
              size="small"
              value={muestra}
              onChange={(e) => setMuestra(e.target.value)}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={4}>
            <FormControl fullWidth size="small">
              <InputLabel>GRUPO</InputLabel>
              <Select value={grupo} label="GRUPO" onChange={(e) => setGrupo(e.target.value)}>
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="B">B</MenuItem>
                <MenuItem value="AB">AB</MenuItem>
                <MenuItem value="O">O</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth size="small">
              <InputLabel>FACTOR RH</InputLabel>
              <Select value={factorRh} label="FACTOR RH" onChange={(e) => setFactorRh(e.target.value)}>
                <MenuItem value="Positivo">Positivo (+)</MenuItem>
                <MenuItem value="Negativo">Negativo (-)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Du (Weak D)"
              fullWidth
              size="small"
              value={du}
              onChange={(e) => setDu(e.target.value)}
            />
          </Grid>
        </Grid>

        <Button variant="outlined" sx={{ mb: 2 }}>
          TARJETA
        </Button>
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

export default TipoSangre;
