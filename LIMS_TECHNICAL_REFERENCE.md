# LIMS Modules - Technical Reference

## Component Dependencies

All modules use the following libraries (already in your project):

```json
{
  "@mui/material": "^5.14+",
  "@mui/icons-material": "^5.14+",
  "react": "^18.2.0",
  "react-router-dom": "^6+",
  "typescript": "^5+"
}
```

## Module Interfaces & Types

### PatientData (PatientHeader.tsx)
```typescript
interface PatientData {
  patientId: string;
  patientName: string;
  age: string;
  gender: string;
  doctor: string;
  showNo?: boolean;
}
```

### NavigationFooterProps
```typescript
interface NavigationFooterProps {
  onFirst?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onLast?: () => void;
  onSave?: () => void;
  onHelp?: () => void;
  onExit?: () => void;
  disableNavigation?: boolean;
}
```

### BillingFooterProps
```typescript
interface BillingFooterProps {
  total: number | string;
  discount: number | string;
  toPay: number | string;
  observations: string;
  onObservationsChange: (value: string) => void;
  onAddTest?: () => void;
  onTotalChange?: (value: string) => void;
  onDiscountChange?: (value: string) => void;
  onToPayChange?: (value: string) => void;
}
```

## Module Data Structures

### Chemistry Module (QuimicaSanguinea)
```typescript
interface ChemistryAnalyte {
  id: string;
  name: string;
  resultado: string;
  unidad: string;
  normalValue: string;
}
```

### Hematology Module (Hematologia)
```typescript
interface HematologyData {
  muestra: string;
  hematocrito: string;
  hemoglobina: string;
  globulosRojos: string;
  vcm: string;
  hbcm: string;
  chbcm: string;
  plaquetas: string;
  reticulocitos: string;
  eritrosedimentacion: string;
  globulosBlancos: string;
  neutrofilosBanda: string;
  neutrofilosSegmentados: string;
  eosinofilos: string;
  basofilos: string;
  linfocitos: string;
  monocitos: string;
  suma: string; // Auto-calculated
  celulasLE: string;
  gotaGruesa: string;
  observaciones: string;
}
```

### Urinalysis Module (GeneralOrina)
```typescript
interface UrinalysisData {
  // Physical-Chemical (13)
  color: string;
  aspecto: string;
  densidad: string;
  pH: string;
  nitritos: string;
  proteinas: string;
  glucosa: string;
  cetonicos: string;
  urobilinogeno: string;
  bilirrubina: string;
  sangreOculta: string;
  hemoglobina: string;
  leucocitaria: string;

  // Microscopic - Casts (9)
  cilindros: string;
  cilindrosLeucocitarios: string;
  cilindrosHematicos: string;
  cilindrosHialinos: string;
  cilindrosCereos: string;
  cilindrosGranuloso: string;
  cilindrosGranulososG: string;
  cilindroOides: string;
  cilindrosMixtos: string;

  // Microscopic - Other (7)
  hematies: string;
  leucocitos: string;
  celEpiteliales: string;
  cristales: string;
  bacterias: string;
  parasitologico: string;
  otros: string;
  observaciones: string;
}
```

### Stool Analysis Module (Heces)
```typescript
interface ParasiteItem {
  name: string;
  trofozoitos?: boolean;  // Protozoa
  quistes?: boolean;      // Protozoa
  huevos?: boolean;       // Helmintos
  larvas?: boolean;       // Metazoa
}

// Protozoa: 14 organisms
// Helmintos: 13 organisms
```

### Bacteriology Module (Bacteriologia)
```typescript
// 18 antibiotics with S/I/R sensitivity
const antibiotics = [
  'Ampicilina',
  'Amoxicilina',
  'Amoxicilina-Clavulánico',
  'Piperacilina',
  'Piperacilina-Tazobactam',
  'Cefalotina',
  'Cefoxitina',
  'Cefotaxima',
  'Ceftazidima',
  'Cefepima',
  'Imipenem',
  'Meropenem',
  'Ciprofloxacino',
  'Gentamicina',
  'Tobramicina',
  'Trimetoprima-Sulfametoxazol',
  'Nitrofurantoína',
  'Vancomicina',
];
```

### Semen Analysis Module (Espermiograma)
```typescript
interface EspermioData {
  // Collection (3)
  hColeccion: string;
  hExaminado: string;
  diasAbstinencia: string;

  // Physical (6)
  apariencia: string;
  viscosidad: string;
  gColgante: string;
  color: string;
  licuefaccion: string;
  volumen: string;

  // Microscopic Left (7)
  progresion: string;
  actividad: string;
  grumos: string;
  espmGrumos: string;
  recuento: string;
  vivos1h: string;
  vivos2h: string;

  // Microscopic Right (15)
  desperdCel: string;
  eritrocitos: string;
  bacterias: string;
  leucocitos: string;
  vivos4h: string;
  vivos6h: string;
  espermasNormales: string;
  cabezaAnormal: string;
  celEpiteliales: string;
  cristales: string;
  cuerpoAnormal: string;
  colaAnormal: string;
  celularesInmaduras: string;
  vacuolasCabeza: string;
  citoplasmaDroplets: string;

  observaciones: string;
}
```

## Import Examples

### Import All Modules
```typescript
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
  MultiTimer,
} from './presentation/components/TestModules';
```

### Import Navigation Components
```typescript
import TopMenu from './presentation/components/layout/TopMenu';
import IconToolbar from './presentation/components/layout/IconToolbar';
import LabLayout from './presentation/components/layout/LabLayout';
```

### Import Common Components
```typescript
import PatientHeader from './presentation/components/common/PatientHeader';
import {
  NavigationFooter,
  BillingFooter,
  PrintButtons,
} from './presentation/components/common/ModalFooters';
```

## Component Props Examples

### PatientHeader Usage
```tsx
<PatientHeader
  patientData={patientData}
  onPatientDataChange={(data) => setPatientData((prev) => ({ ...prev, ...data }))}
  onSearch={() => console.log('Search')}
  onFilter={() => console.log('Filter')}
  onNoFilter={() => console.log('Clear filters')}
/>
```

### NavigationFooter Usage
```tsx
<NavigationFooter
  onFirst={() => goToFirst()}
  onPrevious={() => goToPrevious()}
  onNext={() => goToNext()}
  onLast={() => goToLast()}
  onSave={() => saveData()}
  onHelp={() => showHelp()}
  onExit={() => closeModule()}
  disableNavigation={records.length === 0}
/>
```

### BillingFooter Usage
```tsx
<BillingFooter
  total={estado.total}
  discount={estado.descuento}
  toPay={estado.aPagar}
  observations={estado.observaciones}
  onObservationsChange={(val) => setEstado(prev => ({ ...prev, observaciones: val }))}
  onAddTest={() => addTestToOrder()}
  onTotalChange={(val) => setEstado(prev => ({ ...prev, total: parseFloat(val) }))}
  onDiscountChange={(val) => setEstado(prev => ({ ...prev, descuento: parseFloat(val) }))}
  onToPayChange={(val) => setEstado(prev => ({ ...prev, aPagar: parseFloat(val) }))}
/>
```

### PrintButtons Usage
```tsx
<PrintButtons
  onPrint={() => window.print()}
  onAbout={() => showAbout()}
  onPdf={() => exportToPDF()}
  variant="default"
/>
```

## State Management Pattern

All modules follow this pattern:

```typescript
const [patientData, setPatientData] = useState<PatientData>({
  patientId: '',
  patientName: '',
  age: '',
  gender: '',
  doctor: '',
});

const [moduleData, setModuleData] = useState<ModuleInterface>({
  // ... initial values
});

const handleFieldChange = (field: keyof ModuleInterface, value: string) => {
  setModuleData((prev) => ({ ...prev, [field]: value }));
};
```

## Event Handler Patterns

### Save Handler
```typescript
onSave={() => {
  // Validate data
  if (!validate()) return;
  
  // Call service
  TestService.save(moduleData)
    .then(() => showSuccess('Saved'))
    .catch(err => showError(err));
}}
```

### Print Handler
```typescript
onPrint={() => {
  // Optional: Set print styles
  document.body.style.zoom = '0.9';
  window.print();
  document.body.style.zoom = '1';
}}
```

### Navigation Handler
```typescript
onNext={() => {
  // Load next record
  const nextRecord = records[currentIndex + 1];
  setModuleData(nextRecord);
  setCurrentIndex(currentIndex + 1);
}}
```

## CSS Classes & Styling

### Standard Colors
```css
/* Primary Blue */
#1e3a5f

/* Light Gray Background */
#f5f5f5

/* Light Blue Hover */
#e3f2fd

/* Red for Critical */
#d32f2f

/* Green for Active */
#4caf50

/* Border Color */
#ddd
```

### Common sx Props
```typescript
// Header Styling
sx={{ backgroundColor: '#1e3a5f', color: 'white', fontWeight: 'bold' }}

// Table Header
sx={{ backgroundColor: '#1e3a5f' }}
TableCell variant
sx={{ color: 'white', fontWeight: 'bold' }}

// Spacing
sx={{ mb: 2 }} // margin-bottom: 16px
sx={{ mt: 1 }} // margin-top: 8px
sx={{ p: 2 }} // padding: 16px
```

## Validation Examples

### Differential Count Sum
```typescript
useEffect(() => {
  const sum = (parseFloat(data.neutrofilosBanda) || 0) +
              (parseFloat(data.neutrofilosSegmentados) || 0) +
              // ... more fields
              (parseFloat(data.monocitos) || 0);
  setData(prev => ({ ...prev, suma: sum.toString() }));
}, [/* dependencies */]);

// Validation: sum should equal 100%
const isValid = Math.abs(parseFloat(data.suma) - 100) < 0.1;
```

### Billing Calculation
```typescript
const calculatedTotal = orden.total - (orden.total * orden.descuento) / 100;
```

## Performance Considerations

1. **Sticky Headers**: Use `stickyHeader` on TableHead for large tables
   ```tsx
   <TableContainer sx={{ maxHeight: '500px', overflowY: 'auto' }}>
     <Table stickyHeader>
   ```

2. **useCallback for Event Handlers**: Prevent unnecessary re-renders
   ```typescript
   const handleAnalyteChange = useCallback((id: string, field: string, value: string) => {
     // ...
   }, []);
   ```

3. **Memoization**: Consider useMemo for derived state
   ```typescript
   const total = useMemo(() => {
     return items.reduce((sum, item) => sum + item.price, 0);
   }, [items]);
   ```

## Build & Testing

### Build Command
```bash
npm run build
```

### Expected Output
```
✓ 798 modules transformed
✓ built in 5-7 seconds
0 errors
```

### Dev Server
```bash
npm run dev
```

### Test Routes
Navigate to any of:
- `http://localhost:5173/test-order`
- `http://localhost:5173/tests/chemistry`
- `http://localhost:5173/tests/hematology`
- etc.

## Troubleshooting

### Module Not Found Error
**Solution**: Check imports use correct path:
```typescript
// ✅ Correct
import { QuimicaSanguinea } from './presentation/components/TestModules';

// ❌ Wrong
import QuimicaSanguinea from './TestModules/QuimicaSanguinea';
```

### Styling Not Applied
**Solution**: Ensure Material-UI Provider is in App.tsx:
```typescript
import { ThemeProvider, createTheme } from '@mui/material/styles';
```

### Type Errors with useState
**Solution**: Always provide type generic:
```typescript
// ✅ Correct
const [data, setData] = useState<DataInterface>({});

// ❌ Less safe
const [data, setData] = useState({});
```

## Performance Metrics

Current build status:
- **Main**: 6.81 kB
- **Preload**: 1.38 kB
- **Renderer**: 1,440.18 kB
- **CSS**: 18.07 kB
- **Build Time**: 5.95-6.65 seconds
- **Module Count**: 798
- **Errors**: 0

---

**Last Updated**: November 17, 2025
**Status**: Production Ready
**Next Phase**: Integration Testing

