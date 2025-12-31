import React from "react";
import styles from "./MainPage.module.css";

const MainPage = () => {
  return (
    <div className={styles.mainPage}>
      <div className={styles.header}>
        <h1>Welcome to the Main Page</h1>
      </div>
      <div className={styles.content}>
        <p>This is the main content area.</p>
      </div>
      <div className={styles.footer}>
        <p>&copy; 2026 Gym Contract. All rights reserved.</p>
      </div>
    </div>
  );
};

export default MainPage;
