require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");

const app = express();

/* Middleware */
app.use(cors());
app.use(express.json());

/* Test MySQL */
db.query("SELECT 1")
  .then(() => {
    console.log("✅ MySQL Connected");
  })
  .catch((err) => {
    console.log("❌ MySQL Error:", err);
  });

/* Home Route */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Todo Management API Running",
  });
});

/* Auth Routes */
app.use("/api/auth", authRoutes);

/* Project Routes */
app.use("/api/projects", projectRoutes);

/* 404 Route */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Not Found",
  });
});

/* Global Error Handler */
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

/* Start Server */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});