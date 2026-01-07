const API = "https://samaflux-backend.onrender.com";
let currentUser = null;

/* Page switcher */
function show(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* Safe POST helper */
async function post(url, data) {
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

/* REGISTER */
async function register() {
  registerMsg.innerText = "";

  try {
    const data = await post("/api/auth/register", {
      email: regEmail.value.trim(),
      password: regPassword.value
    });

    registerMsg.style.color = "green";
    registerMsg.innerText = data.message || "Registered successfully. Login now.";
  } catch (e) {
    registerMsg.style.color = "red";
    registerMsg.innerText = e.message;
  }
}

/* LOGIN */
async function login() {
  loginMsg.innerText = "";

  try {
    const data = await post("/api/auth/login", {
      email: loginEmail.value.trim(),
      password: loginPassword.value
    });

    currentUser = data.email;
    balance.innerText = "Balance: ₦" + data.balance;
    show("dashboard");
  } catch (e) {
    loginMsg.innerText = e.message;
  }
}

/* SEND MONEY */
async function sendMoney() {
  dashMsg.innerText = "";

  try {
    const data = await post("/api/wallet/send", {
      fromEmail: currentUser,
      toEmail: toEmail.value.trim(),
      amount: Number(sendAmount.value)
    });

    dashMsg.style.color = "green";
    dashMsg.innerText = data.message;
  } catch (e) {
    dashMsg.style.color = "red";
    dashMsg.innerText = e.message;
  }
}

/* LOGOUT */
function logout() {
  currentUser = null;
  show("home");
}
