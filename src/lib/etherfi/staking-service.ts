/**
 * Comprehensive EtherFi Protocol Service
 *
 * Integrates all EtherFi staking products:
 * - eETH: Ethereum liquid staking
 * - weETH: Wrapped eETH (auto-compounding)
 * - eBTC: Bitcoin liquid staking on Ethereum
 * - eUSD: Stablecoin yield product
 *
 * Based on: https://etherfi.gitbook.io/etherfi
 */

import { ethers } from 'ethers';

export interface EtherFiProduct {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  apy: number;
  tvl: number;
  description: string;
  risks: string[];
  benefits: string[];
}

export interface StakingPosition {
  product: string;
  balance: string;
  balanceUSD: number;
  apy: number;
  earnedRewards: string;
  earnedRewardsUSD: number;
  stakingDuration: number; // days
  projectedYearlyEarnings: number;
  nextRewardDate: Date;
}

export interface StakingAnalytics {
  totalStakedUSD: number;
  totalEarnedUSD: number;
  averageAPY: number;
  bestPerformer: string;
  diversificationScore: number;
  riskScore: number;
  recommendations: string[];
}

export const ETHERFI_PRODUCTS: Record<string, EtherFiProduct> = {
  eETH: {
    symbol: 'eETH',
    name: 'EtherFi Staked ETH',
    address: '0x35fA164735182de50811E8e2E824cFb9B6118ac2',
    decimals: 18,
    apy: 3.2,
    tvl: 8000000000,
    description: 'Liquid staking token representing staked ETH with native restaking benefits',
    risks: ['Smart contract risk', 'Validator slashing'],
    benefits: ['Liquid', 'Native restaking', 'DeFi composability']
  },
  weETH: {
    symbol: 'weETH',
    name: 'Wrapped eETH',
    address: '0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee',
    decimals: 18,
    apy: 3.8,
    tvl: 5000000000,
    description: 'Auto-compounding wrapped version of eETH with enhanced yields',
    risks: ['Smart contract risk', 'Wrapping risk'],
    benefits: ['Auto-compounding', 'Higher yields', 'Gas efficient']
  },
  eBTC: {
    symbol: 'eBTC',
    name: 'EtherFi Bitcoin',
    address: '0x657e8C867D8B37dCC18fA4Caead9C45EB088C642',
    decimals: 8,
    apy: 4.5,
    tvl: 1200000000,
    description: 'Bitcoin liquid staking token earning yields on Ethereum',
    risks: ['Bridge risk', 'Smart contract risk', 'BTC price volatility'],
    benefits: ['Bitcoin exposure', 'Earn yield on BTC', 'DeFi accessible']
  },
  eUSD: {
    symbol: 'eUSD',
    name: 'EtherFi USD',
    address: '0x893B8BC1A33C1a4E0268Bd425b1cF16e3800E078',
    decimals: 18,
    apy: 6.5,
    tvl: 800000000,
    description: 'Yield-bearing stablecoin backed by liquid staking tokens',
    risks: ['Depeg risk', 'Collateral risk', 'Smart contract risk'],
    benefits: ['Stable value', 'High yields', 'Low volatility']
  }
};

const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
  'function decimals() view returns (uint8)'
];

export class EtherFiStakingService {
  private provider: ethers.JsonRpcProvider;
  private priceCache: Map<string, { price: number; timestamp: number }> = new Map();
  private CACHE_TTL = 60000; // 1 minute

  constructor() {
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_MAIN || 'https://eth.llamarpc.com';
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  /**
   * Get all staking positions for a wallet
   */
  async getStakingPositions(walletAddress: string): Promise<StakingPosition[]> {
    const positions: StakingPosition[] = [];

    for (const [symbol, product] of Object.entries(ETHERFI_PRODUCTS)) {
      try {
        const contract = new ethers.Contract(
          product.address,
          ERC20_ABI,
          this.provider
        );

        const balance = await contract.balanceOf(walletAddress);
        const balanceFormatted = ethers.formatUnits(balance, product.decimals);
        const balanceNum = parseFloat(balanceFormatted);

        if (balanceNum > 0) {
          const price = await this.getAssetPrice(symbol);
          const balanceUSD = balanceNum * price;

          // Calculate earned rewards (simplified - would need real calculation)
          const earnedRewards = (balanceNum * product.apy / 100 * 0.1).toFixed(8); // 10% of yearly
          const earnedRewardsUSD = parseFloat(earnedRewards) * price;

          // Projected yearly earnings
          const projectedYearlyEarnings = balanceUSD * (product.apy / 100);

          positions.push({
            product: symbol,
            balance: balanceFormatted,
            balanceUSD,
            apy: product.apy,
            earnedRewards,
            earnedRewardsUSD,
            stakingDuration: Math.floor(Math.random() * 180 + 30), // Mock - would track actual
            projectedYearlyEarnings,
            nextRewardDate: new Date(Date.now() + 24 * 3600000) // Tomorrow
          });
        }
      } catch (error) {
        console.error(`Error fetching ${symbol} position:`, error);
      }
    }

    return positions;
  }

  /**
   * Calculate comprehensive staking analytics
   */
  async calculateStakingAnalytics(positions: StakingPosition[]): Promise<StakingAnalytics> {
    if (positions.length === 0) {
      return {
        totalStakedUSD: 0,
        totalEarnedUSD: 0,
        averageAPY: 0,
        bestPerformer: '',
        diversificationScore: 0,
        riskScore: 0,
        recommendations: ['Start staking to earn yields on your assets']
      };
    }

    const totalStakedUSD = positions.reduce((sum, p) => sum + p.balanceUSD, 0);
    const totalEarnedUSD = positions.reduce((sum, p) => sum + p.earnedRewardsUSD, 0);

    // Calculate weighted average APY
    const averageAPY = positions.reduce((sum, p) => {
      const weight = p.balanceUSD / totalStakedUSD;
      return sum + (p.apy * weight);
    }, 0);

    // Find best performer
    const bestPerformer = positions.reduce((best, p) =>
      p.apy > (positions.find(pos => pos.product === best)?.apy || 0) ? p.product : best,
      positions[0].product
    );

    // Calculate diversification score (0-100)
    const diversificationScore = Math.min(100, positions.length * 25);

    // Calculate risk score based on product mix
    const riskScore = this.calculateRiskScore(positions);

    // Generate recommendations
    const recommendations = this.generateRecommendations(positions, totalStakedUSD);

    return {
      totalStakedUSD,
      totalEarnedUSD,
      averageAPY,
      bestPerformer,
      diversificationScore,
      riskScore,
      recommendations
    };
  }

  /**
   * Get optimal allocation recommendation
   */
  getOptimalAllocation(
    totalAmount: number,
    riskProfile: 'conservative' | 'moderate' | 'aggressive'
  ): Record<string, number> {
    const allocations: Record<string, Record<string, number>> = {
      conservative: {
        eUSD: 0.50,  // 50% stable
        weETH: 0.30, // 30% ETH
        eBTC: 0.15,  // 15% BTC
        eETH: 0.05   // 5% base staking
      },
      moderate: {
        weETH: 0.40, // 40% ETH
        eUSD: 0.30,  // 30% stable
        eBTC: 0.20,  // 20% BTC
        eETH: 0.10   // 10% base staking
      },
      aggressive: {
        weETH: 0.35, // 35% auto-compounding ETH
        eBTC: 0.35,  // 35% BTC for higher yield
        eETH: 0.20,  // 20% base staking
        eUSD: 0.10   // 10% stable
      }
    };

    const allocation = allocations[riskProfile];
    const result: Record<string, number> = {};

    for (const [product, percentage] of Object.entries(allocation)) {
      result[product] = totalAmount * percentage;
    }

    return result;
  }

  /**
   * Compare yields across products
   */
  compareYields(amount: number): Array<{
    product: string;
    yearlyEarnings: number;
    monthlyEarnings: number;
    apy: number;
    risk: string;
  }> {
    return Object.entries(ETHERFI_PRODUCTS).map(([symbol, product]) => ({
      product: symbol,
      yearlyEarnings: amount * (product.apy / 100),
      monthlyEarnings: (amount * (product.apy / 100)) / 12,
      apy: product.apy,
      risk: this.getProductRiskLevel(symbol)
    })).sort((a, b) => b.apy - a.apy);
  }

  /**
   * Get historical APY data
   */
  async getHistoricalAPY(product: string, days: number = 90): Promise<Array<{
    date: Date;
    apy: number;
  }>> {
    // In production, fetch real historical data
    const history: Array<{ date: Date; apy: number }> = [];
    const baseAPY = ETHERFI_PRODUCTS[product]?.apy || 4.0;

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Simulate realistic APY fluctuation
      const variance = (Math.random() - 0.5) * 0.5;
      const apy = baseAPY + variance;

      history.push({ date, apy });
    }

    return history;
  }

  // Private helper methods

  private async getAssetPrice(symbol: string): Promise<number> {
    const cached = this.priceCache.get(symbol);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.price;
    }

    try {
      const priceMap: Record<string, string> = {
        eETH: 'ethereum',
        weETH: 'ethereum',
        eBTC: 'bitcoin',
        eUSD: 'usd'
      };

      const coingeckoId = priceMap[symbol];
      if (!coingeckoId) return 1;

      if (coingeckoId === 'usd') {
        this.priceCache.set(symbol, { price: 1, timestamp: Date.now() });
        return 1;
      }

      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`
      );
      const data = await response.json();
      const price = data[coingeckoId]?.usd || 3500;

      // Apply premium for wrapped/liquid staking tokens
      const multiplier = symbol === 'weETH' ? 1.05 : 1.0;
      const adjustedPrice = price * multiplier;

      this.priceCache.set(symbol, { price: adjustedPrice, timestamp: Date.now() });
      return adjustedPrice;
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      // Fallback prices
      const fallbacks: Record<string, number> = {
        eETH: 3500,
        weETH: 3675,
        eBTC: 95000,
        eUSD: 1
      };
      return fallbacks[symbol] || 1;
    }
  }

  private calculateRiskScore(positions: StakingPosition[]): number {
    let score = 0;
    const totalValue = positions.reduce((sum, p) => sum + p.balanceUSD, 0);

    positions.forEach(position => {
      const weight = position.balanceUSD / totalValue;
      const productRisk = {
        eUSD: 20,   // Lowest risk (stable)
        eETH: 30,   // Low risk (established)
        weETH: 35,  // Slightly higher (wrapping)
        eBTC: 50    // Higher risk (bridge + BTC volatility)
      }[position.product] || 40;

      score += productRisk * weight;
    });

    return Math.round(score);
  }

  private getProductRiskLevel(symbol: string): string {
    const risks: Record<string, string> = {
      eUSD: 'Low',
      eETH: 'Low-Medium',
      weETH: 'Medium',
      eBTC: 'Medium-High'
    };
    return risks[symbol] || 'Medium';
  }

  private generateRecommendations(
    positions: StakingPosition[],
    totalStakedUSD: number
  ): string[] {
    const recommendations: string[] = [];

    // Diversification recommendations
    if (positions.length === 1) {
      recommendations.push('Consider diversifying across multiple EtherFi products to reduce risk');
    }

    // Product-specific recommendations
    const hasStable = positions.some(p => p.product === 'eUSD');
    if (!hasStable && totalStakedUSD > 1000) {
      recommendations.push('Add eUSD for stable yield and lower volatility');
    }

    const hasBTC = positions.some(p => p.product === 'eBTC');
    if (!hasBTC && totalStakedUSD > 5000) {
      recommendations.push('Consider eBTC for Bitcoin exposure with yield');
    }

    const hasAutoCompound = positions.some(p => p.product === 'weETH');
    if (!hasAutoCompound) {
      recommendations.push('Switch to weETH for automatic compounding and higher yields');
    }

    // APY optimization
    const avgAPY = positions.reduce((sum, p) => sum + p.apy, 0) / positions.length;
    if (avgAPY < 4.5) {
      recommendations.push('Optimize allocation to increase average APY to 5%+');
    }

    // Size-based recommendations
    if (totalStakedUSD > 10000) {
      recommendations.push('Consider advanced strategies like liquidity provision for higher yields');
    }

    return recommendations.length > 0
      ? recommendations
      : ['Your portfolio is well-optimized. Continue monitoring for rebalancing opportunities.'];
  }
}

export const etherfiStakingService = new EtherFiStakingService();
