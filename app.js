const API = "https://samaflux-backend.onrender.com";
let currentEmail = "";

/* ELEMENTS */
const email = document.getElementById("email");
const password = document.getElementById("password");
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const balance = document.getElementById("balance");
const msg = document.getElementById("msg");

const toEmail = document.getElementById("toEmail");
const amountSend = document.getElementById("amountSend");
const amountAdd = document.getElementById("amountAdd");
const amountWithdraw = document.getElementById("amountWithdraw");
const bank = document.getElementById("bank");
const account = document.getElementById("account");
const historyList = document.getElementById("historyList");

/* NAV */
function show(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* AUTH */
function register() {
  fetch(API + "/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: regEmail.value,
      password: regPassword.value
    })
  })
  .then(r => r.json())
  .then(d => {
    msg.innerText = d.message || d.error;
    if (d.message) show("login");
  });
}

function login() {
  fetch(API + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  })
  .then(r => r.json())
  .then(d => {
    if (d.email) {
      currentEmail = d.email;
      balance.innerText = "Balance: ₦" + d.balance;
      show("dashboard");
    } else {
      msg.innerText = d.error;
    }
  });
}

/* WALLET */
function sendMoney() {
  fetch(API + "/wallet/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fromEmail: currentEmail,
      toEmail: toEmail.value,
      amount: Number(amountSend.value)
    })
  }).then(r => r.json()).then(d => msg.innerText = d.message || d.error);
}

function addMoney() {
  fetch(API + "/wallet/add/init", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: currentEmail,
      amount: amountAdd.value
    })
  }).then(r => r.json()).then(d => {
    if (d.data) window.location = d.data.authorization_url;
  });
}

function withdraw() {
  fetch(API + "/wallet/withdraw", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: currentEmail,
      amount: amountWithdraw.value,
      bank_code: bank.value,
      account_number: account.value
    })
  }).then(r => r.json()).then(d => msg.innerText = d.message || d.error);
}

function loadHistory() {
  fetch(API + "/wallet/history/" + currentEmail)
    .then(r => r.json())
    .then(data => {
      historyList.innerHTML = "";
      data.forEach(t => {
        const li = document.createElement("li");
        li.innerText = `${t.type} ₦${t.amount}`;
        historyList.appendChild(li);
      });
    });
}
