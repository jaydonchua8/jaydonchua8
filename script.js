/* ========= Helpers ========= */
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

/* ========= Reveal-on-appear (scroll) ========= */
const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if (e.isIntersecting) e.target.classList.add('in');
  });
},{ threshold: 0.12 });

function primeReveals(scope=document){
  $$('.reveal', scope).forEach((el,i)=>{
    // stagger a bit on mount
    el.style.transitionDelay = `${Math.min(i*60, 400)}ms`;
    observer.observe(el);
  });
}
primeReveals(document);

/* ========= Bottom dock: tabbed views ========= */
const views = {
  about: $('#view-about'),
  skills: $('#view-skills'),
  projects: $('#view-projects'),
  contact: $('#view-contact'),
};
const dockButtons = $$('.dock-btn');

function showView(key){
  // deactivate buttons
  dockButtons.forEach(b=>{
    const active = b.dataset.target === key;
    b.classList.toggle('is-active', active);
    b.setAttribute('aria-selected', String(active));
  });

  // hide/show sections
  Object.entries(views).forEach(([k,sec])=>{
    const active = k === key;
    if (active) {
      sec.hidden = false;
      sec.classList.add('is-active');
      // ensure fresh reveal animations inside this view
      $$('.reveal', sec).forEach(el=>{ el.classList.remove('in'); });
      // slight timeout so CSS transitions can run
      requestAnimationFrame(()=>{ primeReveals(sec); });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.replaceState(null, '', `#${key}`);
    } else {
      sec.hidden = true;
      sec.classList.remove('is-active');
    }
  });
}

dockButtons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const key = btn.dataset.target;
    showView(key);
  });
});

// allow #hash deep links (#skills, #projects, #contact)
const initial = (location.hash || '#about').replace('#','');
if (views[initial]) showView(initial);

/* ========= Skills filter (on Skills view) ========= */
const filters = $$('.filter', views.skills);
function applyFilter(tag){
  filters.forEach(f=>f.classList.toggle('is-active', f.dataset.filter === tag));
  $$('.skill', views.skills).forEach(tile=>{
    const show = tag === 'all' || (tile.dataset.tags||'').includes(tag);
    tile.style.display = show ? '' : 'none';
  });
}
filters.forEach(f=>f.addEventListener('click', ()=>applyFilter(f.dataset.filter)));
applyFilter('all');
