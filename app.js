const API = "https://samaflux-backend.onrender.com";

/* =====================
   ELEMENTS
===================== */
const auth = document.getElementById("auth-container");
const step1 = document.getElementById("signup-step1");
const step2 = document.getElementById("signup-step2");
const dashboard = document.getElementById("dashboard-container");

const mainDashboard = document.getElementById("main-dashboard");
const addFundsPage = document.getElementById("add-funds-page");
const sendMoneyPage = document.getElementById("send-money-page");
const profilePage = document.getElementById("profile-page");

const historyList = document.getElementById("history");

/* Buttons */
const loginBtn = document.getElementById("loginBtn");
const goSignup = document.getElementById("goSignup");
const goLogin1 = document.getElementById("goLogin1");
const nextSignup = document.getElementById("nextSignup");
const signupBtn = document.getElementById("signupBtn");

const logoutBtn = document.getElementById("logoutBtn");
const profileBtn = document.getElementById("profileBtn");
const addFundsBtn = document.getElementById("addFundsBtn");
const sendMoneyBtn = document.getElementById("sendMoneyBtn");

const backFromAdd = document.getElementById("backFromAdd");
const backFromSend = document.getElementById("backFromSend");
const backFromProfile = document.getElementById("backFromProfile");

/* =====================
   VIEW HELPERS
===================== */
function hideAll() {
  auth.style.display = "none";
  step1.style.display = "none";
  step2.style.display = "none";
  dashboard.style.display = "none";

  mainDashboard.style.display = "none";
  addFundsPage.style.display = "none";
  sendMoneyPage.style.display = "none";
  profilePage.style.display = "none";
}

function show(el, type = "flex") {
  hideAll();
  el.style.display = type;
}

function showSection(section) {
  mainDashboard.style.display = "none";
  addFundsPage.style.display = "none";
  sendMoneyPage.style.display = "none";
  profilePage.style.display = "none";

  section.style.display = "block";
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
profileBtn.onclick = openProfile;

addFundsBtn.onclick = () => showSection(addFundsPage);
sendMoneyBtn.onclick = () => showSection(sendMoneyPage);

backFromAdd.onclick = () => showSection(mainDashboard);
backFromSend.onclick = () => showSection(mainDashboard);
backFromProfile.onclick = () => showSection(mainDashboard);

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

  alert("Account created");
  show(auth);
}

/* =====================
   DASHBOARD
===================== */
async function loadDashboard() {
  hideAll();
  dashboard.style.display = "block";
  mainDashboard.style.display = "block";

  const res = await fetch(`${API}/auth/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const data = await res.json();
  balance.innerText = data.balance || 0;

  loadHistory();
}

/* =====================
   PROFILE
===================== */
async function openProfile() {
  showSection(profilePage);

  const res = await fetch(`${API}/auth/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const user = await res.json();

  document.getElementById("pName").innerText = user.fullName || "-";
  document.getElementById("pEmail").innerText = user.email || "-";
  document.getElementById("pPhone").innerText = user.phone || "-";
  document.getElementById("pAddress").innerText = user.address || "-";
}

/* =====================
   HISTORY
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
   INITIAL LOAD (FIXES WHITE PAGE)
===================== */
window.onload = () => {
  if (localStorage.getItem("token")) {
    loadDashboard();
  } else {
    show(auth);
  }
};