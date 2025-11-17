import { Invoice } from '../../domain/entities/Invoice';

export interface OrderData {
  patientId: string;
  doctorId?: string;
  testIds: string[];
  subtotal: number;
  discountPercentage: number;
  labId: string;
}

export interface CreateOrderResponse {
  success: boolean;
  data?: {
    invoice: any;
    sample: any;
    orderNumber: string;
  };
  error?: string;
}

export class OrderService {
  /**
   * Create a new order via IPC bridge
   */
  async createOrder(orderData: OrderData): Promise<CreateOrderResponse> {
    try {
      // Validate required fields
      if (!orderData.patientId || !orderData.testIds || orderData.testIds.length === 0) {
        return {
          success: false,
          error: 'Patient and at least one test are required',
        };
      }

      if (!window.electronAPI) {
        return {
          success: false,
          error: 'Electron API not available',
        };
      }

      // Call the IPC handler in main process
      const response = await window.electronAPI.createOrder(orderData);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Format order number for display
   */
  formatOrderNumber(orderNumber: string): string {
    // Format like 11-001 to show month and sequence
    return orderNumber;
  }

  /**
   * Calculate order summary
   */
  calculateOrderSummary(
    subtotal: number,
    discountPercentage: number,
    testCount: number
  ): {
    subtotal: number;
    discountAmount: number;
    total: number;
    testCount: number;
  } {
    const discountAmount = subtotal * (discountPercentage / 100);
    return {
      subtotal,
      discountAmount,
      total: subtotal - discountAmount,
      testCount,
    };
  }
}

// Declare window.electronAPI for TypeScript
declare global {
  interface Window {
    electronAPI?: {
      createOrder: (orderData: OrderData) => Promise<CreateOrderResponse>;
      dbQuery: (model: string, method: string, ...args: any[]) => Promise<any>;
      [key: string]: any;
    };
  }
}
