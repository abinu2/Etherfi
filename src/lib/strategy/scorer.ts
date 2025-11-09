interface Strategy {
  eigenLayerAllocation: number; // % in EigenLayer
  vaultsAllocation: number;     // % in vaults
  reserveAllocation: number;    // % in reserves
  expectedAPY: number;
  slashingRisk: number;         // 0-100
  diversificationCount: number; // # of positions
}

interface ScoringWeights {
  yield: number;
  risk: number;
  diversification: number;
  efficiency: number;
}

export class StrategyScorer {

  // Dynamic weights based on context
  private getWeights(marketVol: number, userRisk: number): ScoringWeights {
    let weights = { yield: 0.35, risk: 0.30, diversification: 0.20, efficiency: 0.15 };

    // High volatility: prioritize risk
    if (marketVol > 50) {
      weights.risk += 0.10;
      weights.yield -= 0.10;
    }

    // Conservative user: prioritize safety
    if (userRisk < 40) {
      weights.risk += 0.10;
      weights.yield -= 0.10;
    }

    // Aggressive user: chase yield
    if (userRisk > 70) {
      weights.yield += 0.10;
      weights.risk -= 0.10;
    }

    // Normalize
    const sum = Object.values(weights).reduce((a, b) => a + b);
    Object.keys(weights).forEach(k => weights[k as keyof ScoringWeights] /= sum);

    return weights;
  }

  score(
    strategy: Strategy,
    portfolioSize: number,
    context: { marketVol: number; userRisk: number; gasPrice: number }
  ): {
    total: number;
    breakdown: Record<string, number>;
    recommendation: 'EXECUTE' | 'REVIEW' | 'WAIT' | 'REJECT';
  } {

    const weights = this.getWeights(context.marketVol, context.userRisk);

    // Component scores (0-100)
    const scores = {
      yield: this.scoreYield(strategy.expectedAPY, portfolioSize),
      risk: this.scoreRisk(strategy, context.userRisk),
      diversification: this.scoreDiversification(strategy),
      efficiency: this.scoreEfficiency(strategy, portfolioSize, context.gasPrice)
    };

    // Weighted total
    const total = Object.entries(scores).reduce(
      (sum, [key, score]) => sum + score * weights[key as keyof ScoringWeights],
      0
    );

    // Recommendation
    let recommendation: 'EXECUTE' | 'REVIEW' | 'WAIT' | 'REJECT';
    if (total >= 80) recommendation = 'EXECUTE';
    else if (total >= 70) recommendation = 'REVIEW';
    else if (total >= 50) recommendation = 'WAIT';
    else recommendation = 'REJECT';

    return { total: Math.round(total), breakdown: scores, recommendation };
  }

  private scoreYield(apy: number, portfolioSize: number): number {
    const annualReturn = (portfolioSize * apy) / 100;
    let score = 50;

    if (apy > 10) score += 30;
    else if (apy > 7) score += 20;
    else if (apy > 5) score += 10;

    if (annualReturn > 1000) score += 20;
    else if (annualReturn > 500) score += 10;

    return Math.min(100, score);
  }

  private scoreRisk(strategy: Strategy, userTolerance: number): number {
    // Calculate total risk
    const totalRisk =
      strategy.slashingRisk * 0.4 +
      (strategy.eigenLayerAllocation > 50 ? 40 : 20) * 0.3 +
      (strategy.reserveAllocation < 10 ? 30 : 10) * 0.3;

    // Match with tolerance
    const mismatch = Math.abs(totalRisk - userTolerance);
    return Math.max(0, 100 - mismatch);
  }

  private scoreDiversification(strategy: Strategy): number {
    // Score based on number of positions
    let score = Math.min(strategy.diversificationCount * 15, 60);

    // Bonus for balanced allocation
    const allocations = [
      strategy.eigenLayerAllocation,
      strategy.vaultsAllocation,
      strategy.reserveAllocation
    ];
    const maxAllocation = Math.max(...allocations);

    if (maxAllocation < 60) score += 20; // Well balanced
    else if (maxAllocation < 70) score += 10;

    return Math.min(100, score);
  }

  private scoreEfficiency(strategy: Strategy, size: number, gasPrice: number): number {
    // Estimate gas cost
    const gasCost = (200000 * gasPrice * 3500) / 1e9; // Rough estimate
    const gasCostPercent = (gasCost / size) * 100;

    let score = 100;
    if (gasCostPercent > 2) score -= 40;
    else if (gasCostPercent > 1) score -= 20;
    else if (gasCostPercent > 0.5) score -= 10;

    // Capital efficiency
    const deployed = 100 - strategy.reserveAllocation;
    if (deployed > 85 && deployed < 95) score += 0; // Optimal range
    else score -= Math.abs(90 - deployed) / 2;

    return Math.max(0, score);
  }
}

export const scorer = new StrategyScorer();
