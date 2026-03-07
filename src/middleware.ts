import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize rate limiter
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 requests per hour per IP
});

// Define routes to apply rate limiting
const rateLimitedRoutes = [
  '/api/payments/paystack/initialize',
  '/api/payments/paystack/verify',
  '/api/payments/crypto/create-charge',
];

export async function middleware(request: NextRequest) {
  // Check if the request is for a rate-limited route
  const isRateLimitedRoute = rateLimitedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isRateLimitedRoute) {
    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';

    try {
      const { success, pending, limit, reset, remaining } = await ratelimit.limit(ip);

      if (!success) {
        return new NextResponse('Too many requests', {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          },
        });
      }

      const response = NextResponse.next();
      response.headers.set('X-RateLimit-Limit', limit.toString());
      response.headers.set('X-RateLimit-Remaining', remaining.toString());
      response.headers.set('X-RateLimit-Reset', reset.toString());

      return response;
    } catch (error) {
      console.error('Rate limiting error:', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/payments/:path*',
};
