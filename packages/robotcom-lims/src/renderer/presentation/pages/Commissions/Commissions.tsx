import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import DoctorList from './DoctorList';
import CommissionList from './CommissionList';

const Commissions: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Paper>
        <Tabs value={activeTab} onChange={handleChange} centered>
          <Tab label="Gestión de Doctores" />
          <Tab label="Reporte de Comisiones" />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && <DoctorList />}
        {activeTab === 1 && <CommissionList />}
      </Box>
    </Box>
  );
};

export default Commissions;
