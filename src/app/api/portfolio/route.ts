import { NextRequest, NextResponse } from 'next/server';
import { getEETHBalance, getETHPrice } from '@/lib/ethereum';
import { ETHERFI_APY } from '@/lib/constants';
import { APIResponse, UserPortfolio } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'Address parameter is required',
      }, { status: 400 });
    }

    // Validate Ethereum address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'Invalid Ethereum address',
      }, { status: 400 });
    }

    // Fetch eETH balance
    const eethBalance = await getEETHBalance(address);
    const ethPrice = await getETHPrice();
    const eethBalanceUSD = parseFloat(eethBalance) * ethPrice;

    const portfolio: UserPortfolio = {
      address,
      eethBalance,
      eethBalanceUSD: Math.round(eethBalanceUSD * 100) / 100,
      currentAPY: ETHERFI_APY.BASE,
      stakedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago (example)
    };

    return NextResponse.json<APIResponse<UserPortfolio>>({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    console.error('Portfolio API error:', error);
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: 'Failed to fetch portfolio data',
    }, { status: 500 });
  }
}
