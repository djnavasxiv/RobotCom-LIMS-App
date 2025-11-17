import React, { useEffect, useState } from 'react';
import './BillingSection.css';

interface BillingSectionProps {
  subtotal: number;
  discountPercentage: number;
  discountedTotal: number;
  onDiscountChange: (discount: number) => void;
}

export const BillingSection: React.FC<BillingSectionProps> = ({
  subtotal,
  discountPercentage,
  discountedTotal,
  onDiscountChange,
}) => {
  const [localDiscount, setLocalDiscount] = useState(discountPercentage);
  const discountAmount = subtotal * (discountPercentage / 100);

  const handleDiscountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    if (numValue >= 0 && numValue <= 100) {
      setLocalDiscount(numValue);
      onDiscountChange(numValue);
    }
  };

  return (
    <div className="billing-section">
      <div className="billing-card">
        <h3>FINANCIERO (Billing)</h3>

        <div className="billing-row">
          <label>SUBTOTAL</label>
          <span className="amount">${subtotal.toFixed(2)}</span>
        </div>

        <div className="billing-row discount-row">
          <div className="discount-input-group">
            <label>DESCUENTO %</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={localDiscount}
              onChange={(e) => handleDiscountChange(e.target.value)}
              className="discount-input"
            />
          </div>
          <div className="discount-amount">
            <label>DESCUENTO $</label>
            <span className="amount">${discountAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="billing-divider"></div>

        <div className="billing-row total-row">
          <label>TOTAL</label>
          <span className="total-amount">${discountedTotal.toFixed(2)}</span>
        </div>

        <div className="billing-actions">
          <button className="btn btn-primary">
            FACTURA CCF
          </button>
          <button className="btn btn-secondary">
            RECIBO
          </button>
        </div>
      </div>
    </div>
  );
};
