const API = "https://samaflux-backend.onrender.com";

/* =====================
   ELEMENTS
===================== */
const dashboard = document.getElementById("dashboard-container");

const mainDashboard = document.getElementById("main-dashboard");
const addFundsPage = document.getElementById("add-funds-page");
const sendMoneyPage = document.getElementById("send-money-page");
const profilePage = document.getElementById("profile-page");

const balanceEl = document.getElementById("balance");
const historyList = document.getElementById("history");

/* Buttons */
const addFundsBtn = document.getElementById("addFundsBtn");
const sendMoneyBtn = document.getElementById("sendMoneyBtn");
const profileBtn = document.getElementById("profileBtn");
const logoutBtn = document.getElementById("logoutBtn");

const backFromAdd = document.getElementById("backFromAdd");
const backFromSend = document.getElementById("backFromSend");
const backFromProfile = document.getElementById("backFromProfile");

const paystackBtn = document.getElementById("paystackBtn");
const sendBtn = document.getElementById("sendBtn");

/* Inputs */
const fundAmount = document.getElementById("fundAmount");
const sendTo = document.getElementById("sendTo");
const sendAmount = document.getElementById("sendAmount");

/* =====================
   VIEW CONTROL
===================== */
function hideAllPages() {
  mainDashboard.style.display = "none";
  addFundsPage.style.display = "none";
  sendMoneyPage.style.display = "none";
  profilePage.style.display = "none";
}

function showDashboard() {
  hideAllPages();
  mainDashboard.style.display = "grid";
}

/* =====================
   NAVIGATION
===================== */
addFundsBtn.onclick = () => {
  hideAllPages();
  addFundsPage.style.display = "block";
};

sendMoneyBtn.onclick = () => {
  hideAllPages();
  sendMoneyPage.style.display = "block";
};

profileBtn.onclick = openProfile;

backFromAdd.onclick = showDashboard;
backFromSend.onclick = showDashboard;
backFromProfile.onclick = showDashboard;

logoutBtn.onclick = logout;

/* =====================
   LOAD DASHBOARD
===================== */
async function loadDashboard() {
  dashboard.style.display = "block";
  showDashboard();

  const res = await fetch(`${API}/auth/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await res.json();
  balanceEl.innerText = data.balance || 0;

  loadHistory();
}

/* =====================
   PROFILE
===================== */
async function openProfile() {
  hideAllPages();
  profilePage.style.display = "block";

  const res = await fetch(`${API}/auth/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const user = await res.json();

  document.getElementById("pName").innerText = user.fullName || "-";
  document.getElementById("pEmail").innerText = user.email || "-";
  document.getElementById("pPhone").innerText = user.phone || "-";
  document.getElementById("pAddress").innerText = user.address || "-";
}

/* =====================
   ADD FUNDS (PAYSTACK)
===================== */
paystackBtn.onclick = async () => {
  const amount = Number(fundAmount.value);
  if (!amount) return alert("Enter amount");

  const res = await fetch(`${API}/payment/init-paystack`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ amount }),
  });

  const data = await res.json();
  if (!data.authorization_url) return alert("Payment init failed");

  window.location.href = data.authorization_url;
};

/* =====================
   SEND MONEY
===================== */
sendBtn.onclick = async () => {
  const toEmail = sendTo.value;
  const amount = Number(sendAmount.value);
  const fromEmail = localStorage.getItem("email");

  if (!toEmail || !amount) return alert("Missing fields");

  const res = await fetch(`${API}/payment/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fromEmail,
      toEmail,
      amount,
    }),
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error || "Transfer failed");

  alert("Money sent successfully");
  sendAmount.value = "";
  sendTo.value = "";

  loadDashboard();
};

/* =====================
   TRANSACTION HISTORY
===================== */
async function loadHistory() {
  historyList.innerHTML = "<li>Loading...</li>";

  const email = localStorage.getItem("email");
  const res = await fetch(`${API}/payment/history/${email}`);
  const tx = await res.json();

  historyList.innerHTML = "";

  if (!tx || !tx.length) {
    historyList.innerHTML = "<li>No transactions</li>";
    return;
  }

  tx.slice(0, 5).forEach(t => {
    const li = document.createElement("li");
    li.innerText = `${t.type} ₦${t.amount}`;
    historyList.appendChild(li);
  });
}

/* =====================
   LOGOUT
===================== */
function logout() {
  localStorage.clear();
  location.reload();
}

/* =====================
   AUTO LOAD
===================== */
window.onload = () => {
  if (localStorage.getItem("token")) {
    loadDashboard();
  }
};