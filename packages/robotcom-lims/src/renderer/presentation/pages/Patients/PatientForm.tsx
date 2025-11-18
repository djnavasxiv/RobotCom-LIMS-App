import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Patient } from '../../../domain/entities/Patient';
import { PatientService } from '../../../application/services/PatientService';
import { SecurityService } from '../../../application/services/SecurityService';
import { LoggerService } from '../../../application/services/LoggerService';
import { useAuthStore } from '../../../application/state/authStore';
import { useCsrfToken } from '../../../application/hooks/useCsrfToken';

interface PatientFormProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  patient?: Patient | null;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  address: string;
}

const PatientForm: React.FC<PatientFormProps> = ({ open, onClose, onSave, patient }) => {
  const { handleSubmit, control, reset, formState: { errors } } = useForm<FormData>();
  const patientService = new PatientService();
  const securityService = new SecurityService();
  const logger = new LoggerService();
  const { csrfToken } = useCsrfToken();
  const labId = useAuthStore((state) => state.labId);
  const [securityErrors, setSecurityErrors] = React.useState<Record<string, string>>({});

  useEffect(() => {
    if (patient) {
      reset({
        ...patient,
        birthDate: new Date(patient.birthDate).toISOString().split('T')[0],
        email: patient.email?.value || '',
        phone: patient.phone.value || '',
      });
    } else {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthDate: '',
        gender: 'male',
        address: '',
      });
    }
  }, [patient, open, reset]);

  const onSubmit = async (data: FormData) => {
    if (!labId) {
      logger.error('No labId found, cannot save patient');
      return;
    }

    // Validate CSRF token
    if (!csrfToken) {
      logger.warn('CSRF token not available');
      setSecurityErrors({ form: 'Token de seguridad no disponible, por favor recargue la página' });
      return;
    }

    // Validate form data for security issues
    const validation = securityService.validatePatientForm(data);
    if (!validation.isValid) {
      logger.warn('Security validation failed', validation.errors);
      setSecurityErrors(validation.errors);
      return;
    }

    // Sanitize form data
    const sanitizedData = securityService.sanitizePatientForm(data);

    try {
      if (patient) {
        await patientService.updatePatient(patient.id, sanitizedData);
        logger.info('Patient updated successfully', { patientId: patient.id });
      } else {
        await patientService.createPatient({ 
          ...sanitizedData, 
          birthDate: new Date(sanitizedData.birthDate), 
          labId 
        });
        logger.info('Patient created successfully');
      }
      setSecurityErrors({});
      onSave();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('Failed to save patient', { error: errorMessage });
      setSecurityErrors({ form: 'Error al guardar el paciente. Por favor intente de nuevo.' });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{patient ? 'Editar Paciente' : 'Añadir Paciente'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {securityErrors.form && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {securityErrors.form}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="firstName"
                control={control}
                defaultValue=""
                rules={{ required: 'El nombre es obligatorio' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre"
                    fullWidth
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="lastName"
                control={control}
                defaultValue=""
                rules={{ required: 'El apellido es obligatorio' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Apellido"
                    fullWidth
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{ pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email inválido' } }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    fullWidth
                    error={!!errors.email || !!securityErrors.email}
                    helperText={errors.email?.message || securityErrors.email}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="phone"
                control={control}
                defaultValue=""
                rules={{ required: 'El teléfono es obligatorio' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Teléfono"
                    fullWidth
                    error={!!errors.phone || !!securityErrors.phone}
                    helperText={errors.phone?.message || securityErrors.phone}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="birthDate"
                control={control}
                defaultValue=""
                rules={{ required: 'La fecha de nacimiento es obligatoria' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Fecha de Nacimiento"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.birthDate}
                    helperText={errors.birthDate?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="gender"
                control={control}
                defaultValue="male"
                render={({ field }) => (
                  <TextField {...field} label="Género" select fullWidth>
                    <MenuItem value="male">Masculino</MenuItem>
                    <MenuItem value="female">Femenino</MenuItem>
                    <MenuItem value="other">Otro</MenuItem>
                  </TextField>
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">Guardar</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PatientForm;
