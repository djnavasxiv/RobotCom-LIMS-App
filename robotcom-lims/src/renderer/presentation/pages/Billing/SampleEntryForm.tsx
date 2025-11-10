import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemSecondaryAction,
} from '@mui/material';
import { SampleService } from '../../../application/services/SampleService';
import { Patient } from '../../../domain/entities/Patient';
import { Test } from '../../../domain/entities/Test';
import { TestProfile } from '../../../domain/entities/TestProfile';

const steps = ['Select Patient', 'Select Tests', 'Confirm & Save'];

const SampleEntryForm: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  // Patient Selection
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientLoading, setPatientLoading] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');
  // Test Selection
  const [selectionMode, setSelectionMode] = useState<'profile' | 'individual'>('profile');
  const [profiles, setProfiles] = useState<TestProfile[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>([]);
  const [testLoading, setTestLoading] = useState(false);
  // Confirmation
  const [sampleNumber, setSampleNumber] = useState('');
  const [notes, setNotes] = useState('');

  const sampleService = new SampleService();

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async (query = '') => {
    setPatientLoading(true);
    try {
      const labId = 'current-lab-id';
      const data = query ? await sampleService.searchPatients(labId, query) : await sampleService.getAllPatients(labId);
      setPatients(data);
    } catch (error) {
      console.error('Failed to load patients:', error);
    } finally {
      setPatientLoading(false);
    }
  };

  const loadTestsAndProfiles = () => {
    setTestLoading(true);
    Promise.all([sampleService.getAllTests(), sampleService.getAllTestProfiles()])
      .then(([testsData, profilesData]) => {
        setTests(testsData);
        setProfiles(profilesData);
      })
      .catch(err => console.error('Failed to load tests/profiles:', err))
      .finally(() => setTestLoading(false));
  };

  const handleNext = () => {
    if (activeStep === 0) {
      loadTestsAndProfiles();
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSave = async () => {
    if (!selectedPatient) return;
    try {
      await sampleService.createSample({
        patientId: selectedPatient.id,
        profileId: selectionMode === 'profile' ? selectedProfileId : undefined,
        testIds: selectionMode === 'individual' ? selectedTestIds : [],
        sampleNumber,
        notes,
      });
      // Reset form and navigate away or show success
      setActiveStep(0);
      setSelectedPatient(null);
      // ... reset other states
    } catch (error) {
      console.error('Failed to create sample:', error);
    }
  };

  const totalCost = useMemo(() => {
    if (selectionMode === 'profile' && selectedProfileId) {
      const profile = profiles.find(p => p.id === selectedProfileId);
      return profile?.tests.reduce((sum, test) => sum + test.price, 0) || 0;
    }
    if (selectionMode === 'individual') {
      return selectedTestIds.reduce((sum, id) => {
        const test = tests.find(t => t.id === id);
        return sum + (test?.price || 0);
      }, 0);
    }
    return 0;
  }, [selectionMode, selectedProfileId, selectedTestIds, profiles, tests]);

  // UI Components for each step
  const PatientSelectionStep = () => (
     <Box>
      <TextField
        fullWidth
        label="Search Patients"
        variant="outlined"
        value={patientSearch}
        onChange={(e) => {
          setPatientSearch(e.target.value);
          loadPatients(e.target.value);
        }}
        sx={{ mb: 2 }}
      />
      {patientLoading ? <CircularProgress /> : (
        <Paper sx={{ maxHeight: 300, overflow: 'auto' }}>
          <List>
            {patients.map((p) => (
              <ListItem
                button
                key={p.id}
                selected={selectedPatient?.id === p.id}
                onClick={() => setSelectedPatient(p)}
              >
                <ListItemText primary={p.fullName} secondary={p.phone.formatted()} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );

  const TestSelectionStep = () => (
    <Box>
      <ToggleButtonGroup
        value={selectionMode}
        exclusive
        onChange={(_, val) => setSelectionMode(val)}
        sx={{ mb: 2 }}
      >
        <ToggleButton value="profile">By Profile</ToggleButton>
        <ToggleButton value="individual">By Individual Test</ToggleButton>
      </ToggleButtonGroup>

      {testLoading ? <CircularProgress /> : (
        selectionMode === 'profile' ? (
          <FormControl fullWidth>
            <InputLabel>Test Profile</InputLabel>
            <Select
              value={selectedProfileId}
              label="Test Profile"
              onChange={(e) => setSelectedProfileId(e.target.value)}
            >
              {profiles.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
            </Select>
          </FormControl>
        ) : (
          <Paper sx={{ maxHeight: 300, overflow: 'auto' }}>
            <List>
              {tests.map(t => (
                <ListItem
                  key={t.id}
                  button
                  onClick={() => {
                    const newIds = selectedTestIds.includes(t.id)
                      ? selectedTestIds.filter(id => id !== t.id)
                      : [...selectedTestIds, t.id];
                    setSelectedTestIds(newIds);
                  }}
                >
                  <Checkbox edge="start" checked={selectedTestIds.includes(t.id)} tabIndex={-1} disableRipple />
                  <ListItemText primary={t.name} />
                  <ListItemSecondaryAction>
                    <Typography>${t.price.toFixed(2)}</Typography>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        )
      )}
      <Typography variant="h6" sx={{ mt: 2 }}>Total: ${totalCost.toFixed(2)}</Typography>
    </Box>
  );

  const ConfirmationStep = () => (
    <Box>
      <Typography variant="h6">Confirm Sample Details</Typography>
      <Typography>Patient: {selectedPatient?.fullName}</Typography>
      {/* ... display selected tests/profile ... */}
      <Typography>Total Cost: ${totalCost.toFixed(2)}</Typography>
      <TextField
        label="Sample Number / ID"
        fullWidth
        value={sampleNumber}
        onChange={e => setSampleNumber(e.target.value)}
        sx={{ mt: 2 }}
      />
      <TextField
        label="Notes"
        fullWidth
        multiline
        rows={3}
        value={notes}
        onChange={e => setNotes(e.target.value)}
        sx={{ mt: 2 }}
      />
    </Box>
  );


  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Paper sx={{p:3}}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          New Sample Entry
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
        </Stepper>

        {activeStep === 0 && <PatientSelectionStep />}
        {activeStep === 1 && <TestSelectionStep />}
        {activeStep === 2 && <ConfirmationStep />}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={activeStep === steps.length - 1 ? handleSave : handleNext}
            disabled={activeStep === 0 && !selectedPatient}
          >
            {activeStep === steps.length - 1 ? 'Save Sample' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SampleEntryForm;
