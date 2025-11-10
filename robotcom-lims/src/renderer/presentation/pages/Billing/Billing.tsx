import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import SampleEntryForm from './SampleEntryForm';
import InvoiceList from './InvoiceList';

const Billing: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Paper>
        <Tabs value={activeTab} onChange={handleChange} centered>
          <Tab label="New Sample" />
          <Tab label="Invoice History" />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && <SampleEntryForm />}
        {activeTab === 1 && <InvoiceList />}
      </Box>
    </Box>
  );
};

export default Billing;
