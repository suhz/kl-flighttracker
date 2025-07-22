import { NextResponse } from 'next/server'
import { getTopCountries } from '@/lib/queries'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '1w'
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const data = await getTopCountries(limit, timeRange)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch countries' },
      { status: 500 }
    )
  }
} 