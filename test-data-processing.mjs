// Quick test to check data processing
import { readFileSync } from 'fs';

const surveyDataRaw = JSON.parse(readFileSync('./src/lib/data/survey-data.json', 'utf-8'));
const responses = surveyDataRaw.sheets[0].responses;

// Extract the specific field
const destinationValues = responses.map(r =>
  r.data.flytteplaner.hvor_kunne_du_tenke_deg_å_bo_hvis_du_skulle_flytte_til_eller_innad_i_rendalen_kommune_flere_svar_mul
);

console.log('Total responses:', responses.length);
console.log('Sample destination values (first 10):');
destinationValues.slice(0, 10).forEach((val, idx) => {
  console.log(`  ${idx}: "${val}"`);
});

// Count multi-choice
function countMultipleChoices(responses) {
  const counts = {};

  responses.forEach(response => {
    if (!response) return;

    // Split by semicolon to get individual choices
    const choices = response.split(';').map(c => c.trim()).filter(c => c.length > 0);

    choices.forEach(choice => {
      // Skip invalid/empty values
      if (choice === 'Unset' || choice === '.' || choice === '') {
        return;
      }

      // Count each choice individually
      counts[choice] = (counts[choice] || 0) + 1;
    });
  });

  return counts;
}

const counts = countMultipleChoices(destinationValues);
console.log('\nCounts after processing:');
console.log(counts);
console.log('\nTotal unique destinations:', Object.keys(counts).length);
console.log('Total count sum:', Object.values(counts).reduce((a, b) => a + b, 0));
