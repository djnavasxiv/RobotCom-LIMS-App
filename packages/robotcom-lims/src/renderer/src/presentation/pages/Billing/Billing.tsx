import React, { useEffect, useState } from 'react';
import { InvoiceService } from '../../../../application/services/InvoiceService';

const Billing: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const invoiceService = new InvoiceService();

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [searchTerm, invoices]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await invoiceService.getAllInvoices();
      setInvoices(data);
      setFilteredInvoices(data);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterInvoices = () => {
    if (!searchTerm) {
      setFilteredInvoices(invoices);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = invoices.filter(inv => 
      inv.invoiceNumber?.toLowerCase().includes(term) ||
      inv.patient?.firstName?.toLowerCase().includes(term) ||
      inv.patient?.lastName?.toLowerCase().includes(term)
    );
    setFilteredInvoices(filtered);
  };

  const totalBilled = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const pendingAmount = invoices
    .filter(inv => inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  if (loading) {
    return <div style={{ padding: '2rem' }}>Cargando facturas...</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>Facturación</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h4>Total Facturado</h4>
          <p style={{ fontSize: '1.5rem', color: '#3498db' }}>${totalBilled.toFixed(2)}</p>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h4>Pendiente</h4>
          <p style={{ fontSize: '1.5rem', color: '#e74c3c' }}>${pendingAmount.toFixed(2)}</p>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h4>Total de Facturas</h4>
          <p style={{ fontSize: '1.5rem', color: '#2ecc71' }}>{invoices.length}</p>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Buscar por número o paciente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '0.5rem', width: '300px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Número</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Paciente</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Total</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Estado</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <tr key={invoice.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '1rem' }}>{invoice.invoiceNumber}</td>
                  <td style={{ padding: '1rem' }}>{invoice.patient?.firstName} {invoice.patient?.lastName}</td>
                  <td style={{ padding: '1rem' }}>${invoice.total.toFixed(2)}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.875rem', background: invoice.status === 'paid' ? '#d4edda' : '#fff3cd', color: invoice.status === 'paid' ? '#155724' : '#856404' }}>
                      {invoice.status === 'paid' ? 'Pagada' : 'Pendiente'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>{new Date(invoice.date).toLocaleDateString('es-CO')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#7f8c8d' }}>
                  No hay facturas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Billing;
