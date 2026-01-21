const API = "https://samaflux-backend.onrender.com";

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
  alert("Registered successfully!");
}

async function loadDashboard() {
  document.getElementById("auth").style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  const email = localStorage.getItem("email");
  document.getElementById("userEmail").innerText = email;

  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/auth/me`, {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();
  document.getElementById("balance").innerText = data.balance;

  loadHistory();
}

async function addMoney() {
  const amount = document.getElementById("amount").value;
  const email = localStorage.getItem("email");

  const res = await fetch(`${API}/payment/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, amount })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error);

  document.getElementById("balance").innerText = data.balance;
  loadHistory();
}

async function sendMoney() {
  const toEmail = document.getElementById("sendEmail").value;
  const amount = document.getElementById("sendAmount").value;
  const fromEmail = localStorage.getItem("email");

  const res = await fetch(`${API}/payment/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fromEmail, toEmail, amount })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error);

  document.getElementById("balance").innerText = data.senderBalance;
  loadHistory();
  alert("Money sent successfully!");
}

async function loadHistory() {
  const email = localStorage.getItem("email");
  const res = await fetch(`${API}/payment/history/${email}`);
  const data = await res.json();

  const historyEl = document.getElementById("history");
  historyEl.innerHTML = "";
  data.forEach(tx => {
    const li = document.createElement("li");
    li.innerText = `${tx.type} ₦${tx.amount}` + (tx.to ? ` → ${tx.to}` : tx.from ? ` ← ${tx.from}` : "");
    historyEl.appendChild(li);
  });
}

function logout() {
  localStorage.clear();
  location.reload();
}

window.onload = () => {
  if (localStorage.getItem("email") && localStorage.getItem("token")) loadDashboard();
};
