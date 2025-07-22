import { getDashboardStats } from '@/lib/queries'
import { StatsCards } from './StatsCards'

interface StatsCardsServerProps {
  timeRange: string
  onTimeRangeChange: (timeRange: string) => void
}

export async function StatsCardsServer({ timeRange, onTimeRangeChange }: StatsCardsServerProps) {
  const stats = await getDashboardStats(timeRange)
  return <StatsCards stats={stats} timeRange={timeRange} onTimeRangeChange={onTimeRangeChange} />
} 