import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

/* =======================
   DATABASE
======================= */
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));

/* =======================
   MODELS
======================= */
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  balance: { type: Number, default: 0 }
});

const TxSchema = new mongoose.Schema({
  type: String,
  amount: Number,
  from: String,
  to: String,
  date: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema);
const Transaction = mongoose.model("Transaction", TxSchema);

/* =======================
   AUTH
======================= */
app.post("/auth/register", async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password) return res.json({ error: "All fields required" });

  const exists = await User.findOne({ email });
  if(exists) return res.json({ error: "User already exists" });

  await User.create({ email, password });
  res.json({ message: "Account created successfully" });
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if(!user) return res.json({ error: "Invalid login" });

  res.json({ email: user.email, balance: user.balance });
});

/* =======================
   SEND MONEY
======================= */
app.post("/wallet/send", async (req, res) => {
  const { fromEmail, toEmail, amount } = req.body;
  const from = await User.findOne({ email: fromEmail });
  const to = await User.findOne({ email: toEmail });

  if(!from || !to) return res.json({ error: "User not found" });
  if(from.balance < amount) return res.json({ error: "Insufficient funds" });

  from.balance -= amount;
  to.balance += amount;

  await from.save();
  await to.save();

  await Transaction.create({
    type: "transfer",
    amount,
    from: fromEmail,
    to: toEmail
  });

  res.json({ message: "Transfer successful" });
});

/* =======================
   ADD MONEY (PAYSTACK)
======================= */
app.post("/wallet/add/init", async (req, res) => {
  const { email, amount } = req.body;

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      amount: amount * 100
    })
  });

  const data = await response.json();
  res.json(data);
});

/* =======================
   PAYSTACK VERIFY
======================= */
app.get("/wallet/add/verify/:ref", async (req, res) => {
  const ref = req.params.ref;

  const response = await fetch(`https://api.paystack.co/transaction/verify/${ref}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` }
  });

  const result = await response.json();
  if(result.data.status === "success") {
    const user = await User.findOne({ email: result.data.customer.email });
    user.balance += result.data.amount / 100;
    await user.save();

    await Transaction.create({
      type: "deposit",
      amount: result.data.amount / 100,
      to: user.email
    });
  }

  res.json(result);
});

/* =======================
   WITHDRAW
======================= */
app.post("/wallet/withdraw", async (req, res) => {
  const { email, amount } = req.body;
  const user = await User.findOne({ email });

  if(user.balance < amount) return res.json({ error: "Insufficient balance" });

  user.balance -= amount;
  await user.save();

  await Transaction.create({
    type: "withdraw",
    amount,
    from: email
  });

  res.json({ message: "Withdrawal requested" });
});

/* =======================
   HISTORY
======================= */
app.get("/wallet/history/:email", async (req, res) => {
  const email = req.params.email;
  const tx = await Transaction.find({
    $or: [{ from: email }, { to: email }]
  }).sort({ date: -1 });

  res.json(tx);
});

/* =======================
   REFUND
======================= */
app.post("/wallet/refund/request", async (req, res) => {
  res.json({ message: "Refund request received" });
});

/* =======================
   SERVER
======================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));

  })
  .then(r => r.json())
  .then(d => msg.innerText = d.message || d.error);
}

