const API = "https://samaflux-backend.onrender.com";

/* ELEMENTS */
const auth = document.getElementById("auth-container");
const signup = document.getElementById("signup-container");
const dashboard = document.getElementById("dashboard-container");
const loader = document.getElementById("page-loader");

/* SAFE LOADER */
function showLoader(show) {
  loader.style.display = show ? "flex" : "none";
}

/* NEVER STICK LOADER */
window.addEventListener("error", () => showLoader(false));
window.addEventListener("unhandledrejection", () => showLoader(false));

/* NAV */
goSignup.onclick = () => {
  auth.style.display = "none";
  signup.style.display = "flex";
};

goLogin.onclick = () => {
  signup.style.display = "none";
  auth.style.display = "flex";
};

logoutBtn.onclick = logout;

/* LOGIN */
loginBtn.onclick = async () => {
  showLoader(true);
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
    if (!res.ok) throw new Error(data.error);

    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.email);
    loadDashboard();
  } catch (e) {
    alert(e.message);
  } finally {
    showLoader(false);
  }
};

/* REGISTER */
signupBtn.onclick = async () => {
  showLoader(true);
  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        email: regEmail.value,
        password: regPassword.value
      })
    });

    if (!res.ok) throw new Error("Registration failed");
    alert("Account created");
    signup.style.display = "none";
    auth.style.display = "flex";
  } catch (e) {
    alert(e.message);
  } finally {
    showLoader(false);
  }
};

/* DASHBOARD */
async function loadDashboard() {
  auth.style.display = "none";
  signup.style.display = "none";
  dashboard.style.display = "block";

  showLoader(true);
  try {
    const res = await fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    const data = await res.json();
    balance.innerText = data.balance;
  } catch {
    logout();
  } finally {
    showLoader(false);
  }
}

/* PAYMENTS */
async function addMoney(amount) {
  const res = await fetch(`${API}/payment/add`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ email: localStorage.getItem("email"), amount })
  });
  const data = await res.json();
  window.location.href = data.data.authorization_url;
}

async function sendMoney(to, amount) {
  await fetch(`${API}/payment/send`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ from: localStorage.getItem("email"), to, amount })
  });
  loadDashboard();
}

async function requestMoney(to, amount) {
  alert(`Request sent to ${to} for ₦${amount}`);
}

/* LOGOUT */
function logout() {
  localStorage.clear();
  location.reload();
}

/* AUTO */
window.onload = () => {
  if (localStorage.getItem("token")) loadDashboard();
};
