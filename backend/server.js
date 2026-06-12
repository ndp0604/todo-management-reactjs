require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
// [FIX 1] Bổ sung thêm Route cho Dashboard để hết lỗi 404 Not Found
const dashboardRoutes = require("./routes/dashboardRoutes"); 

const app = express();

/* Middleware */
app.use(cors());
app.use(express.json());

/* Test MySQL Connection */
// Đồng bộ kiểm tra bằng phương thức execute của mysql2/promise
db.execute("SELECT 1")
  .then(() => {
    console.log("✅ MySQL Kết nối thành công chuẩn Promise!");
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối MySQL (Kiểm tra lại config/db.js hoặc XAMPP):", err.message);
  });

/* Home Route */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Todo Management API Running",
  });
});

/* Đăng ký các API Routes vào hệ thống */
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// [FIX 2] Kích hoạt tuyến đường Dashboard kết nối đến DashboardController
app.use("/api/dashboard", dashboardRoutes);

/* 404 Route Handler - Xử lý khi frontend gọi sai URL */
app.use((req, res) => {
  console.warn(`⚠️ Yêu cầu API bị lỗi 404 tại địa chỉ: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `API Not Found: Lỗi định tuyến không tồn tại địa chỉ ${req.originalUrl}`,
  });
});

/* Global Error Handler - Nơi bắt các lỗi sập 500 của Controller */
app.use((err, req, res, next) => {
  console.error("🚨 Lỗi hệ thống Backend nghiêm trọng (Gây lỗi 500):", err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message // Trả thêm dòng này về F12 console để bạn biết chính xác lỗi SQL là gì
  });
});

/* Start Server */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("\n==================================================");
  console.log(` 🚀 SERVER NODE.JS ĐANG CHẠY TẠI PORT: ${PORT}`);
  console.log(` 🔗 API URL mặc định: http://localhost:${PORT}`);
  console.log("==================================================\n");
});