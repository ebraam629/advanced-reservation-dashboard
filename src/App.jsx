/* eslint-disable */
import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";
import { useLanguage } from "./context/LanguageContext"; // استيراد الـ لغة
import LoginPage from "./pages/LoginPage";
import StatsCards from "./components/StatsCards";
import FiltersBar from "./components/FiltersBar";
import ReservationsTable from "./components/ReservationsTable";
import ReservationModal from "./components/ReservationModal";
import { initialReservations } from "./mockData";
import { Sun, Moon, LayoutDashboard, Plus, Languages } from "lucide-react"; // ضفنا أيقونة لغات

function App() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLanguage, t } = useLanguage(); // تفعيل الـ لغة

  const [reservations, setReservations] = useState(initialReservations);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEditData, setSelectedEditData] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm(lang === "ar" ? "هل أنت متأكد؟" : "Are you sure?")) {
      setReservations((prev) => prev.filter((res) => res.id !== id));
    }
  };

  const handleOpenAddModal = () => {
    setSelectedEditData(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (resData) => {
    setSelectedEditData(resData);
    setIsModalOpen(true);
  };

  const handleSaveReservation = (data) => {
    if (selectedEditData) {
      setReservations((prev) =>
        prev.map((item) => (item.id === data.id ? data : item)),
      );
    } else {
      setReservations((prev) => [data, ...prev]);
    }
  };

  const filteredReservations = reservations.filter((res) => {
    const matchesSearch = res.customerName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || res.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!user) {
    return (
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            display: "flex",
            gap: "10px",
          }}
        >
          {/* زرار اللغة في صفحة الـ Login */}
          <button
            onClick={toggleLanguage}
            className="glass-card"
            style={{
              padding: "10px",
              cursor: "pointer",
              border: "none",
              color: "var(--primary)",
              fontWeight: "bold",
            }}
          >
            {lang === "ar" ? "English" : "عربي"}
          </button>
          <button
            onClick={toggleTheme}
            className="glass-card"
            style={{
              padding: "10px",
              cursor: "pointer",
              border: "none",
              color: "var(--primary)",
            }}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
        <LoginPage />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
      }}
    >
      {/* الـ Navbar */}
      <nav
        className="glass-card"
        style={{
          padding: "15px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "12px",
          marginBottom: "25px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <LayoutDashboard color="var(--primary)" />
          <h3 style={{ margin: 0, fontWeight: "bold" }}>{t.title}</h3>{" "}
          {/* ترجمة */}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            {t.welcome}،{" "}
            <strong style={{ color: "var(--primary)" }}>{user.username}</strong>
          </span>

          {/* زرار تحويل اللغة الجامد */}
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
            <Languages size={18} />
            {lang === "ar" ? "English" : "عربي"}
          </button>

          <button
            onClick={toggleTheme}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-main)",
            }}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
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

      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <StatsCards reservations={reservations} />

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
              marginBottom: "15px",
            }}
          >
            <button
              onClick={handleOpenAddModal}
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
              <Plus size={18} /> {t.addBtn}
            </button>
          </div>

          <FiltersBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </div>

        <ReservationsTable
          reservations={filteredReservations}
          onDelete={handleDelete}
          onEdit={handleOpenEditModal}
        />
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
