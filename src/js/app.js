import { components, team } from '../data/content.js';

const $ = (selector) => document.querySelector(selector);

const initials = (name) => name.split(' ').map(part => part[0]).join('');

$('#component-grid').innerHTML = components.map((component, index) => `
  <article class="component-card">
    <div class="component-symbol">${component.symbol}</div>
    <div><small>Module ${String(index + 1).padStart(2, '0')}</small><h3>${component.name}</h3><p>${component.detail}</p></div>
  </article>`).join('');

$('#team-grid').innerHTML = team.map((name, index) => `
  <article class="team-card"><div class="avatar">${initials(name)}</div><div><h3>${name}</h3><p>AWCR / ${String(index + 1).padStart(2, '0')}</p></div></article>`).join('');

const header = $('.site-header');
addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 25), { passive: true });

const menu = $('.menu-button');
menu.addEventListener('click', () => {
  const open = header.classList.toggle('menu-open');
  menu.setAttribute('aria-expanded', open);
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => header.classList.remove('menu-open')));

const control = $('#road-control');
const car = $('#demo-ev');
const coils = [...document.querySelectorAll('.demo-coil-row i')];
const field = $('.field-lines');
const pos = $('#position-output');
const zone = $('#zone-readout');
const battery = $('#battery-output');
const meter = $('#battery-meter');
const efficiency = $('#efficiency-output');
const power = $('#power-output');
const detection = $('#detection-output');

function updateDemo() {
  const value = Number(control.value);
  const activeZone = Math.min(4, Math.floor(value / 25) + 1);
  const isActive = value > 4 && value < 96;
  const percent = Math.round(56 + value * 0.25);
  // Transform-based motion avoids layout rounding inside the perspective road.
  // The slider and direct vehicle drag both use this single update path.
  car.style.transform = `translateX(${value * 4.85}%)`;
  coils.forEach((coil, index) => coil.classList.toggle('active', isActive && index === activeZone - 1));
  field.classList.toggle('active', isActive);
  pos.value = `${value}%`;
  zone.textContent = isActive ? `Zone ${String(activeZone).padStart(2, '0')} / charging` : 'Road edge / standby';
  battery.textContent = `${percent}%`;
  meter.style.width = `${percent}%`;
  efficiency.textContent = isActive ? `${88 - Math.abs(12.5 - value % 25) / 5 | 0}%` : '—';
  power.textContent = isActive ? `${Math.round(32 + (value % 8) * 1.3)} W` : '0 W';
  detection.textContent = isActive ? 'Vehicle found' : 'Idle';
}
control.addEventListener('input', updateDemo);
updateDemo();

let isDraggingVehicle = false;
const road = $('.demo-road');

function moveVehicleToPointer(clientX) {
  const bounds = road.getBoundingClientRect();
  const relativePosition = Math.max(0, Math.min(1, (clientX - bounds.left) / bounds.width));
  control.value = String(Math.round(relativePosition * 100));
  updateDemo();
}

car.addEventListener('pointerdown', (event) => {
  isDraggingVehicle = true;
  car.setPointerCapture(event.pointerId);
  event.preventDefault();
  moveVehicleToPointer(event.clientX);
});

car.addEventListener('pointermove', (event) => {
  if (isDraggingVehicle) moveVehicleToPointer(event.clientX);
});

car.addEventListener('pointerup', () => { isDraggingVehicle = false; });
car.addEventListener('pointercancel', () => { isDraggingVehicle = false; });

$('#zoom-blueprint').addEventListener('click', () => $('#blueprint-viewer').classList.toggle('zoomed'));
$('#toggle-blueprint').addEventListener('click', () => $('#blueprint-viewer').classList.toggle('high-contrast'));
document.querySelectorAll('.hotspot').forEach((button, index) => button.addEventListener('click', () => alert(index ? 'Receiver plate: aligns with the local field above the road surface.' : 'Transmitter coil: localised planar winding for a single road zone.')));

// After ten seconds without input, the fullscreen exhibit display provides a
// short, title-led explanation for visitors viewing the model from a distance.
const exhibit = $('#exhibit-mode');
const exhibitTitle = $('#exhibit-title');
const exhibitKicker = $('#exhibit-kicker');
const exhibitCopy = $('#exhibit-copy');
const exhibitTeam = $('#exhibit-team');
const exhibitProgress = $('#exhibit-progress');
const exhibitScenes = [
  { kicker: 'A CLASS XII ENGINEERING PROTOTYPE', title: 'Adaptive Wireless<br><em>Charging Road</em>', copy: 'Powering electric vehicles through the road, while they move.' },
  { kicker: 'SMART INFRASTRUCTURE', title: 'Four road zones.<br><em>One active field.</em>', copy: 'IR detection energises only the section beneath the vehicle.' },
  { kicker: 'THE CORE PRINCIPLE', title: 'Energy moves<br><em>without contact.</em>', copy: 'A changing magnetic field couples the transmitter and receiver coils.' },
  { kicker: 'ENGINEERING VIEW', title: 'Make the invisible<br><em>inspectable.</em>', copy: 'The road becomes a technical blueprint: coils, receiver plate and magnetic flux.' },
  { kicker: 'MADE BY THE AVCR TEAM', title: 'Powering tomorrow.<br><em>Together.</em>', copy: 'A Class XII science-exhibition prototype.', team: 'Naitik Singh · Shreyansh Tiwari · Kushagra Tiwari · Shivam Rai · Ayan Ahmed · Suraj Singh · Aditya Dwivedi' }
];
let idleTimer;
let exhibitTimer;
let exhibitIndex = 0;

function paintExhibitScene(index) {
  const scene = exhibitScenes[index];
  exhibit.classList.remove('scene-change');
  requestAnimationFrame(() => {
    exhibitKicker.textContent = scene.kicker;
    exhibitTitle.innerHTML = scene.title;
    exhibitCopy.textContent = scene.copy;
    exhibitTeam.hidden = !scene.team;
    exhibitTeam.textContent = scene.team || '';
    exhibitProgress.textContent = `${String(index + 1).padStart(2, '0')} / ${String(exhibitScenes.length).padStart(2, '0')}`;
    exhibit.dataset.zone = String(index + 1);
    exhibit.classList.toggle('blueprint-moment', index === 3);
    exhibit.classList.add('scene-change');
  });
}

function startExhibitMode() {
  if (exhibit.classList.contains('is-active')) return;
  exhibitIndex = 0;
  paintExhibitScene(exhibitIndex);
  exhibit.classList.add('is-active');
  exhibit.setAttribute('aria-hidden', 'false');
  exhibitTimer = setInterval(() => {
    exhibitIndex = (exhibitIndex + 1) % exhibitScenes.length;
    paintExhibitScene(exhibitIndex);
  }, 4000);
}

function stopExhibitMode() {
  clearInterval(exhibitTimer);
  exhibit.classList.remove('is-active');
  exhibit.setAttribute('aria-hidden', 'true');
}

function resetIdleTimer() {
  stopExhibitMode();
  clearTimeout(idleTimer);
  idleTimer = setTimeout(startExhibitMode, 10000);
}

['pointerdown', 'pointermove', 'keydown', 'touchstart', 'wheel'].forEach((eventName) => {
  document.addEventListener(eventName, resetIdleTimer, { passive: true });
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) clearTimeout(idleTimer);
  else resetIdleTimer();
});
resetIdleTimer();
