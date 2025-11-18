import React, { useState } from 'react';
import { Box, TextField, Grid, Button, Paper } from '@mui/material';
import PatientHeader, { PatientData } from '../common/PatientHeader';
import { NavigationFooter, BillingFooter, PrintButtons } from '../common/ModalFooters';

interface SimpleTestFormProps {
  title: string;
  showMuestra?: boolean;
  agglutinationFields?: string[];
  hasCardButton?: boolean;
}

const SimpleTestForm: React.FC<SimpleTestFormProps> = ({
  title,
  showMuestra = true,
  agglutinationFields = [],
  hasCardButton = false,
}) => {
  const [patientData, setPatientData] = useState<PatientData>({
    patientId: '',
    patientName: '',
    age: '',
    gender: '',
    doctor: '',
  });

  const [muestra, setMuestra] = useState('');
  const [hMuestra, setHMuestra] = useState('');
  const [hExamen, setHExamen] = useState('');
  const [examen, setExamen] = useState('');
  const [resultado, setResultado] = useState('');
  const [agglutination, setAgglutination] = useState<{ [key: string]: string }>(
    Object.fromEntries(agglutinationFields.map((field) => [field, '']))
  );
  const [observaciones, setObservaciones] = useState('');

  const [total, setTotal] = useState('0');
  const [discount, setDiscount] = useState('0');
  const [toPay, setToPay] = useState('0');

  return (
    <Box sx={{ padding: '16px', backgroundColor: '#fff' }}>
      <h1>{title}</h1>

      <PatientHeader
        patientData={patientData}
        onPatientDataChange={(upd) => setPatientData((prev) => ({ ...prev, ...upd }))}
      />

      <Paper sx={{ padding: '16px', mb: 2 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {showMuestra && (
            <Grid item xs={4}>
              <TextField
                label="MUESTRA"
                fullWidth
                size="small"
                value={muestra}
                onChange={(e) => setMuestra(e.target.value)}
              />
            </Grid>
          )}
          <Grid item xs={2}>
            <TextField
              label="H. MUESTRA"
              fullWidth
              size="small"
              value={hMuestra}
              onChange={(e) => setHMuestra(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="H. EXAMEN"
              fullWidth
              size="small"
              value={hExamen}
              onChange={(e) => setHExamen(e.target.value)}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <TextField
              label="EXAMEN"
              fullWidth
              size="small"
              value={examen}
              onChange={(e) => setExamen(e.target.value)}
              placeholder="Nombre del examen"
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <TextField
              label="RESULTADO"
              fullWidth
              multiline
              rows={4}
              value={resultado}
              onChange={(e) => setResultado(e.target.value)}
              placeholder="Ingrese el resultado del examen"
            />
          </Grid>
        </Grid>

        {agglutinationFields.length > 0 && (
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {agglutinationFields.map((field) => (
              <Grid item xs={6} key={field}>
                <TextField
                  label={field}
                  fullWidth
                  size="small"
                  value={agglutination[field] || ''}
                  onChange={(e) =>
                    setAgglutination((prev) => ({
                      ...prev,
                      [field]: e.target.value,
                    }))
                  }
                />
              </Grid>
            ))}
          </Grid>
        )}

        {hasCardButton && (
          <Button variant="outlined" sx={{ mb: 2 }}>
            TARJETA VDRL
          </Button>
        )}
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

export default SimpleTestForm;
