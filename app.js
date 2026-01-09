console.log("Frontend loaded");

const API = "https://samaflux-backend.onrender.com";

/* ======================
   AUTH
====================== */
async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch(`${API}/api/auth/login`, {
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
  localStorage.setItem("balance", data.balance);

  showDashboard();
}

async function register() {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  const res = await fetch(`${API}/api/auth/register`, {
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
function showDashboard() {
  document.getElementById("authBox").style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  document.getElementById("userEmail").innerText =
    localStorage.getItem("userEmail");

  document.getElementById("balance").innerText =
    localStorage.getItem("balance");
}

/* ======================
   ADD MONEY
====================== */
async function addMoney() {
  const amount = document.getElementById("addAmount").value;
  const email = localStorage.getItem("userEmail");

  if (!amount || amount <= 0) {
    alert("Enter valid amount");
    return;
  }

  const res = await fetch(`${API}/api/payment/add-money`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, amount })
  });

  const data = await res.json();

  if (!data.data?.authorization_url) {
    alert("Payment init failed");
    return;
  }

  window.location.href = data.data.authorization_url;
}

/* ======================
   LOGOUT
====================== */
function logout() {
  localStorage.clear();
  location.reload();
}

/* ======================
   AUTO LOAD
====================== */
window.onload = () => {
  if (localStorage.getItem("userEmail")) {
    showDashboard();
  }
};
