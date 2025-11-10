import React from 'react'
import { Box, Typography, Button } from '@mui/material'

function App(): JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <Typography variant="h1" color="primary">
        Hello World!
      </Typography>
      <Typography variant="h5" color="text.secondary" sx={{ mt: 2 }}>
        Welcome to RobotComLab
      </Typography>
      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary">
          Primary Button
        </Button>
        <Button variant="contained" color="secondary">
          Secondary Button
        </Button>
      </Box>
    </Box>
  )
}

export default App
