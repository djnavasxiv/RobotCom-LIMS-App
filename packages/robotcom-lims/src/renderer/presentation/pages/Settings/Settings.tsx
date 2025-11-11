import React from 'react';
import { Box, Typography } from '@mui/material';
import LabSettingsForm from './LabSettingsForm';

const Settings: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Settings</Typography>
      <LabSettingsForm />
    </Box>
  );
};

export default Settings;
