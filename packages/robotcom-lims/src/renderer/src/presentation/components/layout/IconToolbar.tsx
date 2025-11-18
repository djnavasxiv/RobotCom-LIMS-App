import React from 'react';
import { Box, Button, Stack, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  MedicalServicesOutlined,
  LocalHospitalOutlined,
  BiotechOutlined,
  ScienceOutlined,
  FavoriteBorderOutlined,
  FemaleOutlined,
  AssignmentOutlined,
  HistoryOutlined,
  SearchOutlined,
} from '@mui/icons-material';

const IconToolbar: React.FC = () => {
  const navigate = useNavigate();

  const toolbarButtons = [
    {
      icon: <AssignmentOutlined sx={{ fontSize: '32px' }} />,
      label: 'ORDEN DE EXAMEN',
      route: '/test-order',
    },
    {
      icon: <FavoriteBorderOutlined sx={{ fontSize: '32px' }} />,
      label: 'TIPO',
      route: '/tests/blood-type',
    },
    {
      icon: <ScienceOutlined sx={{ fontSize: '32px' }} />,
      label: 'COAGULA',
      route: '/tests/coagulation',
    },
    {
      icon: <BiotechOutlined sx={{ fontSize: '32px' }} />,
      label: 'ELISA',
      route: '/tests/elisa',
    },
    {
      icon: <LocalHospitalOutlined sx={{ fontSize: '32px' }} />,
      label: 'INMUNO',
      route: '/tests/immunology',
    },
    {
      icon: <MedicalServicesOutlined sx={{ fontSize: '32px' }} />,
      label: 'HORMONA',
      route: '/tests/hormones',
    },
    {
      icon: <AssignmentOutlined sx={{ fontSize: '32px' }} />,
      label: 'ORINA',
      route: '/tests/urinalysis',
    },
    {
      icon: <AssignmentOutlined sx={{ fontSize: '32px' }} />,
      label: 'HECES',
      route: '/tests/stool',
    },
    {
      icon: <ScienceOutlined sx={{ fontSize: '32px' }} />,
      label: 'QUIMICA',
      route: '/tests/chemistry',
    },
    {
      icon: <FemaleOutlined sx={{ fontSize: '32px' }} />,
      label: 'EMBARAZO',
      route: '/tests/pregnancy',
    },
    {
      icon: <LocalHospitalOutlined sx={{ fontSize: '32px' }} />,
      label: 'HEMATO',
      route: '/tests/hematology',
    },
    {
      icon: <BiotechOutlined sx={{ fontSize: '32px' }} />,
      label: 'BACTER',
      route: '/tests/bacteriology',
    },
    {
      icon: <AssignmentOutlined sx={{ fontSize: '32px' }} />,
      label: 'ESPERMO',
      route: '/tests/semen',
    },
    {
      icon: <SearchOutlined sx={{ fontSize: '32px' }} />,
      label: 'V. BACTER',
      route: '/search/bacteriology',
    },
    {
      icon: <SearchOutlined sx={{ fontSize: '32px' }} />,
      label: 'V. HECES',
      route: '/search/stool',
    },
    {
      icon: <SearchOutlined sx={{ fontSize: '32px' }} />,
      label: 'V. HEMATC',
      route: '/search/hematology',
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        padding: '12px',
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #ddd',
        overflowY: 'auto',
        maxHeight: '120px',
      }}
    >
      {toolbarButtons.map((btn, index) => (
        <Tooltip key={index} title={btn.label} placement="bottom">
          <Button
            onClick={() => navigate(btn.route)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '90px',
              height: '80px',
              padding: '4px',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              color: '#1e3a5f',
              textTransform: 'uppercase',
              fontSize: '10px',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#e3f2fd',
                borderColor: '#1976d2',
              },
            }}
          >
            <Box sx={{ mb: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {btn.icon}
            </Box>
            <Box sx={{ textAlign: 'center', lineHeight: '1.2' }}>{btn.label}</Box>
          </Button>
        </Tooltip>
      ))}
    </Box>
  );
};

export default IconToolbar;
