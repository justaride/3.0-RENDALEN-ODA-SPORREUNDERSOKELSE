/**
 * Data Validation Script for Rendalen Boligbehovsundersøkelse
 *
 * Run with: npx tsx scripts/validate-data.ts
 *
 * This script analyzes the survey data for:
 * - Invalid/corrupted values (Unset, Unsetbrenna, etc.)
 * - Null value patterns
 * - Multi-select field integrity
 * - Data consistency
 */

import surveyData from '../src/lib/data/survey-data.json';

interface ValidationReport {
  totalResponses: number;
  issues: ValidationIssue[];
  fieldStats: FieldStat[];
  multiSelectStats: MultiSelectStat[];
  summary: Summary;
}

interface ValidationIssue {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  field: string;
  description: string;
  affectedCount: number;
  examples: string[];
}

interface FieldStat {
  field: string;
  category: string;
  totalValues: number;
  nullCount: number;
  nullPercent: number;
  uniqueValues: string[];
  suspiciousValues: string[];
}

interface MultiSelectStat {
  field: string;
  totalResponses: number;
  totalChoices: number;
  avgChoicesPerResponse: number;
  uniqueChoices: string[];
  invalidMarkers: number;
}

interface Summary {
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  fieldsWithHighNullRate: number;
  corruptedLocationRecords: number;
}

// Known invalid/placeholder values
const INVALID_MARKERS = ['Unset', '.', 'Unset ', ' Unset', ''];
// Only flag actual "Unset" markers, not place names containing "brenna"
const SUSPICIOUS_PATTERNS = [/^Unset$/i, /^Unset[;\s]/i];

// All valid locations in Rendalen (from survey data analysis)
const VALID_LOCATIONS = [
  // Hovedsteder i Rendalen
  'Bergset',
  'Hanestad',
  'Otnes',
  'Åkrestrømmen',
  // Andre steder
  'Hornset',
  'Lomnessjøen øst',
  'Elvål',
  'Åkre',
  'Sjølisand',
  'Finstad',
  'Unsetbrenna',  // Real place name in Rendalen!
  'Fiskviklia',
  'Midtskogen',
  // Samlekategorier
  'Annet sted i Øvre Rendal',
  'Annet sted i Ytre Rendal',
  // Ikke bosatt i Rendalen
  'Jeg bor ikke i Rendalen i dag'
];

function validateData(): ValidationReport {
  const responses = surveyData.sheets[0].responses;
  const issues: ValidationIssue[] = [];
  const fieldStats: FieldStat[] = [];
  const multiSelectStats: MultiSelectStat[] = [];

  console.log('🔍 Starting data validation...\n');
  console.log(`📊 Total responses: ${responses.length}\n`);

  // 1. Check for "Unsetbrenna" and similar corrupted location values
  const locationField = 'diverse.hvor_i_rendalen_kommune_bor_du';
  const corruptedLocations: string[] = [];
  const locationValues: Record<string, number> = {};

  responses.forEach((r: any) => {
    const location = r.data.diverse?.hvor_i_rendalen_kommune_bor_du;
    if (location) {
      locationValues[location] = (locationValues[location] || 0) + 1;

      if (!VALID_LOCATIONS.includes(location) && location !== null) {
        corruptedLocations.push(location);
      }
    }
  });

  if (corruptedLocations.length > 0) {
    const uniqueCorrupted = [...new Set(corruptedLocations)];
    issues.push({
      severity: 'CRITICAL',
      field: locationField,
      description: `Found ${corruptedLocations.length} records with invalid location values`,
      affectedCount: corruptedLocations.length,
      examples: uniqueCorrupted.slice(0, 5)
    });
  }

  console.log('📍 Location Analysis:');
  console.log('─'.repeat(60));
  Object.entries(locationValues)
    .sort((a, b) => b[1] - a[1])
    .forEach(([value, count]) => {
      const isValid = VALID_LOCATIONS.includes(value);
      const marker = isValid ? '✓' : '⚠️';
      console.log(`  ${marker} "${value}": ${count} (${((count / responses.length) * 100).toFixed(1)}%)`);
    });
  console.log();

  // 2. Analyze null patterns across all fields
  const categories = ['demografi', 'navaerende_bolig', 'diverse', 'okonomi', 'arbeid',
                      'flytteplaner', 'boligpreferanser', 'omrade_kvalitet',
                      'tilgjengelighet_helse', 'bofellesskap', 'tilleggstjenester',
                      'hindringer_og_innspill', 'tomt_og_eiendom'];

  console.log('📋 Field Analysis (Null Rates):');
  console.log('─'.repeat(60));

  categories.forEach(category => {
    const firstResponse = responses[0]?.data?.[category];
    if (!firstResponse) return;

    Object.keys(firstResponse).forEach(fieldName => {
      let nullCount = 0;
      let validCount = 0;
      const uniqueValues: Set<string> = new Set();
      const suspiciousFound: Set<string> = new Set();

      responses.forEach((r: any) => {
        const value = r.data[category]?.[fieldName];

        if (value === null || value === undefined || value === '') {
          nullCount++;
        } else {
          validCount++;
          uniqueValues.add(String(value));

          // Check for suspicious patterns
          if (INVALID_MARKERS.includes(value)) {
            suspiciousFound.add(value);
          }
          SUSPICIOUS_PATTERNS.forEach(pattern => {
            if (pattern.test(String(value))) {
              suspiciousFound.add(String(value));
            }
          });
        }
      });

      const nullPercent = (nullCount / responses.length) * 100;

      fieldStats.push({
        field: fieldName,
        category,
        totalValues: responses.length,
        nullCount,
        nullPercent,
        uniqueValues: [...uniqueValues].slice(0, 10),
        suspiciousValues: [...suspiciousFound]
      });

      // Report high null rates
      if (nullPercent > 40) {
        const severity = nullPercent > 80 ? 'HIGH' : 'MEDIUM';
        if (nullPercent > 40) {
          console.log(`  ⚠️  ${category}.${fieldName.substring(0, 40)}...`);
          console.log(`      Null: ${nullCount}/${responses.length} (${nullPercent.toFixed(1)}%)`);
        }
      }

      // Report suspicious values
      if (suspiciousFound.size > 0) {
        issues.push({
          severity: 'MEDIUM',
          field: `${category}.${fieldName}`,
          description: `Contains suspicious placeholder values`,
          affectedCount: suspiciousFound.size,
          examples: [...suspiciousFound]
        });
      }
    });
  });
  console.log();

  // 3. Analyze multi-select fields
  const multiSelectFields = [
    { category: 'omrade_kvalitet', field: 'er_det_noe_du_savner_i_området_du_bor_flere_valg_mulig' },
    { category: 'flytteplaner', field: 'hvor_kunne_du_tenke_deg_å_bo_hvis_du_skulle_flytte_til_eller_innad_i_rendalen_kommune_flere_svar_mul' },
    { category: 'boligpreferanser', field: 'hvilke_nærmiljøkvaliteter_er_viktigst_for_deg_ved_valg_av_sted_å_bo_flere_valg_mulig' },
    { category: 'boligpreferanser', field: 'hvilken_boligtype_er_mest_aktuell_for_deg_ved_en_flytting_flere_svar_mulig' },
    { category: 'boligpreferanser', field: 'hvilke_bokvaliteter_er_viktigst_for_deg_ved_valg_av_ny_bolig_flere_valg_mulig' },
    { category: 'tilgjengelighet_helse', field: 'hva_må_tilpasses_eller_oppgraderes_dersom_dudere_skal_bo_lengst_mulig_i_egen_bolig_eller_fikk_reduse' },
    { category: 'bofellesskap', field: 'dersom_det_tilbys_boliger_med_mulighet_for_fellesløsninger_hvilke_tilbud_kunne_vært_relevant_for_deg' },
    { category: 'tilleggstjenester', field: 'hvilke_tjenester_kunne_du_tenke_deg_å_betale_ekstra_for_enten_direkte_eller_som_del_av_en_felleskost' },
    { category: 'hindringer_og_innspill', field: 'for_å_realisere_dine_boligønsker_hva_blir_dine_største_hindringer_flere_svar_mulig' }
  ];

  console.log('📝 Multi-Select Field Analysis:');
  console.log('─'.repeat(60));

  multiSelectFields.forEach(({ category, field }) => {
    let totalChoices = 0;
    let responsesWithValue = 0;
    let invalidMarkerCount = 0;
    const allChoices: Set<string> = new Set();

    responses.forEach((r: any) => {
      const value = r.data[category]?.[field];
      if (value && value !== null) {
        responsesWithValue++;
        const choices = String(value).split(';').map(c => c.trim()).filter(c => c.length > 0);

        choices.forEach(choice => {
          if (choice === 'Unset' || choice === '.') {
            invalidMarkerCount++;
          } else {
            allChoices.add(choice);
            totalChoices++;
          }
        });
      }
    });

    const avgChoices = responsesWithValue > 0 ? totalChoices / responsesWithValue : 0;

    multiSelectStats.push({
      field: `${category}.${field}`,
      totalResponses: responsesWithValue,
      totalChoices,
      avgChoicesPerResponse: avgChoices,
      uniqueChoices: [...allChoices],
      invalidMarkers: invalidMarkerCount
    });

    console.log(`  📊 ${field.substring(0, 50)}...`);
    console.log(`      Responses: ${responsesWithValue}, Unique choices: ${allChoices.size}, Avg choices: ${avgChoices.toFixed(2)}`);
    if (invalidMarkerCount > 0) {
      console.log(`      ⚠️  Invalid markers found: ${invalidMarkerCount}`);
    }
  });
  console.log();

  // 4. Generate summary
  const summary: Summary = {
    criticalIssues: issues.filter(i => i.severity === 'CRITICAL').length,
    highIssues: issues.filter(i => i.severity === 'HIGH').length,
    mediumIssues: issues.filter(i => i.severity === 'MEDIUM').length,
    lowIssues: issues.filter(i => i.severity === 'LOW').length,
    fieldsWithHighNullRate: fieldStats.filter(f => f.nullPercent > 40).length,
    corruptedLocationRecords: corruptedLocations.length
  };

  // Print final report
  console.log('═'.repeat(60));
  console.log('📋 VALIDATION SUMMARY');
  console.log('═'.repeat(60));
  console.log(`  Total responses: ${responses.length}`);
  console.log(`  Critical issues: ${summary.criticalIssues}`);
  console.log(`  High issues: ${summary.highIssues}`);
  console.log(`  Medium issues: ${summary.mediumIssues}`);
  console.log(`  Low issues: ${summary.lowIssues}`);
  console.log(`  Fields with >40% null: ${summary.fieldsWithHighNullRate}`);
  console.log(`  Corrupted location records: ${summary.corruptedLocationRecords}`);
  console.log();

  if (issues.length > 0) {
    console.log('⚠️  ISSUES FOUND:');
    console.log('─'.repeat(60));
    issues.forEach(issue => {
      const icon = issue.severity === 'CRITICAL' ? '🔴' :
                   issue.severity === 'HIGH' ? '🟠' :
                   issue.severity === 'MEDIUM' ? '🟡' : '🟢';
      console.log(`  ${icon} [${issue.severity}] ${issue.field}`);
      console.log(`     ${issue.description}`);
      console.log(`     Affected: ${issue.affectedCount}`);
      if (issue.examples.length > 0) {
        console.log(`     Examples: ${issue.examples.join(', ')}`);
      }
      console.log();
    });
  }

  return {
    totalResponses: responses.length,
    issues,
    fieldStats,
    multiSelectStats,
    summary
  };
}

// Run validation
const report = validateData();

// Exit with error code if critical issues found
if (report.summary.criticalIssues > 0) {
  console.log('\n❌ Validation failed - critical issues found!');
  process.exit(1);
} else {
  console.log('\n✅ Validation complete - no critical issues found.');
  process.exit(0);
}
