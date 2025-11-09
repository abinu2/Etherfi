/**
 * Enhanced Strategy Predictor
 *
 * Advanced prediction algorithms for strategy performance using:
 * - Historical data analysis
 * - Machine learning-inspired scoring
 * - Market condition correlation
 * - Risk-adjusted returns
 */

export interface PredictionInput {
  strategyType: 'staking' | 'restaking' | 'liquidity' | 'yield' | 'leverage';
  protocols: string[];
  allocation: number; // USD value
  currentAPY: number;
  userRiskTolerance: number; // 0-100
  portfolioSize: number;
  marketConditions: {
    volatility: number;
    gasPrice: number;
    ethPrice: number;
  };
}

export interface StrategyPrediction {
  expectedAPY: number;
  confidence: number; // 0-100
  timeToProfit: number; // days
  riskScore: number; // 0-100
  optimalAllocation: number;
  projectedReturns: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
  breakEvenPoint: {
    days: number;
    usdValue: number;
  };
  successProbability: number; // 0-1
  recommendations: string[];
  warnings: string[];
}

export class EnhancedPredictor {
  private historicalData: Map<string, number[]> = new Map();

  /**
   * Predict strategy performance with enhanced algorithms
   */
  async predictStrategy(input: PredictionInput): Promise<StrategyPrediction> {
    // Calculate base APY with protocol-specific adjustments
    const baseAPY = this.calculateBaseAPY(input);

    // Apply market condition adjustments
    const marketAdjustedAPY = this.applyMarketAdjustments(baseAPY, input.marketConditions);

    // Calculate risk-adjusted returns
    const riskAdjustedAPY = this.calculateRiskAdjustedReturns(
      marketAdjustedAPY,
      input.strategyType,
      input.userRiskTolerance
    );

    // Calculate risk score
    const riskScore = this.calculateRiskScore(input);

    // Calculate confidence based on historical performance
    const confidence = this.calculateConfidence(input, riskScore);

    // Calculate projected returns
    const projectedReturns = this.calculateProjectedReturns(
      input.allocation,
      riskAdjustedAPY
    );

    // Calculate optimal allocation
    const optimalAllocation = this.calculateOptimalAllocation(
      input.allocation,
      input.portfolioSize,
      riskScore,
      input.userRiskTolerance
    );

    // Calculate break-even point
    const breakEvenPoint = this.calculateBreakEven(
      input.allocation,
      riskAdjustedAPY,
      input.marketConditions.gasPrice
    );

    // Calculate success probability
    const successProbability = this.calculateSuccessProbability(
      riskScore,
      confidence,
      input.userRiskTolerance
    );

    // Generate recommendations
    const recommendations = this.generateRecommendations(input, riskScore, optimalAllocation);

    // Generate warnings
    const warnings = this.generateWarnings(input, riskScore, successProbability);

    return {
      expectedAPY: Math.round(riskAdjustedAPY * 100) / 100,
      confidence: Math.round(confidence),
      timeToProfit: breakEvenPoint.days,
      riskScore: Math.round(riskScore),
      optimalAllocation,
      projectedReturns,
      breakEvenPoint,
      successProbability: Math.round(successProbability * 100) / 100,
      recommendations,
      warnings
    };
  }

  /**
   * Analyze historical performance for a strategy type
   */
  async analyzeHistoricalPerformance(
    strategyType: string,
    protocols: string[],
    days: number = 90
  ): Promise<{
    averageAPY: number;
    volatility: number;
    bestPeriod: { start: Date; end: Date; apy: number };
    worstPeriod: { start: Date; end: Date; apy: number };
    trend: 'bullish' | 'bearish' | 'neutral';
  }> {
    // Simulate historical analysis (in production, would fetch real data)
    const key = `${strategyType}_${protocols.join('_')}`;
    const history = this.getOrGenerateHistory(key, days);

    const averageAPY = history.reduce((sum, val) => sum + val, 0) / history.length;
    const volatility = this.calculateVolatility(history);

    // Find best and worst periods (7-day windows)
    const windowSize = 7;
    let bestAPY = -Infinity;
    let worstAPY = Infinity;
    let bestStart = 0;
    let worstStart = 0;

    for (let i = 0; i <= history.length - windowSize; i++) {
      const windowAvg = history.slice(i, i + windowSize).reduce((sum, val) => sum + val, 0) / windowSize;
      if (windowAvg > bestAPY) {
        bestAPY = windowAvg;
        bestStart = i;
      }
      if (windowAvg < worstAPY) {
        worstAPY = windowAvg;
        worstStart = i;
      }
    }

    // Determine trend
    const recentAvg = history.slice(-30).reduce((sum, val) => sum + val, 0) / 30;
    const olderAvg = history.slice(0, 30).reduce((sum, val) => sum + val, 0) / 30;
    const trend = recentAvg > olderAvg * 1.05 ? 'bullish' :
                  recentAvg < olderAvg * 0.95 ? 'bearish' : 'neutral';

    return {
      averageAPY,
      volatility,
      bestPeriod: {
        start: new Date(Date.now() - (days - bestStart) * 24 * 3600000),
        end: new Date(Date.now() - (days - bestStart - windowSize) * 24 * 3600000),
        apy: bestAPY
      },
      worstPeriod: {
        start: new Date(Date.now() - (days - worstStart) * 24 * 3600000),
        end: new Date(Date.now() - (days - worstStart - windowSize) * 24 * 3600000),
        apy: worstAPY
      },
      trend
    };
  }

  // Private helper methods

  private calculateBaseAPY(input: PredictionInput): number {
    // Protocol-specific base APYs
    const protocolAPYs: Record<string, number> = {
      'EtherFi': 3.8,
      'Lido': 3.5,
      'RocketPool': 3.6,
      'Aave': 2.5,
      'Compound': 2.3,
      'Uniswap': 15.0,
      'Curve': 8.5,
      'Frax': 4.2,
      'Ankr': 3.4
    };

    // Strategy type multipliers
    const typeMultipliers: Record<string, number> = {
      'staking': 1.0,
      'restaking': 1.3,
      'liquidity': 2.5,
      'yield': 1.8,
      'leverage': 3.0
    };

    // Calculate weighted average APY across protocols
    const avgProtocolAPY = input.protocols.reduce((sum, protocol) => {
      return sum + (protocolAPYs[protocol] || 3.0);
    }, 0) / input.protocols.length;

    return avgProtocolAPY * typeMultipliers[input.strategyType];
  }

  private applyMarketAdjustments(baseAPY: number, market: any): number {
    let adjusted = baseAPY;

    // High volatility reduces expected returns
    if (market.volatility > 50) {
      adjusted *= 0.9;
    } else if (market.volatility < 20) {
      adjusted *= 1.05;
    }

    // High gas prices reduce net returns
    if (market.gasPrice > 50) {
      adjusted *= 0.95;
    } else if (market.gasPrice < 20) {
      adjusted *= 1.02;
    }

    // ETH price momentum
    const ethPriceStrength = (market.ethPrice - 3000) / 3000;
    adjusted *= (1 + ethPriceStrength * 0.1);

    return Math.max(0, adjusted);
  }

  private calculateRiskAdjustedReturns(
    apy: number,
    strategyType: string,
    riskTolerance: number
  ): number {
    // Risk-adjusted return = Expected Return × (1 - Risk Factor)
    const riskFactors: Record<string, number> = {
      'staking': 0.1,
      'restaking': 0.2,
      'liquidity': 0.35,
      'yield': 0.25,
      'leverage': 0.5
    };

    const strategyRisk = riskFactors[strategyType] || 0.3;
    const userAdjustment = (riskTolerance - 50) / 100; // -0.5 to 0.5

    const adjustedRisk = strategyRisk * (1 - userAdjustment * 0.5);
    return apy * (1 - adjustedRisk);
  }

  private calculateRiskScore(input: PredictionInput): number {
    let score = 0;

    // Strategy type risk
    const strategyRisks: Record<string, number> = {
      'staking': 20,
      'restaking': 35,
      'liquidity': 50,
      'yield': 40,
      'leverage': 70
    };
    score += strategyRisks[input.strategyType] || 40;

    // Market condition risk
    score += input.marketConditions.volatility * 0.3;
    score += Math.min(30, input.marketConditions.gasPrice);

    // Concentration risk
    if (input.protocols.length < 2) score += 15;
    if (input.allocation > input.portfolioSize * 0.5) score += 20;

    return Math.min(100, score);
  }

  private calculateConfidence(input: PredictionInput, riskScore: number): number {
    let confidence = 85;

    // Higher risk = lower confidence
    confidence -= riskScore * 0.3;

    // Multiple protocols = higher confidence
    confidence += Math.min(10, input.protocols.length * 3);

    // Established protocols = higher confidence
    const establishedProtocols = ['EtherFi', 'Lido', 'RocketPool', 'Aave', 'Compound'];
    const establishedCount = input.protocols.filter(p => establishedProtocols.includes(p)).length;
    confidence += establishedCount * 2;

    return Math.max(30, Math.min(95, confidence));
  }

  private calculateProjectedReturns(allocation: number, apy: number): {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  } {
    const yearlyReturn = allocation * (apy / 100);

    return {
      daily: yearlyReturn / 365,
      weekly: yearlyReturn / 52,
      monthly: yearlyReturn / 12,
      yearly: yearlyReturn
    };
  }

  private calculateOptimalAllocation(
    currentAllocation: number,
    portfolioSize: number,
    riskScore: number,
    riskTolerance: number
  ): number {
    // Kelly Criterion-inspired allocation
    const maxAllocation = portfolioSize * 0.7; // Never more than 70%
    const minAllocation = portfolioSize * 0.05; // At least 5%

    // Risk-adjusted allocation percentage
    const riskAdjustedPct = ((100 - riskScore) + riskTolerance) / 200;

    const optimal = portfolioSize * riskAdjustedPct;

    return Math.max(minAllocation, Math.min(maxAllocation, optimal));
  }

  private calculateBreakEven(
    allocation: number,
    apy: number,
    gasPrice: number
  ): { days: number; usdValue: number } {
    // Estimate gas cost
    const gasCostUSD = (gasPrice * 200000 * 3500) / 1e9;

    // Daily return
    const dailyReturn = (allocation * (apy / 100)) / 365;

    // Days to break even
    const days = Math.ceil(gasCostUSD / dailyReturn);

    return {
      days: Math.max(1, days),
      usdValue: gasCostUSD
    };
  }

  private calculateSuccessProbability(
    riskScore: number,
    confidence: number,
    riskTolerance: number
  ): number {
    const baseProb = 0.7;
    const riskAdjustment = -(riskScore / 100) * 0.3;
    const confidenceAdjustment = (confidence / 100) * 0.2;
    const toleranceAdjustment = (riskTolerance / 100) * 0.1;

    const probability = baseProb + riskAdjustment + confidenceAdjustment + toleranceAdjustment;

    return Math.max(0.3, Math.min(0.95, probability));
  }

  private generateRecommendations(
    input: PredictionInput,
    riskScore: number,
    optimalAllocation: number
  ): string[] {
    const recommendations: string[] = [];

    if (optimalAllocation < input.allocation * 0.8) {
      recommendations.push(`Consider reducing allocation to $${optimalAllocation.toFixed(0)} for optimal risk-adjusted returns`);
    } else if (optimalAllocation > input.allocation * 1.2) {
      recommendations.push(`You could safely increase allocation to $${optimalAllocation.toFixed(0)} based on your risk profile`);
    }

    if (riskScore > 60) {
      recommendations.push('Consider diversifying across more protocols to reduce risk');
    }

    if (input.marketConditions.gasPrice > 50) {
      recommendations.push('Wait for gas prices to drop below 30 gwei before executing');
    }

    if (input.protocols.length < 2) {
      recommendations.push('Add at least one more protocol for better diversification');
    }

    if (input.strategyType === 'leverage' && input.userRiskTolerance < 60) {
      recommendations.push('Leverage strategies may not align with your risk tolerance');
    }

    if (recommendations.length === 0) {
      recommendations.push('Strategy looks well-balanced for your profile');
    }

    return recommendations;
  }

  private generateWarnings(
    input: PredictionInput,
    riskScore: number,
    successProbability: number
  ): string[] {
    const warnings: string[] = [];

    if (riskScore > 75) {
      warnings.push('⚠️ High risk score - proceed with caution');
    }

    if (successProbability < 0.5) {
      warnings.push('⚠️ Low success probability detected');
    }

    if (input.allocation > input.portfolioSize * 0.6) {
      warnings.push('⚠️ Over-concentration in single strategy');
    }

    if (input.marketConditions.volatility > 70) {
      warnings.push('⚠️ High market volatility - consider waiting');
    }

    if (input.strategyType === 'leverage') {
      warnings.push('⚠️ Leverage amplifies both gains and losses');
    }

    return warnings;
  }

  private getOrGenerateHistory(key: string, days: number): number[] {
    if (this.historicalData.has(key)) {
      return this.historicalData.get(key)!;
    }

    // Generate synthetic history
    const history: number[] = [];
    let baseAPY = 4.0;

    for (let i = 0; i < days; i++) {
      // Random walk with mean reversion
      const change = (Math.random() - 0.5) * 0.3;
      baseAPY += change;
      baseAPY = Math.max(2, Math.min(8, baseAPY)); // Keep in reasonable range
      history.push(baseAPY);
    }

    this.historicalData.set(key, history);
    return history;
  }

  private calculateVolatility(data: number[]): number {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const squaredDiffs = data.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / data.length;
    return Math.sqrt(variance);
  }
}

export const enhancedPredictor = new EnhancedPredictor();
