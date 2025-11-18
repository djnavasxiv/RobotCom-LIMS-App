import { create } from 'zustand';

export interface FilterState {
  startDate?: string;
  endDate?: string;
  testType: string;
  resultStatus: 'all' | 'normal' | 'abnormal';
  setDateRange: (startDate?: string, endDate?: string) => void;
  setTestType: (testType: string) => void;
  setResultStatus: (status: 'all' | 'normal' | 'abnormal') => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  startDate: undefined,
  endDate: undefined,
  testType: 'all',
  resultStatus: 'all',
  
  setDateRange: (startDate?: string, endDate?: string) =>
    set({ startDate, endDate }),
  
  setTestType: (testType: string) =>
    set({ testType }),
  
  setResultStatus: (status: 'all' | 'normal' | 'abnormal') =>
    set({ resultStatus: status }),
  
  clearFilters: () =>
    set({
      startDate: undefined,
      endDate: undefined,
      testType: 'all',
      resultStatus: 'all'
    })
}));
