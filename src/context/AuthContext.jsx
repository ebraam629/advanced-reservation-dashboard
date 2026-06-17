/* eslint-disable */
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // لو المستخدم مسجل دخول قبل كده ومحفوظ في الكاش
    const savedUser = localStorage.getItem("dashboard_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // دالة تسجيل الدخول (Mock Login)
  const login = (username, password) => {
    // هنفترض أي يوزر وباسورد صح للتجربة (مثلاً admin و 123)
    if (username === "admin" && password === "123") {
      const userData = { username, role: "Admin", loginTime: new Date() };
      setUser(userData);
      localStorage.setItem("dashboard_user", JSON.stringify(userData));
      return { success: true };
    }
    return {
      success: false,
      message: "اسم المستخدم أو كلمة المرور غير صحيحة!",
    };
  };

  // دالة تسجيل الخروج
  const logout = () => {
    setUser(null);
    localStorage.removeItem("dashboard_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// الـ Hook المخصص عشان نستخدم الـ Auth في أي مكان بسهولة
export const useAuth = () => useContext(AuthContext);
