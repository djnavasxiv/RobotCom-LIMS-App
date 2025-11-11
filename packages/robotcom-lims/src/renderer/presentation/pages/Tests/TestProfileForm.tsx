import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Chip,
  Box,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { TestProfile } from '../../../domain/entities/TestProfile';
import { Test } from '../../../domain/entities/Test';
import { TestProfileService } from '../../../application/services/TestProfileService';

interface TestProfileFormProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  profile?: TestProfile | null;
}

interface FormData {
  name: string;
  description: string;
  testIds: string[];
}

const TestProfileForm: React.FC<TestProfileFormProps> = ({ open, onClose, onSave, profile }) => {
  const { handleSubmit, control, reset, formState: { errors } } = useForm<FormData>();
  const [allTests, setAllTests] = useState<Test[]>([]);
  const testProfileService = new TestProfileService();

  useEffect(() => {
    if (open) {
      testProfileService.getAllTests().then(setAllTests);
    }
  }, [open]);

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        description: profile.description || '',
        testIds: profile.tests.map(t => t.id),
      });
    } else {
      reset({ name: '', description: '', testIds: [] });
    }
  }, [profile, open, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (profile) {
        await testProfileService.updateTestProfile(profile.id, data.name, data.description, data.testIds);
      } else {
        await testProfileService.createTestProfile(data.name, data.description, data.testIds);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{profile ? 'Editar Perfil de Examen' : 'Añadir Perfil de Examen'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{ required: 'El nombre del perfil es obligatorio' }}
                render={({ field }) => (
                  <TextField {...field} label="Nombre del Perfil" fullWidth error={!!errors.name} helperText={errors.name?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                defaultValue=""
                render={({ field }) => <TextField {...field} label="Descripción" fullWidth multiline rows={2} />}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Exámenes</InputLabel>
                <Controller
                  name="testIds"
                  control={control}
                  defaultValue={[]}
                  rules={{ required: 'Se requiere al menos un examen' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      multiple
                      input={<OutlinedInput label="Exámenes" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((id) => {
                            const test = allTests.find(t => t.id === id);
                            return <Chip key={id} label={test?.name || id} />;
                          })}
                        </Box>
                      )}
                    >
                      {allTests.map((test) => (
                        <MenuItem key={test.id} value={test.id}>
                          {test.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
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

export default TestProfileForm;
