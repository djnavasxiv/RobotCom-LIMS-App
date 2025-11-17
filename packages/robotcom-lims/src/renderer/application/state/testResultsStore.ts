import { create } from 'zustand';
import { TestResultData, SampleWithResults } from '../../domain/types/TestResultsTypes';

interface TestResultsStore {
  // State
  currentSample: SampleWithResults | null;
  currentResults: Map<string, TestResultData>;
  pendingSamples: SampleWithResults[];
  isLoading: boolean;
  error: string | null;
  selectedTestType: string;

  // Actions
  setCurrentSample: (sample: SampleWithResults | null) => void;
  setCurrentResults: (results: Map<string, TestResultData>) => void;
  addResult: (testId: string, result: TestResultData) => void;
  updateResult: (testId: string, result: TestResultData) => void;
  getResult: (testId: string) => TestResultData | undefined;
  clearResults: () => void;

  setPendingSamples: (samples: SampleWithResults[]) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedTestType: (testType: string) => void;
}

export const useTestResultsStore = create<TestResultsStore>((set, get) => ({
  currentSample: null,
  currentResults: new Map(),
  pendingSamples: [],
  isLoading: false,
  error: null,
  selectedTestType: '',

  setCurrentSample: (sample) => set({ currentSample: sample }),
  
  setCurrentResults: (results) => set({ currentResults: results }),
  
  addResult: (testId, result) => {
    const results = new Map(get().currentResults);
    results.set(testId, result);
    set({ currentResults: results });
  },
  
  updateResult: (testId, result) => {
    const results = new Map(get().currentResults);
    results.set(testId, { ...results.get(testId), ...result });
    set({ currentResults: results });
  },
  
  getResult: (testId) => {
    return get().currentResults.get(testId);
  },
  
  clearResults: () => set({ currentResults: new Map() }),

  setPendingSamples: (samples) => set({ pendingSamples: samples }),
  
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  setSelectedTestType: (testType) => set({ selectedTestType: testType }),
}));
