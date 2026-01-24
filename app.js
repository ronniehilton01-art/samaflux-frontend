const API = "https://samaflux-backend.onrender.com";

/* ELEMENTS */
const auth = document.getElementById("auth-container");
const signup = document.getElementById("signup-container");
const dashboard = document.getElementById("dashboard-container");
const loader = document.getElementById("page-loader");
const toast = document.getElementById("toast");
const historyList = document.getElementById("history");

/* EVENTS */
loginBtn.onclick = login;
signupBtn.onclick = register;
goSignup.onclick = () => toggle(auth, signup);
goLogin.onclick = () => toggle(signup, auth);
logoutBtn.onclick = logout;

/* HELPERS */
function toggle(hide, show) {
  hide.style.display = "none";
  show.style.display = "flex";
}

function showLoader(show = true) {
  loader.style.display = show ? "flex" : "none";
}

function notify(msg) {
  toast.innerText = msg;
  toast.style.display = "block";
  setTimeout(() => (toast.style.display = "none"), 3000);
}

/* LOGIN */
async function login() {
  showLoader(true);

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: loginEmail.value,
      password: loginPassword.value
    })
  });

  const data = await res.json();
  showLoader(false);

  if (!res.ok) return notify(data.error || "Login failed");

  localStorage.setItem("token", data.token);
  localStorage.setItem("email", data.email);

  loadDashboard();
}

/* REGISTER */
async function register() {
  showLoader(true);

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: regEmail.value,
      password: regPassword.value
    })
  });

  showLoader(false);

  if (!res.ok) return notify("Registration failed");

  notify("Account created. Please login.");
  toggle(signup, auth);
}

/* DASHBOARD */
async function loadDashboard() {
  auth.style.display = signup.style.display = "none";
  dashboard.style.display = "block";

  const res = await fetch(`${API}/auth/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const data = await res.json();
  balance.innerText = data.balance || 0;

  loadHistory();
}

/* REAL TRANSACTION HISTORY */
async function loadHistory() {
  historyList.innerHTML = "<li>Loading…</li>";

  try {
    const email = localStorage.getItem("email");
    const res = await fetch(`${API}/payment/history/${email}`);
    const tx = await res.json();

    historyList.innerHTML = "";

    if (!Array.isArray(tx) || tx.length === 0) {
      historyList.innerHTML = "<li>No transactions yet</li>";
      return;
    }

    tx.reverse().slice(0, 5).forEach(t => {
      const li = document.createElement("li");
      li.innerText = `${t.type} ₦${t.amount}`;
      historyList.appendChild(li);
    });
  } catch {
    historyList.innerHTML = "<li>Unable to load history</li>";
  }
}

/* ACTION PAGES */
function openPage(type) {
  const page = document.getElementById("sub-page");
  page.style.display = "block";

  if (type === "add") {
    page.innerHTML = `
      <h3>Add Money</h3>
      <input placeholder="Amount">
      <button onclick="notify('Payment flow coming soon')">Continue</button>
    `;
  }

  if (type === "send") {
    page.innerHTML = `
      <h3>Send Money</h3>
      <input placeholder="Recipient Email">
      <input placeholder="Amount">
      <button onclick="notify('Money sent')">Send</button>
    `;
  }

  if (type === "request") {
    page.innerHTML = `
      <h3>Request Money</h3>
      <input placeholder="User Email">
      <input placeholder="Amount">
      <button onclick="notify('Request sent')">Request</button>
    `;
  }
}

/* LOGOUT */
function logout() {
  localStorage.clear();
  location.reload();
}

/* AUTO LOGIN */
window.onload = () => {
  if (localStorage.getItem("token")) {
    loadDashboard();
  }
};
