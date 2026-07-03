/* eslint-disable */
import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";
import { useLanguage } from "./context/LanguageContext";
import LoginPage from "./pages/LoginPage";
import StatsCards from "./components/StatsCards";
import FiltersBar from "./components/FiltersBar";
import ReservationsTable from "./components/ReservationsTable";
import ReservationModal from "./components/ReservationModal";
import * as XLSX from "xlsx"; // 🌟 استدعاء مكتبة الإكسيل
import { FileSpreadsheet, FileText } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Sun,
  Moon,
  LayoutDashboard,
  Plus,
  Languages,
  Menu,
  X,
  Settings,
  User,
  Activity,
  Shield,
  Mail,
  Edit2,
  Check,
  AlertCircle,
  Lock,
} from "lucide-react";

function App() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLanguage, t } = useLanguage();

  const localDate = new Date();
  const todayString = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`;

  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState(todayString);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEditData, setSelectedEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // 🎯 ستيتس مراقبة حالة السيرفر والإنترنت
  const [networkStatus, setNetworkStatus] = useState("connecting");

  // 🎯 ستيتس تعديل الاسم
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(
    user?.name || "Ebraaaaam Emiel Farouk",
  );
  const [nameUpdateLoading, setNameUpdateLoading] = useState(false);
  const [nameError, setNameError] = useState("");

  // 🎯 ستيتس تغيير الباسورد
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // تأثير لجلب الحجوزات وتجهيز الاسم ومراقبة الشبكة
  useEffect(() => {
    if (user && user.id) {
      fetchReservations();
      setNewName(user.name || "Ebraaaaam Emiel Farouk");

      const checkServer = async () => {
        try {
          const res = await fetch(
            "https://advanced-reservation-dashboard-pvqn.vercel.app/api/reservations",
          );
          if (res.ok) setNetworkStatus("online");
          else setNetworkStatus("offline");
        } catch {
          setNetworkStatus("offline");
        }
      };

      checkServer();
      const interval = setInterval(checkServer, 10000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  const fetchReservations = async () => {
    if (!user || !user.id) return;
    setLoading(true);
    try {
      const response = await fetch(
        "https://advanced-reservation-dashboard-pvqn.vercel.app/api/reservations",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "user-id": user.id,
          },
        },
      );
      if (response.ok) {
        const dbData = await response.json();
        const mappedData = dbData.map((res) => ({
          id: res.id,
          customerName: res.client_name,
          movieTitle: res.title || "كشف طبي",
          status: res.status || "Pending",
          date: res.date || todayString,
          price: parseFloat(res.price) || 0,
        }));
        setReservations(mappedData);
      }
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      setNameError(
        lang === "ar"
          ? "الاسم لا يمكن أن يكون فارغاً!"
          : "Name cannot be empty!",
      );
      return;
    }
    setNameUpdateLoading(true);
    setNameError("");
    try {
      const response = await fetch(
        `https://advanced-reservation-dashboard-pvqn.vercel.app/api/users/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName.trim() }),
        },
      );

      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errData = await response.json();
          setNameError(
            errData.message ||
              (lang === "ar" ? "فشل التحديث" : "Update failed"),
          );
        } else {
          const textError = await response.text();
          console.error("Server raw error:", textError);
          setNameError(lang === "ar" ? "خطأ من السيرفر" : "Server error");
        }
        return;
      }

      user.name = newName.trim();
      const localUserData = JSON.parse(localStorage.getItem("user") || "{}");
      localUserData.name = newName.trim();
      localStorage.setItem("user", JSON.stringify(localUserData));
      setIsEditingName(false);
      alert(
        lang === "ar" ? "تم تحديث الاسم بنجاح!" : "Name updated successfully!",
      );
    } catch (error) {
      console.error("Error updating name:", error);
      setNameError(lang === "ar" ? "حدث خطأ في الاتصال" : "Connection error");
    } finally {
      setNameUpdateLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(
        lang === "ar" ? "برجاء ملء جميع الحقول!" : "Please fill all fields!",
      );
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        lang === "ar"
          ? "الباسورد الجديد يجب أن لا يقل عن 6 أحرف!"
          : "New password must be at least 6 characters!",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        lang === "ar"
          ? "الباسورد الجديد غير متطابق مع حقل التأكيد!"
          : "New passwords do not match!",
      );
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await fetch(
        `https://advanced-reservation-dashboard-pvqn.vercel.app/api/users/${user.id}/change-password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            oldPassword: currentPassword,
            newPassword: newPassword,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setPasswordSuccess(
          lang === "ar"
            ? "تم تغيير كلمة المرور بنجاح!"
            : "Password changed successfully!",
        );
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(
          data.message ||
            (lang === "ar"
              ? "كلمة المرور القديمة غير صحيحة!"
              : "Incorrect old password!"),
        );
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordError(
        lang === "ar"
          ? "حدث خطأ في الاتصال بالسيرفر!"
          : "Server connection error!",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleToggleStatus = async (id, newStatus) => {
    if (!user || !user.id) return;
    try {
      const response = await fetch(
        `https://advanced-reservation-dashboard-pvqn.vercel.app/api/reservations/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus, user_id: user.id }),
        },
      );
      if (response.ok) {
        setReservations((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item,
          ),
        );
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const handleSaveReservation = async (data) => {
    if (!user || !user.id) return;
    const payload = {
      client_name: data.customerName || data.client_name,
      title: data.movieTitle || data.title || "كشف طبي",
      price: parseFloat(data.price) || 0,
      status: data.status || "Pending",
      date: data.date || todayString,
      user_id: user.id,
    };
    if (selectedEditData || data.id) {
      const targetId = data.id || selectedEditData.id;
      try {
        const response = await fetch(
          `https://advanced-reservation-dashboard-pvqn.vercel.app/api/reservations/${targetId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );
        if (response.ok) {
          fetchReservations();
          setIsModalOpen(false);
        }
      } catch (error) {
        console.error("Error updating:", error);
      }
    } else {
      try {
        const response = await fetch(
          "https://advanced-reservation-dashboard-pvqn.vercel.app/api/reservations",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );
        if (response.ok) {
          fetchReservations();
          setIsModalOpen(false);
        }
      } catch (error) {
        console.error("Error saving:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        lang === "ar" ? "هل أنت متأكد من حذف هذا الحجز؟" : "Are you sure?",
      )
    ) {
      try {
        const response = await fetch(
          `https://advanced-reservation-dashboard-pvqn.vercel.app/api/reservations/${id}`,
          {
            method: "DELETE",
          },
        );
        if (response.ok) {
          setReservations((prev) => prev.filter((res) => res.id !== id));
        }
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  const filteredReservations = reservations.filter((res) => {
    const matchesSearch = (res.customerName || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      res.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesDate = res.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  // 🟢 دالة تصدير البيانات إلى شيت Excel منظم
  const exportToExcel = () => {
    if (filteredReservations.length === 0) {
      alert(lang === "ar" ? "لا توجد بيانات لتصديرها!" : "No data to export!");
      return;
    }

    const dataToExport = filteredReservations.map((res, index) => ({
      [lang === "ar" ? "م" : "No."]: index + 1,
      [lang === "ar" ? "اسم المريض" : "Patient Name"]: res.customerName,
      [lang === "ar" ? "نوع الكشف" : "Service"]: res.movieTitle,
      [lang === "ar" ? "التاريخ" : "Date"]: res.date,
      [lang === "ar" ? "الحالة" : "Status"]: res.status,
      [lang === "ar" ? "قيمة الكشف" : "Fees"]: `${res.price} EGP`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      lang === "ar" ? "الحجوزات" : "Reservations",
    );
    XLSX.writeFile(workbook, `Clinic_Report_${dateFilter}.xlsx`);
  };

  // 🔴 دالة الطباعة الاحترافية الداعمة للعربي
  const exportToPDF = () => {
    if (filteredReservations.length === 0) {
      alert(lang === "ar" ? "لا توجد بيانات لطباعتها!" : "No data to print!");
      return;
    }
    window.print();
  };

  // 📊 دالة حساب الحجوزات الحقيقية لكل يوم من أيام الأسبوع (جوه الـ Component ومظبوطة)
  const getWeeklyChartData = () => {
    const daysNameAr = [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ];
    const counts = {
      السبت: 0,
      الأحد: 0,
      الإثنين: 0,
      الثلاثاء: 0,
      الأربعاء: 0,
      الخميس: 0,
      الجمعة: 0,
    };

    reservations.forEach((res) => {
      if (!res.date) return;
      const dateObj = new Date(res.date);
      const dayName = daysNameAr[dateObj.getDay()];
      if (counts[dayName] !== undefined) {
        counts[dayName] += 1;
      }
    });

    return [
      { name: "السبت", الحجوزات: counts["السبت"] },
      { name: "الأحد", الحجوزات: counts["الأحد"] },
      { name: "الإثنين", الحجوزات: counts["الإثنين"] },
      { name: "الثلاثاء", الحجوزات: counts["الثلاثاء"] },
      { name: "الأربعاء", الحجوزات: counts["الأربعاء"] },
      { name: "الخميس", الحجوزات: counts["الخميس"] },
      { name: "الجمعة", الحجوزات: counts["الجمعة"] },
    ];
  };

  if (!user) return <LoginPage />;
  const isRtl = lang === "ar";
  const isDark = theme === "dark";

  const colors = {
    textMain: isDark ? "#ffffff" : "#0f172a",
    textMuted: isDark ? "#94a3b8" : "#475569",
    bgSidebar: isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(241, 245, 249, 0.98)",
    bgInput: isDark ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255, 0.9)",
    border: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(15, 23, 42, 0.1)",
    cardBg: isDark ? "rgba(255, 255, 255, 0.03)" : "#ffffff",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        position: "relative",
        overflowX: "hidden",
        color: colors.textMain,
        transition: "color 0.3s ease, background-color 0.3s ease",
      }}
    >
      {/* الـ Sidebar الجانبي */}
      <div
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          right: isRtl ? (isSidebarOpen ? 0 : "-300px") : "auto",
          left: !isRtl ? (isSidebarOpen ? 0 : "-300px") : "auto",
          width: "280px",
          backgroundColor: colors.bgSidebar,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderLeft: isRtl ? `1px solid ${colors.border}` : "none",
          borderRight: !isRtl ? `1px solid ${colors.border}` : "none",
          zIndex: 999,
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          padding: "25px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          boxShadow: isSidebarOpen ? "0 0 30px rgba(0,0,0,0.1)" : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--primary)",
            }}
          >
            <Activity size={20} />
            <span style={{ fontWeight: "bold", color: colors.textMain }}>
              {isRtl ? "قائمة التحكم" : "Control Panel"}
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: colors.textMain,
            }}
          >
            <X size={20} />
          </button>
        </div>
        <hr
          style={{
            border: "0",
            borderTop: `1px solid ${colors.border}`,
            margin: "0",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            flex: 1,
          }}
        >
          <div
            onClick={() => {
              setActiveTab("dashboard");
              setIsSidebarOpen(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor:
                activeTab === "dashboard"
                  ? "rgba(var(--primary-rgb, 0, 229, 255), 0.15)"
                  : "transparent",
              color:
                activeTab === "dashboard" ? "var(--primary)" : colors.textMain,
              transition: "all 0.3s",
            }}
          >
            <LayoutDashboard size={18} />
            <span
              style={{
                fontWeight: activeTab === "dashboard" ? "bold" : "normal",
              }}
            >
              {isRtl ? "الرئيسية" : "Dashboard"}
            </span>
          </div>

          <div
            onClick={() => {
              setActiveTab("profile");
              setIsSidebarOpen(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor:
                activeTab === "profile"
                  ? "rgba(var(--primary-rgb, 0, 229, 255), 0.15)"
                  : "transparent",
              color:
                activeTab === "profile" ? "var(--primary)" : colors.textMain,
              transition: "all 0.3s",
            }}
          >
            <User size={18} />
            <span
              style={{
                fontWeight: activeTab === "profile" ? "bold" : "normal",
              }}
            >
              {isRtl ? "الملف الشخصي" : "Profile"}
            </span>
          </div>

          <div
            onClick={() => {
              setActiveTab("settings");
              setIsSidebarOpen(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor:
                activeTab === "settings"
                  ? "rgba(var(--primary-rgb, 0, 229, 255), 0.15)"
                  : "transparent",
              color:
                activeTab === "settings" ? "var(--primary)" : colors.textMain,
              transition: "all 0.3s",
            }}
          >
            <Settings size={18} />
            <span
              style={{
                fontWeight: activeTab === "settings" ? "bold" : "normal",
              }}
            >
              {isRtl ? "الإعدادات" : "Settings"}
            </span>
          </div>
        </div>
        <div
          style={{
            fontSize: "12px",
            color: colors.textMuted,
            textAlign: "center",
          }}
        >
          Smart Clinic v1.0
        </div>
      </div>

      {/* الـ Navigation Bar العلوي */}
      <nav
        className="glass-card"
        style={{
          padding: "15px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "12px",
          marginBottom: "25px",
          border: `1px solid ${colors.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button
            onClick={() => setIsSidebarOpen(true)}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: `1px solid ${colors.border}`,
              borderRadius: "8px",
              padding: "8px",
              cursor: "pointer",
            }}
          >
            <Menu size={20} color={colors.textMain} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <LayoutDashboard color="var(--primary)" />
            <h3
              style={{
                margin: 0,
                fontWeight: "bold",
                cursor: "pointer",
                color: colors.textMain,
              }}
              onClick={() => setActiveTab("dashboard")}
            >
              {lang === "ar"
                ? "لوحة تحكم العيادة الذكية"
                : "Smart Clinic Dashboard"}
            </h3>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {/* مؤشر حالة اتصال السيرفر الذكي */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.03)",
              padding: "6px 12px",
              borderRadius: "20px",
              border: `1px solid ${colors.border}`,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor:
                  networkStatus === "online"
                    ? "#10b981"
                    : networkStatus === "connecting"
                      ? "#f59e0b"
                      : "#ef4444",
                boxShadow:
                  networkStatus === "online"
                    ? "0 0 8px #10b981"
                    : networkStatus === "connecting"
                      ? "0 0 8px #f59e0b"
                      : "0 0 8px #ef4444",
                animate:
                  networkStatus === "connecting"
                    ? "pulse 1.5s infinite"
                    : "none",
              }}
            />
            <span
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                color: colors.textMuted,
              }}
            >
              {networkStatus === "online"
                ? lang === "ar"
                  ? "متصل"
                  : "Online"
                : networkStatus === "connecting"
                  ? lang === "ar"
                    ? "جاري الاتصال"
                    : "Connecting"
                  : lang === "ar"
                    ? "غير متصل"
                    : "Offline"}
            </span>
          </div>

          <span style={{ fontSize: "14px", color: colors.textMuted }}>
            {t.welcome}،{" "}
            <strong style={{ color: "var(--primary)" }}>
              {user.name || "Ebraaaaam Emiel Farouk"}
            </strong>
          </span>
          <button
            onClick={toggleLanguage}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontWeight: "bold",
            }}
          >
            <Languages size={18} /> {lang === "ar" ? "English" : "عربي"}
          </button>
          <button
            onClick={toggleTheme}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: colors.textMain,
            }}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={logout}
            style={{
              background: "rgba(255, 0, 85, 0.1)",
              border: "1px solid rgba(255, 0, 85, 0.2)",
              color: "#ff0055",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {t.logout}
          </button>
        </div>
      </nav>

      {/* محتوى الشاشات */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {activeTab === "dashboard" && (
          <>
            <StatsCards reservations={filteredReservations} />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginBottom: "5px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "15px",
                }}
              >
                <button
                  onClick={exportToExcel}
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "#10b981",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
                  }}
                  title={lang === "ar" ? "تصدير إلى إكسيل" : "Export to Excel"}
                >
                  <FileSpreadsheet size={18} />
                  {lang === "ar" ? "إكسيل" : "Excel"}
                </button>

                <button
                  onClick={exportToPDF}
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "#ef4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)",
                  }}
                  title={lang === "ar" ? "تصدير إلى PDF" : "Export to PDF"}
                >
                  <FileText size={18} />
                  {lang === "ar" ? "طباعة PDF" : "PDF"}
                </button>

                <button
                  onClick={() => {
                    setSelectedEditData(null);
                    setIsModalOpen(true);
                  }}
                  style={{
                    padding: "12px 20px",
                    backgroundColor: "var(--primary)",
                    color: "#000",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 0 15px var(--primary)40",
                  }}
                >
                  <Plus size={18} />{" "}
                  {lang === "ar" ? "حجز مريض جديد" : "New Patient Booking"}
                </button>
              </div>
              <FiltersBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
              />
            </div>
            {loading ? (
              <div
                style={{
                  textAlign: "center",
                  color: "var(--primary)",
                  padding: "40px",
                  fontWeight: "bold",
                }}
              >
                Loading Clinic Data...
              </div>
            ) : (
              <ReservationsTable
                reservations={filteredReservations}
                onDelete={handleDelete}
                onEdit={(resData) => {
                  setSelectedEditData(resData);
                  setIsModalOpen(true);
                }}
                onToggleStatus={handleToggleStatus}
              />
            )}

            {/* الرسم البياني الحقيقي والمربوط بالدالة */}
            <div
              style={{
                marginTop: "30px",
                padding: "20px",
                borderRadius: "12px",
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.border}`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                backdropFilter: "blur(8px)",
              }}
            >
              <h3
                style={{
                  margin: "0 0 20px 0",
                  fontSize: "16px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "var(--primary)",
                  }}
                />
                {lang === "ar"
                  ? "معدل الحجوزات الأسبوعي للعيادة"
                  : "Weekly Clinic Bookings Flow"}
              </h3>
              <div style={{ width: "100%", height: "260px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getWeeklyChartData()}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={
                        isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
                      }
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      stroke={colors.textMuted}
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis
                      stroke={colors.textMuted}
                      fontSize={12}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#1e293b" : "#ffffff",
                        borderColor: colors.border,
                        borderRadius: "8px",
                        color: colors.textMain,
                      }}
                    />
                    <Bar
                      dataKey="الحجوزات"
                      fill="url(#clinicNeonGradient)"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={45}
                    />
                    <defs>
                      <linearGradient
                        id="clinicNeonGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="var(--primary)"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="100%"
                          stopColor="var(--primary)"
                          stopOpacity={0.15}
                        />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {activeTab === "profile" && (
          <div
            className="glass-card"
            style={{
              padding: "30px",
              borderRadius: "12px",
              color: colors.textMain,
              maxWidth: "600px",
              margin: "0 auto",
              width: "100%",
              border: `1px solid ${colors.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginBottom: "25px",
              }}
            >
              <div
                style={{
                  padding: "20px",
                  backgroundColor:
                    "rgba(var(--primary-rgb, 0, 229, 255), 0.15)",
                  borderRadius: "50%",
                  border: "2px solid var(--primary)",
                  color: "var(--primary)",
                }}
              >
                <User size={40} />
              </div>
              <div style={{ flex: 1 }}>
                {!isEditingName ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <h2 style={{ margin: 0, color: colors.textMain }}>
                      {user.name || "Ebraaaaam Emiel Farouk"}
                    </h2>
                    <button
                      onClick={() => {
                        setIsEditingName(true);
                        setNameError("");
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--primary)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        padding: "4px",
                      }}
                    >
                      <Edit2 size={18} />
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      disabled={nameUpdateLoading}
                      style={{
                        backgroundColor: colors.bgInput,
                        border: "1px solid var(--primary)",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        color: colors.textMain,
                        outline: "none",
                        fontSize: "18px",
                        fontWeight: "bold",
                        width: "80%",
                      }}
                    />
                    <button
                      onClick={handleUpdateName}
                      disabled={nameUpdateLoading}
                      style={{
                        backgroundColor: "var(--primary)",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px",
                        cursor: "pointer",
                      }}
                    >
                      <Check size={16} color="#000" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false);
                        setNewName(user.name || "Ebraaaaam Emiel Farouk");
                      }}
                      disabled={nameUpdateLoading}
                      style={{
                        backgroundColor: "rgba(255,255,255,0.1)",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px",
                        cursor: "pointer",
                        color: colors.textMain,
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                {nameError && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      color: "#ff0055",
                      fontSize: "12px",
                      marginTop: "5px",
                    }}
                  >
                    <AlertCircle size={14} /> <span>{nameError}</span>
                  </div>
                )}
                <p style={{ margin: "5px 0 0", color: colors.textMuted }}>
                  {isRtl ? "مدير العيادة" : "Clinic Administrator"}
                </p>
              </div>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px",
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                <span
                  style={{
                    colors: colors.textMuted,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Mail size={16} /> {isRtl ? "اسم المستخدم:" : "Username:"}
                </span>
                <strong style={{ color: colors.textMain }}>
                  {user.username || "ebraamemiel@gmail.com"}
                </strong>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px",
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                <span
                  style={{
                    colors: colors.textMuted,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Shield size={16} /> {isRtl ? "الصلاحية:" : "Role:"}
                </span>
                <span style={{ color: "var(--primary)", fontWeight: "bold" }}>
                  Admin
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "25px",
              maxWidth: "600px",
              margin: "0 auto",
              width: "100%",
            }}
          >
            <div
              className="glass-card"
              style={{
                padding: "30px",
                borderRadius: "12px",
                color: colors.textMain,
                border: `1px solid ${colors.border}`,
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: colors.textMain,
                }}
              >
                <Settings color="var(--primary)" />{" "}
                {isRtl ? "إعدادات النظام" : "System Settings"}
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  <div>
                    <h4 style={{ margin: 0, color: colors.textMain }}>
                      {isRtl ? "اللغة الحالية" : "Current Language"}
                    </h4>
                    <small style={{ color: colors.textMuted }}>
                      {isRtl
                        ? "تغيير لغة الواجهة بالكامل"
                        : "Change interface language"}
                    </small>
                  </div>
                  <button
                    onClick={toggleLanguage}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${colors.border}`,
                      color: "var(--primary)",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    {lang === "ar" ? "English" : "عربي"}
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                  }}
                >
                  <div>
                    <h4 style={{ margin: 0, color: colors.textMain }}>
                      {isRtl ? "المظهر (Theme)" : "Theme Mode"}
                    </h4>
                    <small style={{ color: colors.textMuted }}>
                      {isRtl
                        ? "التبديل بين الوضع الداكن والمضيء"
                        : "Toggle dark and light mode"}
                    </small>
                  </div>
                  <button
                    onClick={toggleTheme}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${colors.border}`,
                      color: colors.textMain,
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    {isDark ? "Light Mode" : "Dark Mode"}
                  </button>
                </div>
              </div>
            </div>

            <div
              className="glass-card"
              style={{
                padding: "30px",
                borderRadius: "12px",
                color: colors.textMain,
                border: `1px solid ${colors.border}`,
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: colors.textMain,
                }}
              >
                <Lock color="var(--primary)" />{" "}
                {lang === "ar" ? "تغيير كلمة المرور" : "Change Password"}
              </h2>
              <form
                onSubmit={handleChangePassword}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <label style={{ fontSize: "14px", color: colors.textMuted }}>
                    {lang === "ar" ? "كلمة المرور الحالية" : "Current Password"}
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    style={{
                      padding: "10px",
                      borderRadius: "6px",
                      border: `1px solid ${colors.border}`,
                      backgroundColor: colors.bgInput,
                      color: colors.textMain,
                      outline: "none",
                    }}
                    placeholder="••••••••"
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <label style={{ fontSize: "14px", color: colors.textMuted }}>
                    {lang === "ar" ? "كلمة المرور الجديدة" : "New Password"}
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      padding: "10px",
                      borderRadius: "6px",
                      border: `1px solid ${colors.border}`,
                      backgroundColor: colors.bgInput,
                      color: colors.textMain,
                      outline: "none",
                    }}
                    placeholder="••••••••"
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <label style={{ fontSize: "14px", color: colors.textMuted }}>
                    {lang === "ar"
                      ? "تأكيد كلمة المرور الجديدة"
                      : "Confirm New Password"}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      padding: "10px",
                      borderRadius: "6px",
                      border: `1px solid ${colors.border}`,
                      backgroundColor: colors.bgInput,
                      color: colors.textMain,
                      outline: "none",
                    }}
                    placeholder="••••••••"
                  />
                </div>

                {passwordError && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      color: "#ff0055",
                      fontSize: "13px",
                    }}
                  >
                    <AlertCircle size={16} /> <span>{passwordError}</span>
                  </div>
                )}
                {passwordSuccess && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      color: "#00e5ff",
                      fontSize: "13px",
                    }}
                  >
                    <Check size={16} /> <span>{passwordSuccess}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={passwordLoading}
                  style={{
                    marginTop: "10px",
                    padding: "12px",
                    backgroundColor: "var(--primary)",
                    border: "none",
                    borderRadius: "6px",
                    color: "#000",
                    fontWeight: "bold",
                    cursor: passwordLoading ? "not-allowed" : "pointer",
                    opacity: passwordLoading ? 0.7 : 1,
                  }}
                >
                  {passwordLoading
                    ? lang === "ar"
                      ? "جاري الحفظ..."
                      : "Saving..."
                    : lang === "ar"
                      ? "تحديث كلمة المرور"
                      : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveReservation}
        editData={selectedEditData}
      />
    </div>
  );
}

export default App;
