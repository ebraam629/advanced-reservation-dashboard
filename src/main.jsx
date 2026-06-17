import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx"; // الاستيراد الجديد

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          {" "}
          {/* التغليف الجديد */}
          <App />
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
