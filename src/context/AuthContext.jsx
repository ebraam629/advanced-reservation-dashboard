/* eslint-disable */
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // 🚪 تصفير الجلسة القديمة أول ما الموقع يفتح خالص عشان يجبره يدخل على الـ Login
  useEffect(() => {
    localStorage.removeItem("clinic_user");
  }, []);

  const [user, setUser] = useState(null); // بيبدأ دايماً بـ null عشان يقف في الـ Login

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("clinic_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("clinic_user");
  };

  // 🎯 الدالة الجديدة لتحديث بيانات البروفايل فوراً في الـ State والـ LocalStorage
  const updateUser = (updatedData) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedData };
      localStorage.setItem("clinic_user", JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
