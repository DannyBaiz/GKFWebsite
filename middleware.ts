import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // can add headers or logging
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
);

export const config = { matcher: ['/_next/static/(.*)', '/admin/:path*', '/members/:path*', '/api/files/:path*'] };
