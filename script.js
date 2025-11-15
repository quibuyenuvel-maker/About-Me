/* Enhanced interactions: particles, parallax portrait, carousel, modal, menu toggle, fade-in, skill bars */

document.addEventListener('DOMContentLoaded', () => {
  // set year fields
  document.querySelectorAll('[id^="year"]').forEach(el => el.textContent = new Date().getFullYear());

  /* 1) Hamburger toggle (works across pages with different ids) */
  Array.from(document.querySelectorAll('[id^="menu-toggle"]')).forEach(btn => {
    const navId = btn.getAttribute('aria-controls') || 'primary-nav';
    const nav = document.getElementById(navId) || document.querySelector('.nav-centered');
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      btn.classList.toggle('active');
      if (nav) nav.classList.toggle('open');
    });
  });

  // Also enable main #menu-toggle if present
  const mainToggle = document.getElementById('menu-toggle');
  if(mainToggle) {
    const nav = document.getElementById('primary-nav');
    mainToggle.addEventListener('click', () => {
      const expanded = mainToggle.getAttribute('aria-expanded') === 'true';
      mainToggle.setAttribute('aria-expanded', String(!expanded));
      mainToggle.classList.toggle('active');
      nav.classList.toggle('open');
    });
  }

  /* 2) IntersectionObserver reveal */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, {threshold: 0.12});
  document.querySelectorAll('.content-appear').forEach(el => io.observe(el));

  /* 3) animate progress bars */
  document.querySelectorAll('.progress').forEach(p => {
    const v = parseInt(p.getAttribute('data-progress') || '0', 10);
    setTimeout(() => {
      const bar = p.querySelector('.progress-bar');
      if (bar) bar.style.width = v + '%';
    }, 300);
  });

  /* 4) Carousel simple scroll + prev/next */
  (function setupCarousel(){
    const track = document.querySelector('.car-track');
    if(!track) return;
    const prev = document.querySelector('.car-prev');
    const next = document.querySelector('.car-next');
    const itemWidth = () => track.querySelector('.car-item').getBoundingClientRect().width + 18;
    prev?.addEventListener('click', ()=> track.scrollBy({left: -itemWidth(), behavior:'smooth'}));
    next?.addEventListener('click', ()=> track.scrollBy({left: itemWidth(), behavior:'smooth'}));
    // allow swipe on mobile
    let startX = 0, isDown=false;
    track.addEventListener('pointerdown', (e) => { startX = e.clientX; isDown = true; track.style.scrollBehavior = 'auto' });
    track.addEventListener('pointermove', (e) => { if (!isDown) return; track.scrollLeft += (startX - e.clientX); startX = e.clientX; });
    track.addEventListener('pointerup', ()=> { isDown=false; track.style.scrollBehavior = 'smooth' });
    track.addEventListener('pointerleave', ()=> { isDown=false; track.style.scrollBehavior = 'smooth' });
  })();

  /* 5) Modal openers */
  document.querySelectorAll('.open-modal').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const modal = document.getElementById('modal');
      modal.querySelector('#modalTitle').textContent = btn.dataset.title || 'Details';
      modal.querySelector('#modalDesc').textContent = btn.dataset.desc || '';
      modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
    });
  });
  document.querySelectorAll('.modal-close, .modal').forEach(el=>{
    el.addEventListener('click', (ev)=>{
      // close when clicking close or backdrop
      const modal = document.getElementById('modal');
      if (!modal) return;
      if (ev.target === el || el.classList.contains('modal-close')) {
        modal.classList.remove('open'); modal.setAttribute('aria-hidden','true');
      }
    });
  });

  /* 6) close mobile nav on link click */
  document.querySelectorAll('.nav-centered a').forEach(a=>{
    a.addEventListener('click', ()=>{
      const nav = document.querySelector('.nav-centered');
      nav.classList.remove('open');
      document.querySelectorAll('.hamburger').forEach(h => h.classList.remove('active'));
    });
  });

  /* 7) portrait parallax on mouse move */
  (function portraitParallax(){
    const wrap = document.getElementById('portraitWrap');
    const img = document.getElementById('portraitImg');
    if(!wrap || !img) return;
    wrap.addEventListener('mousemove', (e)=>{
      const r = wrap.getBoundingClientRect();
      const rx = (e.clientX - r.left) / r.width - 0.5;
      const ry = (e.clientY - r.top) / r.height - 0.5;
      img.style.transform = `translate3d(${rx * 8}px, ${ry * 8}px, 0) rotate(${rx * 3}deg)`;
      const glow = wrap.querySelector('.portrait-glow');
      if (glow) glow.style.transform = `translate3d(${rx * -12}px, ${ry * -12}px,0)`;
    });
    wrap.addEventListener('mouseleave', ()=> {
      img.style.transform = '';
      const glow = wrap.querySelector('.portrait-glow'); if (glow) glow.style.transform = '';
    });
  })();

  /* 8) particles (lightweight) */
  (function particles(){
    const canvas = document.getElementById('particles');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let w=canvas.width=innerWidth, h=canvas.height=innerHeight;
    window.addEventListener('resize', ()=> { w=canvas.width=innerWidth; h=canvas.height=innerHeight; init(); });

    const parts = [];
    const count = Math.max(18, Math.floor((w*h)/80000));
    function init(){
      parts.length = 0;
      for(let i=0;i<count;i++){
        parts.push({
          x: Math.random()*w, y: Math.random()*h,
          vx: (Math.random()-0.5)*0.25, vy: (Math.random()-0.5)*0.25,
          r: 1 + Math.random()*2, alpha: 0.06 + Math.random()*0.12
        });
      }
    }
    function step(){
      ctx.clearRect(0,0,w,h);
      for(const p of parts){
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = w+10;
        if (p.x > w+10) p.x = -10;
        if (p.y < -10) p.y = h+10;
        if (p.y > h+10) p.y = -10;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fill();
      }
      requestAnimationFrame(step);
    }
    init(); step();
  })();

  /* 9) close modal on ESC */
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){
      const modal = document.getElementById('modal');
      if(modal && modal.classList.contains('open')){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }
      document.querySelectorAll('.nav-centered.open').forEach(n=>n.classList.remove('open'));
      document.querySelectorAll('.hamburger.active').forEach(h=>h.classList.remove('active'));
    }
  });
});
