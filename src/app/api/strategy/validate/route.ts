import { NextRequest, NextResponse } from 'next/server';
import { orchestrator } from '@/lib/orchestrator/strategy-orchestrator';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { address, riskTolerance } = await req.json();

    if (!address) {
      return NextResponse.json({ error: 'Address required' }, { status: 400 });
    }

    // Validate address format
    if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json({ error: 'Invalid Ethereum address' }, { status: 400 });
    }

    const result = await orchestrator.validateStrategy(address, riskTolerance || 50);

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Validation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
