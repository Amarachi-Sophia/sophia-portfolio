/* A regular local script makes the same content available on file:// and HTTPS. */
const Portfolio = {
  data: null,
  escape(value = '') {
    return String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  },
  asset(value = '') {
    const path = String(value).trim();
    return /^(assets\/|https:\/\/)/.test(path) ? path : '';
  },
  icon(name) { return `<svg class="icon" aria-hidden="true"><use href="#icon-${name}"/></svg>`; }
};

function renderContent(data) {
  const {escape: text, asset, icon} = Portfolio;
  const profile = data.profile;
  document.querySelector('#experience-years').textContent = profile.yearsExperience;
  document.querySelector('#project-total').textContent = String(data.projects.length).padStart(2, '0');
  document.querySelector('.intro-copy').textContent = profile.intro;
  document.querySelector('.about .reveal p').textContent = profile.about;
  document.querySelectorAll('.profile-logo').forEach(logo => {
    logo.innerHTML = `${text(profile.firstName)}<span class="logo-dot">.</span>`;
  });
  document.querySelector('.intro h1').innerHTML = `Hi, I'm <em>${text(profile.firstName)}</em>,<br>a ${text(profile.role)}.`;
  document.querySelector('.profile-top p').innerHTML = `${text(profile.role)}<br>& BI Enthusiast`;
  document.querySelector('.profile-line').textContent = profile.tagline;
  document.querySelectorAll('.profile-photo img, .mobile-portrait img').forEach(image => {
    image.src = asset(profile.portrait); image.alt = profile.name;
  });
  document.querySelector('.profile-email a').textContent = profile.email;
  document.querySelectorAll('a[href^="mailto:"]').forEach(link => { link.href = `mailto:${profile.email}`; });
  document.querySelector('.contact-email').innerHTML = `${text(profile.email)} ${icon('arrow')}`;
  document.querySelector('footer > span').innerHTML = `© <span id="year">${new Date().getFullYear()}</span> ${text(profile.name)}`;
  document.title = `${profile.name} — ${profile.role}`;
  document.querySelector('meta[name="description"]').content = `${profile.name}. ${profile.intro}`;
  document.querySelector('.socials').innerHTML = `<a class="social-icon" href="mailto:${text(profile.email)}" aria-label="Email ${text(profile.firstName)}">${icon('mail')}</a>` + ['linkedin','github'].map(network => {
    const url = /^https:\/\//.test(profile[network]) ? profile[network] : '';
    return url ? `<a class="social-icon" href="${text(url)}" target="_blank" rel="noopener" aria-label="${network}">${icon(network)}</a>` : `<span class="social-icon social-pending" title="${network} URL to be added">${icon(network)}</span>`;
  }).join('');
  document.querySelector('.timeline').innerHTML = '<span class="timeline-fill" aria-hidden="true"></span>' + data.experience.map(entry => `<article class="timeline-item"><div class="timeline-copy reveal"><p class="timeline-date">${text(entry.date)}</p><h3>${text(entry.title)}</h3><p class="timeline-place">${text(entry.place)}</p>${entry.description ? `<p class="timeline-detail">${text(entry.description)}</p>` : ''}</div></article>`).join('');
  document.querySelector('.projects-list').innerHTML = data.projects.map((project, index) => `<article class="project reveal"><a class="project-image" href="#project/${encodeURIComponent(project.id)}" data-project="${text(project.id)}" aria-label="View ${text(project.title)}"><img src="${text(asset(project.screenshots[0]?.src))}" alt="${text(project.screenshots[0]?.alt || project.title)}" loading="lazy"><span class="project-arrow">${icon('arrow')}</span></a><div class="project-bottom"><div><p class="project-category">${text(project.category)}</p><h3><a href="#project/${encodeURIComponent(project.id)}" data-project="${text(project.id)}">${text(project.title)}</a></h3><p>${text(project.summary)}</p><a class="project-details-link" href="#project/${encodeURIComponent(project.id)}" data-project="${text(project.id)}">Explore project ${icon('arrow')}</a></div><span class="project-count">${String(index + 1).padStart(2,'0')} / ${String(data.projects.length).padStart(2,'0')}</span></div></article>`).join('');
  document.querySelector('.certificate-list').innerHTML = data.certificates.map(certificate => `<a class="certificate reveal" href="${text(asset(certificate.image))}" data-certificate="${text(asset(certificate.image))}"><span class="certificate-year">${text(certificate.year)}</span><span><strong>${text(certificate.title)}</strong><small>${text(certificate.issuer)}</small></span>${icon('arrow')}</a>`).join('');
  document.dispatchEvent(new Event('content:ready'));
}

Portfolio.ready = Promise.resolve().then(() => {
  const data = window.PORTFOLIO_CONTENT;
  if (!data?.profile || !Array.isArray(data.projects)) {
    throw new Error('The portfolio content file did not load.');
  }
  Portfolio.data = data;
  renderContent(data);
  return data;
}).catch(error => {
  console.error('Portfolio content unavailable.', error);
  const warning = document.createElement('p');
  warning.className = 'content-warning';
  warning.setAttribute('role', 'alert');
  warning.textContent = 'Project details could not load. Keep content.js beside index.html and reload the page.';
  document.querySelector('main').prepend(warning);
  Portfolio.data = {projects: []};
  document.dispatchEvent(new Event('content:ready'));
  return Portfolio.data;
});
