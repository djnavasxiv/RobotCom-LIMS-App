import React from 'react';
import { Box, Typography } from '@mui/material';

const Inventory: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4">Inventory</Typography>
      <Typography paragraph sx={{ mt: 2 }}>
        Inventory management functionality will be implemented here.
      </Typography>
    </Box>
  );
};

export default Inventory;
