const API = "https://samaflux-backend.onrender.com";
let currentEmail = "";

/* PAGE SWITCHER */
function show(id) {
  document.querySelectorAll(".page")
    .forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* REGISTER */
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
    alert(d.message || d.error);
    if (d.message) show("login");
  });
}

/* LOGIN */
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
      alert(d.error);
    }
  });
}

/* SEND MONEY */
function sendMoney() {
  fetch(API + "/wallet/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fromEmail: currentEmail,
      toEmail: toEmail.value,
      amount: Number(amountSend.value)
    })
  })
  .then(r => r.json())
  .then(d => msg.innerText = d.message || d.error);
}

/* ADD MONEY */
function addMoney() {
  fetch(API + "/wallet/add/init", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: currentEmail,
      amount: amountAdd.value
    })
  })
  .then(r => r.json())
  .then(d => {
    if (d.data) window.location = d.data.authorization_url;
  });
}

/* WITHDRAW */
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
  })
  .then(r => r.json())
  .then(d => msg.innerText = d.message || d.error);
}
