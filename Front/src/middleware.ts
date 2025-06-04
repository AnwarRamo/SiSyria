// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value; // Or use localStorage via headers
  const pathname = request.nextUrl.pathname;

  // Public routes (no auth required)
  const publicRoutes = ['/', '/login', '/register', '/about-us', '/contact-us'];

  // Protected routes (require auth)
  const protectedRoutes = ['/profile', '/cart', '/travel', '/souvenirs'];

  // Admin routes (require admin role)
  const adminRoutes = pathname.startsWith('/admin');

  // Check authentication
  let user = null;
  if (token) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      user = await response.json();
    } catch (error) {
      console.error('Middleware: Auth check failed', error);
    }
  }

  // Handle public routes
  if (publicRoutes.includes(pathname)) {
    if (user && pathname === '/login' || pathname === '/register') {
      return NextResponse.redirect(new URL('/', request.url)); // Redirect logged-in users
    }
    return NextResponse.next();
  }

  // Handle protected routes
  if (protectedRoutes.includes(pathname)) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Handle admin routes
  if (adminRoutes) {
    if (!user || user.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Redirect unknown routes to home
  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};