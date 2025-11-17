import React from 'react';

const Inventory: React.FC = () => {
  return (
    <div>
      <h2>Inventory Management</h2>
      <p>Laboratory inventory and supplies will be displayed here.</p>
      <button style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
        Add Inventory Item
      </button>
    </div>
  );
};

export default Inventory;
