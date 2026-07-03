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
        {/* خانة التاريخ الزجاجية المنظمة والذكية */}
        <div
          onClick={() =>
            document.getElementById("hidden-date-picker").showPicker()
          }
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 14px",
            borderRadius: "8px",
            border: "1px solid var(--border-color)",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          {/* الأيقونة الشيك الثابتة */}
          <Calendar
            size={18}
            color="var(--primary)"
            style={{ pointerEvents: "none" }}
          />

          {/* نص التاريخ المنسق والنظيف */}
          <span
            style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "var(--text-main)",
              pointerEvents: "none",
            }}
          >
            {dateFilter}
          </span>

          {/* الـ input الحقيقي مخفي تماماً لمنع عيوب المتصفحات */}
          <input
            id="hidden-date-picker"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: 0, // مخفي 100% لكن قابل للضغط والتفاعل
              cursor: "pointer",
            }}
          />
        </div>

        {/* فلتر الحالة */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            backgroundColor: "#ffffff",
            color: "#0f172a",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid var(--border-color)",
            outline: "none",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
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
