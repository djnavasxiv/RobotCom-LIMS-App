import React, { ReactNode } from 'react';
import './MainLayout.css';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="main-layout">
      <header className="app-header">
        <div className="header-content">
          <h1>RobotCom LIMS</h1>
          <nav className="main-nav">
            <a href="/">Dashboard</a>
            <a href="/order-entry">Órdenes</a>
            <a href="/patients">Patients</a>
            <a href="/samples">Samples</a>
            <a href="/tests">Tests</a>
            <a href="/invoices">Invoices</a>
          </nav>
        </div>
      </header>
      <main className="app-main">
        {children}
      </main>
      <footer className="app-footer">
        <p>&copy; 2025 RobotCom LIMS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
