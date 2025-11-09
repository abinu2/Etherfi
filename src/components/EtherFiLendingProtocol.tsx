'use client';

import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import AnimatedNumber, { AnimatedPercentage } from './AnimatedNumber';

interface LendingMarket {
  asset: string;
  totalSupplied: number;
  totalBorrowed: number;
  supplyAPY: number;
  borrowAPY: number;
  utilizationRate: number;
  available: number;
  collateralFactor: number;
}

interface UserPosition {
  supplied: { [key: string]: number };
  borrowed: { [key: string]: number };
  collateralValue: number;
  borrowedValue: number;
  healthFactor: number;
  borrowLimit: number;
}

export default function EtherFiLendingProtocol() {
  const [markets, setMarkets] = useState<LendingMarket[]>([]);
  const [userPosition, setUserPosition] = useState<UserPosition>({
    supplied: {},
    borrowed: {},
    collateralValue: 0,
    borrowedValue: 0,
    healthFactor: 0,
    borrowLimit: 0
  });
  const [selectedAction, setSelectedAction] = useState<'supply' | 'borrow'>('supply');
  const [selectedAsset, setSelectedAsset] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    initializeMarkets();
    const interval = setInterval(updateMarkets, 10000);
    return () => clearInterval(interval);
  }, []);

  const initializeMarkets = () => {
    const initialMarkets: LendingMarket[] = [
      {
        asset: 'eETH',
        totalSupplied: 125000 + Math.random() * 10000,
        totalBorrowed: 87500 + Math.random() * 5000,
        supplyAPY: 2.85 + Math.random() * 0.3,
        borrowAPY: 4.25 + Math.random() * 0.5,
        utilizationRate: 0.70 + Math.random() * 0.05,
        available: 37500 + Math.random() * 5000,
        collateralFactor: 0.80
      },
      {
        asset: 'weETH',
        totalSupplied: 98000 + Math.random() * 8000,
        totalBorrowed: 68600 + Math.random() * 4000,
        supplyAPY: 3.15 + Math.random() * 0.35,
        borrowAPY: 4.65 + Math.random() * 0.55,
        utilizationRate: 0.70 + Math.random() * 0.05,
        available: 29400 + Math.random() * 4000,
        collateralFactor: 0.75
      },
      {
        asset: 'eBTC',
        totalSupplied: 1250 + Math.random() * 150,
        totalBorrowed: 750 + Math.random() * 80,
        supplyAPY: 3.85 + Math.random() * 0.45,
        borrowAPY: 5.75 + Math.random() * 0.65,
        utilizationRate: 0.60 + Math.random() * 0.08,
        available: 500 + Math.random() * 70,
        collateralFactor: 0.70
      },
      {
        asset: 'eUSD',
        totalSupplied: 45000000 + Math.random() * 2000000,
        totalBorrowed: 31500000 + Math.random() * 1500000,
        supplyAPY: 5.25 + Math.random() * 0.5,
        borrowAPY: 7.15 + Math.random() * 0.7,
        utilizationRate: 0.70 + Math.random() * 0.05,
        available: 13500000 + Math.random() * 500000,
        collateralFactor: 0.85
      }
    ];

    setMarkets(initialMarkets);
  };

  const updateMarkets = () => {
    setMarkets(prevMarkets =>
      prevMarkets.map(market => ({
        ...market,
        totalSupplied: market.totalSupplied * (1 + (Math.random() - 0.5) * 0.001),
        totalBorrowed: market.totalBorrowed * (1 + (Math.random() - 0.5) * 0.001),
        supplyAPY: market.supplyAPY + (Math.random() - 0.5) * 0.05,
        borrowAPY: market.borrowAPY + (Math.random() - 0.5) * 0.05,
        utilizationRate: Math.min(0.95, Math.max(0.5, market.utilizationRate + (Math.random() - 0.5) * 0.02))
      }))
    );
  };

  const handleTransaction = async () => {
    if (!selectedAsset || !amount) return;

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const numAmount = parseFloat(amount);
    if (selectedAction === 'supply') {
      setUserPosition(prev => ({
        ...prev,
        supplied: {
          ...prev.supplied,
          [selectedAsset]: (prev.supplied[selectedAsset] || 0) + numAmount
        },
        collateralValue: prev.collateralValue + numAmount * 3500,
        borrowLimit: prev.borrowLimit + numAmount * 3500 * 0.75
      }));
    } else {
      setUserPosition(prev => ({
        ...prev,
        borrowed: {
          ...prev.borrowed,
          [selectedAsset]: (prev.borrowed[selectedAsset] || 0) + numAmount
        },
        borrowedValue: prev.borrowedValue + numAmount * 3500
      }));
    }

    setAmount('');
    setIsProcessing(false);
  };

  const calculateHealthFactor = () => {
    if (userPosition.borrowedValue === 0) return Infinity;
    return userPosition.collateralValue * 0.75 / userPosition.borrowedValue;
  };

  const healthFactor = calculateHealthFactor();
  const borrowCapacity = userPosition.borrowLimit - userPosition.borrowedValue;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="handcrafted-card rounded-3xl p-8 soft-glow accent-line">
        <div className="ml-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">🏦</span>
            <span className="hand-underline">Fixed-Rate Lending Protocol</span>
          </h3>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-xl p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Supplied</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                $<AnimatedNumber value={markets.reduce((sum, m) => sum + (m.totalSupplied * (m.asset === 'eUSD' ? 1 : 3500)), 0)} decimals={0} />
              </p>
            </div>

            <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Borrowed</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                $<AnimatedNumber value={markets.reduce((sum, m) => sum + (m.totalBorrowed * (m.asset === 'eUSD' ? 1 : 3500)), 0)} decimals={0} />
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Avg Supply APY</p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                <AnimatedPercentage value={markets.reduce((sum, m) => sum + m.supplyAPY, 0) / markets.length} />
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Protocol TVL</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                $<AnimatedNumber value={markets.reduce((sum, m) => sum + (m.totalSupplied * (m.asset === 'eUSD' ? 1 : 3500)), 0)} decimals={0} />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Position Dashboard */}
      {(Object.keys(userPosition.supplied).length > 0 || Object.keys(userPosition.borrowed).length > 0) && (
        <div className="handcrafted-card rounded-3xl p-6 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-2 border-violet-200 dark:border-violet-800">
          <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span>💼</span>
            Your Lending Position
          </h4>

          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Collateral Value</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                $<AnimatedNumber value={userPosition.collateralValue} decimals={2} />
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Borrowed Value</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                $<AnimatedNumber value={userPosition.borrowedValue} decimals={2} />
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Borrow Capacity</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                $<AnimatedNumber value={borrowCapacity} decimals={2} />
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Health Factor</p>
              <p className={`text-lg font-bold ${
                healthFactor > 2 ? 'text-green-600 dark:text-green-400' :
                healthFactor > 1.5 ? 'text-yellow-600 dark:text-yellow-400' :
                'text-red-600 dark:text-red-400'
              }`}>
                {healthFactor === Infinity ? '∞' : healthFactor.toFixed(2)}
              </p>
            </div>
          </div>

          {healthFactor < 1.5 && healthFactor !== Infinity && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-800 dark:text-red-400 flex items-center gap-2">
                <span>⚠️</span>
                Warning: Low health factor. Consider adding collateral or repaying debt to avoid liquidation.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Lending Markets */}
      <div className="handcrafted-card rounded-3xl p-6">
        <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span>📊</span>
          Active Lending Markets
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Asset</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Total Supplied</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Supply APY</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Total Borrowed</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Borrow APY</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Utilization</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {markets.map((market, idx) => (
                <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
                        {market.asset.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{market.asset}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">CF: {(market.collateralFactor * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      <AnimatedNumber value={market.totalSupplied} decimals={market.asset === 'eUSD' ? 0 : 2} />
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      ${(market.totalSupplied * (market.asset === 'eUSD' ? 1 : 3500) / 1000000).toFixed(1)}M
                    </p>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">
                      <AnimatedPercentage value={market.supplyAPY} />
                    </p>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      <AnimatedNumber value={market.totalBorrowed} decimals={market.asset === 'eUSD' ? 0 : 2} />
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      ${(market.totalBorrowed * (market.asset === 'eUSD' ? 1 : 3500) / 1000000).toFixed(1)}M
                    </p>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <p className="font-bold text-red-600 dark:text-red-400">
                      <AnimatedPercentage value={market.borrowAPY} />
                    </p>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            market.utilizationRate > 0.85 ? 'bg-red-500' :
                            market.utilizationRate > 0.70 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${market.utilizationRate * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {(market.utilizationRate * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedAsset(market.asset);
                          setSelectedAction('supply');
                        }}
                        className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors"
                      >
                        Supply
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAsset(market.asset);
                          setSelectedAction('borrow');
                        }}
                        className="px-3 py-1 bg-violet-600 text-white rounded-lg text-xs font-semibold hover:bg-violet-700 transition-colors"
                      >
                        Borrow
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Panel */}
      {selectedAsset && (
        <div className="handcrafted-card rounded-3xl p-6 bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20">
          <h4 className="font-bold text-gray-900 dark:text-white mb-4">
            {selectedAction === 'supply' ? '💵 Supply' : '💸 Borrow'} {selectedAsset}
          </h4>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-bold text-lg focus:ring-2 focus:ring-emerald-500"
              />

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {selectedAction === 'supply' ? 'Supply APY:' : 'Borrow APY:'}
                  </span>
                  <span className={`font-bold ${selectedAction === 'supply' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    <AnimatedPercentage value={
                      markets.find(m => m.asset === selectedAsset)?.[selectedAction === 'supply' ? 'supplyAPY' : 'borrowAPY'] || 0
                    } />
                  </span>
                </div>
                {selectedAction === 'supply' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Borrow Limit Increase:</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      ${((parseFloat(amount) || 0) * 3500 * 0.75).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
              <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Transaction Summary</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Action:</span>
                  <span className="font-semibold text-gray-900 dark:text-white capitalize">{selectedAction}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Asset:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{selectedAsset}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {amount || '0.00'} {selectedAsset}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Value:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${((parseFloat(amount) || 0) * 3500).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleTransaction}
                disabled={isProcessing || !amount || parseFloat(amount) <= 0}
                className="w-full mt-4 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" color="white" />
                    Processing...
                  </span>
                ) : (
                  `${selectedAction === 'supply' ? 'Supply' : 'Borrow'} ${selectedAsset}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Protocol Features */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="handcrafted-card rounded-xl p-4">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>
            <h5 className="font-bold text-gray-900 dark:text-white mb-2">Fixed Rates</h5>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Lock in predictable rates for your lending and borrowing
            </p>
          </div>
        </div>

        <div className="handcrafted-card rounded-xl p-4">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-violet-500/20 flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <h5 className="font-bold text-gray-900 dark:text-white mb-2">Native Assets</h5>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Use eETH, weETH, eBTC, and eUSD as collateral
            </p>
          </div>
        </div>

        <div className="handcrafted-card rounded-xl p-4">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-500/20 flex items-center justify-center">
              <span className="text-2xl">🛡️</span>
            </div>
            <h5 className="font-bold text-gray-900 dark:text-white mb-2">Liquid Positions</h5>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter and exit positions instantly with no lock periods
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
