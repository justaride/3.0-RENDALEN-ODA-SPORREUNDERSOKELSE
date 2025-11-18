// Comprehensive comparison of source JSON vs current project JSON
import { readFileSync } from 'fs';

const source = JSON.parse(readFileSync('/Users/gabrielboen/Downloads/Rendalen ODA Boligmarkedssundersøkelse/json_transform/data/oda_rev_sheet1.json', 'utf-8'));
const current = JSON.parse(readFileSync('/Users/gabrielboen/Downloads/KOPI-3.0-RENDALEN-UNDERSOKELSE/src/lib/data/survey-data.json', 'utf-8'));

console.log('=== DATA COMPARISON ===\n');

console.log('SOURCE JSON (transform.py output):');
console.log('  Total responses:', source.length);
console.log('  First response sections:', Object.keys(source[0]).sort());
console.log('');

console.log('CURRENT PROJECT (survey-data.json):');
console.log('  Total responses:', current.sheets[0].responses.length);
console.log('  First response sections:', Object.keys(current.sheets[0].responses[0].data).sort());
console.log('');

// Count all fields in source
const sourceFields = new Set();
source.forEach(response => {
  Object.values(response).forEach(section => {
    if (typeof section === 'object' && section !== null) {
      Object.keys(section).forEach(field => sourceFields.add(field));
    }
  });
});

// Count all fields in current project
const currentFields = new Set();
current.sheets[0].responses.forEach(response => {
  Object.values(response.data).forEach(section => {
    if (typeof section === 'object' && section !== null) {
      Object.keys(section).forEach(field => currentFields.add(field));
    }
  });
});

console.log('FIELD COUNT:');
console.log('  Source unique fields:', sourceFields.size);
console.log('  Current unique fields:', currentFields.size);
console.log('');

// Find missing fields
const missingInCurrent = [...sourceFields].filter(f => !currentFields.has(f));
const missingInSource = [...currentFields].filter(f => !sourceFields.has(f));

if (missingInCurrent.length > 0) {
  console.log('⚠️  FIELDS IN SOURCE BUT MISSING IN CURRENT:');
  missingInCurrent.forEach(f => console.log('  -', f));
  console.log('');
}

if (missingInSource.length > 0) {
  console.log('⚠️  FIELDS IN CURRENT BUT MISSING IN SOURCE:');
  missingInSource.forEach(f => console.log('  -', f));
  console.log('');
}

// Check sample data consistency
console.log('SAMPLE DATA CHECK (Response 1):');
const sourceResp1 = source[0];
const currentResp1 = current.sheets[0].responses[0];

console.log('  Source sections:', Object.keys(sourceResp1).length);
console.log('  Current sections:', Object.keys(currentResp1.data).length);
console.log('');

// Check multi-value fields
const multiValueInCurrent = [];
current.sheets[0].responses.slice(0, 100).forEach(response => {
  Object.entries(response.data).forEach(([sectionName, section]) => {
    if (typeof section === 'object' && section !== null) {
      Object.entries(section).forEach(([fieldName, value]) => {
        if (typeof value === 'string' && value.includes(';')) {
          const fullFieldName = `${sectionName}.${fieldName}`;
          if (!multiValueInCurrent.includes(fullFieldName)) {
            multiValueInCurrent.push(fullFieldName);
          }
        }
      });
    }
  });
});

console.log('MULTI-VALUE FIELDS DETECTED (first 100 responses):');
console.log('  Count:', multiValueInCurrent.length);
multiValueInCurrent.forEach(f => console.log('  -', f));
console.log('');

console.log('✅ VALIDATION COMPLETE');
