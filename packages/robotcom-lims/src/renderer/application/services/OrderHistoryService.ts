import { OrderListItem, OrderDetailsData } from '../state/orderHistoryStore';

export class OrderHistoryService {
  /**
   * Fetch all orders with basic information for list view
   */
  static async getOrders(): Promise<OrderListItem[]> {
    try {
      const samples = await window.electronAPI!.dbQuery('sample', 'findMany', {
        include: {
          patient: true,
          tests: {
            include: { test: true },
          },
          invoice: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!samples.success) {
        throw new Error(samples.error || 'Failed to fetch orders');
      }

      return samples.data.map((sample: any) => ({
        id: sample.id,
        sampleNumber: sample.sampleNumber,
        patientName: `${sample.patient.firstName} ${sample.patient.lastName}`,
        patientId: sample.patient.id,
        testCount: sample.tests.length,
        subtotal: sample.tests.reduce((sum: number, st: any) => sum + st.price, 0),
        discount: sample.invoice?.discount || 0,
        total: sample.invoice?.total || 0,
        status: sample.status,
        collectionDate: sample.collectionDate,
        invoiceNumber: sample.invoice?.invoiceNumber,
      }));
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  /**
   * Fetch detailed information for a specific order
   */
  static async getOrderDetails(sampleId: string): Promise<OrderDetailsData> {
    try {
      const sample = await window.electronAPI!.dbQuery('sample', 'findUnique', {
        where: { id: sampleId },
        include: {
          patient: true,
          tests: { include: { test: true } },
          invoice: { include: { items: true } },
        },
      });

      if (!sample.success || !sample.data) {
        throw new Error('Order not found');
      }

      const data = sample.data;
      return {
        sample: {
          id: data.id,
          sampleNumber: data.sampleNumber,
          status: data.status,
          collectionDate: data.collectionDate,
          notes: data.notes,
        },
        patient: {
          id: data.patient.id,
          firstName: data.patient.firstName,
          lastName: data.patient.lastName,
          email: data.patient.email,
          phone: data.patient.phone,
          birthDate: data.patient.birthDate,
          gender: data.patient.gender,
        },
        tests: data.tests.map((st: any) => ({
          id: st.test.id,
          code: st.test.code,
          name: st.test.name,
          price: st.price,
        })),
        invoice: {
          id: data.invoice.id,
          invoiceNumber: data.invoice.invoiceNumber,
          subtotal: data.invoice.subtotal,
          discount: data.invoice.discount,
          total: data.invoice.total,
          status: data.invoice.status,
          items: data.invoice.items,
        },
      };
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  }

  /**
   * Get unique patients for filter dropdown
   */
  static async getPatients(): Promise<Array<{ id: string; name: string }>> {
    try {
      const result = await window.electronAPI!.dbQuery('patient', 'findMany', {
        select: { id: true, firstName: true, lastName: true },
        distinct: ['id'],
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch patients');
      }

      return result.data.map((patient: any) => ({
        id: patient.id,
        name: `${patient.firstName} ${patient.lastName}`,
      }));
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(
    sampleId: string,
    status: string
  ): Promise<{ success: boolean }> {
    try {
      const result = await window.electronAPI!.dbQuery('sample', 'update', {
        where: { id: sampleId },
        data: { status },
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to update order');
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  /**
   * Export orders as CSV
   */
  static async exportOrdersAsCSV(orders: OrderListItem[]): Promise<void> {
    try {
      const csvContent = this.generateCSV(orders);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting orders:', error);
      throw error;
    }
  }

  /**
   * Generate CSV content from orders
   */
  private static generateCSV(orders: OrderListItem[]): string {
    const headers = [
      'Order Number',
      'Patient Name',
      'Tests',
      'Subtotal',
      'Discount',
      'Total',
      'Status',
      'Collection Date',
    ];

    const rows = orders.map((order) => [
      order.sampleNumber,
      order.patientName,
      order.testCount,
      order.subtotal.toFixed(2),
      order.discount.toFixed(2),
      order.total.toFixed(2),
      order.status,
      new Date(order.collectionDate).toLocaleDateString(),
    ]);

    const csvRows = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ];

    return csvRows.join('\n');
  }

  /**
   * Print order invoice
   */
  static async printOrder(sampleId: string): Promise<void> {
    try {
      const orderDetails = await this.getOrderDetails(sampleId);
      await window.electronAPI!.printInvoice(orderDetails.invoice);
    } catch (error) {
      console.error('Error printing order:', error);
      throw error;
    }
  }
}
