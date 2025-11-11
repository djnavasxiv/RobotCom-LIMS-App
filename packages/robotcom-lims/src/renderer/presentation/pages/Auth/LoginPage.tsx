import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  CircularProgress,
} from '@mui/material';
import { useAuthStore } from '../../application/state/authStore';

const LoginPage: React.FC = () => {
  const { handleSubmit, control } = useForm();
  const { login, isLoading, error } = useAuthStore();

  const onSubmit = (data: any) => {
    login(data.username, data.password);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Iniciar Sesión
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
          <Controller
            name="username"
            control={control}
            defaultValue=""
            rules={{ required: 'El nombre de usuario es obligatorio' }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label="Nombre de Usuario"
                autoFocus
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{ required: 'La contraseña es obligatoria' }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label="Contraseña"
                type="password"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          {error && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Ingresar'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
