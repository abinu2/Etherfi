interface MarketData {
  ethPrice: number;
  gasPrice: number;
  volatility: number;
  etherFiTVL: number;
  eigenLayerTVL: number;
}

interface YieldData {
  baseStakingAPY: number;
  eigenLayerAPY: number;
  liquidVaults: { eth: number; usd: number; btc: number };
}

class DataCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private TTL = 30000; // 30 seconds

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry || Date.now() - entry.timestamp > this.TTL) return null;
    return entry.data;
  }

  set(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
}

export class MarketDataService {
  private cache = new DataCache();

  async getMarketData(): Promise<MarketData> {
    const cached = this.cache.get<MarketData>('market');
    if (cached) return cached;

    try {
      const [ethPrice, gasPrice, tvlData] = await Promise.all([
        this.fetchETHPrice(),
        this.fetchGasPrice(),
        this.fetchTVL()
      ]);

      const data: MarketData = {
        ethPrice,
        gasPrice,
        volatility: this.calculateVolatility(ethPrice),
        etherFiTVL: tvlData.etherFi,
        eigenLayerTVL: tvlData.eigenLayer
      };

      this.cache.set('market', data);
      return data;
    } catch (error) {
      console.error('Market data fetch error:', error);
      return this.getFallbackMarket();
    }
  }

  async getYieldData(): Promise<YieldData> {
    const cached = this.cache.get<YieldData>('yield');
    if (cached) return cached;

    try {
      const data: YieldData = {
        baseStakingAPY: await this.fetchBaseAPY(),
        eigenLayerAPY: await this.fetchEigenAPY(),
        liquidVaults: await this.fetchVaultAPYs()
      };

      this.cache.set('yield', data);
      return data;
    } catch (error) {
      console.error('Yield data fetch error:', error);
      return this.getFallbackYield();
    }
  }

  private async fetchETHPrice(): Promise<number> {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await res.json();
    return data.ethereum.usd;
  }

  private async fetchGasPrice(): Promise<number> {
    const res = await fetch('https://api.etherscan.io/api?module=gastracker&action=gasoracle');
    const data = await res.json();
    return parseInt(data.result?.ProposeGasPrice || '25');
  }

  private async fetchTVL(): Promise<{ etherFi: number; eigenLayer: number }> {
    const [etherFi, eigenLayer] = await Promise.all([
      fetch('https://api.llama.fi/protocol/ether.fi').then(r => r.json()),
      fetch('https://api.llama.fi/protocol/eigenlayer').then(r => r.json())
    ]);

    return {
      etherFi: etherFi.tvl?.[etherFi.tvl.length - 1]?.totalLiquidityUSD || 8000000000,
      eigenLayer: eigenLayer.tvl?.[eigenLayer.tvl.length - 1]?.totalLiquidityUSD || 15000000000
    };
  }

  private async fetchBaseAPY(): Promise<number> {
    // Estimate from beacon chain data
    return 3.8;
  }

  private async fetchEigenAPY(): Promise<number> {
    // Average across AVSs
    return 5.2;
  }

  private async fetchVaultAPYs(): Promise<{ eth: number; usd: number; btc: number }> {
    // Would fetch from EtherFi API
    return { eth: 5.0, usd: 6.5, btc: 4.2 };
  }

  private calculateVolatility(currentPrice: number): number {
    // Simplified volatility calculation
    const historicalAvg = 3500;
    const deviation = Math.abs(currentPrice - historicalAvg) / historicalAvg;
    return Math.min(deviation * 100, 100);
  }

  private getFallbackMarket(): MarketData {
    return {
      ethPrice: 3500,
      gasPrice: 25,
      volatility: 30,
      etherFiTVL: 8000000000,
      eigenLayerTVL: 15000000000
    };
  }

  private getFallbackYield(): YieldData {
    return {
      baseStakingAPY: 3.8,
      eigenLayerAPY: 5.2,
      liquidVaults: { eth: 5.0, usd: 6.5, btc: 4.2 }
    };
  }
}

export const marketService = new MarketDataService();
