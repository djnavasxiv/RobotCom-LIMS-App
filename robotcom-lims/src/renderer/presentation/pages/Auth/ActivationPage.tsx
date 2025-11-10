import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  CircularProgress,
} from '@mui/material';
import { LicenseService } from '../../application/services/LicenseService';

interface ActivationPageProps {
  onActivationSuccess: () => void;
}

const ActivationPage: React.FC<ActivationPageProps> = ({ onActivationSuccess }) => {
  const [licenseKey, setLicenseKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const licenseService = new LicenseService();

  const handleActivate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await licenseService.activateLicense(licenseKey);
      if (result.success) {
        onActivationSuccess();
      } else {
        setError(result.error || 'Activation failed');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Activar Producto
        </Typography>
        <Typography sx={{ mt: 2, mb: 3 }}>
          Por favor, introduzca su clave de licencia para activar el software.
        </Typography>
        <Box sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Clave de Licencia"
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
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
            onClick={handleActivate}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Activar'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ActivationPage;
