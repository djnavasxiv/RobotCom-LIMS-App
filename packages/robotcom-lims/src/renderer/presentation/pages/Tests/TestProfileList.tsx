import React, { useState } from 'react';
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
import { useTestProfiles } from '../../hooks/useTestProfiles';
import { TestProfile } from '../../../domain/entities/TestProfile';
import TestProfileForm from './TestProfileForm';

const TestProfileList: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<TestProfile | null>(null);

  const { profiles, loading, error, refetch } = useTestProfiles();

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este perfil?')) {
      return;
    }
    try {
      // TODO: Add delete functionality
      await refetch();
    } catch (err) {
      console.error('Error deleting profile:', err);
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

  const handleSave = async () => {
    await refetch();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h4">Perfiles de Exámenes</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenForm()}
          sx={{ flexShrink: 0 }}
        >
          Añadir Perfil
        </Button>
      </Box>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && (
        <Box sx={{ overflowX: 'auto' }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }}>
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
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(profile.id)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
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
