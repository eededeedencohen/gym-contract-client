import { useState } from 'react'
// 1. החזרתי את הייבוא של התמונות - אחרת הקוד ייפול כי המשתנים לא קיימים
import reactLogo from "../../assets/react.svg"
import viteLogo from "/vite.svg" 

// הייבוא של המודול (מצוין)
import styles from './OldApp.module.css';

function OldApp() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          {/* 2. במקום מחרוזת, ניגשים למאפיין באובייקט styles */}
          <img src={viteLogo} className={styles.logo} alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          {/* 3. טריק חשוב: כשיש שני קלאסים, צריך להשתמש ב-Template Literal */}
          <img src={reactLogo} className={`${styles.logo} ${styles.react}`} alt="React logo" />
        </a>
      </div>
      <h1>Vitdddde + React</h1>
      
      {/* 4. שינוי לקלאס יחיד */}
      <div className={styles.card}>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      
      {/* 5. קלאס עם מקף (-) בשם: חייבים להשתמש בסוגריים מרובעים וגרשיים */}
      <p className={styles['read-the-docs']}>
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default OldApp