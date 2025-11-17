import React from 'react';
import { OrderDetailsData } from '../../../../application/state/orderHistoryStore';

interface OrderDetailsModalProps {
  order: OrderDetailsData | null;
  isOpen: boolean;
  onClose: () => void;
  onPrint: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  onPrint,
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Orden #{order.sample.sampleNumber}</h2>
            <p className="text-blue-100 text-sm">{order.invoice.invoiceNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-800 rounded-full p-2 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Patient Information */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
              Información del Paciente
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nombre</p>
                <p className="font-semibold text-gray-900">
                  {order.patient.firstName} {order.patient.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Teléfono</p>
                <p className="font-semibold text-gray-900">{order.patient.phone}</p>
              </div>
              {order.patient.email && (
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{order.patient.email}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Género</p>
                <p className="font-semibold text-gray-900">
                  {order.patient.gender === 'M' ? 'Masculino' : 'Femenino'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha de Nacimiento</p>
                <p className="font-semibold text-gray-900">
                  {new Date(order.patient.birthDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Edad</p>
                <p className="font-semibold text-gray-900">
                  {Math.floor(
                    (new Date().getTime() - new Date(order.patient.birthDate).getTime()) /
                      (365.25 * 24 * 60 * 60 * 1000)
                  )}{' '}
                  años
                </p>
              </div>
            </div>
          </section>

          {/* Sample Information */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
              Información de la Muestra
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Fecha de Recolección</p>
                <p className="font-semibold text-gray-900">
                  {new Date(order.sample.collectionDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <p
                  className={`font-semibold inline-block px-3 py-1 rounded-full text-sm ${
                    order.sample.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.sample.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {order.sample.status.charAt(0).toUpperCase() + order.sample.status.slice(1)}
                </p>
              </div>
              {order.sample.notes && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Notas</p>
                  <p className="text-gray-900">{order.sample.notes}</p>
                </div>
              )}
            </div>
          </section>

          {/* Tests */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
              Exámenes ({order.tests.length})
            </h3>
            <div className="space-y-2">
              {order.tests.map((test) => (
                <div
                  key={test.id}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded border border-gray-200"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{test.name}</p>
                    <p className="text-xs text-gray-600">{test.code}</p>
                  </div>
                  <p className="font-semibold text-gray-900">${test.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Invoice Summary */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
              Resumen de Factura
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>${order.invoice.subtotal.toFixed(2)}</span>
              </div>
              {order.invoice.discount > 0 && (
                <div className="flex justify-between text-red-600 font-semibold">
                  <span>Descuento:</span>
                  <span>-${order.invoice.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900 bg-blue-50 p-3 rounded">
                <span>Total:</span>
                <span>${order.invoice.total.toFixed(2)}</span>
              </div>
              <div className="text-sm text-gray-600 text-right">
                <p>Estado: {order.invoice.status}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-100 px-6 py-4 flex gap-3 border-t">
          <button
            onClick={onPrint}
            className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Imprimir Factura
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors font-semibold"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
