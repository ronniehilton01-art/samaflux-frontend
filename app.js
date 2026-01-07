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
      if (d.error) {
        msg.innerText = d.error;
      } else {
        msg.style.color = "green";
        msg.innerText = "Account created. Please log in.";
      }
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
    });
}

function logout() {
  location.reload();
}
