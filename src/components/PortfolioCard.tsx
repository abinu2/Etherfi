'use client';

import { useEffect, useState } from 'react';
import { UserPortfolio } from '@/types';

interface PortfolioCardProps {
  address?: string;
}

export default function PortfolioCard({ address }: PortfolioCardProps) {
  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Your Portfolio</h2>
        <p className="text-gray-500">Loading portfolio data...</p>
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
          <p className="text-4xl font-bold">{portfolio.eethBalance} eETH</p>
          <p className="text-lg opacity-90 mt-1">${portfolio.eethBalanceUSD.toLocaleString()}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
          <div>
            <p className="text-sm opacity-75">Current APY</p>
            <p className="text-2xl font-bold">{portfolio.currentAPY}%</p>
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
