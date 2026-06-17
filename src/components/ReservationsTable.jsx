/* eslint-disable */
import { Trash2, Edit, AlertCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext"; // استيراد

export default function ReservationsTable({ reservations, onDelete, onEdit }) {
  const { t } = useLanguage(); // استخدام

  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed":
        return {
          bg: "rgba(0, 240, 255, 0.1)",
          color: "var(--primary)",
          label: t.confirmed,
        };
      case "pending":
        return {
          bg: "rgba(234, 179, 8, 0.1)",
          color: "#eab308",
          label: t.pending,
        };
      case "completed":
        return {
          bg: "rgba(16, 185, 129, 0.1)",
          color: "#10b981",
          label: t.completed,
        };
      case "cancelled":
        return {
          bg: "rgba(239, 68, 110, 0.1)",
          color: "#ef4444",
          label: t.cancelled,
        };
      default:
        return { bg: "gray", color: "white", label: status };
    }
  };

  if (reservations.length === 0) {
    return (
      <div
        className="glass-card"
        style={{
          padding: "40px",
          textAlign: "center",
          color: "var(--text-muted)",
        }}
      >
        <AlertCircle
          size={36}
          style={{ marginBottom: "10px", color: "var(--text-muted)" }}
        />
        <p style={{ margin: 0 }}>{t.noData}</p>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ overflowX: "auto", width: "100%" }}>
      {/* التغيير هنا: خليناها تتوافق مع الاتجاهين أوتوماتيك بتشيل textAlign رايت */}
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: "15px" }}
      >
        <thead>
          <tr
            style={{
              borderBottom: "1px solid var(--border)",
              color: "var(--text-muted)",
            }}
          >
            <th style={{ padding: "16px", textAlign: "start" }}>{t.resId}</th>
            <th style={{ padding: "16px", textAlign: "start" }}>
              {t.custName}
            </th>
            <th style={{ padding: "16px", textAlign: "start" }}>{t.service}</th>
            <th style={{ padding: "16px", textAlign: "start" }}>
              {t.dateTime}
            </th>
            <th style={{ padding: "16px", textAlign: "start" }}>{t.price}</th>
            <th style={{ padding: "16px", textAlign: "start" }}>{t.status}</th>
            <th style={{ padding: "16px", textAlign: "center" }}>
              {t.actions}
            </th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res) => {
            const statusConfig = getStatusStyle(res.status);
            return (
              <tr
                key={res.id}
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <td
                  style={{
                    padding: "16px",
                    fontWeight: "bold",
                    color: "var(--primary)",
                  }}
                >
                  {res.id}
                </td>
                <td style={{ padding: "16px" }}>{res.customerName}</td>
                <td style={{ padding: "16px" }}>{res.service}</td>
                <td style={{ padding: "16px" }}>
                  <div>{res.date}</div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--text-muted)",
                      marginTop: "2px",
                    }}
                  >
                    {res.time}
                  </div>
                </td>
                <td style={{ padding: "16px", fontWeight: "bold" }}>
                  {res.price} {t.currency}
                </td>
                <td style={{ padding: "16px" }}>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      backgroundColor: statusConfig.bg,
                      color: statusConfig.color,
                      border: `1px solid ${statusConfig.color}20`,
                    }}
                  >
                    {statusConfig.label}
                  </span>
                </td>
                <td
                  style={{
                    padding: "16px",
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={() => onEdit(res)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                    }}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(res.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ef4444",
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
