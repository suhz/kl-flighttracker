import { NextResponse } from 'next/server'
import { getTopAirlines } from '@/lib/queries'
import { generateETag, shouldReturn304, createETagResponse, create304Response } from '@/lib/etag'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '1w'
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const data = await getTopAirlines(limit, timeRange)
    const etag = generateETag({ data, timeRange, limit })
    
    // Check if client has the same data (304 Not Modified)
    if (shouldReturn304(request, etag)) {
      return create304Response(etag)
    }
    
    // Return data with ETag
    return createETagResponse(data, etag)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch airlines' },
      { status: 500 }
    )
  }
} 