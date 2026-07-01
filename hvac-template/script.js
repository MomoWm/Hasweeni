// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
navToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
});

// Close mobile nav when a link is clicked
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

// Auto-update footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Contact form placeholder handling (no backend — see CUSTOMIZE.md for free options)
const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Thanks! This demo form isn\'t connected yet — see CUSTOMIZE.md to wire it up for free with Formspree.');
  form.reset();
});
