import React, { useEffect, useState } from 'react';
import { useOrderHistoryStore } from '../../../../application/state/orderHistoryStore';
import { OrderHistoryService } from '../../../../application/services/OrderHistoryService';

export const OrderFilters: React.FC = () => {
  const store = useOrderHistoryStore();
  const [patients, setPatients] = useState<Array<{ id: string; name: string }>>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoadingPatients(true);
      const patientsData = await OrderHistoryService.getPatients();
      setPatients(patientsData);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoadingPatients(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    store.setSearchQuery(e.target.value);
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    store.setDateFrom(e.target.value || null);
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    store.setDateTo(e.target.value || null);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    store.setStatusFilter(e.target.value);
  };

  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    store.setPatientFilter(e.target.value);
  };

  const handleApplyFilters = () => {
    store.applyFilters();
  };

  const handleClearFilters = () => {
    store.clearFilters();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtros y Búsqueda</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Búsqueda
          </label>
          <input
            type="text"
            placeholder="Orden #, Paciente, Factura"
            value={store.searchQuery}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Date From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Desde
          </label>
          <input
            type="date"
            value={store.dateFrom || ''}
            onChange={handleDateFromChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hasta
          </label>
          <input
            type="date"
            value={store.dateTo || ''}
            onChange={handleDateToChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            value={store.statusFilter}
            onChange={handleStatusChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendiente</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>

        {/* Patient Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paciente
          </label>
          <select
            value={store.patientFilter}
            onChange={handlePatientChange}
            disabled={loadingPatients}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">Todos</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleApplyFilters}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Buscar
        </button>
        <button
          onClick={handleClearFilters}
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );
};
