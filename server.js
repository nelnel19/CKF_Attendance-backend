import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

/* =========================
   MONGODB CONNECTION
========================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

/* =========================
   USER SCHEMA
========================= */
const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    age: { type: Number, required: true },
    address: { type: String, required: true },
    contactNo: { type: String, required: true },
    cellgroupLeader: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

/* =========================
   CREATE USER
========================= */
app.post("/api/users", async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: savedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* =========================
   GET ALL USERS (VIEW LIST)
========================= */
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* =========================
   START SERVER
========================= */
const PORT = 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);