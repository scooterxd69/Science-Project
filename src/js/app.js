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
