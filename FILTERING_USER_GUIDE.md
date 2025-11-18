# FilterBar & Export Quick Reference

## Overview
The Dashboard now includes advanced filtering capabilities and export functionality to analyze and share laboratory data.

## 🔍 Filtering

### Date Range Filter
Located at the top of the Dashboard under "Filtros"

**Fecha de Inicio (Start Date):**
- Click the date input field
- Select a date from the calendar
- All results from this date forward will be shown
- Leave empty to show all dates from the beginning

**Fecha de Fin (End Date):**
- Click the date input field
- Select a date from the calendar
- All results up to this date will be shown
- Leave empty to show all dates to today

**Example:** Filter last 7 days
1. Click "Fecha de Inicio"
2. Select today minus 7 days
3. Click "Fecha de Fin"
4. Select today
5. Charts update automatically

### Test Type Filter
**Tipo de Examen (Test Type):**
- Click the dropdown menu
- Options: "Todos los Exámenes", "Glucosa", "Hemoglobina", "Colesterol", "Creatinina"
- Select a test type to show only results for that test
- Charts update automatically
- Can be combined with date filters

**Example:** View only Glucosa results from the last month
1. Select "Glucosa" from "Tipo de Examen"
2. Set date range to last month
3. TrendChart, DistributionChart, and ResultsComparisonChart all update to show only Glucosa

### Result Status Filter
**Estado del Resultado (Result Status):**
- Click the dropdown menu
- Options: "Todos los Estados", "Normal", "Anormal"
- Select to filter results by status
- Particularly useful in the Comparison chart
- Shows only the selected type of results

**Status Behavior:**
- "Todos los Estados" → Shows both normal and abnormal results
- "Normal" → Shows only normal results (abnormal count shows 0)
- "Anormal" → Shows only abnormal results (normal count shows 0)

### Clear Filters
**Limpiar Filtros (Clear Filters) button:**
- Resets all filters to default state
- Shows all data again
- "Todos los Exámenes" is selected
- "Todos los Estados" is selected
- Date fields are empty

---

## 📥 CSV Export

**📥 Exportar CSV button**

### What Gets Exported:
- Date range filtered trend data
- All currently visible data from TrendChart
- Respects all active filters
- One row per data point
- Headers: Fecha, Tipo Examen, Valor

### Export Process:
1. Set filters as desired
2. Click "📥 Exportar CSV"
3. Browser downloads file automatically
4. Default filename: `reporte-tendencias-[timestamp].csv`

### CSV Format Example:
```csv
Fecha,Tipo Examen,Valor
17/11/2024,Glucosa,95.23
17/11/2024,Hemoglobina,14.50
17/11/2024,Colesterol,180.00
```

### Opening CSV in Excel:
1. Download the file
2. Open Excel
3. File → Open → Select the CSV file
4. Excel may ask about formatting - click "Next" to accept defaults
5. Data appears in columns with headers

### Filtering in Excel:
- Use Excel's built-in filter feature on the header row
- Can sort by Fecha (Date) or Valor (Value)
- Can apply conditional formatting to Valor column

---

## 📄 PDF Export

**📄 Exportar PDF button**

### What Gets Exported:
- Professional formatted report
- Current report title: "Reporte de Tendencias"
- Current date and time (Spanish format)
- Table with filtered data
- RobotCom LIMS footer

### Export Process:
1. Set filters as desired
2. Click "📄 Exportar PDF"
3. Browser's print dialog opens
4. Click "Imprimir" (Print) button
5. Select "Guardar como PDF" (Save as PDF)
6. Choose location and filename
7. Click "Guardar" (Save)

### Print Dialog Options:
- **Printer:** Change to "Guardar como PDF" (Save as PDF)
- **Copies:** Usually set to 1
- **Page size:** A4 is default (standard letter size)
- **Margin:** Margins are pre-set
- **Headers/Footers:** Usually auto-included by browser

### PDF Features:
- Professional styling with borders
- Color-coded headers (gray background)
- Logo/branding area ready for customization
- Print-friendly layout
- Footer shows "Reporte generado automáticamente - RobotCom LIMS"
- Locale-aware date formatting

---

## 🔄 Filter + Export Workflow

### Example 1: Monthly Report
**Goal:** Export all October tests for accounting review

1. Click "Fecha de Inicio" → Select October 1
2. Click "Fecha de Fin" → Select October 31
3. Leave "Tipo de Examen" as "Todos los Exámenes"
4. Leave "Estado del Resultado" as "Todos los Estados"
5. Click "📄 Exportar PDF" → Print to PDF
6. OR Click "📥 Exportar CSV" → Download spreadsheet

### Example 2: Abnormal Results Report
**Goal:** Find and report all abnormal Creatinina tests this month

1. Click "Tipo de Examen" → Select "Creatinina"
2. Click "Estado del Resultado" → Select "Anormal"
3. Set date range to current month
4. Charts show only abnormal Creatinina results
5. Click "📄 Exportar PDF" → Print to PDF
6. Share or file the report

### Example 3: Lab Director Analysis
**Goal:** Analyze test trends over 3 months

1. Set "Fecha de Inicio" to 3 months ago
2. Leave "Fecha de Fin" empty (current date)
3. Select specific test type (e.g., "Glucosa")
4. Look at TrendChart for patterns
5. Click "📥 Exportar CSV" → Import to Excel
6. Create additional charts/analysis in Excel

---

## ⚠️ Important Notes

### Data Filtering:
- Filters apply **immediately** - no "Apply" button needed
- Filters are **additive** - selecting date AND test type filters by both
- **All chart types** update when you change filters
- Filters do **NOT** modify original data - just what's displayed

### Export Behavior:
- Only **filtered data** is exported
- If no filters are set, **all data** is exported
- PDF uses browser's print functionality (works on all devices)
- CSV filename includes timestamp to prevent overwrites

### Browser Support:
- Chrome/Chromium: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Edge: ✅ Full support
- Works offline (no internet required)

### CSV Compatibility:
- Compatible with: Excel, Google Sheets, LibreOffice, Numbers
- Character encoding: UTF-8 (supports Spanish characters)
- Separators: Comma (,)
- Decimal: Period (.) 

### PDF Compatibility:
- Works with: All PDF readers
- Standard: A4 (210 x 297 mm) size
- Uses system default printer/PDF settings
- Headers/footers may vary by browser

---

## 🎯 Keyboard Shortcuts

While filtering:
- **Tab** → Move between fields
- **Enter** → Confirm date selection or filter
- **Escape** → Close any open dropdowns
- **Ctrl+C** → Copy from CSV file after downloading

---

## ❓ Troubleshooting

**Q: Filters aren't working?**
A: Try clearing filters first using "Limpiar Filtros", then set them again.

**Q: Charts aren't updating after filtering?**
A: Refresh the page (F5) or close and re-open the Dashboard.

**Q: CSV file is empty or shows strange characters?**
A: Try opening in Excel instead of a text editor. Excel handles formatting better.

**Q: PDF export doesn't work?**
A: Check if a print dialog opened. If not, your browser may have blocked it. Check browser permissions.

**Q: Can't see the Filtros panel?**
A: Scroll to the top of the Dashboard. The filter panel is above the charts.

**Q: Export button does nothing?**
A: Check browser console (F12) for errors. Try refreshing the page.

---

## 🚀 Tips & Tricks

1. **Quick Filter Reset:** Single click "Limpiar Filtros" button instead of clearing each field
2. **Date Shortcuts:** Some browsers offer quick date selections (last week, last month)
3. **CSV Sorting:** Download CSV then sort by "Valor" in Excel to find high/low values
4. **PDF Naming:** Browser adds timestamp - you can rename the file after saving
5. **Multiple Reports:** Use date filters to create separate reports for each month
6. **Test Comparisons:** Export data for two test types separately, then compare in Excel

---

## 📧 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Look for error messages in browser console (F12 → Console tab)
3. Try clearing browser cache (Ctrl+Shift+Delete)
4. Report specific error messages to development team

---

*Last Updated: November 17, 2024*  
*Version: 1.0.0*
