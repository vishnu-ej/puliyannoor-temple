import { NextRequest, NextResponse } from 'next/server';
import { getClientIp, apiDosLimiter, globalPageLimiter } from './lib/rateLimit';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Ignore static assets, internal Next.js assets, and image files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') && (
      pathname.endsWith('.png') ||
      pathname.endsWith('.jpg') ||
      pathname.endsWith('.jpeg') ||
      pathname.endsWith('.svg') ||
      pathname.endsWith('.ico') ||
      pathname.endsWith('.webp') ||
      pathname.endsWith('.mp3') ||
      pathname.endsWith('.pdf')
    )
  ) {
    return NextResponse.next();
  }

  const clientIp = getClientIp(request);

  // 1. API Route DoS Protection
  if (pathname.startsWith('/api')) {
    const rateCheck = apiDosLimiter.check(`api_${clientIp}`);

    if (!rateCheck.success) {
      const retryAfter = Math.max(1, rateCheck.reset - Math.ceil(Date.now() / 1000));
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Too many requests. Please slow down.',
          message: 'Rate limit exceeded to protect temple web services from denial of service.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': String(rateCheck.limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateCheck.reset),
          },
        }
      );
    }
  } else {
    // 2. Page Requests DoS Protection
    const pageCheck = globalPageLimiter.check(`page_${clientIp}`);

    if (!pageCheck.success) {
      const retryAfter = Math.max(1, pageCheck.reset - Math.ceil(Date.now() / 1000));
      return new NextResponse(
        `<!DOCTYPE html>
<html>
<head><title>Too Many Requests</title></head>
<body style="font-family:sans-serif; text-align:center; padding:50px; background:#FAF5E8; color:#38050E;">
  <h2>Too Many Requests (Rate Limit Exceeded)</h2>
  <p>To protect the temple portal services, request traffic is temporarily limited.</p>
  <p>Please try again in a few moments.</p>
</body>
</html>`,
        {
          status: 429,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Retry-After': String(retryAfter),
          },
        }
      );
    }
  }

  // 3. Attach Defense-in-Depth Security Headers
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
