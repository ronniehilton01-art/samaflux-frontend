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
      } else {
        currentEmail = d.email;
        balance.innerText = "₦" + d.balance;

        auth.classList.add("hidden");
        dashboard.classList.remove("hidden");

        loadHistory();
      }
    });
}

function send() {
  dashMsg.innerText = "Processing...";

  fetch(API + "/api/wallet/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fromEmail: currentEmail,
      toEmail: toEmail.value.trim(),
      amount: Number(amount.value)
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
        history.innerHTML = "<li>No transactions yet</li>";
        return;
      }

      data.forEach(tx => {
        const li = document.createElement("li");

        const sign = tx.from === currentEmail ? "-" : "+";
        const other = tx.from === currentEmail ? tx.to : tx.from;

        li.innerHTML = `
          <span>${tx.type.toUpperCase()}</span>
          <span>${sign}₦${tx.amount}</span>
          <small>${other}</small>
        `;

        history.appendChild(li);
      });
    });
}

function logout() {
  location.reload();
}
