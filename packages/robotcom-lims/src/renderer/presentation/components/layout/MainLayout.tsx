import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Biotech as BiotechIcon,
  Receipt as ReceiptIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  AttachMoney as CommissionIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const navItems = [
  { text: 'Principal', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Pacientes', icon: <PeopleIcon />, path: '/patients' },
  { text: 'Exámenes', icon: <BiotechIcon />, path: '/tests' },
  { text: 'Ingresos', icon: <ReceiptIcon />, path: '/billing' },
  { text: 'Comisiones', icon: <CommissionIcon />, path: '/commissions' },
  { text: 'Inventario', icon: <InventoryIcon />, path: '/inventory' },
  { text: 'Configuración', icon: <SettingsIcon />, path: '/settings' },
];

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            RobotComLab
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  selected={location.pathname.startsWith(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
