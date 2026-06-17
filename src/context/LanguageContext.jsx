/* eslint-disable */
import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../languages";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("lang") || "ar"; // العربي هو الافتراضي
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);
    // تغيير اتجاه الصفحة أوتوماتيك بناءً على اللغة
    if (lang === "ar") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
    }
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === "ar" ? "en" : "ar"));
  };

  // باصينا الكلمات المترجمة الجاهزة بناءً على اللغة الحالية
  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
