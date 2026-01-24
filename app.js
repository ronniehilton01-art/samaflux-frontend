const API = "https://samaflux-backend.onrender.com";

/* TOAST */
function toast(msg, type = "info") {
  const c = document.getElementById("toast-container");
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.innerText = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

/* UI */
function showAuth() {
  document.getElementById("auth-container").style.display = "flex";
  document.getElementById("dashboard-container").style.display = "none";
}

function showDashboard() {
  document.getElementById("auth-container").style.display = "none";
  document.getElementById("dashboard-container").style.display = "block";
}

/* LOGIN */
async function login() {
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();
  if (!email || !password) return toast("Enter email and password", "error");

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (!res.ok) return toast(data.error, "error");

  localStorage.setItem("token", data.token);
  localStorage.setItem("email", data.email);

  toast("Logged in successfully", "success");
  loadDashboard();
}

/* REGISTER */
async function register() {
  const email = regEmail.value.trim();
  const password = regPassword.value.trim();
  if (!email || !password) return toast("Fill all fields", "error");

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (!res.ok) return toast(data.error, "error");

  toast("Account created. Log in now.", "success");
}

/* DASHBOARD */
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
  balance.innerText = data.balance;
  showDashboard();
  loadHistory();
}

/* ADD MONEY */
async function addMoney() {
  if (!amount.value) return toast("Enter amount", "error");

  const res = await fetch(`${API}/payment/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: localStorage.getItem("email"), amount: amount.value })
  });

  const data = await res.json();
  if (data.status === "success") {
    toast("Redirecting to payment…", "info");
    window.location.href = data.data.authorization_url;
  } else toast("Payment failed", "error");
}

/* SEND */
async function sendMoney() {
  if (!sendEmail.value || !sendAmount.value)
    return toast("Fill all fields", "error");

  const res = await fetch(`${API}/payment/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      from: localStorage.getItem("email"),
      to: sendEmail.value,
      amount: sendAmount.value
    })
  });

  const data = await res.json();
  if (!res.ok) return toast(data.error, "error");

  toast("Money sent successfully", "success");
  loadDashboard();
}

/* HISTORY */
async function loadHistory() {
  const res = await fetch(`${API}/payment/history/${localStorage.getItem("email")}`);
  const tx = await res.json();
  history.innerHTML = "";
  tx.forEach(t => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${t.type}</span><strong>₦${t.amount}</strong>`;
    history.appendChild(li);
  });
}

/* REQUEST */
function receiveMoney() {
  const email = prompt("Request money from (email)");
  const amount = prompt("Amount");
  if (!email || !amount) return;
  toast(`Request sent to ${email}`, "info");
}

/* LOGOUT */
function logout() {
  localStorage.clear();
  toast("Logged out", "info");
  showAuth();
}

/* INIT */
document.addEventListener("DOMContentLoaded", loadDashboard);
