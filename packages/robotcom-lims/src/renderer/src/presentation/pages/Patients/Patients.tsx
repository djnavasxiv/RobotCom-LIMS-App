import React from 'react';

const Patients: React.FC = () => {
  return (
    <div>
      <h2>Patients Management</h2>
      <p>Patient records and management will be displayed here.</p>
      <button style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
        Add New Patient
      </button>
    </div>
  );
};

export default Patients;
