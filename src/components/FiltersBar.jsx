/* eslint-disable */
import React from "react";
import { Search, Calendar } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function FiltersBar({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
}) {
  const { lang } = useLanguage();
  const getTodayString = () => new Date().toLocaleDateString("fr-CA");

  // ستايل موحد للخيارات عشان الكلام يبان أسود على خلفية بيضاء
  const optionStyle = {
    backgroundColor: "#ffffff",
    color: "#0f172a",
  };

  return (
    <div
      className="glass-card"
      style={{
        padding: "15px 20px",
        borderRadius: "12px",
        display: "flex",
        flexWrap: "wrap",
        gap: "15px",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "20px",
      }}
    >
      {/* خانة البحث */}
      <div
        style={{ display: "flex", gap: "10px", flex: "1", minWidth: "250px" }}
      >
        <div style={{ position: "relative", width: "100%" }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              left: lang === "ar" ? "auto" : "12px",
              right: lang === "ar" ? "12px" : "auto",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
            }}
          />
          <input
            type="text"
            placeholder={
              lang === "ar" ? "ابحث عن اسم المريض..." : "Search patient name..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 15px",
              paddingLeft: lang === "ar" ? "15px" : "40px",
              paddingRight: lang === "ar" ? "40px" : "15px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              color: "var(--text-main)",
              outline: "none",
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center",
        }}
      >
        {/* خانة التاريخ */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Calendar size={18} color="var(--primary)" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              color: "var(--text-main)",
              cursor: "pointer",
              outline: "none",
            }}
          />
        </div>

        {/* فلتر الحالة */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            backgroundColor: "#ffffff", // خليناه أبيض عشان يليق مع لوحة التحكم البيضاء
            color: "#0f172a", // لون النص الأساسي للـ select
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid var(--border-color)",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="all" style={optionStyle}>
            {lang === "ar" ? "كل الحالات" : "All Status"}
          </option>
          <option value="confirmed" style={optionStyle}>
            {lang === "ar" ? "مؤكد" : "Confirmed"}
          </option>
          <option value="pending" style={optionStyle}>
            {lang === "ar" ? "قيد الانتظار" : "Pending"}
          </option>
          <option value="cancelled" style={optionStyle}>
            {lang === "ar" ? "ملغي" : "Cancelled"}
          </option>
        </select>
      </div>
    </div>
  );
}

export default FiltersBar;
