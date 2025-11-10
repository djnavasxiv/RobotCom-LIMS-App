import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import StatCard from '../../components/dashboard/StatCard';
import { People, AttachMoney, Biotech, Receipt } from '@mui/icons-material';

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Página Principal</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pacientes Registrados"
            value="1,234"
            icon={<People />}
            color="#0066CC" // Primary Blue
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Ingresos del Mes"
            value="$5,678"
            icon={<AttachMoney />}
            color="#00C853" // Secondary Green
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Exámenes Realizados"
            value="345"
            icon={<Biotech />}
            color="#FF6B35" // Accent Orange
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Facturas Pendientes"
            value="67"
            icon={<Receipt />}
            color="#E53E3E" // Error Red
          />
        </Grid>

        <Grid item xs={12} md={8}>
           <Paper sx={{ p: 2, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Typography color="text.secondary">Gráfico de Ingresos Mensuales (placeholder)</Typography>
           </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
           <Paper sx={{ p: 2, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">Volumen de Exámenes (placeholder)</Typography>
           </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
