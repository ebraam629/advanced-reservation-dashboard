/* eslint-disable */
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // بنشوف الأول لو المستخدم كان مغير الثيم قبل كده ومخزنه في الـ LocalStorage
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark"; // خليت الدارك هو الافتراضي عشان الـ Vibe!
  });

  useEffect(() => {
    // بنضيف الكود ده في الـ HTML tag عشان الـ CSS يلقط التغيير
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook مخصص عشان نستخدم الثيم بسهولة في أي مكون
export const useTheme = () => useContext(ThemeContext);
