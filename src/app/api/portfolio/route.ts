import { NextRequest, NextResponse } from 'next/server';
import { portfolioFetcher } from '@/lib/blockchain/portfolio-fetcher';
import { ETHERFI_APY } from '@/lib/constants';
import { APIResponse, UserPortfolio } from '@/types';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const address = request.nextUrl.searchParams.get('address');

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

    // Fetch real portfolio data from blockchain
    const data = await portfolioFetcher.fetch(address);

    // Calculate eETH balance in USD
    const totalTokens = parseFloat(data.ethBalance) + parseFloat(data.eethBalance) + parseFloat(data.weethBalance);
    const eethBalanceUSD = totalTokens > 0
      ? parseFloat(data.eethBalance) * (data.totalValueUSD / totalTokens)
      : 0;

    const portfolio: UserPortfolio = {
      address,
      eethBalance: data.eethBalance,
      weethBalance: data.weethBalance,
      ethBalance: data.ethBalance,
      eethBalanceUSD,
      totalStakedUSD: data.totalValueUSD,
      currentAPY: ETHERFI_APY.BASE,
      estimatedAPY: ETHERFI_APY.BASE,
      stakedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago (example)
      lastUpdated: new Date(data.lastUpdated)
    };

    return NextResponse.json<APIResponse<UserPortfolio>>({
      success: true,
      data: portfolio,
    });
  } catch (error: any) {
    console.error('Portfolio API error:', error);
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: error.message || 'Failed to fetch portfolio data',
    }, { status: 500 });
  }
}
