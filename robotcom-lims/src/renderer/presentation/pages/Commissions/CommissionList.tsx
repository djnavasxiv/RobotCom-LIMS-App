import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  CircularProgress,
} from '@mui/material';
import { CommissionService } from '../../../application/services/CommissionService';
import { Commission } from '../../../domain/entities/Commission';

const CommissionList: React.FC = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const commissionService = new CommissionService();

  useEffect(() => {
    loadCommissions();
  }, []);

  const loadCommissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await commissionService.getAllCommissions();
      setCommissions(data);
    } catch (err) {
      setError('Error al cargar comisiones.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Reporte de Comisiones</Typography>
      </Box>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Doctor</TableCell>
                <TableCell>Factura #</TableCell>
                <TableCell>Monto de Comisión</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {commissions.map((commission) => (
                <TableRow key={commission.id}>
                  <TableCell>{(commission as any).doctor?.fullName}</TableCell>
                  <TableCell>{(commission as any).invoice?.invoiceNumber}</TableCell>
                  <TableCell>${commission.amount.toFixed(2)}</TableCell>
                  <TableCell>{new Date(commission.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {commission.isPaid ? <Chip label="Pagada" color="success" size="small" /> : <Chip label="Pendiente" color="warning" size="small" />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default CommissionList;
