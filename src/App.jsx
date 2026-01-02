// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// // import the OldApp. component:
// import OldApp from "./pages/OldApp/OldApp.jsx";
// import MainPage from "./pages/MainPage/MainPage.jsx";
// import ContractPage from "./pages/ContractPage/ContractPage.jsx";
// import AdminPage from "./pages/AdminPage/AdminPage.jsx";

// function App() {
//   return (
//     <>
//       {/* Use the MainPage component */}
//       <ContractPage />
//     </>
//   );
// }

// export default App;

// src/App.jsx
// src/App.jsx
import React from "react";
// שינוי 1: הסרנו את BrowserRouter מהייבוא כי הוא כבר קיים ב-main.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import ContractPage from "./pages/ContractPage/ContractPage.jsx";
import AdminPage from "./pages/AdminPage/AdminPage.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import { isAuthenticated } from "./services/authService";

// רכיב "שומר סף" - מגן על נתיבים סגורים
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    // שינוי 2: הסרנו את התגית <Router> שעטפה הכל
    <Routes>
      {/* נתיב ציבורי - טופס החוזה (דף הבית) */}
      <Route path="/" element={<ContractPage />} />

      {/* נתיב ציבורי - דף התחברות */}
      <Route path="/login" element={<LoginPage />} />

      {/* נתיב מוגן - פאנל ניהול */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />

      {/* ניתוב ברירת מחדל - למקרה של שגיאה בכתובת */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
