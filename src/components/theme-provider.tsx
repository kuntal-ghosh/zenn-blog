'use client'

import * as React from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  readonly children: React.ReactNode
  readonly defaultTheme?: Theme
  readonly enableSystem?: boolean
  readonly attribute?: string
  readonly disableTransitionOnChange?: boolean
}

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  enableSystem = true,
  attribute = 'class',
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme)
  const resolvedThemeRef = React.useRef<'dark' | 'light'>('light')

  // Initialize theme from localStorage
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    
    if (savedTheme) {
      setTheme(savedTheme)
    } else if (enableSystem) {
      setTheme('system')
    }
  }, [enableSystem])

  // Handle system theme changes
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light'
        resolvedThemeRef.current = systemTheme
        updateDOM(systemTheme)
      }
    }
    
    mediaQuery.addEventListener('change', handleSystemThemeChange)
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }, [theme])

  // Update DOM when theme changes
  React.useEffect(() => {
    if (disableTransitionOnChange) {
      document.documentElement.classList.add('disable-transitions')
      // Force a reflow (don't need to store value)
      void document.documentElement.offsetHeight; 
      document.documentElement.classList.remove('disable-transitions')
    }

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      resolvedThemeRef.current = systemTheme
      updateDOM(systemTheme)
    } else {
      resolvedThemeRef.current = theme
      updateDOM(theme)
    }
  }, [theme, disableTransitionOnChange])

  function updateDOM(newTheme: string) {
    const root = document.documentElement
    
    if (attribute === 'class') {
      root.classList.remove('light', 'dark')
      root.classList.add(newTheme)
    } else {
      root.setAttribute(attribute, newTheme)
    }

    // Store the theme preference
    if (newTheme !== 'system') {
      localStorage.setItem('theme', newTheme)
    }
  }

  function toggleTheme() {
    setTheme(currentTheme => {
      if (currentTheme === 'dark') return 'light'
      if (currentTheme === 'light') return enableSystem ? 'system' : 'dark'
      return 'dark' // If system, switch to dark
    })
  }

  const value = React.useMemo(() => ({
    theme,
    setTheme,
    toggleTheme,
  }), [theme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
