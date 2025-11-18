import React, { useEffect, useRef } from 'react';
import { useOrderHistoryStore } from '../../../application/state/orderHistoryStore';
import { OrderHistoryService } from '../../../application/services/OrderHistoryService';
import { OrderFilters } from '../components/OrderHistory/OrderFilters';
import { OrderTable } from '../components/OrderHistory/OrderTable';
import { OrderDetailsModal } from '../components/OrderHistory/OrderDetailsModal';

export const OrderHistory: React.FC = () => {
  const store = useOrderHistoryStore();
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const loadOrders = async () => {
      try {
        store.setLoading(true);
        store.setError(null);
        const orders = await OrderHistoryService.getOrders();
        if (Array.isArray(orders)) {
          store.setOrders(orders);
          store.setFilteredOrders(orders);
        } else {
          throw new Error('Invalid orders data format');
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error loading orders';
        store.setError(message);
        console.error('Error loading orders:', error);
      } finally {
        store.setLoading(false);
      }
    };

    loadOrders();
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-5xl font-bold text-gray-900 mb-3">Historial de Órdenes</h1>
              <p className="text-gray-600 text-lg">
                Visualiza y gestiona todas tus órdenes de examen
              </p>
              <div className="mt-4 h-1 w-32 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
            </div>
            {store.filteredOrders.length > 0 && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center min-w-max">
                <p className="text-blue-600 text-sm font-semibold uppercase">Total de Órdenes</p>
                <p className="text-3xl font-bold text-blue-700 mt-2">{store.filteredOrders.length}</p>
              </div>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {store.error && (
          <div className="mb-8 p-6 bg-red-50 border-2 border-red-300 text-red-700 rounded-lg flex justify-between items-center shadow-md">
            <span className="flex items-center gap-3 font-semibold">
              <span className="text-2xl">⚠️</span>
              {store.error}
            </span>
            <button
              onClick={() => store.setError(null)}
              className="text-red-700 hover:text-red-900 font-bold text-xl p-1 hover:bg-red-200 rounded transition-all"
            >
              ✕
            </button>
          </div>
        )}

        {/* Filters */}
        <OrderFilters />

        {/* Action Bar */}
        <div className="mb-6 flex justify-between items-center">
          <div className="text-gray-600 font-semibold">
            📊 Mostrando <span className="text-blue-600 font-bold">{store.filteredOrders.length}</span> órdenes
          </div>
          <button
            onClick={handleExportCSV}
            disabled={store.filteredOrders.length === 0}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-bold shadow-md hover:shadow-lg disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            📥 Exportar a CSV
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
