import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

interface TimerState {
  id: number;
  running: boolean;
  seconds: number;
  displayTime: string;
}

const MultiTimer: React.FC = () => {
  const [timers, setTimers] = useState<TimerState[]>(
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      running: false,
      seconds: 0,
      displayTime: '00:00:00',
    }))
  );

  const [nextMaintenance] = useState('2025-03-17');

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) =>
        prevTimers.map((timer) => {
          if (timer.running) {
            const newSeconds = timer.seconds + 1;
            const hours = Math.floor(newSeconds / 3600);
            const minutes = Math.floor((newSeconds % 3600) / 60);
            const secs = newSeconds % 60;
            return {
              ...timer,
              seconds: newSeconds,
              displayTime: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`,
            };
          }
          return timer;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleTimer = (id: number) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) => (timer.id === id ? { ...timer, running: !timer.running } : timer))
    );
  };

  const resetTimer = (id: number) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === id ? { ...timer, running: false, seconds: 0, displayTime: '00:00:00' } : timer
      )
    );
  };

  return (
    <Dialog open={true} maxWidth="md" fullWidth>
      <DialogTitle sx={{ backgroundColor: '#1e3a5f', color: 'white', fontWeight: 'bold' }}>
        MULTI TIMER - Utility
      </DialogTitle>

      <DialogContent sx={{ padding: '24px', backgroundColor: '#f5f5f5' }}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {timers.map((timer) => (
            <Grid item xs={6} key={timer.id}>
              <Paper
                sx={{
                  padding: '16px',
                  textAlign: 'center',
                  border: '1px solid #ddd',
                  backgroundColor: timer.running ? '#e3f2fd' : '#fff',
                }}
              >
                <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                  Timer {timer.id + 1}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    color: '#1e3a5f',
                    mb: 2,
                    padding: '16px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '4px',
                  }}
                >
                  {timer.displayTime}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => toggleTimer(timer.id)}
                    sx={{
                      backgroundColor: timer.running ? '#d32f2f' : '#4caf50',
                      textTransform: 'uppercase',
                      fontSize: '11px',
                    }}
                  >
                    {timer.running ? 'STOP' : 'START'}
                  </Button>
                  <Button variant="outlined" size="small" onClick={() => resetTimer(timer.id)}>
                    RESET
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Paper sx={{ padding: '16px', backgroundColor: '#fff', border: '1px solid #ddd' }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>PRÓXIMO MANTENIMIENTO:</strong> {nextMaintenance}
          </Typography>
          <Typography variant="caption" sx={{ color: '#666' }}>
            RobotComLab - Sistema de Gestión de Laboratorio Clínico
          </Typography>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ padding: '16px', backgroundColor: '#f5f5f5' }}>
        <Button variant="contained" color="primary" onClick={() => window.close()}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MultiTimer;
