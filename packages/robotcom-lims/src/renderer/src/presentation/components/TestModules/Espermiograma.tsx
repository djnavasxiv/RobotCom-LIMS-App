import React, { useState } from 'react';
import { Box, TextField, Grid, Paper, Typography } from '@mui/material';
import PatientHeader, { PatientData } from '../common/PatientHeader';
import { NavigationFooter, BillingFooter, PrintButtons } from '../common/ModalFooters';

interface EspermioData {
  // Collection Info
  hColeccion: string;
  hExaminado: string;
  diasAbstinencia: string;

  // Physical Exam
  apariencia: string;
  viscosidad: string;
  gColgante: string;
  color: string;
  licuefaccion: string;
  volumen: string;

  // Microscopic Left
  progresion: string;
  actividad: string;
  grumos: string;
  espmGrumos: string;
  recuento: string;
  vivos1h: string;
  vivos2h: string;

  // Microscopic Right
  desperdCel: string;
  eritrocitos: string;
  bacterias: string;
  leucocitos: string;
  vivos4h: string;
  vivos6h: string;
  espermasNormales: string;
  cabezaAnormal: string;
  celEpiteliales: string;
  cristales: string;
  cuerpoAnormal: string;
  colaAnormal: string;
  celularesInmaduras: string;
  vacuolasCabeza: string;
  citoplasmaDroplets: string;

  observaciones: string;
}

const Espermiograma: React.FC = () => {
  const [patientData, setPatientData] = useState<PatientData>({
    patientId: '',
    patientName: '',
    age: '',
    gender: '',
    doctor: '',
  });

  const [data, setData] = useState<EspermioData>({
    hColeccion: '',
    hExaminado: '',
    diasAbstinencia: '',
    apariencia: '',
    viscosidad: '',
    gColgante: '',
    color: '',
    licuefaccion: '',
    volumen: '',
    progresion: '',
    actividad: '',
    grumos: '',
    espmGrumos: '',
    recuento: '',
    vivos1h: '',
    vivos2h: '',
    desperdCel: '',
    eritrocitos: '',
    bacterias: '',
    leucocitos: '',
    vivos4h: '',
    vivos6h: '',
    espermasNormales: '',
    cabezaAnormal: '',
    celEpiteliales: '',
    cristales: '',
    cuerpoAnormal: '',
    colaAnormal: '',
    celularesInmaduras: '',
    vacuolasCabeza: '',
    citoplasmaDroplets: '',
    observaciones: '',
  });

  const [total, setTotal] = useState('0');
  const [discount, setDiscount] = useState('0');
  const [toPay, setToPay] = useState('0');

  const handleFieldChange = (field: keyof EspermioData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Box sx={{ padding: '16px', backgroundColor: '#fff' }}>
      <h1>ESPERMOGRAMA</h1>

      <PatientHeader
        patientData={patientData}
        onPatientDataChange={(upd) => setPatientData((prev) => ({ ...prev, ...upd }))}
      />

      <Paper sx={{ padding: '16px', mb: 2 }}>
        {/* Collection Info */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1e3a5f' }}>
          INFORMACIÓN DE COLECCIÓN
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <TextField
              label="H. DE COLECCIÓN"
              fullWidth
              size="small"
              value={data.hColeccion}
              onChange={(e) => handleFieldChange('hColeccion', e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="H. DE EXAMINADO"
              fullWidth
              size="small"
              value={data.hExaminado}
              onChange={(e) => handleFieldChange('hExaminado', e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="DIAS ABSTINENCIA"
              fullWidth
              size="small"
              value={data.diasAbstinencia}
              onChange={(e) => handleFieldChange('diasAbstinencia', e.target.value)}
            />
          </Grid>
        </Grid>

        {/* Physical Exam */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1e3a5f' }}>
          EXAMEN FISICO
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <TextField
              label="APARIENCIA"
              fullWidth
              size="small"
              value={data.apariencia}
              onChange={(e) => handleFieldChange('apariencia', e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="VISCOSIDAD"
              fullWidth
              size="small"
              value={data.viscosidad}
              onChange={(e) => handleFieldChange('viscosidad', e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="G. COLGANTE"
              fullWidth
              size="small"
              value={data.gColgante}
              onChange={(e) => handleFieldChange('gColgante', e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="COLOR"
              fullWidth
              size="small"
              value={data.color}
              onChange={(e) => handleFieldChange('color', e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="LICUEFACCION"
              fullWidth
              size="small"
              value={data.licuefaccion}
              onChange={(e) => handleFieldChange('licuefaccion', e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="VOLUMEN (mL)"
              fullWidth
              size="small"
              value={data.volumen}
              onChange={(e) => handleFieldChange('volumen', e.target.value)}
            />
          </Grid>
        </Grid>

        {/* Microscopic Exam */}
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1e3a5f' }}>
          EXAMEN MICROSCOPICO
        </Typography>

        <Grid container spacing={2}>
          {/* Left Column */}
          <Grid item xs={6}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Análisis de Motilidad
            </Typography>
            <TextField
              label="PROGRESIÓN"
              fullWidth
              size="small"
              value={data.progresion}
              onChange={(e) => handleFieldChange('progresion', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="ACTIVIDAD"
              fullWidth
              size="small"
              value={data.actividad}
              onChange={(e) => handleFieldChange('actividad', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="GRUMOS"
              fullWidth
              size="small"
              value={data.grumos}
              onChange={(e) => handleFieldChange('grumos', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="ESPM x GRUMOS"
              fullWidth
              size="small"
              value={data.espmGrumos}
              onChange={(e) => handleFieldChange('espmGrumos', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="RECUENTO"
              fullWidth
              size="small"
              value={data.recuento}
              onChange={(e) => handleFieldChange('recuento', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="VIVOS 1 HRA DESPUÉS"
              fullWidth
              size="small"
              value={data.vivos1h}
              onChange={(e) => handleFieldChange('vivos1h', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="VIVOS 2 HRA DESPUÉS"
              fullWidth
              size="small"
              value={data.vivos2h}
              onChange={(e) => handleFieldChange('vivos2h', e.target.value)}
            />
          </Grid>

          {/* Right Column */}
          <Grid item xs={6}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Morfología y Contaminantes
            </Typography>
            <TextField
              label="DESPERD. CEL."
              fullWidth
              size="small"
              value={data.desperdCel}
              onChange={(e) => handleFieldChange('desperdCel', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="ERITROCITOS"
              fullWidth
              size="small"
              value={data.eritrocitos}
              onChange={(e) => handleFieldChange('eritrocitos', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="BACTERIAS"
              fullWidth
              size="small"
              value={data.bacterias}
              onChange={(e) => handleFieldChange('bacterias', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="LEUCOCITOS"
              fullWidth
              size="small"
              value={data.leucocitos}
              onChange={(e) => handleFieldChange('leucocitos', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="VIVOS 4 H. DESPUÉS"
              fullWidth
              size="small"
              value={data.vivos4h}
              onChange={(e) => handleFieldChange('vivos4h', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="VIVOS 6 H. DESPUÉS"
              fullWidth
              size="small"
              value={data.vivos6h}
              onChange={(e) => handleFieldChange('vivos6h', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="ESPERMAS NORMALES (%)"
              fullWidth
              size="small"
              value={data.espermasNormales}
              onChange={(e) => handleFieldChange('espermasNormales', e.target.value)}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={4}>
            <TextField
              label="CABEZA ANORMAL"
              fullWidth
              size="small"
              value={data.cabezaAnormal}
              onChange={(e) => handleFieldChange('cabezaAnormal', e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="CEL. EPITELIALES"
              fullWidth
              size="small"
              value={data.celEpiteliales}
              onChange={(e) => handleFieldChange('celEpiteliales', e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="CRISTALES"
              fullWidth
              size="small"
              value={data.cristales}
              onChange={(e) => handleFieldChange('cristales', e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="CUERPO ANORMAL"
              fullWidth
              size="small"
              value={data.cuerpoAnormal}
              onChange={(e) => handleFieldChange('cuerpoAnormal', e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="COLA ANORMAL"
              fullWidth
              size="small"
              value={data.colaAnormal}
              onChange={(e) => handleFieldChange('colaAnormal', e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="CELULARES INMADURAS"
              fullWidth
              size="small"
              value={data.celularesInmaduras}
              onChange={(e) => handleFieldChange('celularesInmaduras', e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="VACUOLAS EN CABEZA"
              fullWidth
              size="small"
              value={data.vacuolasCabeza}
              onChange={(e) => handleFieldChange('vacuolasCabeza', e.target.value)}
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              label="CITOPLASMA DROPLETS"
              fullWidth
              size="small"
              value={data.citoplasmaDroplets}
              onChange={(e) => handleFieldChange('citoplasmaDroplets', e.target.value)}
            />
          </Grid>
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

export default Espermiograma;
