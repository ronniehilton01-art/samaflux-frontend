const API = "https://samaflux-backend.onrender.com";

/* TOAST */
function toast(msg, type="info") {
  const c = document.getElementById("toast-container");
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.innerText = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

/* BUTTON STATE */
function setLoading(btn, state) {
  btn.classList.toggle("loading", state);
  btn.disabled = state;
}

/* UI */
function showAuth() {
  auth-container.style.display = "flex";
  dashboard-container.style.display = "none";
}

function showDashboard() {
  auth-container.style.display = "none";
  dashboard-container.style.display = "block";
}

/* LOGIN */
async function login() {
  const btn = loginBtn;
  setLoading(btn, true);

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: loginEmail.value,
        password: loginPassword.value
      })
    });

    const data = await res.json();
    if (!res.ok) throw data.error;

    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.email);

    toast("Logged in", "success");
    loadDashboard();
  } catch (e) {
    toast(e, "error");
  }

  setLoading(btn, false);
}

/* REGISTER */
async function register() {
  const btn = registerBtn;
  setLoading(btn, true);

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: regEmail.value,
        password: regPassword.value
      })
    });

    const data = await res.json();
    if (!res.ok) throw data.error;

    toast("Account created", "success");
  } catch (e) {
    toast(e, "error");
  }

  setLoading(btn, false);
}

/* DASHBOARD */
async function loadDashboard() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const res = await fetch(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    localStorage.clear();
    return;
  }

  const data = await res.json();
  balance.innerText = data.balance;
  showDashboard();
  loadHistory();
}

/* ADD MONEY */
async function addMoney() {
  const btn = addBtn;
  setLoading(btn, true);

  const res = await fetch(`${API}/payment/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: localStorage.getItem("email"),
      amount: amount.value
    })
  });

  const data = await res.json();
  setLoading(btn, false);

  if (data.status === "success") {
    window.location.href = data.data.authorization_url;
  } else toast("Payment failed", "error");
}

/* SEND MONEY */
async function sendMoney() {
  const btn = sendBtn;
  setLoading(btn, true);

  const res = await fetch(`${API}/payment/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      from: localStorage.getItem("email"),
      to: sendEmail.value,
      amount: sendAmount.value
    })
  });

  const data = await res.json();
  setLoading(btn, false);

  if (!res.ok) toast(data.error, "error");
  else {
    toast("Money sent", "success");
    loadDashboard();
  }
}

/* HISTORY */
async function loadHistory() {
  const res = await fetch(`${API}/payment/history/${localStorage.getItem("email")}`);
  const tx = await res.json();
  history.innerHTML = "";
  tx.forEach(t => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${t.type}</span><strong>₦${t.amount}</strong>`;
    history.appendChild(li);
  });
}

/* REQUEST */
function receiveMoney() {
  toast("Request feature coming soon", "info");
}

/* LOGOUT */
function logout() {
  localStorage.clear();
  location.reload();
}

/* INIT */
document.addEventListener("DOMContentLoaded", loadDashboard);
