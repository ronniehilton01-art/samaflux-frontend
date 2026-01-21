const API = "https://samaflux-backend.onrender.com/api";

/* ----------------- LOGIN ----------------- */
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
  loadDashboard();
}

/* ----------------- REGISTER ----------------- */
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

  alert("Registered successfully! You can now log in.");
}

/* ----------------- DASHBOARD ----------------- */
async function loadDashboard() {
  document.getElementById("auth").style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  const email = localStorage.getItem("email");
  document.getElementById("userEmail").innerText = email;

  const res = await fetch(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` }
  });
  const data = await res.json();
  document.getElementById("balance").innerText = data.balance;

  loadHistory();
}

/* ----------------- ADD MONEY ----------------- */
async function addMoney() {
  const amount = document.getElementById("amount").value;
  const email = localStorage.getItem("email");

  if (!amount) return alert("Enter an amount");

  const res = await fetch(`${API}/payment/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, amount })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error);

  document.getElementById("balance").innerText = data.balance;
  loadHistory();
  alert("Money added successfully!");
}

/* ----------------- SEND MONEY ----------------- */
async function sendMoney() {
  const toEmail = document.getElementById("sendEmail").value;
  const amount = document.getElementById("sendAmount").value;
  const fromEmail = localStorage.getItem("email");

  if (!toEmail || !amount) return alert("Enter recipient and amount");

  const res = await fetch(`${API}/payment/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fromEmail, toEmail, amount })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error);

  document.getElementById("balance").innerText = data.senderBalance;
  loadHistory();
  alert(`Sent ₦${amount} to ${toEmail}`);
}

/* ----------------- TRANSACTION HISTORY ----------------- */
async function loadHistory() {
  const email = localStorage.getItem("email");
  const res = await fetch(`${API}/payment/history/${email}`);
  const data = await res.json();

  const history = document.getElementById("history");
  history.innerHTML = "";
  data.forEach(tx => {
    const li = document.createElement("li");
    li.innerText = `${tx.type} ₦${tx.amount} ${tx.to ? `→ ${tx.to}` : ""}`;
    history.appendChild(li);
  });
}

/* ----------------- LOGOUT ----------------- */
function logout() {
  localStorage.clear();
  location.reload();
}

/* ----------------- ON LOAD ----------------- */
window.onload = () => {
  if (localStorage.getItem("email")) loadDashboard();
};
