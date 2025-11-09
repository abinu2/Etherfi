'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import LoadingSpinner from './LoadingSpinner';
import { handleEthereumError } from '@/lib/ethereum';

interface OperatorStats {
  isRegistered: boolean;
  stakedAmount: string;
  reputation: number;
  totalValidations: number;
  successfulValidations: number;
  slashCount: number;
  earnings: string;
}

export default function OperatorStaking() {
  const [stakeAmount, setStakeAmount] = useState('1.0');
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [operatorStats, setOperatorStats] = useState<OperatorStats | null>(null);
  const [minStakeRequired] = useState('0.5'); // 0.5 ETH minimum

  useEffect(() => {
    loadOperatorStats();
  }, []);

  const loadOperatorStats = async () => {
    try {
      // Simulate loading operator stats
      // In production, this would query the AVS contract
      const mockStats: OperatorStats = {
        isRegistered: Math.random() > 0.7,
        stakedAmount: (Math.random() * 5 + 0.5).toFixed(4),
        reputation: Math.floor(Math.random() * 30) + 70,
        totalValidations: Math.floor(Math.random() * 100) + 20,
        successfulValidations: Math.floor(Math.random() * 95) + 18,
        slashCount: Math.floor(Math.random() * 3),
        earnings: (Math.random() * 0.5).toFixed(4)
      };
      setOperatorStats(mockStats);
    } catch (error) {
      console.error('Error loading operator stats:', error);
    }
  };

  const handleStake = async () => {
    setIsStaking(true);
    try {
      if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask');
        return;
      }

      const amount = parseFloat(stakeAmount);
      if (amount < parseFloat(minStakeRequired)) {
        alert(`Minimum stake is ${minStakeRequired} ETH`);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Simulate staking transaction
      console.log('Staking', amount, 'ETH to become an operator');

      // In production, this would call the AVS contract
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update operator stats
      setOperatorStats({
        isRegistered: true,
        stakedAmount: amount.toFixed(4),
        reputation: 100,
        totalValidations: 0,
        successfulValidations: 0,
        slashCount: 0,
        earnings: '0.0000'
      });

      alert('Successfully registered as operator!');
      setStakeAmount('1.0');
    } catch (error: any) {
      console.error('Staking error:', error);
      const errorMessage = handleEthereumError(error);
      alert(`Staking Error: ${errorMessage}`);
    } finally {
      setIsStaking(false);
    }
  };

  const handleUnstake = async () => {
    setIsUnstaking(true);
    try {
      if (!operatorStats?.isRegistered) {
        alert('You are not registered as an operator');
        return;
      }

      // Simulate unstaking transaction
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update operator stats
      setOperatorStats({
        ...operatorStats,
        isRegistered: false,
        stakedAmount: '0.0000'
      });

      alert('Successfully unstaked and deregistered!');
    } catch (error: any) {
      console.error('Unstaking error:', error);
      const errorMessage = handleEthereumError(error);
      alert(`Unstaking Error: ${errorMessage}`);
    } finally {
      setIsUnstaking(false);
    }
  };

  if (!operatorStats) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" color="blue" text="Loading operator stats..." />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Become an AVS Operator
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Stake ETH to validate strategies and earn rewards
        </p>
      </div>

      {/* Operator Status */}
      <div className={`mb-6 p-4 rounded-lg border ${
        operatorStats.isRegistered
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
          : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              operatorStats.isRegistered ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`} />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {operatorStats.isRegistered ? 'Active Operator' : 'Not Registered'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {operatorStats.isRegistered
                  ? `Reputation: ${operatorStats.reputation}/100`
                  : 'Stake ETH to participate'}
              </p>
            </div>
          </div>
          {operatorStats.isRegistered && (
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {operatorStats.stakedAmount} ETH
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Staked</p>
            </div>
          )}
        </div>
      </div>

      {/* Operator Stats */}
      {operatorStats.isRegistered && (
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Validations</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {operatorStats.totalValidations}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Success Rate</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {operatorStats.totalValidations > 0
                ? ((operatorStats.successfulValidations / operatorStats.totalValidations) * 100).toFixed(1)
                : '0'}%
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Earnings</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {operatorStats.earnings} ETH
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Slashed</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {operatorStats.slashCount}x
            </p>
          </div>
        </div>
      )}

      {!operatorStats.isRegistered ? (
        <>
          {/* Stake Form */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stake Amount (ETH)
            </label>
            <input
              type="text"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="1.0"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Minimum stake: {minStakeRequired} ETH
            </p>
          </div>

          {/* Requirements */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
              Operator Requirements
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-2">
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Stake minimum {minStakeRequired} ETH (can be slashed for malicious behavior)</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Run Claude AI to validate DeFi strategies</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Sign attestations for validated strategies</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Earn execution fees from successful validations</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleStake}
            disabled={isStaking}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            {isStaking ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" color="white" />
                Staking & Registering...
              </span>
            ) : (
              'Stake ETH & Register as Operator'
            )}
          </button>
        </>
      ) : (
        <>
          {/* Operator Actions */}
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
                Operator Responsibilities
              </h4>
              <ul className="text-sm text-yellow-800 dark:text-yellow-400 space-y-2">
                <li className="flex items-start gap-2">
                  <span>⚡</span>
                  <span>Monitor incoming strategy validation requests</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>⚡</span>
                  <span>Run AI analysis on each strategy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>⚡</span>
                  <span>Sign and submit attestations on-chain</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>⚡</span>
                  <span>Maintain high reputation to avoid slashing</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleUnstake}
              disabled={isUnstaking}
              className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isUnstaking ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" color="white" />
                  Unstaking & Deregistering...
                </span>
              ) : (
                'Unstake & Deregister'
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
