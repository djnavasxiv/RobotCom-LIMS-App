import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TestResultsService } from '../../../../application/services/TestResultsService';
import { useTestResultsStore } from '../../../../application/state/testResultsStore';
import { hecesResults } from '../../../../domain/types/TestResultsTypes';

interface StoolFormData {
  appearance?: string;
  color?: string;
  consistency?: string;
  occultBlood?: string;
  fat?: string;
  parasites?: string;
  bacteria?: string;
  WBC?: string;
  RBC?: string;
  crystals?: string;
  notes?: string;
  isNormal: boolean;
}

const optionValues = ['Negativo', 'Presente', '+', '++', '+++'];

export const StoolForm: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const store = useTestResultsStore();
  
  const sampleId = params.sampleId || store.currentSample?.id || '';
  
  const [sample, setSample] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<StoolFormData>({
    appearance: '',
    color: '',
    consistency: '',
    occultBlood: 'Negativo',
    fat: 'Negativo',
    parasites: 'Negativo',
    bacteria: 'Normal',
    WBC: 'Negativo',
    RBC: 'Negativo',
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

  const handleInputChange = (field: keyof StoolFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const hecesTest = sample?.tests.find((t: any) => t.test.code === 'heces');
      
      if (!hecesTest) {
        setError('Test not found in sample');
        return;
      }

      const results: hecesResults = {
        id: undefined,
        sampleId,
        testId: hecesTest.testId,
        value: 'Análisis de Heces',
        isNormal: formData.isNormal,
        notes: formData.notes,
        enteredBy: 'current_user',
        enteredAt: new Date().toISOString(),
        testType: 'heces',
        appearance: formData.appearance || '',
        color: formData.color || '',
        consistency: formData.consistency || '',
        bloodOccult: formData.occultBlood || 'Negativo',
        fat: formData.fat,
        parasites: formData.parasites,
        bacteria: formData.bacteria,
        leucocytes: formData.WBC,
        erythrocytes: formData.RBC,
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Análisis de Heces</h2>
          
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
              placeholder="Ej: Blanda, Dura"
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
              placeholder="Ej: Marrón, Pálido"
            />
          </div>

          {/* Consistency */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Consistencia</label>
            <input
              type="text"
              value={formData.consistency}
              onChange={(e) => handleInputChange('consistency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Firme, Blanda, Acuosa"
            />
          </div>

          {/* Occult Blood */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Sangre Oculta</label>
            <select
              value={formData.occultBlood}
              onChange={(e) => handleInputChange('occultBlood', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {optionValues.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Fat */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Grasa</label>
            <select
              value={formData.fat}
              onChange={(e) => handleInputChange('fat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {optionValues.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Parasites */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Parásitos</label>
            <select
              value={formData.parasites}
              onChange={(e) => handleInputChange('parasites', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {optionValues.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Bacteria */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Flora Bacteriana</label>
            <select
              value={formData.bacteria}
              onChange={(e) => handleInputChange('bacteria', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Normal">Normal</option>
              <option value="Anormal">Anormal</option>
              <option value="+">+</option>
              <option value="++">++</option>
              <option value="+++">+++</option>
            </select>
          </div>

          {/* WBC */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Glóbulos Blancos</label>
            <select
              value={formData.WBC}
              onChange={(e) => handleInputChange('WBC', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {optionValues.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* RBC */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Glóbulos Rojos</label>
            <select
              value={formData.RBC}
              onChange={(e) => handleInputChange('RBC', e.target.value)}
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
