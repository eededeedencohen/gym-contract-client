import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
// import the OldApp. component:
import OldApp from "./pages/OldApp/OldApp.jsx";
import MainPage from "./pages/MainPage/MainPage.jsx";
import ContractPage from "./pages/ContractPage/ContractPage.jsx";

function App() {
  return (
    <>
      {/* Use the MainPage component */}
      <ContractPage />
    </>
  );
}

export default App;
