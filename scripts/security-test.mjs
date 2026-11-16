import fs from 'node:fs';

const info = JSON.parse(fs.readFileSync('dist/build-info.json','utf8'));
const max = info.maxPublishedDay;
let errors = 0;
for (let day = max + 1; day <= 24; day++) {
  const file = `dist/contents/day-${String(day).padStart(2,'0')}.json`;
  if (fs.existsSync(file)) { console.error(`FUITE: ${file} ne devrait pas etre publie.`); errors++; }
}
const published = fs.readdirSync('dist/contents').filter(f => /^day-\d\d\.json$/.test(f));
console.log(`Contenus presents dans l artifact: ${published.length ? published.join(', ') : 'aucun'}`);
if (errors) process.exit(1);
console.log(`OK: aucun fichier futur apres la case ${max}.`);
