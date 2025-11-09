import { callClaude } from '../api/claude-service';

interface StrategyAnalysis {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  confidence: number;
}

const ANALYST_SYSTEM = `You are a DeFi strategy analyst specializing in EtherFi and EigenLayer.

ANALYZE strategies considering:
- Yield potential vs risk
- Diversification across AVSs and vaults
- Capital efficiency
- Market conditions

OUTPUT FORMAT:
SUMMARY: [2 sentences max]
STRENGTHS: [2-3 bullet points]
WEAKNESSES: [2-3 bullet points]
RECOMMENDATIONS: [2-3 specific actions]
CONFIDENCE: [0-100]`;

export class AIStrategyAnalyzer {

  async analyze(
    currentAllocation: any,
    proposedAllocation: any,
    metrics: {
      currentAPY: number;
      projectedAPY: number;
      portfolioSize: number;
      slashingRisk: number;
    }
  ): Promise<StrategyAnalysis> {

    const prompt = `
CURRENT STRATEGY:
- EigenLayer: ${currentAllocation.eigenLayer}%
- Vaults: ${currentAllocation.vaults}%
- Reserves: ${currentAllocation.reserves}%
- APY: ${metrics.currentAPY}%

PROPOSED STRATEGY:
- EigenLayer: ${proposedAllocation.eigenLayer}%
- Vaults: ${proposedAllocation.vaults}%
- Reserves: ${proposedAllocation.reserves}%
- Projected APY: ${metrics.projectedAPY}%
- APY Increase: +${(metrics.projectedAPY - metrics.currentAPY).toFixed(2)}%

PORTFOLIO SIZE: $${metrics.portfolioSize.toLocaleString()}
SLASHING RISK: ${metrics.slashingRisk}/100

Analyze this strategy transition.`;

    const result = await callClaude(prompt, {
      system: ANALYST_SYSTEM,
      maxTokens: 800,
      temp: 0.6,
      useCache: true
    });

    return this.parseAnalysis(result.text);
  }

  async explainRisk(risk: {
    category: string;
    severity: string;
    description: string;
  }): Promise<string> {

    const prompt = `Explain this risk in simple terms (under 100 words):

RISK: ${risk.category}
SEVERITY: ${risk.severity}
DETAILS: ${risk.description}

Format:
1. What this means (1 sentence)
2. Real example (1 sentence)
3. How to mitigate (1 sentence)`;

    const result = await callClaude(prompt, {
      system: 'You explain DeFi risks clearly to non-experts.',
      maxTokens: 300,
      useCache: true
    });

    return result.text;
  }

  private parseAnalysis(text: string): StrategyAnalysis {
    const summary = this.extract(text, 'SUMMARY:', ['STRENGTHS:', 'WEAKNESSES:']);
    const strengths = this.extractList(text, 'STRENGTHS:', ['WEAKNESSES:']);
    const weaknesses = this.extractList(text, 'WEAKNESSES:', ['RECOMMENDATIONS:']);
    const recommendations = this.extractList(text, 'RECOMMENDATIONS:', ['CONFIDENCE:']);
    const confidence = this.extractConfidence(text);

    return { summary, strengths, weaknesses, recommendations, confidence };
  }

  private extract(text: string, start: string, ends: string[]): string {
    const startIdx = text.indexOf(start);
    if (startIdx === -1) return '';

    let endIdx = text.length;
    for (const end of ends) {
      const idx = text.indexOf(end, startIdx);
      if (idx !== -1 && idx < endIdx) endIdx = idx;
    }

    return text.slice(startIdx + start.length, endIdx).trim();
  }

  private extractList(text: string, start: string, ends: string[]): string[] {
    const section = this.extract(text, start, ends);
    return section
      .split('\n')
      .map(line => line.replace(/^[-•*]\s*/, '').trim())
      .filter(line => line.length > 0);
  }

  private extractConfidence(text: string): number {
    const match = text.match(/CONFIDENCE:\s*(\d+)/i);
    return match ? parseInt(match[1]) : 75;
  }
}

export const aiAnalyzer = new AIStrategyAnalyzer();
