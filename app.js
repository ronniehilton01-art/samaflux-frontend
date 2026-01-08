const API = "https://samaflux-backend.onrender.com";

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
}

/* AUTH */
async function register() {
  const email = regEmail.value;
  const password = regPassword.value;

  const res = await fetch(API + "/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (res.ok) {
    alert("Account created");
    showPage("login");
  } else {
    alert(data.message || "Register failed");
  }
}

async function login() {
  const email = loginEmail.value;
  const password = loginPassword.value;

  const res = await fetch(API + "/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("token", data.token);
    loadDashboard();
    showPage("dashboard");
  } else {
    alert(data.message || "Login failed");
  }
}

function logout() {
  localStorage.removeItem("token");
  showPage("landing");
}

/* DASHBOARD */
async function loadDashboard() {
  const res = await fetch(API + "/api/user/me", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  });

  const data = await res.json();
  balance.textContent = data.balance || 0;
}

async function addMoney() {
  alert("Add money will redirect to Paystack (backend handled)");
}

async function sendMoney() {
  alert("Send money handled by backend");
}

/* START */
showPage("landing");
console.log("Frontend loaded");
