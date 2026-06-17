/* eslint-disable */
import { Search, Filter } from "lucide-react";
import { useLanguage } from "../context/LanguageContext"; // استيراد

export default function FiltersBar({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) {
  const { t } = useLanguage(); // استخدام الـ قاموس

  return (
    <div
      className="glass-card"
      style={{
        padding: "15px 20px",
        marginBottom: "20px",
        display: "flex",
        flexWrap: "wrap",
        gap: "15px",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flex: "1",
          minWidth: "250px",
          position: "relative",
        }}
      >
        {/* شيلنا الـ position المكتوب يدوي عشان يمشي مع الاتجاهين */}
        <Search
          size={18}
          color="var(--text-muted)"
          style={{ position: "absolute", margin: "0 12px" }}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t.searchPlaceholder} // ترجمة
          style={{
            width: "100%",
            padding: "10px 40px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "rgba(0,0,0,0.1)",
            color: "var(--text-main)",
            outline: "none",
            fontSize: "14px",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          minWidth: "180px",
        }}
      >
        <Filter size={18} color="var(--text-muted)" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "var(--background)",
            color: "var(--text-main)",
            outline: "none",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          <option value="all">{t.allReservations}</option>
          <option value="confirmed">{t.confirmed}</option>
          <option value="pending">{t.pending}</option>
          <option value="completed">{t.completed}</option>
          <option value="cancelled">{t.cancelled}</option>
        </select>
      </div>
    </div>
  );
}
