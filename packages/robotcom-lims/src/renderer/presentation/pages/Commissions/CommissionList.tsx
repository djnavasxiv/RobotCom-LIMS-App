import React from 'react';
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
import { useCommissions } from '../../hooks/useCommissions';
import { Commission } from '../../../domain/entities/Commission';

const CommissionList: React.FC = () => {
  const { commissions, loading, error } = useCommissions();

  return (
    <Box>
       <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
        <Typography variant="h4">Reporte de Comisiones</Typography>
      </Box>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && (
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 600 }}>
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
        </Box>
      )}
    </Box>
  );
};

export default CommissionList;
