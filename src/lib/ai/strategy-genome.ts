import Anthropic from '@anthropic-ai/sdk';
import type {
  Strategy,
  StrategyFitness,
  StrategyCompatibility,
  CompatibilityMatrix,
  UserProfile,
  DynamicRiskProfile,
  MarketConditions,
} from '@/types';

/**
 * STRATEGY GENOME ANALYZER
 * Advanced strategy analysis with unique scoring metrics
 */
export class StrategyGenomeAnalyzer {
  private anthropic: Anthropic;

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    });
  }

  /**
   * Calculate yield potential score
   */
  private calculateYieldScore(strategy: Strategy): number {
    const apy = strategy.expectedAnnualYield || 0;
    // Normalize to 0-100 scale (assuming max APY of 50%)
    return Math.min(100, (apy / 50) * 100);
  }

  /**
   * Calculate risk-adjusted score
   */
  private calculateRiskAdjustedScore(strategy: Strategy): number {
    const yieldScore = this.calculateYieldScore(strategy);
    const riskPenalty = strategy.risks.length * 10; // Each risk factor reduces score
    return Math.max(0, yieldScore - riskPenalty);
  }

  /**
   * Calculate gas efficiency
   * Unique feature: Gas-aware yield calculation
   */
  private calculateGasEfficiency(strategy: Strategy): number {
    const gasCost = strategy.estimatedGasCost || 0;
    const positionSize = strategy.positionSize || 1;

    if (positionSize === 0) return 0;

    const gasAsPercentage = (gasCost / positionSize) * 100;
    const efficiency = Math.max(0, 100 - gasAsPercentage * 1000); // Scale factor

    return Math.min(100, efficiency);
  }

  /**
   * Calculate time alignment score
   */
  private calculateTimeAlignment(strategy: Strategy, userProfile: UserProfile): number {
    const strategyHorizon = strategy.type === 'yield' ? 'long' : 'short';
    const userHorizon = userProfile.timeHorizon;

    const alignmentMap: Record<string, Record<string, number>> = {
      short: { short: 100, medium: 60, long: 30 },
      medium: { short: 60, medium: 100, long: 60 },
      long: { short: 30, medium: 60, long: 100 },
    };

    return alignmentMap[strategyHorizon]?.[userHorizon] || 50;
  }

  /**
   * Calculate complexity match score
   */
  private calculateComplexityMatch(strategy: Strategy, userProfile: UserProfile): number {
    const strategyComplexity = strategy.complexity || 5;
    const userLevel = userProfile.experienceLevel;

    const maxComplexity: Record<string, number> = {
      beginner: 3,
      intermediate: 7,
      advanced: 10,
    };

    const userMax = maxComplexity[userLevel] || 5;

    if (strategyComplexity <= userMax) {
      return 100;
    } else {
      // Penalty for complexity exceeding user level
      const excess = strategyComplexity - userMax;
      return Math.max(0, 100 - excess * 15);
    }
  }

  /**
   * Calculate overall fitness score
   */
  private calculateOverallScore(fitness: StrategyFitness): number {
    const weights = {
      yieldPotential: 0.3,
      riskAdjusted: 0.25,
      gasEfficiency: 0.2,
      timeAlignment: 0.15,
      complexityAppropriateness: 0.1,
    };

    const score =
      fitness.yieldPotential * weights.yieldPotential +
      fitness.riskAdjusted * weights.riskAdjusted +
      fitness.gasEfficiency * weights.gasEfficiency +
      fitness.timeAlignment * weights.timeAlignment +
      fitness.complexityAppropriateness * weights.complexityAppropriateness;

    return Math.round(score);
  }

  /**
   * Calculate multi-dimensional strategy fitness
   * Unique feature: Multi-dimensional strategy scoring
   */
  calculateStrategyFitness(strategy: Strategy, userProfile: UserProfile): StrategyFitness {
    return {
      yieldPotential: this.calculateYieldScore(strategy),
      riskAdjusted: this.calculateRiskAdjustedScore(strategy),
      gasEfficiency: this.calculateGasEfficiency(strategy),
      timeAlignment: this.calculateTimeAlignment(strategy, userProfile),
      complexityAppropriateness: this.calculateComplexityMatch(strategy, userProfile),
    };
  }

  /**
   * Call Claude API
   */
  private async callClaude(
    prompt: string,
    options: {
      systemPrompt: string;
      maxTokens: number;
    }
  ): Promise<string> {
    const message = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: options.maxTokens,
      system: options.systemPrompt,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    return content.type === 'text' ? content.text : 'Unable to generate response';
  }

  /**
   * Generate compatibility reasoning
   */
  private async generateCompatibilityReasoning(
    strategy: Strategy,
    userProfile: UserProfile,
    fitness: StrategyFitness
  ): Promise<string> {
    const prompt = `
Analyze strategy compatibility:

STRATEGY: ${strategy.name}
- Type: ${strategy.type}
- Complexity: ${strategy.complexity}/10
- Expected Yield: ${strategy.expectedAnnualYield}%
- Risks: ${strategy.risks.join(', ')}

USER PROFILE:
- Experience: ${userProfile.experienceLevel}
- Risk Tolerance: ${userProfile.riskTolerance}
- Time Horizon: ${userProfile.timeHorizon}

FITNESS SCORES:
- Yield Potential: ${fitness.yieldPotential}/100
- Risk Adjusted: ${fitness.riskAdjusted}/100
- Gas Efficiency: ${fitness.gasEfficiency}/100
- Time Alignment: ${fitness.timeAlignment}/100
- Complexity Match: ${fitness.complexityAppropriateness}/100

Provide a 2-3 sentence explanation of why this strategy is or isn't suitable for this user.
`;

    return await this.callClaude(prompt, {
      systemPrompt: 'You are a strategy compatibility analyst.',
      maxTokens: 512,
    });
  }

  /**
   * Generate compatibility matrix
   * Unique feature: Strategy compatibility matrix
   */
  async generateCompatibilityMatrix(
    userProfile: UserProfile,
    strategies: Strategy[]
  ): Promise<CompatibilityMatrix> {
    const matrix: CompatibilityMatrix = {
      userProfile,
      recommendedStrategies: [],
      cautionStrategies: [],
      incompatibleStrategies: [],
    };

    for (const strategy of strategies) {
      const fitness = this.calculateStrategyFitness(strategy, userProfile);
      const overallScore = this.calculateOverallScore(fitness);

      const compatibility: StrategyCompatibility = {
        strategy,
        fitness,
        overallScore,
        reasoning: await this.generateCompatibilityReasoning(
          strategy,
          userProfile,
          fitness
        ),
      };

      if (overallScore >= 80) {
        matrix.recommendedStrategies.push(compatibility);
      } else if (overallScore >= 60) {
        matrix.cautionStrategies.push(compatibility);
      } else {
        matrix.incompatibleStrategies.push(compatibility);
      }
    }

    // Sort by score
    matrix.recommendedStrategies.sort((a, b) => b.overallScore - a.overallScore);
    matrix.cautionStrategies.sort((a, b) => b.overallScore - a.overallScore);
    matrix.incompatibleStrategies.sort((a, b) => b.overallScore - a.overallScore);

    return matrix;
  }

  /**
   * Parse JSON response safely
   */
  private parseJSONResponse<T>(response: string): T | null {
    try {
      const cleaned = response
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      return JSON.parse(cleaned);
    } catch (error) {
      console.error('Failed to parse JSON response:', error);
      return null;
    }
  }

  /**
   * Generate dynamic risk profile
   * Unique feature: Dynamic risk profiling
   */
  async generateDynamicRiskProfile(
    strategy: Strategy,
    marketConditions: MarketConditions
  ): Promise<DynamicRiskProfile | null> {
    const prompt = `
DYNAMIC RISK PROFILING

STRATEGY: ${strategy.name}
TYPE: ${strategy.type}
COMPLEXITY: ${strategy.complexity}/10

MARKET CONDITIONS:
- Volatility: ${marketConditions.volatility}/100
- Liquidity: ${marketConditions.liquidity}
- Regulatory: ${marketConditions.regulatoryEnvironment}
- Network Health: ${marketConditions.networkHealth}

Calculate dynamic risk scores (1-100) for:

1. MARKET RISK - Price volatility impact
2. LIQUIDITY RISK - Exit difficulty
3. SMART CONTRACT RISK - Protocol safety
4. OPERATIONAL RISK - Execution complexity
5. SYSTEMIC RISK - Ecosystem dependencies

Provide current scores and 3 stress test scenarios.

Return as JSON:
{
  "marketRisk": number,
  "liquidityRisk": number,
  "smartContractRisk": number,
  "operationalRisk": number,
  "systemicRisk": number,
  "overallRiskScore": number,
  "stressScenarios": [
    {
      "name": "...",
      "description": "...",
      "impact": "low" | "medium" | "high" | "critical",
      "probability": number (0-100),
      "mitigation": "..."
    }
  ]
}

Return ONLY valid JSON, no markdown.
`;

    const response = await this.callClaude(prompt, {
      systemPrompt: 'You are a quantitative risk analyst specializing in DeFi.',
      maxTokens: 2048,
    });

    return this.parseJSONResponse<DynamicRiskProfile>(response);
  }
}

// Export singleton instance
export const strategyGenomeAnalyzer = new StrategyGenomeAnalyzer();
