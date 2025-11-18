import React, { useState, useCallback } from 'react';
import {
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import PatientHeader, { PatientData } from '../common/PatientHeader';
import { NavigationFooter, PrintButtons } from '../common/ModalFooters';
import {
  SearchOutlined,
  AddOutlined,
  DeleteOutlined,
  PrintOutlined,
} from '@mui/icons-material';

interface TestItem {
  id: string;
  name: string;
  price: number;
}

interface OrdenExamenes extends PatientData {
  fecha: string;
  telefono: string;
  email: string;
  tests: TestItem[];
  total: number;
  descuento: number;
  recibo: string;
  factura: string;
  ccf: string;
}

const OrdenExamenModal: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [patientData, setPatientData] = useState<PatientData>({
    patientId: '',
    patientName: '',
    age: '',
    gender: '',
    doctor: '',
  });

  const [orden, setOrden] = useState<Omit<OrdenExamenes, keyof PatientData>>({
    fecha: new Date().toISOString().split('T')[0],
    telefono: '',
    email: '',
    tests: [],
    total: 0,
    descuento: 0,
    recibo: '',
    factura: '',
    ccf: '',
  });

  const [profiles, setProfiles] = useState<Array<{ name: string; tests: TestItem[] }>>([]);
  const [newTestName, setNewTestName] = useState('');
  const [newTestPrice, setNewTestPrice] = useState('');

  const handlePatientDataChange = useCallback((data: Partial<PatientData>) => {
    setPatientData((prev) => ({ ...prev, ...data }));
  }, []);

  const handleAddTest = useCallback(() => {
    if (newTestName && newTestPrice) {
      const newTest: TestItem = {
        id: Date.now().toString(),
        name: newTestName,
        price: parseFloat(newTestPrice),
      };
      setOrden((prev) => ({
        ...prev,
        tests: [...prev.tests, newTest],
        total: prev.total + newTest.price,
      }));
      setNewTestName('');
      setNewTestPrice('');
    }
  }, [newTestName, newTestPrice]);

  const handleRemoveTest = useCallback((testId: string) => {
    setOrden((prev) => {
      const test = prev.tests.find((t) => t.id === testId);
      if (!test) return prev;
      return {
        ...prev,
        tests: prev.tests.filter((t) => t.id !== testId),
        total: prev.total - test.price,
      };
    });
  }, []);

  const calculatedTotal = orden.total - (orden.total * orden.descuento) / 100;

  return (
    <Box sx={{ padding: '16px', backgroundColor: '#fff' }}>
      <h1>Orden de Laboratorio</h1>

      <PatientHeader
        patientData={patientData}
        onPatientDataChange={handlePatientDataChange}
        onSearch={() => console.log('Search')}
        onFilter={() => console.log('Filter')}
        onNoFilter={() => console.log('No Filter')}
      />

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={2}>
          <TextField label="FECHA" fullWidth size="small" value={orden.fecha} />
        </Grid>
        <Grid item xs={3}>
          <TextField label="TEL." fullWidth size="small" value={orden.telefono}
            onChange={(e) => setOrden((prev) => ({ ...prev, telefono: e.target.value }))} />
        </Grid>
        <Grid item xs={3}>
          <TextField label="EMAIL" fullWidth size="small" value={orden.email}
            onChange={(e) => setOrden((prev) => ({ ...prev, email: e.target.value }))} />
        </Grid>
      </Grid>

      <Box sx={{ borderBottom: '1px solid #ddd', mb: 2 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="EXAMENES" />
          <Tab label="PERFILES" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Box>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              label="Nombre del Examen"
              size="small"
              value={newTestName}
              onChange={(e) => setNewTestName(e.target.value)}
            />
            <TextField
              label="Precio"
              type="number"
              size="small"
              value={newTestPrice}
              onChange={(e) => setNewTestPrice(e.target.value)}
            />
            <Button variant="contained" startIcon={<AddOutlined />} onClick={handleAddTest}>
              Agregar
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#1e3a5f', color: 'white' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>No.</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>EXAMEN</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>PRECIO $</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ACCIONES</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orden.tests.map((test, idx) => (
                  <TableRow key={test.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{test.name}</TableCell>
                    <TableCell>${test.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<DeleteOutlined />}
                        onClick={() => handleRemoveTest(test.id)}
                        color="error"
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Button variant="contained" sx={{ mb: 2 }}>
            CREAR PERFIL
          </Button>
          <Button variant="outlined" sx={{ mb: 2, ml: 1 }}>
            BORRAR PERFIL
          </Button>
          <p>Perfiles disponibles: {profiles.length}</p>
        </Box>
      )}

      <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
        <Grid item xs={2}>
          <TextField
            label="TOTAL"
            fullWidth
            size="small"
            value={orden.total.toFixed(2)}
            type="number"
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="DESCUENTO %"
            fullWidth
            size="small"
            value={orden.descuento}
            type="number"
            onChange={(e) => setOrden((prev) => ({ ...prev, descuento: parseFloat(e.target.value) || 0 }))}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="A PAGAR"
            fullWidth
            size="small"
            value={calculatedTotal.toFixed(2)}
            type="number"
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="RECIBO"
            fullWidth
            size="small"
            value={orden.recibo}
            onChange={(e) => setOrden((prev) => ({ ...prev, recibo: e.target.value }))}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="FACTURA"
            fullWidth
            size="small"
            value={orden.factura}
            onChange={(e) => setOrden((prev) => ({ ...prev, factura: e.target.value }))}
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="CCF"
            fullWidth
            size="small"
            value={orden.ccf}
            onChange={(e) => setOrden((prev) => ({ ...prev, ccf: e.target.value }))}
          />
        </Grid>
      </Grid>

      <PrintButtons
        onPrint={() => window.print()}
        onAbout={() => console.log('About')}
        onPdf={() => console.log('Export PDF')}
      />

      <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'center' }}>
        <Button variant="contained" startIcon={<PrintOutlined />}>
          IMPRIMIR ORDEN
        </Button>
        <Button variant="outlined">REPORTE DIARIO</Button>
        <Button variant="outlined">IMPRIMIR PERFILES</Button>
        <Button variant="outlined">CONSULTA $?</Button>
      </Box>

      <NavigationFooter
        onSave={() => console.log('Save order')}
        onExit={() => window.close()}
      />
    </Box>
  );
};

export default OrdenExamenModal;
