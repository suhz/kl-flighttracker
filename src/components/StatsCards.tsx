import { formatNumber } from '@/lib/utils'
import { DashboardStats } from '@/types/aircraft'
import { TimeRangeSelector } from './TimeRangeSelector'

interface StatsCardsProps {
  stats: DashboardStats
  timeRange: string
  onTimeRangeChange: (timeRange: string) => void
}

export function StatsCards({ stats, timeRange, onTimeRangeChange }: StatsCardsProps) {
  const cards = [
    {
      value: formatNumber(stats.totalFlights),
      label: 'Total Flights',
      color: 'bg-blue-600',
      icon: '✈️'
    },
    {
      value: formatNumber(stats.totalAircraft),
      label: 'Total Aircraft',
      color: 'bg-green-600',
      icon: '🛩️'
    },
    {
      value: formatNumber(stats.aircraftTypes),
      label: 'Aircraft Types',
      color: 'bg-purple-600',
      icon: '🏷️'
    },
    {
      value: formatNumber(stats.countries),
      label: 'Aircraft Country',
      color: 'bg-orange-600',
      icon: '🌍'
    },
    {
      value: formatNumber(stats.airlines),
      label: 'Airlines',
      color: 'bg-red-600',
      icon: '🏢'
    },
    {
      value: `${stats.maxDistance.toFixed(1)}km`,
      label: 'Max Distance',
      color: 'bg-indigo-600',
      icon: '📡'
    }
  ]

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Dashboard Statistics</h2>
        <TimeRangeSelector 
          value={timeRange} 
          onChange={onTimeRangeChange}
        />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((card, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">{card.icon}</span>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
} 