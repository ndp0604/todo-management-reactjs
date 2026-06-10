import { useState } from "react";
import { Link } from "react-router-dom";
import { register } from "../services/authService";
import "../styles/auth.css";

function Register() {
  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await register(
        fullName,
        email,
        password
      );

      alert(
        "Đăng ký thành công"
      );

      setFullName("");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Đăng ký thất bại"
      );
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-left">

        <div className="brand">
          🚀 TaskFlow
        </div>

        <h1>
          Bắt đầu hành trình
          <br />
          quản lý công việc
        </h1>

        <p>
          Tạo tài khoản để quản lý
          dự án và cộng tác nhóm.
        </p>

      </div>

      <div className="auth-right">

        <div className="auth-card">

          <h2>Đăng ký</h2>

          <form
            onSubmit={
              handleRegister
            }
          >
            <input
              type="text"
              placeholder="Họ tên"
              value={fullName}
              onChange={(e) =>
                setFullName(
                  e.target.value
                )
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            <button type="submit">
              Đăng ký
            </button>
          </form>

          <p className="switch-text">
            Đã có tài khoản?
          </p>

          <Link
            to="/"
            className="switch-btn"
          >
            Đăng nhập
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;