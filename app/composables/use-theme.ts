/**
 * Theme composable using localStorage
 * Client-side only theme management with localStorage persistence
 */

// Global state to share theme across all instances
const theme = ref<"light" | "dark">("light");

export function useTheme() {
  // Initialize theme from localStorage on client side (only once)
  if (import.meta.client && theme.value === "light") {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (storedTheme && (storedTheme === "light" || storedTheme === "dark")) {
      theme.value = storedTheme;
    }
  }

  const isDark = computed(() => theme.value === "dark");

  const setTheme = (newTheme: "light" | "dark") => {
    theme.value = newTheme;
    // Save to localStorage and update DOM for immediate visual feedback
    if (import.meta.client) {
      localStorage.setItem("theme", newTheme);
      const html = document.documentElement;
      html.classList.remove("light", "dark");
      html.classList.add(newTheme);
    }
  };

  const toggleTheme = () => {
    setTheme(theme.value === "dark" ? "light" : "dark");
  };

  // Initialize theme on client side
  if (import.meta.client) {
    onMounted(() => {
      const html = document.documentElement;
      html.classList.remove("light", "dark");
      html.classList.add(theme.value);
    });
  }

  return {
    theme,
    value: theme, // Alias for compatibility with useColorMode API
    isDark,
    setTheme,
    toggleTheme,
    preference: theme, // Alias for compatibility with useColorMode API
  };
}
