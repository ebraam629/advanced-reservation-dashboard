/* eslint-disable */
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext"; // استيراد

export default function StatsCards({ reservations }) {
  const { t } = useLanguage(); // استخدام
  const total = reservations.length;
  const confirmed = reservations.filter((r) => r.status === "confirmed").length;
  const pending = reservations.filter((r) => r.status === "pending").length;
  const cancelled = reservations.filter((r) => r.status === "cancelled").length;

  const totalEarnings = reservations
    .filter((r) => r.status === "confirmed" || r.status === "completed")
    .reduce((sum, r) => sum + r.price, 0);

  const cardsData = [
    {
      title: t.totalReservations,
      value: total,
      icon: <CalendarDays size={24} />,
      color: "#6366f1",
    },
    {
      title: t.confirmedReservations,
      value: confirmed,
      icon: <CheckCircle2 size={24} />,
      color: "var(--primary)",
    },
    {
      title: t.pendingReservations,
      value: pending,
      icon: <Clock size={24} />,
      color: "#eab308",
    },
    {
      title: t.cancelledReservations,
      value: cancelled,
      icon: <XCircle size={24} />,
      color: "#ef4444",
    },
    {
      title: t.totalEarnings,
      value: `${totalEarnings} ${t.currency}`,
      icon: <DollarSign size={24} />,
      color: "#10b981",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        width: "100%",
        marginBottom: "30px",
      }}
    >
      {cardsData.map((card, index) => (
        <div
          key={index}
          className="glass-card"
          style={{
            padding: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderLeft: `4px solid ${card.color}`,
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 5px 0",
                fontSize: "14px",
                color: "var(--text-muted)",
              }}
            >
              {card.title}
            </p>
            <h3 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>
              {card.value}
            </h3>
          </div>
          <div
            style={{
              padding: "10px",
              borderRadius: "50%",
              backgroundColor: `${card.color}15`,
              color: card.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
