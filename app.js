console.log("Frontend loaded");

const API = "https://samaflux-backend.onrender.com";

let currentUser = null;

/* ---------------- AUTH ---------------- */

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

  alert("Account created. You can now login.");
  show("loginPage");
}

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

  currentUser = data;
  document.getElementById("balance").innerText = `₦${data.balance}`;
  show("dashboardPage");
}

/* ---------------- ADD MONEY ---------------- */

async function addMoney() {
  const amount = document.getElementById("addAmount").value;

  if (!amount || amount <= 0) {
    alert("Enter a valid amount");
    return;
  }

  const res = await fetch(`${API}/api/payment/add-money`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: currentUser.email,
      amount: Number(amount)
    })
  });

  const data = await res.json();

  if (!data.data?.authorization_url) {
    alert("Unable to initialize payment");
    return;
  }

  window.location.href = data.data.authorization_url;
}

/* ---------------- UI ---------------- */

function show(id) {
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  document.getElementById(id).style.display = "block";
}

show("landingPage");
