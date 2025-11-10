import React from 'react';
import { Box, Typography } from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4">Dashboard</Typography>
      <Typography paragraph sx={{ mt: 2 }}>
        Welcome to the RobotComLab LIMS.
      </Typography>
    </Box>
  );
};

export default Dashboard;
