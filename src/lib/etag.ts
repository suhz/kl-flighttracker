import crypto from 'crypto'

/**
 * Generate an ETag for data
 */
export function generateETag(data: any): string {
  const content = JSON.stringify(data)
  const hash = crypto.createHash('sha256').update(content).digest('hex')
  return `"${hash.substring(0, 16)}"` // Use first 16 chars for shorter ETags
}

/**
 * Check if request should return 304 Not Modified
 */
export function shouldReturn304(request: Request, etag: string): boolean {
  const ifNoneMatch = request.headers.get('if-none-match')
  return ifNoneMatch === etag
}

/**
 * Create response with ETag header
 */
export function createETagResponse(data: any, etag: string, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'ETag': etag,
      'Cache-Control': 'no-cache' // Allow caching but require revalidation
    }
  })
}

/**
 * Create 304 Not Modified response
 */
export function create304Response(etag: string): Response {
  return new Response(null, {
    status: 304,
    headers: {
      'ETag': etag,
      'Cache-Control': 'no-cache'
    }
  })
} 