import Anthropic from '@anthropic-ai/sdk';
import type {
  ChatContext,
  ResponseStyle,
  UserLevel,
  TieredExplanation,
  ConversationPath,
  UserPortfolio,
} from '@/types';

/**
 * ARCHITECT CHATBOT
 * Enhanced chatbot with tiered explanations and adaptive responses
 */
export class ArchitectChatbot {
  private anthropic: Anthropic;
  private conversationMemory = new Map<string, ChatContext>();

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    });
  }

  /**
   * Calculate portfolio concentration risk
   */
  private calculateConcentrationRisk(portfolio: UserPortfolio): number {
    // For now, eETH-only portfolio has moderate concentration (5/10)
    // In a diversified portfolio, this would calculate based on asset distribution
    return 5;
  }

  /**
   * Calculate leverage risk
   */
  private calculateLeverageRisk(portfolio: UserPortfolio): number {
    // EtherFi liquid staking has no leverage
    return 0;
  }

  /**
   * Calculate complexity risk
   */
  private calculateComplexityRisk(portfolio: UserPortfolio): number {
    // Simple staking = low complexity
    return 2;
  }

  /**
   * Calculate liquidity risk
   */
  private calculateLiquidityRisk(portfolio: UserPortfolio): number {
    // eETH is liquid, low risk
    return 3;
  }

  /**
   * Calculate overall portfolio risk
   * Unique feature: Portfolio risk heat mapping
   */
  private calculatePortfolioRisk(portfolio: UserPortfolio): number {
    const factors = {
      concentration: this.calculateConcentrationRisk(portfolio),
      leverage: this.calculateLeverageRisk(portfolio),
      complexity: this.calculateComplexityRisk(portfolio),
      liquidity: this.calculateLiquidityRisk(portfolio),
    };

    const riskScore = Math.min(
      10,
      factors.concentration * 0.3 +
        factors.leverage * 0.4 +
        factors.complexity * 0.2 +
        factors.liquidity * 0.1
    );

    return Math.round(riskScore * 10) / 10;
  }

  /**
   * Get response style based on context
   * Unique feature: Context-aware response styling
   */
  private getResponseStyle(context: ChatContext): ResponseStyle {
    const portfolio = context.portfolio;
    if (!portfolio) return 'general';

    const riskLevel = this.calculatePortfolioRisk(portfolio);

    if (riskLevel > 7) return 'cautious';
    if ((portfolio.eethBalanceUSD || 0) > 100000) return 'sophisticated';
    if (context.userProfile?.experienceLevel === 'beginner') return 'educational';

    return 'balanced';
  }

  /**
   * Call Claude API
   */
  private async callClaude(
    prompt: string,
    options: {
      systemPrompt: string;
      maxTokens: number;
      temperature?: number;
    }
  ): Promise<string> {
    const message = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: options.maxTokens,
      temperature: options.temperature || 0.7,
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
   * Generate Tiered Explanation
   * Unique feature: Adaptive explanation depth
   */
  async generateTieredExplanation(
    concept: string,
    userLevel: UserLevel
  ): Promise<TieredExplanation | null> {
    const prompt = `
Generate tiered explanation for: ${concept}

USER LEVEL: ${userLevel}
CONCEPT: ${concept}

Provide three explanation tiers:

TIER 1 (Beginner - 1 sentence):
- Simple analogy or metaphor

TIER 2 (Intermediate - 2-3 sentences):
- Core mechanics explained simply
- Basic risks/benefits

TIER 3 (Advanced - technical details):
- Technical implementation
- Advanced considerations
- Protocol-specific details

Format as JSON:
{
  "concept": "${concept}",
  "tier1": "...",
  "tier2": "...",
  "tier3": "...",
  "confidence": 0-100
}

Return ONLY valid JSON, no markdown.
`;

    const response = await this.callClaude(prompt, {
      systemPrompt: 'You are a master educator for DeFi concepts.',
      maxTokens: 1024,
      temperature: 0.5,
    });

    return this.parseJSONResponse<TieredExplanation>(response);
  }

  /**
   * Guide Strategy Conversation
   * Unique feature: Strategy conversation flow
   */
  async guideStrategyConversation(
    userInput: string,
    context: ChatContext
  ): Promise<ConversationPath | null> {
    const prompt = `
STRATEGY CONVERSATION GUIDANCE

USER INPUT: ${userInput}
CONTEXT: ${JSON.stringify(
      {
        sessionId: context.sessionId,
        hasProfile: !!context.userProfile,
        hasPortfolio: !!context.portfolio,
        messageCount: context.conversationHistory.length,
      },
      null,
      2
    )}

Determine the optimal conversation path:

OPTIONS:
1. EDUCATION_PATH - User needs concept explanation
2. STRATEGY_PATH - User wants strategy recommendations
3. RISK_PATH - User is concerned about risks
4. EXECUTION_PATH - User ready to implement
5. COMPARISON_PATH - User comparing options

Return the optimal path and next guiding question as JSON:
{
  "path": "EDUCATION_PATH" | "STRATEGY_PATH" | "RISK_PATH" | "EXECUTION_PATH" | "COMPARISON_PATH",
  "nextQuestion": "...",
  "reasoning": "..."
}

Return ONLY valid JSON, no markdown.
`;

    const response = await this.callClaude(prompt, {
      systemPrompt: 'You are a conversational guide for DeFi strategy discussions.',
      maxTokens: 512,
      temperature: 0.6,
    });

    return this.parseJSONResponse<ConversationPath>(response);
  }

  /**
   * Generate contextual response
   */
  async generateContextualResponse(
    userInput: string,
    context: ChatContext
  ): Promise<string> {
    const responseStyle = this.getResponseStyle(context);
    const riskLevel = context.portfolio
      ? this.calculatePortfolioRisk(context.portfolio)
      : 0;

    const stylePrompts: Record<ResponseStyle, string> = {
      general: 'Be helpful and informative.',
      cautious:
        'Be cautious and risk-aware. Emphasize safety and risk management.',
      sophisticated:
        'Use technical language. Assume deep DeFi knowledge.',
      educational:
        'Be patient and educational. Use analogies and simple examples.',
      balanced:
        'Balance technical accuracy with accessibility.',
    };

    const systemPrompt = `You are Yield Architect, an expert DeFi advisor specializing in EtherFi liquid staking.

RESPONSE STYLE: ${responseStyle}
${stylePrompts[responseStyle]}

PORTFOLIO RISK LEVEL: ${riskLevel}/10

CONTEXT:
- User has portfolio: ${!!context.portfolio}
- Portfolio value: ${context.portfolio ? `$${context.portfolio.eethBalanceUSD?.toFixed(2)}` : 'Unknown'}
- User experience: ${context.userProfile?.experienceLevel || 'Unknown'}

Keep responses concise (2-4 sentences) unless detailed analysis is requested.
`;

    return await this.callClaude(userInput, {
      systemPrompt,
      maxTokens: 1024,
      temperature: 0.7,
    });
  }

  /**
   * Store conversation context
   */
  storeContext(context: ChatContext): void {
    this.conversationMemory.set(context.sessionId, context);
  }

  /**
   * Get conversation context
   */
  getContext(sessionId: string): ChatContext | undefined {
    return this.conversationMemory.get(sessionId);
  }

  /**
   * Clear conversation context
   */
  clearContext(sessionId: string): void {
    this.conversationMemory.delete(sessionId);
  }

  /**
   * Get memory statistics
   */
  getMemoryStats(): {
    activeSessions: number;
    totalMessages: number;
  } {
    let totalMessages = 0;
    const contexts = Array.from(this.conversationMemory.values());
    for (const context of contexts) {
      totalMessages += context.conversationHistory.length;
    }

    return {
      activeSessions: this.conversationMemory.size,
      totalMessages,
    };
  }
}

// Export singleton instance
export const architectChatbot = new ArchitectChatbot();
