/* eslint-disable */
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { Lock, User } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(username, password);
    if (!success) {
      setError(t.loginError);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "var(--background)",
        padding: "20px",
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: "400px",
          width: "100%",
          padding: "40px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "rgba(0, 240, 255, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px auto",
            color: "var(--primary)",
            border: "1px solid var(--primary)",
          }}
        >
          <Lock size={28} />
        </div>

        <h2
          style={{
            marginBottom: "30px",
            color: "var(--text-main)",
            fontWeight: "bold",
          }}
        >
          {t.loginTitle}
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <User
              size={18}
              color="var(--text-muted)"
              style={{ position: "absolute", margin: "0 12px" }}
            />
            <input
              type="text"
              placeholder={t.usernamePlaceholder}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 40px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "rgba(0,0,0,0.2)",
                color: "var(--text-main)",
                outline: "none",
              }}
            />
          </div>

          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Lock
              size={18}
              color="var(--text-muted)"
              style={{ position: "absolute", margin: "0 12px" }}
            />
            <input
              type="password"
              placeholder={t.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 40px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "rgba(0,0,0,0.2)",
                color: "var(--text-main)",
                outline: "none",
              }}
            />
          </div>

          {error && (
            <p
              style={{
                color: "#ff0055",
                fontSize: "14px",
                margin: 0,
                textAlign: "start",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              padding: "12px",
              backgroundColor: "var(--primary)",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "16px",
              boxShadow: "0 0 15px var(--primary)40",
              marginTop: "10px",
            }}
          >
            {t.loginBtn}
          </button>
        </form>
      </div>
    </div>
  );
}
