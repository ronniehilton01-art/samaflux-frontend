const API = "https://samaflux-backend.onrender.com";

/* ===== ELEMENTS (MATCH HTML IDS) ===== */
const auth = document.getElementById("auth-container");
const step1 = document.getElementById("signup-step1");
const step2 = document.getElementById("signup-step2");
const dashboard = document.getElementById("dashboard-container");
const historyList = document.getElementById("history");

/* ===== BUTTONS ===== */
document.getElementById("loginBtn").onclick = login;
document.getElementById("goSignup").onclick = () => show(step1);
document.getElementById("goLogin1").onclick = () => show(auth);
document.getElementById("nextSignup").onclick = () => show(step2);
document.getElementById("signupBtn").onclick = register;
document.getElementById("logoutBtn").onclick = logout;

/* ===== VIEW SWITCHER ===== */
function show(el) {
  [auth, step1, step2, dashboard].forEach(v => {
    if (v) v.style.display = "none";
  });
  el.style.display = "flex";
}

/* ===== LOGIN ===== */
async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error);

  localStorage.setItem("token", data.token);
  localStorage.setItem("email", data.email);

  loadDashboard();
}

/* ===== REGISTER (2 STEP) ===== */
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

/* ===== DASHBOARD ===== */
async function loadDashboard() {
  show(dashboard);

  const res = await fetch(`${API}/auth/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const data = await res.json();
  document.getElementById("balance").innerText = data.balance || 0;

  loadHistory();
}

/* ===== HISTORY ===== */
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
    li.textContent = `${t.type} ₦${t.amount}`;
    historyList.appendChild(li);
  });
}

/* ===== LOGOUT ===== */
function logout() {
  localStorage.clear();
  location.reload();
}

/* ===== AUTO LOGIN ===== */
window.onload = () => {
  if (localStorage.getItem("token")) {
    loadDashboard();
  }
};
