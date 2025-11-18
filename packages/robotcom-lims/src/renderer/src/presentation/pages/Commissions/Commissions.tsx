import React, { useEffect, useState } from 'react';
import { CommissionService } from '../../../../application/services/CommissionService';

const Commissions: React.FC = () => {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [filteredCommissions, setFilteredCommissions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const commissionService = new CommissionService();

  useEffect(() => {
    loadCommissions();
  }, []);

  useEffect(() => {
    filterCommissions();
  }, [searchTerm, commissions]);

  const loadCommissions = async () => {
    try {
      setLoading(true);
      const data = await commissionService.getCommissions();
      setCommissions(data);
      setFilteredCommissions(data);
    } catch (error) {
      console.error('Error loading commissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCommissions = () => {
    if (!searchTerm) {
      setFilteredCommissions(commissions);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = commissions.filter(c => 
      c.doctor?.firstName?.toLowerCase().includes(term) ||
      c.doctor?.lastName?.toLowerCase().includes(term) ||
      c.doctor?.email?.toLowerCase().includes(term)
    );
    setFilteredCommissions(filtered);
  };

  const totalCommissions = commissions.reduce((sum, c) => sum + c.amount, 0);
  const paidCommissions = commissions
    .filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + c.amount, 0);
  const pendingCommissions = commissions
    .filter(c => c.status !== 'paid')
    .reduce((sum, c) => sum + c.amount, 0);

  if (loading) {
    return <div style={{ padding: '2rem' }}>Cargando comisiones...</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>Gestión de Comisiones</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h4>Total</h4>
          <p style={{ fontSize: '1.5rem', color: '#3498db' }}>${totalCommissions.toFixed(2)}</p>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h4>Pagadas</h4>
          <p style={{ fontSize: '1.5rem', color: '#2ecc71' }}>${paidCommissions.toFixed(2)}</p>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h4>Pendientes</h4>
          <p style={{ fontSize: '1.5rem', color: '#e74c3c' }}>${pendingCommissions.toFixed(2)}</p>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Buscar por médico..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '0.5rem', width: '300px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Médico</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Email</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Monto</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>%</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Estado</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filteredCommissions.length > 0 ? (
              filteredCommissions.map((commission) => (
                <tr key={commission.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '1rem' }}>{commission.doctor?.firstName} {commission.doctor?.lastName}</td>
                  <td style={{ padding: '1rem' }}>{commission.doctor?.email || '-'}</td>
                  <td style={{ padding: '1rem' }}>${commission.amount.toFixed(2)}</td>
                  <td style={{ padding: '1rem' }}>{commission.percentage}%</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.875rem', background: commission.status === 'paid' ? '#d4edda' : '#fff3cd', color: commission.status === 'paid' ? '#155724' : '#856404' }}>
                      {commission.status === 'paid' ? 'Pagada' : 'Pendiente'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>{new Date(commission.date).toLocaleDateString('es-CO')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#7f8c8d' }}>
                  No hay comisiones
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Commissions;
