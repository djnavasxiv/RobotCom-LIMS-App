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
  Checkbox,
  Typography,
} from '@mui/material';
import PatientHeader, { PatientData } from '../common/PatientHeader';
import { NavigationFooter, BillingFooter, PrintButtons } from '../common/ModalFooters';

interface ParasiteItem {
  name: string;
  trofozoitos?: boolean;
  quistes?: boolean;
  huevos?: boolean;
  larvas?: boolean;
}

const Heces: React.FC = () => {
  const [patientData, setPatientData] = useState<PatientData>({
    patientId: '',
    patientName: '',
    age: '',
    gender: '',
    doctor: '',
  });

  const [muestra] = useState('HECES');
  const [color, setColor] = useState('');
  const [consistencia, setConsistencia] = useState('');
  const [mucus, setMucus] = useState('');
  const [bacterias, setBacterias] = useState('');
  const [hematies, setHematies] = useState('');
  const [leucocitos, setLeucocitos] = useState('');
  const [alimenticios, setAlimenticios] = useState('');
  const [macroscopicos, setMacroscopicos] = useState('');
  const [microscopicos, setMicroscopicos] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const [total, setTotal] = useState('0');
  const [discount, setDiscount] = useState('0');
  const [toPay, setToPay] = useState('0');

  const protozoa: ParasiteItem[] = [
    { name: 'Endolimax nana', trofozoitos: false, quistes: false },
    { name: 'Entamoeba histolytica', trofozoitos: false, quistes: false },
    { name: 'Entamoeba coli', trofozoitos: false, quistes: false },
    { name: 'Entamoeba hartmanni', trofozoitos: false, quistes: false },
    { name: 'Crysptosporidium parvum', trofozoitos: false, quistes: false },
    { name: 'Cyclospora cayetanensis', trofozoitos: false, quistes: false },
    { name: 'Entamoeba polecki', trofozoitos: false, quistes: false },
    { name: 'Chilomastix mesnili', trofozoitos: false, quistes: false },
    { name: 'Iodamoeba butschlii', trofozoitos: false, quistes: false },
    { name: 'Giardia lamblia', trofozoitos: false, quistes: false },
    { name: 'Dientamoeba fragilis', trofozoitos: false, quistes: false },
    { name: 'Blastocystis hominis', trofozoitos: false, quistes: false },
    { name: 'Trichomonas hominis', trofozoitos: false, quistes: false },
    { name: 'Retortamonas intestinalis', trofozoitos: false, quistes: false },
  ];

  const helmintos: ParasiteItem[] = [
    { name: 'Ascaris lumbricoides', huevos: false },
    { name: 'Trichuris trichiura', huevos: false },
    { name: 'Enterobius vermicularis', huevos: false },
    { name: 'Strongyloides stercoralis', huevos: false },
    { name: 'Uncinarias SPP', huevos: false },
    { name: 'Clonorchis sinensis', huevos: false },
    { name: 'Schistosoma mansoni', huevos: false },
    { name: 'Hymenolepis nana', huevos: false },
    { name: 'Hymenolepis diminuta', huevos: false },
    { name: 'Diphyllobothrium latum', huevos: false },
    { name: 'Fasciola hepatica', huevos: false },
    { name: 'Paragonimus westermani', huevos: false },
    { name: 'Schistosoma japonicum', huevos: false },
  ];

  return (
    <Box sx={{ padding: '16px', backgroundColor: '#fff' }}>
      <h1>ANÁLISIS DE HECES</h1>

      <PatientHeader
        patientData={patientData}
        onPatientDataChange={(upd) => setPatientData((prev) => ({ ...prev, ...upd }))}
      />

      <Box sx={{ mb: 2 }}>
        <TextField
          label="MUESTRA"
          size="small"
          value={muestra}
          disabled
          sx={{ width: '200px', backgroundColor: '#f0f0f0' }}
        />
      </Box>

      <Paper sx={{ padding: '16px', mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1e3a5f' }}>
          EXAMEN FISICO - QUIMICO
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <TextField fullWidth size="small" label="COLOR" value={color} onChange={(e) => setColor(e.target.value)} />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              label="CONSISTENCIA"
              value={consistencia}
              onChange={(e) => setConsistencia(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField fullWidth size="small" label="MUCUS" value={mucus} onChange={(e) => setMucus(e.target.value)} />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              size="small"
              label="BACTERIAS"
              value={bacterias}
              onChange={(e) => setBacterias(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              size="small"
              label="HEMATIES"
              value={hematies}
              onChange={(e) => setHematies(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              size="small"
              label="LEUCOCITOS"
              value={leucocitos}
              onChange={(e) => setLeucocitos(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              size="small"
              label="RESTOS ALIMENTICIOS"
              value={alimenticios}
              onChange={(e) => setAlimenticios(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              size="small"
              label="MACROSCOPICOS"
              value={macroscopicos}
              onChange={(e) => setMacroscopicos(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              size="small"
              label="MICROSCOPICOS"
              value={microscopicos}
              onChange={(e) => setMicroscopicos(e.target.value)}
            />
          </Grid>
        </Grid>

        {/* Protozoa Section */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1e3a5f' }}>
          PROTOZOARIOS
        </Typography>

        <TableContainer component={Paper} sx={{ mb: 3, maxHeight: '300px', overflowY: 'auto' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1e3a5f' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ORGANISMO</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
                  TROFOZOITOS
                </TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
                  SEL.
                </TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
                  QUISTES
                </TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
                  SEL.
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {protozoa.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ fontSize: '12px' }}>{item.name}</TableCell>
                  <TableCell align="center">
                    <Checkbox size="small" />
                  </TableCell>
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

        {/* Helmintos Section */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1e3a5f' }}>
          HELMINTOS
        </Typography>

        <TableContainer component={Paper} sx={{ mb: 3, maxHeight: '300px', overflowY: 'auto' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1e3a5f' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ORGANISMO</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
                  HUEVOS
                </TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
                  SEL.
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {helmintos.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ fontSize: '12px' }}>{item.name}</TableCell>
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

export default Heces;
