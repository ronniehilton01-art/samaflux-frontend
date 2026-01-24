const API = "https://samaflux-backend.onrender.com";

/* LOADERS */
function showLoader() {
  document.getElementById("page-loader").style.display = "flex";
  document.getElementById("top-loader").style.width = "80%";
}

function hideLoader() {
  document.getElementById("top-loader").style.width = "100%";
  setTimeout(() => {
    document.getElementById("page-loader").style.display = "none";
    document.getElementById("top-loader").style.width = "0%";
  }, 400);
}

/* TOAST */
function toast(msg) {
  const t = document.createElement("div");
  t.style.background = "#0070ba";
  t.style.color = "#fff";
  t.style.padding = "12px 16px";
  t.style.borderRadius = "12px";
  t.style.marginBottom = "10px";
  t.innerText = msg;
  document.getElementById("toast-container").appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

/* UI */
function showDashboard() {
  auth-container.style.display = "none";
  dashboard-container.style.display = "block";
}

/* LOGIN */
async function login() {
  showLoader();
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        email: loginEmail.value,
        password: loginPassword.value
      })
    });

    const data = await res.json();
    if (!res.ok) throw data.error;

    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.email);

    toast("Welcome to SamaFlux");
    loadDashboard();
  } catch (e) {
    toast(e);
  }
  hideLoader();
}

/* REGISTER */
async function register() {
  showLoader();
  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        email: regEmail.value,
        password: regPassword.value
      })
    });

    const data = await res.json();
    if (!res.ok) throw data.error;
    toast("Account created");
  } catch (e) {
    toast(e);
  }
  hideLoader();
}

/* DASHBOARD */
async function loadDashboard() {
  showLoader();
  const res = await fetch(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  if (!res.ok) return;

  const data = await res.json();
  balance.innerText = data.balance;
  showDashboard();
  loadHistory();
  hideLoader();
}

/* PAYMENTS */
async function addMoney() {
  showLoader();
  const res = await fetch(`${API}/payment/add`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      email: localStorage.getItem("email"),
      amount: amount.value
    })
  });
  const data = await res.json();
  hideLoader();
  if (data.data) window.location.href = data.data.authorization_url;
}

async function sendMoney() {
  showLoader();
  const res = await fetch(`${API}/payment/send`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      from: localStorage.getItem("email"),
      to: sendEmail.value,
      amount: sendAmount.value
    })
  });
  const data = await res.json();
  hideLoader();
  toast(data.status || data.error);
  loadDashboard();
}

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

function requestMoney() {
  toast("Request money coming soon");
}

function logout() {
  localStorage.clear();
  location.reload();
}

document.addEventListener("DOMContentLoaded", loadDashboard);
