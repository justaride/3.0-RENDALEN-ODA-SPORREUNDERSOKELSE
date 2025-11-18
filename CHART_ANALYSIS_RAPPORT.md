# Analyse av Graf-renderingsproblemer

**Dato:** 18. november 2025
**Status:** Analyse fullført - Flere mulige årsaker identifisert

## Problem

Pie charts vises korrekt, men andre grafer (spesielt HorizontalBarChart og BarChart) vises ikke som forventet. Eksempel: "Hvor kunne du tenke deg å bo?" på `/flytting` siden.

## Utført Analyse

### 1. Data Processing ✅ FUNGERER

Testet dataprosessering med test script (`test-data-processing.mjs`):
- **Input:** 1015 respondenter
- **Output:** 98 unike destinasjoner, 1114 totale valg
- **Konklusjon:** Data håndteres korrekt, semicolon-separerte verdier splittes riktig

### 2. Komponentstruktur ✅ KORREKT

- PieChart: `/src/components/charts/PieChart.tsx` - Fungerer
- BarChart: `/src/components/charts/BarChart.tsx` - Problemer
- HorizontalBarChart: `/src/components/charts/HorizontalBarChart.tsx` - Wrapper rundt BarChart

### 3. Mulige Årsaker

#### A. ResponsiveContainer Høyde-problem ⚠️ SANNSYNLIG

**Problem:** Recharts' ResponsiveContainer krever definert høyde fra parent element.

**Lokasjon:** `src/components/charts/BarChart.tsx:179`

```typescript
const chartHeight = orientation === 'horizontal'
  ? Math.max(400, chartData.length * 40)
  : 400;

<ResponsiveContainer width="100%" height={chartHeight}>
```

**Potensiell feil:**
- Hvis `chartData.length` er 0 eller undefined, blir `chartHeight` NaN
- ResponsiveContainer kan ikke rendre med ugyldig høyde

#### B. React 19 Kompatibilitet ⚠️ MULIG

**Versjon i bruk:** React 19.2.0 (package.json:23)

React 19 er svært ny (utgitt høsten 2024) og Recharts kan ha kompatibilitetsproblemer. Sjekk Recharts versjon:
```json
"recharts": "^3.4.1"
```

#### C. Data Value Problemer ⚠️ MULIG

**Observasjon:** chartData kan inneholde:
- `value: NaN` hvis `displayMode === 'percent'` og `item.percent` er undefined
- `value: undefined` hvis både `count` og `percent` er undefined

**Lokasjon:** `src/components/charts/BarChart.tsx:67-72`

```typescript
const chartData = displayData.map(item => ({
  name: item.name,
  value: displayMode === 'percent' ? item.percent! : item.count!,
  count: item.count,
  percent: item.percent,
}));
```

Den bruker non-null assertion (`!`) uten null-sjekk.

#### D. XAxis/YAxis Konfigurasjon ⚠️ LITEN SANNSYNLIGHET

For horizontal charts med mange items kan YAxis width (300px) være for liten for lange stedsnavn.

## Anbefalte Tiltak

### 1. FØRST: Test med test-siden

Jeg har opprettet en test-side for å isolere problemet:

```bash
# Gå til denne URL i nettleseren
http://localhost:3000/test-charts
```

**Hva denne siden gjør:**
- Viser 4 ulike chart-typer med identiske data
- Enkel debug-info
- Lar deg sammenligne PieChart (fungerer) vs BarChart/HorizontalBarChart

**Sjekk:**
1. Åpne nettleserens console (F12)
2. Se etter feilmeldinger
3. Noter hvilke charts som vises og hvilke som ikke vises

### 2. Debugging i nettleser

Åpne `/flytting` siden og sjekk console for:

1. **React errors:**
   - "Cannot read property 'map' of undefined"
   - "Warning: Each child in a list should have a unique key"

2. **Recharts warnings:**
   - "Warning: Received NaN for the 'height' attribute"
   - "Warning: Failed prop type"

3. **Data issues:**
   - Er `chartData` tom?
   - Har `value` feltet gyldige tall?

**Sjekk i console:**
```javascript
// I console, mens du er på /flytting siden
// Finn chart elementet
document.querySelector('.chart-container')
```

### 3. Foreslåtte Kodfikser

#### Fix A: Sikre gyldig chartHeight

`src/components/charts/BarChart.tsx:75-77`

**Før:**
```typescript
const chartHeight = orientation === 'horizontal'
  ? Math.max(400, chartData.length * 40)
  : 400;
```

**Etter:**
```typescript
const chartHeight = orientation === 'horizontal'
  ? Math.max(400, (chartData?.length || 0) * 40)
  : 400;

// DEBUG: Legg til logging
console.log('BarChart height calculation:', {
  orientation,
  dataLength: chartData?.length,
  calculatedHeight: chartHeight
});
```

#### Fix B: Sikre gyldige data-verdier

`src/components/charts/BarChart.tsx:67-72`

**Før:**
```typescript
const chartData = displayData.map(item => ({
  name: item.name,
  value: displayMode === 'percent' ? item.percent! : item.count!,
  count: item.count,
  percent: item.percent,
}));
```

**Etter:**
```typescript
const chartData = displayData.map(item => ({
  name: item.name,
  value: displayMode === 'percent'
    ? (item.percent ?? 0)
    : (item.count ?? 0),
  count: item.count ?? 0,
  percent: item.percent ?? 0,
}));

// DEBUG: Valider data
const invalidData = chartData.filter(d =>
  isNaN(d.value) || d.value === null || d.value === undefined
);
if (invalidData.length > 0) {
  console.error('Invalid chart data detected:', invalidData);
}
```

#### Fix C: Legg til feilhåndtering i BarChart

Legg til på toppen av component-body:

```typescript
// Safety check
if (!data || data.length === 0) {
  return (
    <ChartCard title={title} description={description}>
      <div className="flex items-center justify-center h-64 text-neutral-500">
        Ingen data tilgjengelig
      </div>
    </ChartCard>
  );
}

// Data validation
const hasValidData = displayData.some(item =>
  (displayMode === 'percent' ? item.percent : item.count) > 0
);

if (!hasValidData) {
  return (
    <ChartCard title={title} description={description}>
      <div className="flex items-center justify-center h-64 text-neutral-500">
        Alle verdier er 0
      </div>
    </ChartCard>
  );
}
```

## Neste Steg

1. **Kjør test-siden** (`/test-charts`) og rapporter hva du ser
2. **Sjekk nettleser-console** for feilmeldinger
3. **Implementer Fix A og B** over (sikre gyldige verdier)
4. **Test igjen** og se om problemet er løst
5. **Hvis problemet vedvarer:** Vurder å downgrade React til v18 for testing

## Filer Opprettet

- `/test-data-processing.mjs` - Test script for dataprosessering
- `/src/app/test-charts/page.tsx` - Test-side for isolert chart testing
- `/CHART_ANALYSIS_RAPPORT.md` - Denne rapporten

## Kontaktinformasjon for Videre Analyse

Hvis problemet vedvarer etter disse tiltakene, trenger jeg:
1. Screenshot av `/test-charts` siden
2. Console output (errors og warnings)
3. Screenshot av "Hvor kunne du tenke deg å bo?" grafen
4. Network tab info (er Recharts lastet riktig?)
