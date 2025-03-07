import { createContext, useEffect, useState } from "react";

// Tạo Context
export const ThemeContext = createContext();

// Tạo Provider để bọc toàn bộ ứng dụng
export const ThemeProvider = ({ children }) => {
  // Lấy trạng thái theme từ localStorage hoặc mặc định là "light"
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Cập nhật class của body và lưu vào localStorage
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Hàm để chuyển đổi theme
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
