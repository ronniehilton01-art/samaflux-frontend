const API = "https://samaflux-backend.onrender.com";

/* ELEMENTS */
const auth = document.getElementById("auth-container");
const step1 = document.getElementById("signup-step1");
const step2 = document.getElementById("signup-step2");
const dashboard = document.getElementById("dashboard-container");
const historyList = document.getElementById("history");

/* NAV BUTTONS (SAFE) */
if (loginBtn) loginBtn.onclick = login;
if (goSignup) goSignup.onclick = () => switchView(auth, step1);
if (goLogin1) goLogin1.onclick = () => switchView(step1, auth);
if (nextSignup) nextSignup.onclick = () => switchView(step1, step2);
if (logoutBtn) logoutBtn.onclick = logout;
if (signupBtn) signupBtn.onclick = register;
if (addMoneyBtn) addMoneyBtn.onclick = addMoney;
if (sendMoneyBtn) sendMoneyBtn.onclick = sendMoney;

function switchView(hide, show) {
  hide.style.display = "none";
  show.style.display = "flex";
}

/* LOGIN */
async function login() {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: loginEmail.value,
      password: loginPassword.value
    })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error);

  localStorage.setItem("token", data.token);
  localStorage.setItem("email", data.email);
  loadDashboard();
}

/* REGISTER */
async function register() {
  const payload = {
    email: regEmail.value,
    password: regPassword.value,
    fullName: regFullName.value,
    phone: regPhone.value,
    address: regAddress.value,
    city: regCity.value,
    state: regState.value,
    country: regCountry.value,
    zip: regZip.value
  };

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) return alert("Signup failed");

  alert("Account created");
  switchView(step2, auth);
}

/* DASHBOARD */
async function loadDashboard() {
  if (!dashboard) return;

  auth.style.display = step1.style.display = step2.style.display = "none";
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

/* HISTORY */
async function loadHistory() {
  if (!historyList) return;

  historyList.innerHTML = "<li>Loading...</li>";

  const email = localStorage.getItem("email");
  const res = await fetch(`${API}/payment/history/${email}`);
  const tx = await res.json();

  historyList.innerHTML = "";

  if (!tx || !tx.length) {
    historyList.innerHTML = "<li>No transactions</li>";
    return;
  }

  tx.slice(-5).reverse().forEach(t => {
    const li = document.createElement("li");
    li.innerText = `${t.type} ₦${t.amount}`;
    historyList.appendChild(li);
  });
}

/* ADD MONEY */
async function addMoney() {
  alert("Add money logic already handled by backend");
}

/* SEND MONEY */
async function sendMoney() {
  alert("Send money logic already handled by backend");
}

/* LOGOUT */
function logout() {
  localStorage.clear();
  location.href = "index.html";
}

/* AUTO LOGIN */
window.onload = () => {
  if (localStorage.getItem("token")) {
    loadDashboard();
  }
};
