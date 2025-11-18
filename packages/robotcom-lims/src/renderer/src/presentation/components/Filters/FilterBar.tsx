import React, { useState } from 'react';

export interface FilterOptions {
  startDate?: string; // Format: YYYY-MM-DD
  endDate?: string;   // Format: YYYY-MM-DD
  testType?: string;  // Test name or 'all'
  resultStatus?: 'all' | 'normal' | 'abnormal';
}

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
  testTypes?: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, testTypes = [] }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    startDate: undefined,
    endDate: undefined,
    testType: 'all',
    resultStatus: 'all'
  });

  const handleDateChange = (type: 'startDate' | 'endDate', value: string) => {
    const newFilters = { ...filters, [type]: value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleTestTypeChange = (value: string) => {
    const newFilters = { ...filters, testType: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStatusChange = (value: 'all' | 'normal' | 'abnormal') => {
    const newFilters = { ...filters, resultStatus: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterOptions = {
      startDate: undefined,
      endDate: undefined,
      testType: 'all',
      resultStatus: 'all'
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div style={{
      background: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    }}>
      <h3 style={{ margin: '0 0 1.5rem 0', color: '#2c3e50' }}>Filtros</h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {/* Date Range Filters */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
            color: '#2c3e50',
            fontSize: '0.875rem'
          }}>
            Fecha de Inicio
          </label>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '0.875rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
            color: '#2c3e50',
            fontSize: '0.875rem'
          }}>
            Fecha de Fin
          </label>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '0.875rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Test Type Filter */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
            color: '#2c3e50',
            fontSize: '0.875rem'
          }}>
            Tipo de Examen
          </label>
          <select
            value={filters.testType || 'all'}
            onChange={(e) => handleTestTypeChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '0.875rem',
              boxSizing: 'border-box'
            }}
          >
            <option value="all">Todos los Exámenes</option>
            {testTypes.map(test => (
              <option key={test} value={test}>{test}</option>
            ))}
          </select>
        </div>

        {/* Result Status Filter */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
            color: '#2c3e50',
            fontSize: '0.875rem'
          }}>
            Estado del Resultado
          </label>
          <select
            value={filters.resultStatus || 'all'}
            onChange={(e) => handleStatusChange(e.target.value as 'all' | 'normal' | 'abnormal')}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '0.875rem',
              boxSizing: 'border-box'
            }}
          >
            <option value="all">Todos los Estados</option>
            <option value="normal">Normal</option>
            <option value="abnormal">Anormal</option>
          </select>
        </div>
      </div>

      {/* Clear Button */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={clearFilters}
          style={{
            padding: '0.5rem 1rem',
            background: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#7f8c8d')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#95a5a6')}
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
