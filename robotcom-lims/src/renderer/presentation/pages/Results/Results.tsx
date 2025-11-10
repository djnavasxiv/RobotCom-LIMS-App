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
          label="Enter Sample ID"
          value={sampleId}
          onChange={(e) => setSampleId(e.target.value)}
          variant="outlined"
          size="small"
        />
        <Button variant="contained" onClick={handleSearch}>
          Find Sample
        </Button>
      </Paper>

      {searchedId ? (
        <TestResultForm sampleId={searchedId} />
      ) : (
        <Typography>Enter a sample ID to begin entering results.</Typography>
      )}
    </Box>
  );
};

export default Results;
