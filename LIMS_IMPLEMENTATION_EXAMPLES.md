# LIMS Modules - Implementation Examples

## Example 1: Connecting Modules to Services

### Chemistry Module with Data Persistence

```typescript
// In QuimicaSanguinea.tsx - Update the save handler

import ChemistryService from '../../../application/services/ChemistryService';

const handleSave = async () => {
  try {
    // Prepare data
    const payload = {
      patientId: patientData.patientId,
      muestra,
      tiempo,
      analytes: analytes.map(a => ({
        name: a.name,
        result: a.resultado,
        unit: a.unidad,
      })),
      total: parseFloat(total),
      discount: parseFloat(discount),
      observations,
      timestamp: new Date(),
    };

    // Save to database
    const result = await ChemistryService.create(payload);
    
    // Show success message
    showNotification('Resultado guardado exitosamente', 'success');
    
    // Clear form or navigate
    navigate('/test-results');
  } catch (error) {
    showNotification(`Error: ${error.message}`, 'error');
  }
};

// Update NavigationFooter
<NavigationFooter
  onSave={handleSave}
  onExit={() => navigate(-1)}
/>
```

## Example 2: Adding Pagination to Test Results

### Order Entry with Record Navigation

```typescript
// In OrdenExamen.tsx - Add pagination

const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
const [allOrders, setAllOrders] = useState<Order[]>([]);
const [currentIndex, setCurrentIndex] = useState(0);

useEffect(() => {
  // Load all orders on mount
  OrderService.getAll().then(orders => {
    setAllOrders(orders);
    if (orders.length > 0) {
      loadOrder(orders[0]);
    }
  });
}, []);

const loadOrder = (order: Order) => {
  setOrden(order);
  setPatientData({
    patientId: order.patientId,
    patientName: order.patientName,
    age: order.age,
    gender: order.gender,
    doctor: order.doctor,
  });
};

const handleNavigate = (direction: 'first' | 'prev' | 'next' | 'last') => {
  let newIndex = currentIndex;
  
  if (direction === 'first') newIndex = 0;
  else if (direction === 'last') newIndex = allOrders.length - 1;
  else if (direction === 'prev') newIndex = Math.max(0, currentIndex - 1);
  else if (direction === 'next') newIndex = Math.min(allOrders.length - 1, currentIndex + 1);
  
  setCurrentIndex(newIndex);
  loadOrder(allOrders[newIndex]);
};

// Update NavigationFooter
<NavigationFooter
  onFirst={() => handleNavigate('first')}
  onPrevious={() => handleNavigate('prev')}
  onNext={() => handleNavigate('next')}
  onLast={() => handleNavigate('last')}
  onSave={() => saveCurrentOrder()}
  disableNavigation={allOrders.length === 0}
/>
```

## Example 3: Form Validation

### Complete Form Validation Example

```typescript
// Validation utility for Chemistry module

interface ValidationError {
  field: string;
  message: string;
}

const validateChemistryData = (data: {
  patientId: string;
  analytes: ChemistryAnalyte[];
  total: number;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Validate patient
  if (!data.patientId) {
    errors.push({ field: 'patientId', message: 'Patient ID is required' });
  }

  // Validate analytes - at least one result required
  const hasResults = data.analytes.some(a => a.resultado.trim());
  if (!hasResults) {
    errors.push({ 
      field: 'analytes', 
      message: 'At least one analyte result is required' 
    });
  }

  // Validate numeric results
  data.analytes.forEach((analyte, idx) => {
    if (analyte.resultado && isNaN(parseFloat(analyte.resultado))) {
      errors.push({
        field: `analyte_${idx}`,
        message: `${analyte.name}: Invalid numeric value`,
      });
    }
  });

  // Validate total
  if (data.total < 0) {
    errors.push({ field: 'total', message: 'Total cannot be negative' });
  }

  return errors;
};

// Use in component
const handleSave = async () => {
  const errors = validateChemistryData({
    patientId: patientData.patientId,
    analytes,
    total: parseFloat(total),
  });

  if (errors.length > 0) {
    errors.forEach(err => {
      console.error(`${err.field}: ${err.message}`);
    });
    showNotification('Please fix validation errors', 'error');
    return;
  }

  // Proceed with save
  await saveData();
};
```

## Example 4: PDF Export with React-PDF

### Implement PDF Export

```typescript
import { PDFDocument, PDFPage } from 'pdf-lib';
import html2canvas from 'html2canvas';

// In any test module

const handleExportPDF = async () => {
  try {
    // Get the content div
    const element = document.getElementById('test-content');
    
    // Convert to canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    // Create PDF
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
    });

    // Add image
    const image = canvas.toDataURL('image/png');
    doc.image(image, 50, 50, { width: 495 });

    // Download
    doc.save(`resultado_${patientData.patientId}.pdf`);
  } catch (error) {
    console.error('PDF export failed:', error);
  }
};

// Add to PrintButtons
<PrintButtons
  onPrint={() => window.print()}
  onPdf={handleExportPDF}
/>

// In CSS for printing
<style>{`
  @media print {
    .no-print { display: none; }
    body { margin: 0; padding: 0; }
    #test-content { padding: 10mm; }
  }
`}</style>
```

## Example 5: Real-time Calculation

### Auto-calculate Totals with Discount

```typescript
// In BillingFooter or OrderEntry

import { useEffect } from 'react';

// Auto-calculate total when discount changes
useEffect(() => {
  const baseTotal = parseFloat(total) || 0;
  const discountPercent = parseFloat(discount) || 0;
  
  if (discountPercent >= 0 && discountPercent <= 100) {
    const discountAmount = baseTotal * (discountPercent / 100);
    const finalTotal = baseTotal - discountAmount;
    setToPay(finalTotal.toFixed(2));
  }
}, [total, discount]);

// Validate discount percentage
const handleDiscountChange = (value: string) => {
  const discountValue = parseFloat(value) || 0;
  if (discountValue >= 0 && discountValue <= 100) {
    setDiscount(value);
  } else {
    showNotification('Discount must be between 0-100%', 'warning');
  }
};
```

## Example 6: Search and Filter Patient

### Patient Search Implementation

```typescript
// Add to PatientHeader or as a modal

import SearchIcon from '@mui/icons-material/Search';

const PatientSearchDialog = ({ open, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const patients = await PatientService.search(searchTerm);
      setResults(patients);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Buscar Paciente</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Nombre o Cédula"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          margin="dense"
        />
        
        {loading && <CircularProgress />}
        
        <List>
          {results.map(patient => (
            <ListItem
              key={patient.id}
              button
              onClick={() => {
                onSelect(patient);
                onClose();
              }}
            >
              <ListItemText
                primary={patient.name}
                secondary={`Edad: ${patient.age}, Cédula: ${patient.cedula}`}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSearch} variant="contained">
          Buscar
        </Button>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

// Use in PatientHeader
const [searchDialogOpen, setSearchDialogOpen] = useState(false);

<PatientHeader
  patientData={patientData}
  onPatientDataChange={handlePatientDataChange}
  onSearch={() => setSearchDialogOpen(true)}
/>

<PatientSearchDialog
  open={searchDialogOpen}
  onClose={() => setSearchDialogOpen(false)}
  onSelect={(patient) => {
    handlePatientDataChange({
      patientId: patient.id,
      patientName: patient.name,
      age: patient.age,
      gender: patient.gender,
    });
  }}
/>
```

## Example 7: Localization (Spanish Support)

### Multi-language Labels

```typescript
// Create i18n configuration

const translations = {
  es: {
    chemistry: {
      title: 'QUÍMICA SANGUÍNEA',
      muestra: 'MUESTRA',
      resultado: 'RESULTADO',
      unidad: 'UNIDAD',
      guardaSave: 'GUARDAR',
      salir: 'SALIR',
    },
  },
  en: {
    chemistry: {
      title: 'BLOOD CHEMISTRY',
      muestra: 'SAMPLE',
      resultado: 'RESULT',
      unidad: 'UNIT',
      guardaSave: 'SAVE',
      salir: 'EXIT',
    },
  },
};

// Use in component
const [language, setLanguage] = useState('es');
const t = (path: string) => {
  const keys = path.split('.');
  let value: any = translations[language];
  keys.forEach(key => value = value[key]);
  return value;
};

// In JSX
<h1>{t('chemistry.title')}</h1>
<TextField label={t('chemistry.muestra')} />
```

## Example 8: Loading States and Skeletons

### Add Loading UI

```typescript
import Skeleton from '@mui/lab/Skeleton';

const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const loadData = async () => {
    try {
      const data = await ChemistryService.getAnalytes();
      setAnalytes(data);
    } finally {
      setIsLoading(false);
    }
  };
  loadData();
}, []);

// In JSX
{isLoading ? (
  <Box>
    <Skeleton variant="text" width="80%" height={40} />
    <Skeleton variant="rectangular" height={400} />
  </Box>
) : (
  <TableContainer component={Paper}>
    {/* Table content */}
  </TableContainer>
)}
```

## Example 9: Error Boundary Integration

### Add Error Handling

```typescript
// Create specific error boundary for modules

import React from 'react';

interface Props {
  children: React.ReactNode;
  moduleName: string;
}

class TestModuleErrorBoundary extends React.Component<Props> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`Error in ${this.props.moduleName}:`, error, errorInfo);
    // Send to error logging service
    ErrorLogger.log({
      module: this.props.moduleName,
      error: error.toString(),
      stack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            Error in {this.props.moduleName}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {this.state.error?.toString()}
          </Typography>
          <Button
            onClick={() => window.location.reload()}
            variant="contained"
            sx={{ mt: 2 }}
          >
            Reload
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Use wrapping modules
<TestModuleErrorBoundary moduleName="Chemistry">
  <QuimicaSanguinea />
</TestModuleErrorBoundary>
```

## Example 10: Analytics Tracking

### Track User Actions

```typescript
// Analytics service for module usage

const trackModuleUsage = async (action: string, data: any) => {
  try {
    await AnalyticsService.log({
      module: 'Chemistry',
      action, // 'opened', 'saved', 'printed', 'exported'
      timestamp: new Date(),
      userId: currentUser.id,
      data: data || {},
    });
  } catch (error) {
    console.error('Analytics error:', error);
  }
};

// Use in module
useEffect(() => {
  trackModuleUsage('opened', {
    patientId: patientData.patientId,
  });
}, []);

const handleSave = async () => {
  await saveData();
  trackModuleUsage('saved', {
    analyteCount: analytes.length,
    total: parseFloat(total),
  });
};

const handlePrint = () => {
  window.print();
  trackModuleUsage('printed', {
    patientId: patientData.patientId,
  });
};
```

---

## Quick Checklist for Implementation

- [ ] Import modules in AppRoutes.tsx
- [ ] Add routes for each module
- [ ] Create corresponding database services
- [ ] Implement data validation
- [ ] Add error boundaries
- [ ] Set up PDF export
- [ ] Add analytics tracking
- [ ] Implement search functionality
- [ ] Add loading states
- [ ] Test all modules end-to-end

**All examples use TypeScript and Material-UI conventions.**

