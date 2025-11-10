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
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Patient } from '../../../domain/entities/Patient';
import { PatientService } from '../../../application/services/PatientService';

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
    try {
      const labId = 'current-lab-id'; // Replace with auth context
      if (patient) {
        await patientService.updatePatient(patient.id, data);
      } else {
        await patientService.createPatient({ ...data, birthDate: new Date(data.birthDate), labId });
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to save patient:', error);
      // You might want to show an error to the user here
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{patient ? 'Edit Patient' : 'Add Patient'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="firstName"
                control={control}
                defaultValue=""
                rules={{ required: 'First name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name"
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
                rules={{ required: 'Last name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name"
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
                rules={{ pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="phone"
                control={control}
                defaultValue=""
                rules={{ required: 'Phone is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone"
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="birthDate"
                control={control}
                defaultValue=""
                rules={{ required: 'Birth date is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Birth Date"
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
                  <TextField {...field} label="Gender" select fullWidth>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
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
                  <TextField {...field} label="Address" fullWidth multiline rows={2} />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PatientForm;
