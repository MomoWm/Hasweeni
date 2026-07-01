const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
navToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Thanks! This demo form isn\'t connected yet — see hvac-template/CUSTOMIZE.md for how to wire it up for free with Formspree.');
  form.reset();
});
