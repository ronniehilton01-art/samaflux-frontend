const API = "https://samaflux-backend.onrender.com";

/* Views */
const auth = document.getElementById("auth-container");
const step1 = document.getElementById("signup-step1");
const step2 = document.getElementById("signup-step2");
const dashboard = document.getElementById("dashboard-container");

/* Buttons */
loginBtn.onclick = login;
goSignup.onclick = () => show(step1);
goLogin1.onclick = () => show(auth);
nextSignup.onclick = () => show(step2);
signupBtn.onclick = register;
logoutBtn.onclick = logout;

function show(view) {
  [auth, step1, step2, dashboard].forEach(v => v.classList.add("hidden"));
  view.classList.remove("hidden");
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

  alert("Account created");
  show(auth);
}

/* DASHBOARD */
async function loadDashboard() {
  show(dashboard);

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
  history.innerHTML = "<li>Loading...</li>";

  const email = localStorage.getItem("email");
  const res = await fetch(`${API}/payment/history/${email}`);
  const tx = await res.json();

  history.innerHTML = "";

  if (!tx || !tx.length) {
    history.innerHTML = "<li>No transactions</li>";
    return;
  }

  tx.slice(-5).reverse().forEach(t => {
    const li = document.createElement("li");
    li.textContent = `${t.type} ₦${t.amount}`;
    history.appendChild(li);
  });
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
