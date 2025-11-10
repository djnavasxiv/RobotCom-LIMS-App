import React from 'react';
import { Box, Typography } from '@mui/material';

const Settings: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4">Settings</Typography>
      <Typography paragraph sx={{ mt: 2 }}>
        Settings management functionality will be implemented here.
      </Typography>
    </Box>
  );
};

export default Settings;
