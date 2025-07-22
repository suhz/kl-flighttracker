'use client'

interface TimeRangeSelectorProps {
  value: string
  onChange: (timeRange: string) => void
  className?: string
}

const timeRangeOptions = [
  { value: '2h', label: '2 Hours' },
  { value: '8h', label: '8 Hours' },
  { value: '24h', label: '24 Hours' },
  { value: '1w', label: '1 Week' },
  { value: '1m', label: '1 Month' }
]

export function TimeRangeSelector({ value, onChange, className = '' }: TimeRangeSelectorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label className="text-sm text-gray-600 dark:text-gray-300 font-medium">Time Range:</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="text-sm border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        {timeRangeOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
} 