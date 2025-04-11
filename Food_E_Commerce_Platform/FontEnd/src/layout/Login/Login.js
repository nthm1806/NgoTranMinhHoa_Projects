import { useState } from "react";
import { useAuth } from "../../globalContext/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import Footer from "../Footer/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const result = login(email, password);
    if (result.success) {
      navigate("/"); // Chuyển hướng về trang chủ sau khi đăng nhập
    } else {
      setError(result.message);
    }
  };
  function hanllll() {
    logout();
    navigate("/");
  }
  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1>Đăng nhập</h1>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Đăng nhập
          </button>
          <button
            type="button"
            className={styles.registerButton}
            onClick={() => navigate("/register")}
          >
            Đăng ký
          </button>
          <button onClick={() => hanllll()}> âBC</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
