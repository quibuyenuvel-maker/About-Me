// Menu toggle + accessible behaviour
document.addEventListener('DOMContentLoaded', () => {
  // year fillers (for all pages)
  Array.from(document.querySelectorAll('[id^="year"]')).forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Hamburger toggles (support multiple pages using ids)
  const toggles = document.querySelectorAll('[id^="menu-toggle"]');
  toggles.forEach(btn => {
    const navId = btn.getAttribute('aria-controls');
    const nav = document.getElementById(navId) || document.querySelector('.nav-centered');
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if (nav) nav.classList.toggle('open');
      btn.classList.toggle('is-open');
    });
  });

  // Make hamburger animate (visual)
  document.querySelectorAll('.hamburger').forEach(h => {
    h.addEventListener('click', () => h.classList.toggle('active'));
  });

  // IntersectionObserver for fade-in
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, {threshold: 0.12});

  document.querySelectorAll('.content-appear').forEach(el => io.observe(el));

  // Animate skill bars (if present)
  document.querySelectorAll('.progress').forEach(p => {
    const v = parseInt(p.getAttribute('data-progress') || '0', 10);
    setTimeout(() => {
      const bar = p.querySelector('.progress-bar');
      if (bar) bar.style.width = v + '%';
    }, 220);
  });

  // Close mobile nav when clicking a nav link
  document.querySelectorAll('.nav-centered a').forEach(a => {
    a.addEventListener('click', () => {
      const nav = document.querySelector('.nav-centered');
      if (nav && nav.classList.contains('open')) nav.classList.remove('open');
      document.querySelectorAll('.hamburger').forEach(h => h.setAttribute('aria-expanded','false'));
    });
  });
});
