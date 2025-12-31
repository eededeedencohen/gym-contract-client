// import React from "react";
// import styles from "./MainPage.module.css";

// const MainPage = () => {
//   return (
//     <div className={styles.mainPage}>
//       <div className={styles.header}>
//         <h1>Welcome to the Main Page</h1>
//       </div>
//       <div className={styles.content}>
//         <p>This is the main content area.</p>
//       </div>
//       <div className={styles.footer}>
//         <p>&copy; 2026 Gym Contract. All rights reserved.</p>
//       </div>
//     </div>
//   );
// };

// export default MainPage;

import React from "react";
import styles from "./MainPage.module.css";
import useProducts from "../../hooks/useProducts"; // 1. ייבוא ה-hook

const MainPage = () => {
  const { products } = useProducts(); // 2. שליפת המוצרים

  console.log("Products in MainPage:", products); // 3. הדפסה לקונסול לבדיקה

  return (
    <div className={styles.mainPage}>
      <div className={styles.header}>
        <h1>Welcome to the Main Page</h1>
      </div>
      <div className={styles.content}>
        <p>This is the main content area.</p>
        {/* אופציונלי: הדפסה זמנית על המסך לבדיקה */}
        <pre>{JSON.stringify(products, null, 2)}</pre>
      </div>
      <div className={styles.footer}>
        <p>&copy; 2026 Gym Contract. All rights reserved.</p>
      </div>
    </div>
  );
};

export default MainPage;
