import fs from 'node:fs';
import path from 'node:path';

const YEAR = 2026;
const TZ = 'Europe/Paris';
const mode = process.env.MODE === 'demo' ? 'demo' : 'normal';
const demoDay = Math.min(24, Math.max(0, Number.parseInt(process.env.DEMO_DAY || '0', 10) || 0));

function parisParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year:'numeric', month:'numeric', day:'numeric' }).formatToParts(date);
  return Object.fromEntries(parts.filter(p => p.type !== 'literal').map(p => [p.type, Number(p.value)]));
}
function allowedDay() {
  if (mode === 'demo') return demoDay;
  const p = parisParts();
  if (p.year < YEAR || (p.year === YEAR && p.month < 12)) return 0;
  if (p.year > YEAR || (p.year === YEAR && p.month > 12) || p.day > 24) return 24;
  return p.day;
}
function readSecretContents() {
  if (!process.env.ADVENT_CONTENTS) return {};
  try { return JSON.parse(process.env.ADVENT_CONTENTS); }
  catch { throw new Error('ADVENT_CONTENTS doit etre un JSON valide.'); }
}

const maxDay = allowedDay();
const secretContents = readSecretContents();
fs.rmSync('dist', { recursive:true, force:true });
fs.mkdirSync('dist/contents', { recursive:true });
for (const file of ['index.html','style.css','app.js']) fs.copyFileSync(file, path.join('dist', file));

// day-01.json reste un exemple public du Palier 2. Les autres jours viennent uniquement du secret.
if (maxDay >= 1 && fs.existsSync('contents/day-01.json')) fs.copyFileSync('contents/day-01.json', 'dist/contents/day-01.json');
for (let day = 2; day <= maxDay; day++) {
  const key = String(day).padStart(2,'0');
  const content = secretContents[key];
  if (!content) continue;
  fs.writeFileSync(`dist/contents/day-${key}.json`, JSON.stringify(content, null, 2));
}
fs.writeFileSync('dist/build-info.json', JSON.stringify({mode, maxPublishedDay:maxDay, timeZone:TZ, generatedAt:new Date().toISOString()}, null, 2));
console.log(`Build ${mode}: cases autorisees jusqu a ${maxDay}.`);
