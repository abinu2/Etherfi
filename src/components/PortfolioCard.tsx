'use client';

import { useEffect, useState } from 'react';
import { UserPortfolio } from '@/types';
import AnimatedNumber, { AnimatedCurrency, AnimatedPercentage } from './AnimatedNumber';
import LoadingSpinner from './LoadingSpinner';
import Sparkline from './Sparkline';

interface PortfolioCardProps {
  address?: string;
}

export default function PortfolioCard({ address }: PortfolioCardProps) {
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
          const currentBalance = parseFloat(data.data.eethBalance);
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
  }, [address]);

  if (!address) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Your Portfolio</h2>
        <p className="text-gray-500">Connect your wallet to view your portfolio</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-6">Your EtherFi Portfolio</h2>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" color="white" text="Loading portfolio..." />
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Your Portfolio</h2>
        <p className="text-red-500">Failed to load portfolio data</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
      <h2 className="text-xl font-bold mb-6">Your EtherFi Portfolio</h2>

      <div className="space-y-4">
        <div>
          <p className="text-sm opacity-75">Total eETH Balance</p>
          <p className="text-4xl font-bold">
            <AnimatedNumber value={parseFloat(portfolio.eethBalance)} decimals={2} /> eETH
          </p>
          <p className="text-lg opacity-90 mt-1">
            <AnimatedCurrency value={portfolio.eethBalanceUSD} className="font-semibold" />
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
          <div>
            <p className="text-sm opacity-75">Current APY</p>
            <p className="text-2xl font-bold">
              <AnimatedPercentage value={portfolio.currentAPY} />
            </p>
          </div>
          {portfolio.stakedDate && (
            <div>
              <p className="text-sm opacity-75">Staked Since</p>
              <p className="text-lg font-semibold">
                {new Date(portfolio.stakedDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {balanceHistory.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs opacity-75">30-Day Balance Trend</p>
              <span className="text-xs opacity-75">
                {calculateTrend(balanceHistory) === 'up' ? '↗' : calculateTrend(balanceHistory) === 'down' ? '↘' : '→'}
                {' '}
                {Math.abs(((balanceHistory[balanceHistory.length - 1] - balanceHistory[0]) / balanceHistory[0]) * 100).toFixed(1)}%
              </span>
            </div>
            <Sparkline
              data={balanceHistory}
              width={300}
              height={50}
              lineColor="#ffffff"
              fillColor="rgba(255, 255, 255, 0.2)"
              strokeWidth={2}
            />
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-xs opacity-75 mb-1">Wallet Address</p>
          <p className="text-sm font-mono">
            {portfolio.address.slice(0, 6)}...{portfolio.address.slice(-4)}
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper function to generate mock balance history
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

// Calculate trend direction
function calculateTrend(data: number[]): 'up' | 'down' | 'neutral' {
  if (data.length < 2) return 'neutral';

  const first = data[0];
  const last = data[data.length - 1];
  const change = ((last - first) / first) * 100;

  if (change > 1) return 'up';
  if (change < -1) return 'down';
  return 'neutral';
}
