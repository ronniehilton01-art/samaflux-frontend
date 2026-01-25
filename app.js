const API = "https://samaflux-backend.onrender.com";

/* ================= ELEMENTS ================= */
const auth = document.getElementById("auth-container");
const dashboard = document.getElementById("dashboard-container");

const mainDashboard = document.getElementById("main-dashboard");
const addFundsPage = document.getElementById("add-funds-page");
const sendMoneyPage = document.getElementById("send-money-page");
const profilePage = document.getElementById("profile-page");
const addSuccessPage = document.getElementById("add-success-page");
const sendSuccessPage = document.getElementById("send-success-page");

const balanceEl = document.getElementById("balance");
const historyList = document.getElementById("history");

/* ================= VIEW CONTROL ================= */
function hideAll() {
  mainDashboard.style.display = "none";
  addFundsPage.style.display = "none";
  sendMoneyPage.style.display = "none";
  profilePage.style.display = "none";
  addSuccessPage.style.display = "none";
  sendSuccessPage.style.display = "none";
}

function showDashboard() {
  hideAll();
  mainDashboard.style.display = "block";
}

function showPage(page) {
  hideAll();
  page.style.display = "block";
}

/* ================= LOGIN ================= */
loginBtn.onclick = login;
logoutBtn.onclick = logout;

async function login() {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: loginEmail.value,
      password: loginPassword.value,
    }),
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error || "Login failed");

  localStorage.setItem("token", data.token);
  localStorage.setItem("email", data.email);

  loadDashboard();
}

/* ================= DASHBOARD ================= */
async function loadDashboard() {
  auth.style.display = "none";
  dashboard.style.display = "block";
  showDashboard();

  const res = await fetch(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const data = await res.json();
  balanceEl.innerText = data.balance || 0;

  loadHistory();
}

/* ================= NAV BUTTONS ================= */
addFundsBtn.onclick = () => showPage(addFundsPage);
sendMoneyBtn.onclick = () => showPage(sendMoneyPage);
profileBtn.onclick = openProfile;

backFromAdd.onclick = showDashboard;
backFromSend.onclick = showDashboard;
backFromProfile.onclick = showDashboard;

backAfterAdd.onclick = showDashboard;
backAfterSend.onclick = showDashboard;

/* ================= PROFILE ================= */
async function openProfile() {
  showPage(profilePage);

  const res = await fetch(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const u = await res.json();
  pName.innerText = u.fullName || "-";
  pEmail.innerText = u.email || "-";
  pPhone.innerText = u.phone || "-";
  pAddress.innerText = u.address || "-";
}

/* ================= ADD FUNDS (PAYSTACK CALLBACK HANDLED SERVER SIDE) ================= */
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
  if (!data.authorization_url) return alert("Payment failed");

  window.location.href = data.authorization_url;
};

/* ================= SEND MONEY ================= */
sendBtn.onclick = async () => {
  const toEmail = sendTo.value;
  const amount = Number(sendAmount.value);

  if (!toEmail || !amount) return alert("Missing fields");

  const res = await fetch(`${API}/payment/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fromEmail: localStorage.getItem("email"),
      toEmail,
      amount,
    }),
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error || "Transfer failed");

  // Success page
  document.getElementById("sentAmount").innerText = amount;
  document.getElementById("sentToEmail").innerText = toEmail;

  showPage(sendSuccessPage);
  loadDashboard();
};

/* ================= HISTORY ================= */
async function loadHistory() {
  historyList.innerHTML = "<li>Loading...</li>";

  const res = await fetch(
    `${API}/payment/history/${localStorage.getItem("email")}`
  );
  const tx = await res.json();

  historyList.innerHTML = tx.length
    ? tx.slice(0, 5).map(t => `<li>${t.type} ₦${t.amount}</li>`).join("")
    : "<li>No transactions</li>";
}

/* ================= LOGOUT ================= */
function logout() {
  localStorage.clear();
  location.reload();
}

/* ================= AUTO LOAD ================= */
window.onload = () => {
  if (localStorage.getItem("token")) loadDashboard();
};