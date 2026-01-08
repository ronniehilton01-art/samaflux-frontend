console.log("Loaded app.js");

const API = "https://samaflux-backend.onrender.com";

function showRegister() {
  loginBox.classList.add("hidden");
  registerBox.classList.remove("hidden");
}

function showLogin() {
  registerBox.classList.add("hidden");
  loginBox.classList.remove("hidden");
}

function login() {
  fetch(API + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: loginEmail.value,
      password: loginPassword.value
    })
  })
  .then(res => res.json())
  .then(data => {
    if (!data.token) return alert("Login failed");
    localStorage.setItem("token", data.token);
    loginBox.classList.add("hidden");
    dashboard.classList.remove("hidden");
  })
  .catch(() => alert("Server error"));
}

function register() {
  fetch(API + "/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: regEmail.value,
      password: regPassword.value
    })
  })
  .then(res => res.json())
  .then(data => {
    alert("Account created, login now");
    showLogin();
  })
  .catch(() => alert("Registration error"));
}

function addMoney() {
  fetch(API + "/payment/add-money", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify({
      amount: amount.value
    })
  })
  .then(res => res.json())
  .then(data => {
    if (!data.authorization_url) {
      alert("Unable to initialize payment");
    } else {
      window.location.href = data.authorization_url;
    }
  })
  .catch(() => alert("Payment error"));
}

function logout() {
  localStorage.clear();
  location.reload();
}
