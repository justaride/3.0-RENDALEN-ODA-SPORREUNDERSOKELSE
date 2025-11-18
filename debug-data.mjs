import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./src/lib/data/survey-data.json', 'utf8'));
const responses = data.sheets[0].responses;

// Extract the "missing" field
const field = 'er_det_noe_du_savner_i_området_du_bor_flere_valg_mulig';
const values = responses.map(r => r.data.omrade_kvalitet?.[field]).filter(v => v);

console.log('Total responses:', responses.length);
console.log('Non-null values:', values.length);
console.log('\nSample values:');
values.slice(0, 5).forEach((v, i) => {
  console.log(`${i + 1}. "${v}"`);
});

// Count individual choices
const counts = {};
values.forEach(response => {
  const choices = response.split(';').map(c => c.trim()).filter(c => c.length > 0);
  choices.forEach(choice => {
    if (choice === 'Unset' || choice === '.' || choice === '') return;
    counts[choice] = (counts[choice] || 0) + 1;
  });
});

console.log('\nUnique choices:', Object.keys(counts).length);
console.log('\nTop 10 choices:');
Object.entries(counts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .forEach(([choice, count], i) => {
    const percent = ((count / responses.length) * 100).toFixed(1);
    console.log(`${i + 1}. ${choice}: ${count} (${percent}%)`);
  });
