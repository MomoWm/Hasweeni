var tabSignin = document.getElementById('tabSignin');
var tabSignup = document.getElementById('tabSignup');
var signinForm = document.getElementById('signinForm');
var signupForm = document.getElementById('signupForm');
var authError = document.getElementById('authError');

function showSignin() {
  tabSignin.classList.add('active');
  tabSignup.classList.remove('active');
  signinForm.style.display = 'flex';
  signupForm.style.display = 'none';
  authError.style.display = 'none';
}

function showSignup() {
  tabSignup.classList.add('active');
  tabSignin.classList.remove('active');
  signupForm.style.display = 'flex';
  signinForm.style.display = 'none';
  authError.style.display = 'none';
}

tabSignin.addEventListener('click', showSignin);
tabSignup.addEventListener('click', showSignup);

var params = new URLSearchParams(window.location.search);
if (params.get('mode') === 'signup') {
  showSignup();
} else {
  showSignin();
}
var preselectedPlan = params.get('plan');
if (preselectedPlan) {
  var planSelect = document.getElementById('signupPlan');
  if (planSelect) planSelect.value = preselectedPlan;
}

function showError(msg) {
  authError.textContent = msg;
  authError.style.display = 'block';
}

async function sha256(str) {
  var buf = new TextEncoder().encode(str);
  var hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
}

var ADMIN_EMAIL = 'vauxbuilds@gmail.com';
var ADMIN_HASH  = 'dbb229911988b20524d63019c88b995ff5eed5ee252ea8e635759dda4b121bfd';

signinForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  var email    = document.getElementById('signinEmail').value.trim().toLowerCase();
  var password = document.getElementById('signinPassword').value;

  if (email === ADMIN_EMAIL) {
    var hash = await sha256(password);
    if (hash === ADMIN_HASH) {
      localStorage.setItem('vaux_user', JSON.stringify({ name: 'Admin', email: ADMIN_EMAIL, plan: 'admin', business: 'Vaux', phone: '', facebook: '' }));
      localStorage.setItem('vaux_session', 'true');
      window.location.href = 'dashboard.html';
    } else {
      showError('Incorrect password.');
    }
    return;
  }

  var stored = localStorage.getItem('vaux_user');
  var user = stored ? JSON.parse(stored) : null;
  if (user && user.email === email) {
    localStorage.setItem('vaux_session', 'true');
    window.location.href = 'dashboard.html';
  } else {
    showError('No account found with that email on this device. Try signing up instead.');
  }
});

function normalizeFacebook(val) {
  val = val.trim();
  if (!val) return '';
  if (!/^https?:\/\//i.test(val)) val = 'https://' + val;
  return val;
}

signupForm.addEventListener('submit', function(e) {
  e.preventDefault();
  var name     = document.getElementById('signupName').value.trim();
  var business = document.getElementById('signupBusiness').value.trim();
  var phone    = document.getElementById('signupPhone').value.trim();
  var facebook = normalizeFacebook(document.getElementById('signupFacebook').value);
  var email    = document.getElementById('signupEmail').value.trim().toLowerCase();
  var plan     = document.getElementById('signupPlan').value;

  if (!name || !business || !phone || !facebook || !email || !plan) {
    showError('Please fill in all fields including phone number and Facebook link.');
    return;
  }
  if (!facebook.includes('facebook.com') && !facebook.includes('fb.com')) {
    showError('Please enter a valid Facebook page URL (e.g. facebook.com/yourbusiness).');
    return;
  }

  var user = { name: name, business: business, phone: phone, facebook: facebook, email: email, plan: plan };
  localStorage.setItem('vaux_user', JSON.stringify(user));
  localStorage.setItem('vaux_session', 'true');

  var customers = JSON.parse(localStorage.getItem('vaux_customers') || '[]');
  var idx = customers.findIndex(function(c) { return c.email === email; });
  if (idx >= 0) {
    customers[idx] = Object.assign({}, customers[idx], user, { updatedAt: Date.now() });
  } else {
    customers.push(Object.assign({}, user, { signedUpAt: Date.now() }));
  }
  localStorage.setItem('vaux_customers', JSON.stringify(customers));
  window.location.href = 'dashboard.html';
});
