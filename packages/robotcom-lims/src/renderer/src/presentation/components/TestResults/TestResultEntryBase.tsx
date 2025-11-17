import React, { useState, useEffect } from 'react';
import { TestResultData, SampleWithResults } from '../../../../domain/types/TestResultsTypes';
import { TestResultsService } from '../../../../application/services/TestResultsService';

interface TestResultEntryBaseProps {
  sampleId: string;
  testId: string;
  testName: string;
  testType: string;
  onSave: (result: TestResultData) => Promise<void>;
  onBack: () => void;
}

export const TestResultEntryBase: React.FC<TestResultEntryBaseProps> = ({
  sampleId,
  testId,
  testName,
  testType,
  onSave,
  onBack,
}) => {
  const [sample, setSample] = useState<SampleWithResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNormal, setIsNormal] = useState(true);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSampleData();
  }, [sampleId]);

  const loadSampleData = async () => {
    try {
      setLoading(true);
      const data = await TestResultsService.getSampleWithTests(sampleId);
      setSample(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error loading sample';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (resultData: TestResultData) => {
    try {
      setSaving(true);
      setError(null);
      await onSave({
        ...resultData,
        isNormal,
        notes,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error saving result';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!sample) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-red-800 font-semibold mb-2">Error</h3>
            <p className="text-red-700">{error || 'Sample not found'}</p>
            <button
              onClick={onBack}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{testName}</h1>
          <p className="text-gray-600 mt-2">
            Sample: {sample.sampleNumber} | Patient: {sample.patient.firstName}{' '}
            {sample.patient.lastName}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Sample Information Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Patient Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-semibold text-gray-900">
                {sample.patient.firstName} {sample.patient.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Gender</p>
              <p className="font-semibold text-gray-900">
                {sample.patient.gender === 'M' ? 'Male' : 'Female'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Age</p>
              <p className="font-semibold text-gray-900">
                {Math.floor(
                  (new Date().getTime() - new Date(sample.patient.birthDate).getTime()) /
                    (365.25 * 24 * 60 * 60 * 1000)
                )}{' '}
                years
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Sample #</p>
              <p className="font-semibold text-gray-900">{sample.sampleNumber}</p>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-700">
            <strong>Status:</strong> You are entering results for {sample.tests.length} tests
          </p>
        </div>

        {/* Common Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Result Summary</h2>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isNormal}
                  onChange={(e) => setIsNormal(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-gray-700">
                  Result is within normal range
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any relevant observations or findings..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const result: TestResultData = {
                sampleId,
                testId,
                value: 'entered',
                isNormal,
                notes,
              };
              handleSave(result);
            }}
            disabled={saving}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-semibold"
          >
            {saving ? 'Saving...' : 'Save Results'}
          </button>
        </div>
      </div>
    </div>
  );
};
