// I have learned from the login route and applied it to this file.

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const authServiceUrl = process.env.NEXT_PUBLIC_AUTH_URL;
    const eventsServiceUrl = process.env.NEXT_PUBLIC_EVENTS_URL;
    

    if (authServiceUrl) {
      const authResponse = await fetch(`${authServiceUrl}/health`, { 
        signal: AbortSignal.timeout(2000)
      });
      if (!authResponse.ok) {
        return NextResponse.json({ status: 'degraded', message: 'Auth service unavailable' }, { status: 503 });
      }
    }
    
    return NextResponse.json({ status: 'ok' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Health check failed:', errorMessage);
    return NextResponse.json({ status: 'error', message: errorMessage }, { status: 503 });
  }
}