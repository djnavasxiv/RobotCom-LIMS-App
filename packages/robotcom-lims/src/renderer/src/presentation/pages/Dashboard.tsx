import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Patients</h3>
          <p style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#3498db' }}>0</p>
          <p style={{ color: '#7f8c8d', fontSize: '0.875rem' }}>Total patients</p>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Samples</h3>
          <p style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#2ecc71' }}>0</p>
          <p style={{ color: '#7f8c8d', fontSize: '0.875rem' }}>Pending samples</p>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Tests</h3>
          <p style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#e74c3c' }}>0</p>
          <p style={{ color: '#7f8c8d', fontSize: '0.875rem' }}>Tests today</p>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Revenue</h3>
          <p style={{ fontSize: '2rem', margin: '0.5rem 0', color: '#f39c12' }}>$0</p>
          <p style={{ color: '#7f8c8d', fontSize: '0.875rem' }}>This month</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
