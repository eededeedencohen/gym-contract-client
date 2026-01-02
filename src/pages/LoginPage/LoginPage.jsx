// // src/pages/LoginPage/LoginPage.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { loginAdmin } from "../../services/authService";
// import styles from "./LoginPage.module.css"; // (קוד ה-CSS למטה)

// const LoginPage = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       await loginAdmin(username, password);
//       // אם הצליח - עבור לדף הניהול
//       navigate("/admin");
//     } catch (err) {
//       setError("שם משתמש או סיסמה שגויים");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.card}>
//         <h2>כניסת מנהל מערכת</h2>
//         <form onSubmit={handleSubmit}>
//           <div className={styles.inputGroup}>
//             <label>שם משתמש</label>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//             />
//           </div>
//           <div className={styles.inputGroup}>
//             <label>סיסמה</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           {error && <div className={styles.error}>{error}</div>}
//           <button type="submit" disabled={loading} className={styles.btn}>
//             {loading ? "מתחבר..." : "התחבר"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../services/authService";
import styles from "./LoginPage.module.css";
import LogoImage from "../../assets/images/shekel-logo.png"; // וודא שהנתיב נכון

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
      navigate("/admin");
    } catch (err) {
      setError("שם משתמש או סיסמה שגויים");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* עיגולים דקורטיביים ברקע */}
      <div className={styles.circle1}></div>
      <div className={styles.circle2}></div>

      <div className={styles.card}>
        <div className={styles.logoWrapper}>
          <img src={LogoImage} alt="Shekel Logo" className={styles.logo} />
        </div>

        <h2 className={styles.title}>כניסת מנהל מערכת</h2>
        <p className={styles.subtitle}>ניהול חוזי חדר כושר</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>שם משתמש</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="הקלד שם משתמש"
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="הקלד סיסמה"
              className={styles.input}
            />
          </div>

          {error && <div className={styles.error}>⚠️ {error}</div>}

          <button type="submit" disabled={loading} className={styles.btn}>
            {loading ? "מתחבר..." : "התחבר למערכת"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
