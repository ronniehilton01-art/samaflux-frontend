const API = "https://samaflux-backend.onrender.com";

/* ELEMENTS */
const loginPage = document.getElementById("login-page");
const signupPage = document.getElementById("signup-page");
const dashboardPage = document.getElementById("dashboard-page");

const pageLoader = document.getElementById("page-loader");
const topLoader = document.getElementById("top-loader");
const toastContainer = document.getElementById("toast-container");

/* NAV */
function goAuth(type) {
  loginPage.classList.add("hidden");
  signupPage.classList.add("hidden");
  document.getElementById(type + "-page").classList.remove("hidden");
}

function goPage(page) {
  ["dashboard","add","send","request"].forEach(p=>{
    document.getElementById(p+"-page")?.classList.add("hidden");
  });
  document.getElementById(page+"-page").classList.remove("hidden");
}

/* UI */
function showLoader() {
  pageLoader.style.display = "flex";
  topLoader.style.width = "80%";
}
function hideLoader() {
  topLoader.style.width = "100%";
  setTimeout(()=>{
    pageLoader.style.display = "none";
    topLoader.style.width = "0";
  },400);
}

function toast(msg) {
  const t = document.createElement("div");
  t.style.background = "#0070ba";
  t.style.color = "#fff";
  t.style.padding = "12px 16px";
  t.style.borderRadius = "12px";
  t.style.marginBottom = "10px";
  t.innerText = msg;
  toastContainer.appendChild(t);
  setTimeout(()=>t.remove(),3000);
}

/* AUTH */
async function login() {
  showLoader();
  const res = await fetch(`${API}/auth/login`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      email: loginEmail.value,
      password: loginPassword.value
    })
  });
  const data = await res.json();
  hideLoader();
  if(!res.ok) return toast(data.error);

  localStorage.setItem("token", data.token);
  localStorage.setItem("email", data.email);
  loadDashboard();
}

async function register() {
  showLoader();
  const res = await fetch(`${API}/auth/register`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      email: regEmail.value,
      password: regPassword.value
    })
  });
  hideLoader();
  toast("Account created. Please log in.");
  goAuth("login");
}

/* DASHBOARD */
async function loadDashboard() {
  loginPage.classList.add("hidden");
  signupPage.classList.add("hidden");
  dashboardPage.classList.remove("hidden");
  goPage("dashboard");

  const res = await fetch(`${API}/auth/me`,{
    headers:{ Authorization:`Bearer ${localStorage.getItem("token")}` }
  });
  const data = await res.json();
  balance.innerText = data.balance;
  loadHistory();
}

/* PAYMENTS */
async function addMoney() {
  showLoader();
  const res = await fetch(`${API}/payment/add`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      email: localStorage.getItem("email"),
      amount: amount.value
    })
  });
  const data = await res.json();
  hideLoader();
  window.location.href = data.data.authorization_url;
}

async function sendMoney() {
  showLoader();
  await fetch(`${API}/payment/send`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      from: localStorage.getItem("email"),
      to: sendEmail.value,
      amount: sendAmount.value
    })
  });
  hideLoader();
  toast("Money sent");
  loadDashboard();
}

function requestMoney() {
  toast("Request sent (backend coming)");
}

async function loadHistory() {
  const res = await fetch(`${API}/payment/history/${localStorage.getItem("email")}`);
  const tx = await res.json();
  history.innerHTML="";
  tx.forEach(t=>{
    const li=document.createElement("li");
    li.innerText=`${t.type} ₦${t.amount}`;
    history.appendChild(li);
  });
}

function logout() {
  localStorage.clear();
  location.reload();
}

window.onload = () => {
  if (localStorage.getItem("token")) loadDashboard();
};
