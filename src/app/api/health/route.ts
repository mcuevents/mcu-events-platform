import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    app: 'MCU Creations Platform API',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    supabaseConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
  });
}
