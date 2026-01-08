const API = "https://samaflux-backend.onrender.com/api";

let userEmail = "";

/* PAGE SWITCH */
function show(id) {
  document.querySelectorAll(".card").forEach(c => c.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* REGISTER */
async function register() {
  const email = regEmail.value;
  const password = regPassword.value;

  const res = await fetch(API + "/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  alert(data.message || data.error);

  if (data.message) show("login");
}

/* LOGIN */
async function login() {
  const email = loginEmail.value;
  const password = loginPassword.value;

  const res = await fetch(API + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.email) {
    userEmail = data.email;
    balance.innerText = "Balance: ₦" + data.balance;
    show("dashboard");
  } else {
    alert(data.error);
  }
}

/* ADD MONEY */
async function addMoney() {
  const amount = Number(addAmount.value);
  if (!amount) return alert("Enter amount");

  const res = await fetch(API + "/payment/add-money", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: userEmail,
      amount
    })
  });

  const data = await res.json();

  if (data.data?.authorization_url) {
    window.location.href = data.data.authorization_url;
  } else {
    alert("Unable to initialize payment");
  }
}

/* LOGOUT */
function logout() {
  userEmail = "";
  show("landing");
}
