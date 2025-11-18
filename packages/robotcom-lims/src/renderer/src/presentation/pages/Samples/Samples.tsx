import React, { useEffect, useState } from 'react';
import { SampleService } from '../../../../application/services/SampleService';

const Samples: React.FC = () => {
  const [samples, setSamples] = useState<any[]>([]);
  const [filteredSamples, setFilteredSamples] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const sampleService = new SampleService();

  useEffect(() => {
    loadSamples();
  }, []);

  useEffect(() => {
    filterSamples();
  }, [searchTerm, statusFilter, samples]);

  const loadSamples = async () => {
    try {
      setLoading(true);
      const data = await sampleService.getAllSamples();
      setSamples(data);
      setFilteredSamples(data);
    } catch (error) {
      console.error('Error loading samples:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSamples = () => {
    let filtered = samples;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.barcode?.toLowerCase().includes(term) ||
        s.patient?.firstName?.toLowerCase().includes(term) ||
        s.patient?.lastName?.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    setFilteredSamples(filtered);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return { bg: '#fff3cd', color: '#856404' };
      case 'processing': return { bg: '#cfe2ff', color: '#084298' };
      case 'completed': return { bg: '#d1e7dd', color: '#0f5132' };
      default: return { bg: '#e2e3e5', color: '#383d41' };
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'pending': return 'Pendiente';
      case 'processing': return 'Procesando';
      case 'completed': return 'Completada';
      default: return status;
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Cargando muestras...</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>Seguimiento de Muestras</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '1rem', marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Buscar por código de barras o paciente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value="all">Todos los Estados</option>
          <option value="pending">Pendiente</option>
          <option value="processing">Procesando</option>
          <option value="completed">Completada</option>
        </select>
      </div>

      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Código</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Paciente</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Tipo</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Estado</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Fecha Colección</th>
            </tr>
          </thead>
          <tbody>
            {filteredSamples.length > 0 ? (
              filteredSamples.map((sample) => {
                const statusInfo = getStatusColor(sample.status);
                return (
                  <tr key={sample.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '1rem' }}>{sample.barcode}</td>
                    <td style={{ padding: '1rem' }}>{sample.patient?.firstName} {sample.patient?.lastName}</td>
                    <td style={{ padding: '1rem' }}>{sample.sampleType || '-'}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.875rem', background: statusInfo.bg, color: statusInfo.color }}>
                        {getStatusLabel(sample.status)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>{new Date(sample.collectionDate).toLocaleDateString('es-CO')}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#7f8c8d' }}>
                  No hay muestras
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Samples;
