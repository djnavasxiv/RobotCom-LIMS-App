# Chart Components - Quick Reference Guide

## 📊 Overview

Three professional chart components for lab data visualization:
- **TrendChart** - Line chart for time-series analysis
- **DistributionChart** - Pie chart for test type distribution
- **ResultsComparisonChart** - Bar chart for normal vs abnormal results

All components use Recharts with Spanish localization and responsive design.

---

## Installation

Charts are already installed. To use them:

```bash
# Dev server
cd packages/robotcom-lims
npm run dev

# Build for production
npm run build
```

---

## TrendChart Component

### Purpose
Visualize lab test results over time with multiple data series support.

### Props
```typescript
interface TrendChartProps {
  data: TrendData[];
  title?: string;      // Default: "Tendencia de Resultados"
  height?: number;     // Default: 300 (pixels)
}

interface TrendData {
  date: string;        // Format: "17/11/2025"
  value: number;       // Numeric test result
  testName: string;    // "Glucosa", "Hemoglobina", etc.
}
```

### Example
```tsx
import TrendChart from '@/presentation/components/Charts/TrendChart';

<TrendChart 
  data={[
    { date: '17/11/2025', value: 95, testName: 'Glucosa' },
    { date: '18/11/2025', value: 98, testName: 'Glucosa' },
    { date: '18/11/2025', value: 120, testName: 'Colesterol' }
  ]}
  title="Glucosa - Últimas 2 Semanas"
  height={350}
/>
```

### Features
- ✅ Multiple data series (different test types)
- ✅ Interactive tooltips on hover
- ✅ Color-coded lines
- ✅ Date-based X-axis
- ✅ Animated transitions
- ✅ Responsive scaling

---

## DistributionChart Component

### Purpose
Show the breakdown of test types performed in the laboratory.

### Props
```typescript
interface DistributionChartProps {
  data: DistributionData[];
  title?: string;      // Default: "Distribución de Tipos de Exámenes"
  height?: number;     // Default: 300 (pixels)
}

interface DistributionData {
  name: string;        // "Glucosa", "CBC", etc.
  value: number;       // Count of tests
}
```

### Example
```tsx
import DistributionChart from '@/presentation/components/Charts/DistributionChart';

<DistributionChart 
  data={[
    { name: 'Glucosa', value: 120 },
    { name: 'Hemoglobina', value: 95 },
    { name: 'Colesterol', value: 87 },
    { name: 'Otros', value: 52 }
  ]}
  title="Exámenes Realizados Este Mes"
  height={350}
/>
```

### Features
- ✅ Color-coded pie slices
- ✅ Percentage calculations (automatic)
- ✅ Interactive legend
- ✅ Custom tooltips
- ✅ Professional color palette

---

## ResultsComparisonChart Component

### Purpose
Compare normal vs abnormal test results by test type.

### Props
```typescript
interface ResultsComparisonChartProps {
  data: ComparisonData[];
  title?: string;      // Default: "Comparación: Normal vs Anormal"
  height?: number;     // Default: 300 (pixels)
}

interface ComparisonData {
  name: string;        // "Glucosa", "Hemoglobina", etc.
  normal: number;      // Count of normal results
  abnormal: number;    // Count of abnormal results
}
```

### Example
```tsx
import ResultsComparisonChart from '@/presentation/components/Charts/ResultsComparisonChart';

<ResultsComparisonChart 
  data={[
    { name: 'Glucosa', normal: 115, abnormal: 5 },
    { name: 'Hemoglobina', normal: 90, abnormal: 5 },
    { name: 'Colesterol', normal: 82, abnormal: 5 }
  ]}
  title="Calidad de Resultados"
  height={350}
/>
```

### Features
- ✅ Grouped bars (normal: green, abnormal: red)
- ✅ Side-by-side comparison
- ✅ Interactive tooltips
- ✅ Professional color coding
- ✅ Rounded bar corners

---

## ChartDataService

Service for querying and aggregating chart data from the database.

### Location
`src/application/services/ChartDataService.ts`

### Methods

#### getResultsTrendData(labId, limit?)
```typescript
const data = await chartDataService.getResultsTrendData('lab-001', 30);
// Returns: TrendData[] for last 30 days
```

#### getTestDistributionData(labId)
```typescript
const data = await chartDataService.getTestDistributionData('lab-001');
// Returns: DistributionData[] of test frequencies
```

#### getResultsComparisonData(labId)
```typescript
const data = await chartDataService.getResultsComparisonData('lab-001');
// Returns: ComparisonData[] with normal/abnormal counts
```

#### getSampleStatistics(labId)
```typescript
const stats = await chartDataService.getSampleStatistics('lab-001');
// Returns: { total, pending, processing, completed, withResults }
```

---

## Using Charts in Components

### Basic Setup
```tsx
import React, { useEffect, useState } from 'react';
import TrendChart, { type TrendData } from '@/presentation/components/Charts/TrendChart';

const MyComponent: React.FC = () => {
  const [data, setData] = useState<TrendData[]>([]);

  useEffect(() => {
    // Load data
    const sampleData: TrendData[] = [
      { date: '17/11/2025', value: 100, testName: 'Test1' }
    ];
    setData(sampleData);
  }, []);

  return <TrendChart data={data} title="My Chart" height={350} />;
};
```

### With Real Data
```tsx
import chartDataService from '@/application/services/ChartDataService';

useEffect(() => {
  const loadData = async () => {
    const trendData = await chartDataService.getResultsTrendData('lab-001');
    setData(trendData);
  };
  loadData();
}, []);
```

---

## Styling & Customization

All components use inline styles with consistent theming:

```typescript
// Color Palette
Primary Blue: #3498db
Green: #2ecc71
Red: #e74c3c
Orange: #f39c12
Purple: #9b59b6
Teal: #1abc9c
Dark: #34495e
Light: #ecf0f1
```

To customize, modify the component files:
- Edit color arrays in each component
- Adjust height prop for sizing
- Modify title text in usage

---

## Responsive Behavior

All charts automatically:
- ✅ Scale to parent container width
- ✅ Adjust for mobile screens
- ✅ Maintain aspect ratio
- ✅ Show/hide labels based on space
- ✅ Stack on small screens

---

## Performance Tips

1. **Data Size:** Keep datasets under 1000 points for smooth rendering
2. **Update Frequency:** Refresh data every 5-10 minutes, not continuously
3. **Memory:** Charts cache data; clear state when component unmounts
4. **Database:** Use indexes on `createdAt` and `testId` fields

---

## Common Issues & Solutions

### Issue: Chart not displaying
**Solution:** Check that data array is not empty
```typescript
if (!data || data.length === 0) {
  return <div>No data available</div>;
}
```

### Issue: Dates not formatting correctly
**Solution:** Ensure date strings use format `DD/MM/YYYY`
```typescript
const date = new Date().toLocaleDateString('es-CO'); // Correct format
```

### Issue: Performance slow with large datasets
**Solution:** Limit data to last N days
```typescript
const trendData = await chartDataService.getResultsTrendData('lab-001', 30);
```

---

## Integration Checklist

- [ ] Import chart component
- [ ] Define data interface
- [ ] Fetch or generate data
- [ ] Pass data to chart component
- [ ] Set title and height props
- [ ] Test on mobile and desktop
- [ ] Verify Spanish labels display correctly
- [ ] Check performance with actual data

---

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Electron 13+

---

## Documentation Links

- [Recharts Official Docs](https://recharts.org)
- [Chart Components Source Code](./src/presentation/components/Charts)
- [ChartDataService Source](./src/application/services/ChartDataService.ts)

---

## Questions or Issues?

Refer to:
1. Component source code (fully commented)
2. Dashboard.tsx (working example)
3. PHASE_7_VISUALIZATION_SUMMARY.md (detailed documentation)
