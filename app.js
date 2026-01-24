const API = "https://samaflux-backend.onrender.com";

/* ELEMENTS */
const auth = document.getElementById("auth-container");
const step1 = document.getElementById("signup-step1");
const step2 = document.getElementById("signup-step2");
const dashboard = document.getElementById("dashboard");
const sendPage = document.getElementById("send-page");
const addPage = document.getElementById("add-page");
const historyList = document.getElementById("history");

/* BUTTONS */
document.getElementById("loginBtn").onclick = login;
document.getElementById("signupBtn").onclick = register;
document.getElementById("goSignup").onclick = () => show(step1);
document.getElementById("goLogin1").onclick = () => show(auth);
document.getElementById("nextSignup").onclick = () => show(step2);
document.getElementById("logoutBtn").onclick = logout;

document.getElementById("sendMoneyBtn").onclick = () => show(sendPage);
document.getElementById("addMoneyBtn").onclick = () => show(addPage);
document.getElementById("backDash1").onclick = () => show(dashboard);
document.getElementById("backDash2").onclick = () => show(dashboard);

document.getElementById("confirmSendBtn").onclick = sendMoney;
document.getElementById("paystackBtn").onclick = payWithPaystack;

/* VIEW SWITCHER */
function show(el) {
  [auth, step1, step2, dashboard, sendPage, addPage].forEach(e =>
    e.classList.add("hidden")
  );
  el.classList.remove("hidden");
}

/* LOGIN */
async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

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
  document.getElementById("balance").innerText = data.balance || 0;

  loadHistory();
}

/* TRANSACTIONS */
async function loadHistory() {
  historyList.innerHTML = "<li>Loading...</li>";

  const email = localStorage.getItem("email");
  const res = await fetch(`${API}/payment/history/${email}`);
  const tx = await res.json();

  historyList.innerHTML = "";
  if (!tx.length) {
    historyList.innerHTML = "<li>No transactions</li>";
    return;
  }

  tx.slice(0, 5).forEach(t => {
    const li = document.createElement("li");
    li.textContent = `${t.type} ₦${t.amount}`;
    historyList.appendChild(li);
  });
}

/* SEND MONEY */
async function sendMoney() {
  const toEmail = document.getElementById("sendToEmail").value;
  const amount = document.getElementById("sendAmount").value;

  const res = await fetch(`${API}/payment/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fromEmail: localStorage.getItem("email"),
      toEmail,
      amount
    })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error);

  loadDashboard();
}

/* PAYSTACK */
function payWithPaystack() {
  const amount = document.getElementById("addAmount").value;

  const handler = PaystackPop.setup({
    key: "pk_test_xxxxxxxxxxxxx", // replace with real key
    email: localStorage.getItem("email"),
    amount: amount * 100,
    currency: "NGN",
    callback: async () => {
      await fetch(`${API}/payment/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: localStorage.getItem("email"),
          amount
        })
      });
      loadDashboard();
    }
  });

  handler.openIframe();
}

/* LOGOUT */
function logout() {
  localStorage.clear();
  location.reload();
}

/* AUTO LOGIN */
if (localStorage.getItem("token")) {
  loadDashboard();
}
