import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { TestProfileService } from '../../../application/services/TestProfileService';
import { TestProfile } from '../../../domain/entities/TestProfile';
import TestProfileForm from './TestProfileForm';

const TestProfileList: React.FC = () => {
  const [profiles, setProfiles] = useState<TestProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<TestProfile | null>(null);

  const testProfileService = new TestProfileService();

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await testProfileService.getAllTestProfiles();
      setProfiles(data);
    } catch (err) {
      setError('Error al cargar los perfiles.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este perfil?')) {
      return;
    }
    try {
      await testProfileService.deleteTestProfile(id);
      loadProfiles();
    } catch (err) {
      setError('Error al eliminar el perfil.');
      console.error(err);
    }
  };

  const handleOpenForm = (profile: TestProfile | null = null) => {
    setSelectedProfile(profile);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedProfile(null);
    setIsFormOpen(false);
  };

  const handleSave = () => {
    loadProfiles();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Perfiles de Exámenes</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenForm()}
        >
          Añadir Perfil
        </Button>
      </Box>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Nº de Exámenes</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {profiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>{profile.name}</TableCell>
                  <TableCell>{profile.description}</TableCell>
                  <TableCell>{profile.tests.length}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenForm(profile)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(profile.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TestProfileForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSave}
        profile={selectedProfile}
      />
    </Box>
  );
};

export default TestProfileList;
