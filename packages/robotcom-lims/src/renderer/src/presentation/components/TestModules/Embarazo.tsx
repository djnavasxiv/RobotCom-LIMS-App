import React, { useState } from 'react';
import { Box, TextField, Button, Grid, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import PatientHeader, { PatientData } from '../common/PatientHeader';
import { NavigationFooter, BillingFooter, PrintButtons } from '../common/ModalFooters';

const Embarazo: React.FC = () => {
  const [patientData, setPatientData] = useState<PatientData>({
    patientId: '',
    patientName: '',
    age: '',
    gender: '',
    doctor: '',
  });

  const [pruebaTipo, setPruebaTipo] = useState('SANGRE');
  const [resultadoFecha, setResultadoFecha] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const [total, setTotal] = useState('0');
  const [discount, setDiscount] = useState('0');
  const [toPay, setToPay] = useState('0');

  return (
    <Box sx={{ padding: '16px', backgroundColor: '#fff' }}>
      <h1>PRUEBA DE EMBARAZO</h1>

      <PatientHeader
        patientData={patientData}
        onPatientDataChange={(upd) => setPatientData((prev) => ({ ...prev, ...upd }))}
      />

      <Paper sx={{ padding: '16px', mb: 2 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel>PRUEBA DE EMBARAZO EN</InputLabel>
              <Select value={pruebaTipo} label="PRUEBA DE EMBARAZO EN" onChange={(e) => setPruebaTipo(e.target.value)}>
                <MenuItem value="SANGRE">SANGRE</MenuItem>
                <MenuItem value="ORINA">ORINA</MenuItem>
                <MenuItem value="AMBAS">AMBAS</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="RESULTADO/FECHA"
              fullWidth
              size="small"
              value={resultadoFecha}
              onChange={(e) => setResultadoFecha(e.target.value)}
              placeholder="Ej: POSITIVO - 2024-11-17"
            />
          </Grid>
        </Grid>
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

export default Embarazo;
