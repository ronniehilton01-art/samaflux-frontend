const API = "https://samaflux-backend.onrender.com";

/* ELEMENTS */
const auth = document.getElementById("auth-container");
const step1 = document.getElementById("signup-step1");
const step2 = document.getElementById("signup-step2");
const dashboard = document.getElementById("dashboard-container");
const sendPage = document.getElementById("send-page");
const addPage = document.getElementById("add-page");
const historyList = document.getElementById("history");

/* BUTTONS */
loginBtn.onclick = login;
goSignup.onclick = () => show(step1);
goLogin1.onclick = () => show(auth);
nextSignup.onclick = () => show(step2);
signupBtn.onclick = register;
logoutBtn.onclick = logout;

sendMoneyBtn.onclick = () => show(sendPage);
addMoneyBtn.onclick = () => show(addPage);
backDash1.onclick = () => show(dashboard);
backDash2.onclick = () => show(dashboard);
confirmSendBtn.onclick = sendMoney;
paystackBtn.onclick = payWithPaystack;

/* VIEW */
function show(el) {
  [auth, step1, step2, dashboard, sendPage, addPage].forEach(v => {
    if (v) v.style.display = "none";
  });
  el.style.display = "flex";
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
  show(auth);
}

/* DASHBOARD */
async function loadDashboard() {
  show(dashboard);

  const res = await fetch(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  const data = await res.json();
  balance.innerText = data.balance || 0;
  loadHistory();
}

/* HISTORY */
async function loadHistory() {
  historyList.innerHTML = "<li>Loading...</li>";
  const res = await fetch(`${API}/payment/history/${localStorage.getItem("email")}`);
  const tx = await res.json();

  historyList.innerHTML = tx.length
    ? tx.slice(0, 5).map(t => `<li>${t.type} ₦${t.amount}</li>`).join("")
    : "<li>No transactions</li>";
}

/* SEND MONEY */
async function sendMoney() {
  const res = await fetch(`${API}/payment/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fromEmail: localStorage.getItem("email"),
      toEmail: sendToEmail.value,
      amount: sendAmount.value
    })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error);
  loadDashboard();
}

/* PAYSTACK ADD MONEY */
function payWithPaystack() {
  const amount = addAmount.value;

  PaystackPop.setup({
    key: "pk_test_REPLACE_WITH_YOUR_KEY",
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
  }).openIframe();
}

/* LOGOUT */
function logout() {
  localStorage.clear();
  location.reload();
}

/* AUTO LOGIN */
if (localStorage.getItem("token")) loadDashboard();
