const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }

    const [users] = await db.query(
      "SELECT * FROM users WHERE Email = ?",
      [email]
    );

    if (users.length > 0) {
      return res.status(400).json({
        message: "Email đã tồn tại",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    await db.query(
      `INSERT INTO users
      (FullName, Email, PasswordHash)
      VALUES (?, ?, ?)`,
      [fullName, email, hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Lỗi server",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query(
      "SELECT * FROM users WHERE Email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({
        message: "Email không tồn tại",
      });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(
      password,
      user.PasswordHash
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Sai mật khẩu",
      });
    }

    const token = jwt.sign(
      {
        id: user.UserId,
        email: user.Email,
      },
      "taskflow_secret",
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.UserId,
        fullName: user.FullName,
        email: user.Email,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Lỗi server",
    });
  }
};

module.exports = {
  register,
  login,
};