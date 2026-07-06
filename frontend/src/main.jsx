import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./chartSetup"; // register Chart.js components once
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);