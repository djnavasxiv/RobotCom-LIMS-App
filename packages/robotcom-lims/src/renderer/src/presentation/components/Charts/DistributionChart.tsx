import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export interface DistributionData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface DistributionChartProps {
  data: DistributionData[];
  title?: string;
  height?: number;
}

const DistributionChart: React.FC<DistributionChartProps> = ({ data, title = 'Distribución de Tipos de Exámenes', height = 300 }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: `${height}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', borderRadius: '8px' }}>
        <p style={{ color: '#999' }}>No hay datos disponibles</p>
      </div>
    );
  }

  const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#e67e22'];

  return (
    <div style={{ width: '100%', background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} exámenes`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DistributionChart;
