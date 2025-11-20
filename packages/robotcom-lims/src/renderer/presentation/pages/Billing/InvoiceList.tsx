import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from '@mui/material';
import { Visibility, Print } from '@mui/icons-material';
import { useInvoices } from '../../hooks/useInvoices';
import { Invoice } from '../../../domain/entities/Invoice';
import InvoiceDetail from './InvoiceDetail';
import { PrintingService } from '../../../infrastructure/printing/PrintingService';

const InvoiceList: React.FC = () => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  const { invoices, loading, error, refetch } = useInvoices();

  const handleCloseDetail = () => {
    setSelectedInvoiceId(null);
  };

  const handlePrint = () => {
    PrintingService.printComponent('invoice-to-print', 'Invoice');
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'paid':
        return <Chip label="Pagada" color="success" size="small" />;
      case 'pending':
        return <Chip label="Pendiente" color="warning" size="small" />;
      case 'overdue':
        return <Chip label="Vencida" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
        <Typography variant="h4">Historial de Facturas</Typography>
      </Box>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && (
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell>Factura #</TableCell>
                <TableCell>Paciente</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{(invoice as any).patient?.fullName || 'N/A'}</TableCell>
                  <TableCell>{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>${invoice.total.toFixed(2)}</TableCell>
                  <TableCell>{getStatusChip(invoice.status)}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => setSelectedInvoiceId(invoice.id)}
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      <Dialog open={!!selectedInvoiceId} onClose={handleCloseDetail} maxWidth="md" fullWidth>
        <DialogTitle>Detalles de la Factura</DialogTitle>
        <DialogContent>
          {selectedInvoiceId && <InvoiceDetail invoiceId={selectedInvoiceId} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePrint} startIcon={<Print />}>
            Imprimir
          </Button>
          <Button onClick={handleCloseDetail}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InvoiceList;
