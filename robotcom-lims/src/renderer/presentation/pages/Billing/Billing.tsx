import React from 'react';
import { Box, Typography } from '@mui/material';

const Billing: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4">Billing</Typography>
      <Typography paragraph sx={{ mt: 2 }}>
        Billing management functionality will be implemented here.
      </Typography>
    </Box>
  );
};

export default Billing;
