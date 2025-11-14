/**
 * SSR-friendly theme composable using useCookie
 * This solves hydration issues by using cookies instead of localStorage
 * Based on: https://nuxt.com/docs/4.x/guide/best-practices/hydration
 */
export const useTheme = () => {
  // Use cookie instead of localStorage for SSR compatibility
  // This works on both server and client
  const theme = useCookie<'light' | 'dark'>('theme', {
    default: () => 'light',
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    httpOnly: false,
  })

  const isDark = computed(() => theme.value === 'dark')

  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
    // Also update the DOM class for immediate visual feedback
    if (import.meta.client) {
      const html = document.documentElement
      html.classList.remove('light', 'dark')
      html.classList.add(newTheme)
    }
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  // Initialize theme on client side
  if (import.meta.client) {
    onMounted(() => {
      const html = document.documentElement
      html.classList.remove('light', 'dark')
      html.classList.add(theme.value)
    })
  }

  return {
    theme,
    value: theme, // Alias for compatibility with useColorMode API
    isDark,
    setTheme,
    toggleTheme,
    preference: theme, // Alias for compatibility with useColorMode API
  }
}

