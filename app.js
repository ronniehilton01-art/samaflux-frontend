const API = "https://samaflux-backend.onrender.com";

const auth = document.getElementById("auth-container");
const signup = document.getElementById("signup-container");
const dashboard = document.getElementById("dashboard-container");

/* BUTTONS */
document.getElementById("loginBtn").addEventListener("click", login);
document.getElementById("signupBtn").addEventListener("click", register);
document.getElementById("goSignup").addEventListener("click", () => {
  auth.style.display = "none";
  signup.style.display = "block";
});
document.getElementById("goLogin").addEventListener("click", () => {
  signup.style.display = "none";
  auth.style.display = "block";
});
document.getElementById("logoutBtn").addEventListener("click", logout);

/* LOGIN */
async function login() {
  const email = loginEmail.value;
  const password = loginPassword.value;

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error);

  localStorage.setItem("token", data.token);
  localStorage.setItem("email", data.email);
  loadDashboard();
}

/* REGISTER */
async function register() {
  const email = regEmail.value;
  const password = regPassword.value;

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) return alert("Registration failed");
  alert("Account created");
}

/* DASHBOARD */
async function loadDashboard() {
  auth.style.display = "none";
  signup.style.display = "none";
  dashboard.style.display = "block";

  const res = await fetch(`${API}/auth/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  const data = await res.json();
  balance.innerText = data.balance;
}

/* LOGOUT */
function logout() {
  localStorage.clear();
  location.reload();
}

/* AUTO LOGIN */
window.addEventListener("load", () => {
  if (localStorage.getItem("token")) {
    loadDashboard();
  }
});
