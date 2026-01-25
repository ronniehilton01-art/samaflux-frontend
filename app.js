const API = "https://samaflux-backend.onrender.com";

/* =====================
   ELEMENTS (SAFE)
===================== */
const auth = document.getElementById("auth-container");
const step1 = document.getElementById("signup-step1");
const step2 = document.getElementById("signup-step2");
const dashboard = document.getElementById("dashboard-container");
const profile = document.getElementById("profile-container");

const historyList = document.getElementById("history");

/* Buttons */
const loginBtn = document.getElementById("loginBtn");
const goSignup = document.getElementById("goSignup");
const goLogin1 = document.getElementById("goLogin1");
const nextSignup = document.getElementById("nextSignup");
const signupBtn = document.getElementById("signupBtn");
const logoutBtn = document.getElementById("logoutBtn");
const profileBtn = document.getElementById("profileBtn");
const backDashboard = document.getElementById("backDashboard");

/* =====================
   VIEW SWITCHER (CORE)
===================== */
function hideAll() {
  auth.style.display = "none";
  step1.style.display = "none";
  step2.style.display = "none";
  dashboard.style.display = "none";
  if (profile) profile.style.display = "none";
}

function show(el, type = "flex") {
  hideAll();
  el.style.display = type;
}

/* =====================
   NAVIGATION
===================== */
loginBtn.onclick = login;
goSignup.onclick = () => show(step1);
goLogin1.onclick = () => show(auth);
nextSignup.onclick = () => show(step2);
signupBtn.onclick = register;
logoutBtn.onclick = logout;

if (profileBtn) profileBtn.onclick = openProfile;
if (backDashboard) backDashboard.onclick = () => show(dashboard, "block");

/* =====================
   LOGIN
===================== */
async function login() {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: loginEmail.value,
      password: loginPassword.value
    })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error || "Login failed");

  localStorage.setItem("token", data.token);
  localStorage.setItem("email", data.email);

  loadDashboard();
}

/* =====================
   REGISTER (2 STEP)
===================== */
async function register() {
  const payload = {
    email: regEmail.value,
    password: regPassword.value,
    fullName: regFullName.value,
    phone: regPhone.value,
    address: regAddress.value,
    city: regCity.value,
    state: regState.value,
    country: regCountry.value,
    zip: regZip.value
  };

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) return alert("Signup failed");

  alert("Account created successfully");
  show(auth);
}

/* =====================
   DASHBOARD
===================== */
async function loadDashboard() {
  show(dashboard, "block");

  const res = await fetch(`${API}/auth/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const data = await res.json();
  document.getElementById("balance").innerText = data.balance || 0;

  loadHistory();
}

/* =====================
   PROFILE (READ ONLY)
===================== */
async function openProfile() {
  show(profile);

  const res = await fetch(`${API}/auth/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const user = await res.json();

  document.getElementById("p-email").innerText = user.email || "-";
  document.getElementById("p-name").innerText = user.fullName || "-";
  document.getElementById("p-phone").innerText = user.phone || "-";
  document.getElementById("p-address").innerText = user.address || "-";
  document.getElementById("p-city").innerText = user.city || "-";
  document.getElementById("p-state").innerText = user.state || "-";
  document.getElementById("p-country").innerText = user.country || "-";
  document.getElementById("p-zip").innerText = user.zip || "-";
}

/* =====================
   TRANSACTION HISTORY
===================== */
async function loadHistory() {
  historyList.innerHTML = "<li>Loading...</li>";

  const email = localStorage.getItem("email");
  const res = await fetch(`${API}/payment/history/${email}`);
  const tx = await res.json();

  historyList.innerHTML = "";

  if (!tx || !tx.length) {
    historyList.innerHTML = "<li>No transactions</li>";
    return;
  }

  tx.slice(0, 5).forEach(t => {
    const li = document.createElement("li");
    li.innerText = `${t.type} ₦${t.amount}`;
    historyList.appendChild(li);
  });
}

/* =====================
   LOGOUT
===================== */
function logout() {
  localStorage.clear();
  location.reload();
}

/* =====================
   AUTO LOGIN
===================== */
window.onload = () => {
  if (localStorage.getItem("token")) {
    loadDashboard();
  }
};