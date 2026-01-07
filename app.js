const API = "https://samaflux-backend.onrender.com";
let currentUser = null;

/* Page switcher */
function show(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* Safe fetch helper */
async function apiFetch(url, data) {
  const res = await fetch(API + url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(text);
  }
}

/* LOGIN */
async function login() {
  document.getElementById("loginMsg").innerText = "";

  try {
    const data = await apiFetch("/auth/login", {
      email: loginEmail.value,
      password: loginPassword.value
    });

    currentUser = data.email;
    balance.innerText = "Balance: ₦" + data.balance;
    show("dashboard");
  } catch (e) {
    loginMsg.innerText = e.message;
  }
}

/* REGISTER */
async function register() {
  document.getElementById("registerMsg").innerText = "";

  try {
    await apiFetch("/auth/register", {
      email: regEmail.value,
      password: regPassword.value
    });

    registerMsg.innerText = "Registered successfully. Login now.";
  } catch (e) {
    registerMsg.innerText = e.message;
  }
}

/* SEND MONEY */
async function sendMoney() {
  document.getElementById("dashMsg").innerText = "";

  try {
    const data = await apiFetch("/wallet/send", {
      fromEmail: currentUser,
      toEmail: toEmail.value,
      amount: Number(sendAmount.value)
    });

    dashMsg.innerText = data.message;
  } catch (e) {
    dashMsg.innerText = e.message;
  }
}

/* LOGOUT */
function logout() {
  currentUser = null;
  show("home");
}
