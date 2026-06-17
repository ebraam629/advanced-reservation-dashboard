import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

export default function ReservationModal({
  isOpen,
  onClose,
  onSave,
  editData,
}) {
  const [customerName, setCustomerName] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("pending");

  // أول ما الـ Modal يفتح، لو فيه editData بنملا الحقول، لو مفيش بنخليها فاضية (إضافة جديدة)
  useEffect(() => {
    if (editData) {
      setCustomerName(editData.customerName);
      setService(editData.service);
      setDate(editData.date);
      setTime(editData.time);
      setPrice(editData.price);
      setStatus(editData.status);
    } else {
      setCustomerName("");
      setService("");
      setDate("");
      setTime("");
      setPrice("");
      setStatus("pending");
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      id: editData
        ? editData.id
        : `RES-${Math.floor(100 + Math.random() * 900)}`, // لو جديد بنعمله ID عشوائي
      customerName,
      service,
      date,
      time,
      price: Number(price),
      status,
    };

    onSave(formData);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(8px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        className="glass-card"
        style={{
          padding: "30px",
          maxWidth: "500px",
          width: "100%",
          position: "relative",
        }}
      >
        {/* زرار الإغلاق */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
          }}
        >
          <X size={20} />
        </button>

        <h3
          style={{
            color: "var(--primary)",
            marginTop: 0,
            marginBottom: "20px",
          }}
        >
          {editData ? "تعديل الحجز الحالي" : "إضافة حجز جديد"}
        </h3>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "14px", color: "var(--text-muted)" }}>
              اسم العميل
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "14px", color: "var(--text-muted)" }}>
              الخدمة / الصالة
            </label>
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              required
              style={inputStyle}
              placeholder="مثال: حجز VIP - صالة 1"
            />
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                flex: 1,
              }}
            >
              <label style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                التاريخ
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                flex: 1,
              }}
            >
              <label style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                الوقت
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                style={inputStyle}
                placeholder="مثال: 08:00 م"
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                flex: 1,
              }}
            >
              <label style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                السعر (ج.م)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                flex: 1,
              }}
            >
              <label style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                الحالة
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={inputStyle}
              >
                <option value="pending">في الانتظار</option>
                <option value="confirmed">مؤكدة</option>
                <option value="completed">مكتملة</option>
                <option value="cancelled">ملغاة</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            style={{
              marginTop: "10px",
              padding: "12px",
              backgroundColor: "var(--primary)",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Save size={18} /> {editData ? "حفظ التعديلات" : "تأكيد الحجز"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ستايل موحد للإنبووتس جوه المودال
const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid var(--border)",
  background: "var(--background)",
  color: "var(--text-main)",
  outline: "none",
  fontSize: "14px",
};
