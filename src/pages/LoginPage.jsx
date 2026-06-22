/* eslint-disable */
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import {
  Lock,
  Mail,
  User,
  Sun,
  Moon,
  Languages,
  Menu,
  X,
  Settings,
  Check,
  LogOut,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Plus,
  Search,
} from "lucide-react";

function LoginPage() {
  const { user, login, logout, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLanguage } = useLanguage();

  // ستيتس صفحة اللوجن والساين أب
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🎯 ستيتس القائمة الجانبية للإعدادات وتعديل البيانات
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editUsername, setEditUsername] = useState(user?.username || "");
  const [settingsMessage, setSettingsMessage] = useState("");

  const text = {
    ar: {
      signIn: "تسجيل الدخول",
      signUp: "إنشاء حساب جديد",
      welcomeBack: "مرحباً بك مجدداً، أدخل بياناتك للدخول",
      createAccount: "قم بملء البيانات لإنشاء حساب عيادة جديد",
      nameLabel: "الاسم بالكامل",
      emailLabel: "البريد الإلكتروني",
      passLabel: "كلمة المرور",
      btnSignIn: "دخول مباشر",
      btnSignUp: "تسجيل الحساب",
      noAccount: "ليس لديك حساب؟ أنشئ حساباً جديداً",
      hasAccount: "لديك حساب بالفعل؟ سجل دخولك",
      settingsTitle: "إعدادات الحساب",
      saveSettings: "حفظ التعديلات",
      successUpdate: "تم تحديث البيانات بنجاح!",
    },
    en: {
      signIn: "Sign In",
      signUp: "Create Account",
      welcomeBack: "Welcome back, enter details to log in",
      createAccount: "Fill in the details to create a new clinic account",
      nameLabel: "Full Name",
      emailLabel: "Email Address",
      passLabel: "Password",
      btnSignIn: "Sign In",
      btnSignUp: "Sign Up",
      noAccount: "Don't have an account? Create one",
      hasAccount: "Already have an account? Sign In",
      settingsTitle: "Account Settings",
      saveSettings: "Save Changes",
      successUpdate: "Settings updated successfully!",
    },
  };

  const t = lang === "ar" ? text.ar : text.en;
  const isRtl = lang === "ar";

  // تحديث حقول الإعدادات فوراً لو بيانات اليوزر اتغيرت
  useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      setEditUsername(user.username || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = isSignUp
      ? "http://localhost:5000/api/auth/signup"
      : "http://localhost:5000/api/auth/signin";

    const payload = isSignUp
      ? { name, username: email, password }
      : { username: email, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user);
      } else {
        setError(data.message || "حدث خطأ ما، حاول مجدداً");
      }
    } catch (err) {
      setError("تعذر الاتصال بالسيرفر، تأكد من تشغيله!");
    } finally {
      setLoading(false);
    }
  };

  // 🎯 دالة حفظ تعديل الـ Username والاسم الجديد في السيرفر
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettingsMessage("");

    if (!user?.id) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editName,
            username: editUsername,
          }),
        },
      );

      if (response.ok) {
        updateUser({ name: editName, username: editUsername });
        setSettingsMessage(t.successUpdate);
        setTimeout(() => setSettingsMessage(""), 3000);
      } else {
        alert("فشل تحديث البيانات في السيرفر");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const inputStyle = {
    width: "100%",
    paddingTop: "12px",
    paddingBottom: "12px",
    paddingRight: isRtl ? "42px" : "15px",
    paddingLeft: isRtl ? "15px" : "42px",
    borderRadius: "10px",
    border:
      theme === "dark"
        ? "1px solid rgba(255, 255, 255, 0.25)"
        : "1px solid rgba(0, 0, 0, 0.15)",
    backgroundColor:
      theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
    color: theme === "dark" ? "#fff" : "#000",
    fontSize: "15px",
    outline: "none",
    direction: isRtl ? "rtl" : "ltr",
    boxSizing: "border-box",
  };

  const iconStyle = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    [isRtl ? "right" : "left"]: "14px",
    color: "#94a3b8",
    pointerEvents: "none",
  };

  return (
    <div
      className="login-page-container"
      style={{
        minHeight: "100vh",
        padding: "20px",
        position: "relative",
        direction: isRtl ? "rtl" : "ltr",
        boxSizing: "border-box",
        backgroundColor: theme === "dark" ? "#0b0f19" : "#f1f5f9",
        color: theme === "dark" ? "#fff" : "#000",
        transition: "background-color 0.3s ease",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 🌐 الـ Navbar العلوية الذكية */}
      {user ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: theme === "dark" ? "#111827" : "#fff",
            padding: "15px 25px",
            borderRadius: "16px",
            border:
              theme === "dark"
                ? "1px solid rgba(255,255,255,0.05)"
                : "1px solid rgba(0,0,0,0.05)",
            marginBottom: "30px",
          }}
        >
          {/* اللوجو والاسم على الشمال */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                backgroundColor: "rgba(6, 182, 212, 0.1)",
                padding: "8px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Settings size={24} color="#06b6d4" />
            </div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                margin: 0,
                color: theme === "dark" ? "#fff" : "#000",
              }}
            >
              Smart Clinic Dashboard
            </h2>
          </div>

          {/* 🎯 عناصر التحكم العلوية على اليمين جمب الـ Logout بالظبط */}
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <span style={{ color: "#94a3b8", fontSize: "14px" }}>
              Welcome,{" "}
              <strong style={{ color: "#06b6d4" }}>{user?.name}</strong>
            </span>

            {/* ☰ زرار الـ 3 شرط للإعدادات */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                cursor: "pointer",
                color: "#06b6d4",
                padding: "8px 12px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              title="Account Settings"
            >
              <Menu size={20} />
            </button>

            {/* زرار اللغة */}
            <button
              onClick={toggleLanguage}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#06b6d4",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              <Languages size={16} /> {isRtl ? "English" : "عربي"}
            </button>

            {/* زرار المود */}
            <button
              onClick={toggleTheme}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#94a3b8",
              }}
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* زرار الـ Logout */}
            <button
              onClick={logout}
              style={{
                backgroundColor: "#ef4444",
                color: "#fff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      ) : (
        /* زرار المود واللغة لصفحة اللوجن قبل تسجيل الدخول */
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: isRtl ? "auto" : "20px",
            left: isRtl ? "20px" : "auto",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            zIndex: 10,
          }}
        >
          <button
            onClick={toggleLanguage}
            style={{
              background:
                theme === "dark"
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(0, 0, 0, 0.05)",
              border:
                theme === "dark"
                  ? "1px solid rgba(255,255,255,0.15)"
                  : "1px solid rgba(0,0,0,0.1)",
              backdropFilter: "blur(10px)",
              cursor: "pointer",
              color: "#06b6d4",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "8px 14px",
              borderRadius: "20px",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            <Languages size={16} /> {isRtl ? "English" : "عربي"}
          </button>
          <button
            onClick={toggleTheme}
            style={{
              background:
                theme === "dark"
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(0, 0, 0, 0.05)",
              border:
                theme === "dark"
                  ? "1px solid rgba(255,255,255,0.15)"
                  : "1px solid rgba(0,0,0,0.1)",
              backdropFilter: "blur(10px)",
              cursor: "pointer",
              color: theme === "dark" ? "#fff" : "#000",
              padding: "8px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      )}

      {/* 🚪 القائمة الجانبية المنسدلة للإعدادات (Sidebar Drawer) */}
      <div
        style={{
          position: "fixed",
          top: 0,
          [isRtl ? "right" : "left"]: isSidebarOpen ? 0 : "-350px",
          width: "320px",
          height: "100vh",
          backgroundColor:
            theme === "dark"
              ? "rgba(15, 23, 42, 0.98)"
              : "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(20px)",
          borderLeft:
            isRtl && theme === "dark"
              ? "1px solid rgba(255,255,255,0.1)"
              : "none",
          borderRight:
            !isRtl && theme === "dark"
              ? "1px solid rgba(255,255,255,0.1)"
              : "none",
          boxShadow: "0 0 40px rgba(0,0,0,0.5)",
          zIndex: 100,
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          padding: "30px 20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "25px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#06b6d4",
            }}
          >
            <Settings size={20} />
            <h3
              style={{
                margin: 0,
                fontSize: "18px",
                fontWeight: "bold",
                color: theme === "dark" ? "#fff" : "#000",
              }}
            >
              {t.settingsTitle}
            </h3>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
            }}
          >
            <X size={22} />
          </button>
        </div>

        {settingsMessage && (
          <div
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              border: "1px solid #10b981",
              color: "#10b981",
              padding: "10px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Check size={16} /> {settingsMessage}
          </div>
        )}

        <form
          onSubmit={handleSaveSettings}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "6px",
                color: "#94a3b8",
              }}
            >
              {t.nameLabel}
            </label>
            <div style={{ position: "relative" }}>
              <User size={18} style={iconStyle} />
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "6px",
                color: "#94a3b8",
              }}
            >
              {t.emailLabel} (Username)
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={18} style={iconStyle} />
              <input
                type="email"
                required
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#06b6d4",
              color: "#000",
              border: "none",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "10px",
              boxShadow: "0 4px 15px rgba(6,182,212,0.3)",
            }}
          >
            {t.saveSettings}
          </button>
        </form>
      </div>

      {/* خلفية معتمة خفيفة عند فتح السايد بار */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 99,
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* 🚪 عرض صفحة اللوجن لو مفيش يوزر مسجل دخول */}
      {!user ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1, // دي بتجبر الحاوية تملأ المساحة المتاحة بالكامل وتجيب الكارد في المنتصف العمودي
          }}
        >
          <div
            className="glass-card"
            style={{
              width: "100%",
              maxWidth: "450px",
              padding: "40px 30px",
              borderRadius: "24px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
              textAlign: "center",
              backgroundColor: theme === "dark" ? "#111827" : "#ffffff",
              border:
                theme === "dark"
                  ? "1px solid rgba(255,255,255,0.05)"
                  : "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "rgba(6, 182, 212, 0.1)",
                border: "1px solid rgba(6, 182, 212, 0.2)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <Lock size={28} color="#06b6d4" />
            </div>

            <h2
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                marginBottom: "8px",
                color: theme === "dark" ? "#fff" : "#000",
              }}
            >
              {isSignUp ? t.signUp : t.signIn}
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#94a3b8",
                marginBottom: "30px",
              }}
            >
              {isSignUp ? t.createAccount : t.welcomeBack}
            </p>

            {error && (
              <div
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid #ef4444",
                  color: "#ef4444",
                  padding: "10px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  marginBottom: "20px",
                  fontWeight: "bold",
                }}
              >
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                textAlign: isRtl ? "right" : "left",
              }}
            >
              {isSignUp && (
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      marginBottom: "6px",
                      color: "#94a3b8",
                    }}
                  >
                    {t.nameLabel}
                  </label>
                  <div style={{ position: "relative" }}>
                    <User size={18} style={iconStyle} />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isRtl ? "د. إبرام رامي" : "Dr. Ebraam"}
                      style={inputStyle}
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    marginBottom: "6px",
                    color: "#94a3b8",
                  }}
                >
                  {t.emailLabel}
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={18} style={iconStyle} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    marginBottom: "6px",
                    color: "#94a3b8",
                  }}
                >
                  {t.passLabel}
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={18} style={iconStyle} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={inputStyle}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: "#06b6d4",
                  color: "#000",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: loading ? "not-allowed" : "pointer",
                  marginTop: "10px",
                  boxShadow: "0 4px 15px rgba(6,182,212,0.3)",
                }}
              >
                {loading ? "..." : isSignUp ? t.btnSignUp : t.btnSignIn}
              </button>
            </form>

            <div style={{ marginTop: "25px" }}>
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#06b6d4",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  textDecoration: "underline",
                }}
              >
                {isSignUp ? t.hasAccount : t.noAccount}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 📊 هنا الكود الأساسي بتاع الداشبورد بتاعك بيكمل زي ما هو */
        <div style={{ marginTop: "20px" }}>
          {/* كود الـ Total Bookings والـ Confirmed وجدول الحجوزات بتاعك يفضل هنا زي ما هو */}
        </div>
      )}
    </div>
  );
}

export default LoginPage;
