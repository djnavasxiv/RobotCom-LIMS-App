import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface TopMenuProps {
  onExit?: () => void;
}

const TopMenu: React.FC<TopMenuProps> = ({ onExit }) => {
  const navigate = useNavigate();

  const handleExit = () => {
    if (onExit) {
      onExit();
    } else {
      window.close();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1e3a5f',
        color: 'white',
        padding: '8px 16px',
        borderBottom: '2px solid #0f2740',
        fontWeight: 'bold',
        fontSize: '14px',
      }}
    >
      <Stack direction="row" spacing={2}>
        <Button
          onClick={() => navigate('/company')}
          sx={{
            color: 'white',
            textTransform: 'uppercase',
            fontSize: '12px',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#2a5a8f',
            },
          }}
        >
          EMPRESA
        </Button>
        <Button
          onClick={() => navigate('/patients')}
          sx={{
            color: 'white',
            textTransform: 'uppercase',
            fontSize: '12px',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#2a5a8f',
            },
          }}
        >
          PACIENTES
        </Button>
        <Button
          onClick={() => navigate('/diversos')}
          sx={{
            color: 'white',
            textTransform: 'uppercase',
            fontSize: '12px',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#2a5a8f',
            },
          }}
        >
          DIVERSOS
        </Button>
        <Button
          onClick={() => navigate('/billing')}
          sx={{
            color: 'white',
            textTransform: 'uppercase',
            fontSize: '12px',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#2a5a8f',
            },
          }}
        >
          INGRESOS
        </Button>
        <Button
          onClick={() => navigate('/commissions')}
          sx={{
            color: 'white',
            textTransform: 'uppercase',
            fontSize: '12px',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#2a5a8f',
            },
          }}
        >
          COMISIONES
        </Button>
      </Stack>
      <Button
        onClick={handleExit}
        sx={{
          backgroundColor: '#d32f2f',
          color: 'white',
          textTransform: 'uppercase',
          fontSize: '12px',
          fontWeight: 'bold',
          padding: '6px 16px',
          '&:hover': {
            backgroundColor: '#b71c1c',
          },
        }}
      >
        SALIR
      </Button>
    </Box>
  );
};

export default TopMenu;
