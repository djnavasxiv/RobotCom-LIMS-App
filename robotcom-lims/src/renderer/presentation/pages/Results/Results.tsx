import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography } from '@mui/material';
import TestResultForm from './TestResultForm';

const Results: React.FC = () => {
  const [sampleId, setSampleId] = useState('');
  const [searchedId, setSearchedId] = useState('');

  const handleSearch = () => {
    setSearchedId(sampleId);
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Introducir ID de Muestra"
          value={sampleId}
          onChange={(e) => setSampleId(e.target.value)}
          variant="outlined"
          size="small"
        />
        <Button variant="contained" onClick={handleSearch}>
          Buscar Muestra
        </Button>
      </Paper>

      {searchedId ? (
        <TestResultForm sampleId={searchedId} />
      ) : (
        <Typography>Introduzca un ID de muestra para comenzar a registrar resultados.</Typography>
      )}
    </Box>
  );
};

export default Results;
