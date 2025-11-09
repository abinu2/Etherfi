'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import AnimatedNumber, { AnimatedCurrency, AnimatedPercentage } from './AnimatedNumber';

interface StrategyRecommendation {
  id: string;
  title: string;
  type: 'staking' | 'hedging' | 'yield' | 'diversification';
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  estimatedAPY: number;
  timeHorizon: string;
  description: string;
  actions: string[];
  pros: string[];
  cons: string[];
}

interface MarketConditions {
  ethPrice: number;
  ethVolatility: number;
  stakingAPY: number;
  gasPrice: number;
  marketSentiment: 'bullish' | 'neutral' | 'bearish';
}

export default function AIStrategyAnalytics() {
  const [recommendations, setRecommendations] = useState<StrategyRecommendation[]>([]);
  const [marketConditions, setMarketConditions] = useState<MarketConditions | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    analyzeStrategies();

    // Refresh analysis every 5 minutes
    const interval = setInterval(analyzeStrategies, 300000);
    return () => clearInterval(interval);
  }, []);

  const analyzeStrategies = async () => {
    setIsAnalyzing(true);

    // Simulate fetching market data
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockMarketConditions: MarketConditions = {
      ethPrice: 3500 + (Math.random() - 0.5) * 200,
      ethVolatility: 45 + Math.random() * 15,
      stakingAPY: 3.2 + Math.random() * 0.5,
      gasPrice: 25 + Math.random() * 15,
      marketSentiment: Math.random() > 0.5 ? 'bullish' : Math.random() > 0.3 ? 'neutral' : 'bearish'
    };

    setMarketConditions(mockMarketConditions);

    // Generate AI-powered recommendations based on market conditions
    const mockRecommendations: StrategyRecommendation[] = [
      {
        id: 'weeth-compound',
        title: 'Auto-Compounding weETH Strategy',
        type: 'staking',
        riskLevel: 'low',
        confidence: 92,
        estimatedAPY: 3.8,
        timeHorizon: '6-12 months',
        description: 'Maximize yield through auto-compounding weETH with minimal manual intervention. Best for long-term holders seeking stable returns.',
        actions: [
          'Swap current ETH holdings to weETH',
          'Enable auto-compound in EtherFi protocol',
          'Monitor APY trends quarterly',
          'Rebalance if weETH premium exceeds 5%'
        ],
        pros: [
          'Automatic reward compounding',
          'Higher APY than standard eETH (3.8% vs 3.2%)',
          'Gas-efficient (fewer transactions)',
          'Liquid and DeFi-compatible'
        ],
        cons: [
          'Slight premium to eETH exchange rate',
          'Smart contract risk (wrapping layer)',
          'May miss short-term arbitrage opportunities'
        ]
      },
      {
        id: 'delta-neutral',
        title: 'Delta-Neutral Hedging with eETH',
        type: 'hedging',
        riskLevel: 'medium',
        confidence: 85,
        estimatedAPY: 8.5,
        timeHorizon: '3-6 months',
        description: 'Earn staking yields while hedging ETH price exposure through perpetual futures. Ideal for risk-averse investors in volatile markets.',
        actions: [
          'Stake ETH to receive eETH (3.2% base APY)',
          'Open short perpetual position equal to eETH value',
          'Capture funding rate (typically 5-15% APY)',
          'Maintain collateral ratio above 150%',
          'Rebalance weekly or when delta exceeds ±10%'
        ],
        pros: [
          'Neutralizes ETH price volatility',
          'Earn staking APY + funding rate',
          'Predictable returns in volatile markets',
          'Capital preserved in USD terms'
        ],
        cons: [
          'Requires active monitoring',
          'Liquidation risk if not managed',
          'Funding rates can turn negative',
          'Higher complexity'
        ]
      },
      {
        id: 'basis-trade',
        title: 'ETH Basis Trade with Staking Yield',
        type: 'yield',
        riskLevel: 'medium',
        confidence: 78,
        estimatedAPY: 12.3,
        timeHorizon: '1-3 months',
        description: 'Capture the ETH futures premium while earning staking rewards. Suitable for sophisticated investors during contango markets.',
        actions: [
          'Deposit ETH and receive eETH (3.2% APY)',
          'Sell ETH quarterly futures at premium',
          'Hold position until expiry',
          'Roll futures if contango persists',
          'Unwind if basis compresses below 6% annualized'
        ],
        pros: [
          'High yield potential (9% basis + 3% staking)',
          'Market-neutral strategy',
          'Fixed maturity date',
          'No liquidation risk if fully collateralized'
        ],
        cons: [
          'Basis can compress rapidly',
          'Requires futures exchange account',
          'Counterparty risk on CEX',
          'Exit can be costly if basis inverts'
        ]
      },
      {
        id: 'diversified-staking',
        title: 'Multi-Asset Staking Portfolio',
        type: 'diversification',
        riskLevel: 'low',
        confidence: 88,
        estimatedAPY: 5.2,
        timeHorizon: '12+ months',
        description: 'Diversify across EtherFi products (eETH, eBTC, eUSD) to optimize risk-adjusted returns and reduce correlation.',
        actions: [
          'Allocate 40% to weETH (3.8% APY, moderate risk)',
          'Allocate 30% to eUSD (6.5% APY, low risk)',
          'Allocate 20% to eBTC (4.5% APY, medium risk)',
          'Keep 10% liquid for opportunities',
          'Rebalance monthly to target allocations'
        ],
        pros: [
          'Reduced portfolio volatility',
          'Blended APY of 5.2%',
          'Exposure to multiple asset classes',
          'Stable yield from eUSD component'
        ],
        cons: [
          'Lower max APY than concentrated bets',
          'Rebalancing costs and complexity',
          'Multiple smart contract risks',
          'Requires more active management'
        ]
      },
      {
        id: 'defi-leveraged',
        title: 'Leveraged eETH Yield Farming',
        type: 'yield',
        riskLevel: 'high',
        confidence: 65,
        estimatedAPY: 18.7,
        timeHorizon: '1-6 months',
        description: 'Use eETH as collateral to borrow stablecoins, then loop for amplified staking yields. High risk, high reward strategy for experienced DeFi users.',
        actions: [
          'Deposit eETH as collateral on Aave/Compound',
          'Borrow USDC at 60% LTV (leaving safety margin)',
          'Swap USDC to ETH and stake for more eETH',
          'Repeat 2-3 times for 2.5x leverage',
          'Monitor health factor daily, maintain >1.5',
          'Unwind if APY spread narrows or volatility spikes'
        ],
        pros: [
          'Amplified staking yields (3.2% × 2.5 = 8%)',
          'Additional DeFi yields from lending protocols',
          'Compounds faster with leverage',
          'Can unwind quickly if needed'
        ],
        cons: [
          'Liquidation risk during ETH dumps',
          'Borrow costs reduce net APY',
          'High complexity and gas costs',
          'Requires constant monitoring',
          'Smart contract risks multiply with each protocol'
        ]
      },
      {
        id: 'options-covered',
        title: 'Covered Call Strategy with eETH',
        type: 'yield',
        riskLevel: 'medium',
        confidence: 71,
        estimatedAPY: 15.4,
        timeHorizon: '1-3 months',
        description: 'Sell out-of-the-money ETH call options against eETH holdings to generate premium income on top of staking yields.',
        actions: [
          'Hold eETH for base 3.2% staking yield',
          'Sell monthly ETH call options 10-15% OTM',
          'Target 3-5% premium per month',
          'Roll or close if ETH approaches strike',
          'Repeat monthly for consistent income'
        ],
        pros: [
          'Generate 3-5% monthly premium',
          'Combined 15%+ APY with staking',
          'Keeps upside up to strike price',
          'Defined maximum profit'
        ],
        cons: [
          'Caps upside if ETH rallies hard',
          'Options can be assigned early',
          'Requires options trading experience',
          'Premiums decline in low volatility'
        ]
      }
    ];

    setRecommendations(mockRecommendations);
    setIsAnalyzing(false);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'staking': return '🏦';
      case 'hedging': return '🛡️';
      case 'yield': return '💰';
      case 'diversification': return '📊';
      default: return '⚡';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-600 dark:text-green-400';
      case 'bearish': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (isAnalyzing || !marketConditions) {
    return (
      <div className="handcrafted-card rounded-3xl p-8">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Analyzing market conditions..." />
        </div>
      </div>
    );
  }

  const selectedRec = recommendations.find(r => r.id === selectedStrategy);

  return (
    <div className="space-y-6">
      {/* Market Conditions Dashboard */}
      <div className="handcrafted-card rounded-3xl p-6 soft-glow accent-line">
        <div className="ml-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <span className="text-3xl">🤖</span>
              <span className="hand-underline">AI Strategy Analytics</span>
            </h3>
            <button
              onClick={analyzeStrategies}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-cyan-700 transition-all text-sm"
            >
              🔄 Refresh Analysis
            </button>
          </div>

          {/* Market Conditions */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-xl p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">ETH Price</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                <AnimatedCurrency value={marketConditions.ethPrice} />
              </p>
            </div>

            <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Volatility (30d)</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                <AnimatedPercentage value={marketConditions.ethVolatility} />
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Staking APY</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                <AnimatedPercentage value={marketConditions.stakingAPY} />
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Gas Price</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {Math.round(marketConditions.gasPrice)} gwei
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Sentiment</p>
              <p className={`text-xl font-bold capitalize ${getSentimentColor(marketConditions.marketSentiment)}`}>
                {marketConditions.marketSentiment}
              </p>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-violet-200 dark:border-violet-800">
            <div className="flex gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="font-semibold text-violet-900 dark:text-violet-300 mb-1">
                  AI Market Analysis
                </h4>
                <p className="text-sm text-violet-800 dark:text-violet-400">
                  {marketConditions.marketSentiment === 'bullish'
                    ? `With ETH showing bullish momentum and ${marketConditions.ethVolatility.toFixed(1)}% volatility, consider staking strategies to capture upside while earning ${marketConditions.stakingAPY.toFixed(2)}% APY. Delta-neutral positions may underperform in trending markets.`
                    : marketConditions.marketSentiment === 'bearish'
                    ? `In bearish conditions with ${marketConditions.ethVolatility.toFixed(1)}% volatility, hedging strategies become attractive. Consider delta-neutral positions or covered calls to protect downside while maintaining staking yield.`
                    : `Neutral market with ${marketConditions.ethVolatility.toFixed(1)}% volatility favors diversified staking. Focus on yield optimization through auto-compounding weETH and multi-asset allocation.`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Recommendations */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map(rec => (
          <div
            key={rec.id}
            onClick={() => setSelectedStrategy(rec.id)}
            className={`handcrafted-card rounded-2xl p-6 cursor-pointer transition-all hover:scale-[1.02] ${
              selectedStrategy === rec.id ? 'ring-2 ring-emerald-500' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getTypeIcon(rec.type)}</span>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                    {rec.type}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getRiskColor(rec.riskLevel)}`}>
                {rec.riskLevel} Risk
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {rec.confidence}% confidence
              </span>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-lg p-3 mb-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Estimated APY</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                <AnimatedPercentage value={rec.estimatedAPY} />
              </p>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              {rec.description}
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-500">
              Timeframe: {rec.timeHorizon}
            </p>
          </div>
        ))}
      </div>

      {/* Detailed Strategy View */}
      {selectedRec && (
        <div className="handcrafted-card rounded-3xl p-8 soft-glow">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedRec.title}
              </h3>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getRiskColor(selectedRec.riskLevel)}`}>
                  {selectedRec.riskLevel} Risk
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  AI Confidence: {selectedRec.confidence}%
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedRec.timeHorizon}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedStrategy(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {selectedRec.description}
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Step-by-Step Actions */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span>📋</span>
                Action Steps
              </h4>
              <ol className="space-y-2">
                {selectedRec.actions.map((action, idx) => (
                  <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex gap-2">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{idx + 1}.</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Pros */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span>✅</span>
                Advantages
              </h4>
              <ul className="space-y-2">
                {selectedRec.pros.map((pro, idx) => (
                  <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex gap-2">
                    <span className="text-green-500">▪</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span>⚠️</span>
                Risks & Drawbacks
              </h4>
              <ul className="space-y-2">
                {selectedRec.cons.map((con, idx) => (
                  <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex gap-2">
                    <span className="text-red-500">▪</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <p className="text-sm text-blue-800 dark:text-blue-400">
              <strong>Disclaimer:</strong> These are AI-generated recommendations based on current market conditions. Always do your own research and consider your risk tolerance before implementing any strategy. Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
