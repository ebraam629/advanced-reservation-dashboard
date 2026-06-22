/* eslint-disable */
import React from "react";
import { Check, Trash2, Edit } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function ReservationsTable({
  reservations = [],
  onDelete,
  onEdit,
  onToggleStatus,
}) {
  const { lang } = useLanguage();

  return (
    <div
      className="glass-card"
      style={{ borderRadius: "12px", overflowX: "auto", padding: "10px" }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: lang === "ar" ? "right" : "left",
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: "1px solid var(--border-color)",
              color: "var(--text-muted)",
            }}
          >
            <th style={{ padding: "12px" }}>
              {lang === "ar" ? "اسم المريض" : "Patient Name"}
            </th>
            <th style={{ padding: "12px" }}>
              {lang === "ar" ? "قيمة الكشف" : "Fees"}
            </th>
            <th style={{ padding: "12px" }}>
              {lang === "ar" ? "الحالة" : "Status"}
            </th>
            <th style={{ padding: "12px", textAlign: "center" }}>
              {lang === "ar" ? "إجراء سريع" : "Actions"}
            </th>
          </tr>
        </thead>
        <tbody>
          {reservations.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "var(--text-muted)",
                }}
              >
                {lang === "ar"
                  ? "لا توجد حجوزات لهذا اليوم بعد."
                  : "No bookings for today."}
              </td>
            </tr>
          ) : (
            reservations.map((res) => {
              const isConfirmed = res.status?.toLowerCase() === "confirmed";
              return (
                <tr
                  key={res.id}
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    backgroundColor: isConfirmed
                      ? "rgba(0, 255, 136, 0.03)"
                      : "transparent",
                  }}
                >
                  <td
                    style={{
                      padding: "12px",
                      fontWeight: "500",
                      textDecoration: isConfirmed ? "line-through" : "none",
                      color: isConfirmed
                        ? "var(--text-muted)"
                        : "var(--text-main)",
                    }}
                  >
                    {res.customerName}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      color: "var(--primary)",
                      fontWeight: "bold",
                    }}
                  >
                    {res.price} ج.م
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        backgroundColor: isConfirmed
                          ? "rgba(0, 255, 136, 0.1)"
                          : "rgba(255, 187, 0, 0.1)",
                        color: isConfirmed ? "#00ff88" : "#ffbb00",
                      }}
                    >
                      {isConfirmed
                        ? lang === "ar"
                          ? "تم الكشف"
                          : "Confirmed"
                        : lang === "ar"
                          ? "انتظار"
                          : "Pending"}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* 🌟 زرار علامة الصح السحرية السريعة */}
                      <button
                        onClick={() =>
                          onToggleStatus &&
                          onToggleStatus(
                            res.id,
                            isConfirmed ? "Pending" : "Confirmed",
                          )
                        }
                        title={isConfirmed ? "إرجاع للانتظار" : "تم الكشف"}
                        style={{
                          padding: "6px",
                          borderRadius: "6px",
                          border: "none",
                          backgroundColor: isConfirmed
                            ? "#00ff88"
                            : "rgba(255,255,255,0.05)",
                          color: isConfirmed ? "#000" : "#var(--text-main)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "0.2s",
                        }}
                      >
                        <Check size={16} />
                      </button>

                      <button
                        onClick={() => onEdit(res)}
                        style={{
                          padding: "6px",
                          borderRadius: "6px",
                          border: "none",
                          backgroundColor: "rgba(255,255,255,0.05)",
                          color: "#00e5ff",
                          cursor: "pointer",
                        }}
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => onDelete(res.id)}
                        style={{
                          padding: "6px",
                          borderRadius: "6px",
                          border: "none",
                          backgroundColor: "rgba(255, 0, 85, 0.1)",
                          color: "#ff0055",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReservationsTable;
