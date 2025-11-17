import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TestResultsService } from '../../../../application/services/TestResultsService';
import { useTestResultsStore } from '../../../../application/state/testResultsStore';
import { CoagulacionResults } from '../../../../domain/types/TestResultsTypes';

interface CoagulationFormData {
  protrombinaTime?: number;
  INR?: number;
  fibrinogenLevel?: number;
  thrombinTime?: number;
  activatedPartialThromboplastinTime?: number;
  notes?: string;
  isNormal: boolean;
}

export const CoagulationForm: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const store = useTestResultsStore();
  
  // Get sampleId from params or store
  const sampleId = params.sampleId || store.currentSample?.id || '';
  
  const [sample, setSample] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CoagulationFormData>({
    protrombinaTime: undefined,
    INR: undefined,
    fibrinogenLevel: undefined,
    thrombinTime: undefined,
    activatedPartialThromboplastinTime: undefined,
    notes: '',
    isNormal: true,
  });

  // Load sample data on mount
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

  const handleInputChange = (field: keyof CoagulationFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Find the coagulation test in the sample
      const coagTest = sample?.tests.find((t: any) => t.test.code === 'coagulacion');
      
      if (!coagTest) {
        setError('Test not found in sample');
        return;
      }

      const results: CoagulacionResults = {
        id: undefined,
        sampleId,
        testId: coagTest.testId,
        value: JSON.stringify({
          protrombinaTime: formData.protrombinaTime,
          INR: formData.INR,
          fibrinogenLevel: formData.fibrinogenLevel,
          thrombinTime: formData.thrombinTime,
          activatedPartialThromboplastinTime: formData.activatedPartialThromboplastinTime,
        }),
        isNormal: formData.isNormal,
        notes: formData.notes,
        enteredBy: 'current_user',
        enteredAt: new Date().toISOString(),
        testType: 'coagulacion',
        protrombinaTime: formData.protrombinaTime,
        INR: formData.INR,
        fibrinogenLevel: formData.fibrinogenLevel,
        thrombinTime: formData.thrombinTime,
        activatedPartialThromboplastinTime: formData.activatedPartialThromboplastinTime,
      };

      await TestResultsService.saveTestResult(results);

      // Mark sample as completed if all tests entered
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
      {/* Header with back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/test-results')}
          className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2"
        >
          ← Volver
        </button>
      </div>

      {/* Error Alert */}
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

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pruebas de Coagulación</h2>
          
          {/* Patient Info */}
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

        {/* Form Fields */}
        <div className="space-y-4 mb-6">
          {/* PT (Prothrombin Time) */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              PT (Tiempo de Protrombina) - segundos
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.protrombinaTime || ''}
              onChange={(e) => handleInputChange('protrombinaTime', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: 12.5 (Rango: 11.0-13.5)"
            />
            <p className="text-xs text-gray-500 mt-1">Rango normal: 11.0 - 13.5 segundos</p>
          </div>

          {/* INR (International Normalized Ratio) */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              INR (Razón Normalizada Internacional)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.INR || ''}
              onChange={(e) => handleInputChange('INR', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: 0.9 (Rango: 0.8-1.1)"
            />
            <p className="text-xs text-gray-500 mt-1">Rango normal: 0.8 - 1.1</p>
          </div>

          {/* Fibrinogen */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Fibrinógeno - mg/dL
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.fibrinogenLevel || ''}
              onChange={(e) => handleInputChange('fibrinogenLevel', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: 350 (Rango: 200-400)"
            />
            <p className="text-xs text-gray-500 mt-1">Rango normal: 200 - 400 mg/dL</p>
          </div>

          {/* TT (Thrombin Time) */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              TT (Tiempo de Trombina) - segundos
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.thrombinTime || ''}
              onChange={(e) => handleInputChange('thrombinTime', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: 15 (Rango: 14-21)"
            />
            <p className="text-xs text-gray-500 mt-1">Rango normal: 14 - 21 segundos</p>
          </div>

          {/* aPTT (Activated Partial Thromboplastin Time) */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              aPTT (Tiempo de Tromboplastina Parcial Activada) - segundos
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.activatedPartialThromboplastinTime || ''}
              onChange={(e) => handleInputChange('activatedPartialThromboplastinTime', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: 30 (Rango: 25-35)"
            />
            <p className="text-xs text-gray-500 mt-1">Rango normal: 25 - 35 segundos</p>
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

        {/* Action Buttons */}
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
