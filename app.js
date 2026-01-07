const API = "https://samaflux-backend.onrender.com";
let currentEmail = "";

function register() {
  msg.innerText = "Creating account...";

  fetch(API + "/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.value.trim(),
      password: password.value
    })
  })
  .then(r => r.json())
  .then(d => {
    msg.innerText = d.error || "Account created. Please log in.";
  });
}

function login() {
  msg.innerText = "Logging in...";

  fetch(API + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.value.trim(),
      password: password.value
    })
  })
  .then(r => r.json())
  .then(d => {
    if (d.error) {
      msg.innerText = d.error;
      return;
    }

    currentEmail = d.email;
    balance.innerText = "₦" + d.balance;

    auth.classList.add("hidden");
    dashboard.classList.remove("hidden");

    loadHistory();
  });
}

function addMoney() {
  const amount = Number(document.getElementById("addAmount").value);

  console.log("Add money clicked:", amount);

  if (!amount || amount < 100) {
    alert("Minimum ₦100");
    return;
  }

  fetch(API + "/api/payment/add-money", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: currentEmail,
      amount
    })
  })
  .then(r => r.json())
  .then(d => {
    console.log("Paystack response:", d);

    if (d.data && d.data.authorization_url) {
      window.location.href = d.data.authorization_url;
    } else {
      alert("Unable to initialize payment");
    }
  })
  .catch(err => {
    console.error(err);
    alert("Network error");
  });
}

function send() {
  dashMsg.innerText = "Sending...";

  fetch(API + "/api/wallet/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fromEmail: currentEmail,
      toEmail: toEmail.value.trim(),
      amount: Number(sendAmount.value)
    })
  })
  .then(r => r.json())
  .then(d => {
    dashMsg.innerText = d.message || d.error;
    loadHistory();
  });
}

function loadHistory() {
  history.innerHTML = "<li>Loading...</li>";

  fetch(API + "/api/wallet/history/" + currentEmail)
    .then(r => r.json())
    .then(data => {
      history.innerHTML = "";

      if (!data.length) {
        history.innerHTML = "<li>No transactions</li>";
        return;
      }

      data.forEach(tx => {
        const li = document.createElement("li");
        const sign = tx.from === currentEmail ? "-" : "+";
        li.innerHTML = `
          <span>${tx.type}</span>
          <span>${sign}₦${tx.amount}</span>
        `;
        history.appendChild(li);
      });
    });
}

function logout() {
  location.reload();
}
