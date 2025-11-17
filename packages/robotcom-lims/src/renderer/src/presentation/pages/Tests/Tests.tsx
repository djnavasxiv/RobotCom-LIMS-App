import React from 'react';

const Tests: React.FC = () => {
  return (
    <div>
      <h2>Test Catalog</h2>
      <p>Available tests and test profiles will be displayed here.</p>
      <button style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
        Add New Test
      </button>
    </div>
  );
};

export default Tests;
