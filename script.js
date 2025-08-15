// ===== Mobile nav =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const shown = navMenu.classList.toggle('show');
    navToggle.setAttribute('aria-expanded', String(shown));
  });
}

// ===== Theme toggle (persist) =====
const themeToggle = document.getElementById('themeToggle');
const storedTheme = localStorage.getItem('theme');
if (storedTheme === 'dark') document.documentElement.classList.add('dark');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  });
}

// ===== Reveal on scroll =====
const revealTargets = document.querySelectorAll('.observe');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
},{ threshold: 0.15 });
revealTargets.forEach(el => io.observe(el));

// ===== Skills filter =====
const chips = document.querySelectorAll('.chip');
const skills = document.querySelectorAll('.skill');
function setFilter(tag){
  chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.filter === tag)));
  skills.forEach(s => {
    if (tag === 'all' || (s.dataset.tags || '').includes(tag)) s.style.display = '';
    else s.style.display = 'none';
  });
}
chips.forEach(c => c.addEventListener('click', () => setFilter(c.dataset.filter)));
setFilter('all');

// ===== Smooth hash focus =====
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth'}); target.setAttribute('tabindex','-1'); target.focus({preventScroll:true}); }
  });
});

// ===== Dynamic year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Scroll progress + compact header + scroll-spy =====
const scrollbar = document.getElementById('scrollbar');
const header = document.getElementById('header');
const navlinks = Array.from(document.querySelectorAll('.navlink'));
const sections = navlinks
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

function onScroll() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollbar.style.width = progress + '%';

  // Compact header
  header.classList.toggle('compact', scrollTop > 10);

  // Scroll spy
  let current = null;
  for (const sec of sections) {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom >= 200) { current = sec; break; }
  }
  navlinks.forEach(a => a.classList.toggle('active', current && a.getAttribute('href') === '#' + current.id));
}
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===== Parallax orbs (GPU friendly, rAF) =====
const parallaxEls = document.querySelectorAll('[data-parallax]');
let ticking = false;
function parallaxUpdate() {
  const y = window.scrollY || 0;
  parallaxEls.forEach(el => {
    const speed = parseFloat(el.dataset.speed || '0.1');
    el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
  });
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(parallaxUpdate);
    ticking = true;
  }
},{ passive: true });
parallaxUpdate();

// ===== Subtle 3D tilt on hover (cards/skills/hero) =====
const tilts = document.querySelectorAll('.tilt');
tilts.forEach(el => {
  let rect;
  function updateRect(){ rect = el.getBoundingClientRect(); }
  updateRect();
  window.addEventListener('resize', updateRect);

  el.addEventListener('mousemove', (e) => {
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * 6;       // max 6deg
    const rotateY = (x - 0.5) * 6;
    el.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

// ===== Optional: reduce work on low-power devices =====
if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  tilts.forEach(el => el.onmousemove = el.onmouseleave = null);
}
