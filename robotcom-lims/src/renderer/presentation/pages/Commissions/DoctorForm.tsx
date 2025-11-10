import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Doctor } from '../../../domain/entities/Doctor';
import { DoctorService } from '../../../application/services/DoctorService';

interface DoctorFormProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  doctor?: Doctor | null;
}

const DoctorForm: React.FC<DoctorFormProps> = ({ open, onClose, onSave, doctor }) => {
  const { handleSubmit, control, reset, formState: { errors } } = useForm();
  const doctorService = new DoctorService();

  useEffect(() => {
    if (doctor) {
      reset(doctor);
    } else {
      reset({
        firstName: '',
        lastName: '',
        specialty: '',
        phone: '',
        email: '',
        commissionRate: 0,
      });
    }
  }, [doctor, open, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (doctor) {
        await doctorService.updateDoctor(doctor.id, data);
      } else {
        await doctorService.createDoctor(data);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to save doctor:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{doctor ? 'Editar Doctor' : 'Añadir Doctor'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Controller name="firstName" control={control} rules={{ required: true }} render={({ field }) => <TextField {...field} label="Nombre" fullWidth required />} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="lastName" control={control} rules={{ required: true }} render={({ field }) => <TextField {...field} label="Apellido" fullWidth required />} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="specialty" control={control} render={({ field }) => <TextField {...field} label="Especialidad" fullWidth />} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="commissionRate" control={control} render={({ field }) => <TextField {...field} label="Tasa de Comisión (%)" type="number" fullWidth />} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="phone" control={control} render={({ field }) => <TextField {...field} label="Teléfono" fullWidth />} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="email" control={control} render={({ field }) => <TextField {...field} label="Email" fullWidth />} />
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

export default DoctorForm;
