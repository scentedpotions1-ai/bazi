// app/api/canon77/route.ts
import { NextRequest } from 'next/server';
import { analyzeCanon77, type Pillars } from '@/lib/canon77_revA';

export const runtime = 'edge'; // optional; great on Vercel

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pillars: Pillars = body?.pillars;

    if (!pillars?.year || !pillars?.month || !pillars?.day || !pillars?.hour) {
      return new Response(JSON.stringify({ error: 'Invalid payload: missing pillars' }), { status: 400 });
    }

    const result = analyzeCanon77(pillars);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'Unexpected error' }), { status: 500 });
  }
}
