const API = "https://samaflux-backend.onrender.com";

/* ELEMENTS */
const auth = document.getElementById("auth-container");
const signup = document.getElementById("signup-container");
const dashboard = document.getElementById("dashboard-container");
const loader = document.getElementById("page-loader");

/* BUTTONS */
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const goSignup = document.getElementById("goSignup");
const goLogin = document.getElementById("goLogin");
const logoutBtn = document.getElementById("logoutBtn");

/* SAFE UI HELPERS */
function showLoader(show = true) {
  loader.style.display = show ? "flex" : "none";
}

function notify(msg) {
  // keeping alert for now for stability
  alert(msg);
}

/* NAV */
goSignup.addEventListener("click", () => {
  auth.style.display = "none";
  signup.style.display = "flex";
});

goLogin.addEventListener("click", () => {
  signup.style.display = "none";
  auth.style.display = "flex";
});

logoutBtn.addEventListener("click", logout);

/* LOGIN */
loginBtn.addEventListener("click", async () => {
  showLoader(true);
  loginBtn.disabled = true;

  try {
    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");

    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.email);
    loadDashboard();
  } catch (err) {
    notify(err.message);
  } finally {
    loginBtn.disabled = false;
    showLoader(false);
  }
});

/* REGISTER */
signupBtn.addEventListener("click", async () => {
  showLoader(true);
  signupBtn.disabled = true;

  try {
    const email = regEmail.value.trim();
    const password = regPassword.value;

    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) throw new Error("Registration failed");

    notify("Account created. Please log in.");
    signup.style.display = "none";
    auth.style.display = "flex";
  } catch (err) {
    notify(err.message);
  } finally {
    signupBtn.disabled = false;
    showLoader(false);
  }
});

/* DASHBOARD */
async function loadDashboard() {
  auth.style.display = "none";
  signup.style.display = "none";
  dashboard.style.display = "block";

  showLoader(true);

  try {
    const res = await fetch(`${API}/auth/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const data = await res.json();
    if (!res.ok) throw new Error("Session expired");

    balance.innerText = data.balance;
  } catch (err) {
    notify(err.message);
    logout();
  } finally {
    showLoader(false);
  }
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
