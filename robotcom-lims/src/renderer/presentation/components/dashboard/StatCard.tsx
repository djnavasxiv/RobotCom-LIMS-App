import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactElement;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
      <Box sx={{
        mr: 2,
        backgroundColor: color,
        borderRadius: '50%',
        p: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {React.cloneElement(icon, { sx: { color: '#fff' } })}
      </Box>
      <Box>
        <Typography color="text.secondary">{title}</Typography>
        <Typography variant="h5" component="div">
          {value}
        </Typography>
      </Box>
    </Card>
  );
};

export default StatCard;
