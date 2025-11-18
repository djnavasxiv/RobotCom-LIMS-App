import React from 'react';
import { OrderListItem } from '../../../../application/state/orderHistoryStore';

interface OrderTableProps {
  orders: OrderListItem[];
  onSelectOrder: (order: OrderListItem) => void;
  onPrintOrder: (orderId: string) => void;
  isLoading?: boolean;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onSelectOrder,
  onPrintOrder,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No orders found</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200 bg-white">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-blue-600 to-blue-700 border-b-2 border-blue-800">
            <th className="px-6 py-4 text-left text-sm font-bold text-white">
              Orden #
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-white">
              Paciente
            </th>
            <th className="px-6 py-4 text-center text-sm font-bold text-white">
              Pruebas
            </th>
            <th className="px-6 py-4 text-right text-sm font-bold text-white hidden md:table-cell">
              Subtotal
            </th>
            <th className="px-6 py-4 text-right text-sm font-bold text-white hidden lg:table-cell">
              Descuento
            </th>
            <th className="px-6 py-4 text-right text-sm font-bold text-white">
              Total
            </th>
            <th className="px-6 py-4 text-center text-sm font-bold text-white">
              Estado
            </th>
            <th className="px-6 py-4 text-center text-sm font-bold text-white hidden sm:table-cell">
              Fecha
            </th>
            <th className="px-6 py-4 text-center text-sm font-bold text-white">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-gray-200 hover:bg-blue-50 transition-all duration-200 cursor-pointer active:bg-blue-100"
              onClick={() => onSelectOrder(order)}
            >
              <td className="px-6 py-4 font-bold text-blue-600 text-base">
                #{order.sampleNumber}
              </td>
              <td className="px-6 py-4 text-gray-900 font-medium">{order.patientName}</td>
              <td className="px-6 py-4 text-center">
                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-4 py-2 rounded-full">
                  {order.testCount} {order.testCount === 1 ? 'prueba' : 'pruebas'}
                </span>
              </td>
              <td className="px-6 py-4 text-right text-gray-700 hidden md:table-cell">
                <span className="font-semibold">${order.subtotal.toFixed(2)}</span>
              </td>
              <td className="px-6 py-4 text-right text-red-600 font-bold hidden lg:table-cell">
                -${order.discount.toFixed(2)}
              </td>
              <td className="px-6 py-4 text-right">
                <span className="font-bold text-gray-900 text-base">
                  ${order.total.toFixed(2)}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <span
                  className={`inline-block text-xs font-bold px-3 py-2 rounded-lg ${
                    order.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                      : order.status === 'completed'
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-700 border border-red-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-300'
                  }`}
                >
                  {order.status === 'pending' ? '⏳' : order.status === 'completed' ? '✓' : '✕'} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 text-center text-sm font-medium text-gray-600 hidden sm:table-cell">
                {new Date(order.collectionDate).toLocaleDateString('es-ES')}
              </td>
              <td className="px-6 py-4 text-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrintOrder(order.id);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
                  title="Imprimir factura"
                >
                  🖨️ Imprimir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
