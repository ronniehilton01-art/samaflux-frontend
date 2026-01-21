const API = "https://samaflux-backend.onrender.com"; // Correct backend

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
  document.getElementById("auth-container").style.display = "none";
  document.getElementById("dashboard-container").style.display = "block";

  const email = localStorage.getItem("email");
  const res = await fetch(`${API}/auth/me`, {
    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
  });

  const data = await res.json();
  document.getElementById("balance").innerText = data.balance;

  loadHistory();
}

/* ---------- ADD MONEY ---------- */
async function addMoney() {
  const amount = document.getElementById("amount").value;
  const email = localStorage.getItem("email");

  const res = await fetch(`${API}/payment/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, amount })
  });

  const data = await res.json();
  if (data.status === "success") {
    alert("Payment initialized. Complete in the new window.");
    window.location.href = data.data.authorization_url;
  } else {
    alert("Failed to initialize payment");
  }
}

/* ---------- SEND MONEY ---------- */
async function sendMoney() {
  const toEmail = document.getElementById("sendEmail").value;
  const amount = document.getElementById("sendAmount").value;
  const fromEmail = localStorage.getItem("email");

  const res = await fetch(`${API}/payment/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ from: fromEmail, to: toEmail, amount })
  });

  const data = await res.json();
  if (res.ok) {
    alert(`Sent ₦${amount} to ${toEmail}`);
    loadDashboard();
  } else {
    alert(data.error || "Failed to send money");
  }
}

/* ---------- TRANSACTION HISTORY ---------- */
async function loadHistory() {
  const email = localStorage.getItem("email");
  const res = await fetch(`${API}/payment/history/${email}`);
  const tx = await res.json();

  const historyEl = document.getElementById("history");
  historyEl.innerHTML = "";
  tx.forEach(t => {
    const li = document.createElement("li");
    li.innerText = `${t.type} ₦${t.amount}`;
    historyEl.appendChild(li);
  });
}

/* ---------- LOGOUT ---------- */
function logout() {
  localStorage.clear();
  location.reload();
}

/* ---------- AUTO LOAD ---------- */
window.onload = () => {
  if (localStorage.getItem("email")) loadDashboard();
};
