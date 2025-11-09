'use client';

import { useEffect, useState } from 'react';
import { TokenBalance, tokenTracker } from '@/lib/blockchain/token-tracker';
import AnimatedNumber, { AnimatedCurrency, AnimatedPercentage } from './AnimatedNumber';
import LoadingSpinner from './LoadingSpinner';

interface WalletHoldingsProps {
  address: string;
}

export default function WalletHoldings({ address }: WalletHoldingsProps) {
  const [holdings, setHoldings] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalValueUSD, setTotalValueUSD] = useState(0);
  const [totalChange24h, setTotalChange24h] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchHoldings = async () => {
      if (!address) return;

      setIsLoading(true);
      try {
        const tokens = await tokenTracker.getWalletTokens(address);
        setHoldings(tokens);

        // Calculate stats
        const stats = await tokenTracker.calculatePortfolioStats(tokens);
        setTotalValueUSD(stats.totalValueUSD);
        setTotalChange24h(stats.totalChange24h);
      } catch (error) {
        console.error('Error fetching wallet holdings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHoldings();

    // Refresh holdings every 30 seconds
    const interval = setInterval(fetchHoldings, 30000);
    return () => clearInterval(interval);
  }, [address]);

  if (isLoading) {
    return (
      <div className="handcrafted-card rounded-3xl p-6">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Loading wallet holdings..." />
        </div>
      </div>
    );
  }

  if (holdings.length === 0) {
    return (
      <div className="handcrafted-card rounded-3xl p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Wallet Holdings
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          No tokens found in this wallet
        </p>
      </div>
    );
  }

  const displayedHoldings = showAll ? holdings : holdings.slice(0, 5);

  return (
    <div className="handcrafted-card rounded-3xl p-6 soft-glow">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            Wallet Holdings
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {holdings.length} token{holdings.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            <AnimatedCurrency value={totalValueUSD} />
          </div>
          {totalChange24h !== 0 && (
            <div className={`text-sm font-semibold flex items-center gap-1 justify-end ${
              totalChange24h >= 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              <span>{totalChange24h >= 0 ? '↗' : '↘'}</span>
              <AnimatedPercentage value={Math.abs(totalChange24h)} />
              <span className="text-xs">24h</span>
            </div>
          )}
        </div>
      </div>

      {/* Holdings List */}
      <div className="space-y-3">
        {displayedHoldings.map((holding, index) => (
          <div
            key={holding.token.symbol}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl hover:scale-[1.02] transition-transform"
          >
            {/* Token Info */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={holding.token.logo}
                  alt={holding.token.symbol}
                  className="w-10 h-10 rounded-full ring-2 ring-white dark:ring-gray-800"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/40/6366f1/ffffff?text=${holding.token.symbol.charAt(0)}`;
                  }}
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white">
                  {index + 1}
                </div>
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {holding.token.symbol}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {holding.token.name}
                </div>
              </div>
            </div>

            {/* Balance & Value */}
            <div className="text-right">
              <div className="font-semibold text-gray-900 dark:text-white">
                <AnimatedNumber value={parseFloat(holding.balanceFormatted)} decimals={4} /> {holding.token.symbol}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <AnimatedCurrency value={holding.balanceUSD} />
              </div>
            </div>

            {/* Price & Change */}
            <div className="text-right min-w-[100px]">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                ${holding.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </div>
              {holding.priceChange24h !== 0 && (
                <div className={`text-xs font-semibold ${
                  holding.priceChange24h >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {holding.priceChange24h >= 0 ? '+' : ''}
                  {holding.priceChange24h.toFixed(2)}%
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {holdings.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 w-full py-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
        >
          {showAll ? 'Show Less' : `Show ${holdings.length - 5} More`}
        </button>
      )}

      {/* Portfolio Breakdown */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Portfolio Breakdown
        </h4>
        <div className="space-y-2">
          {holdings.slice(0, 3).map((holding) => {
            const percentage = (holding.balanceUSD / totalValueUSD) * 100;
            return (
              <div key={holding.token.symbol}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    {holding.token.symbol}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}
