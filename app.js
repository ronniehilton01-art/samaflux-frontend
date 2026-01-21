const API = "https://samaflux-backend.onrender.com";

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

  localStorage.setItem("email", data.email);
  localStorage.setItem("token", data.token);  // store token
  loadDashboard();
}

async function register() {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error);
  alert("Registered successfully! You can now login.");
}

async function loadDashboard() {
  document.getElementById("auth").style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  const email = localStorage.getItem("email");
  document.getElementById("userEmail").innerText = email;

  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/auth/me`, {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error);

  document.getElementById("balance").innerText = data.balance;
}

function logout() {
  localStorage.clear();
  location.reload();
}

window.onload = () => {
  if (localStorage.getItem("email") && localStorage.getItem("token")) {
    loadDashboard();
  }
};
