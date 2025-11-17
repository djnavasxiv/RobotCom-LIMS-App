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
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b-2 border-gray-300">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Order #
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Patient
            </th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
              Tests
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
              Subtotal
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
              Discount
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
              Total
            </th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
              Status
            </th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
              Date
            </th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onSelectOrder(order)}
            >
              <td className="px-6 py-4 font-semibold text-gray-900">
                {order.sampleNumber}
              </td>
              <td className="px-6 py-4 text-gray-700">{order.patientName}</td>
              <td className="px-6 py-4 text-center">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                  {order.testCount}
                </span>
              </td>
              <td className="px-6 py-4 text-right text-gray-700">
                ${order.subtotal.toFixed(2)}
              </td>
              <td className="px-6 py-4 text-right text-red-600 font-semibold">
                -${order.discount.toFixed(2)}
              </td>
              <td className="px-6 py-4 text-right font-semibold text-gray-900">
                ${order.total.toFixed(2)}
              </td>
              <td className="px-6 py-4 text-center">
                <span
                  className={`inline-block text-xs px-3 py-1 rounded-full font-semibold ${
                    order.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 text-center text-sm text-gray-600">
                {new Date(order.collectionDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrintOrder(order.id);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                  title="Print invoice"
                >
                  Print
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
