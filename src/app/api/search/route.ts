import { NextResponse } from 'next/server';
import { searchTickers } from '@/lib/data';

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('q')?.trim() ?? '';
  if (!q) return NextResponse.json({ results: [] });
  const results = await searchTickers(q.slice(0, 40));
  return NextResponse.json({ results });
}
