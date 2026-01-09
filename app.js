const API = "https://samaflux-backend.onrender.com";

/* ================= AUTH ================= */
async function login() {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: loginEmail.value,
      password: loginPassword.value
    })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error);

  localStorage.setItem("email", data.email);
  loadDashboard();
}

async function register() {
  const res = await fetch(`${API}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: regEmail.value,
      password: regPassword.value
    })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error);

  alert("Account created. Login now.");
}

/* ================= DASHBOARD ================= */
async function loadDashboard() {
  authBox.style.display = "none";
  dashboard.style.display = "block";

  const email = localStorage.getItem("email");
  userEmail.innerText = email;

  // 🔴 FETCH REAL BALANCE FROM BACKEND
  const res = await fetch(`${API}/api/auth/user/${email}`);
  const data = await res.json();

  balance.innerText = data.balance;

  refreshHistory();
}

/* ================= ADD MONEY ================= */
async function addMoney() {
  const res = await fetch(`${API}/api/payment/add-money`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: localStorage.getItem("email"),
      amount: addAmount.value
    })
  });

  const data = await res.json();
  window.location.href = data.data.authorization_url;
}

/* ================= SEND MONEY ================= */
async function sendMoney() {
  const res = await fetch(`${API}/api/payment/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fromEmail: localStorage.getItem("email"),
      toEmail: sendTo.value,
      amount: sendAmount.value
    })
  });

  const data = await res.json();
  alert(data.message || data.error);
  loadDashboard();
}

/* ================= WITHDRAW ================= */
async function withdraw() {
  const res = await fetch(`${API}/api/payment/withdraw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: localStorage.getItem("email"),
      amount: withdrawAmount.value,
      bank_code: bankCode.value,
      account_number: accountNumber.value
    })
  });

  const data = await res.json();
  alert(data.message || data.error);
  loadDashboard();
}

/* ================= HISTORY ================= */
async function refreshHistory() {
  const res = await fetch(
    `${API}/api/payment/history/${localStorage.getItem("email")}`
  );

  const history = await res.json();
  txList.innerHTML = "";

  history.forEach(t => {
    const li = document.createElement("li");
    li.innerText = `${t.type.toUpperCase()} ₦${t.amount}`;
    txList.appendChild(li);
  });
}

/* ================= LOGOUT ================= */
function logout() {
  localStorage.clear();
  location.reload();
}

/* ================= AUTO LOAD ================= */
window.onload = () => {
  if (localStorage.getItem("email")) {
    loadDashboard();
  }
};
