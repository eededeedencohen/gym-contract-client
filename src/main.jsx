import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { ProductContextProvider2 } from "./context/ProductContext2";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ProductContextProvider2>
        <App />
      </ProductContextProvider2>
    </BrowserRouter>
  </StrictMode>
);
