/* NRS Besan — Premium JS */

// ---- Progress Bar ----
const progressBar = document.createElement('div');
progressBar.className = 'progress-bar';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = pct + '%';
}, { passive: true });

// ---- Navbar scroll ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ---- Mobile hamburger ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  const s = hamburger.querySelectorAll('span');
  s[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
  s[1].style.opacity   = open ? '0' : '';
  s[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}));

// ---- Scroll top ----
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---- AOS (Animate On Scroll) ----
function runAOS() {
  document.querySelectorAll('[data-aos]').forEach(el => {
    const rect  = el.getBoundingClientRect();
    const delay = parseInt(el.getAttribute('data-aos-delay') || 0);
    if (rect.top < window.innerHeight - 80) {
      setTimeout(() => el.classList.add('aos-animate'), delay);
    }
  });
}
window.addEventListener('scroll', runAOS, { passive: true });
window.addEventListener('resize', runAOS);
setTimeout(runAOS, 100);

// ---- Active nav highlight ----
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 110) cur = s.id; });
  navItems.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + cur) a.classList.add('active');
  });
}, { passive: true });

// ---- Counter animation ----
function animateCount(el, target, suffix = '') {
  let start = 0;
  const duration = 1800;
  const step = 16;
  const increment = target / (duration / step);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start).toLocaleString('en-IN') + suffix;
  }, step);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el     = e.target;
    const target = parseInt(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    animateCount(el, target, suffix);
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(c => counterObs.observe(c));

// ---- WhatsApp form ----
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = document.getElementById('name').value.trim();
    const phone   = document.getElementById('phone').value.trim();
    const city    = document.getElementById('city').value.trim();
    const pack    = document.getElementById('pack').value;
    const message = document.getElementById('message').value.trim();
    const lines = [
      '🙏 Hello NRS Besan! Enquiry from website.',
      `👤 Name: ${name}`,
      `📞 Phone: ${phone}`,
      city    ? `📍 City: ${city}` : '',
      pack    ? `📦 Pack: ${pack}` : '',
      message ? `💬 ${message}` : '',
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/917052111911?text=${encodeURIComponent(lines)}`, '_blank');
  });
}

// ---- Subtle parallax on blobs ----
window.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  document.querySelectorAll('.hero-blob').forEach((b, i) => {
    const depth = (i + 1) * 0.4;
    b.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
  });
});

// ---- Hover tilt on product cards ----
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width / 2;
    const cy   = rect.top  + rect.height / 2;
    const rx   = ((e.clientY - cy) / (rect.height / 2)) * 4;
    const ry   = ((e.clientX - cx) / (rect.width  / 2)) * -4;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-12px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .5s var(--ease)';
  });
});

// ---- Ripple on buttons ----
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const r   = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.cssText = `
      position:absolute; border-radius:50%; pointer-events:none;
      width:${size}px; height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top  - size/2}px;
      background:rgba(255,255,255,.3);
      transform:scale(0); animation:ripple .5s ease-out forwards;
    `;
    btn.appendChild(r);
    setTimeout(() => r.remove(), 600);
  });
});
const style = document.createElement('style');
style.textContent = '@keyframes ripple{to{transform:scale(2.5);opacity:0}}';
document.head.appendChild(style);

// ---- Stagger children of grids on first scroll ----
function staggerGrid(selector, childSelector, baseDelay = 80) {
  document.querySelectorAll(selector).forEach(grid => {
    grid.querySelectorAll(childSelector).forEach((child, i) => {
      if (!child.hasAttribute('data-aos')) {
        child.setAttribute('data-aos', 'fade-up');
        child.setAttribute('data-aos-delay', i * baseDelay);
      }
    });
  });
}
staggerGrid('.benefits-grid', '.benefit-card', 90);
staggerGrid('.recipes-grid',  '.recipe-card',  80);
staggerGrid('.about-grid',    '.about-card',   100);
runAOS();
