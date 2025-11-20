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
import { useDoctors } from '../../hooks/useDoctors';
import { Doctor } from '../../../domain/entities/Doctor';
import DoctorForm from './DoctorForm';

const DoctorList: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const { doctors, loading, error, refetch } = useDoctors();

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este doctor?')) {
      return;
    }
    try {
      await doctorService.deleteDoctor(id);
      loadDoctors();
    } catch (err) {
      setError('Error al eliminar el doctor.');
      console.error(err);
    }
  };

  const handleOpenForm = (doctor: Doctor | null = null) => {
    setSelectedDoctor(doctor);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedDoctor(null);
    setIsFormOpen(false);
  };

  const handleSave = () => {
    refetch();
  };

  return (
    <Box>
       <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
        <Typography variant="h4">Gestión de Doctores</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenForm()}
        >
          Añadir Doctor
        </Button>
      </Box>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && (
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Especialidad</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Tasa de Comisión (%)</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {doctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell>{doctor.fullName}</TableCell>
                  <TableCell>{doctor.specialty}</TableCell>
                  <TableCell>{doctor.phone}</TableCell>
                  <TableCell>{doctor.email}</TableCell>
                  <TableCell>{doctor.commissionRate}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpenForm(doctor)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(doctor.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      <DoctorForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSave}
        doctor={selectedDoctor}
      />
    </Box>
  );
};

export default DoctorList;
