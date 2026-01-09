console.log("Frontend loaded");

const API = "https://samaflux-backend.onrender.com";

/* ======================
   AUTH
====================== */
async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

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

  localStorage.setItem("userEmail", data.email);
  loadDashboard();
}

async function register() {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Registration failed");
    return;
  }

  alert("Account created. Please login.");
}

/* ======================
   DASHBOARD
====================== */
async function loadDashboard() {
  const email = localStorage.getItem("userEmail");
  if (!email) return;

  document.getElementById("auth").style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  refreshBalance();
  loadHistory();
}

async function refreshBalance() {
  const email = localStorage.getItem("userEmail");

  const res = await fetch(`${API}/auth/user/${email}`);
  const data = await res.json();

  document.getElementById("balance").innerText = `₦${data.balance}`;
}

/* ======================
   ADD MONEY (PAYSTACK)
====================== */
async function addMoney() {
  const amount = document.getElementById("amount").value;
  const email = localStorage.getItem("userEmail");

  if (!amount || amount <= 0) {
    alert("Enter valid amount");
    return;
  }

  const res = await fetch(`${API}/api/payment/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, amount })
  });

  const data = await res.json();
  window.location.href = data.data.authorization_url;
}

/* ======================
   TRANSACTIONS
====================== */
async function loadHistory() {
  const email = localStorage.getItem("userEmail");

  const res = await fetch(`${API}/api/payment/history/${email}`);
  const history = await res.json();

  const list = document.getElementById("history");
  list.innerHTML = "";

  history.reverse().forEach(tx => {
    const li = document.createElement("li");
    li.innerText = `${tx.type.toUpperCase()} - ₦${tx.amount}`;
    list.appendChild(li);
  });
}

/* ======================
   AUTO LOAD
====================== */
window.onload = () => {
  if (localStorage.getItem("userEmail")) {
    loadDashboard();
  }
};
