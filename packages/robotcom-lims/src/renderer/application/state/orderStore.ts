import { create } from 'zustand';
import { Patient } from '../../domain/entities/Patient';
import { Test } from '../../domain/entities/Test';
import { Doctor } from '../../domain/entities/Doctor';

interface OrderItem {
  testId: string;
  testName: string;
  price: number;
}

interface OrderState {
  // Order Header
  orderNumber: string | null;
  orderDate: Date;
  patient: Patient | null;
  doctor: Doctor | null;
  
  // Selected Tests
  selectedTests: OrderItem[];
  
  // Billing
  subtotal: number;
  discountPercentage: number;
  discountedTotal: number;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setPatient: (patient: Patient | null) => void;
  setDoctor: (doctor: Doctor | null) => void;
  addTest: (test: Test) => void;
  removeTest: (testId: string) => void;
  clearTests: () => void;
  setDiscountPercentage: (percentage: number) => void;
  calculateTotals: () => void;
  resetOrder: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  // Initial state
  orderNumber: null,
  orderDate: new Date(),
  patient: null,
  doctor: null,
  selectedTests: [],
  subtotal: 0,
  discountPercentage: 0,
  discountedTotal: 0,
  isLoading: false,
  error: null,

  // Actions
  setPatient: (patient) => {
    set({ patient });
  },

  setDoctor: (doctor) => {
    set({ doctor });
  },

  addTest: (test) => {
    const state = get();
    const existingTest = state.selectedTests.find((t) => t.testId === test.id);
    
    // Prevent duplicate tests
    if (!existingTest) {
      const newTests = [
        ...state.selectedTests,
        {
          testId: test.id,
          testName: test.name,
          price: test.price,
        },
      ];
      set({ selectedTests: newTests });
      get().calculateTotals();
    }
  },

  removeTest: (testId) => {
    const state = get();
    const newTests = state.selectedTests.filter((t) => t.testId !== testId);
    set({ selectedTests: newTests });
    get().calculateTotals();
  },

  clearTests: () => {
    set({ selectedTests: [] });
    get().calculateTotals();
  },

  setDiscountPercentage: (percentage) => {
    if (percentage < 0 || percentage > 100) {
      set({ error: 'Discount must be between 0 and 100' });
      return;
    }
    set({ discountPercentage: percentage });
    get().calculateTotals();
  },

  calculateTotals: () => {
    const state = get();
    const subtotal = state.selectedTests.reduce((sum, test) => sum + test.price, 0);
    const discountedTotal = subtotal - (subtotal * state.discountPercentage / 100);
    
    set({
      subtotal,
      discountedTotal,
      error: null,
    });
  },

  resetOrder: () => {
    set({
      orderNumber: null,
      orderDate: new Date(),
      patient: null,
      doctor: null,
      selectedTests: [],
      subtotal: 0,
      discountPercentage: 0,
      discountedTotal: 0,
      isLoading: false,
      error: null,
    });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error });
  },
}));
