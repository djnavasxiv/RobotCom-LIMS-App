import { create } from 'zustand';

export interface OrderListItem {
  id: string;
  sampleNumber: string;
  patientName: string;
  patientId: string;
  testCount: number;
  subtotal: number;
  discount: number;
  total: number;
  status: string;
  collectionDate: string;
  invoiceNumber?: string;
}

export interface OrderDetailsData {
  sample: {
    id: string;
    sampleNumber: string;
    status: string;
    collectionDate: string;
    notes?: string;
  };
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    birthDate: string;
    gender: string;
  };
  tests: Array<{
    id: string;
    code: string;
    name: string;
    price: number;
  }>;
  invoice: {
    id: string;
    invoiceNumber: string;
    subtotal: number;
    discount: number;
    total: number;
    status: string;
    items: Array<{
      id: string;
      description: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }>;
  };
}

interface OrderHistoryStore {
  orders: OrderListItem[];
  filteredOrders: OrderListItem[];
  selectedOrder: OrderDetailsData | null;
  isLoading: boolean;
  error: string | null;
  
  // Filters
  searchQuery: string;
  dateFrom: string | null;
  dateTo: string | null;
  statusFilter: string;
  patientFilter: string;
  
  // Actions
  setOrders: (orders: OrderListItem[]) => void;
  setFilteredOrders: (orders: OrderListItem[]) => void;
  setSelectedOrder: (order: OrderDetailsData | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  setSearchQuery: (query: string) => void;
  setDateFrom: (date: string | null) => void;
  setDateTo: (date: string | null) => void;
  setStatusFilter: (status: string) => void;
  setPatientFilter: (patientId: string) => void;
  
  applyFilters: () => void;
  clearFilters: () => void;
}

export const useOrderHistoryStore = create<OrderHistoryStore>((set, get) => ({
  orders: [],
  filteredOrders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,
  
  searchQuery: '',
  dateFrom: null,
  dateTo: null,
  statusFilter: 'all',
  patientFilter: '',
  
  setOrders: (orders) => set({ orders }),
  setFilteredOrders: (orders) => set({ filteredOrders: orders }),
  setSelectedOrder: (order) => set({ selectedOrder: order }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  setDateFrom: (date) => set({ dateFrom: date }),
  setDateTo: (date) => set({ dateTo: date }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setPatientFilter: (patientId) => set({ patientFilter: patientId }),
  
  applyFilters: () => {
    const state = get();
    let filtered = [...state.orders];
    
    // Search by order number or patient name
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.sampleNumber.toLowerCase().includes(query) ||
          order.patientName.toLowerCase().includes(query) ||
          order.invoiceNumber?.toLowerCase().includes(query)
      );
    }
    
    // Filter by date range
    if (state.dateFrom) {
      filtered = filtered.filter(
        (order) => new Date(order.collectionDate) >= new Date(state.dateFrom!)
      );
    }
    if (state.dateTo) {
      filtered = filtered.filter(
        (order) => new Date(order.collectionDate) <= new Date(state.dateTo!)
      );
    }
    
    // Filter by status
    if (state.statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === state.statusFilter);
    }
    
    // Filter by patient
    if (state.patientFilter) {
      filtered = filtered.filter((order) => order.patientId === state.patientFilter);
    }
    
    set({ filteredOrders: filtered });
  },
  
  clearFilters: () => {
    set({
      searchQuery: '',
      dateFrom: null,
      dateTo: null,
      statusFilter: 'all',
      patientFilter: '',
      filteredOrders: get().orders,
    });
  },
}));
