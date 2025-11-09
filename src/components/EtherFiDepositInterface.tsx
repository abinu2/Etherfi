'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import LoadingSpinner from './LoadingSpinner';
import AnimatedNumber, { AnimatedCurrency, AnimatedPercentage } from './AnimatedNumber';
import { handleEthereumError } from '@/lib/ethereum';

interface DepositStats {
  totalDeposited: number;
  eethReceived: number;
  estimatedAPY: number;
  membershipNFT: boolean;
  loyaltyPoints: number;
}

export default function EtherFiDepositInterface() {
  const [depositAmount, setDepositAmount] = useState('1.0');
  const [depositMode, setDepositMode] = useState<'eth' | 'weth'>('eth');
  const [receiveMode, setReceiveMode] = useState<'eeth' | 'weeth'>('eeth');
  const [isDepositing, setIsDepositing] = useState(false);
  const [userStats, setUserStats] = useState<DepositStats>({
    totalDeposited: 0,
    eethReceived: 0,
    estimatedAPY: 3.8,
    membershipNFT: false,
    loyaltyPoints: 0
  });

  const LIQUIDITY_POOL_ADDRESS = '0x308861A430be4cce5502d0A12724771Fc6DaF216';
  const EETH_ADDRESS = '0x35fA164735182de50811E8e2E824cFb9B6118ac2';
  const WEETH_ADDRESS = '0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee';

  const handleDeposit = async () => {
    setIsDepositing(true);
    try {
      if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask to deposit ETH');
        return;
      }

      const amount = parseFloat(depositAmount);
      if (amount <= 0) {
        alert('Please enter a valid amount');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // In production, this would:
      // 1. Call LiquidityPool.deposit() with ETH
      // 2. Receive eETH shares in return
      // 3. Optionally wrap to weETH for auto-compounding
      // 4. Register for Membership NFT if eligible

      console.log(`Depositing ${amount} ${depositMode} to EtherFi LiquidityPool`);
      console.log(`Will receive ${receiveMode.toUpperCase()} shares`);

      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update user stats
      const newEethReceived = amount * 0.98; // Simplified exchange rate
      setUserStats({
        totalDeposited: userStats.totalDeposited + amount,
        eethReceived: userStats.eethReceived + newEethReceived,
        estimatedAPY: receiveMode === 'weeth' ? 3.8 : 3.2,
        membershipNFT: userStats.totalDeposited + amount >= 0.1,
        loyaltyPoints: userStats.loyaltyPoints + Math.floor(amount * 100)
      });

      alert(`Successfully deposited ${amount} ETH!\nReceived ${newEethReceived.toFixed(6)} ${receiveMode.toUpperCase()}`);
      setDepositAmount('1.0');
    } catch (error: any) {
      console.error('Deposit error:', error);
      const errorMessage = handleEthereumError(error);
      alert(`Deposit Error: ${errorMessage}`);
    } finally {
      setIsDepositing(false);
    }
  };

  const exchangeRate = 0.98; // Simplified - in production, fetch from contract
  const estimatedReceive = parseFloat(depositAmount || '0') * exchangeRate;
  const yearlyEarnings = estimatedReceive * (userStats.estimatedAPY / 100);

  return (
    <div className="space-y-6">
      {/* Main Deposit Card */}
      <div className="handcrafted-card rounded-3xl p-8 soft-glow accent-line">
        <div className="ml-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">🏦</span>
            <span className="hand-underline">Deposit & Stake ETH</span>
          </h3>

          {/* Deposit Mode Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Deposit Asset
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDepositMode('eth')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  depositMode === 'eth'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                }`}
              >
                <div className="font-bold text-gray-900 dark:text-white">ETH</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Native Ethereum</div>
              </button>
              <button
                onClick={() => setDepositMode('weth')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  depositMode === 'weth'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                }`}
              >
                <div className="font-bold text-gray-900 dark:text-white">WETH</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Wrapped ETH</div>
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount to Deposit
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full px-4 py-4 pr-20 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-2xl font-bold focus:ring-2 focus:ring-emerald-500"
                placeholder="1.0"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-semibold">
                {depositMode.toUpperCase()}
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Minimum deposit: 0.01 ETH • No maximum limit
            </p>
          </div>

          {/* Receive Mode Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Receive As
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setReceiveMode('eeth')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  receiveMode === 'eeth'
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                }`}
              >
                <div className="font-bold text-gray-900 dark:text-white mb-1">eETH</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">Rebasing Token</div>
                <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  ~3.2% APY
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Balance auto-increases
                </div>
              </button>
              <button
                onClick={() => setReceiveMode('weeth')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  receiveMode === 'weeth'
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                }`}
              >
                <div className="font-bold text-gray-900 dark:text-white mb-1">weETH</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">Non-Rebasing</div>
                <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  ~3.8% APY
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Auto-compounds
                </div>
              </button>
            </div>
          </div>

          {/* Deposit Preview */}
          <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-xl p-6 mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Deposit Preview</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">You will receive:</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  <AnimatedNumber value={estimatedReceive} decimals={6} /> {receiveMode.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Exchange Rate:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  1 ETH = {exchangeRate} {receiveMode.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Estimated APY:</span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  <AnimatedPercentage value={userStats.estimatedAPY} />
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Yearly Earnings:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  +<AnimatedNumber value={yearlyEarnings} decimals={4} /> ETH
                </span>
              </div>
            </div>
          </div>

          {/* Deposit Button */}
          <button
            onClick={handleDeposit}
            disabled={isDepositing || parseFloat(depositAmount || '0') <= 0}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold text-lg rounded-xl hover:from-emerald-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
          >
            {isDepositing ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" color="white" />
                Processing Deposit...
              </span>
            ) : (
              `Deposit ${depositMode.toUpperCase()} & Receive ${receiveMode.toUpperCase()}`
            )}
          </button>

          {/* Benefits Info */}
          <div className="mt-6 grid md:grid-cols-3 gap-3">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Instant Liquidity</div>
              <div className="font-semibold text-gray-900 dark:text-white">✓ Trade anytime</div>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">DeFi Compatible</div>
              <div className="font-semibold text-gray-900 dark:text-white">✓ Use everywhere</div>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Native Restaking</div>
              <div className="font-semibold text-gray-900 dark:text-white">✓ Extra rewards</div>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="handcrafted-card rounded-3xl p-6">
        <h4 className="font-bold text-gray-900 dark:text-white mb-4">How EtherFi Staking Works</h4>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-white font-bold flex items-center justify-center">
              1
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white mb-1">Deposit ETH</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your ETH is deposited into the EtherFi LiquidityPool contract and sent to the official Ethereum deposit contract
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 text-white font-bold flex items-center justify-center">
              2
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white mb-1">Validators Created</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Professional node operators run validators using DVT (Distributed Validator Technology) for maximum security
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold flex items-center justify-center">
              3
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white mb-1">Receive Liquid Tokens</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get eETH (rebasing) or weETH (auto-compounding) tokens that represent your staked ETH and accrue rewards
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white font-bold flex items-center justify-center">
              4
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white mb-1">AVS Restaking</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your stake is automatically used by EigenLayer AVS services for additional validation rewards
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Statistics */}
      {userStats.totalDeposited > 0 && (
        <div className="handcrafted-card rounded-3xl p-6">
          <h4 className="font-bold text-gray-900 dark:text-white mb-4">Your Staking Position</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Deposited</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                <AnimatedCurrency value={userStats.totalDeposited * 3500} />
              </p>
            </div>
            <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">eETH Balance</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                <AnimatedNumber value={userStats.eethReceived} decimals={4} />
              </p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Loyalty Points</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {userStats.loyaltyPoints.toLocaleString()}
              </p>
            </div>
            <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-xl p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Membership NFT</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {userStats.membershipNFT ? '✓ Eligible' : 'Not yet'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
