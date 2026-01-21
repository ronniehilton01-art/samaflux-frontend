const API = "https://samaflux-backend.onrender.com/api";

// ======= LOGIN FUNCTION =======
async function login() {
  const email = loginEmail.value;
  const password = loginPassword.value;

  if (!email || !password) return alert("Enter email and password");

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error);

    localStorage.setItem("email", data.email);
    loadDashboard();
  } catch (err) {
    console.error(err);
    alert("Login failed");
  }
}

// ======= REGISTER FUNCTION =======
async function register() {
  const email = regEmail.value;
  const password = regPassword.value;

  if (!email || !password) return alert("Enter email and password");

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error);

    alert("Registered successfully. You can now login.");
  } catch (err) {
    console.error(err);
    alert("Registration failed");
  }
}

// ======= LOAD DASHBOARD =======
async function loadDashboard() {
  auth.style.display = "none";
  dashboard.style.display = "block";

  const email = localStorage.getItem("email");
  userEmail.innerText = email;

  // Load user balance
  try {
    const res = await fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` }
    });
    const data = await res.json();
    balance.innerText = data.balance;
  } catch (err) {
    console.error(err);
    balance.innerText = "0";
  }

  loadHistory();
}

// ======= ADD MONEY FUNCTION =======
async function addMoney() {
  const amt = parseFloat(amount.value);
  if (!amt) return alert("Enter amount");

  try {
    const res = await fetch(`${API}/payment/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: localStorage.getItem("email"), amount: amt })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error);

    // Redirect to Paystack payment page
    window.location.href = data.data.authorization_url;
  } catch (err) {
    console.error(err);
    alert("Payment failed");
  }
}

// ======= SEND MONEY FUNCTION =======
async function sendMoney() {
  const toEmailVal = sendEmail.value;
  const amt = parseFloat(sendAmount.value);

  if (!toEmailVal || !amt) return alert("Enter recipient email and amount");

  const fromEmailVal = localStorage.getItem("email");

  try {
    const res = await fetch(`${API}/payment/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromEmail: fromEmailVal, toEmail: toEmailVal, amount: amt })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error);

    alert(data.message);
    loadDashboard(); // Refresh balance and transactions
  } catch (err) {
    console.error(err);
    alert("Transaction failed");
  }
}

// ======= LOAD TRANSACTION HISTORY =======
async function loadHistory() {
  const email = localStorage.getItem("email");
  try {
    const res = await fetch(`${API}/payment/history/${email}`);
    const data = await res.json();

    history.innerHTML = "";
    data.forEach(tx => {
      const li = document.createElement("li");
      if (tx.type === "send") {
        li.innerText = `Sent ₦${tx.amount} to ${tx.to}`;
      } else if (tx.type === "credit") {
        li.innerText = `Added ₦${tx.amount} to wallet`;
      } else {
        li.innerText = `${tx.type} ₦${tx.amount}`;
      }
      history.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    history.innerHTML = "<li>Failed to load history</li>";
  }
}

// ======= LOGOUT FUNCTION =======
function logout() {
  localStorage.clear();
  location.reload();
}

// ======= AUTO LOAD DASHBOARD IF LOGGED IN =======
window.onload = () => {
  if (localStorage.getItem("email")) loadDashboard();
};
