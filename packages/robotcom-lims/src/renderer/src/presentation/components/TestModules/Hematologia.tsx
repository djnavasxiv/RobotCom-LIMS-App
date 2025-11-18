import React, { useState, useEffect } from 'react';
import { Box, TextField, Grid, Button, Paper } from '@mui/material';
import PatientHeader, { PatientData } from '../common/PatientHeader';
import { NavigationFooter, BillingFooter, PrintButtons } from '../common/ModalFooters';

interface HematologyData {
  muestra: string;
  hematocrito: string;
  hemoglobina: string;
  globulosRojos: string;
  vcm: string;
  hbcm: string;
  chbcm: string;
  plaquetas: string;
  reticulocitos: string;
  eritrosedimentacion: string;
  globulosBlancos: string;
  neutrofilosBanda: string;
  neutrofilosSegmentados: string;
  eosinofilos: string;
  basofilos: string;
  linfocitos: string;
  monocitos: string;
  suma: string;
  celulasLE: string;
  gotaGruesa: string;
  observaciones: string;
}

const Hematologia: React.FC = () => {
  const [patientData, setPatientData] = useState<PatientData>({
    patientId: '',
    patientName: '',
    age: '',
    gender: '',
    doctor: '',
  });

  const [data, setData] = useState<HematologyData>({
    muestra: 'SANGRE COMPLETA',
    hematocrito: '',
    hemoglobina: '',
    globulosRojos: '',
    vcm: '',
    hbcm: '',
    chbcm: '',
    plaquetas: '',
    reticulocitos: '',
    eritrosedimentacion: '',
    globulosBlancos: '',
    neutrofilosBanda: '',
    neutrofilosSegmentados: '',
    eosinofilos: '',
    basofilos: '',
    linfocitos: '',
    monocitos: '',
    suma: '',
    celulasLE: '',
    gotaGruesa: '',
    observaciones: '',
  });

  const [total, setTotal] = useState('0');
  const [discount, setDiscount] = useState('0');
  const [toPay, setToPay] = useState('0');

  // Auto-calculate sum of differential counts
  useEffect(() => {
    const sum =
      (parseFloat(data.neutrofilosBanda) || 0) +
      (parseFloat(data.neutrofilosSegmentados) || 0) +
      (parseFloat(data.eosinofilos) || 0) +
      (parseFloat(data.basofilos) || 0) +
      (parseFloat(data.linfocitos) || 0) +
      (parseFloat(data.monocitos) || 0);
    setData((prev) => ({ ...prev, suma: sum.toString() }));
  }, [
    data.neutrofilosBanda,
    data.neutrofilosSegmentados,
    data.eosinofilos,
    data.basofilos,
    data.linfocitos,
    data.monocitos,
  ]);

  const handleFieldChange = (field: keyof HematologyData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Box sx={{ padding: '16px', backgroundColor: '#fff' }}>
      <h1>HEMATOLOGÍA</h1>

      <PatientHeader
        patientData={patientData}
        onPatientDataChange={(upd) => setPatientData((prev) => ({ ...prev, ...upd }))}
      />

      <Box sx={{ mb: 2 }}>
        <TextField
          label="MUESTRA"
          size="small"
          value={data.muestra}
          onChange={(e) => handleFieldChange('muestra', e.target.value)}
          sx={{ width: '200px' }}
        />
      </Box>

      <Paper sx={{ padding: '16px', mb: 2 }}>
        <Grid container spacing={2}>
          {/* Column 1 */}
          <Grid item xs={4}>
            <TextField
              label="HEMATOCRITO (%)"
              fullWidth
              size="small"
              value={data.hematocrito}
              onChange={(e) => handleFieldChange('hematocrito', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="HEMOGLOBINA (g/dL)"
              fullWidth
              size="small"
              value={data.hemoglobina}
              onChange={(e) => handleFieldChange('hemoglobina', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="GLOB. ROJOS (M/μL)"
              fullWidth
              size="small"
              value={data.globulosRojos}
              onChange={(e) => handleFieldChange('globulosRojos', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="VCM (fL)"
              fullWidth
              size="small"
              value={data.vcm}
              onChange={(e) => handleFieldChange('vcm', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="HbCM (pg)"
              fullWidth
              size="small"
              value={data.hbcm}
              onChange={(e) => handleFieldChange('hbcm', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="CHbCM (g/dL)"
              fullWidth
              size="small"
              value={data.chbcm}
              onChange={(e) => handleFieldChange('chbcm', e.target.value)}
            />
          </Grid>

          {/* Column 2 */}
          <Grid item xs={4}>
            <TextField
              label="PLAQUETAS (K/μL)"
              fullWidth
              size="small"
              value={data.plaquetas}
              onChange={(e) => handleFieldChange('plaquetas', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="RETICULOCITOS (%)"
              fullWidth
              size="small"
              value={data.reticulocitos}
              onChange={(e) => handleFieldChange('reticulocitos', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="ERITROSEDIMENTACION (mm/h)"
              fullWidth
              size="small"
              value={data.eritrosedimentacion}
              onChange={(e) => handleFieldChange('eritrosedimentacion', e.target.value)}
            />
          </Grid>

          {/* Column 3 - Differential */}
          <Grid item xs={4}>
            <TextField
              label="GLOB. BLANCOS (K/μL)"
              fullWidth
              size="small"
              value={data.globulosBlancos}
              onChange={(e) => handleFieldChange('globulosBlancos', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="NEUTRÓFILOS En Banda (%)"
              fullWidth
              size="small"
              value={data.neutrofilosBanda}
              onChange={(e) => handleFieldChange('neutrofilosBanda', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="NEUTRÓFILOS Segmentados (%)"
              fullWidth
              size="small"
              value={data.neutrofilosSegmentados}
              onChange={(e) => handleFieldChange('neutrofilosSegmentados', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="EOSINÓFILOS (%)"
              fullWidth
              size="small"
              value={data.eosinofilos}
              onChange={(e) => handleFieldChange('eosinofilos', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="BASÓFILOS (%)"
              fullWidth
              size="small"
              value={data.basofilos}
              onChange={(e) => handleFieldChange('basofilos', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="LINFOCITOS (%)"
              fullWidth
              size="small"
              value={data.linfocitos}
              onChange={(e) => handleFieldChange('linfocitos', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="MONOCITOS (%)"
              fullWidth
              size="small"
              value={data.monocitos}
              onChange={(e) => handleFieldChange('monocitos', e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="S U M A S"
              fullWidth
              size="small"
              value={data.suma}
              disabled
              sx={{ mb: 1, backgroundColor: '#f0f0f0' }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <TextField
              label="CELULAS LE"
              fullWidth
              size="small"
              value={data.celulasLE}
              onChange={(e) => handleFieldChange('celulasLE', e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="GOTA GRUESA"
              fullWidth
              size="small"
              value={data.gotaGruesa}
              onChange={(e) => handleFieldChange('gotaGruesa', e.target.value)}
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

export default Hematologia;
