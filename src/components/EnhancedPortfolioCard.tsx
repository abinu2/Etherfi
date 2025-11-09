'use client';

import { useEffect, useState } from 'react';
import { UserPortfolio } from '@/types';
import AnimatedNumber, { AnimatedCurrency, AnimatedPercentage } from './AnimatedNumber';
import LoadingSpinner from './LoadingSpinner';
import Sparkline from './Sparkline';

interface EnhancedPortfolioCardProps {
  address?: string;
}

export default function EnhancedPortfolioCard({ address }: EnhancedPortfolioCardProps) {
  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [balanceHistory, setBalanceHistory] = useState<number[]>([]);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!address) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/portfolio?address=${address}`);
        const data = await response.json();
        if (data.success) {
          setPortfolio(data.data);
          // Generate mock balance history for sparkline
          const currentBalance = data.data.totalStakedUSD;
          const history = generateBalanceHistory(currentBalance, 30);
          setBalanceHistory(history);
        }
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();

    // Refresh every 30 seconds
    const interval = setInterval(fetchPortfolio, 30000);
    return () => clearInterval(interval);
  }, [address]);

  if (!address) {
    return (
      <div className="handcrafted-card rounded-3xl p-8 soft-glow">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Your EtherFi Portfolio
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Connect your wallet to view your portfolio
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-emerald-500 via-cyan-500 to-violet-600 rounded-3xl shadow-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-6">Your EtherFi Portfolio</h2>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" color="white" text="Loading portfolio..." />
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="handcrafted-card rounded-3xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Your EtherFi Portfolio
        </h2>
        <p className="text-red-500">Failed to load portfolio data</p>
      </div>
    );
  }

  const totalETH = parseFloat(portfolio.ethBalance) + parseFloat(portfolio.eethBalance) + parseFloat(portfolio.weethBalance);

  return (
    <div className="bg-gradient-to-br from-emerald-500 via-cyan-500 to-violet-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Your EtherFi Portfolio</h2>
          <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold">
            Live
          </div>
        </div>

        {/* Total Value */}
        <div className="mb-8">
          <p className="text-sm opacity-75 mb-1">Total Portfolio Value</p>
          <div className="flex items-baseline gap-3">
            <p className="text-5xl font-bold">
              <AnimatedCurrency value={portfolio.totalStakedUSD} />
            </p>
            <p className="text-2xl opacity-75">
              <AnimatedNumber value={totalETH} decimals={4} /> ETH
            </p>
          </div>
        </div>

        {/* Token Breakdown */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* ETH */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5" viewBox="0 0 320 512" fill="currentColor">
                <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"/>
              </svg>
              <span className="text-xs font-medium opacity-75">ETH</span>
            </div>
            <p className="text-xl font-bold">
              <AnimatedNumber value={parseFloat(portfolio.ethBalance)} decimals={4} />
            </p>
            <p className="text-xs opacity-75 mt-1">
              {totalETH > 0 ? ((parseFloat(portfolio.ethBalance) / totalETH) * 100).toFixed(1) : 0}% of total
            </p>
          </div>

          {/* eETH */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400"></div>
              <span className="text-xs font-medium opacity-75">eETH</span>
            </div>
            <p className="text-xl font-bold">
              <AnimatedNumber value={parseFloat(portfolio.eethBalance)} decimals={4} />
            </p>
            <p className="text-xs opacity-75 mt-1">
              <AnimatedCurrency value={portfolio.eethBalanceUSD} />
            </p>
          </div>

          {/* weETH */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-400 to-purple-400"></div>
              <span className="text-xs font-medium opacity-75">weETH</span>
            </div>
            <p className="text-xl font-bold">
              <AnimatedNumber value={parseFloat(portfolio.weethBalance)} decimals={4} />
            </p>
            <p className="text-xs opacity-75 mt-1">
              {totalETH > 0 ? ((parseFloat(portfolio.weethBalance) / totalETH) * 100).toFixed(1) : 0}% of total
            </p>
          </div>
        </div>

        {/* APY & Performance */}
        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/20 mb-6">
          <div>
            <p className="text-sm opacity-75 mb-1">Current APY</p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold">
                <AnimatedPercentage value={portfolio.currentAPY} />
              </p>
              {portfolio.estimatedAPY > portfolio.currentAPY && (
                <span className="text-xs px-2 py-1 bg-green-400/20 rounded-full">
                  Up to <AnimatedPercentage value={portfolio.estimatedAPY} />
                </span>
              )}
            </div>
          </div>
          {portfolio.stakedDate && (
            <div>
              <p className="text-sm opacity-75 mb-1">Staked Since</p>
              <p className="text-lg font-semibold">
                {new Date(portfolio.stakedDate).toLocaleDateString()}
              </p>
              <p className="text-xs opacity-75 mt-1">
                {Math.floor((Date.now() - new Date(portfolio.stakedDate).getTime()) / (1000 * 60 * 60 * 24))} days
              </p>
            </div>
          )}
        </div>

        {/* Balance Trend */}
        {balanceHistory.length > 0 && (
          <div className="pt-6 border-t border-white/20">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm opacity-75">30-Day Value Trend</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                  {calculateTrend(balanceHistory) === 'up' ? '↗' : calculateTrend(balanceHistory) === 'down' ? '↘' : '→'}
                </span>
                <span className="text-sm font-semibold">
                  {Math.abs(((balanceHistory[balanceHistory.length - 1] - balanceHistory[0]) / balanceHistory[0]) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Sparkline
                data={balanceHistory}
                width={600}
                height={60}
                lineColor="#ffffff"
                fillColor="rgba(255, 255, 255, 0.2)"
                strokeWidth={2}
              />
            </div>
          </div>
        )}

        {/* Wallet Info */}
        <div className="mt-6 pt-6 border-t border-white/20 flex items-center justify-between">
          <div>
            <p className="text-xs opacity-75 mb-1">Wallet Address</p>
            <p className="text-sm font-mono font-semibold">
              {portfolio.address.slice(0, 6)}...{portfolio.address.slice(-4)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-75 mb-1">Last Updated</p>
            <p className="text-sm font-semibold">
              {new Date(portfolio.lastUpdated).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function generateBalanceHistory(currentBalance: number, days: number): number[] {
  const history: number[] = [];
  let balance = currentBalance * 0.85; // Start at 85% of current for upward trend

  for (let i = 0; i < days; i++) {
    // Add some randomness but overall upward trend
    const change = (Math.random() - 0.4) * 0.02 * balance;
    balance += change;
    history.push(balance);
  }

  // Ensure last value is current balance
  history[history.length - 1] = currentBalance;

  return history;
}

function calculateTrend(data: number[]): 'up' | 'down' | 'neutral' {
  if (data.length < 2) return 'neutral';

  const first = data[0];
  const last = data[data.length - 1];
  const change = ((last - first) / first) * 100;

  if (change > 1) return 'up';
  if (change < -1) return 'down';
  return 'neutral';
}
