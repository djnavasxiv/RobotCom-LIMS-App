import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuthStore } from '../../../../application/state/authStore';

interface LabInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

const Company: React.FC = () => {
  const [labInfo, setLabInfo] = useState<LabInfo>({
    id: '',
    name: '',
    address: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState(false);
  const { labId } = useAuthStore();

  useEffect(() => {
    loadLabInfo();
  }, []);

  const loadLabInfo = async () => {
    try {
      setLoading(true);
      // Query the database for lab info
      const result = await window.electronAPI!.dbQuery('lab', 'findUnique', {
        where: { id: labId || 'lab-001' },
      });

      if (result.success && result.data) {
        setLabInfo({
          id: result.data.id,
          name: result.data.name || '',
          address: result.data.address || '',
          phone: result.data.phone || '',
          email: result.data.email || '',
        });
      }
    } catch (err) {
      console.error('Error loading lab info:', err);
      setError('No se pudo cargar la información del laboratorio');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLabInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Validate required fields
      if (!labInfo.name.trim()) {
        setError('El nombre del laboratorio es requerido');
        return;
      }

      // Update lab in database
      const result = await window.electronAPI!.dbQuery('lab', 'update', {
        where: { id: labInfo.id },
        data: {
          name: labInfo.name,
          address: labInfo.address,
          phone: labInfo.phone,
          email: labInfo.email,
        },
      });

      if (result.success) {
        setSuccess('Información del laboratorio actualizada correctamente');
        setEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Error al actualizar la información');
      }
    } catch (err) {
      console.error('Error saving lab info:', err);
      setError('Error al guardar los cambios');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    loadLabInfo();
    setEditing(false);
  };

  if (loading && !labInfo.name) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#1e3a5f', fontWeight: 'bold' }}>
        Información de la Empresa
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
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre del Laboratorio"
                name="name"
                value={labInfo.name}
                onChange={handleChange}
                disabled={!editing}
                variant={editing ? 'outlined' : 'filled'}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                name="phone"
                value={labInfo.phone}
                onChange={handleChange}
                disabled={!editing}
                variant={editing ? 'outlined' : 'filled'}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={labInfo.email}
                onChange={handleChange}
                disabled={!editing}
                variant={editing ? 'outlined' : 'filled'}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ID del Laboratorio"
                value={labInfo.id}
                disabled
                variant="filled"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                name="address"
                value={labInfo.address}
                onChange={handleChange}
                disabled={!editing}
                multiline
                rows={3}
                variant={editing ? 'outlined' : 'filled'}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                {!editing ? (
                  <Button
                    variant="contained"
                    onClick={() => setEditing(true)}
                    sx={{
                      backgroundColor: '#1976d2',
                      '&:hover': { backgroundColor: '#1565c0' },
                    }}
                  >
                    Editar Información
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      disabled={loading}
                      sx={{
                        backgroundColor: '#4caf50',
                        '&:hover': { backgroundColor: '#45a049' },
                      }}
                    >
                      {loading ? <CircularProgress size={20} /> : 'Guardar Cambios'}
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Company;
