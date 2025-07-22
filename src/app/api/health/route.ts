import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    
    const recentData = await prisma.aircraftSighting.count({
      where: {
        seenAt: { gte: new Date(Date.now() - 5 * 60 * 1000) } // Last 5 minutes
      }
    })
    
    const status = {
      status: 'healthy',
      database: 'connected',
      recentAircraft: recentData,
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(status)
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    )
  }
} 