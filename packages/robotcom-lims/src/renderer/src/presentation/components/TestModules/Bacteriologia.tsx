import React, { useState } from 'react';
import {
  Box,
  TextField,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
} from '@mui/material';
import PatientHeader, { PatientData } from '../common/PatientHeader';
import { NavigationFooter, BillingFooter, PrintButtons } from '../common/ModalFooters';

interface AntibiogramData {
  [organism: string]: {
    antibiotic: string;
    susceptible: boolean;
    intermediate: boolean;
    resistant: boolean;
  }[];
}

const Bacteriologia: React.FC = () => {
  const [patientData, setPatientData] = useState<PatientData>({
    patientId: '',
    patientName: '',
    age: '',
    gender: '',
    doctor: '',
  });

  const [muestra, setMuestra] = useState('');
  const [muestraOtra, setMuestraOtra] = useState(false);
  const [examen, setExamen] = useState('UROCULTIVO');
  const [resultado, setResultado] = useState('');
  const [viewMode, setViewMode] = useState<'resultado' | 'antibiograma'>('resultado');
  const [observaciones, setObservaciones] = useState('');

  const [total, setTotal] = useState('0');
  const [discount, setDiscount] = useState('0');
  const [toPay, setToPay] = useState('0');

  const antibiotics = [
    'Ampicilina',
    'Amoxicilina',
    'Amoxicilina-Clavulánico',
    'Piperacilina',
    'Piperacilina-Tazobactam',
    'Cefalotina',
    'Cefoxitina',
    'Cefotaxima',
    'Ceftazidima',
    'Cefepima',
    'Imipenem',
    'Meropenem',
    'Ciprofloxacino',
    'Gentamicina',
    'Tobramicina',
    'Trimetoprima-Sulfametoxazol',
    'Nitrofurantoína',
    'Vancomicina',
  ];

  return (
    <Box sx={{ padding: '16px', backgroundColor: '#fff' }}>
      <h1>BACTERIOLOGÍA</h1>

      <PatientHeader
        patientData={patientData}
        onPatientDataChange={(upd) => setPatientData((prev) => ({ ...prev, ...upd }))}
      />

      <Paper sx={{ padding: '16px', mb: 2 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={4}>
            <TextField
              label="MUESTRA"
              fullWidth
              size="small"
              value={muestra}
              onChange={(e) => setMuestra(e.target.value)}
            />
          </Grid>
          <Grid item xs={8}>
            <FormControlLabel
              control={<Checkbox checked={muestraOtra} onChange={(e) => setMuestraOtra(e.target.checked)} />}
              label="DIGITAR OTRO TIPO DE MUESTRA"
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <TextField
              label="EXAMEN"
              fullWidth
              size="small"
              value={examen}
              onChange={(e) => setExamen(e.target.value)}
            />
          </Grid>
        </Grid>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button
              variant={viewMode === 'resultado' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('resultado')}
            >
              RESULTADO
            </Button>
            <Button
              variant={viewMode === 'antibiograma' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('antibiograma')}
            >
              ANTIBIOGRAMA
            </Button>
          </Box>

          {viewMode === 'resultado' && (
            <TextField
              label="RESULTADO"
              multiline
              rows={6}
              fullWidth
              value={resultado}
              onChange={(e) => setResultado(e.target.value)}
              placeholder="Ej: 100,000 CFU/mL de E. coli
Sensible a: Ampicilina, Trimetoprima-Sulfametoxazol
Resistente a: Ampicilina-Clavulánico"
            />
          )}

          {viewMode === 'antibiograma' && (
            <TableContainer component={Paper} sx={{ maxHeight: '500px', overflowY: 'auto' }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#1e3a5f' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '25%' }}>ANTIBIÓTICO</TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', width: '25%' }}>
                      S (Susceptible)
                    </TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', width: '25%' }}>
                      I (Intermedio)
                    </TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold', width: '25%' }}>
                      R (Resistente)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {antibiotics.map((antibiotic) => (
                    <TableRow key={antibiotic}>
                      <TableCell sx={{ fontSize: '12px' }}>{antibiotic}</TableCell>
                      <TableCell align="center">
                        <Checkbox size="small" />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox size="small" />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button variant="outlined" size="small">
            MOD. DIPOS
          </Button>
          <Button variant="outlined" size="small">
            ADD TEST
          </Button>
          <Button variant="outlined" size="small">
            RECUENTO BACTERIA
          </Button>
        </Box>
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

export default Bacteriologia;
