const API = "https://samaflux-backend.onrender.com";

/* ELEMENTS */
const authContainer = document.getElementById("auth-container");
const dashboardContainer = document.getElementById("dashboard-container");
const balanceEl = document.getElementById("balance");
const historyEl = document.getElementById("history");

/* ---------- LOGIN ---------- */
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

  localStorage.setItem("email", data.email);
  localStorage.setItem("token", data.token);

  loadDashboard();
}

/* ---------- REGISTER ---------- */
async function register() {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

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
  authContainer.style.display = "none";
  dashboardContainer.style.display = "block";

  const res = await fetch(`${API}/auth/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const data = await res.json();
  balanceEl.innerText = data.balance;

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
    alert("Payment initialization failed");
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

/* ---------- HISTORY ---------- */
async function loadHistory() {
  const email = localStorage.getItem("email");

  const res = await fetch(`${API}/payment/history/${email}`);
  const tx = await res.json();

  historyEl.innerHTML = "";
  tx.forEach(t => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${t.type}</span><strong>₦${t.amount}</strong>`;
    historyEl.appendChild(li);
  });
}

/* ---------- TOP ACTIONS ---------- */
function openAdd() {
  addMoney();
}

function openSend() {
  sendMoney();
}

function openReceive() {
  const from = prompt("Request money from (email):");
  const amount = prompt("Amount:");

  if (!from || !amount) return;
  alert(`Request sent: ₦${amount} from ${from}`);
}

/* ---------- LOGOUT ---------- */
function logout() {
  localStorage.clear();
  location.reload();
}

/* ---------- AUTO LOAD ---------- */
window.onload = () => {
  if (localStorage.getItem("token")) {
    loadDashboard();
  }
};
