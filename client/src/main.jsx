import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ingestCallback } from "./auth.js";
import "./styles/index.css";

// Handle the Google OAuth return BEFORE React mounts, so there's no
// timing window. If a token is present, store it and rewrite the URL
// to the dashboard before the app renders.
if (window.location.hash.startsWith("#/auth-callback")) {
  const ok = ingestCallback();
  window.location.replace(
    window.location.origin + "/" + (ok ? "#/dashboard" : "#/login")
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
