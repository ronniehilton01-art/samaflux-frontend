console.log("Loaded app.js");

const API = "https://samaflux-backend.onrender.com";

let currentEmail = "";

// Navigation
function hideAll() {
  document.querySelectorAll(".container").forEach(d => d.classList.add("hidden"));
}

function goHome() {
  hideAll();
  document.getElementById("home").classList.remove("hidden");
}

function showLogin() {
  hideAll();
  document.getElementById("login").classList.remove("hidden");
}

function showRegister() {
  hideAll();
  document.getElementById("register").classList.remove("hidden");
}

// Auth
async function register() {
  const email = reg_email.value;
  const password = reg_password.value;

  const res = await fetch(API + "/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  message.innerText = data.message || data.error;
}

async function login() {
  const email = login_email.value;
  const password = login_password.value;

  const res = await fetch(API + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.email) {
    currentEmail = data.email;
    balance.innerText = "Balance: ₦" + data.balance;
    hideAll();
    dashboard.classList.remove("hidden");
    message.innerText = "";
  } else {
    message.innerText = data.error;
  }
}

// Wallet
async function sendMoney() {
  const res = await fetch(API + "/wallet/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fromEmail: currentEmail,
      toEmail: send_email.value,
      amount: Number(send_amount.value)
    })
  });

  const data = await res.json();
  alert(data.message || data.error);
}

async function addMoney() {
  const res = await fetch(API + "/payment/add-money", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: currentEmail,
      amount: Number(add_amount.value)
    })
  });

  const data = await res.json();

  if (data.data?.authorization_url) {
    window.location.href = data.data.authorization_url;
  } else {
    alert("Unable to initialize payment");
  }
}

function logout() {
  currentEmail = "";
  goHome();
}
