import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Divider,
} from '@mui/material';
import { InvoiceService } from '../../../application/services/InvoiceService';
import { Invoice } from '../../../domain/entities/Invoice';

interface InvoiceDetailProps {
  invoiceId: string;
}

const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ invoiceId }) => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const invoiceService = new InvoiceService();

  useEffect(() => {
    if (invoiceId) {
      setLoading(true);
      setError(null);
      invoiceService.getInvoiceById(invoiceId)
        .then(setInvoice)
        .catch((err: any) => {
          setError('Failed to load invoice details.');
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [invoiceId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!invoice) return <Typography>Select an invoice to view details.</Typography>;

  const patient = (invoice as any).patient;

  return (
    <Box id="invoice-to-print">
    <Paper sx={{ p: 4, margin: 'auto' }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Grid item>
          <Typography variant="h4" component="h1" gutterBottom>
            Invoice
          </Typography>
          <Typography>Invoice #: {invoice.invoiceNumber}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6">RobotComLab</Typography>
          {/* Add Lab address here later */}
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Grid container justifyContent="space-between" sx={{ mb: 3 }}>
        <Grid item>
          <Typography variant="subtitle1" gutterBottom><b>Billed To</b></Typography>
          <Typography>{patient?.fullName}</Typography>
          <Typography>{patient?.address}</Typography>
          <Typography>{patient?.phone.formatted()}</Typography>
          <Typography>{patient?.email.value}</Typography>
        </Grid>
        <Grid item sx={{ textAlign: 'right' }}>
           <Typography><b>Date:</b> {new Date(invoice.createdAt).toLocaleDateString()}</Typography>
           <Typography><b>Status:</b> {invoice.status.toUpperCase()}</Typography>
        </Grid>
      </Grid>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Unit Price</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(invoice as any).items.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.description}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">${item.unitPrice.toFixed(2)}</TableCell>
                <TableCell align="right">${item.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={{ width: 200 }}>
             <Grid container justifyContent="space-between">
                <Grid item><Typography>Subtotal:</Typography></Grid>
                <Grid item><Typography>${invoice.subtotal.toFixed(2)}</Typography></Grid>
             </Grid>
             <Grid container justifyContent="space-between">
                <Grid item><Typography>Tax:</Typography></Grid>
                <Grid item><Typography>${invoice.tax.toFixed(2)}</Typography></Grid>
             </Grid>
             <Divider sx={{ my: 1 }} />
             <Grid container justifyContent="space-between">
                <Grid item><Typography variant="h6">Total:</Typography></Grid>
                <Grid item><Typography variant="h6">${invoice.total.toFixed(2)}</Typography></Grid>
             </Grid>
          </Box>
      </Box>

    </Paper>
    </Box>
  );
};

export default InvoiceDetail;
