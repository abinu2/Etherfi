import Anthropic from '@anthropic-ai/sdk';

/**
 * Initialize Anthropic Claude API client
 */
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export default anthropic;

/**
 * Generate AI response for portfolio analysis and recommendations
 */
export async function generateAIResponse(
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemPrompt || 'You are an expert DeFi advisor specializing in EtherFi liquid staking and gas optimization strategies.',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      return content.text;
    }

    return 'Unable to generate response';
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate AI response');
  }
}

/**
 * Analyze user portfolio and provide recommendations
 */
export async function analyzePortfolio(
  eethBalance: string,
  currentAPY: number,
  gasPrice: number
): Promise<string> {
  const prompt = `
Analyze this EtherFi portfolio:
- eETH Balance: ${eethBalance}
- Current APY: ${currentAPY}%
- Current Gas Price: ${gasPrice} gwei

Provide:
1. Brief portfolio health assessment (2-3 sentences)
2. Top 3 actionable recommendations
3. Gas optimization strategy
4. Potential risks to consider

Keep the response concise and actionable.
`;

  return generateAIResponse(prompt);
}

/**
 * Predict optimal gas timing
 */
export async function predictGasOptimization(
  currentGas: number,
  transactionType: string
): Promise<string> {
  const prompt = `
Current gas price is ${currentGas} gwei.
Transaction type: ${transactionType}

Provide:
1. Should the user transact now or wait?
2. Expected optimal time window
3. Estimated savings if they wait
4. Confidence level and reasoning

Keep the response brief and actionable.
`;

  return generateAIResponse(prompt);
}
