import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TestResultsService } from '../../../../application/services/TestResultsService';
import { useTestResultsStore } from '../../../../application/state/testResultsStore';
import { UrinalisisResults } from '../../../../domain/types/TestResultsTypes';

interface UrinalysisFormData {
  appearance?: string;
  color?: string;
  pH?: number;
  protein?: string;
  glucose?: string;
  ketones?: string;
  bacteria?: string;
  cells?: string;
  casts?: string;
  crystals?: string;
  notes?: string;
  isNormal: boolean;
}

const optionValues = ['Negativo', 'Trazas', '+', '++', '+++'];

export const UrinalysisForm: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const store = useTestResultsStore();
  
  const sampleId = params.sampleId || store.currentSample?.id || '';
  
  const [sample, setSample] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UrinalysisFormData>({
    appearance: '',
    color: '',
    pH: undefined,
    protein: 'Negativo',
    glucose: 'Negativo',
    ketones: 'Negativo',
    bacteria: 'Negativo',
    cells: 'Negativo',
    casts: 'Negativo',
    crystals: 'Negativo',
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

  const handleInputChange = (field: keyof UrinalysisFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const urinalisisTest = sample?.tests.find((t: any) => t.test.code === 'urinalisis');
      
      if (!urinalisisTest) {
        setError('Test not found in sample');
        return;
      }

      const results: UrinalisisResults = {
        id: undefined,
        sampleId,
        testId: urinalisisTest.testId,
        value: 'Análisis de Orina Completo',
        isNormal: formData.isNormal,
        notes: formData.notes,
        enteredBy: 'current_user',
        enteredAt: new Date().toISOString(),
        testType: 'urinalisis',
        appearance: formData.appearance || '',
        color: formData.color || '',
        pH: formData.pH,
        protein: formData.protein,
        glucose: formData.glucose,
        ketones: formData.ketones,
        bacteria: formData.bacteria,
        casts: formData.casts,
        crystals: formData.crystals,
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
    <div className="max-w-3xl mx-auto">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Análisis de Orina</h2>
          
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Appearance */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Apariencia</label>
            <input
              type="text"
              value={formData.appearance}
              onChange={(e) => handleInputChange('appearance', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Clara, Turbia"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Color</label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => handleInputChange('color', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Amarilla pálida"
            />
          </div>

          {/* pH */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">pH</label>
            <input
              type="number"
              step="0.1"
              value={formData.pH || ''}
              onChange={(e) => handleInputChange('pH', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Rango normal: 4.5-8.0"
            />
          </div>

          {/* Protein */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Proteína</label>
            <select
              value={formData.protein}
              onChange={(e) => handleInputChange('protein', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {optionValues.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Glucose */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Glucosa</label>
            <select
              value={formData.glucose}
              onChange={(e) => handleInputChange('glucose', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {optionValues.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Ketones */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Cetonas</label>
            <select
              value={formData.ketones}
              onChange={(e) => handleInputChange('ketones', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {optionValues.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Bacteria */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Bacterias</label>
            <select
              value={formData.bacteria}
              onChange={(e) => handleInputChange('bacteria', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {optionValues.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Cells */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Células</label>
            <select
              value={formData.cells}
              onChange={(e) => handleInputChange('cells', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {optionValues.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Casts */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Cilindros</label>
            <select
              value={formData.casts}
              onChange={(e) => handleInputChange('casts', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {optionValues.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Crystals */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Cristales</label>
            <select
              value={formData.crystals}
              onChange={(e) => handleInputChange('crystals', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {optionValues.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Normal Checkbox */}
        <div className="flex items-center gap-2 py-4 border-t border-b">
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
        <div className="my-6">
          <label className="block text-gray-700 font-semibold mb-2">Notas Adicionales</label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Observaciones..."
          />
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
