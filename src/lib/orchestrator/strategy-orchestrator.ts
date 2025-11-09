import { portfolioFetcher } from '../blockchain/portfolio-fetcher';
import { marketService } from '../data/market-service';
import { scorer } from '../strategy/scorer';
import { aiAnalyzer } from '../ai/strategy-analyzer';

interface ValidationResult {
  score: number;
  recommendation: string;
  analysis: any;
  allocation: {
    current: any;
    proposed: any;
  };
}

export class StrategyOrchestrator {

  async validateStrategy(
    walletAddress: string,
    userRiskTolerance: number
  ): Promise<ValidationResult> {

    // Step 1: Fetch all data in parallel
    const [portfolio, market, yieldData] = await Promise.all([
      portfolioFetcher.fetch(walletAddress),
      marketService.getMarketData(),
      marketService.getYieldData()
    ]);

    // Step 2: Calculate current allocation
    const currentAllocation = this.calculateCurrentAllocation(portfolio);

    // Step 3: Generate proposed allocation
    const proposedAllocation = this.generateProposal(
      currentAllocation,
      userRiskTolerance,
      market.volatility
    );

    // Step 4: Score the proposed strategy
    const strategy = {
      eigenLayerAllocation: proposedAllocation.eigenLayer,
      vaultsAllocation: proposedAllocation.vaults,
      reserveAllocation: proposedAllocation.reserves,
      expectedAPY: this.calculateExpectedAPY(proposedAllocation, yieldData),
      slashingRisk: this.calculateSlashingRisk(proposedAllocation),
      diversificationCount: this.countPositions(proposedAllocation)
    };

    const scoring = scorer.score(strategy, portfolio.totalValueUSD, {
      marketVol: market.volatility,
      userRisk: userRiskTolerance,
      gasPrice: market.gasPrice
    });

    // Step 5: Get AI analysis
    const analysis = await aiAnalyzer.analyze(
      currentAllocation,
      proposedAllocation,
      {
        currentAPY: this.calculateExpectedAPY(currentAllocation, yieldData),
        projectedAPY: strategy.expectedAPY,
        portfolioSize: portfolio.totalValueUSD,
        slashingRisk: strategy.slashingRisk
      }
    );

    return {
      score: scoring.total,
      recommendation: scoring.recommendation,
      analysis,
      allocation: {
        current: currentAllocation,
        proposed: proposedAllocation
      }
    };
  }

  private calculateCurrentAllocation(portfolio: any): any {
    const total = portfolio.totalValueUSD;
    const eeth = parseFloat(portfolio.eethBalance) || 0;
    const weeth = parseFloat(portfolio.weethBalance) || 0;
    const eth = parseFloat(portfolio.ethBalance) || 0;
    const totalTokens = eeth + weeth + eth;

    // Handle empty portfolio
    if (totalTokens === 0) {
      return {
        eigenLayer: 0,
        vaults: 0,
        reserves: 0
      };
    }

    return {
      eigenLayer: ((eeth * 0.5) / totalTokens) * 100, // Assume 50% restaked
      vaults: ((eeth * 0.3) / totalTokens) * 100,     // Assume 30% in vaults
      reserves: (eth / totalTokens) * 100
    };
  }

  private generateProposal(current: any, riskTolerance: number, volatility: number): any {
    // Conservative: more reserves
    if (riskTolerance < 40) {
      return { eigenLayer: 25, vaults: 55, reserves: 20 };
    }

    // Aggressive: max EigenLayer
    if (riskTolerance > 70) {
      return { eigenLayer: 50, vaults: 45, reserves: 5 };
    }

    // Balanced
    return { eigenLayer: 40, vaults: 50, reserves: 10 };
  }

  private calculateExpectedAPY(allocation: any, yieldData: any): number {
    return (
      (allocation.eigenLayer / 100) * yieldData.eigenLayerAPY +
      (allocation.vaults / 100) * yieldData.liquidVaults.eth +
      (allocation.reserves / 100) * yieldData.baseStakingAPY
    );
  }

  private calculateSlashingRisk(allocation: any): number {
    return (allocation.eigenLayer / 100) * 30; // Simplified
  }

  private countPositions(allocation: any): number {
    let count = 0;
    if (allocation.eigenLayer > 0) count += 2; // Assume 2 AVSs
    if (allocation.vaults > 0) count += 1;
    if (allocation.reserves > 0) count += 1;
    return count;
  }
}

export const orchestrator = new StrategyOrchestrator();
