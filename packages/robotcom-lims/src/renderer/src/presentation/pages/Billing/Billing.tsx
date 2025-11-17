import React from 'react';

const Billing: React.FC = () => {
  return (
    <div>
      <h2>Billing & Invoices</h2>
      <p>Invoice management and billing information will be displayed here.</p>
      <button style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
        Create New Invoice
      </button>
    </div>
  );
};

export default Billing;
