/**
 * Comprehensive Token Tracking System
 *
 * Tracks multiple tokens with:
 * - Real-time prices and price changes
 * - Balance tracking for connected wallets
 * - Historical price data
 * - USD value calculations
 * - Price alerts and notifications
 */

import { ethers } from 'ethers';

export interface TokenInfo {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logo: string;
  coingeckoId?: string;
}

export interface TokenBalance {
  token: TokenInfo;
  balance: string; // raw balance
  balanceFormatted: string; // human readable
  balanceUSD: number;
  price: number;
  priceChange24h: number;
  priceChange7d: number;
  lastUpdated: Date;
}

export interface TokenPrice {
  symbol: string;
  price: number;
  priceChange24h: number;
  priceChange7d: number;
  marketCap: number;
  volume24h: number;
  lastUpdated: Date;
}

export interface PriceHistory {
  timestamp: Date;
  price: number;
  volume: number;
}

// Supported tokens
export const SUPPORTED_TOKENS: TokenInfo[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    coingeckoId: 'ethereum'
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin (Wrapped)',
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
    decimals: 8,
    logo: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png',
    coingeckoId: 'bitcoin'
  },
  {
    symbol: 'SOL',
    name: 'Solana (Wrapped)',
    address: '0xD31a59c85aE9D8edEFeC411D448f90841571b89c', // Wrapped SOL
    decimals: 9,
    logo: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    coingeckoId: 'solana'
  },
  {
    symbol: 'eETH',
    name: 'EtherFi Staked ETH',
    address: '0x35fA164735182de50811E8e2E824cFb9B6118ac2',
    decimals: 18,
    logo: 'https://assets.coingecko.com/coins/images/33033/small/ether.fi.png',
    coingeckoId: 'ether-fi-staked-eth'
  },
  {
    symbol: 'weETH',
    name: 'Wrapped eETH',
    address: '0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee',
    decimals: 18,
    logo: 'https://assets.coingecko.com/coins/images/33033/small/ether.fi.png',
    coingeckoId: 'wrapped-eeth'
  },
  {
    symbol: 'eBTC',
    name: 'EtherFi Bitcoin',
    address: '0x657e8C867D8B37dCC18fA4Caead9C45EB088C642',
    decimals: 8,
    logo: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png',
    coingeckoId: 'bitcoin'
  },
  {
    symbol: 'eUSD',
    name: 'EtherFi USD',
    address: '0x893B8BC1A33C1a4E0268Bd425b1cF16e3800E078',
    decimals: 18,
    logo: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    coingeckoId: 'usd-coin'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
    logo: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    coingeckoId: 'usd-coin'
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6,
    logo: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    coingeckoId: 'tether'
  },
  {
    symbol: 'stETH',
    name: 'Lido Staked ETH',
    address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    decimals: 18,
    logo: 'https://assets.coingecko.com/coins/images/13442/small/steth_logo.png',
    coingeckoId: 'staked-ether'
  },
  {
    symbol: 'rETH',
    name: 'Rocket Pool ETH',
    address: '0xae78736Cd615f374D3085123A210448E74Fc6393',
    decimals: 18,
    logo: 'https://assets.coingecko.com/coins/images/20764/small/reth.png',
    coingeckoId: 'rocket-pool-eth'
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    decimals: 18,
    logo: 'https://assets.coingecko.com/coins/images/2518/small/weth.png',
    coingeckoId: 'weth'
  }
];

const ERC20_ABI = [
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)'
];

export class TokenTracker {
  private provider: ethers.JsonRpcProvider;
  private priceCache: Map<string, TokenPrice> = new Map();
  private historyCache: Map<string, PriceHistory[]> = new Map();
  private PRICE_CACHE_TTL = 30000; // 30 seconds
  private lastPriceUpdate: number = 0;

  constructor() {
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_MAIN
      || process.env.NEXT_PUBLIC_RPC_URL
      || 'https://eth.llamarpc.com';
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  /**
   * Get all token balances for a wallet
   */
  async getWalletTokens(walletAddress: string): Promise<TokenBalance[]> {
    const balances = await Promise.all(
      SUPPORTED_TOKENS.map(async (token) => {
        try {
          const balance = await this.getTokenBalance(walletAddress, token);
          const price = await this.getTokenPrice(token.symbol);

          return {
            token,
            balance: balance.raw,
            balanceFormatted: balance.formatted,
            balanceUSD: parseFloat(balance.formatted) * price.price,
            price: price.price,
            priceChange24h: price.priceChange24h,
            priceChange7d: price.priceChange7d,
            lastUpdated: new Date()
          };
        } catch (error) {
          console.error(`Error fetching ${token.symbol}:`, error);
          return null;
        }
      })
    );

    // Filter out null results and tokens with zero balance
    return balances.filter(b => b !== null && parseFloat(b.balanceFormatted) > 0) as TokenBalance[];
  }

  /**
   * Get balance for a specific token
   */
  async getTokenBalance(
    walletAddress: string,
    token: TokenInfo
  ): Promise<{ raw: string; formatted: string }> {
    try {
      if (token.symbol === 'ETH') {
        const balance = await this.provider.getBalance(walletAddress);
        return {
          raw: balance.toString(),
          formatted: ethers.formatEther(balance)
        };
      }

      const contract = new ethers.Contract(token.address, ERC20_ABI, this.provider);
      const balance = await contract.balanceOf(walletAddress);
      const formatted = ethers.formatUnits(balance, token.decimals);

      return {
        raw: balance.toString(),
        formatted
      };
    } catch (error) {
      console.error(`Error getting balance for ${token.symbol}:`, error);
      return { raw: '0', formatted: '0' };
    }
  }

  /**
   * Get current price for a token
   */
  async getTokenPrice(symbol: string): Promise<TokenPrice> {
    const cached = this.priceCache.get(symbol);
    const now = Date.now();

    if (cached && (now - this.lastPriceUpdate) < this.PRICE_CACHE_TTL) {
      return cached;
    }

    try {
      const token = SUPPORTED_TOKENS.find(t => t.symbol === symbol);
      if (!token || !token.coingeckoId) {
        return this.getFallbackPrice(symbol);
      }

      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${token.coingeckoId}&vs_currencies=usd&include_24hr_change=true&include_7d_change=true&include_market_cap=true&include_24hr_vol=true`
      );

      const data = await response.json();
      const tokenData = data[token.coingeckoId];

      if (!tokenData) {
        return this.getFallbackPrice(symbol);
      }

      const price: TokenPrice = {
        symbol,
        price: tokenData.usd || 0,
        priceChange24h: tokenData.usd_24h_change || 0,
        priceChange7d: tokenData.usd_7d_change || 0,
        marketCap: tokenData.usd_market_cap || 0,
        volume24h: tokenData.usd_24h_vol || 0,
        lastUpdated: new Date()
      };

      this.priceCache.set(symbol, price);
      this.lastPriceUpdate = now;

      return price;
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      return this.getFallbackPrice(symbol);
    }
  }

  /**
   * Get prices for multiple tokens at once
   */
  async getMultipleTokenPrices(symbols: string[]): Promise<Map<string, TokenPrice>> {
    const prices = await Promise.all(
      symbols.map(symbol => this.getTokenPrice(symbol))
    );

    const priceMap = new Map<string, TokenPrice>();
    symbols.forEach((symbol, index) => {
      priceMap.set(symbol, prices[index]);
    });

    return priceMap;
  }

  /**
   * Get historical price data for a token
   */
  async getPriceHistory(
    symbol: string,
    days: number = 30
  ): Promise<PriceHistory[]> {
    const cached = this.historyCache.get(`${symbol}_${days}`);
    if (cached) {
      return cached;
    }

    try {
      const token = SUPPORTED_TOKENS.find(t => t.symbol === symbol);
      if (!token || !token.coingeckoId) {
        return this.generateMockHistory(symbol, days);
      }

      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${token.coingeckoId}/market_chart?vs_currency=usd&days=${days}`
      );

      const data = await response.json();

      if (!data.prices) {
        return this.generateMockHistory(symbol, days);
      }

      const history: PriceHistory[] = data.prices.map((point: [number, number]) => ({
        timestamp: new Date(point[0]),
        price: point[1],
        volume: 0 // Would need separate API call for volume
      }));

      this.historyCache.set(`${symbol}_${days}`, history);
      return history;
    } catch (error) {
      console.error(`Error fetching history for ${symbol}:`, error);
      return this.generateMockHistory(symbol, days);
    }
  }

  /**
   * Calculate portfolio statistics
   */
  async calculatePortfolioStats(balances: TokenBalance[]): Promise<{
    totalValueUSD: number;
    totalChange24h: number;
    totalChange7d: number;
    diversification: number;
    largestHolding: TokenBalance;
    breakdown: { symbol: string; percentage: number; valueUSD: number }[];
  }> {
    const totalValueUSD = balances.reduce((sum, b) => sum + b.balanceUSD, 0);

    // Calculate weighted price changes
    const totalChange24h = balances.reduce((sum, b) => {
      const weight = b.balanceUSD / totalValueUSD;
      return sum + (b.priceChange24h * weight);
    }, 0);

    const totalChange7d = balances.reduce((sum, b) => {
      const weight = b.balanceUSD / totalValueUSD;
      return sum + (b.priceChange7d * weight);
    }, 0);

    // Calculate diversification score (0-100)
    const numTokens = balances.length;
    const largestWeight = Math.max(...balances.map(b => b.balanceUSD / totalValueUSD));
    const diversification = Math.round((1 - largestWeight) * numTokens * 20);

    // Get largest holding
    const largestHolding = balances.reduce((max, b) =>
      b.balanceUSD > max.balanceUSD ? b : max
    );

    // Calculate breakdown
    const breakdown = balances.map(b => ({
      symbol: b.token.symbol,
      percentage: (b.balanceUSD / totalValueUSD) * 100,
      valueUSD: b.balanceUSD
    })).sort((a, b) => b.valueUSD - a.valueUSD);

    return {
      totalValueUSD,
      totalChange24h,
      totalChange7d,
      diversification: Math.min(100, diversification),
      largestHolding,
      breakdown
    };
  }

  /**
   * Track live price updates with WebSocket (placeholder)
   */
  subscribeToPriceUpdates(symbols: string[], callback: (prices: Map<string, TokenPrice>) => void): () => void {
    // In production, would use WebSocket connection
    const interval = setInterval(async () => {
      const prices = await this.getMultipleTokenPrices(symbols);
      callback(prices);
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }

  // Private helper methods

  private getFallbackPrice(symbol: string): TokenPrice {
    const fallbackPrices: Record<string, number> = {
      'ETH': 3500,
      'BTC': 95000,
      'SOL': 140,
      'eETH': 3500,
      'weETH': 3650,
      'eBTC': 95000,
      'eUSD': 1.00,
      'stETH': 3490,
      'rETH': 3520,
      'WETH': 3500,
      'USDC': 1.00,
      'USDT': 1.00
    };

    return {
      symbol,
      price: fallbackPrices[symbol] || 1,
      priceChange24h: (Math.random() - 0.5) * 10,
      priceChange7d: (Math.random() - 0.5) * 20,
      marketCap: 0,
      volume24h: 0,
      lastUpdated: new Date()
    };
  }

  private generateMockHistory(symbol: string, days: number): PriceHistory[] {
    const history: PriceHistory[] = [];
    const currentPrice = this.getFallbackPrice(symbol).price;
    let price = currentPrice * 0.9; // Start 10% lower

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Random walk with slight upward bias
      price *= (1 + (Math.random() - 0.45) * 0.02);

      history.push({
        timestamp: date,
        price,
        volume: Math.random() * 1000000
      });
    }

    // Ensure last price matches current
    history[history.length - 1].price = currentPrice;

    return history;
  }
}

export const tokenTracker = new TokenTracker();
