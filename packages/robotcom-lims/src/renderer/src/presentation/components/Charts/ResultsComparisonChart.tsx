import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export interface ComparisonData {
  name: string;
  normal: number;
  abnormal: number;
  [key: string]: string | number;
}

interface ResultsComparisonChartProps {
  data: ComparisonData[];
  title?: string;
  height?: number;
}

const ResultsComparisonChart: React.FC<ResultsComparisonChartProps> = ({ data, title = 'Comparación: Normal vs Anormal', height = 300 }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: `${height}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', borderRadius: '8px' }}>
        <p style={{ color: '#999' }}>No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            style={{ fontSize: '12px' }}
            tick={{ fill: '#7f8c8d' }}
          />
          <YAxis 
            style={{ fontSize: '12px' }}
            tick={{ fill: '#7f8c8d' }}
          />
          <Tooltip 
            contentStyle={{ background: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
            labelStyle={{ color: '#000' }}
            formatter={(value) => `${value} exámenes`}
          />
          <Legend />
          <Bar dataKey="normal" fill="#2ecc71" name="Normales" radius={[8, 8, 0, 0]} />
          <Bar dataKey="abnormal" fill="#e74c3c" name="Anormales" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResultsComparisonChart;
