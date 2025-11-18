import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuthStore } from '../../application/state/authStore';
import { SecurityService } from '../../application/services/SecurityService';
import { LoggerService } from '../../application/services/LoggerService';
import { useCsrfToken } from '../../application/hooks/useCsrfToken';

const LoginPage: React.FC = () => {
  const { handleSubmit, control } = useForm();
  const { login, isLoading, error } = useAuthStore();
  const securityService = new SecurityService();
  const logger = new LoggerService();
  const { csrfToken } = useCsrfToken();
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [rateLimiter] = useState(securityService.createRateLimiter(5, 900000)); // 15 min window

  const onSubmit = (data: any) => {
    // Check rate limiting
    const identifier = `login_${data.username}`;
    if (!rateLimiter.check(identifier)) {
      const attempts = rateLimiter.getAttempts(identifier);
      logger.warn('Login rate limited', { username: data.username, attempts });
      setIsBlocked(true);
      setLoginAttempts(attempts);
      return;
    }

    // Validate CSRF token
    if (!csrfToken) {
      logger.warn('CSRF token missing during login');
      return;
    }

    // Sanitize username input
    const sanitizedUsername = securityService.sanitizeInput(data.username);
    
    // Log attempt
    logger.info('Login attempt', { username: sanitizedUsername });

    login(sanitizedUsername, data.password);
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
          {isBlocked && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              Demasiados intentos de acceso. Por favor, intente más tarde.
            </Alert>
          )}
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
