import React, { useEffect, useState } from 'react';
import { TestService } from '../../../../application/services/TestService';

const Tests: React.FC = () => {
  const [tests, setTests] = useState<any[]>([]);
  const [filteredTests, setFilteredTests] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const testService = new TestService();

  useEffect(() => {
    loadTests();
  }, []);

  useEffect(() => {
    filterTests();
  }, [searchTerm, tests]);

  const loadTests = async () => {
    try {
      setLoading(true);
      const data = await testService.getAllTests();
      setTests(data);
      setFilteredTests(data);
    } catch (error) {
      console.error('Error loading tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTests = () => {
    if (!searchTerm) {
      setFilteredTests(tests);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = tests.filter(test => 
      test.name?.toLowerCase().includes(term) ||
      test.code?.toLowerCase().includes(term) ||
      test.category?.toLowerCase().includes(term)
    );
    setFilteredTests(filtered);
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Cargando pruebas...</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>Gestión de Pruebas</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Buscar por nombre, código o categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '0.5rem', width: '400px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Nombre</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Código</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Categoría</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Precio</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Unidad</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Rango Normal</th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.length > 0 ? (
              filteredTests.map((test) => (
                <tr key={test.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '1rem' }}>{test.name}</td>
                  <td style={{ padding: '1rem' }}>{test.code}</td>
                  <td style={{ padding: '1rem' }}>{test.category || '-'}</td>
                  <td style={{ padding: '1rem' }}>${test.price?.toFixed(2) || '0.00'}</td>
                  <td style={{ padding: '1rem' }}>{test.unit || '-'}</td>
                  <td style={{ padding: '1rem' }}>{test.normalRange || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#7f8c8d' }}>
                  No hay pruebas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tests;
