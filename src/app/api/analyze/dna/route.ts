import { NextRequest, NextResponse } from 'next/server';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { yieldArchitectAI } from '@/lib/ai/claude-core';
import { strategyGenomeAnalyzer } from '@/lib/ai/strategy-genome';
import type { Strategy, UserProfile, MarketConditions } from '@/types';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

/**
 * Rate Limiter Configuration
 * Unique feature: Complexity-based rate limiting
 */
const strategyRateLimiter = new RateLimiterMemory({
  points: 10, // 10 strategy analyses
  duration: 60, // per minute
});

/**
 * Calculate strategy complexity for rate limiting
 */
function calculateStrategyComplexity(strategy: Partial<Strategy>): number {
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
 * Generate user-friendly error messages
 */
function generateUserFriendlyError(error: any, context: string): string {
  if (error.message?.includes('API key')) {
    return 'AI service configuration error. Please contact support.';
  }

  if (error.message?.includes('rate limit')) {
    return `Too many ${context} requests. Please try again in a moment.`;
  }

  if (error.message?.includes('complexity')) {
    return 'Strategy is too complex to analyze. Please simplify or break it down.';
  }

  if (error.message?.includes('timeout')) {
    return `${context} took too long. Please try again.`;
  }

  return `Failed to complete ${context}. Please try again.`;
}

/**
 * Get recovery suggestion for errors
 */
function getRecoverySuggestion(error: any): string {
  if (error.message?.includes('rate limit')) {
    return 'Try again in a few minutes or simplify your strategy';
  }

  if (error.message?.includes('complexity')) {
    return 'Break your strategy into smaller steps or reduce the number of protocols';
  }

  if (error.message?.includes('insufficient data')) {
    return 'Provide more details about your current positions and goals';
  }

  if (error.message?.includes('timeout')) {
    return 'Reduce the complexity of your analysis request';
  }

  return 'Check your inputs and try again. Contact support if the issue persists.';
}

/**
 * Generate optimization suggestions based on analysis
 */
async function generateOptimizationSuggestions(
  analysis: any,
  marketConditions: MarketConditions
): Promise<string[]> {
  const suggestions: string[] = [];

  // Gas optimization
  if (marketConditions.gasConditions === 'high') {
    suggestions.push('Consider waiting for lower gas prices to execute transactions');
  }

  // Market condition suggestions
  if (marketConditions.volatility > 70) {
    suggestions.push(
      'High volatility detected - consider reducing position sizes or adding stop losses'
    );
  }

  if (marketConditions.defiTVLTrend === 'down') {
    suggestions.push('DeFi TVL is declining - be cautious with new positions');
  }

  // Yield optimization
  if (analysis.dnaProfile?.yieldScore < 50) {
    suggestions.push('Explore higher yield opportunities in the EtherFi ecosystem');
  }

  return suggestions;
}

/**
 * POST /api/analyze/dna
 * Analyze strategy DNA with enhanced features
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Parse request body
    const body = await request.json();
    const { strategy, userProfile, marketConditions } = body;

    // Validate inputs
    if (!strategy && !userProfile?.portfolio) {
      return NextResponse.json(
        {
          error: 'Missing required data',
          suggestion: 'Provide either a strategy or user portfolio for analysis',
        },
        { status: 400 }
      );
    }

    // Calculate complexity
    const complexity = calculateStrategyComplexity(strategy || {});

    // Apply rate limiting with complexity-based points
    const pointsToConsume = Math.min(10, Math.ceil(complexity / 2));

    try {
      // Get client identifier for rate limiting
      const clientId =
        request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'anonymous';

      await strategyRateLimiter.consume(clientId, pointsToConsume);
    } catch (rateLimitError: any) {
      return NextResponse.json(
        {
          error: 'Strategy analysis limit exceeded',
          retryAfter: Math.ceil(rateLimitError.msBeforeNext / 1000),
          suggestion: 'Simplify your strategy or wait a few minutes',
        },
        { status: 429 }
      );
    }

    // Determine analysis depth based on complexity
    const analysisDepth = complexity > 7 ? 'deep' : complexity > 4 ? 'standard' : 'quick';

    // Use default market conditions if not provided
    const defaultMarketConditions: MarketConditions = {
      ethDominance: 18,
      defiTVLTrend: 'stable',
      gasConditions: 'medium',
      volatility: 50,
      liquidity: 'medium',
      regulatoryEnvironment: 'neutral',
      networkHealth: 'good',
    };

    const conditions = marketConditions || defaultMarketConditions;

    // Perform DNA analysis
    const analysis = userProfile?.portfolio
      ? await yieldArchitectAI.analyzeStrategyDNA(userProfile.portfolio, conditions)
      : null;

    if (!analysis) {
      return NextResponse.json(
        {
          error: 'Failed to generate analysis',
          suggestion: 'Ensure you provide valid portfolio data',
        },
        { status: 500 }
      );
    }

    // Generate optimization suggestions
    const optimizations = await generateOptimizationSuggestions(analysis, conditions);

    // Calculate processing time
    const processingTime = Date.now() - startTime;

    // Return successful response
    return NextResponse.json({
      success: true,
      analysis: {
        ...analysis,
        analysisDepth,
        optimizations,
        metadata: {
          processingTime,
          complexity,
          cacheStatus: 'miss', // Would be 'hit' if from cache
        },
      },
    });
  } catch (error: any) {
    console.error('DNA Analysis error:', error);

    // Generate user-friendly error message
    const userMessage = generateUserFriendlyError(error, 'strategy analysis');
    const suggestion = getRecoverySuggestion(error);

    return NextResponse.json(
      {
        error: userMessage,
        technical: process.env.NODE_ENV === 'development' ? error.message : undefined,
        suggestion,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analyze/dna
 * Get cache statistics
 */
export async function GET() {
  try {
    const cacheStats = yieldArchitectAI.getCacheStats();

    return NextResponse.json({
      success: true,
      cache: cacheStats,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Failed to get cache statistics',
        technical: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
