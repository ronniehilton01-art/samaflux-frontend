const API_AUTH = "https://samaflux-backend.onrender.com/auth";
const API_PAY = "https://samaflux-backend.onrender.com/api/payment";

let currentUser = localStorage.getItem("samaflux_user");

/* PAGE LOAD GUARD */
window.onload = () => {
  if (currentUser) {
    showDashboard(currentUser);
  } else {
    document.getElementById("authBox").style.display = "block";
    document.getElementById("dashboard").style.display = "none";
  }
};

function showDashboard(email) {
  document.getElementById("authBox").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("userEmail").innerText = email;
  loadHistory();
}

/* REGISTER */
async function register() {
  const email = regEmail.value;
  const password = regPassword.value;

  const res = await fetch(API_AUTH + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  msg.innerText = data.message || data.error || "Registered";
}

/* LOGIN */
async function login() {
  const email = loginEmail.value;
  const password = loginPassword.value;

  const res = await fetch(API_AUTH + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!data.email) {
    msg.innerText = data.error || "Login failed";
    return;
  }

  localStorage.setItem("samaflux_user", data.email);
  currentUser = data.email;

  document.getElementById("balance").innerText = data.balance;
  showDashboard(data.email);
}

/* LOGOUT */
function logout() {
  localStorage.removeItem("samaflux_user");
  location.reload();
}

/* ADD MONEY */
async function addMoney() {
  const amount = addAmount.value;

  const res = await fetch(API_PAY + "/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: currentUser, amount })
  });

  const data = await res.json();

  if (data.data?.authorization_url) {
    window.location.href = data.data.authorization_url;
  } else {
    alert("Payment failed");
  }
}

/* SEND MONEY */
async function sendMoney() {
  const toEmail = sendEmail.value;
  const amount = Number(sendAmount.value);

  const res = await fetch(API_PAY + "/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fromEmail: currentUser,
      toEmail,
      amount
    })
  });

  const data = await res.json();
  alert(data.message || data.error);
  loadHistory();
}

/* HISTORY */
async function loadHistory() {
  const res = await fetch(API_PAY + "/history/" + currentUser);
  const data = await res.json();

  const list = document.getElementById("history");
  list.innerHTML = "";

  data.forEach(tx => {
    const li = document.createElement("li");
    li.innerText = `${tx.type} ₦${tx.amount}`;
    list.appendChild(li);
  });
}
