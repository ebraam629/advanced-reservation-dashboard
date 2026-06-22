/* eslint-disable */
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function ReservationModal({ isOpen, onClose, onSave, editData }) {
  const { lang } = useLanguage();

  const [customerName, setCustomerName] = useState("");
  const [price, setPrice] = useState("");
  // 🎯 متغير التاريخ بيبدأ تلقائياً بتاريخ النهاردة بالملي
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    if (editData) {
      setCustomerName(editData.customerName || "");
      setPrice(editData.price || "");
      // لو بنعمل تعديل لحجز قديم، بنجيب التاريخ بتاعه عشان يظهر في الخانة
      setDate(editData.date || new Date().toISOString().split("T")[0]);
    } else {
      setCustomerName("");
      setPrice("");
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  // دالة معالجة الحفظ الموحدة
  const handleSubmitAction = (e) => {
    if (e) e.preventDefault(); // منع الريفريش لو جاي من الفورم

    // 1️⃣ التحقق من الاسم
    if (!customerName.trim()) {
      alert(
        lang === "ar"
          ? "من فضلك أدخل اسم المريض!"
          : "Please enter patient name!",
      );
      return;
    }

    // 2️⃣ تجهيز البيانات لبعتها للـ App.jsx (مع إضافة متغير التاريخ المختار)
    const reservationData = {
      id: editData ? editData.id : null,
      customerName: customerName.trim(),
      movieTitle: editData?.movieTitle || "كشف طبي",
      status: editData ? editData.status : "Pending",
      price: parseFloat(price) || 0,
      date: date, // 🎯 بيبعت التاريخ اللي نقيته بالملي (سواء النهاردة أو أثر رجعي)
    };

    // 3️⃣ تنفيذ الحفظ فوراً
    onSave(reservationData);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(5px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "25px",
          borderRadius: "15px",
          position: "relative",
          border: "1px solid var(--border-color)",
          zIndex: 10000,
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            zIndex: 10001,
          }}
        >
          <X size={20} />
        </button>

        <h3
          style={{
            marginBottom: "20px",
            color: "var(--primary)",
            fontWeight: "bold",
          }}
        >
          {editData
            ? lang === "ar"
              ? "تعديل بيانات المريض"
              : "Edit Booking"
            : lang === "ar"
              ? "إضافة حجز مريض جديد"
              : "New Patient Booking"}
        </h3>

        <form
          onSubmit={handleSubmitAction}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          {/* اسم المريض */}
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "14px", color: "var(--text-muted)" }}>
              {lang === "ar" ? "اسم المريض" : "Patient Name"}
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={
                lang === "ar" ? "اكتب اسم المريض..." : "Enter patient name..."
              }
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "var(--text-main)",
                outline: "none",
              }}
            />
          </div>

          {/* سعر الكشف */}
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "14px", color: "var(--text-muted)" }}>
              {lang === "ar" ? "قيمة الكشف (EGP)" : "Fees (EGP)"}
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "var(--text-main)",
                outline: "none",
              }}
            />
          </div>

          {/* 🛠️ خانة اختيار تاريخ الحجز (بأثر رجعي أو مستقبلي) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "14px", color: "var(--text-muted)" }}>
              {lang === "ar" ? "تاريخ الحجز" : "Reservation Date"}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "var(--text-main)",
                outline: "none",
                cursor: "pointer",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 15px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                backgroundColor: "transparent",
                color: "var(--text-main)",
                cursor: "pointer",
              }}
            >
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </button>

            <button
              type="submit"
              onClick={handleSubmitAction}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "var(--primary)",
                color: "#000",
                fontWeight: "bold",
                cursor: "pointer",
                pointerEvents: "auto",
                position: "relative",
                zIndex: 10002,
              }}
            >
              {editData
                ? lang === "ar"
                  ? "تعديل الحجز"
                  : "Save Changes"
                : lang === "ar"
                  ? "حفظ وتثبيت الحجز"
                  : "Save Reservation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReservationModal;
