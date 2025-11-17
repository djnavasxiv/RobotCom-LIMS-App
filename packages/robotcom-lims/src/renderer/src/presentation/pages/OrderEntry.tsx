import React, { useEffect } from 'react';
import { useOrderStore } from '../../../application/state/orderStore';
import { OrderService } from '../../../application/services/OrderService';
import { PatientSearchForm } from '../components/OrderEntry/PatientSearchForm';
import { TestSelectionGrid } from '../components/OrderEntry/TestSelectionGrid';
import { BillingSection } from '../components/OrderEntry/BillingSection';
import { useAuthStore } from '../../../application/state/authStore';
import { Patient } from '../../../domain/entities/Patient';
import { Test } from '../../../domain/entities/Test';
import './OrderEntry.css';

const OrderEntry: React.FC = () => {
  const { labId } = useAuthStore();
  const {
    patient,
    selectedTests,
    subtotal,
    discountPercentage,
    discountedTotal,
    isLoading,
    error,
    setPatient,
    addTest,
    removeTest,
    clearTests,
    setDiscountPercentage,
    calculateTotals,
    resetOrder,
    setLoading,
    setError,
  } = useOrderStore();

  const orderService = new OrderService();

  useEffect(() => {
    calculateTotals();
  }, [selectedTests, discountPercentage, calculateTotals]);

  const handleSaveOrder = async () => {
    if (!patient) {
      setError('Please select a patient');
      return;
    }
    if (selectedTests.length === 0) {
      setError('Please select at least one test');
      return;
    }

    setLoading(true);
    try {
      const response = await orderService.createOrder({
        patientId: patient.id,
        testIds: selectedTests.map((t) => t.testId),
        subtotal,
        discountPercentage,
        labId: labId || '',
      });

      if (response.success && response.data) {
        alert(`✅ Order saved successfully!\nOrder Number: ${response.data.orderNumber}`);
        resetOrder();
        setError(null);
      } else {
        setError(response.error || 'Failed to save order');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Error saving order: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintOrder = () => {
    if (!patient || selectedTests.length === 0) {
      setError('Cannot print: Order is incomplete');
      return;
    }
    // TODO: Implement print logic
    alert('Print Order functionality coming soon');
  };

  const handleDailyReport = () => {
    // TODO: Implement daily report
    alert('Daily Report functionality coming soon');
  };

  const handlePriceQuery = () => {
    // TODO: Implement price query modal
    alert('Price Query functionality coming soon');
  };

  return (
    <div className="order-entry-container">
      <div className="order-entry-header">
        <h1>ORDEN DE EXAMENES</h1>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={handlePriceQuery}>
            CONSULTA $
          </button>
          <button className="btn btn-outline" onClick={handleDailyReport}>
            REPORTE DIARIO
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="order-entry-content">
        {/* Left Column - Patient & Tests */}
        <div className="left-column">
          {/* Patient Registration Section */}
          <section className="order-section">
            <h2>1. REGISTRO DE PACIENTE (Patient Registration)</h2>
            <PatientSearchForm
              onPatientSelect={setPatient}
              selectedPatient={patient}
            />
          </section>

          {/* Test Selection Section */}
          <section className="order-section">
            <h2>2. SELECCIÓN DE EXAMENES (Test Selection)</h2>
            <TestSelectionGrid
              selectedTests={selectedTests}
              onAddTest={addTest}
              onRemoveTest={removeTest}
            />
          </section>
        </div>

        {/* Right Column - Billing & Actions */}
        <div className="right-column">
          <BillingSection
            subtotal={subtotal}
            discountPercentage={discountPercentage}
            discountedTotal={discountedTotal}
            onDiscountChange={setDiscountPercentage}
          />

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              className="btn btn-success"
              onClick={handleSaveOrder}
              disabled={isLoading || !patient || selectedTests.length === 0}
            >
              {isLoading ? 'GUARDANDO...' : 'GUARDAR ORDEN'}
            </button>
            <button
              className="btn btn-info"
              onClick={handlePrintOrder}
              disabled={!patient || selectedTests.length === 0}
            >
              IMPRIMIR ORDEN
            </button>
            <button className="btn btn-secondary" onClick={resetOrder}>
              NUEVA ORDEN
            </button>
          </div>

          {/* Selected Tests Count */}
          {selectedTests.length > 0 && (
            <div className="summary-card">
              <h3>RESUMEN</h3>
              <div className="summary-item">
                <span>Tests Selected:</span>
                <strong>{selectedTests.length}</strong>
              </div>
              <div className="summary-item">
                <span>Subtotal:</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              {discountPercentage > 0 && (
                <div className="summary-item discount">
                  <span>Discount ({discountPercentage}%):</span>
                  <strong>-${(subtotal * (discountPercentage / 100)).toFixed(2)}</strong>
                </div>
              )}
              <div className="summary-divider"></div>
              <div className="summary-item total">
                <span>TOTAL:</span>
                <strong>${discountedTotal.toFixed(2)}</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderEntry;
