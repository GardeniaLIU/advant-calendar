const YEAR = 2026;
const TZ = 'Europe/Paris';

// Palier 1: contenus temporaires de developpement uniquement.
// Les vraies surprises futures ne doivent jamais etre embarquees dans ce fichier.
const DEV_CONTENT = {
  1: "Exemple de développement : bienvenue dans AI First 2026.",
  6: "Exemple de développement : mini-défi IA du jour.",
  12: "Exemple de développement : contenu factice pour tester la simulation."
};

const calendar = document.querySelector('#calendar');
const simulatedDay = document.querySelector('#simulatedDay');
const dialog = document.querySelector('#doorDialog');
const dialogTitle = document.querySelector('#dialogTitle');
const dialogBody = document.querySelector('#dialogBody');

function parisParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('fr-FR', {timeZone:TZ, year:'numeric', month:'numeric', day:'numeric'}).formatToParts(date);
  return Object.fromEntries(parts.filter(p => p.type !== 'literal').map(p => [p.type, Number(p.value)]));
}

function effectiveDay() {
  if (simulatedDay.value !== '') return Number(simulatedDay.value);
  const p = parisParts();
  if (p.year < YEAR || (p.year === YEAR && p.month < 12)) return 0;
  if (p.year > YEAR || (p.year === YEAR && p.month > 12) || p.day > 24) return 25;
  return p.day;
}

function render() {
  const now = new Intl.DateTimeFormat('fr-FR',{timeZone:TZ,dateStyle:'full',timeStyle:'short'}).format(new Date());
  document.querySelector('#parisDate').textContent = now;
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

function openDoor(day) {
  dialogTitle.textContent = `Case ${day}`;
  dialogBody.textContent = DEV_CONTENT[day] ?? 'Contenu non publié dans le Palier 1. Cette absence est volontaire.';
  dialog.showModal();
}

document.querySelector('#closeDialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
simulatedDay.addEventListener('change', render);
render();
