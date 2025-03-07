import React, { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

const DarkModeButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      className="mt-4 px-4 py-2 rounded-md transition-all duration-300 border focus:outline-none
                 border-gray-600 dark:border-gray-300 bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
      onClick={toggleTheme}
    >
      {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
};

export default DarkModeButton;
