const API = "https://samaflux-backend.onrender.com";
let currentUser = null;

function show(id) {
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  document.getElementById(id).style.display = "block";
}

function showSection(id) {
  document.getElementById("home").style.display = "none";
  document.getElementById("history").style.display = "none";
  document.getElementById(id).style.display = "block";

  if (id === "history") loadHistory();
}

async function register() {
  const email = regEmail.value;
  const password = regPassword.value;

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error);
  alert("Account created");
  show("loginPage");
}

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

  currentUser = data;
  balance.innerText = data.balance;
  show("dashboardPage");
}

async function addMoney() {
  const res = await fetch(`${API}/api/payment/add-money`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: currentUser.email,
      amount: Number(addAmount.value)
    })
  });

  const data = await res.json();
  if (data.data?.authorization_url) {
    window.location.href = data.data.authorization_url;
  }
}

async function loadHistory() {
  txList.innerHTML = "Loading...";

  try {
    const res = await fetch(`${API}/api/payment/history/${currentUser.email}`);
    const data = await res.json();

    txList.innerHTML = "";
    data.forEach(t => {
      const div = document.createElement("div");
      div.className = "tx";
      div.innerText = `${t.type} ₦${t.amount}`;
      txList.appendChild(div);
    });
  } catch {
    txList.innerHTML = "No transactions yet";
  }
}

show("landingPage");
