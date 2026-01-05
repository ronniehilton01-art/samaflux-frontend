const API = "/samaflux/backend";
let currentEmail = "";

function show(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
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
      msg.innerText = "Logged in";
    } else {
      msg.innerText = d.error;
    }
  });
}

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

function loadHistory() {
  fetch(API + "/wallet/history/" + currentEmail)
    .then(r => r.json())
    .then(data => {
      historyList.innerHTML = "";
      data.forEach(t => {
        const li = document.createElement("li");
        li.innerText = `${t.type} ₦${t.amount} ${t.from} → ${t.to}`;
        historyList.appendChild(li);
      });
    });
}

function requestRefund() {
  fetch(API + "/wallet/refund/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      transactionId: txid.value,
      reason: reason.value
    })
  })
  .then(r => r.json())
  .then(d => msg.innerText = d.message || d.error);
}
