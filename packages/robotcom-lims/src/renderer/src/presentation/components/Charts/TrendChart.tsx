import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export interface TrendData {
  date: string;
  value: number;
  testName: string;
}

interface TrendChartProps {
  data: TrendData[];
  title?: string;
  height?: number;
}

const TrendChart: React.FC<TrendChartProps> = ({ data, title = 'Tendencia de Resultados', height = 300 }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: `${height}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', borderRadius: '8px' }}>
        <p style={{ color: '#999' }}>No hay datos disponibles</p>
      </div>
    );
  }

  // Format data for line chart - group by date
  const formattedData = Array.from(
    data.reduce((acc, item) => {
      const existing = acc.get(item.date) || { date: item.date };
      (existing as any)[item.testName] = item.value;
      acc.set(item.date, existing);
      return acc;
    }, new Map())
  ).map(([_, value]) => value);

  // Get unique test names for multiple lines
  const testNames = Array.from(new Set(data.map(d => d.testName)));
  const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c'];

  return (
    <div style={{ width: '100%', background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
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
          />
          <Legend />
          {testNames.map((testName, index) => (
            <Line
              key={testName}
              type="monotone"
              dataKey={testName}
              stroke={colors[index % colors.length]}
              dot={{ fill: colors[index % colors.length], r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
