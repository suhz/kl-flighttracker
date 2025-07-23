import { NextResponse } from 'next/server'
import { getDashboardStats } from '@/lib/queries'
import { generateETag, shouldReturn304, createETagResponse, create304Response } from '@/lib/etag'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '1w'
    
    const stats = await getDashboardStats(timeRange)
    const etag = generateETag({ stats, timeRange }) // Include timeRange in ETag
    
    // Check if client has the same data (304 Not Modified)
    if (shouldReturn304(request, etag)) {
      return create304Response(etag)
    }
    
    // Return data with ETag
    return createETagResponse(stats, etag)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
} 