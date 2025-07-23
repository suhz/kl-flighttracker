import { NextResponse } from 'next/server'
import { getHourlyAirlineStats } from '@/lib/queries'
import { generateETag, shouldReturn304, createETagResponse, create304Response } from '@/lib/etag'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const hours = parseInt(searchParams.get('hours') || '24')
    
    const data = await getHourlyAirlineStats(hours)
    const etag = generateETag({ data, hours })
    
    // Check if client has the same data (304 Not Modified)
    if (shouldReturn304(request, etag)) {
      return create304Response(etag)
    }
    
    // Return data with ETag
    return createETagResponse(data, etag)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch hourly airline statistics' },
      { status: 500 }
    )
  }
} 