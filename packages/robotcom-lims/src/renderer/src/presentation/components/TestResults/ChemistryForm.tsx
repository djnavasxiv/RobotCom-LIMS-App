import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TestResultsService } from '../../../../application/services/TestResultsService';
import { useTestResultsStore } from '../../../../application/state/testResultsStore';
import { QuimicaResults } from '../../../../domain/types/TestResultsTypes';

interface ChemistryFormData {
  glucose?: number;
  BUN?: number;
  creatinine?: number;
  sodium?: number;
  potassium?: number;
  chloride?: number;
  CO2?: number;
  AST?: number;
  ALT?: number;
  alkalinePhosphatase?: number;
  totalBilirubin?: number;
  directBilirubin?: number;
  totalProtein?: number;
  albumin?: number;
  cholesterol?: number;
  triglycerides?: number;
  LDL?: number;
  HDL?: number;
  notes?: string;
  isNormal: boolean;
}

export const ChemistryForm: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const store = useTestResultsStore();
  
  const sampleId = params.sampleId || store.currentSample?.id || '';
  
  const [sample, setSample] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ChemistryFormData>({
    glucose: undefined,
    BUN: undefined,
    creatinine: undefined,
    sodium: undefined,
    potassium: undefined,
    chloride: undefined,
    CO2: undefined,
    AST: undefined,
    ALT: undefined,
    alkalinePhosphatase: undefined,
    totalBilirubin: undefined,
    directBilirubin: undefined,
    totalProtein: undefined,
    albumin: undefined,
    cholesterol: undefined,
    triglycerides: undefined,
    LDL: undefined,
    HDL: undefined,
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

  const handleInputChange = (field: keyof ChemistryFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const quimicaTest = sample?.tests.find((t: any) => t.test.code === 'quimica');
      
      if (!quimicaTest) {
        setError('Test not found in sample');
        return;
      }

      const results: QuimicaResults = {
        id: undefined,
        sampleId,
        testId: quimicaTest.testId,
        value: 'Panel Químico Completo',
        isNormal: formData.isNormal,
        notes: formData.notes,
        enteredBy: 'current_user',
        enteredAt: new Date().toISOString(),
        testType: 'quimica',
        glucose: formData.glucose,
        BUN: formData.BUN,
        creatinine: formData.creatinine,
        sodium: formData.sodium,
        potassium: formData.potassium,
        chloride: formData.chloride,
        CO2: formData.CO2,
        AST: formData.AST,
        ALT: formData.ALT,
        alkalinePhosphatase: formData.alkalinePhosphatase,
        totalBilirubin: formData.totalBilirubin,
        directBilirubin: formData.directBilirubin,
        totalProtein: formData.totalProtein,
        albumin: formData.albumin,
        triglycerides: formData.triglycerides,
        totalCholesterol: formData.cholesterol,
        LDL: formData.LDL,
        HDL: formData.HDL,
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
  const chemFields = [
    { key: 'glucose', label: 'Glucosa (mg/dL)', normal: '70-100' },
    { key: 'BUN', label: 'Nitrógeno Ureico (mg/dL)', normal: '7-20' },
    { key: 'creatinine', label: 'Creatinina (mg/dL)', normal: '0.7-1.3' },
    { key: 'sodium', label: 'Sodio (mEq/L)', normal: '136-145' },
    { key: 'potassium', label: 'Potasio (mEq/L)', normal: '3.5-5.0' },
    { key: 'chloride', label: 'Cloro (mEq/L)', normal: '98-107' },
    { key: 'CO2', label: 'CO2 (mEq/L)', normal: '23-29' },
    { key: 'AST', label: 'AST (U/L)', normal: '10-40' },
    { key: 'ALT', label: 'ALT (U/L)', normal: '7-56' },
    { key: 'alkalinePhosphatase', label: 'Fosfatasa Alcalina (U/L)', normal: '44-147' },
    { key: 'totalBilirubin', label: 'Bilirrubina Total (mg/dL)', normal: '0.1-1.2' },
    { key: 'directBilirubin', label: 'Bilirrubina Directa (mg/dL)', normal: '0.0-0.3' },
    { key: 'totalProtein', label: 'Proteína Total (g/dL)', normal: '6.0-8.3' },
    { key: 'albumin', label: 'Albúmina (g/dL)', normal: '3.5-5.5' },
    { key: 'cholesterol', label: 'Colesterol (mg/dL)', normal: '<200' },
    { key: 'triglycerides', label: 'Triglicéridos (mg/dL)', normal: '<150' },
    { key: 'LDL', label: 'LDL (mg/dL)', normal: '<100' },
    { key: 'HDL', label: 'HDL (mg/dL)', normal: '>40' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Panel Químico</h2>
          
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
          {chemFields.map(field => (
            <div key={field.key}>
              <label className="block text-gray-700 font-semibold mb-1">
                {field.label}
              </label>
              <input
                type="number"
                step="0.1"
                value={(formData as any)[field.key] || ''}
                onChange={(e) => handleInputChange(field.key as keyof ChemistryFormData, e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={field.normal}
              />
              <p className="text-xs text-gray-500 mt-1">Normal: {field.normal}</p>
            </div>
          ))}
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
