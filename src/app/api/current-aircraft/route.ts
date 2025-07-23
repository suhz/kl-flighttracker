import { NextResponse } from 'next/server'
import { getCurrentAircraft } from '@/lib/queries'
import { generateETag, shouldReturn304, createETagResponse, create304Response } from '@/lib/etag'

export async function GET(request: Request) {
  try {
    const data = await getCurrentAircraft()
    const etag = generateETag(data)
    
    // Check if client has the same data (304 Not Modified)
    if (shouldReturn304(request, etag)) {
      return create304Response(etag)
    }
    
    // Return data with ETag
    return createETagResponse(data, etag)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch current aircraft' },
      { status: 500 }
    )
  }
} 