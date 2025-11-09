/**
 * API Route: Generate DeFi Strategy with Claude AI
 *
 * This endpoint uses Claude to analyze the user's portfolio
 * and generate an optimal DeFi strategy with calldata
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { userAddress, portfolioContext, fromToken, amount } = await request.json();

    if (!userAddress || !fromToken || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use Claude to generate optimal strategy
    const prompt = `You are a DeFi strategy architect for an EigenLayer AVS system.

User Context:
- Wallet Address: ${userAddress}
- Portfolio: ${portfolioContext || 'Not provided'}
- Current Token: ${fromToken}
- Amount to Deploy: ${amount} tokens

Task: Generate an optimal DeFi strategy for this user.

Consider:
1. Best protocols to deploy to (Aave, Compound, Pendle, Morpho, etc.)
2. Current APY rates
3. Gas costs
4. Risk factors
5. Slippage tolerance

Respond with ONLY valid JSON in this exact format:
{
  "toContract": "0x... (destination protocol contract address)",
  "callData": "0x... (encoded function call)",
  "minOutput": "X.XX (minimum output tokens as decimal string)",
  "reasoning": "Brief explanation of why this strategy is optimal",
  "estimatedAPY": "X.XX (expected APY as percentage)",
  "riskLevel": "low|medium|high"
}

Use real mainnet addresses. For example:
- Aave V3 Pool: 0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2
- Compound V3 USDC: 0xc3d688B66703497DAA19211EEdff47f25384cdc3
- Pendle Router: 0x00000000005BBB0EF59571E58418F9a4357b68A0`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const strategy = JSON.parse(jsonMatch[0]);

    // Validate response structure
    if (!strategy.toContract || !strategy.minOutput || !strategy.reasoning) {
      throw new Error('Invalid strategy format from AI');
    }

    return NextResponse.json(strategy);
  } catch (error: any) {
    console.error('Strategy generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate strategy' },
      { status: 500 }
    );
  }
}
