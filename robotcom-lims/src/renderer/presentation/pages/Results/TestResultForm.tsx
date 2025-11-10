import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  CircularProgress,
} from '@mui/material';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { ResultService } from '../../../application/services/ResultService';
import { Sample } from '../../../domain/entities/Sample';

interface TestResultFormProps {
  sampleId: string;
}

interface FormData {
  results: Array<{ testId: string; testName: string; value: string; notes: string }>;
}

const TestResultForm: React.FC<TestResultFormProps> = ({ sampleId }) => {
  const [sample, setSample] = useState<Sample | null>(null);
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, reset } = useForm<FormData>();
  const { fields } = useFieldArray({ control, name: 'results' });

  const resultService = new ResultService();

  useEffect(() => {
    if (sampleId) {
      setLoading(true);
      resultService.findSampleById(sampleId)
        .then(sampleData => {
          setSample(sampleData);
          const initialResults = sampleData?.tests.map(test => ({
            testId: test.id,
            testName: test.name,
            value: '',
            notes: '',
          })) || [];
          reset({ results: initialResults });
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [sampleId, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await resultService.saveResults(sampleId, data.results);
      // Show success message
    } catch (error) {
      console.error('Failed to save results:', error);
      // Show error message
    }
  };

  if (loading) return <CircularProgress />;
  if (!sample) return <Typography>Muestra no encontrada.</Typography>;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Registrar Resultados para Muestra #{sample.sampleNumber}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {fields.map((field, index) => (
            <React.Fragment key={field.id}>
              <Grid item xs={12} sm={4}>
                <Typography sx={{ mt: 2 }}>{field.testName}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name={`results.${index}.value`}
                  control={control}
                  defaultValue=""
                  rules={{ required: 'El valor del resultado es obligatorio' }}
                  render={({ field: controllerField, fieldState }) => (
                    <TextField
                      {...controllerField}
                      label="Valor del Resultado"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                 <Controller
                  name={`results.${index}.notes`}
                  control={control}
                  defaultValue=""
                  render={({ field: controllerField }) => (
                    <TextField {...controllerField} label="Notas" fullWidth />
                  )}
                />
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">
            Guardar Resultados
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default TestResultForm;
