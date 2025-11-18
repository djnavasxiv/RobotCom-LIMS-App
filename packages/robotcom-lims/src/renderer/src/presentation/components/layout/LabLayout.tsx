import React from 'react';
import { Box } from '@mui/material';
import TopMenu from './TopMenu';
import IconToolbar from './IconToolbar';

interface LabLayoutProps {
  children: React.ReactNode;
}

const LabLayout: React.FC<LabLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#fff' }}>
      {/* Top Menu */}
      <TopMenu />

      {/* Icon Toolbar */}
      <IconToolbar />

      {/* Main Content Area */}
      <Box sx={{ flex: 1, overflow: 'auto', backgroundColor: '#fff' }}>
        {children}
      </Box>
    </Box>
  );
};

export default LabLayout;
