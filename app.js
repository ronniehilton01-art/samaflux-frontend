const API = "https://samaflux-backend.onrender.com";

/* ELEMENTS */
const auth = document.getElementById("auth-container");
const step1 = document.getElementById("signup-step1");
const step2 = document.getElementById("signup-step2");
const dashboard = document.getElementById("dashboard-container");
const historyList = document.getElementById("history");
const profileBox = document.getElementById("profile-container");

/* NAV */
loginBtn.onclick = login;
goSignup.onclick = () => switchView(auth, step1);
goLogin1.onclick = () => switchView(step1, auth);
nextSignup.onclick = () => switchView(step1, step2);
signupBtn.onclick = register;
logoutBtn.onclick = logout;
profileBtn.onclick = toggleProfile;
addMoneyBtn.onclick = addMoney;
sendMoneyBtn.onclick = sendMoney;

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
    name: regFullName.value,
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
  switchView(step2, auth);
}

/* DASHBOARD */
async function loadDashboard() {
  auth.style.display = step1.style.display = step2.style.display = "none";
  dashboard.style.display = "block";

  const res = await fetch(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  const user = await res.json();
  balance.innerText = user.balance || 0;

  document.getElementById("p-name").innerText = user.name || "-";
  document.getElementById("p-email").innerText = user.email || "-";
  document.getElementById("p-phone").innerText = user.phone || "-";
  document.getElementById("p-address").innerText = user.address || "-";
  document.getElementById("p-city").innerText = user.city || "-";
  document.getElementById("p-state").innerText = user.state || "-";
  document.getElementById("p-country").innerText = user.country || "-";
  document.getElementById("p-zip").innerText = user.zip || "-";

  loadHistory();
}

/* PROFILE */
function toggleProfile() {
  profileBox.style.display =
    profileBox.style.display === "none" ? "block" : "none";
}

/* HISTORY */
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

  tx.slice(-5).reverse().forEach(t => {
    const li = document.createElement("li");
    li.innerText = `${t.type} ₦${t.amount}`;
    historyList.appendChild(li);
  });
}

/* PAYMENTS */
async function addMoney() {
  const res = await fetch(`${API}/payment/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: localStorage.getItem("email"),
      amount: addAmount.value
    })
  });

  const data = await res.json();
  if (data?.data?.authorization_url) {
    window.location.href = data.data.authorization_url;
  }
}

async function sendMoney() {
  const res = await fetch(`${API}/payment/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      from: localStorage.getItem("email"),
      to: sendEmail.value,
      amount: sendAmount.value
    })
  });

  if (res.ok) loadDashboard();
}

/* LOGOUT */
function logout() {
  localStorage.clear();
  location.reload();
}

/* AUTO LOGIN */
window.onload = () => {
  if (localStorage.getItem("token")) loadDashboard();
};
