import React from 'react';

const Commissions: React.FC = () => {
  return (
    <div>
      <h2>Doctor Commissions</h2>
      <p>Commission tracking and payments will be displayed here.</p>
      <button style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
        Add Commission
      </button>
    </div>
  );
};

export default Commissions;
