const API = "https://samaflux-backend.onrender.com/api/payment";
let currentUser = "";

console.log("App loaded");

function loginSuccess(email, balance) {
  currentUser = email;
  document.getElementById("balance").innerText = "₦" + balance;
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("auth").style.display = "none";
}

async function addMoney() {
  const amount = document.getElementById("addAmount").value;

  const res = await fetch(API + "/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: currentUser, amount }),
  });

  const data = await res.json();

  if (data.data?.authorization_url) {
    window.location.href = data.data.authorization_url;
  } else {
    alert("Failed to initialize payment");
  }
}

async function sendMoney() {
  const to = document.getElementById("sendEmail").value;
  const amount = document.getElementById("sendAmount").value;

  const res = await fetch(API + "/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fromEmail: currentUser,
      toEmail: to,
      amount: Number(amount),
    }),
  });

  const data = await res.json();
  alert(data.message || data.error);
}

async function loadHistory() {
  const res = await fetch(API + "/history/" + currentUser);
  const data = await res.json();

  const list = document.getElementById("history");
  list.innerHTML = "";

  data.forEach(tx => {
    const li = document.createElement("li");
    li.innerText = `${tx.type.toUpperCase()} ₦${tx.amount}`;
    list.appendChild(li);
  });
}
