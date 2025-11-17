import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TestResultsService } from '../../../../application/services/TestResultsService';
import { useTestResultsStore } from '../../../../application/state/testResultsStore';
import { ELISAResults } from '../../../../domain/types/TestResultsTypes';

interface ELISAFormData {
  testName?: string;
  result?: 'positive' | 'negative' | 'inconclusive';
  opticalDensity?: number;
  cutoffValue?: number;
  notes?: string;
  isNormal: boolean;
}

const testNameOptions = ['HIV', 'HBsAg', 'HCV', 'Syphilis'];

export const ELISAForm: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const store = useTestResultsStore();
  
  const sampleId = params.sampleId || store.currentSample?.id || '';
  
  const [sample, setSample] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ELISAFormData>({
    testName: undefined,
    result: undefined,
    opticalDensity: undefined,
    cutoffValue: undefined,
    notes: '',
    isNormal: true,
  });

  useEffect(() => {
    const loadSampleData = async () => {
      try {
        setLoading(true);
        const data = await TestResultsService.getSampleWithTests(sampleId);
        setSample(data);
        setError(null);
      } catch (err) {
        setError('Failed to load sample data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (sampleId) {
      loadSampleData();
    }
  }, [sampleId]);

  const handleInputChange = (field: keyof ELISAFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      if (!formData.testName || !formData.result) {
        setError('El nombre del test y resultado son requeridos');
        return;
      }

      const elisaTest = sample?.tests.find((t: any) => t.test.code === 'elisa');
      
      if (!elisaTest) {
        setError('Test not found in sample');
        return;
      }

      const resultValue = formData.result === 'positive' ? 'Positivo' : 
                          formData.result === 'negative' ? 'Negativo' : 'Inconcluso';

      const results: ELISAResults = {
        id: undefined,
        sampleId,
        testId: elisaTest.testId,
        value: resultValue,
        isNormal: formData.isNormal,
        notes: formData.notes,
        enteredBy: 'current_user',
        enteredAt: new Date().toISOString(),
        testType: 'elisa',
        testName: formData.testName,
        result: formData.result,
        opticalDensity: formData.opticalDensity,
        cutoffValue: formData.cutoffValue,
      };

      await TestResultsService.saveTestResult(results);

      const pendingTests = sample.tests.filter((t: any) => !t.result);
      if (pendingTests.length <= 1) {
        await TestResultsService.markSampleComplete(sampleId);
      }

      navigate('/test-results');
    } catch (err) {
      setError('Failed to save results');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!sample) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Sample not found
      </div>
    );
  }

  const patient = sample.patient;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/test-results')}
          className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2"
        >
          ← Volver
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800"
          >
            ✕
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">ELISA</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <label className="text-gray-600 font-semibold">Muestra #</label>
              <p className="text-gray-900">{sample.sampleNumber}</p>
            </div>
            <div>
              <label className="text-gray-600 font-semibold">Paciente</label>
              <p className="text-gray-900">{patient.firstName} {patient.lastName}</p>
            </div>
            <div>
              <label className="text-gray-600 font-semibold">Sexo</label>
              <p className="text-gray-900">{patient.gender === 'M' ? 'Hombre' : 'Mujer'}</p>
            </div>
            <div>
              <label className="text-gray-600 font-semibold">Edad</label>
              <p className="text-gray-900">{patient.age} años</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {/* Test Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Nombre del Test *
            </label>
            <select
              value={formData.testName || ''}
              onChange={(e) => handleInputChange('testName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona un test</option>
              {testNameOptions.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {/* Result */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Resultado *
            </label>
            <select
              value={formData.result || ''}
              onChange={(e) => handleInputChange('result', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona resultado</option>
              <option value="positive">Positivo</option>
              <option value="negative">Negativo</option>
              <option value="inconclusive">Inconcluso</option>
            </select>
          </div>

          {/* Optical Density */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Densidad Óptica (OD)
            </label>
            <input
              type="number"
              step="0.001"
              value={formData.opticalDensity || ''}
              onChange={(e) => handleInputChange('opticalDensity', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: 0.450"
            />
          </div>

          {/* Cutoff Value */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Valor de Corte
            </label>
            <input
              type="number"
              step="0.001"
              value={formData.cutoffValue || ''}
              onChange={(e) => handleInputChange('cutoffValue', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: 0.350"
            />
          </div>

          {/* Normal Checkbox */}
          <div className="flex items-center gap-2 pt-4 border-t">
            <input
              type="checkbox"
              id="isNormal"
              checked={formData.isNormal}
              onChange={(e) => handleInputChange('isNormal', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="isNormal" className="text-gray-700 font-semibold">
              Resultados Normales
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Notas Adicionales
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Observaciones o comentarios..."
            />
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <button
            onClick={() => navigate('/test-results')}
            className="px-6 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 rounded-lg font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Guardando...' : 'Guardar Resultados'}
          </button>
        </div>
      </div>
    </div>
  );
};
