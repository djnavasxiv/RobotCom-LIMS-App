import React from 'react';
import { Box, TextField, Button, Grid, Typography } from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';

export interface PatientData {
  patientId: string;
  patientName: string;
  age: string;
  gender: string;
  doctor: string;
  showNo?: boolean;
}

interface PatientHeaderProps {
  patientData: PatientData;
  onPatientDataChange: (data: Partial<PatientData>) => void;
  onSearch?: () => void;
  onFilter?: () => void;
  onNoFilter?: () => void;
}

const PatientHeader: React.FC<PatientHeaderProps> = ({
  patientData,
  onPatientDataChange,
  onSearch,
  onFilter,
  onNoFilter,
}) => {
  return (
    <Box sx={{ backgroundColor: '#f5f5f5', padding: '12px', borderBottom: '1px solid #ddd', marginBottom: '12px' }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TextField
              label="PCTE No."
              size="small"
              value={patientData.patientId}
              onChange={(e) => onPatientDataChange({ patientId: e.target.value })}
              sx={{ width: '120px' }}
            />
            {patientData.showNo !== false && (
              <Button
                variant="outlined"
                size="small"
                sx={{ textTransform: 'uppercase', fontSize: '10px' }}
              >
                No
              </Button>
            )}
          </Box>
        </Grid>

        <Grid item xs={3}>
          <TextField
            label="PACIENTE"
            size="small"
            fullWidth
            value={patientData.patientName}
            onChange={(e) => onPatientDataChange({ patientName: e.target.value })}
          />
        </Grid>

        <Grid item xs={1}>
          <TextField
            label="EDAD"
            size="small"
            fullWidth
            value={patientData.age}
            onChange={(e) => onPatientDataChange({ age: e.target.value })}
          />
        </Grid>

        <Grid item xs={1}>
          <TextField
            label="GENERO"
            size="small"
            fullWidth
            value={patientData.gender}
            onChange={(e) => onPatientDataChange({ gender: e.target.value })}
          />
        </Grid>

        <Grid item xs={2}>
          <TextField
            label="MEDICO"
            size="small"
            fullWidth
            value={patientData.doctor}
            onChange={(e) => onPatientDataChange({ doctor: e.target.value })}
          />
        </Grid>

        <Grid item xs={3} sx={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<SearchOutlined />}
            onClick={onSearch}
            sx={{ textTransform: 'uppercase', fontSize: '11px' }}
          >
            BUSCAR
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={onFilter}
            sx={{ textTransform: 'uppercase', fontSize: '11px' }}
          >
            FILTRAR
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={onNoFilter}
            sx={{ textTransform: 'uppercase', fontSize: '11px' }}
          >
            NO FILTRO
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientHeader;
