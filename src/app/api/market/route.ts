import { NextResponse } from 'next/server';
import { marketService } from '@/lib/data/market-service';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [market, yieldData] = await Promise.all([
      marketService.getMarketData(),
      marketService.getYieldData()
    ]);

    return NextResponse.json({
      success: true,
      market,
      yield: yieldData
    });
  } catch (error: any) {
    console.error('Market API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
