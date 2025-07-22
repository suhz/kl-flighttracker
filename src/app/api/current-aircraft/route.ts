import { NextResponse } from 'next/server'
import { getCurrentAircraft } from '@/lib/queries'

export async function GET() {
  try {
    const data = await getCurrentAircraft()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch current aircraft' },
      { status: 500 }
    )
  }
} 