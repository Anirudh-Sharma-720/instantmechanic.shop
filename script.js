// Mobile menu
const burger = document.querySelector('.burger');
const menu = document.getElementById('menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
menu.addEventListener('click', e => { if (e.target.matches('a')) menu.classList.remove('open'); });

// Service tabs
const services = {
  battery: { t: 'Battery jump-start', steps: ['Describe the symptoms', 'Mechanic arrives with a portable booster', 'Battery tested on site', 'Replacement offered if needed'], m: 'Usually 15 to 30 minutes' },
  tyre:    { t: 'Flat tyre change', steps: ['Share your location', 'Mechanic brings tools and a jack', 'Spare fitted or puncture repaired', 'Pressure checked before you go'], m: 'Usually 20 to 40 minutes' },
  tow:     { t: 'Towing', steps: ['Tell us where the car is and where it needs to go', 'Flatbed dispatched', 'Car secured and tracked', 'Dropped at your garage or ours'], m: 'Price quoted before pickup' },
  fuel:    { t: 'Fuel delivery', steps: ['Choose petrol or diesel', 'Confirm litres needed', 'Fuel delivered to your spot', 'Pay after delivery'], m: 'Usually 20 to 30 minutes' },
  key:     { t: 'Key lockout', steps: ['Confirm you own the car', 'Technician dispatched', 'Door opened without damage', 'Spare key help available'], m: 'ID check required' }
};
const panel = document.getElementById('tab-panel');
function showTab(k) {
  const s = services[k];
  panel.innerHTML = `<div><h3>${s.t}</h3><p class="meta">${s.m}</p></div><ol>${s.steps.map(x => `<li>${x}</li>`).join('')}</ol>`;
}
document.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.tabs button').forEach(x => x.setAttribute('aria-selected', x === b));
  showTab(b.dataset.tab);
}));
showTab('battery');

// Diagnosis demo (canned, no backend)
const demos = [
  { k: ['brake', 'grind', 'squeal'], c: 'bad', h: 'Don\u2019t drive', l: ['Worn brake pads', 'Scored discs'], p: '\u20B91,500 to \u20B98,000' },
  { k: ['battery', 'start', 'click'], c: 'warn', h: 'Drive with caution', l: ['Weak battery', 'Loose terminal', 'Faulty alternator'], p: '\u20B9500 to \u20B96,000' },
  { k: ['ac', 'cool', 'air'], c: 'ok', h: 'Safe to drive', l: ['Low refrigerant', 'Dirty cabin filter'], p: '\u20B9800 to \u20B93,500' }
];
document.getElementById('diag-form').addEventListener('submit', e => {
  e.preventDefault();
  const q = document.getElementById('symptom').value.toLowerCase();
  const out = document.getElementById('diag-result');
  if (!q.trim()) { out.hidden = false; out.className = 'result'; out.innerHTML = 'Describe the problem first.'; return; }
  const d = demos.find(x => x.k.some(w => q.includes(w))) ||
    { c: 'warn', h: 'Needs a closer look', l: ['Not enough detail for a guess'], p: 'Book an inspection' };
  out.hidden = false;
  out.className = 'result ' + d.c;
  out.innerHTML = `<h4>${d.h}</h4><ul>${d.l.map(x => `<li>${x}</li>`).join('')}</ul><b>Estimated cost:</b> ${d.p}`;
});

// Count-up stats (runs once)
const io = new IntersectionObserver(es => es.forEach(en => {
  if (!en.isIntersecting) return;
  en.target.querySelectorAll('[data-count]').forEach(el => {
    const end = +el.dataset.count, dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || '';
    const t0 = performance.now();
    (function tick(t) {
      const p = Math.min((t - t0) / 1200, 1);
      el.textContent = (end * p).toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  });
  io.unobserve(en.target);
}), { threshold: .4 });
io.observe(document.querySelector('.stats'));
