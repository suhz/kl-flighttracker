import { NextResponse } from 'next/server'
import { getDashboardStats } from '@/lib/queries'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '1w'
    
    const stats = await getDashboardStats(timeRange)
    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
} 