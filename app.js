const API = "https://samaflux-backend.onrender.com";

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

  localStorage.setItem("email", data.email);
  localStorage.setItem("token", data.token); // store token
  loadDashboard();
}

async function register() {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: regEmail.value,
      password: regPassword.value
    })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error);
  alert("Registered successfully");
}

async function loadDashboard() {
  auth.style.display = "none";
  dashboard.style.display = "block";

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");
  userEmail.innerText = email;

  // fetch user info with token
  const res = await fetch(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  balance.innerText = data.balance;

  loadHistory();
}

async function addMoney() {
  const res = await fetch(`${API}/payment/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: localStorage.getItem("email"),
      amount: amount.value
    })
  });

  const data = await res.json();
  window.location.href = data.data.authorization_url;
}

async function loadHistory() {
  const email = localStorage.getItem("email");
  const res = await fetch(`${API}/payment/history/${email}`);
  const data = await res.json();

  history.innerHTML = "";
  data.forEach(tx => {
    const li = document.createElement("li");
    li.innerText = `${tx.type} ₦${tx.amount}`;
    history.appendChild(li);
  });
}

function logout() {
  localStorage.clear();
  location.reload();
}

window.onload = () => {
  if (localStorage.getItem("email")) loadDashboard();
};
