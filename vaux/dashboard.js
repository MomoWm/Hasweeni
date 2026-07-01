if (localStorage.getItem('vaux_session') !== 'true') {
  window.location.href = 'auth.html';
}

const user = JSON.parse(localStorage.getItem('vaux_user') || '{}');

const planNames = { starter: 'Starter Plan', growth: 'Growth Plan', pro: 'Pro Plan' };
document.getElementById('planPill').textContent = planNames[user.plan] || 'Starter Plan';
document.getElementById('welcomeText').textContent = user.name ? `Welcome, ${user.name}` : '';

const fBusinessName = document.getElementById('fBusinessName');
const fPhone = document.getElementById('fPhone');
const fCity = document.getElementById('fCity');
const fState = document.getElementById('fState');
const fYears = document.getElementById('fYears');
const previewFrame = document.getElementById('previewFrame');

if (user.business) fBusinessName.value = user.business;

document.getElementById('logoutLink').addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('vaux_session');
  window.location.href = 'index.html';
});

function esc(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function buildPreviewHTML() {
  const businessName = esc(fBusinessName.value || 'Your HVAC Business');
  const phone = esc(fPhone.value || '(555) 123-4567');
  const city = esc(fCity.value || 'Your City');
  const state = esc(fState.value || 'ST');
  const years = esc(fYears.value || '10');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', Arial, sans-serif; color: #101828; }
  .topbar { background: #101828; color: #fff; font-size: 0.8rem; padding: 8px 20px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 6px; }
  .header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; box-shadow: 0 2px 8px rgba(16,24,40,0.08); }
  .logo { font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 1.2rem; color: #1e5fbf; }
  .call-btn { background: #1e5fbf; color: #fff; padding: 10px 18px; border-radius: 999px; font-weight: 600; font-size: 0.85rem; text-decoration:none; }
  .hero { background: linear-gradient(135deg, #1e5fbf, #14448f); color: #fff; padding: 48px 20px; }
  .badge { display: inline-block; background: rgba(255,255,255,0.15); padding: 5px 14px; border-radius: 999px; font-size: 0.75rem; margin-bottom: 14px; }
  h1 { font-family: 'Poppins', sans-serif; font-size: 1.7rem; margin-bottom: 12px; line-height: 1.25; }
  .hero p { opacity: 0.9; margin-bottom: 20px; max-width: 460px; font-size: 0.95rem; }
  .hero-buttons { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 24px; }
  .btn-white { background: #fff; color: #1e5fbf; padding: 10px 18px; border-radius: 999px; font-weight: 600; font-size: 0.85rem; text-decoration: none; }
  .btn-outline { border: 2px solid #fff; color: #fff; padding: 9px 17px; border-radius: 999px; font-weight: 600; font-size: 0.85rem; text-decoration: none; }
  .trust { display: flex; gap: 24px; flex-wrap: wrap; font-size: 0.8rem; }
  .trust strong { display: block; font-size: 1rem; }
  .services { padding: 40px 20px; background: #f6f8fb; text-align: center; }
  .services h2 { font-family: 'Poppins', sans-serif; margin-bottom: 20px; font-size: 1.3rem; }
  .grid { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
  .card { background: #fff; border-radius: 10px; padding: 16px; width: 140px; box-shadow: 0 4px 14px rgba(16,24,40,0.08); font-size: 0.8rem; }
  .card .icon { font-size: 1.4rem; margin-bottom: 6px; }
</style>
</head>
<body>
  <div class="topbar">
    <span>📍 Proudly serving ${city}, ${state} &amp; surrounding areas</span>
    <span>📞 ${phone}</span>
  </div>
  <div class="header">
    <div class="logo">${businessName}</div>
    <a class="call-btn" href="#">Call Now</a>
  </div>
  <div class="hero">
    <span class="badge">⭐ Trusted by ${city} homeowners</span>
    <h1>Heating &amp; Cooling Repairs, Done Right — Fast.</h1>
    <p>${businessName} keeps your home comfortable all year round. Licensed, insured, and available 24/7 for emergency repairs.</p>
    <div class="hero-buttons">
      <a class="btn-white" href="#">📞 Call ${phone}</a>
      <a class="btn-outline" href="#">Get a Free Quote</a>
    </div>
    <div class="trust">
      <div><strong>24/7</strong>Emergency Service</div>
      <div><strong>Licensed</strong>&amp; Insured</div>
      <div><strong>${years}+</strong>Years in Business</div>
    </div>
  </div>
  <div class="services">
    <h2>Our Services</h2>
    <div class="grid">
      <div class="card"><div class="icon">❄️</div>AC Repair</div>
      <div class="card"><div class="icon">🔥</div>Heating Repair</div>
      <div class="card"><div class="icon">🛠️</div>Installation</div>
      <div class="card"><div class="icon">🚨</div>Emergency Service</div>
    </div>
  </div>
</body>
</html>`;
}

function updatePreview() {
  previewFrame.srcdoc = buildPreviewHTML();
}

let previewDebounce;
function scheduleUpdatePreview() {
  clearTimeout(previewDebounce);
  previewDebounce = setTimeout(updatePreview, 300);
}

[fBusinessName, fPhone, fCity, fState, fYears].forEach(input => {
  input.addEventListener('input', scheduleUpdatePreview);
});

updatePreview();

document.getElementById('requestBtn').addEventListener('click', () => {
  const confirmBox = document.getElementById('confirmBox');
  confirmBox.style.display = 'block';
  confirmBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
