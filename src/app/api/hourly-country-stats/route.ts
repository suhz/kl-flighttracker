import { NextResponse } from 'next/server'
import { getHourlyCountryStats } from '@/lib/queries'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const hours = parseInt(searchParams.get('hours') || '24')
    const data = await getHourlyCountryStats(hours)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch hourly country statistics' },
      { status: 500 }
    )
  }
} 