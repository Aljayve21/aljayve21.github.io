
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";

import "./index.css";
import { ToastProvider } from "./components/ui/ToastProvider";

import { HashRouter } from "react-router-dom";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>
);
