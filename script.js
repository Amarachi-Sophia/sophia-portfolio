document.documentElement.classList.add('js');
const menuButton = document.querySelector('.menu-button');
const menuPanel = document.querySelector('.menu-panel');
const menuLinks = [...menuPanel.querySelectorAll('a')];
const railLinks = [...document.querySelectorAll('.rail-link')];
const sections = railLinks.map(link => document.querySelector(link.getAttribute('href')));
const menuBackground = [...document.querySelectorAll('.profile, .mobile-header, .icon-rail, main')];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
document.querySelector('#year').textContent = new Date().getFullYear();

function closeMenu(restoreFocus = false) {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  menuPanel.classList.remove('open'); menuPanel.inert = true;
  document.body.classList.remove('menu-open');
  menuBackground.forEach(element => { element.inert = false; });
  if (restoreFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  if (menuPanel.classList.contains('open')) { closeMenu(true); return; }
  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.setAttribute('aria-label', 'Close menu');
  menuPanel.inert = false; menuPanel.classList.add('open');
  document.body.classList.add('menu-open');
  menuBackground.forEach(element => { element.inert = true; });
  menuLinks[0].focus();
});
menuLinks.forEach(link => link.addEventListener('click', () => {
  closeMenu();
  const target = document.querySelector(link.hash);
  target.setAttribute('tabindex','-1'); target.focus({preventScroll:true});
}));
document.addEventListener('keydown', event => {
  if (!menuPanel.classList.contains('open')) return;
  if (event.key === 'Escape') closeMenu(true);
  if (event.key !== 'Tab') return;
  const focusable = [menuButton, ...menuLinks];
  const first = focusable[0], last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});

const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target);
  });
}, {threshold:0.08, rootMargin:'0px 0px -20px 0px'}) : null;
function observeReveals() {
  document.querySelectorAll('.reveal:not(.is-visible)').forEach(item => {
    const siblings = [...item.parentElement.children].filter(child => child.classList.contains('reveal'));
    item.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(item), 2) * 70}ms`);
    if (revealObserver) revealObserver.observe(item); else item.classList.add('is-visible');
  });
}

let framePending = false;
function updateScroll() {
  const readingLine = innerHeight * .4;
  let current = sections[0];
  sections.forEach(section => { if (section.getBoundingClientRect().top <= readingLine) current = section; });
  railLinks.forEach(link => {
    const active = link.hash === '#' + current.id;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
  });
  const timeline = document.querySelector('.timeline');
  const items = [...timeline.querySelectorAll('.timeline-item')];
  const rect = timeline.getBoundingClientRect();
  // Stop at the final dot, rather than filling through the last paragraph.
  const lastDot = items.at(-1)?.offsetTop + 9 || 9;
  const trackHeight = Math.max(1, lastDot - 9);
  timeline.style.setProperty('--track-height', `${trackHeight}px`);
  const progress = Math.max(0, Math.min(1, (innerHeight * .72 - rect.top - 9) / trackHeight));
  timeline.style.setProperty('--timeline-progress', reducedMotion.matches ? 1 : progress);
  items.forEach(item => item.classList.toggle('is-reached', reducedMotion.matches || item.getBoundingClientRect().top + 9 <= innerHeight * .72));
  framePending = false;
}
function queueScrollUpdate() {
  if (framePending) return;
  framePending = true; requestAnimationFrame(updateScroll);
}
window.addEventListener('scroll', queueScrollUpdate, {passive:true});
window.addEventListener('resize', queueScrollUpdate);
reducedMotion.addEventListener('change', queueScrollUpdate);
document.addEventListener('content:ready', () => { observeReveals(); queueScrollUpdate(); });
if ('ResizeObserver' in window) new ResizeObserver(queueScrollUpdate).observe(document.querySelector('main'));
document.fonts?.ready.then(queueScrollUpdate);
observeReveals(); updateScroll();
