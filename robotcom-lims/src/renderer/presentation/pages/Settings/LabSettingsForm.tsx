import React, { useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { LabService } from '../../../application/services/LabService';

interface FormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
  customText1: string;
  customText2: string;
}

const LabSettingsForm: React.FC = () => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const labService = new LabService();

  useEffect(() => {
    setLoading(true);
    labService.getLabSettings()
      .then(settings => {
        if (settings) {
          reset(settings);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await labService.updateLabSettings(data);
      // Show success message
    } catch (error) {
      console.error('Failed to update settings:', error);
      // Show error message
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Configuración y Marca del Laboratorio
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: 'El nombre del laboratorio es obligatorio' }}
              render={({ field }) => (
                <TextField {...field} label="Nombre del Laboratorio" fullWidth error={!!errors.name} helperText={errors.name?.message} />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="address"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField {...field} label="Dirección" fullWidth multiline rows={2} />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="phone"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField {...field} label="Teléfono" fullWidth />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField {...field} label="Email" fullWidth />
              )}
            />
          </Grid>
          <Grid item xs={12}>
             <Typography sx={{mb: 1}}>Subir Logo (placeholder)</Typography>
             <Button variant="outlined">Subir Logo</Button>
          </Grid>
           <Grid item xs={12} sm={6}>
            <Controller
              name="customText1"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField {...field} label="Campo de Texto Personalizado 1" fullWidth />
              )}
            />
          </Grid>
           <Grid item xs={12} sm={6}>
            <Controller
              name="customText2"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField {...field} label="Campo de Texto Personalizado 2" fullWidth />
              )}
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            <Button type="submit" variant="contained">
              Guardar Configuración
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default LabSettingsForm;
