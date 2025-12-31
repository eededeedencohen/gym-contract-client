import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { ProductContextProvider2 } from "./context/ProductContext2";
import { GymMemberProvider } from "./context/GymMemberContext.jsx"; // ייבוא הפרוביידר החדש


import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <GymMemberProvider>
        <ProductContextProvider2>
          <App />
        </ProductContextProvider2>
      </GymMemberProvider>
    </BrowserRouter>
  </StrictMode>
);
