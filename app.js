const API = "https://samaflux-backend.onrender.com";

/* ---------- ELEMENTS ---------- */
const authContainer = document.getElementById("auth-container");
const dashboardContainer = document.getElementById("dashboard-container");

/* ---------- LOGIN ---------- */
async function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Email and password required");
    return;
  }

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Login failed");
    return;
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("email", data.email);

  loadDashboard();
}

/* ---------- REGISTER ---------- */
async function register() {
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Registration failed");
    return;
  }

  alert("Registered successfully. Please login.");
}

/* ---------- DASHBOARD ---------- */
async function loadDashboard() {
  authContainer.style.display = "none";
  dashboardContainer.style.display = "block";

  const res = await fetch(`${API}/auth/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  if (!res.ok) {
    logout();
    return;
  }

  const data = await res.json();
  document.getElementById("balance").innerText = data.balance;

  loadHistory();
}

/* ---------- HISTORY ---------- */
async function loadHistory() {
  const email = localStorage.getItem("email");
  const res = await fetch(`${API}/payment/history/${email}`);
  const tx = await res.json();

  const history = document.getElementById("history");
  history.innerHTML = "";

  tx.forEach(t => {
    const li = document.createElement("li");
    li.innerText = `${t.type} ₦${t.amount}`;
    history.appendChild(li);
  });
}

/* ---------- LOGOUT ---------- */
function logout() {
  localStorage.clear();
  location.reload();
}

/* ---------- AUTO LOGIN ---------- */
window.onload = () => {
  if (localStorage.getItem("token")) {
    loadDashboard();
  }
};
