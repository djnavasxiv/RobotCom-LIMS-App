import React, { useEffect, useState } from 'react';
import { PatientService } from '../../../application/services/PatientService';
import { SampleService } from '../../../application/services/SampleService';
import { InvoiceService } from '../../../application/services/InvoiceService';
import TrendChart, { type TrendData } from '../components/Charts/TrendChart';
import DistributionChart, { type DistributionData } from '../components/Charts/DistributionChart';
import ResultsComparisonChart, { type ComparisonData } from '../components/Charts/ResultsComparisonChart';
import FilterBar from '../components/Filters/FilterBar';
import type { FilterOptions } from '../components/Filters/FilterBar';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    pendingSamples: 0,
    testsToday: 0,
    monthlyRevenue: 0,
    loading: true
  });
  
  const [chartData, setChartData] = useState<{
    trendData: TrendData[];
    distributionData: DistributionData[];
    comparisonData: ComparisonData[];
  }>({
    trendData: [],
    distributionData: [],
    comparisonData: []
  });

  const [filteredChartData, setFilteredChartData] = useState<{
    trendData: TrendData[];
    distributionData: DistributionData[];
    comparisonData: ComparisonData[];
  }>({
    trendData: [],
    distributionData: [],
    comparisonData: []
  });

  const [testTypes] = useState(['Glucosa', 'Hemoglobina', 'Colesterol', 'Creatinina']);

  const patientService = new PatientService();
  const sampleService = new SampleService();
  const invoiceService = new InvoiceService();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Get total patients
      const patients = await patientService.getAllPatients();
      
      // Get pending samples
      const samples = await sampleService.getAllSamples();
      const pending = samples.filter(s => s.status === 'pending' || s.status === 'processing').length;
      
      // Get monthly revenue from invoices
      const invoices = await invoiceService.getAllInvoices();
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyInvoices = invoices.filter(inv => {
        const invDate = new Date(inv.date);
        return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
      });
      const revenue = monthlyInvoices.reduce((sum, inv) => sum + inv.total, 0);

      // Generate sample chart data for visualization
      const trendSampleData: TrendData[] = Array.from({ length: 10 }, (_, i) => ({
        date: new Date(Date.now() - (9 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('es-CO'),
        value: Math.random() * 100,
        testName: ['Glucosa', 'Hemoglobina', 'Colesterol', 'Creatinina'][Math.floor(Math.random() * 4)]
      }));

      const distributionSampleData: DistributionData[] = [
        { name: 'Glucosa', value: 45 },
        { name: 'Hemoglobina', value: 38 },
        { name: 'Colesterol', value: 32 },
        { name: 'Creatinina', value: 25 },
        { name: 'Otros', value: 30 }
      ];

      const comparisonSampleData: ComparisonData[] = [
        { name: 'Glucosa', normal: 38, abnormal: 7 },
        { name: 'Hemoglobina', normal: 35, abnormal: 3 },
        { name: 'Colesterol', normal: 28, abnormal: 4 },
        { name: 'Creatinina', normal: 23, abnormal: 2 }
      ];

      setStats({
        totalPatients: patients.length,
        pendingSamples: pending,
        testsToday: 0,
        monthlyRevenue: revenue,
        loading: false
      });

      setChartData({
        trendData: trendSampleData,
        distributionData: distributionSampleData,
        comparisonData: comparisonSampleData
      });

      setFilteredChartData({
        trendData: trendSampleData,
        distributionData: distributionSampleData,
        comparisonData: comparisonSampleData
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const handleFilterChange = (filters: FilterOptions) => {
    // Apply simple filtering logic
    let trendFiltered = [...chartData.trendData];
    
    // Date range filter
    if (filters.startDate) {
      const startTime = new Date(filters.startDate).getTime();
      trendFiltered = trendFiltered.filter(item => {
        // Parse date from "DD/MM/YYYY" format
        const [day, month, year] = item.date.split('/');
        const itemDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).getTime();
        return itemDate >= startTime;
      });
    }
    
    if (filters.endDate) {
      const endTime = new Date(filters.endDate).getTime();
      trendFiltered = trendFiltered.filter(item => {
        const [day, month, year] = item.date.split('/');
        const itemDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).getTime();
        return itemDate <= endTime;
      });
    }

    // Test type filter
    if (filters.testType && filters.testType !== 'all') {
      trendFiltered = trendFiltered.filter(item => 
        item.testName.toLowerCase().includes(filters.testType!.toLowerCase())
      );
    }

    // Distribution filter
    let distFiltered = [...chartData.distributionData];
    if (filters.testType && filters.testType !== 'all') {
      distFiltered = distFiltered.filter(item =>
        item.name.toLowerCase().includes(filters.testType!.toLowerCase())
      );
    }

    // Comparison filter
    let compFiltered = [...chartData.comparisonData];
    if (filters.testType && filters.testType !== 'all') {
      compFiltered = compFiltered.filter(item =>
        item.name.toLowerCase().includes(filters.testType!.toLowerCase())
      );
    }

    if (filters.resultStatus && filters.resultStatus !== 'all') {
      compFiltered = compFiltered.map(item => {
        if (filters.resultStatus === 'normal') {
          return { ...item, abnormal: 0 };
        } else {
          return { ...item, normal: 0 };
        }
      });
    }

    setFilteredChartData({
      trendData: trendFiltered,
      distributionData: distFiltered,
      comparisonData: compFiltered
    });
  };

  const handleExportCSV = () => {
    const data = filteredChartData.trendData.map(item => ({
      'Fecha': item.date,
      'Tipo Examen': item.testName,
      'Valor': item.value.toFixed(2)
    }));

    // Create CSV content
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(h => {
        const value = String(row[h as keyof typeof row] || '');
        return value.includes(',') ? `"${value}"` : value;
      }).join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `reporte-tendencias-${new Date().getTime()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) {
      console.error('Unable to open print window');
      return;
    }

    const rows = filteredChartData.trendData
      .map(item => `<tr><td>${item.date}</td><td>${item.testName}</td><td>${item.value.toFixed(2)}</td></tr>`)
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reporte de Tendencias</title>
        <style>
          body { font-family: Arial; margin: 2cm; color: #2c3e50; }
          h1 { color: #2980b9; border-bottom: 2px solid #3498db; }
          table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
          th, td { border: 1px solid #bdc3c7; padding: 0.5rem; text-align: left; }
          th { background-color: #ecf0f1; font-weight: bold; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <h1>Reporte de Tendencias</h1>
        <p>${new Date().toLocaleString('es-ES')}</p>
        <table>
          <thead><tr><th>Fecha</th><th>Tipo Examen</th><th>Valor</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <p style="margin-top: 2rem; border-top: 1px solid #bdc3c7; padding-top: 1rem; text-align: center; font-size: 0.875rem; color: #7f8c8d;">Reporte generado automáticamente - RobotCom LIMS</p>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  if (stats.loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard" style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '2rem', color: '#2c3e50' }}>Panel de Control</h2>
      
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#7f8c8d' }}>Pacientes</h3>
          <p style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#3498db', fontWeight: 'bold' }}>{stats.totalPatients}</p>
          <p style={{ color: '#7f8c8d', fontSize: '0.875rem', margin: 0 }}>Total de pacientes</p>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#7f8c8d' }}>Muestras</h3>
          <p style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#2ecc71', fontWeight: 'bold' }}>{stats.pendingSamples}</p>
          <p style={{ color: '#7f8c8d', fontSize: '0.875rem', margin: 0 }}>Muestras pendientes</p>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#7f8c8d' }}>Exámenes</h3>
          <p style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#e74c3c', fontWeight: 'bold' }}>{stats.testsToday}</p>
          <p style={{ color: '#7f8c8d', fontSize: '0.875rem', margin: 0 }}>Exámenes hoy</p>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#7f8c8d' }}>Ingresos</h3>
          <p style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#f39c12', fontWeight: 'bold' }}>
            ${stats.monthlyRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p style={{ color: '#7f8c8d', fontSize: '0.875rem', margin: 0 }}>Este mes</p>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar onFilterChange={handleFilterChange} testTypes={testTypes} />

      {/* Export Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          onClick={handleExportCSV}
          style={{
            padding: '0.5rem 1rem',
            background: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#229954')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#27ae60')}
        >
          📥 Exportar CSV
        </button>
        <button
          onClick={handleExportPDF}
          style={{
            padding: '0.5rem 1rem',
            background: '#c0392b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#a93226')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#c0392b')}
        >
          📄 Exportar PDF
        </button>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '1.5rem' }}>
        <TrendChart data={filteredChartData.trendData} title="Tendencia de Resultados (Últimos 10 Días)" height={350} />
        <ResultsComparisonChart data={filteredChartData.comparisonData} title="Comparación: Resultados Normales vs Anormales" height={350} />
        <DistributionChart data={filteredChartData.distributionData} title="Distribución de Tipos de Exámenes" height={350} />
      </div>
    </div>
  );
};

export default Dashboard;
