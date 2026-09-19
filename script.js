const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');

menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const brandImages = {
  pepsico: 'https://www.pngall.com/wp-content/uploads/15/Pepsico-Logo-PNG-Image-HD.png',
  caterpillar: 'https://www.pngmart.com/files/23/Caterpillar-Logo-PNG-Transparent.png',
  innovateher: 'https://www.rcac.purdue.edu/files/anvil/Anvil-Stories/InnovateHer-Article/65d569ff2e89b807995b0ce4_Innovate.png',
  'scope-consulting': 'assets/scope-consulting.png',
  svaasthy: 'assets/svaasthy.png',
  rasta: 'assets/ramya-github-profile.jpg',
  personalization: 'assets/ramya-github-profile.jpg',
  'recommendation-engine': 'assets/ramya-github-profile.jpg'
};

const brandDomains = {
  tjc: 'tjclp.com',
  'young-innovations': 'younginnovations.com',
  openturf: 'openturf.in',
  fnl: 'frederick.cancer.gov'
};

function brand(item) {
  const source = brandImages[item.id] || (brandDomains[item.id]
    ? `https://www.google.com/s2/favicons?domain=${brandDomains[item.id]}&sz=128`
    : null);
  return source
    ? `<img class="brand-logo ${item.group === 'project' ? 'project-mark' : ''}" src="${source}" alt="${item.title} logo" loading="lazy">`
    : `<span class="brand-fallback">${item.title.charAt(0)}</span>`;
}

function card(item) {
  const links = item.links?.length
    ? `<div class="inline-links">${item.links.map(([name, url]) => `<a href="${url}" target="_blank" rel="noreferrer" onclick="event.stopPropagation()">${name} ↗</a>`).join('')}</div>`
    : '';
  return `<article class="portfolio-card" tabindex="0" role="link" data-href="detail.html?id=${item.id}"><div class="card-brand">${brand(item)}<div class="card-kicker">${item.label}</div></div><h3>${item.title}</h3><p class="card-role">${item.role}</p><p>${item.overview}</p><div class="skill-list">${item.skills.slice(0, 5).map((skill) => `<span>${skill}</span>`).join('')}</div>${links}<a class="read-more" href="detail.html?id=${item.id}">View case study <span>→</span></a></article>`;
}

[['internship', 'internship-cards'], ['research', 'research-cards'], ['project', 'project-cards'], ['leadership', 'leadership-cards']]
  .forEach(([group, id]) => {
    document.getElementById(id).innerHTML = portfolioItems.filter((item) => item.group === group).map(card).join('');
  });

document.querySelectorAll('.portfolio-card').forEach((element) => {
  const go = () => { location.href = element.dataset.href; };
  element.addEventListener('click', (event) => {
    if (!event.target.closest('a')) go();
  });
  element.addEventListener('keydown', (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && !event.target.closest('a')) {
      event.preventDefault();
      go();
    }
  });
});

function awardVisual(award) {
  if (award.secondaryImage) {
    return `<div class="award-collage"><a href="${award.imageLink || award.image}" target="_blank" rel="noreferrer" aria-label="Open the award post for ${award.title}"><img src="${award.image}" alt="${award.imageAlt}" loading="lazy"><span class="award-image-label">Award post ↗</span></a><a href="${award.secondaryImage}" target="_blank" rel="noreferrer" aria-label="Open the official award letter for ${award.title}"><img src="${award.secondaryImage}" alt="${award.secondaryImageAlt}" loading="lazy"><span class="award-image-label">Official letter ↗</span></a><span class="award-tape" aria-hidden="true"></span></div>`;
  }
  if (award.image) {
    return `<a class="award-photo ${award.imageFit === 'contain' ? 'award-photo-contain' : ''}" href="${award.image}" target="_blank" rel="noreferrer" aria-label="Open the full-size image for ${award.title}"><img src="${award.image}" alt="${award.imageAlt}" loading="lazy"><span class="award-tape" aria-hidden="true"></span><span class="award-expand">View full image ↗</span></a>`;
  }
  return `<div class="award-art" role="img" aria-label="${award.title}, ${award.artNote}"><span>${award.art}</span><strong>${award.artNote}</strong><i aria-hidden="true">✦</i></div>`;
}

const awardTrack = document.getElementById('award-cards');
const awardViewport = document.getElementById('award-viewport');
const awardDots = document.getElementById('award-dots');
const awardCurrent = document.getElementById('award-current');
const awardTotal = document.getElementById('award-total');
const awardPrevious = document.getElementById('award-prev');
const awardNext = document.getElementById('award-next');

awardTrack.innerHTML = awards.map((award, index) => `<article class="award-card" role="group" aria-roledescription="slide" aria-label="${index + 1} of ${awards.length}: ${award.title}">${awardVisual(award)}<div class="award-copy"><div class="award-topline"><span class="award-index">${String(index + 1).padStart(2, '0')}</span><span class="award-recognition">${award.recognition}</span></div><h3>${award.title}</h3><p class="award-meta">${award.meta}</p><p class="award-note">${award.note}</p>${award.links?.length ? `<div class="award-links">${award.links.map(([label, url]) => `<a class="award-link" href="${url}" target="_blank" rel="noreferrer" aria-label="${label} for ${award.title} (opens in a new tab)">${label} <span aria-hidden="true">↗</span></a>`).join('')}</div>` : ''}</div></article>`).join('');

awardDots.innerHTML = awards.map((award, index) => `<button type="button" data-award-index="${index}" aria-label="Show ${award.title}"><span></span></button>`).join('');
awardTotal.textContent = awards.length;

const awardSlides = [...awardTrack.children];
const awardDotButtons = [...awardDots.querySelectorAll('button')];
let currentAward = 0;
let swipeStart = null;

function showAward(nextIndex) {
  currentAward = (nextIndex + awards.length) % awards.length;
  awardTrack.style.transform = `translateX(-${currentAward * 100}%)`;
  awardCurrent.textContent = currentAward + 1;
  awardSlides.forEach((slide, index) => {
    const hidden = index !== currentAward;
    slide.setAttribute('aria-hidden', String(hidden));
    slide.toggleAttribute('inert', hidden);
  });
  awardDotButtons.forEach((dot, index) => {
    if (index === currentAward) dot.setAttribute('aria-current', 'true');
    else dot.removeAttribute('aria-current');
  });
}

awardPrevious.addEventListener('click', () => showAward(currentAward - 1));
awardNext.addEventListener('click', () => showAward(currentAward + 1));
awardDotButtons.forEach((dot) => dot.addEventListener('click', () => showAward(Number(dot.dataset.awardIndex))));

awardViewport.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    showAward(currentAward - 1);
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    showAward(currentAward + 1);
  }
});

awardViewport.addEventListener('pointerdown', (event) => {
  swipeStart = event.clientX;
});

awardViewport.addEventListener('pointerup', (event) => {
  if (swipeStart === null) return;
  const distance = event.clientX - swipeStart;
  swipeStart = null;
  if (Math.abs(distance) < 45) return;
  showAward(currentAward + (distance < 0 ? 1 : -1));
});

awardViewport.addEventListener('pointercancel', () => { swipeStart = null; });
showAward(0);

const board = document.getElementById('course-board-home');
const courseButton = document.getElementById('open-courses');
let coursesOpen = false;

function renderCourses() {
  const shown = coursesOpen ? coursework : coursework.slice(0, 6);
  board.innerHTML = shown.map((course, index) => `<span style="--r:${[-2, 1, -1, 2][index % 4]}deg">${course}</span>`).join('');
  courseButton.textContent = coursesOpen ? 'Show fewer courses' : `Show ${coursework.length - 6} more courses`;
  courseButton.setAttribute('aria-expanded', String(coursesOpen));
}

courseButton.onclick = () => {
  coursesOpen = !coursesOpen;
  renderCourses();
};

renderCourses();
document.getElementById('year').textContent = new Date().getFullYear();
