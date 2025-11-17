/**
 * Test Results Report Service
 * Handles export and report generation for test results
 */

interface ReportFilters {
  sampleId?: string;
  patientId?: string;
  startDate?: Date;
  endDate?: Date;
  testType?: string;
  status?: 'pending' | 'completed' | 'all';
}

interface ReportRecord {
  sampleNumber: string;
  patientName: string;
  patientDOB: string;
  testType: string;
  testName: string;
  result: Record<string, any>;
  isNormal: boolean;
  enteredBy: string;
  enteredAt: string;
  notes: string;
}

/**
 * Export test results to CSV format
 */
export function exportToCSV(records: ReportRecord[], filename: string): void {
  // CSV Headers
  const headers = [
    'Sample Number',
    'Patient Name',
    'Patient DOB',
    'Test Type',
    'Test Name',
    'Result',
    'Normal',
    'Entered By',
    'Entered At',
    'Notes'
  ];

  // Convert records to CSV rows
  const rows = records.map(record => [
    escapeCSV(record.sampleNumber),
    escapeCSV(record.patientName),
    escapeCSV(record.patientDOB),
    escapeCSV(record.testType),
    escapeCSV(record.testName),
    escapeCSV(JSON.stringify(record.result)),
    record.isNormal ? 'Yes' : 'No',
    escapeCSV(record.enteredBy),
    escapeCSV(record.enteredAt),
    escapeCSV(record.notes)
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export test results to JSON format
 */
export function exportToJSON(records: ReportRecord[], filename: string): void {
  const jsonContent = JSON.stringify(records, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate HTML report for printing
 */
export function generateHTMLReport(
  records: ReportRecord[],
  title: string = 'Lab Test Results Report'
): string {
  const timestamp = new Date().toLocaleString();
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${escapeHTML(title)}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333;
      background-color: #f5f5f5;
      padding: 20px;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #007bff;
      padding-bottom: 20px;
    }
    
    .header h1 {
      color: #007bff;
      font-size: 28px;
      margin-bottom: 10px;
    }
    
    .timestamp {
      color: #666;
      font-size: 12px;
      margin-top: 10px;
    }
    
    .summary {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .summary-card {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 4px;
      border-left: 4px solid #007bff;
    }
    
    .summary-card h3 {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    
    .summary-card .value {
      font-size: 24px;
      color: #007bff;
      font-weight: bold;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    
    thead {
      background: #007bff;
      color: white;
    }
    
    th {
      padding: 12px;
      text-align: left;
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
    }
    
    td {
      padding: 12px;
      border-bottom: 1px solid #ddd;
      font-size: 13px;
    }
    
    tbody tr:nth-child(even) {
      background: #f8f9fa;
    }
    
    tbody tr:hover {
      background: #f0f0f0;
    }
    
    .status-normal {
      color: #28a745;
      font-weight: 600;
    }
    
    .status-abnormal {
      color: #dc3545;
      font-weight: 600;
    }
    
    .result-value {
      font-family: 'Courier New', monospace;
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 12px;
    }
    
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      color: #666;
      font-size: 11px;
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .container {
        box-shadow: none;
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${escapeHTML(title)}</h1>
      <div class="timestamp">Generated: ${escapeHTML(timestamp)}</div>
    </div>
    
    <div class="summary">
      <div class="summary-card">
        <h3>Total Tests</h3>
        <div class="value">${records.length}</div>
      </div>
      <div class="summary-card">
        <h3>Normal Results</h3>
        <div class="value">${records.filter(r => r.isNormal).length}</div>
      </div>
      <div class="summary-card">
        <h3>Abnormal Results</h3>
        <div class="value">${records.filter(r => !r.isNormal).length}</div>
      </div>
    </div>
    
    <table>
      <thead>
        <tr>
          <th>Sample</th>
          <th>Patient</th>
          <th>DOB</th>
          <th>Test Type</th>
          <th>Test Name</th>
          <th>Result</th>
          <th>Status</th>
          <th>Entered By</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${records.map(record => `
          <tr>
            <td>${escapeHTML(record.sampleNumber)}</td>
            <td>${escapeHTML(record.patientName)}</td>
            <td>${escapeHTML(record.patientDOB)}</td>
            <td>${escapeHTML(record.testType)}</td>
            <td>${escapeHTML(record.testName)}</td>
            <td><span class="result-value">${escapeHTML(JSON.stringify(record.result))}</span></td>
            <td class="${record.isNormal ? 'status-normal' : 'status-abnormal'}">
              ${record.isNormal ? '✓ Normal' : '⚠ Abnormal'}
            </td>
            <td>${escapeHTML(record.enteredBy)}</td>
            <td>${escapeHTML(new Date(record.enteredAt).toLocaleDateString())}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    <div class="footer">
      <p>This is a computer-generated report. For official use only.</p>
      <p>Page generated on ${escapeHTML(timestamp)}</p>
    </div>
  </div>
</body>
</html>
  `;

  return html;
}

/**
 * Print HTML report
 */
export function printReport(records: ReportRecord[], title?: string): void {
  const html = generateHTMLReport(records, title);
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  }
}

/**
 * Helper function to escape CSV values
 */
function escapeCSV(value: string): string {
  if (value === undefined || value === null) return '';
  
  const stringValue = String(value);
  
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Helper function to escape HTML
 */
function escapeHTML(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

/**
 * Generate summary statistics for results
 */
export interface ReportSummary {
  totalTests: number;
  normalResults: number;
  abnormalResults: number;
  normalPercentage: number;
  testTypeBreakdown: Record<string, number>;
  mostCommonTestType: string;
  dateRange: {
    from: Date;
    to: Date;
  };
}

export function generateSummary(records: ReportRecord[]): ReportSummary {
  const totalTests = records.length;
  const normalResults = records.filter(r => r.isNormal).length;
  const abnormalResults = totalTests - normalResults;
  
  // Test type breakdown
  const testTypeBreakdown: Record<string, number> = {};
  records.forEach(record => {
    testTypeBreakdown[record.testType] = (testTypeBreakdown[record.testType] || 0) + 1;
  });
  
  // Find most common test type
  const mostCommonTestType = Object.entries(testTypeBreakdown).reduce((prev, current) =>
    current[1] > prev[1] ? current : prev
  )[0] || '';
  
  // Date range
  const dates = records.map(r => new Date(r.enteredAt));
  const from = new Date(Math.min(...dates.map(d => d.getTime())));
  const to = new Date(Math.max(...dates.map(d => d.getTime())));
  
  return {
    totalTests,
    normalResults,
    abnormalResults,
    normalPercentage: totalTests > 0 ? (normalResults / totalTests) * 100 : 0,
    testTypeBreakdown,
    mostCommonTestType,
    dateRange: { from, to }
  };
}

export default {
  exportToCSV,
  exportToJSON,
  generateHTMLReport,
  printReport,
  generateSummary
};
