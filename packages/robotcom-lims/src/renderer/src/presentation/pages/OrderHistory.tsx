import React, { useEffect } from 'react';
import { useOrderHistoryStore } from '../../../application/state/orderHistoryStore';
import { OrderHistoryService } from '../../../application/services/OrderHistoryService';
import { OrderFilters } from '../components/OrderHistory/OrderFilters';
import { OrderTable } from '../components/OrderHistory/OrderTable';
import { OrderDetailsModal } from '../components/OrderHistory/OrderDetailsModal';

export const OrderHistory: React.FC = () => {
  const store = useOrderHistoryStore();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      store.setLoading(true);
      store.setError(null);
      const orders = await OrderHistoryService.getOrders();
      store.setOrders(orders);
      store.setFilteredOrders(orders);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error loading orders';
      store.setError(message);
      console.error('Error loading orders:', error);
    } finally {
      store.setLoading(false);
    }
  };

  const handleSelectOrder = async (order: any) => {
    try {
      store.setLoading(true);
      const details = await OrderHistoryService.getOrderDetails(order.id);
      store.setSelectedOrder(details);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error loading order details';
      store.setError(message);
      console.error('Error loading order details:', error);
    } finally {
      store.setLoading(false);
    }
  };

  const handlePrintOrder = async (orderId: string) => {
    try {
      await OrderHistoryService.printOrder(orderId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error printing order';
      store.setError(message);
      console.error('Error printing order:', error);
    }
  };

  const handleExportCSV = async () => {
    try {
      await OrderHistoryService.exportOrdersAsCSV(store.filteredOrders);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error exporting orders';
      store.setError(message);
      console.error('Error exporting orders:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Historial de Órdenes</h1>
          <p className="text-gray-600">
            Visualiza y gestiona todas tus órdenes de examen. {store.filteredOrders.length} órdenes
            encontradas.
          </p>
        </div>

        {/* Error Alert */}
        {store.error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center">
            <span>{store.error}</span>
            <button
              onClick={() => store.setError(null)}
              className="text-red-700 hover:text-red-900 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Filters */}
        <OrderFilters />

        {/* Export Button */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleExportCSV}
            disabled={store.filteredOrders.length === 0}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Exportar a CSV
          </button>
        </div>

        {/* Table */}
        <OrderTable
          orders={store.filteredOrders}
          onSelectOrder={handleSelectOrder}
          onPrintOrder={handlePrintOrder}
          isLoading={store.isLoading}
        />

        {/* Order Details Modal */}
        <OrderDetailsModal
          order={store.selectedOrder}
          isOpen={!!store.selectedOrder}
          onClose={() => store.setSelectedOrder(null)}
          onPrint={() => {
            if (store.selectedOrder) {
              handlePrintOrder(store.selectedOrder.sample.id);
            }
          }}
        />
      </div>
    </div>
  );
};
