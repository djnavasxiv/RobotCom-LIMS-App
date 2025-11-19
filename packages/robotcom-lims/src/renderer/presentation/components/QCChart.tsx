/**
 * QCChart Component
 * Levey-Jennings QC visualization with trend analysis
 * 
 * Features:
 * - Line chart displaying QC values over time
 * - Control limits (±1, ±2, ±3 SD)
 * - Trend detection highlighting
 * - Westgard rule violation indicators
 * - Test-specific QC tracking
 * 
 * @author David Navas
 * @version 1.0
 */

import React from 'react';
import './QCChart.css';

interface QCDataPoint {
  id: string;
  value: number;
  date: Date;
  level: 'L1' | 'L2' | 'L3';
  testId: string;
  testName: string;
  violations?: string[];
  flagged?: boolean;
}

interface QCChartProps {
  dataPoints: QCDataPoint[];
  testId: string;
  testName: string;
  controlLevel: 'L1' | 'L2' | 'L3';
  mean: number;
  sd: number;
  title?: string;
  height?: number;
}

interface Point {
  x: number;
  y: number;
  value: number;
  date: Date;
  violations?: string[];
  flagged?: boolean;
}

/**
 * QCChart Component
 * Displays Levey-Jennings control chart with limits and trend analysis
 */
const QCChart: React.FC<QCChartProps> = ({
  dataPoints,
  testId,
  testName,
  controlLevel,
  mean,
  sd,
  title,
  height = 400
}) => {
  // Chart dimensions
  const width = 900;
  const padding = 60;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  // Filter and sort data points
  const filteredData = dataPoints
    .filter((dp: QCDataPoint) => dp.testId === testId && dp.level === controlLevel)
    .sort((a: QCDataPoint, b: QCDataPoint) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate scales
  const yMin = mean - 4 * sd;
  const yMax = mean + 4 * sd;
  const yRange = yMax - yMin;

  const xMin = 0;
  const xMax = Math.max(filteredData.length - 1, 1);
  const xRange = xMax - xMin;

  /**
   * Convert data coordinates to SVG coordinates
   */
  const toSVGX = (index: number): number => {
    return padding + (index / xRange) * chartWidth;
  };

  const toSVGY = (value: number): number => {
    return height - padding - ((value - yMin) / yRange) * chartHeight;
  };

  // Prepare data points for plotting
  const points: Point[] = filteredData.map((dp, index) => ({
    x: toSVGX(index),
    y: toSVGY(dp.value),
    value: dp.value,
    date: dp.date,
    violations: dp.violations,
    flagged: dp.flagged
  }));

  /**
   * Format date for display
   */
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="qc-chart-container">
      {/* Header */}
      <div className="chart-header">
        <div className="chart-title-section">
          <h3 className="chart-title">
            {title || `QC Chart - ${testName} (${controlLevel})`}
          </h3>
          <span className="chart-subtitle">{testId}</span>
        </div>
        <div className="chart-stats">
          <div className="stat-item">
            <span className="label">Mean:</span>
            <span className="value">{mean.toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span className="label">SD:</span>
            <span className="value">{sd.toFixed(3)}</span>
          </div>
          <div className="stat-item">
            <span className="label">CV%:</span>
            <span className="value">{((sd / mean) * 100).toFixed(2)}%</span>
          </div>
          <div className="stat-item">
            <span className="label">Points:</span>
            <span className="value">{filteredData.length}</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <svg width={width} height={height} className="qc-chart">
        {/* Background */}
        <rect x={padding} y={padding} width={chartWidth} height={chartHeight} 
              fill="white" stroke="#ddd" strokeWidth="1"/>

        {/* Control Limits */}
        {/* 3 SD Lines */}
        <line x1={padding} y1={toSVGY(mean + 3 * sd)} 
              x2={width - padding} y2={toSVGY(mean + 3 * sd)}
              className="control-limit limit-3sd-positive" />
        <text x={width - 50} y={toSVGY(mean + 3 * sd) - 5}
              className="limit-label">+3σ</text>

        <line x1={padding} y1={toSVGY(mean - 3 * sd)} 
              x2={width - padding} y2={toSVGY(mean - 3 * sd)}
              className="control-limit limit-3sd-negative" />
        <text x={width - 50} y={toSVGY(mean - 3 * sd) + 15}
              className="limit-label">-3σ</text>

        {/* 2 SD Lines */}
        <line x1={padding} y1={toSVGY(mean + 2 * sd)} 
              x2={width - padding} y2={toSVGY(mean + 2 * sd)}
              className="control-limit limit-2sd-positive" />
        <text x={width - 50} y={toSVGY(mean + 2 * sd) - 5}
              className="limit-label">+2σ</text>

        <line x1={padding} y1={toSVGY(mean - 2 * sd)} 
              x2={width - padding} y2={toSVGY(mean - 2 * sd)}
              className="control-limit limit-2sd-negative" />
        <text x={width - 50} y={toSVGY(mean - 2 * sd) + 15}
              className="limit-label">-2σ</text>

        {/* 1 SD Lines */}
        <line x1={padding} y1={toSVGY(mean + sd)} 
              x2={width - padding} y2={toSVGY(mean + sd)}
              className="control-limit limit-1sd-positive" />
        <line x1={padding} y1={toSVGY(mean - sd)} 
              x2={width - padding} y2={toSVGY(mean - sd)}
              className="control-limit limit-1sd-negative" />

        {/* Mean Line */}
        <line x1={padding} y1={toSVGY(mean)} 
              x2={width - padding} y2={toSVGY(mean)}
              className="mean-line" />
        <text x={padding + 5} y={toSVGY(mean) - 5}
              className="mean-label">Mean</text>

        {/* Data Line */}
        {points.length > 1 && (
          <polyline
            points={points.map(p => `${p.x},${p.y}`).join(' ')}
            className="data-line"
            fill="none"
            strokeWidth="2"
          />
        )}

        {/* Data Points */}
        {points.map((point, index) => (
          <g key={`point-${index}`}>
            {/* Highlight flagged points */}
            {point.flagged && (
              <circle cx={point.x} cy={point.y} r="8"
                      className="flagged-point-highlight" />
            )}
            {/* Main point */}
            <circle cx={point.x} cy={point.y} r="5"
                    className={point.flagged ? 'data-point flagged' : 'data-point'}
                    fill={point.flagged ? '#dc3545' : '#0066cc'} />
            {/* Tooltip on hover */}
            <title>
              {`${formatDate(point.date)}: ${point.value.toFixed(2)}`}
              {point.violations && point.violations.length > 0 
                ? `\nViolations: ${point.violations.join(', ')}` 
                : ''}
            </title>
          </g>
        ))}

        {/* Axes */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding}
              stroke="#333" strokeWidth="2" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding}
              stroke="#333" strokeWidth="2" />

        {/* Y-axis labels */}
        <text x={20} y={toSVGY(yMax) + 5} className="axis-label">{yMax.toFixed(0)}</text>
        <text x={20} y={toSVGY(mean) + 5} className="axis-label">{mean.toFixed(0)}</text>
        <text x={20} y={toSVGY(yMin) + 5} className="axis-label">{yMin.toFixed(0)}</text>

        {/* X-axis labels */}
        {filteredData.map((dp, index: number) => {
          if (index % Math.ceil(filteredData.length / 5) === 0) {
            return (
              <text key={`label-${index}`}
                    x={toSVGX(index)} y={height - 10}
                    className="axis-label" textAnchor="middle">
                {formatDate(dp.date)}
              </text>
            );
          }
          return null;
        })}
      </svg>

      {/* Legend */}
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#0066cc' }}></span>
          <span>Data Points</span>
        </div>
        <div className="legend-item">
          <span className="legend-line" style={{ borderTopColor: '#dc3545' }}></span>
          <span>Mean ±1σ</span>
        </div>
        <div className="legend-item">
          <span className="legend-line" style={{ borderTopColor: '#ff9800' }}></span>
          <span>±2σ Warning</span>
        </div>
        <div className="legend-item">
          <span className="legend-line" style={{ borderTopColor: '#f44336' }}></span>
          <span>±3σ Reject</span>
        </div>
        {points.some(p => p.flagged) && (
          <div className="legend-item">
            <span className="legend-highlight"></span>
            <span>Westgard Violation</span>
          </div>
        )}
      </div>

      {/* Data Table */}
      {filteredData.length > 0 && (
        <div className="chart-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Value</th>
                <th>SD from Mean</th>
                <th>Z-Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((dp, _index) => {
                const zScore = (dp.value - mean) / sd;
                const status = Math.abs(zScore) > 3 ? 'REJECT' : 
                              Math.abs(zScore) > 2 ? 'WARNING' : 'OK';
                return (
                  <tr key={dp.id} className={dp.flagged ? 'flagged-row' : ''}>
                    <td>{formatDate(dp.date)}</td>
                    <td>{dp.value.toFixed(2)}</td>
                    <td>{zScore.toFixed(2)}σ</td>
                    <td>{zScore.toFixed(3)}</td>
                    <td className={`status-${status.toLowerCase()}`}>{status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QCChart;
