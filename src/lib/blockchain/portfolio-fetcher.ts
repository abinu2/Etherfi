import { ethers } from 'ethers';

const CONTRACTS = {
  eETH: '0x35fA164735182de50811E8e2E824cFb9B6118ac2',
  weETH: '0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee',
  LIQUID_VAULT: '0x308861A430be4cce5502d0A12724771Fc6DaF216'
} as const;

const ERC20_ABI = [
  'function balanceOf(address account) view returns (uint256)'
];

export interface PortfolioData {
  walletAddress: string;
  ethBalance: string;
  eethBalance: string;
  weethBalance: string;
  totalValueUSD: number;
  lastUpdated: string;
}

export class PortfolioFetcher {
  private provider: ethers.JsonRpcProvider;

  constructor() {
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_MAIN
      || process.env.NEXT_PUBLIC_RPC_URL
      || 'https://eth.llamarpc.com';
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  async fetch(address: string): Promise<PortfolioData> {
    try {
      // Create contract instances
      const eethContract = new ethers.Contract(CONTRACTS.eETH, ERC20_ABI, this.provider);
      const weethContract = new ethers.Contract(CONTRACTS.weETH, ERC20_ABI, this.provider);

      // Parallel fetch all balances
      const [ethBal, eethBal, weethBal, ethPrice] = await Promise.all([
        this.provider.getBalance(address),
        eethContract.balanceOf(address),
        weethContract.balanceOf(address),
        this.getETHPrice()
      ]);

      const eth = parseFloat(ethers.formatEther(ethBal));
      const eeth = parseFloat(ethers.formatEther(eethBal));
      const weeth = parseFloat(ethers.formatEther(weethBal));
      const totalETH = eth + eeth + weeth;

      return {
        walletAddress: address,
        ethBalance: eth.toFixed(6),
        eethBalance: eeth.toFixed(6),
        weethBalance: weeth.toFixed(6),
        totalValueUSD: totalETH * ethPrice,
        lastUpdated: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('Portfolio fetch error:', error);
      throw new Error('Failed to fetch portfolio data');
    }
  }

  private async getETHPrice(): Promise<number> {
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const data = await res.json();
      return data.ethereum.usd;
    } catch {
      return 3500; // Fallback
    }
  }
}

export const portfolioFetcher = new PortfolioFetcher();
