import { NextRequest } from 'next/server';
import { handleGoogleOAuthCallback } from '@/lib/googleOAuth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return handleGoogleOAuthCallback(request);
}
