import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';

interface DiversosFormData {
  testName: string;
  patientId: string;
  sampleId: string;
  result: string;
  notes: string;
}

const Diversos: React.FC = () => {
  const [formData, setFormData] = useState<DiversosFormData>({
    testName: '',
    patientId: '',
    sampleId: '',
    result: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.testName || !formData.patientId || !formData.sampleId) {
        throw new Error('Por favor completa todos los campos requeridos');
      }

      // Here you would normally save to database
      console.log('Saving miscellaneous test data:', formData);

      setSuccess('Prueba miscelánea guardada exitosamente');
      setFormData({
        testName: '',
        patientId: '',
        sampleId: '',
        result: '',
        notes: '',
      });

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#1e3a5f', fontWeight: 'bold' }}>
        Pruebas Misceláneas (Diversos)
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre de Prueba *"
                  name="testName"
                  value={formData.testName}
                  onChange={handleChange}
                  placeholder="Ej: Prueba Especial"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ID Paciente *"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  placeholder="Ej: PAC-001"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ID Muestra *"
                  name="sampleId"
                  value={formData.sampleId}
                  onChange={handleChange}
                  placeholder="Ej: S-001"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Resultado"
                  name="result"
                  value={formData.result}
                  onChange={handleChange}
                  placeholder="Ingresa resultado de prueba"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notas Adicionales"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Notas o observaciones"
                  multiline
                  rows={4}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      backgroundColor: '#1976d2',
                      '&:hover': { backgroundColor: '#1565c0' },
                    }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Guardando...
                      </>
                    ) : (
                      'GUARDAR'
                    )}
                  </Button>
                  <Button
                    type="reset"
                    variant="outlined"
                    onClick={() =>
                      setFormData({
                        testName: '',
                        patientId: '',
                        sampleId: '',
                        result: '',
                        notes: '',
                      })
                    }
                  >
                    LIMPIAR
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="body2" sx={{ mt: 3, color: '#666' }}>
        * Campos requeridos
      </Typography>
    </Box>
  );
};

export default Diversos;
