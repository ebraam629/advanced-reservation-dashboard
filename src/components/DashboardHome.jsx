import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Users, Calendar, CheckCircle, Clock } from "lucide-react";

export default function DashboardHome() {
  // حالات تخزين البيانات الحقيقية
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayReservations: 0,
    completed: 0,
    waiting: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // هنغير اللينك ده للينك الـ API بتاعك المرفوع على Vercel
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(
          "https://advanced-reservation-dashboard-pvqn.vercel.app/api/reservations",
        );
        const data = await response.json();

        // 🌟 هنا بنحسب الإحصائيات من الداتا اللي راجعة
        const total = data.length;
        // افتراضياً لو عندك حقول للحالة (Status) جوه الـ داتا:
        const today = data.filter((res) => {
          const todayStr = new Date().toISOString().split("T")[0];
          return res.date === todayStr;
        }).length;

        const done = data.filter((res) => res.status === "completed").length;
        const wait = data.filter(
          (res) => res.status === "waiting" || !res.status,
        ).length;

        setStats({
          totalPatients: total + 1200, // ضفت رقم افتراضي عشان التيست
          todayReservations: today || 32,
          completed: done || 18,
          waiting: wait || 14,
        });

        // تحضير داتا الـ Chart أوتوماتيك بناءً على الأيام
        // لو السيرفر لسه مبرمجناش فيه أسبوع كامل، هنثبت الداتا دي مؤقتاً
        setChartData([
          { name: "السبت", الحجوزات: 12 },
          { name: "الأحد", الحجوزات: 18 },
          { name: "الإثنين", الحجوزات: 15 },
          { name: "الثلاثاء", الحجوزات: 22 },
          { name: "الأربعاء", الحجوزات: 9 },
          { name: "الخميس", الحجوزات: 25 },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0f1d]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-[#0a0f1d] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* العنوان الرئيسي بلون نيون متوهج */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
          لوحة التحكم والتحليلات
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          متابعة حالة العيادة والحجوزات اليومية بشكل فورى.
        </p>
      </header>

      {/* كروت الإحصائيات الزجاجية (Glassmorphic) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* كارت 1 */}
        <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">إجمالي المرضى</p>
              <h3 className="text-2xl font-bold mt-1 text-white">
                {stats.totalPatients}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
              <Users size={24} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-cyan-500 transition-all duration-300 group-hover:w-full" />
        </div>

        {/* كارت 2 */}
        <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">حجوزات اليوم</p>
              <h3 className="text-2xl font-bold mt-1 text-white">
                {stats.todayReservations}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
              <Calendar size={24} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-purple-500 transition-all duration-300 group-hover:w-full" />
        </div>

        {/* كارت 3 */}
        <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">تم الكشف</p>
              <h3 className="text-2xl font-bold mt-1 text-white">
                {stats.completed}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <CheckCircle size={24} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-emerald-500 transition-all duration-300 group-hover:w-full" />
        </div>

        {/* كارت 4 */}
        <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">في الانتظار</p>
              <h3 className="text-2xl font-bold mt-1 text-white">
                {stats.waiting}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
              <Clock size={24} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-amber-500 transition-all duration-300 group-hover:w-full" />
        </div>
      </div>

      {/* قسم الرسم البياني (Neon Analytics Chart) */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-md shadow-xl">
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          معدل الحجوزات الأسبوعي
        </h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
              />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#131c31",
                  borderColor: "rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#fff",
                }}
                itemStyle={{ color: "#22d3ee" }}
              />
              <Bar
                dataKey="الحجوزات"
                fill="url(#neonGradient)"
                radius={[8, 8, 0, 0]}
                maxBarSize={50}
              />
              <defs>
                <linearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0.2} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
