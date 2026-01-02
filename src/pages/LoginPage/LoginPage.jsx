// src/pages/LoginPage/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../services/authService";
import styles from "./LoginPage.module.css"; // (קוד ה-CSS למטה)

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginAdmin(username, password);
      // אם הצליח - עבור לדף הניהול
      navigate("/admin");
    } catch (err) {
      setError("שם משתמש או סיסמה שגויים");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>כניסת מנהל מערכת</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>שם משתמש</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" disabled={loading} className={styles.btn}>
            {loading ? "מתחבר..." : "התחבר"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
