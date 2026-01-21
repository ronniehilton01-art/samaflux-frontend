const API = "https://samaflux-backend.onrender.com";

/* =========================
   LOGIN
========================= */
async function login() {
  const email = loginEmail.value;
  const password = loginPassword.value;

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error);

    localStorage.setItem("email", data.email);
    localStorage.setItem("token", data.token); // store JWT
    loadDashboard();
  } catch (err) {
    alert("Login failed: " + err.message);
  }
}

/* =========================
   REGISTER
========================= */
async function register() {
  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: regEmail.value,
        password: regPassword.value
      })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error);
    alert("Registered successfully");
  } catch (err) {
    alert("Registration failed: " + err.message);
  }
}

/* =========================
   DASHBOARD
========================= */
async function loadDashboard() {
  auth.style.display = "none";
  dashboard.style.display = "block";

  const email = localStorage.getItem("email");
  userEmail.innerText = email;

  try {
    const res = await fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    const data = await res.json();
    balance.innerText = data.balance;

    loadHistory();
  } catch (err) {
    alert("Failed to load user data: " + err.message);
  }
}

/* =========================
   ADD MONEY
========================= */
async function addMoney() {
  const amountValue = parseFloat(amount.value);
  if (!amountValue || amountValue <= 0) return alert("Enter valid amount");

  try {
    const res = await fetch(`${API}/payment/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: localStorage.getItem("email"),
        amount: amountValue
      })
    });

    const data = await res.json();
    if (!res.ok || !data.data) return alert(data.message || "Payment failed");

    // Redirect to Paystack payment page
    window.location.href = data.data.authorization_url;
  } catch (err) {
    alert("Payment failed: " + err.message);
  }
}

/* =========================
   SEND MONEY TO USER
========================= */
async function sendMoney() {
  const recipientEmail = sendEmail.value;
  const sendAmount = parseFloat(sendAmountValue.value);

  if (!recipientEmail || !sendAmount || sendAmount <= 0)
    return alert("Enter valid recipient and amount");

  try {
    const res = await fetch(`${API}/payment/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        from: localStorage.getItem("email"),
        to: recipientEmail,
        amount: sendAmount
      })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error || "Transaction failed");
    alert("Money sent successfully!");
    loadDashboard();
  } catch (err) {
    alert("Failed to send money: " + err.message);
  }
}

/* =========================
   LOAD TRANSACTION HISTORY
========================= */
async function loadHistory() {
  const email = localStorage.getItem("email");
  try {
    const res = await fetch(`${API}/payment/history/${email}`);
    const data = await res.json();

    history.innerHTML = "";
    data.forEach(tx => {
      const li = document.createElement("li");
      li.innerText = `${tx.type} ₦${tx.amount} ${tx.to ? "to " + tx.to : ""} ${tx.from ? "from " + tx.from : ""}`;
      history.appendChild(li);
    });
  } catch (err) {
    history.innerHTML = "<li>Failed to load history</li>";
  }
}

/* =========================
   LOGOUT
========================= */
function logout() {
  localStorage.clear();
  location.reload();
}

/* =========================
   INIT ON PAGE LOAD
========================= */
window.onload = () => {
  if (localStorage.getItem("email")) loadDashboard();
};
