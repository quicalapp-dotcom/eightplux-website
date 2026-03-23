import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Paths that should be accessible during maintenance mode
 */
const maintenanceExemptPaths = [
  '/admin',
  '/api',
  '/_next',
  '/login',
  '/favicon.ico',
  '/maintenance',
  '/signup',
];

/**
 * Check if a path is exempt from maintenance mode
 */
function isMaintenanceExempt(path: string): boolean {
  // Always allow admin paths
  if (path.startsWith('/admin')) {
    return true;
  }
  
  // Always allow API routes
  if (path.startsWith('/api')) {
    return true;
  }
  
  // Allow Next.js internals
  if (path.startsWith('/_next') || path.startsWith('/favicon')) {
    return true;
  }
  
  // Allow login and signup pages
  if (path === '/login' || path === '/signup') {
    return true;
  }
  
  // Allow maintenance page itself
  if (path === '/maintenance') {
    return true;
  }
  
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip maintenance check for exempted paths
  if (isMaintenanceExempt(pathname)) {
    return NextResponse.next();
  }

  // Check maintenance mode via API endpoint
  try {
    const response = await fetch(new URL('/api/maintenance-check', request.url), {
      headers: {
        // Forward the host for the API to work
        'x-forwarded-host': request.headers.get('host') || '',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      
      // If maintenance mode is on, redirect to maintenance page
      if (data.maintenanceMode) {
        // Allow access to maintenance page itself to avoid infinite redirect
        if (pathname === '/maintenance') {
          return NextResponse.next();
        }

        // Redirect to maintenance page
        const maintenanceUrl = new URL('/maintenance', request.url);
        return NextResponse.redirect(maintenanceUrl);
      }
    }
  } catch (error) {
    // If there's an error checking maintenance mode, allow access
    console.error('Maintenance check failed:', error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
