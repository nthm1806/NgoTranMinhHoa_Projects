import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslation from "./locales/en.json";
import viTranslation from "./locales/vi.json";

i18n
  .use(initReactI18next) // Kết nối với React
  .use(LanguageDetector) // Phát hiện ngôn ngữ trình duyệt
  .init({
    resources: {
      en: { translation: enTranslation },
      vi: { translation: viTranslation },
    },
    lng: "vn", // Ngôn ngữ mặc định
    fallbackLng: "vn", // Nếu không tìm thấy ngôn ngữ, mặc định dùng vi
    interpolation: {
      escapeValue: false // Cho phép sử dụng biến trong chuỗi ({{name}})
    }
  });

export default i18n;
