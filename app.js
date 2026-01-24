const API = "https://samaflux-backend.onrender.com";

/* ---------- HELPERS ---------- */
function showAuth() {
  document.getElementById("auth-container").style.display = "flex";
  document.getElementById("dashboard-container").style.display = "none";
}

function showDashboard() {
  document.getElementById("auth-container").style.display = "none";
  document.getElementById("dashboard-container").style.display = "block";
}

/* ---------- LOGIN ---------- */
async function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) return alert("Enter email and password");

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Login failed");
    return;
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("email", data.email);

  await loadDashboard();
}

/* ---------- REGISTER ---------- */
async function register() {
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();

  if (!email || !password) return alert("Fill all fields");

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error);

  alert("Registered successfully. You can now login.");
}

/* ---------- DASHBOARD ---------- */
async function loadDashboard() {
  const token = localStorage.getItem("token");
  if (!token) return showAuth();

  const res = await fetch(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    localStorage.clear();
    showAuth();
    return;
  }

  const data = await res.json();
  document.getElementById("balance").innerText = data.balance;

  showDashboard();
  loadHistory();
}

/* ---------- ADD MONEY ---------- */
async function addMoney() {
  const amount = document.getElementById("amount").value;
  const email = localStorage.getItem("email");

  if (!amount) return alert("Enter amount");

  const res = await fetch(`${API}/payment/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, amount })
  });

  const data = await res.json();
  if (data.status === "success") {
    window.location.href = data.data.authorization_url;
  } else {
    alert("Payment failed");
  }
}

/* ---------- SEND MONEY ---------- */
async function sendMoney() {
  const to = document.getElementById("sendEmail").value;
  const amount = document.getElementById("sendAmount").value;
  const from = localStorage.getItem("email");

  if (!to || !amount) return alert("Fill all fields");

  const res = await fetch(`${API}/payment/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, amount })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error);

  alert(`Sent ₦${amount} to ${to}`);
  loadDashboard();
}

/* ---------- TRANSACTIONS ---------- */
async function loadHistory() {
  const email = localStorage.getItem("email");
  const historyEl = document.getElementById("history");

  const res = await fetch(`${API}/payment/history/${email}`);
  const tx = await res.json();

  historyEl.innerHTML = "";
  tx.forEach(t => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${t.type}</strong> — ₦${t.amount}`;
    historyEl.appendChild(li);
  });
}

/* ---------- RECEIVE MONEY ---------- */
function receiveMoney() {
  const email = prompt("Request money from (email)");
  const amount = prompt("Amount");

  if (!email || !amount) return;
  alert(`Request sent to ${email} for ₦${amount}`);
}

/* ---------- LOGOUT ---------- */
function logout() {
  localStorage.clear();
  showAuth();
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {
  showAuth();
  loadDashboard();
});
