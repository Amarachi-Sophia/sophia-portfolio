/* One native dialog for case studies, image galleries and certificates. */
const viewer = document.querySelector('#project-viewer');
const viewerContent = document.querySelector('#viewer-content');
let activeProject = null;
let slides = [];
let slideIndex = 0;
let returnFocus = null;
let returnHash = '';
let zoomed = false;

function openViewer() {
  if (viewer.open) return;
  returnFocus = document.activeElement;
  document.body.classList.add('viewer-open');
  viewer.showModal();
  viewer.scrollTop = 0;
}
function galleryMarkup() {
  const {escape:text, icon} = Portfolio;
  return `<figure class="viewer-gallery"><button class="gallery-image" type="button" aria-label="Enlarge screenshot"><img id="gallery-image" alt=""></button><figcaption><span id="gallery-caption"></span><span id="gallery-count" aria-live="polite"></span></figcaption><div class="gallery-controls" ${slides.length < 2 ? 'hidden' : ''}><button type="button" class="icon-button gallery-prev" aria-label="Previous screenshot">${icon('left')}</button><div class="gallery-dots">${slides.map((slide,index) => `<button type="button" data-slide="${index}" aria-label="Show screenshot ${index+1}" title="${text(slide.caption || slide.alt)}"></button>`).join('')}</div><button type="button" class="icon-button gallery-next" aria-label="Next screenshot">${icon('right')}</button></div><button class="gallery-back" type="button">${icon('minimize')} Back to project</button><span class="gallery-hint">Tap or click the image to enlarge</span></figure>`;
}
function updateSlide(nextIndex) {
  slideIndex = (nextIndex + slides.length) % slides.length;
  const slide = slides[slideIndex];
  const image = viewerContent.querySelector('#gallery-image');
  image.src = Portfolio.asset(slide.src);
  image.alt = slide.alt || activeProject?.title || 'Certificate';
  viewerContent.querySelector('#gallery-caption').textContent = slide.caption || image.alt;
  viewerContent.querySelector('#gallery-count').textContent = `${slideIndex + 1} / ${slides.length}`;
  viewerContent.querySelectorAll('[data-slide]').forEach((button,index) => {
    button.classList.toggle('active', index === slideIndex);
    button.setAttribute('aria-pressed', String(index === slideIndex));
  });
}
function setZoom(value) {
  zoomed = value;
  viewer.classList.toggle('image-mode', value);
  const imageButton = viewerContent.querySelector('.gallery-image');
  imageButton.setAttribute('aria-label', value ? 'Return to project details' : 'Enlarge screenshot');
  viewer.scrollTop = 0;
  if (!value) imageButton.focus();
}
function showProject(project) {
  activeProject = project;
  slides = project.screenshots || [];
  const {escape:text, icon} = Portfolio;
  viewer.classList.remove('certificate-mode', 'image-mode'); zoomed = false;
  viewer.querySelector('.viewer-header > span').textContent = 'PROJECT / DETAILS';
  const metrics = project.metrics || [];
  const findings = [...new Set(project.findings || [])];
  viewerContent.innerHTML = `<div class="viewer-intro"><p class="project-category">${text(project.category)}</p><h2 id="viewer-title">${text(project.title)}</h2><p>${text(project.summary)}</p></div>${slides.length ? galleryMarkup() : ''}<div class="case-study">${metrics.length ? `<section><h3>${icon('chart')} Major KPIs</h3><dl class="metric-grid">${metrics.map(metric => `<div><dt>${text(metric.label)}</dt><dd>${text(metric.value)}</dd>${metric.detail ? `<p>${text(metric.detail)}</p>` : ''}</div>`).join('')}</dl></section>` : ''}${findings.length ? `<section><h3>${icon('insight')} Key findings</h3><ol class="findings">${findings.map(finding => `<li>${text(finding)}</li>`).join('')}</ol></section>` : ''}${(project.sections || []).map(section => `<section><h3>${icon('file')} ${text(section.title)}</h3><p class="case-text">${text(section.text)}</p></section>`).join('')}${project.tests?.length ? `<section><h3>${icon('check')} Tests & validation</h3>${project.tests.map(test => `<div class="validation-item"><h4>${text(test.title)}</h4><p class="case-text">${text(test.text)}</p></div>`).join('')}</section>` : ''}</div>`;
  openViewer();
  if (slides.length) updateSlide(0);
}
async function syncProjectHash() {
  await Portfolio.ready;
  const prefix = '#project/';
  if (!location.hash.startsWith(prefix)) {
    if (viewer.open && activeProject) viewer.close();
    return;
  }
  let id;
  try { id = decodeURIComponent(location.hash.slice(prefix.length)); } catch { return; }
  const project = Portfolio.data.projects.find(item => item.id === id);
  if (project) showProject(project);
}
function closeViewer() {
  if (activeProject && location.hash.startsWith('#project/')) {
    history.replaceState(null, '', location.pathname + location.search + (returnHash || '#projects'));
  }
  document.body.classList.remove('viewer-open');
  viewer.close();
}
viewer.addEventListener('close', () => {
  document.body.classList.remove('viewer-open');
  viewer.classList.remove('image-mode', 'certificate-mode');
  zoomed = false; activeProject = null;
  if (returnFocus?.isConnected && !document.body.classList.contains('menu-open')) returnFocus.focus({preventScroll:true});
});
viewer.addEventListener('cancel', event => {
  event.preventDefault();
  if (zoomed && activeProject) setZoom(false); else closeViewer();
});
viewer.querySelector('.viewer-close').addEventListener('click', closeViewer);
viewer.addEventListener('click', event => {
  if (event.target === viewer) {
    const rect = viewer.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeViewer();
  }
  if (event.target.closest('.gallery-next')) updateSlide(slideIndex + 1);
  if (event.target.closest('.gallery-prev')) updateSlide(slideIndex - 1);
  const dot = event.target.closest('[data-slide]');
  if (dot) updateSlide(Number(dot.dataset.slide));
  if (event.target.closest('.gallery-image') && activeProject) setZoom(!zoomed);
  if (event.target.closest('.gallery-back')) setZoom(false);
});
viewer.addEventListener('keydown', event => {
  if (!slides.length) return;
  if (event.key === 'ArrowRight') { event.preventDefault(); updateSlide(slideIndex + 1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); updateSlide(slideIndex - 1); }
});
let touchStart = null;
viewer.addEventListener('touchstart', event => {
  if (event.target.closest('.gallery-image')) touchStart = [event.touches[0].clientX, event.touches[0].clientY];
}, {passive:true});
viewer.addEventListener('touchend', event => {
  if (!touchStart) return;
  const dx = event.changedTouches[0].clientX - touchStart[0];
  const dy = event.changedTouches[0].clientY - touchStart[1];
  touchStart = null;
  if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5 && slides.length > 1) updateSlide(slideIndex + (dx < 0 ? 1 : -1));
}, {passive:true});
document.addEventListener('click', async event => {
  const projectLink = event.target.closest('[data-project]');
  if (projectLink && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
    event.preventDefault(); returnHash = location.hash.startsWith('#project/') ? '#projects' : location.hash;
    if (location.hash === projectLink.getAttribute('href')) syncProjectHash();
    else location.hash = projectLink.getAttribute('href');
  }
  const certificateLink = event.target.closest('[data-certificate]');
  if (certificateLink) {
    event.preventDefault(); await Portfolio.ready;
    activeProject = null; slides = [{src:certificateLink.dataset.certificate, alt:certificateLink.querySelector('strong')?.textContent || 'Certificate', caption:''}];
    viewer.classList.add('certificate-mode');
    viewer.querySelector('.viewer-header > span').textContent = 'CERTIFICATE / VIEW';
    viewerContent.innerHTML = `<h2 class="sr-only" id="viewer-title">${Portfolio.escape(slides[0].alt)}</h2>${galleryMarkup()}`;
    openViewer(); updateSlide(0);
  }
});
window.addEventListener('hashchange', syncProjectHash);
syncProjectHash();
