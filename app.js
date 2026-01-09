const API = "https://samaflux-backend.onrender.com";

/* ================= AUTH ================= */
async function login() {
  const email = loginEmail.value;
  const password = loginPassword.value;

  const res = await fetch(`${API}/api/auth/login`, {
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
  userEmail.innerText = localStorage.getItem("email");
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
  refreshHistory();
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
    li.innerText = `${t.type.toUpperCase()} ₦${t.amount} (${t.from || ""} → ${t.to || ""})`;
    txList.appendChild(li);
  });
}
