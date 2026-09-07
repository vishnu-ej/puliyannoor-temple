import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Initiates direct Google OAuth 2.0 authorization code flow.
 * Connects directly to Google OAuth without using Supabase OAuth intermediary.
 */
export async function GET(request: NextRequest) {
  const clientId = (
    process.env.GOOGLE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    '939817290396-hhdl90u9oucu82j61u6evhrh0p15pa0e.apps.googleusercontent.com'
  ).replace(/['"]/g, '').trim();

  const searchParams = request.nextUrl.searchParams;
  const redirectTarget = searchParams.get('redirect') || '/profile';

  // Accurately resolve origin for both localhost and production
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || request.nextUrl.host;
  const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const origin = `${proto}://${host}`;

  const callbackPath = searchParams.get('callback') || '/api/auth/callback/google';
  const redirectUri = `${origin}${callbackPath}`;

  const stateData = {
    redirect: redirectTarget,
    origin,
    callbackPath,
  };
  const state = Buffer.from(JSON.stringify(stateData)).toString('base64url');

  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'select_account');
  googleAuthUrl.searchParams.set('state', state);

  return NextResponse.redirect(googleAuthUrl.toString());
}
