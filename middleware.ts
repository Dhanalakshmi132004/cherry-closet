import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const path = req.nextUrl.pathname;

    if (path.startsWith('/admin')) {
      if (!isAuth) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
      if (token.role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    if (path.startsWith('/account')) {
      if (!isAuth) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
};
