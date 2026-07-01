if (localStorage.getItem('vaux_session') !== 'true') {
  window.location.href = 'auth.html';
}

var user = JSON.parse(localStorage.getItem('vaux_user') || '{}');

document.getElementById('welcomeText').textContent = user.name ? 'Welcome, ' + user.name : '';

document.getElementById('logoutLink').addEventListener('click', function(e) {
  e.preventDefault();
  localStorage.removeItem('vaux_session');
  window.location.href = 'index.html';
});

// ---- Admin Panel ----
if (user.email === 'vauxbuilds@gmail.com') {
  document.getElementById('adminPanel').style.display = 'block';
  loadAdminPanel();
} else {
  document.getElementById('buildPanel').style.display = 'block';
  loadBuildWizard();
}

function loadAdminPanel() {
  var customers = JSON.parse(localStorage.getItem('vaux_customers') || '[]');
  var planPrices = { starter: 29, growth: 59, pro: 99 };

  var totalCustomers = customers.length;
  var totalRevenue = customers.reduce(function(sum, c) { return sum + (planPrices[c.plan] || 0); }, 0);

  var now = new Date();
  var thisMonth = customers.filter(function(c) {
    if (!c.signedUpAt) return false;
    var d = new Date(c.signedUpAt);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;

  document.getElementById('adminTotalCustomers').textContent = totalCustomers;
  document.getElementById('adminMonthlyRevenue').textContent = '$' + totalRevenue;
  document.getElementById('adminThisMonth').textContent = thisMonth;
  document.getElementById('adminTableCount').textContent = totalCustomers + ' customer' + (totalCustomers !== 1 ? 's' : '');

  if (customers.length === 0) return;

  var rows = customers.map(function(c) {
    var planClass = c.plan || 'starter';
    var planLabel = { starter: 'Starter', growth: 'Growth', pro: 'Pro' }[c.plan] || c.plan;
    var signedUp = c.signedUpAt ? new Date(c.signedUpAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
    var fbLink = c.facebook ? '<a class="admin-link" href="' + escAttr(c.facebook) + '" target="_blank">View Page</a>' : '—';
    return '<tr>'
      + '<td>' + esc(c.name || '—') + '</td>'
      + '<td>' + esc(c.business || '—') + '</td>'
      + '<td><span class="plan-tag ' + planClass + '">' + planLabel + '</span></td>'
      + '<td>' + esc(c.phone || '—') + '</td>'
      + '<td>' + fbLink + '</td>'
      + '<td>' + esc(c.email || '—') + '</td>'
      + '<td>' + signedUp + '</td>'
      + '</tr>';
  }).join('');

  var html = '<table class="admin-table">'
    + '<thead><tr>'
    + '<th>Name</th><th>Business</th><th>Plan</th><th>Phone</th><th>Facebook</th><th>Email</th><th>Signed Up</th>'
    + '</tr></thead>'
    + '<tbody>' + rows + '</tbody>'
    + '</table>';

  document.getElementById('adminTableContainer').innerHTML = html;
}

function esc(str) {
  var div = document.createElement('div');
  div.textContent = String(str || '');
  return div.innerHTML;
}

function escAttr(str) {
  return String(str || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ---- Build Wizard ----
function loadBuildWizard() {
  var planNames = { starter: 'Starter Plan', growth: 'Growth Plan', pro: 'Pro Plan' };
  document.getElementById('planPill').textContent = planNames[user.plan] || 'Starter Plan';

  var fBusinessName = document.getElementById('fBusinessName');
  var fPhone = document.getElementById('fPhone');
  var fCity = document.getElementById('fCity');
  var fState = document.getElementById('fState');
  var fYears = document.getElementById('fYears');
  var previewFrame = document.getElementById('previewFrame');

  if (user.business) fBusinessName.value = user.business;
  if (user.phone) fPhone.value = user.phone;

  function buildPreviewHTML() {
    var businessName = esc(fBusinessName.value || 'Your HVAC Business');
    var phone = esc(fPhone.value || '(555) 123-4567');
    var city = esc(fCity.value || 'Your City');
    var state = esc(fState.value || 'ST');
    var years = esc(fYears.value || '10');

    return '<!DOCTYPE html><html><head><style>'
      + '* { box-sizing: border-box; margin: 0; padding: 0; }'
      + 'body { font-family: Arial, sans-serif; color: #101828; }'
      + '.topbar { background: #0f1b2d; color: #aaa; font-size: 0.8rem; padding: 8px 20px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 6px; }'
      + '.header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; box-shadow: 0 2px 8px rgba(16,24,40,0.08); }'
      + '.logo { font-family: Arial, sans-serif; font-weight: 800; font-size: 1.2rem; color: #1e5fbf; }'
      + '.call-btn { background: #1e5fbf; color: #fff; padding: 10px 18px; border-radius: 999px; font-weight: 600; font-size: 0.85rem; text-decoration: none; }'
      + '.hero { background: linear-gradient(135deg, #1e5fbf, #14448f); color: #fff; padding: 48px 20px; }'
      + '.badge { display: inline-block; background: rgba(255,255,255,0.15); padding: 5px 14px; border-radius: 999px; font-size: 0.75rem; margin-bottom: 14px; }'
      + 'h1 { font-family: Arial, sans-serif; font-size: 1.7rem; margin-bottom: 12px; line-height: 1.25; }'
      + '.hero p { opacity: 0.9; margin-bottom: 20px; max-width: 460px; font-size: 0.95rem; }'
      + '.hero-buttons { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 24px; }'
      + '.btn-white { background: #fff; color: #1e5fbf; padding: 10px 18px; border-radius: 999px; font-weight: 600; font-size: 0.85rem; text-decoration: none; }'
      + '.btn-outline { border: 2px solid #fff; color: #fff; padding: 9px 17px; border-radius: 999px; font-weight: 600; font-size: 0.85rem; text-decoration: none; }'
      + '.trust { display: flex; gap: 24px; flex-wrap: wrap; font-size: 0.8rem; }'
      + '.trust strong { display: block; font-size: 1rem; }'
      + '.services { padding: 40px 20px; background: #f6f8fb; text-align: center; }'
      + '.services h2 { font-family: Arial, sans-serif; margin-bottom: 20px; font-size: 1.3rem; }'
      + '.grid { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }'
      + '.card { background: #fff; border-radius: 10px; padding: 16px; width: 140px; box-shadow: 0 4px 14px rgba(16,24,40,0.08); font-size: 0.8rem; }'
      + '.card .icon { font-size: 1.4rem; margin-bottom: 6px; }'
      + '</style></head><body>'
      + '<div class="topbar">'
      + '<span>📍 Proudly serving ' + city + ', ' + state + ' &amp; surrounding areas</span>'
      + '<span>📞 ' + phone + '</span>'
      + '</div>'
      + '<div class="header">'
      + '<div class="logo">' + businessName + '</div>'
      + '<a class="call-btn" href="#">Call Now</a>'
      + '</div>'
      + '<div class="hero">'
      + '<span class="badge">⭐ Trusted by ' + city + ' homeowners</span>'
      + '<h1>Heating &amp; Cooling Repairs, Done Right — Fast.</h1>'
      + '<p>' + businessName + ' keeps your home comfortable all year round. Licensed, insured, and available 24/7 for emergency repairs.</p>'
      + '<div class="hero-buttons">'
      + '<a class="btn-white" href="#">📞 Call ' + phone + '</a>'
      + '<a class="btn-outline" href="#">Get a Free Quote</a>'
      + '</div>'
      + '<div class="trust">'
      + '<div><strong>24/7</strong>Emergency Service</div>'
      + '<div><strong>Licensed</strong>&amp; Insured</div>'
      + '<div><strong>' + years + '+</strong>Years in Business</div>'
      + '</div>'
      + '</div>'
      + '<div class="services">'
      + '<h2>Our Services</h2>'
      + '<div class="grid">'
      + '<div class="card"><div class="icon">❄️</div>AC Repair</div>'
      + '<div class="card"><div class="icon">🔥</div>Heating Repair</div>'
      + '<div class="card"><div class="icon">🛠️</div>Installation</div>'
      + '<div class="card"><div class="icon">🚨</div>Emergency Service</div>'
      + '</div>'
      + '</div>'
      + '</body></html>';
  }

  function updatePreview() {
    previewFrame.srcdoc = buildPreviewHTML();
  }

  var previewDebounce;
  function scheduleUpdatePreview() {
    clearTimeout(previewDebounce);
    previewDebounce = setTimeout(updatePreview, 300);
  }

  [fBusinessName, fPhone, fCity, fState, fYears].forEach(function(input) {
    input.addEventListener('input', scheduleUpdatePreview);
  });

  updatePreview();

  document.getElementById('requestBtn').addEventListener('click', function() {
    var confirmBox = document.getElementById('confirmBox');
    confirmBox.style.display = 'block';
    confirmBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}
