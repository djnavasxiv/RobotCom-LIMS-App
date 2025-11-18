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
} from '@mui/material';
import PatientHeader, { PatientData } from '../common/PatientHeader';
import { NavigationFooter, BillingFooter, PrintButtons } from '../common/ModalFooters';

interface ElisaAnalyte {
  name: string;
  result: string;
  unit: string;
}

const ELISA: React.FC = () => {
  const [patientData, setPatientData] = useState<PatientData>({
    patientId: '',
    patientName: '',
    age: '',
    gender: '',
    doctor: '',
  });

  const [muestra, setMuestra] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const [gridData, setGridData] = useState<ElisaAnalyte[][]>([
    [
      { name: 'VIH 1 + 2 (TOTAL)', result: '', unit: 'mIU/mL' },
      { name: 'HEPATITIS B (HBsAg)', result: '', unit: 'mIU/mL' },
      { name: 'HEPATITIS C (Anti-HCV)', result: '', unit: 'mIU/mL' },
    ],
    [
      { name: 'SÍFILIS (RPR/VDRL)', result: '', unit: 'TITER' },
      { name: 'RUBÉOLA IgG', result: '', unit: 'IU/mL' },
      { name: 'DENGUE NS1 Ag', result: '', unit: 'mIU/mL' },
    ],
    [
      { name: 'COVID-19 IgM', result: '', unit: 'Index' },
      { name: 'COVID-19 IgG', result: '', unit: 'Index' },
      { name: 'MALARIA P. falciparum', result: '', unit: 'U/mL' },
    ],
  ]);

  const [total, setTotal] = useState('0');
  const [discount, setDiscount] = useState('0');
  const [toPay, setToPay] = useState('0');

  const handleAnalyteChange = (gridIdx: number, itemIdx: number, field: keyof ElisaAnalyte, value: string) => {
    const newGridData = gridData.map((grid, gIdx) =>
      gIdx === gridIdx
        ? grid.map((item, iIdx) => (iIdx === itemIdx ? { ...item, [field]: value } : item))
        : grid
    );
    setGridData(newGridData);
  };

  return (
    <Box sx={{ padding: '16px', backgroundColor: '#fff' }}>
      <h1>PRUEBAS ESPECIALES ELISA</h1>

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
        </Grid>

        <Grid container spacing={2}>
          {gridData.map((column, gridIdx) => (
            <Grid item xs={4} key={gridIdx}>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#1e3a5f' }}>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ANÁLISIS</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>RESULT.</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>UNIDAD</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {column.map((analyte, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ fontSize: '11px' }}>{analyte.name}</TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            value={analyte.result}
                            onChange={(e) => handleAnalyteChange(gridIdx, idx, 'result', e.target.value)}
                            sx={{ width: '100%' }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            value={analyte.unit}
                            onChange={(e) => handleAnalyteChange(gridIdx, idx, 'unit', e.target.value)}
                            sx={{ width: '100%' }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          ))}
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

export default ELISA;
