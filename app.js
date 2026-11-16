const YEAR = 2026;
const TZ = 'Europe/Paris';
const calendar = document.querySelector('#calendar');
const simulatedDay = document.querySelector('#simulatedDay');
const dialog = document.querySelector('#doorDialog');
const dialogTitle = document.querySelector('#dialogTitle');
const dialogBody = document.querySelector('#dialogBody');

function parisParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('fr-FR', { timeZone: TZ, year:'numeric', month:'numeric', day:'numeric' }).formatToParts(date);
  return Object.fromEntries(parts.filter(p => p.type !== 'literal').map(p => [p.type, Number(p.value)]));
}
function effectiveDay() {
  if (simulatedDay.value !== '') return Number(simulatedDay.value);
  const p = parisParts();
  if (p.year < YEAR || (p.year === YEAR && p.month < 12)) return 0;
  if (p.year > YEAR || (p.year === YEAR && p.month > 12) || p.day > 24) return 25;
  return p.day;
}
async function loadPublishedContent(day) {
  const file = `contents/day-${String(day).padStart(2,'0')}.json`;
  const response = await fetch(file, { cache: 'no-store' });
  if (!response.ok) throw new Error('not-published');
  return response.json();
}
async function openDoor(day) {
  dialogTitle.textContent = `Case ${day}`;
  dialogBody.textContent = 'Chargement…';
  dialog.showModal();
  try {
    const content = await loadPublishedContent(day);
    dialogTitle.textContent = content.title || `Case ${day}`;
    dialogBody.textContent = content.message || 'Surprise publiée.';
  } catch {
    dialogBody.textContent = "Cette case est déverrouillée dans la simulation, mais son contenu n'est pas publié. C'est le comportement sécurisé attendu.";
  }
}
function render() {
  document.querySelector('#parisDate').textContent = new Intl.DateTimeFormat('fr-FR',{timeZone:TZ,dateStyle:'full',timeStyle:'short'}).format(new Date());
  calendar.replaceChildren();
  const current = effectiveDay();
  for (let day=1; day<=24; day++) {
    const isOpen = current > day;
    const isToday = current === day;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `door ${isToday ? 'today' : isOpen ? 'open' : 'locked'}`;
    button.disabled = !(isOpen || isToday);
    const label = isToday ? '★ AUJOURD’HUI' : isOpen ? '✓ OUVERTE' : `🔒 OUVRE LE ${day}/12`;
    button.innerHTML = `<span class="day">${String(day).padStart(2,'0')}</span><span class="state">${label}</span>`;
    button.setAttribute('aria-label', `Case ${day}, ${isToday ? "aujourd'hui" : isOpen ? 'ouverte' : `fermée, ouvre le ${day} décembre`}`);
    if (!button.disabled) button.addEventListener('click', () => openDoor(day));
    calendar.append(button);
  }
}
document.querySelector('#closeDialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
simulatedDay.addEventListener('change', render);
render();
