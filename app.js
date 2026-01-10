const API = "https://samaflux-backend.onrender.com";

/* ======================
   AUTH
====================== */
async function login() {
  const email = loginEmail.value;
  const password = loginPassword.value;

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error);
    return;
  }

  localStorage.setItem("email", data.email);
  showDashboard();
}

async function register() {
  const email = regEmail.value;
  const password = regPassword.value;

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error);
    return;
  }

  alert("Account created. Login now.");
}

/* ======================
   DASHBOARD
====================== */
async function showDashboard() {
  const email = localStorage.getItem("email");
  if (!email) return;

  authBox.style.display = "none";
  dashboard.style.display = "block";
  userEmail.innerText = email;

  refreshBalance();
  loadHistory();
}

async function refreshBalance() {
  const email = localStorage.getItem("email");
  const res = await fetch(`${API}/auth/user/${email}`);
  const data = await res.json();
  balance.innerText = data.balance;
}

/* ======================
   ADD MONEY
====================== */
async function addMoney() {
  const amount = addAmount.value;
  const email = localStorage.getItem("email");

  const res = await fetch(`${API}/api/payment/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, amount })
  });

  const data = await res.json();
  window.location.href = data.data.authorization_url;
}

/* ======================
   HISTORY
====================== */
async function loadHistory() {
  const email = localStorage.getItem("email");
  const res = await fetch(`${API}/api/payment/history/${email}`);
  const data = await res.json();

  history.innerHTML = "";
  data.reverse().forEach(tx => {
    const li = document.createElement("li");
    li.innerText = `${tx.type.toUpperCase()} ₦${tx.amount}`;
    history.appendChild(li);
  });
}

/* ======================
   LOGOUT
====================== */
function logout() {
  localStorage.clear();
  location.reload();
}

/* AUTO LOAD */
window.onload = () => {
  if (localStorage.getItem("email")) {
    showDashboard();
  }
};
