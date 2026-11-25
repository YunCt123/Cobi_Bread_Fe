import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_TOKEN_KEY = 'cobi_access_token';
const COOKIE_ROLE_KEY = 'cobi_user_role';

interface JwtPayload {
  sub?: string;
  email?: string;
  role?: 'ADMIN' | 'BRANCH_MANAGER' | 'CUSTOMER';
  branchId?: string | null;
  exp?: number;
}

/**
 * Giải mã an toàn payload của JWT token trong Edge/Middleware runtime
 */
function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonString = atob(base64);
    return JSON.parse(jsonString) as JwtPayload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(COOKIE_TOKEN_KEY)?.value;
  const roleCookie = request.cookies.get(COOKIE_ROLE_KEY)?.value;

  // Lấy role từ token hoặc fallback sang roleCookie
  const jwtPayload = token ? decodeJwt(token) : null;
  const isTokenExpired = jwtPayload?.exp ? jwtPayload.exp * 1000 < Date.now() : false;
  const userRole = (!isTokenExpired && (jwtPayload?.role || roleCookie)) || null;
  const isAuthenticated = Boolean(token && !isTokenExpired);

  // 1. Kiểm soát quyền truy cập trang ADMIN (/admin, /admin/*)
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // CUSTOMER và BRANCH_MANAGER không được vào /admin
    if (userRole !== 'ADMIN') {
      if (userRole === 'BRANCH_MANAGER') {
        return NextResponse.redirect(new URL('/manager', request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  }

  // 2. Kiểm soát quyền truy cập trang MANAGER (/manager, /manager/*)
  if (pathname.startsWith('/manager')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // CUSTOMER không được vào /manager
    if (userRole === 'CUSTOMER') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // ADMIN hoặc BRANCH_MANAGER được phép vào
    return NextResponse.next();
  }

  // 3. Nếu đã đăng nhập, truy cập /login hoặc /register sẽ tự động chuyển hướng theo vai trò
  if ((pathname === '/login' || pathname === '/register') && isAuthenticated && userRole) {
    if (userRole === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    if (userRole === 'BRANCH_MANAGER') {
      return NextResponse.redirect(new URL('/manager', request.url));
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/manager/:path*',
    '/login',
    '/register',
  ],
};
