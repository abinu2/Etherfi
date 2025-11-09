import Anthropic from '@anthropic-ai/sdk';
import type {
  Strategy,
  DNAProfile,
  DNAAnalysisResponse,
  UserPortfolio,
  MarketConditions,
  CacheEntry,
  ConfidenceMetrics,
  OptimizationPlan,
} from '@/types';

/**
 * YIELD ARCHITECT AI CORE
 * Features the unique "Strategy DNA" profiling system
 */
export class YieldArchitectAI {
  private anthropic: Anthropic;
  private strategyCache = new Map<string, CacheEntry>();
  private cacheTTL: number;
  private maxTokens: number;

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    });
    this.cacheTTL = parseInt(process.env.NEXT_PUBLIC_CACHE_TTL || '300', 10) * 1000;
    this.maxTokens = parseInt(process.env.NEXT_PUBLIC_AI_TOKEN_BUDGET || '4096', 10);
  }

  /**
   * Calculate Strategy Complexity Score
   * Unique feature: Strategy DNA complexity scoring
   */
  private calculateStrategyComplexity(strategy: Partial<Strategy>): number {
    const factors = {
      protocolCount: strategy.protocols?.length || 0,
      transactionSteps: strategy.steps?.length || 0,
      riskFactors: strategy.risks?.length || 0,
      gasEstimate: strategy.estimatedGas || 0,
    };

    const complexity = Math.min(
      10,
      factors.protocolCount * 2 +
        factors.transactionSteps * 1.5 +
        factors.riskFactors * 1.2 +
        (factors.gasEstimate > 1000000 ? 2 : 0)
    );

    return Math.max(1, Math.round(complexity));
  }

  /**
   * Calculate Optimal Token Budget
   * Unique feature: Adaptive token budgeting based on complexity
   */
  private calculateOptimalTokens(complexity: number, queryType: string): number {
    const baseTokens: Record<string, number> = {
      chat: 1024,
      analysis: 2048,
      strategy: 3072,
      risk: 1536,
    };

    const base = baseTokens[queryType] || 1024;
    const adjusted = Math.min(this.maxTokens, base * (1 + complexity * 0.1));

    return Math.round(adjusted);
  }

  /**
   * Generate Portfolio Genome Visualization
   * Unique visual representation of portfolio composition
   */
  private generatePortfolioGenome(portfolio: UserPortfolio): string {
    const assets = [
      {
        symbol: 'eETH',
        valueUSD: portfolio.eethBalanceUSD,
      },
    ];

    const totalValue = portfolio.eethBalanceUSD || 1;

    return assets
      .map((asset) => {
        const percentage = (asset.valueUSD / totalValue) * 100;
        const bars = '█'.repeat(Math.max(1, Math.round(percentage / 5)));
        return `${asset.symbol.padEnd(8)} ${bars} ${percentage.toFixed(1)}%`;
      })
      .join('\n');
  }

  /**
   * Get DNA Analysis System Prompt
   */
  private getDNAAnalysisPrompt(): string {
    return `You are the Strategy DNA Analyst for Yield Architect.

UNIQUE FRAMEWORKS:
1. PORTFOLIO GENOME MAPPING - Visualize asset allocation
2. YIELD COMPOUNDING CURVE - Project growth with reinvestment
3. RISK-RETURN MATRIX - Balance safety and returns
4. GAS-AWARE OPTIMIZATION - Cost-efficient execution

RESPONSE STRUCTURE:
{
  "dnaProfile": {
    "yieldScore": number (1-100),
    "riskRating": "A" | "B" | "C" | "D" | "F",
    "gasTier": 1-5,
    "timeHorizon": "Short" | "Medium" | "Long",
    "uniqueOpportunities": string[],
    "overallScore": number (1-100),
    "compatibilityScore": number (1-100)
  },
  "optimizationPlan": {
    "immediateActions": string[],
    "mediumTermGoals": string[],
    "riskMitigations": string[]
  },
  "confidenceMetrics": {
    "dataQuality": number (0-100),
    "marketAlignment": number (0-100),
    "executionFeasibility": number (0-100)
  }
}

IMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, just pure JSON.

Be analytical but accessible. Use the Portfolio Genome for visual reasoning.`;
  }

  /**
   * Call Claude API with caching
   */
  private async callClaude(
    prompt: string,
    options: {
      systemPrompt: string;
      maxTokens: number;
      temperature?: number;
    }
  ): Promise<any> {
    const cacheKey = `${prompt}_${options.systemPrompt}`;

    // Check cache
    const cached = this.strategyCache.get(cacheKey);
    if (cached && cached.expiresAt > new Date()) {
      cached.hits++;
      return cached.data;
    }

    // Call Claude
    const message = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: options.maxTokens,
      temperature: options.temperature || 0.3,
      system: options.systemPrompt,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    const response = content.type === 'text' ? content.text : '';

    // Cache the response
    const expiresAt = new Date(Date.now() + this.cacheTTL);
    this.strategyCache.set(cacheKey, {
      data: response,
      timestamp: new Date(),
      expiresAt,
      hits: 1,
    });

    // Clean old cache entries
    this.cleanCache();

    return response;
  }

  /**
   * Clean expired cache entries
   */
  private cleanCache(): void {
    const now = new Date();
    const entries = Array.from(this.strategyCache.entries());
    for (const [key, entry] of entries) {
      if (entry.expiresAt < now) {
        this.strategyCache.delete(key);
      }
    }
  }

  /**
   * Parse JSON response safely
   */
  private parseJSONResponse<T>(response: string): T | null {
    try {
      // Remove markdown code blocks if present
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
   * Analyze Strategy DNA
   * Main feature: Strategy DNA Profile Analysis
   */
  async analyzeStrategyDNA(
    userPortfolio: UserPortfolio,
    marketData: MarketConditions
  ): Promise<DNAAnalysisResponse | null> {
    const portfolioAsStrategy: Partial<Strategy> = {
      protocols: ['EtherFi'],
      steps: [],
      risks: [],
      estimatedGas: 100000,
    };

    const complexity = this.calculateStrategyComplexity(portfolioAsStrategy);
    const tokens = this.calculateOptimalTokens(complexity, 'strategy');

    const prompt = `
YIELD ARCHITECT STRATEGY DNA ANALYSIS

PORTFOLIO GENOME:
${this.generatePortfolioGenome(userPortfolio)}

PORTFOLIO DETAILS:
- Balance: ${userPortfolio.eethBalance} eETH
- USD Value: $${userPortfolio.eethBalanceUSD?.toFixed(2)}
- Current APY: ${userPortfolio.currentAPY}%

MARKET CONDITIONS:
- ETH Dominance: ${marketData.ethDominance}%
- DeFi TVL Trend: ${marketData.defiTVLTrend}
- Gas Environment: ${marketData.gasConditions}
- Volatility Index: ${marketData.volatility}/100

STRATEGY COMPLEXITY: ${complexity}/10

Generate a "Strategy DNA Profile" with:
1. Yield Potential Score (1-100)
2. Risk Resilience Rating (A-F)
3. Gas Efficiency Tier (1-5)
4. Time Horizon Match (Short/Medium/Long)
5. Unique Optimization Opportunities

Format as structured JSON with explanations.
`;

    const response = await this.callClaude(prompt, {
      systemPrompt: this.getDNAAnalysisPrompt(),
      maxTokens: tokens,
      temperature: 0.3,
    });

    return this.parseJSONResponse<DNAAnalysisResponse>(response);
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    totalHits: number;
    entries: Array<{ key: string; hits: number; age: number }>;
  } {
    const now = Date.now();
    const entries = Array.from(this.strategyCache.entries()).map(([key, entry]) => ({
      key: key.substring(0, 50) + '...',
      hits: entry.hits,
      age: Math.round((now - entry.timestamp.getTime()) / 1000),
    }));

    const totalHits = entries.reduce((sum, e) => sum + e.hits, 0);

    return {
      size: this.strategyCache.size,
      totalHits,
      entries,
    };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.strategyCache.clear();
  }
}

// Export singleton instance
export const yieldArchitectAI = new YieldArchitectAI();
