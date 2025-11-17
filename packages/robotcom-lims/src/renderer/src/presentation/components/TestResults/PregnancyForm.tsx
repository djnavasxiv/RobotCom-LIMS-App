import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TestResultsService } from '../../../../application/services/TestResultsService';
import { useTestResultsStore } from '../../../../application/state/testResultsStore';
import { EmbarazoResults } from '../../../../domain/types/TestResultsTypes';

interface PregnancyFormData {
  hCGLevel?: number;
  result?: 'positive' | 'negative';
  weekEstimate?: number;
  testMethod?: 'blood' | 'urine';
  notes?: string;
  isNormal: boolean;
}

export const PregnancyForm: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const store = useTestResultsStore();
  
  const sampleId = params.sampleId || store.currentSample?.id || '';
  
  const [sample, setSample] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<PregnancyFormData>({
    hCGLevel: undefined,
    result: undefined,
    weekEstimate: undefined,
    testMethod: 'blood',
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

  const handleInputChange = (field: keyof PregnancyFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      if (formData.result === undefined) {
        setError('El resultado es requerido');
        return;
      }

      const embarazoTest = sample?.tests.find((t: any) => t.test.code === 'embarazo');
      
      if (!embarazoTest) {
        setError('Test not found in sample');
        return;
      }

      const resultValue = formData.result === 'positive' ? 'Positivo' : 'Negativo';

      const results: EmbarazoResults = {
        id: undefined,
        sampleId,
        testId: embarazoTest.testId,
        value: resultValue,
        isNormal: formData.isNormal,
        notes: formData.notes,
        enteredBy: 'current_user',
        enteredAt: new Date().toISOString(),
        testType: 'embarazo',
        hCGLevel: formData.hCGLevel,
        result: formData.result as 'positive' | 'negative' | '',
        weekEstimate: formData.weekEstimate,
        testMethod: (formData.testMethod || 'blood') as 'blood' | 'urine' | '',
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Prueba de Embarazo</h2>
          
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
          {/* Result */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Resultado *
            </label>
            <select
              value={formData.result || ''}
              onChange={(e) => handleInputChange('result', e.target.value as 'positive' | 'negative' | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona resultado</option>
              <option value="positive">Positivo</option>
              <option value="negative">Negativo</option>
            </select>
          </div>

          {/* hCG Level */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Nivel hCG (mIU/mL)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.hCGLevel || ''}
              onChange={(e) => handleInputChange('hCGLevel', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: 125.5"
            />
            <p className="text-xs text-gray-500 mt-1">&lt;5 mIU/mL es negativo</p>
          </div>

          {/* Week Estimate */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Semanas de Gestación Estimadas
            </label>
            <input
              type="number"
              value={formData.weekEstimate || ''}
              onChange={(e) => handleInputChange('weekEstimate', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: 8"
            />
          </div>

          {/* Test Method */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Método de Prueba
            </label>
            <select
              value={formData.testMethod || 'blood'}
              onChange={(e) => handleInputChange('testMethod', e.target.value as 'blood' | 'urine')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="blood">Sangre (Suero)</option>
              <option value="urine">Orina</option>
            </select>
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
