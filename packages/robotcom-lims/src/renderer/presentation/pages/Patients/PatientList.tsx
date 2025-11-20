import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
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
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import { usePatients } from '../../hooks/usePatients';
import { Patient } from '../../../domain/entities/Patient';
import PatientForm from './PatientForm';
import { useAuthStore } from '../../../application/state/authStore';

const PatientList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const labId = useAuthStore((state) => state.labId);

  const { patients, loading, error, refetch, searchPatients } = usePatients({
    labId,
    autoFetch: true,
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      await refetch();
      return;
    }
    await searchPatients(searchQuery);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este paciente?')) {
      return;
    }
    try {
      // TODO: Add delete functionality to hook or service
      console.warn('Delete functionality to be implemented');
      await refetch();
    } catch (err) {
      console.error('Error deleting patient:', err);
    }
  };

  const handleOpenForm = (patient: Patient | null = null) => {
    setSelectedPatient(patient);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedPatient(null);
    setIsFormOpen(false);
  };

  const handleSave = async () => {
    await refetch();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
        <Typography variant="h4">Pacientes</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenForm()}
        >
          Añadir Paciente
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center' }}>
        <TextField
          placeholder="Buscar por nombre, teléfono, o email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          sx={{ flex: '1 1 250px', minWidth: '250px' }}
        />
        <Button
          variant="contained"
          startIcon={<Search />}
          onClick={handleSearch}
          disabled={loading}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Buscar
        </Button>
      </Box>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && (
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Edad</TableCell>
                <TableCell>Género</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.fullName}</TableCell>
                  <TableCell>{patient.phone.formatted()}</TableCell>
                  <TableCell>{patient.email?.value || '-'}</TableCell>
                  <TableCell>{patient.getAge()}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenForm(patient)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(patient.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      <PatientForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSave}
        patient={selectedPatient}
      />
    </Box>
  );
};

export default PatientList;
