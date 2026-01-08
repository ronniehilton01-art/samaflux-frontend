const API = "https://samaflux-backend.onrender.com/api";
console.log("Loaded app.js");

let currentUser = null;

function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

async function register() {
  const email = regEmail.value;
  const password = regPassword.value;

  const res = await fetch(API + "/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.email) {
    alert("Account created. Login now.");
    showPage("login");
  } else {
    alert(data.error || "Registration failed");
  }
}

async function login() {
  const email = loginEmail.value;
  const password = loginPassword.value;

  const res = await fetch(API + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.email) {
    currentUser = data;
    balance.innerText = data.balance || 0;
    showPage("dashboard");
  } else {
    alert(data.error || "Login failed");
  }
}

async function addMoney() {
  const amount = addAmount.value;

  const res = await fetch(API + "/payment/add-money", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: currentUser.email,
      amount: Number(amount)
    })
  });

  const data = await res.json();

  if (data.data?.authorization_url) {
    window.location.href = data.data.authorization_url;
  } else {
    alert("Unable to initialize payment");
  }
}

async function sendMoney() {
  const toEmail = sendEmail.value;
  const amount = sendAmount.value;

  const res = await fetch(API + "/wallet/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fromEmail: currentUser.email,
      toEmail,
      amount: Number(amount)
    })
  });

  const data = await res.json();

  if (data.ok) {
    alert("Money sent");
  } else {
    alert(data.error || "Send failed");
  }
}

function logout() {
  currentUser = null;
  showPage("landing");
}
