'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import LoadingSpinner from './LoadingSpinner';
import AnimatedNumber, { AnimatedPercentage } from './AnimatedNumber';

interface YieldPrediction {
  period: string;
  baseAPY: number;
  avsBoost: number;
  totalAPY: number;
  confidence: number;
}

interface OptimalAllocation {
  asset: string;
  percentage: number;
  expectedAPY: number;
  risk: 'low' | 'medium' | 'high';
}

interface RewardProjection {
  month: string;
  baseRewards: number;
  avsRewards: number;
  total: number;
}

export default function InteractiveAVSDashboard() {
  const [investmentAmount, setInvestmentAmount] = useState(10);
  const [riskTolerance, setRiskTolerance] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [timeHorizon, setTimeHorizon] = useState(12);
  const [predictions, setPredictions] = useState<YieldPrediction[]>([]);
  const [allocations, setAllocations] = useState<OptimalAllocation[]>([]);
  const [projections, setProjections] = useState<RewardProjection[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null);

  const calculateOptimalStrategy = useCallback(async () => {
    setIsCalculating(true);

    // Simulate AI calculation
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate dynamic predictions based on inputs
    const basePredictions: YieldPrediction[] = [
      {
        period: '1 Month',
        baseAPY: 3.2 + (Math.random() * 0.5),
        avsBoost: 1.8 + (Math.random() * 0.7),
        totalAPY: 5.0 + (Math.random() * 1.2),
        confidence: 85 + Math.floor(Math.random() * 10)
      },
      {
        period: '3 Months',
        baseAPY: 3.3 + (Math.random() * 0.4),
        avsBoost: 2.1 + (Math.random() * 0.8),
        totalAPY: 5.4 + (Math.random() * 1.2),
        confidence: 78 + Math.floor(Math.random() * 12)
      },
      {
        period: '6 Months',
        baseAPY: 3.5 + (Math.random() * 0.5),
        avsBoost: 2.4 + (Math.random() * 1.0),
        totalAPY: 5.9 + (Math.random() * 1.5),
        confidence: 70 + Math.floor(Math.random() * 15)
      },
      {
        period: '12 Months',
        baseAPY: 3.7 + (Math.random() * 0.6),
        avsBoost: 2.8 + (Math.random() * 1.2),
        totalAPY: 6.5 + (Math.random() * 1.8),
        confidence: 65 + Math.floor(Math.random() * 18)
      }
    ];

    setPredictions(basePredictions);

    // Calculate optimal allocations based on risk tolerance
    const riskMultipliers = {
      conservative: { eeth: 0.6, weeth: 0.3, eusd: 0.1, ebtc: 0 },
      moderate: { eeth: 0.4, weeth: 0.3, ebtc: 0.2, eusd: 0.1 },
      aggressive: { eeth: 0.2, weeth: 0.4, ebtc: 0.3, eusd: 0.1 }
    };

    const multiplier = riskMultipliers[riskTolerance];
    const dynamicAllocations: OptimalAllocation[] = [
      {
        asset: 'weETH',
        percentage: multiplier.weeth * 100,
        expectedAPY: 3.8 + (Math.random() * 0.5),
        risk: 'low' as 'low' | 'medium' | 'high'
      },
      {
        asset: 'eETH',
        percentage: multiplier.eeth * 100,
        expectedAPY: 3.2 + (Math.random() * 0.4),
        risk: 'low' as 'low' | 'medium' | 'high'
      },
      {
        asset: 'eBTC',
        percentage: multiplier.ebtc * 100,
        expectedAPY: 4.5 + (Math.random() * 0.7),
        risk: 'medium' as 'low' | 'medium' | 'high'
      },
      {
        asset: 'eUSD',
        percentage: multiplier.eusd * 100,
        expectedAPY: 6.5 + (Math.random() * 0.5),
        risk: 'low' as 'low' | 'medium' | 'high'
      }
    ].filter(a => a.percentage > 0);

    setAllocations(dynamicAllocations);

    // Generate reward projections
    const monthlyProjections: RewardProjection[] = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < Math.min(timeHorizon, 12); i++) {
      const monthBaseAPY = 3.2 + (i * 0.05) + (Math.random() * 0.3);
      const monthAVSBoost = 2.0 + (i * 0.08) + (Math.random() * 0.5);

      monthlyProjections.push({
        month: months[i],
        baseRewards: (investmentAmount * monthBaseAPY / 100 / 12),
        avsRewards: (investmentAmount * monthAVSBoost / 100 / 12),
        total: (investmentAmount * (monthBaseAPY + monthAVSBoost) / 100 / 12)
      });
    }

    setProjections(monthlyProjections);
    setIsCalculating(false);

    // Draw chart
    drawProjectionChart(monthlyProjections);
  }, [investmentAmount, riskTolerance, timeHorizon]);

  useEffect(() => {
    calculateOptimalStrategy();
  }, [calculateOptimalStrategy]);

  const drawProjectionChart = (data: RewardProjection[]) => {
    if (!chartRef.current) return;

    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = 50;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Find max value for scaling
    const maxValue = Math.max(...data.map(d => d.total));
    const scale = chartHeight / (maxValue * 1.2);

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (i * chartHeight / 4);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // Y-axis labels
      const value = maxValue * (1 - i / 4);
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(value.toFixed(3) + ' ETH', padding - 10, y + 4);
    }

    // Draw bars
    const barWidth = chartWidth / data.length * 0.6;
    const barSpacing = chartWidth / data.length;

    data.forEach((item, index) => {
      const x = padding + index * barSpacing + (barSpacing - barWidth) / 2;

      // Base rewards (green)
      const baseHeight = item.baseRewards * scale;
      ctx.fillStyle = '#10b981';
      ctx.fillRect(x, height - padding - baseHeight, barWidth, baseHeight);

      // AVS rewards (purple) stacked on top
      const avsHeight = item.avsRewards * scale;
      ctx.fillStyle = '#8b5cf6';
      ctx.fillRect(x, height - padding - baseHeight - avsHeight, barWidth, avsHeight);

      // Month labels
      ctx.fillStyle = '#6b7280';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.month, x + barWidth / 2, height - padding + 20);
    });

    // Legend
    ctx.fillStyle = '#10b981';
    ctx.fillRect(padding, 20, 15, 15);
    ctx.fillStyle = '#1f2937';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Base Staking', padding + 20, 32);

    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(padding + 120, 20, 15, 15);
    ctx.fillText('AVS Boost', padding + 140, 32);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400';
      case 'medium': return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400';
      case 'high': return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400';
      default: return 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400';
    }
  };

  const totalExpectedReturn = projections.reduce((sum, p) => sum + p.total, 0);
  const avgAPY = allocations.reduce((sum, a) => sum + (a.expectedAPY * a.percentage / 100), 0);

  return (
    <div className="space-y-6">
      {/* Interactive Controls */}
      <div className="handcrafted-card rounded-3xl p-8 soft-glow accent-line">
        <div className="ml-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            <span className="hand-underline">AVS Yield Optimizer</span>
          </h3>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Investment Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Investment Amount (ETH)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(parseFloat(e.target.value) || 0.1)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-bold text-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Risk Tolerance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Risk Tolerance
              </label>
              <select
                value={riskTolerance}
                onChange={(e) => setRiskTolerance(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-semibold focus:ring-2 focus:ring-emerald-500"
              >
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>

            {/* Time Horizon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Horizon (Months)
              </label>
              <input
                type="number"
                min="1"
                max="24"
                value={timeHorizon}
                onChange={(e) => setTimeHorizon(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-bold text-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-xl p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Projected Return</p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                +<AnimatedNumber value={totalExpectedReturn} decimals={4} /> ETH
              </p>
            </div>

            <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Weighted APY</p>
              <p className="text-xl font-bold text-violet-600 dark:text-violet-400">
                <AnimatedPercentage value={avgAPY} />
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">AVS Boost</p>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                +<AnimatedPercentage value={2.5} />
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Risk Score</p>
              <p className="text-xl font-bold text-cyan-600 dark:text-cyan-400">
                {riskTolerance === 'conservative' ? '3/10' : riskTolerance === 'moderate' ? '5/10' : '7/10'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* APY Predictions */}
      <div className="handcrafted-card rounded-3xl p-6">
        <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span>📈</span>
          APY Predictions by Period
        </h4>

        {isCalculating ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner text="Calculating optimal strategy..." />
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-4">
            {predictions.map((pred, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4">
                <div className="text-center mb-3">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{pred.period}</p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 my-2">
                    <AnimatedPercentage value={pred.totalAPY} />
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {pred.confidence}% confidence
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Base:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      <AnimatedPercentage value={pred.baseAPY} />
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">AVS:</span>
                    <span className="font-semibold text-violet-600 dark:text-violet-400">
                      +<AnimatedPercentage value={pred.avsBoost} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Optimal Allocation */}
      <div className="handcrafted-card rounded-3xl p-6">
        <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span>🎨</span>
          Optimal Portfolio Allocation
        </h4>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {allocations.map((alloc, idx) => (
              <div key={idx} className="relative">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 dark:text-white">{alloc.asset}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getRiskColor(alloc.risk)}`}>
                      {alloc.risk}
                    </span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {alloc.percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
                    style={{ width: `${alloc.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Expected: <AnimatedPercentage value={alloc.expectedAPY} />
                </p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-6">
            <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
              Why This Allocation?
            </h5>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {riskTolerance === 'conservative' && (
                <>
                  <p>✓ Heavy weETH/eETH for stable returns</p>
                  <p>✓ eUSD component for downside protection</p>
                  <p>✓ Minimal volatility exposure</p>
                  <p>✓ Liquid and easily reversible</p>
                </>
              )}
              {riskTolerance === 'moderate' && (
                <>
                  <p>✓ Balanced across multiple assets</p>
                  <p>✓ eBTC for uncorrelated returns</p>
                  <p>✓ Good risk-reward ratio</p>
                  <p>✓ Optimized for {timeHorizon}-month horizon</p>
                </>
              )}
              {riskTolerance === 'aggressive' && (
                <>
                  <p>✓ Maximum yield potential</p>
                  <p>✓ Higher eBTC and weETH allocation</p>
                  <p>✓ Captures AVS upside</p>
                  <p>✓ Best for long-term holders</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reward Projections Chart */}
      <div className="handcrafted-card rounded-3xl p-6">
        <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span>📊</span>
          Monthly Reward Projections
        </h4>

        <canvas
          ref={chartRef}
          className="w-full"
          style={{ height: '300px' }}
        />

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Base Rewards</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              <AnimatedNumber value={projections.reduce((sum, p) => sum + p.baseRewards, 0)} decimals={4} /> ETH
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total AVS Rewards</p>
            <p className="text-lg font-bold text-violet-600 dark:text-violet-400">
              <AnimatedNumber value={projections.reduce((sum, p) => sum + p.avsRewards, 0)} decimals={4} /> ETH
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Combined Total</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              <AnimatedNumber value={totalExpectedReturn} decimals={4} /> ETH
            </p>
          </div>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="handcrafted-card rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <span className="text-xl">⚡</span>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Current Network APY</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                <AnimatedPercentage value={5.7} />
              </p>
            </div>
          </div>
          <p className="text-xs text-green-600 dark:text-green-400">↑ +0.3% vs yesterday</p>
        </div>

        <div className="handcrafted-card rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <span className="text-xl">🔥</span>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">AVS Participation Rate</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                <AnimatedPercentage value={87.3} />
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">of total stake</p>
        </div>

        <div className="handcrafted-card rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <span className="text-xl">🎯</span>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Optimal Entry Point</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                Now
              </p>
            </div>
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">Gas: 25 gwei (optimal)</p>
        </div>
      </div>
    </div>
  );
}
