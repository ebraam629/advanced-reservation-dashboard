/* eslint-disable */
import React from "react";
import { useLanguage } from "../context/LanguageContext";
import {
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
} from "lucide-react";

function StatsCards({ reservations = [] }) {
  const { lang } = useLanguage();

  // 🎯 الحسبة الذكية والدقيقة - تم تأمينها بـ toLowerCase() عشان تقرأ الكابيتال والسمول بدون أخطاء
  const total = reservations.length;

  const confirmed = reservations.filter(
    (res) => res.status?.trim().toLowerCase() === "confirmed",
  ).length;

  const pending = reservations.filter(
    (res) => res.status?.trim().toLowerCase() === "pending",
  ).length;

  const cancelled = reservations.filter(
    (res) => res.status?.trim().toLowerCase() === "cancelled",
  ).length;

  // 💰 حساب إجمالي إيرادات العيادة للكشوفات المؤكدة فقط بشكل آمن تماماً
  const totalEarnings = reservations
    .filter((res) => res.status?.trim().toLowerCase() === "confirmed")
    .reduce((sum, res) => sum + (Number(res.price) || 0), 0);

  // كروت العدادات بتصميم جلاسمورفيزم متناسق للعيادة الطبية
  const cardsData = [
    {
      title: lang === "ar" ? "إجمالي الحجوزات" : "Total Bookings",
      value: total,
      icon: <Calendar size={22} color="#00e5ff" />,
      borderColor: "rgba(0, 229, 255, 0.5)",
    },
    {
      title: lang === "ar" ? "حجوزات مؤكدة" : "Confirmed",
      value: confirmed,
      icon: <CheckCircle size={22} color="#00ff88" />,
      borderColor: "rgba(0, 255, 136, 0.5)",
    },
    {
      title: lang === "ar" ? "في الانتظار" : "Pending",
      value: pending,
      icon: <Clock size={22} color="#ffbb00" />,
      borderColor: "rgba(255, 187, 0, 0.5)",
    },
    {
      title: lang === "ar" ? "حجوزات ملغاة" : "Cancelled",
      value: cancelled,
      icon: <XCircle size={22} color="#ff0055" />,
      borderColor: "rgba(255, 0, 85, 0.5)",
    },
    {
      title: lang === "ar" ? "إجمالي الإيرادات" : "Total Earnings",
      value: `${totalEarnings} ${lang === "ar" ? "ج.م" : "EGP"}`,
      icon: <DollarSign size={22} color="#9d4edd" />,
      borderColor: "rgba(157, 78, 221, 0.5)",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "15px",
        marginBottom: "25px",
      }}
    >
      {cardsData.map((card, idx) => (
        <div
          key={idx}
          className="glass-card"
          style={{
            padding: "20px",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            borderLeft: `4px solid ${card.borderColor}`,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                color: "var(--text-muted)",
                fontWeight: "500",
              }}
            >
              {card.title}
            </span>
            {card.icon}
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: "bold",
              color: "var(--text-main)",
            }}
          >
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
