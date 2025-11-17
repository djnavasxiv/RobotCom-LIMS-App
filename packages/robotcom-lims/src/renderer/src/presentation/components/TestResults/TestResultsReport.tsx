import React, { useState, useEffect } from 'react';
import { FileJson, FileText, Printer, Download } from 'lucide-react';
import ReportService, { ReportRecord, ReportSummary } from '../../application/services/ReportService';

interface TestResultsReportProps {
  results: ReportRecord[];
  onClose?: () => void;
}

export const TestResultsReport: React.FC<TestResultsReportProps> = ({ results, onClose }) => {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'html'>('csv');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (results.length > 0) {
      setSummary(ReportService.generateSummary(results));
    }
  }, [results]);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `test-results-${timestamp}`;

      switch (exportFormat) {
        case 'csv':
          ReportService.exportToCSV(results, `${filename}.csv`);
          break;
        case 'json':
          ReportService.exportToJSON(results, `${filename}.json`);
          break;
        case 'html':
          const html = ReportService.generateHTMLReport(results, 'Lab Test Results Report');
          const blob = new Blob([html], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${filename}.html`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    ReportService.printReport(results, 'Lab Test Results Report');
  };

  if (!summary) {
    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">No test results to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Test Results Report</h2>
          <p className="text-sm text-gray-500 mt-1">
            Report generated: {new Date().toLocaleString()}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-sm font-semibold text-gray-600">Total Tests</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{summary.totalTests}</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-sm font-semibold text-gray-600">Normal Results</div>
          <div className="text-2xl font-bold text-green-600 mt-1">{summary.normalResults}</div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="text-sm font-semibold text-gray-600">Abnormal Results</div>
          <div className="text-2xl font-bold text-red-600 mt-1">{summary.abnormalResults}</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="text-sm font-semibold text-gray-600">Normal %</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">
            {summary.normalPercentage.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Test Type Breakdown */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Test Type Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(summary.testTypeBreakdown).map(([testType, count]) => (
            <div key={testType} className="flex justify-between items-center bg-white p-3 rounded border border-gray-100">
              <span className="text-sm font-medium text-gray-700">{testType}</span>
              <span className="text-lg font-bold text-blue-600">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div>
          <p className="text-sm font-medium text-gray-700">Date Range</p>
          <p className="text-sm text-gray-600 mt-1">
            {summary.dateRange.from.toLocaleDateString()} to {summary.dateRange.to.toLocaleDateString()}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">Most Common Test</p>
          <p className="text-sm text-gray-600 mt-1">{summary.mostCommonTestType}</p>
        </div>
      </div>

      {/* Export Options */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Export Options</h3>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="csv">CSV Format</option>
              <option value="json">JSON Format</option>
              <option value="html">HTML Report</option>
            </select>
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            <Download size={18} />
            {isExporting ? 'Exporting...' : 'Export'}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition-colors"
          >
            <Printer size={18} />
            Print
          </button>
        </div>
      </div>

      {/* Results Table Preview */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Results Preview</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Sample</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Patient</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Test Type</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {results.slice(0, 10).map((result, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-700">{result.sampleNumber}</td>
                  <td className="px-4 py-2 text-gray-700">{result.patientName}</td>
                  <td className="px-4 py-2 text-gray-700">{result.testType}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      result.isNormal
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.isNormal ? 'Normal' : 'Abnormal'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {new Date(result.enteredAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {results.length > 10 && (
          <p className="text-sm text-gray-500 text-center">
            Showing 10 of {results.length} results. Download to see all.
          </p>
        )}
      </div>
    </div>
  );
};

export default TestResultsReport;
