const API = "https://samaflux-backend.onrender.com";

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const auth = document.getElementById("auth");
const dashboard = document.getElementById("dashboard");
const userEmail = document.getElementById("userEmail");
const balance = document.getElementById("balance");
const amount = document.getElementById("amount");
const sendEmail = document.getElementById("sendEmail");
const sendAmount = document.getElementById("sendAmount");
const historyEl = document.getElementById("history");

async function login() {
  const email = loginEmail.value;
  const password = loginPassword.value;

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error);

  localStorage.setItem("email", data.email);
  loadDashboard();
}

async function register() {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: regEmail.value, password: regPassword.value })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error);
  alert("Registered successfully");
}

async function loadDashboard() {
  auth.style.display = "none";
  dashboard.style.display = "block";

  const email = localStorage.getItem("email");
  userEmail.innerText = email;

  const res = await fetch(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` }
  });
  const data = await res.json();
  balance.innerText = data.balance;

  loadHistory();
}

async function addMoney() {
  const res = await fetch(`${API}/payment/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: localStorage.getItem("email"), amount: Number(amount.value) })
  });

  const data = await res.json();
  if (data.status === "success" && data.data?.authorization_url) {
    window.location.href = data.data.authorization_url;
  } else {
    alert("Failed to initialize payment");
  }
}

async function sendMoney() {
  const email = sendEmail.value;
  const amt = Number(sendAmount.value);

  const res = await fetch(`${API}/payment/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ from: localStorage.getItem("email"), to: email, amount: amt })
  });

  const data = await res.json();
  if (data.success) {
    alert(`Sent ₦${amt} to ${email}`);
    loadDashboard();
  } else {
    alert(data.error || "Failed to send money");
  }
}

async function loadHistory() {
  const email = localStorage.getItem("email");
  const res = await fetch(`${API}/payment/history/${email}`);
  const data = await res.json();

  historyEl.innerHTML = "";
  data.forEach(tx => {
    const li = document.createElement("li");
    li.innerText = `${tx.type} ₦${tx.amount}`;
    historyEl.appendChild(li);
  });
}

function logout() {
  localStorage.clear();
  location.reload();
}

window.onload = () => {
  if (localStorage.getItem("email")) loadDashboard();
};
