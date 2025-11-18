import React, { ReactNode } from 'react';
import { Box } from '@mui/material';
import TopMenu from './TopMenu';
import IconToolbar from './IconToolbar';
import './MainLayout.css';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Top Menu */}
      <TopMenu />
      
      {/* Icon Toolbar */}
      <IconToolbar />
      
      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: '#f5f5f5',
          padding: '16px',
        }}
      >
        {children}
      </Box>
      
      {/* Footer */}
      <footer className="app-footer">
        <p>&copy; 2025 RobotCom LIMS. All rights reserved.</p>
      </footer>
    </Box>
  );
};

export default MainLayout;
