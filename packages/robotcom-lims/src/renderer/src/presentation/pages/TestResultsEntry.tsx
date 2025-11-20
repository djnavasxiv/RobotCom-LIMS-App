import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTestResultsStore } from '../../../application/state/testResultsStore';
import { TestResultsService } from '../../../application/services/TestResultsService';
import { TestResultsReport } from '../components/TestResults/TestResultsReport';
import { allTestCategories } from '../data/testCategories';
import type { ReportRecord } from '../../../application/services/ReportService';
import { Box, Tabs, Tab, Paper, Button, Card, CardContent, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import { 
  OrdenExamen, 
  QuimicaSanguinea, 
  Hematologia, 
  GeneralOrina, 
  Heces, 
  Bacteriologia, 
  Espermiograma,
  Inmunologia,
  Hormonas,
  Embarazo,
  TipoSangre,
  Coagulacion,
  ELISA,
  MultiTimer
} from '../components/TestModules';

export const TestResultsEntry: React.FC = () => {
  const navigate = useNavigate();
  const store = useTestResultsStore();
  const { selectedModule } = useParams<{ selectedModule?: string }>();

  const [selectedSampleId, setSelectedSampleId] = React.useState<string | null>(null);
  const [showReport, setShowReport] = React.useState(false);
  const [sampleResults, setSampleResults] = React.useState<ReportRecord[]>([]);
  const [loadingResults, setLoadingResults] = React.useState(false);
  const [activeModuleTab, setActiveModuleTab] = React.useState<string>(selectedModule || 'orden');

  useEffect(() => {
    const loadPendingSamples = async () => {
      try {
        const samples = await TestResultsService.getPendingSamples();
        store.setPendingSamples(samples);
      } catch (error) {
        store.setError('Failed to load pending samples');
        console.error(error);
      }
    };

    loadPendingSamples();
  }, [store]);

  const handleSelectTestType = (testCode: string) => {
    store.setSelectedTestType(testCode);
    if (selectedSampleId) {
      navigate(`/test-results/${testCode}/${selectedSampleId}`);
    } else {
      navigate(`/test-results/${testCode}`);
    }
  };

  const handleSelectSample = (sampleId: string) => {
    setSelectedSampleId(sampleId);
    store.setCurrentSample(store.pendingSamples.find(s => s.id === sampleId) || null);
    loadSampleResults(sampleId);
  };

  const loadSampleResults = async (sampleId: string) => {
    setLoadingResults(true);
    try {
      const results = await TestResultsService.getResultsBySampleId(sampleId);
      const reportRecords: ReportRecord[] = results.map((result: any) => ({
        id: result.id,
        sampleId: result.sampleId,
        sampleNumber: result.sample?.sampleNumber || 'Unknown',
        patientId: result.sample?.patientId || '',
        patientName: result.sample?.patient ? `${result.sample.patient.firstName} ${result.sample.patient.lastName}` : 'Unknown',
        patientDOB: result.sample?.patient?.dateOfBirth || '',
        testType: result.test?.name || 'Unknown',
        status: result.resultData?.status || 'pending',
        value: result.resultData,
        createdAt: result.createdAt || new Date().toISOString(),
      }));
      setSampleResults(reportRecords);
      setShowReport(false);
    } catch (error) {
      console.error('Failed to load sample results:', error);
      setSampleResults([]);
    } finally {
      setLoadingResults(false);
    }
  };

  const selectedSample = selectedSampleId 
    ? store.pendingSamples.find(s => s.id === selectedSampleId) 
    : null;

  // Module tabs configuration
  const modulesTabs = [
    { id: 'orden', label: '📋 Orden', component: OrdenExamen },
    { id: 'quimica', label: '🧪 Química Sanguínea', component: QuimicaSanguinea },
    { id: 'hematologia', label: '🩸 Hematología', component: Hematologia },
    { id: 'orina', label: '💧 Orina General', component: GeneralOrina },
    { id: 'heces', label: '🔬 Heces', component: Heces },
    { id: 'bacteriologia', label: '🧬 Bacteriología', component: Bacteriologia },
    { id: 'espermiograma', label: '🧬 Espermiograma', component: Espermiograma },
    { id: 'inmunologia', label: '⚡ Inmunología', component: Inmunologia },
    { id: 'hormonas', label: '📊 Hormonas', component: Hormonas },
    { id: 'embarazo', label: '🤰 Embarazo', component: Embarazo },
    { id: 'tipo-sangre', label: '🩸 Tipo de Sangre', component: TipoSangre },
    { id: 'coagulacion', label: '🩸 Coagulación', component: Coagulacion },
    { id: 'elisa', label: '🧪 ELISA', component: ELISA },
    { id: 'timers', label: '⏱️ Temporizadores', component: MultiTimer },
  ];

  const handleModuleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveModuleTab(newValue);
  };

  const getCurrentModuleComponent = () => {
    const module = modulesTabs.find(m => m.id === activeModuleTab);
    if (!module) return null;
    
    const Component = module.component;
    return <Component />;
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', p: 2 }}>
      <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
            Módulos de Exámenes
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', fontSize: '1.1rem' }}>
            Selecciona un módulo de examen para ingresar datos
          </Typography>
          <Box sx={{ mt: 2, height: '4px', width: '100px', background: 'linear-gradient(to right, #2196F3, #64B5F6)', borderRadius: '2px' }}></Box>
        </Box>

        {/* Sample Selection Card */}
        {store.pendingSamples.length > 0 && (
          <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(to right, #E3F2FD, #F3E5F5)', border: '2px solid #2196F3' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              📋 {selectedSample ? 'Muestra Seleccionada' : 'Selecciona una Muestra'}
            </Typography>
            {selectedSample ? (
              <Card sx={{ mb: 2, borderLeft: '4px solid #2196F3' }}>
                <CardContent>
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold' }}>
                        NÚMERO DE MUESTRA
                      </Typography>
                      <Typography variant="h5" sx={{ color: '#2196F3', fontWeight: 'bold', mt: 0.5 }}>
                        {selectedSample.sampleNumber}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold' }}>
                        PACIENTE
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                        {selectedSample.patient.firstName} {selectedSample.patient.lastName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold' }}>
                        EXÁMENES PENDIENTES
                      </Typography>
                      <Typography variant="h5" sx={{ color: '#F57C00', fontWeight: 'bold', mt: 0.5 }}>
                        {selectedSample.tests.length}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Button
                    onClick={() => {
                      setSelectedSampleId(null);
                      store.setCurrentSample(null);
                      setSampleResults([]);
                    }}
                    variant="outlined"
                    sx={{ borderColor: '#2196F3', color: '#2196F3', fontWeight: 'bold' }}
                  >
                    Cambiar Muestra
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Box>
                <Typography variant="body2" sx={{ color: '#1565C0', fontWeight: 'bold', mb: 2 }}>
                  📦 Tienes <span style={{ background: '#BBDEFB', color: '#0D47A1', padding: '4px 8px', borderRadius: '20px', fontWeight: 'bold' }}>{store.pendingSamples.length}</span> muestra(s) pendiente(s)
                </Typography>
                <Box sx={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {store.pendingSamples.map((sample) => (
                    <Button
                      key={sample.id}
                      onClick={() => handleSelectSample(sample.id)}
                      fullWidth
                      sx={{
                        justifyContent: 'flex-start',
                        p: 2,
                        backgroundColor: '#fff',
                        border: '2px solid #E0E0E0',
                        borderRadius: '8px',
                        color: '#333',
                        textTransform: 'none',
                        transition: 'all 0.2s',
                        '&:hover': { borderColor: '#2196F3', backgroundColor: '#E3F2FD' },
                      }}
                    >
                      <Box sx={{ flex: 1, textAlign: 'left' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333' }}>
                          {sample.sampleNumber}
                        </Typography>
                        <Typography sx={{ color: '#666', fontSize: '0.9rem', mt: 0.5 }}>
                          👤 {sample.patient.firstName} {sample.patient.lastName}
                        </Typography>
                      </Box>
                      <Typography sx={{ color: '#2196F3', fontWeight: 'bold', fontSize: '0.9rem', background: '#E3F2FD', px: 2, py: 0.5, borderRadius: '20px' }}>
                        {sample.tests.length} exámenes
                      </Typography>
                    </Button>
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        )}

        {/* Error Alert */}
        {store.error && (
          <Alert severity="error" sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>⚠️ {store.error}</span>
            <Button size="small" onClick={() => store.setError(null)}>Cerrar</Button>
          </Alert>
        )}

        {/* Test Modules Tabs */}
        {selectedSample ? (
          <Paper sx={{ mb: 4, width: '100%', overflow: 'visible' }}>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 0, 
              borderBottom: '2px solid #E0E0E0',
              width: '100%',
              boxSizing: 'border-box',
              alignContent: 'flex-start',
              overflow: 'visible',
            }}>
              {modulesTabs.map((module) => (
                <Box
                  key={module.id}
                  onClick={() => setActiveModuleTab(module.id)}
                  sx={{
                    flex: '0 1 auto',
                    minWidth: '140px',
                    px: 2,
                    py: 1.5,
                    cursor: 'pointer',
                    borderBottom: activeModuleTab === module.id ? '3px solid #2196F3' : '3px solid transparent',
                    textAlign: 'center',
                    fontWeight: activeModuleTab === module.id ? 'bold' : '500',
                    color: activeModuleTab === module.id ? '#2196F3' : '#666',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: '#F5F5F5',
                      color: '#2196F3',
                    },
                  }}
                >
                  {module.label}
                </Box>
              ))}
            </Box>

            {/* Module Content */}
            <Box sx={{ p: 3, backgroundColor: '#fff', width: '100%', boxSizing: 'border-box' }}>
              {getCurrentModuleComponent()}
            </Box>
          </Paper>
        ) : (
          <Paper sx={{ p: 6, textAlign: 'center', backgroundColor: '#FAFAFA', border: '2px dashed #E0E0E0' }}>
            <Typography variant="h6" sx={{ color: '#999', fontWeight: '500' }}>
              📭 Selecciona una muestra para comenzar a ingresar resultados
            </Typography>
          </Paper>
        )}

        {/* Loading State */}
        {store.isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress />
              <Typography sx={{ color: '#666', fontWeight: 'bold', mt: 2 }}>Cargando...</Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
