'use client';

import { useEffect, useState } from 'react';
import { etherfiStakingService, StakingPosition, StakingAnalytics, ETHERFI_PRODUCTS } from '@/lib/etherfi/staking-service';
import AnimatedNumber, { AnimatedCurrency, AnimatedPercentage } from './AnimatedNumber';
import LoadingSpinner from './LoadingSpinner';

interface Props {
  walletAddress: string;
}

export default function EtherFiStakingDashboard({ walletAddress }: Props) {
  const [positions, setPositions] = useState<StakingPosition[]>([]);
  const [analytics, setAnalytics] = useState<StakingAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const pos = await etherfiStakingService.getStakingPositions(walletAddress);
        const anal = await etherfiStakingService.calculateStakingAnalytics(pos);
        setPositions(pos);
        setAnalytics(anal);
      } catch (error) {
        console.error('Error fetching staking data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [walletAddress]);

  if (isLoading) {
    return (
      <div className="handcrafted-card rounded-3xl p-8">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Loading staking positions..." />
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="handcrafted-card rounded-3xl p-6 soft-glow accent-line">
        <div className="ml-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">🏦</span>
            <span className="hand-underline">EtherFi Staking</span>
          </h3>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-xl p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Staked</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <AnimatedCurrency value={analytics.totalStakedUSD} />
              </p>
            </div>

            <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Earned</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                <AnimatedCurrency value={analytics.totalEarnedUSD} />
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Average APY</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <AnimatedPercentage value={analytics.averageAPY} />
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Diversification</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.diversificationScore}/100
              </p>
            </div>
          </div>

          {/* Active Positions */}
          {positions.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Active Positions</h4>
              <div className="space-y-3">
                {positions.map((position, idx) => {
                  const product = ETHERFI_PRODUCTS[position.product];
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl hover:scale-[1.02] transition-transform cursor-pointer"
                      onClick={() => setSelectedProduct(position.product)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                          {position.product.charAt(0)}
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 dark:text-white">{product.name}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <AnimatedNumber value={parseFloat(position.balance)} decimals={6} /> {position.product}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          <AnimatedCurrency value={position.balanceUSD} />
                        </p>
                        <p className="text-sm text-emerald-600 dark:text-emerald-400">
                          <AnimatedPercentage value={position.apy} /> APY
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analytics.recommendations.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                <span>💡</span>
                Smart Recommendations
              </h4>
              <ul className="space-y-2">
                {analytics.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm text-blue-800 dark:text-blue-400 flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-0.5">→</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Available Products */}
      <div className="handcrafted-card rounded-3xl p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Available EtherFi Products
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(ETHERFI_PRODUCTS).map(([symbol, product]) => {
            const hasPosition = positions.some(p => p.product === symbol);
            return (
              <div
                key={symbol}
                className={`p-4 rounded-xl border-2 transition-all ${
                  hasPosition
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{product.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {product.apy}%
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">APY</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  {product.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.benefits.slice(0, 2).map((benefit, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
                {hasPosition && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Your Position</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {positions.find(p => p.product === symbol)?.balance} {symbol}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
