import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestResultsStore } from '../../../application/state/testResultsStore';
import { TestResultsService } from '../../../application/services/TestResultsService';
import { TestResultsReport } from '../components/TestResults/TestResultsReport';
import type { ReportRecord } from '../../../application/services/ReportService';

const testCategories = [
  {
    code: 'coagulacion',
    name: 'Pruebas de Coagulación',
    icon: '🩸',
    description: 'PT, INR, Fibrinógeno, TT, aPTT',
  },
  {
    code: 'grupo_sanguineo',
    name: 'Grupo Sanguíneo',
    icon: '🩸',
    description: 'Tipo ABO, Factor Rh',
  },
  {
    code: 'elisa',
    name: 'ELISA',
    icon: '🧪',
    description: 'VIH, VHB, VHC, Sífilis',
  },
  {
    code: 'embarazo',
    name: 'Prueba de Embarazo',
    icon: '🤰',
    description: 'hCG en sangre u orina',
  },
  {
    code: 'urinalisis',
    name: 'Urinalisis',
    icon: '💛',
    description: 'Análisis completo de orina',
  },
  {
    code: 'quimica',
    name: 'Panel de Química Clínica',
    icon: '🧬',
    description: 'Glucosa, Electrolitos, Hígado, Lípidos',
  },
  {
    code: 'inmunologia',
    name: 'Inmunología',
    icon: '🛡️',
    description: 'Inmunoglobulinas, Factores del Complemento',
  },
  {
    code: 'hormonas',
    name: 'Hormonas',
    icon: '⚗️',
    description: 'TSH, T3, T4, Cortisol, etc.',
  },
  {
    code: 'heces',
    name: 'Análisis de Heces',
    icon: '🔬',
    description: 'Parásitos, Sangre Oculta, Grasa',
  },
];

export const TestResultsEntry: React.FC = () => {
  const navigate = useNavigate();
  const store = useTestResultsStore();

  const [selectedSampleId, setSelectedSampleId] = React.useState<string | null>(null);
  const [showReport, setShowReport] = React.useState(false);
  const [sampleResults, setSampleResults] = React.useState<ReportRecord[]>([]);
  const [loadingResults, setLoadingResults] = React.useState(false);

  useEffect(() => {
    const loadPendingSamples = async () => {
      try {
        const samples = await TestResultsService.getPendingSamples();
        store.setPendingSamples(samples);
      } catch (error) {
        store.setError('Failed to load pending samples');
        console.error(error);
      }
    };

    loadPendingSamples();
  }, [store]);

  const handleSelectTestType = (testCode: string) => {
    store.setSelectedTestType(testCode);
    if (selectedSampleId) {
      navigate(`/test-results/${testCode}/${selectedSampleId}`);
    } else {
      navigate(`/test-results/${testCode}`);
    }
  };

  const handleSelectSample = (sampleId: string) => {
    setSelectedSampleId(sampleId);
    store.setCurrentSample(store.pendingSamples.find(s => s.id === sampleId) || null);
    loadSampleResults(sampleId);
  };

  const loadSampleResults = async (sampleId: string) => {
    setLoadingResults(true);
    try {
      const results = await TestResultsService.getResultsBySampleId(sampleId);
      const reportRecords: ReportRecord[] = results.map((result: any) => ({
        id: result.id,
        sampleId: result.sampleId,
        sampleNumber: result.sample?.sampleNumber || 'Unknown',
        patientId: result.sample?.patientId || '',
        patientName: result.sample?.patient ? `${result.sample.patient.firstName} ${result.sample.patient.lastName}` : 'Unknown',
        patientDOB: result.sample?.patient?.dateOfBirth || '',
        testType: result.test?.name || 'Unknown',
        status: result.resultData?.status || 'pending',
        value: result.resultData,
        createdAt: result.createdAt || new Date().toISOString(),
      }));
      setSampleResults(reportRecords);
      setShowReport(false);
    } catch (error) {
      console.error('Failed to load sample results:', error);
      setSampleResults([]);
    } finally {
      setLoadingResults(false);
    }
  };

  const selectedSample = selectedSampleId 
    ? store.pendingSamples.find(s => s.id === selectedSampleId) 
    : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Ingreso de Resultados de Exámenes</h1>
          <p className="text-gray-600">
            Selecciona el tipo de examen para ingresar los resultados
          </p>
        </div>

        {/* Pending Samples Summary */}
        {store.pendingSamples.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              {selectedSample ? 'Muestra Seleccionada' : 'Selecciona una Muestra'}
            </h2>
            {selectedSample ? (
              <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                <p className="font-semibold text-gray-900">{selectedSample.sampleNumber}</p>
                <p className="text-gray-700">
                  {selectedSample.patient.firstName} {selectedSample.patient.lastName}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {selectedSample.tests.length} exámenes pendientes
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {sampleResults.length > 0 && (
                    <button
                      onClick={() => setShowReport(!showReport)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-semibold"
                    >
                      {showReport ? '👁️‍🗨️' : '👁️'} {showReport ? 'Ocultar' : 'Ver'} Reporte ({sampleResults.length})
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedSampleId(null);
                      store.setCurrentSample(null);
                      setSampleResults([]);
                    }}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-semibold"
                  >
                    Cambiar muestra
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-blue-700 text-sm">
                  Tienes {store.pendingSamples.length} muestra(s) pendiente(s)
                </p>
                {store.pendingSamples.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample.id)}
                    className="w-full text-left p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{sample.sampleNumber}</p>
                        <p className="text-gray-700 text-sm">
                          {sample.patient.firstName} {sample.patient.lastName}
                        </p>
                      </div>
                      <p className="text-gray-600 text-sm">{sample.tests.length} exámenes</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Report Section */}
        {showReport && sampleResults.length > 0 && (
          <div className="mb-8 bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📄</span>
                <h2 className="text-2xl font-bold text-gray-900">
                  Reporte de Resultados - {selectedSample?.sampleNumber}
                </h2>
              </div>
              <button
                onClick={() => setShowReport(false)}
                className="text-gray-500 hover:text-gray-700 font-bold text-xl"
              >
                ✕
              </button>
            </div>
            {loadingResults ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <TestResultsReport 
                results={sampleResults} 
                onClose={() => setShowReport(false)}
              />
            )}
          </div>
        )}

        {/* Error Alert */}
        {store.error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center">
            <span>{store.error}</span>
            <button
              onClick={() => store.setError(null)}
              className="text-red-700 hover:text-red-900 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Test Categories Grid */}
        {selectedSample ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Selecciona el tipo de examen para {selectedSample.sampleNumber}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testCategories.map((category) => (
                <button
                  key={category.code}
                  onClick={() => handleSelectTestType(category.code)}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 p-6 text-left"
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                  <div className="mt-4 inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    Ingresar →
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-600 text-lg">
              Selecciona una muestra para comenzar a ingresar resultados
            </p>
          </div>
        )}

        {/* Loading State */}
        {store.isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
};
