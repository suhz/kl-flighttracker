import { NextResponse } from 'next/server'
import { getHourlyAirlineStats } from '@/lib/queries'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const hours = parseInt(searchParams.get('hours') || '24')
    const data = await getHourlyAirlineStats(hours)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch hourly airline statistics' },
      { status: 500 }
    )
  }
} 