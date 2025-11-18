export interface FilterOptions {
  startDate?: string;
  endDate?: string;
  testType?: string;
  resultStatus?: 'all' | 'normal' | 'abnormal';
}

export interface ExportData {
  [key: string]: string | number | boolean | null;
}

class ExportService {
  /**
   * Export data to CSV format
   * @param data Array of objects to export
   * @param filename Output filename (without extension)
   */
  static exportToCSV(data: ExportData[], filename: string = 'export'): void {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
      // Header row
      headers.map(h => this.escapeCSV(h)).join(','),
      // Data rows
      ...data.map(row =>
        headers.map(header => this.escapeCSV(String(row[header] ?? ''))).join(',')
      )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    this.downloadFile(blob, `${filename}.csv`);
  }

  /**
   * Export chart data to CSV with formatted headers
   * @param chartData Data from chart component
   * @param chartName Name for the export file
   */
  static exportChartDataToCSV(
    chartData: Record<string, any>[],
    chartName: string = 'chart-data'
  ): void {
    const formatted = chartData.map(item => {
      const formatted: ExportData = {};
      for (const [key, value] of Object.entries(item)) {
        // Convert camelCase to readable format
        const readableKey = this.camelToTitleCase(key);
        formatted[readableKey] = value;
      }
      return formatted;
    });

    this.exportToCSV(formatted, chartName);
  }

  /**
   * Generate PDF using browser print functionality
   * Better approach: use browser's built-in print to PDF
   * @param title Report title
   * @param htmlContent HTML content to print
   * @param filename Output filename
   */
  static generatePDF(
    title: string,
    htmlContent: string,
    _filename: string = 'report'
  ): void {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) {
      console.error('Unable to open print window');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 2cm;
            color: #2c3e50;
          }
          h1 { color: #2980b9; border-bottom: 2px solid #3498db; padding-bottom: 0.5rem; }
          h2 { color: #34495e; margin-top: 1.5rem; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
          }
          th, td {
            border: 1px solid #bdc3c7;
            padding: 0.5rem;
            text-align: left;
          }
          th {
            background-color: #ecf0f1;
            font-weight: bold;
          }
          .header {
            text-align: center;
            margin-bottom: 2rem;
          }
          .footer {
            margin-top: 2rem;
            text-align: center;
            font-size: 0.875rem;
            color: #7f8c8d;
            border-top: 1px solid #bdc3c7;
            padding-top: 1rem;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <p>${new Date().toLocaleString('es-ES')}</p>
        </div>
        ${htmlContent}
        <div class="footer">
          <p>Reporte generado automáticamente - RobotCom LIMS</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    
    // Wait for content to load then open print dialog
    printWindow.onload = () => {
      printWindow.print();
      // Optionally close window after printing
      // printWindow.close();
    };
  }

  /**
   * Generate table HTML for PDF/Print
   * @param headers Column headers
   * @param data Data rows
   * @returns HTML table string
   */
  static generateTableHTML(headers: string[], data: ExportData[][]): string {
    const headerRow = headers
      .map(h => `<th>${this.escapeHTML(h)}</th>`)
      .join('');
    
    const dataRows = data
      .map(row => 
        `<tr>${row
          .map(cell => `<td>${this.escapeHTML(String(cell ?? ''))}</td>`)
          .join('')}</tr>`
      )
      .join('');

    return `
      <table>
        <thead>
          <tr>${headerRow}</tr>
        </thead>
        <tbody>
          ${dataRows}
        </tbody>
      </table>
    `;
  }

  /**
   * Create a filtered data report
   * @param data Source data
   * @param filters Applied filters
   * @param filename Output filename
   */
  static exportFilteredData(
    data: ExportData[],
    filters: FilterOptions,
    filename: string = 'filtered-report'
  ): void {
    const filtered = this.applyFilters(data, filters);
    this.exportToCSV(filtered, filename);
  }

  /**
   * Apply filters to data (mirrors backend filtering logic)
   */
  private static applyFilters(data: ExportData[], filters: FilterOptions): ExportData[] {
    let filtered = [...data];

    // Date range filter
    if (filters.startDate) {
      const startTime = new Date(filters.startDate).getTime();
      filtered = filtered.filter(item => {
        const itemDate = (item.date as string) || '';
        return new Date(itemDate).getTime() >= startTime;
      });
    }

    if (filters.endDate) {
      const endTime = new Date(filters.endDate).getTime();
      filtered = filtered.filter(item => {
        const itemDate = (item.date as string) || '';
        return new Date(itemDate).getTime() <= endTime;
      });
    }

    // Test type filter
    if (filters.testType && filters.testType !== 'all') {
      filtered = filtered.filter(item =>
        String(item.testType || item.type || '').includes(filters.testType!)
      );
    }

    // Result status filter
    if (filters.resultStatus && filters.resultStatus !== 'all') {
      filtered = filtered.filter(item => {
        const status = String(item.status || '').toLowerCase();
        return status.includes(filters.resultStatus!);
      });
    }

    return filtered;
  }

  /**
   * Escape special characters for CSV
   */
  private static escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  /**
   * Escape HTML special characters
   */
  private static escapeHTML(value: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return value.replace(/[&<>"']/g, char => map[char]);
  }

  /**
   * Convert camelCase to Title Case
   */
  private static camelToTitleCase(str: string): string {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, char => char.toUpperCase())
      .trim();
  }

  /**
   * Download file utility
   */
  private static downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export default ExportService;
