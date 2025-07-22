'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { Sun, Moon, Monitor } from 'lucide-react'

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor }
  ]

  return (
    <div className="relative">
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
        className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-8 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {themes.map((themeOption) => {
          const Icon = themeOption.icon
          return (
            <option key={themeOption.value} value={themeOption.value}>
              {themeOption.label}
            </option>
          )
        })}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        {(() => {
          const currentTheme = themes.find(t => t.value === theme)
          const Icon = currentTheme?.icon || Monitor
          return <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        })()}
      </div>
    </div>
  )
} 