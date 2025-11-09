'use client';

import { useState } from 'react';
import ConfidenceScoreGauge from './ConfidenceScoreGauge';
import LoadingSpinner from './LoadingSpinner';

interface SimulationResult {
  confidence: number;
  recommendation: 'approve' | 'reject' | 'caution';
  pros: string[];
  cons: string[];
  estimatedAPYChange: number;
  estimatedGasCost: number;
}

export default function StrategySimulator() {
  const [action, setAction] = useState<'hold' | 'convert_to_weeth' | 'convert_to_eeth' | 'stake_more'>('convert_to_weeth');
  const [amount, setAmount] = useState('1.0');
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const simulateStrategy = async () => {
    setIsSimulating(true);
    setResult(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock simulation result
    const mockResult: SimulationResult = {
      confidence: Math.floor(Math.random() * 30) + 70, // 70-100
      recommendation: Math.random() > 0.3 ? 'approve' : 'caution',
      pros: [
        'Improved liquidity access',
        'Better DeFi integration opportunities',
        'Potential for higher APY',
        'Gas-efficient transaction timing'
      ].slice(0, Math.floor(Math.random() * 2) + 2),
      cons: [
        'Temporary lock-up period',
        'Gas costs may vary',
        'Market volatility risk'
      ].slice(0, Math.floor(Math.random() * 2) + 1),
      estimatedAPYChange: parseFloat((Math.random() * 0.5).toFixed(2)),
      estimatedGasCost: parseFloat((Math.random() * 0.005 + 0.002).toFixed(4))
    };

    setResult(mockResult);
    setIsSimulating(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Strategy Simulator
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Test your strategy without spending gas
        </p>
      </div>

      <div className="space-y-4">
        {/* Action Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Strategy Action
          </label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="hold">Hold Current Position</option>
            <option value="convert_to_weeth">Convert eETH → weETH</option>
            <option value="convert_to_eeth">Convert weETH → eETH</option>
            <option value="stake_more">Stake More ETH</option>
          </select>
        </div>

        {/* Amount Input */}
        {action !== 'hold' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount (ETH)
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1.0"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Simulate Button */}
        <button
          onClick={simulateStrategy}
          disabled={isSimulating}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
        >
          {isSimulating ? (
            <span className="flex items-center justify-center gap-2">
              <LoadingSpinner size="sm" color="white" />
              Simulating...
            </span>
          ) : (
            'Simulate Strategy'
          )}
        </button>

        {/* Results */}
        {result && (
          <div className="mt-6 space-y-4 animate-fadeIn">
            {/* Confidence Gauge */}
            <div className="flex justify-center py-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <ConfidenceScoreGauge score={result.confidence} size={140} />
            </div>

            {/* Recommendation */}
            <div className={`p-4 rounded-lg ${
              result.recommendation === 'approve' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' :
              result.recommendation === 'caution' ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' :
              'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}>
              <h4 className={`font-semibold mb-2 ${
                result.recommendation === 'approve' ? 'text-green-800 dark:text-green-300' :
                result.recommendation === 'caution' ? 'text-yellow-800 dark:text-yellow-300' :
                'text-red-800 dark:text-red-300'
              }`}>
                {result.recommendation === 'approve' ? 'Recommended ✓' :
                 result.recommendation === 'caution' ? 'Proceed with Caution ⚠' :
                 'Not Recommended ✗'}
              </h4>
            </div>

            {/* Projected Outcomes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Est. APY Change</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  +{result.estimatedAPYChange}%
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Est. Gas Cost</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {result.estimatedGasCost} ETH
                </p>
              </div>
            </div>

            {/* Pros and Cons */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-green-700 dark:text-green-400 mb-2">Pros</h5>
                <ul className="space-y-1">
                  {result.pros.map((pro, i) => (
                    <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                      <span className="text-green-500">+</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-red-700 dark:text-red-400 mb-2">Cons</h5>
                <ul className="space-y-1">
                  {result.cons.map((con, i) => (
                    <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                      <span className="text-red-500">-</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
