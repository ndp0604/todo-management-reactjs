import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const res = await login(
        email,
        password
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      navigate("/dashboard");
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Đăng nhập thất bại"
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
          Quản lý công việc
          <br />
          hiệu quả hơn
        </h1>

        <p>
          Theo dõi dự án, giao việc,
          quản lý tiến độ giống Jira.
        </p>

      </div>

      <div className="auth-right">

        <div className="auth-card">

          <h2>Đăng nhập</h2>

          <form
            onSubmit={handleLogin}
          >
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
              Đăng nhập
            </button>
          </form>

          <p className="switch-text">
            Chưa có tài khoản?
          </p>

          <Link
            to="/register"
            className="switch-btn"
          >
            Đăng ký ngay
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;