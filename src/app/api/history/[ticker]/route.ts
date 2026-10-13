import { NextResponse } from 'next/server';
import { getHistory } from '@/lib/data';

export async function GET(_req: Request, { params }: { params: { ticker: string } }) {
  const ticker = decodeURIComponent(params.ticker).trim();
  if (!/^[\^A-Za-z0-9.\-=]{1,12}$/.test(ticker)) {
    return NextResponse.json({ error: 'Invalid ticker' }, { status: 400 });
  }
  try {
    const history = await getHistory(ticker);
    return NextResponse.json(history, {
      headers: { 'Cache-Control': 's-maxage=900, stale-while-revalidate=3600' },
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 404 });
  }
}
