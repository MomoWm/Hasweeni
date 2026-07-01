const tabSignin = document.getElementById('tabSignin');
const tabSignup = document.getElementById('tabSignup');
const signinForm = document.getElementById('signinForm');
const signupForm = document.getElementById('signupForm');
const authError = document.getElementById('authError');

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

const params = new URLSearchParams(window.location.search);
if (params.get('mode') === 'signup') {
  showSignup();
} else {
  showSignin();
}
const preselectedPlan = params.get('plan');
if (preselectedPlan) {
  const planSelect = document.getElementById('signupPlan');
  if (planSelect) planSelect.value = preselectedPlan;
}

function showError(message) {
  authError.textContent = message;
  authError.style.display = 'block';
}

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = {
    name: document.getElementById('signupName').value.trim(),
    business: document.getElementById('signupBusiness').value.trim(),
    email: document.getElementById('signupEmail').value.trim().toLowerCase(),
    plan: document.getElementById('signupPlan').value,
  };
  if (!user.name || !user.business || !user.email) {
    showError('Please fill in all fields.');
    return;
  }
  localStorage.setItem('vaux_user', JSON.stringify(user));
  localStorage.setItem('vaux_session', 'true');
  window.location.href = 'dashboard.html';
});

signinForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('signinEmail').value.trim().toLowerCase();
  const stored = localStorage.getItem('vaux_user');
  const user = stored ? JSON.parse(stored) : null;
  if (user && user.email === email) {
    localStorage.setItem('vaux_session', 'true');
    window.location.href = 'dashboard.html';
  } else {
    showError('No account found with that email on this device. Try signing up instead.');
  }
});
