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
import { InvoiceService } from '../../../application/services/InvoiceService';
import { Invoice } from '../../../domain/entities/Invoice';
import InvoiceDetail from './InvoiceDetail';

const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const invoiceService = new InvoiceService();

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await invoiceService.getAllInvoices();
      setInvoices(data);
    } catch (err) {
      setError('Error al cargar facturas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setSelectedInvoiceId(null);
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
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
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
        </TableContainer>
      )}

      <Dialog open={!!selectedInvoiceId} onClose={handleCloseDetail} maxWidth="md" fullWidth>
        <DialogTitle>Detalles de la Factura</DialogTitle>
        <DialogContent>
          {selectedInvoiceId && <InvoiceDetail invoiceId={selectedInvoiceId} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => alert('Print functionality not yet implemented.')} startIcon={<Print />}>
            Imprimir
          </Button>
          <Button onClick={handleCloseDetail}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InvoiceList;
