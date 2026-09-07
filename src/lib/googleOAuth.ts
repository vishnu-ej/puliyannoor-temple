import { NextRequest, NextResponse } from 'next/server';
import { upsertProfileInSupabase, getProfileByEmailFromSupabase } from './supabaseDb';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Handles Google OAuth 2.0 redirect callback directly.
 * Exchanges authorization code with Google for tokens and userinfo,
 * upserts devotee into Supabase profiles, establishes session, and redirects.
 */
export async function handleGoogleOAuthCallback(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const stateRaw = searchParams.get('state');

  // Resolve accurate origin
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || request.nextUrl.host;
  const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  let origin = `${proto}://${host}`;
  let redirectTarget = '/profile';
  let callbackPath = request.nextUrl.pathname;

  if (stateRaw) {
    try {
      const stateObj = JSON.parse(Buffer.from(stateRaw, 'base64url').toString('utf8'));
      if (stateObj.redirect) redirectTarget = stateObj.redirect;
      if (stateObj.origin) origin = stateObj.origin;
      if (stateObj.callbackPath) callbackPath = stateObj.callbackPath;
    } catch {
      // ignore state parsing issues
    }
  }

  if (error || !code) {
    const errorMsg = encodeURIComponent(error || 'Google authorization was cancelled or failed');
    return NextResponse.redirect(`${origin}/?auth_error=${errorMsg}`);
  }

  const clientId = (
    process.env.GOOGLE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    '939817290396-hhdl90u9oucu82j61u6evhrh0p15pa0e.apps.googleusercontent.com'
  ).replace(/['"]/g, '').trim();

  const clientSecret = (
    process.env.GOOGLE_CLIENT_SECRET || ''
  ).replace(/['"]/g, '').trim();

  const redirectUri = `${origin}${callbackPath}`;

  try {
    // 1. Directly exchange the authorization code with Google's OAuth 2.0 token endpoint
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('Direct Google token exchange error:', tokenData);
      const errMsg = encodeURIComponent(tokenData.error_description || tokenData.error || 'Token exchange failed');
      return NextResponse.redirect(`${origin}/?auth_error=${errMsg}`);
    }

    // 2. Fetch authenticated Google User Profile directly from Google
    const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const googleUser = await userinfoResponse.json();

    if (!googleUser.email) {
      return NextResponse.redirect(`${origin}/?auth_error=${encodeURIComponent('No email address provided by Google')}`);
    }

    const cleanEmail = googleUser.email.toLowerCase().trim();

    // 3. Look up existing devotee profile in Supabase to preserve existing phone/dob/star
    let existingProfile = null;
    try {
      existingProfile = await getProfileByEmailFromSupabase(cleanEmail);
    } catch {
      // fallback
    }

    const devoteeProfile = {
      id: existingProfile?.id || `google_${googleUser.sub}`,
      name: existingProfile?.name || googleUser.name || cleanEmail.split('@')[0],
      email: cleanEmail,
      phone: existingProfile?.phone || '',
      dob: existingProfile?.dob || '',
      place: existingProfile?.place || '',
      star: existingProfile?.star || '',
      avatar: googleUser.picture || existingProfile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: existingProfile?.created_at ? new Date(existingProfile.created_at).getTime() : Date.now(),
    };

    // 4. Upsert devotee into Supabase profiles database table (email/password remain on Supabase)
    try {
      await upsertProfileInSupabase({
        id: devoteeProfile.id,
        name: devoteeProfile.name,
        email: devoteeProfile.email,
        phone: devoteeProfile.phone,
        star: devoteeProfile.star,
        dob: devoteeProfile.dob,
        place: devoteeProfile.place,
        avatar_url: devoteeProfile.avatar,
      });
    } catch (dbErr) {
      console.warn('Supabase profile sync note:', dbErr);
    }

    const destinationUrl = redirectTarget.startsWith('http') ? redirectTarget : `${origin}${redirectTarget.startsWith('/') ? '' : '/'}${redirectTarget}`;

    // 5. Render temple-branded transitional page that securely writes session into localStorage and navigates
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Puliyannoor Devaswom - Authenticating...</title>
  <style>
    * { box-sizing: border-box; }
    body {
      background-color: #FAF5E8;
      color: #38050E;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 24px;
    }
    .card {
      background: #FFFFFF;
      border: 2px solid #C99738;
      border-radius: 20px;
      padding: 32px 24px;
      box-shadow: 0 10px 25px -5px rgba(56, 5, 14, 0.12);
      max-width: 380px;
      width: 100%;
    }
    .emblem {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: linear-gradient(135deg, #610C1B, #1A0409);
      border: 2px solid #C99738;
      color: #E6BE65;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: bold;
      margin: 0 auto 16px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }
    .spinner {
      width: 36px;
      height: 36px;
      border: 3.5px solid #E4D5AE;
      border-top-color: #610C1B;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 16px auto;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    h2 { font-size: 17px; margin: 0 0 6px; color: #38050E; font-weight: 700; }
    p { font-size: 13px; color: #8C6219; margin: 0; }
    .mal { font-size: 12px; color: #5A382A; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="emblem">ॐ</div>
    <h2>Google Verification Complete</h2>
    <div class="spinner"></div>
    <p>Signing in as <strong>${escapeHtml(devoteeProfile.name)}</strong>...</p>
    <div class="mal">പുലിയന്നൂർ മഹാദേവ ക്ഷേത്രത്തിലേക്ക് സ്വാഗതം...</div>
  </div>
  <script>
    try {
      const devotee = ${JSON.stringify(devoteeProfile)};
      localStorage.setItem('puliyannoor_devotee_user_session', JSON.stringify(devotee));
      
      try {
        sessionStorage.removeItem('puliyannoor_admin_session');
        sessionStorage.removeItem('puliyannoor_admin_user');
      } catch (e) {}

      try {
        const key = 'puliyannoor_devotees_virtual_db';
        const users = JSON.parse(localStorage.getItem(key) || '[]');
        const idx = users.findIndex(function(u) { return u.email === devotee.email; });
        if (idx >= 0) {
          users[idx] = Object.assign({}, users[idx], devotee);
        } else {
          users.push(devotee);
        }
        localStorage.setItem(key, JSON.stringify(users));
      } catch (e) {}

      try {
        window.dispatchEvent(new Event('storage'));
      } catch (e) {}
    } catch (err) {
      console.error('Session write error:', err);
    }

    setTimeout(function() {
      window.location.replace(${JSON.stringify(destinationUrl)});
    }, 150);
  </script>
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Set-Cookie': `puliyannoor_devotee_session=${encodeURIComponent(devoteeProfile.id)}; Path=/; Max-Age=2592000; SameSite=Lax`,
      },
    });
  } catch (err: any) {
    console.error('Google OAuth callback handler exception:', err);
    return NextResponse.redirect(`${origin}/?auth_error=${encodeURIComponent(err.message || 'Direct Google authentication error')}`);
  }
}
