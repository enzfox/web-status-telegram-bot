import { useEffect, useState } from "react";
import LocalStorageManager from "../utils/LocalStorageManager";

export default function useThemeMode() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = LocalStorageManager.getItem("theme");
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const theme = storedTheme ?? (prefersDarkMode ? "dark" : "light");

    setDarkMode(theme === "dark");

    if (theme === "dark") {
      document.body.classList.add("dark");
      document.documentElement.classList.add("dark");
    } else {
      document.body.classList.add("light");
      document.documentElement.classList.add("light");
    }
  }, []);

  const changeThemeMode = () => {
    setDarkMode((darkMode) => {
      const isDarkMode = !darkMode;
      document.body.classList.toggle("dark", isDarkMode);
      document.body.classList.toggle("light", !isDarkMode);

      document.documentElement.classList.toggle("dark", isDarkMode);
      document.documentElement.classList.toggle("light", !isDarkMode);

      LocalStorageManager.setItem("theme", isDarkMode ? "dark" : "light");

      return isDarkMode;
    });
  };

  const isDarkMode = () => {
    return darkMode;
  };

  return {
    changeThemeMode,
    isDarkMode,
  };
}
