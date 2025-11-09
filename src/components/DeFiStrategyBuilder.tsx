'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import LoadingSpinner from './LoadingSpinner';
import ConfidenceScoreGauge from './ConfidenceScoreGauge';
import { handleEthereumError } from '@/lib/ethereum';

// DeFi Protocols
const DEFI_PROTOCOLS = {
  AAVE: { name: 'Aave V3', address: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2', icon: '🏦' },
  COMPOUND: { name: 'Compound V3', address: '0xc3d688B66703497DAA19211EEdff47f25384cdc3', icon: '🏛️' },
  UNISWAP: { name: 'Uniswap V3', address: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45', icon: '🦄' },
  CURVE: { name: 'Curve Finance', address: '0xF0d4c12A5768D806021F80a262B4d39d26C58b8D', icon: '🌊' },
  ETHERFI: { name: 'EtherFi', address: '0x35fA164735182de50811E8e2E824cFb9B6118ac2', icon: '⚡' },
  LIDO: { name: 'Lido', address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', icon: '🔱' }
};

const TOKENS = {
  ETH: { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', decimals: 18 },
  WETH: { symbol: 'WETH', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18 },
  EETH: { symbol: 'eETH', address: '0x35fA164735182de50811E8e2E824cFb9B6118ac2', decimals: 18 },
  WEETH: { symbol: 'weETH', address: '0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee', decimals: 18 },
  STETH: { symbol: 'stETH', address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', decimals: 18 },
  USDC: { symbol: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
};

const STRATEGY_ACTIONS = {
  STAKE: { label: 'Stake ETH', description: 'Stake ETH for liquid staking tokens' },
  SWAP: { label: 'Token Swap', description: 'Swap tokens on DEX' },
  SUPPLY: { label: 'Supply Collateral', description: 'Supply tokens as collateral' },
  BORROW: { label: 'Borrow Assets', description: 'Borrow against collateral' },
  YIELD_FARM: { label: 'Yield Farm', description: 'Provide liquidity for yield' },
  RESTAKE: { label: 'Restake', description: 'Restake liquid staking tokens' }
};

interface StrategyStep {
  action: keyof typeof STRATEGY_ACTIONS;
  protocol: keyof typeof DEFI_PROTOCOLS;
  fromToken: keyof typeof TOKENS;
  toToken?: keyof typeof TOKENS;
  amount: string;
}

interface ValidationResult {
  strategyHash: string;
  confidence: number;
  riskScore: number;
  estimatedAPY: number;
  estimatedGasCost: string;
  riskFactors: string[];
  recommendations: string[];
  operatorAttestations: number;
  verified: boolean;
}

export default function DeFiStrategyBuilder() {
  const [steps, setSteps] = useState<StrategyStep[]>([
    {
      action: 'STAKE',
      protocol: 'ETHERFI',
      fromToken: 'ETH',
      toToken: 'EETH',
      amount: '1.0'
    }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [gasEstimate, setGasEstimate] = useState<{gas: bigint; costETH: string; costUSD: string} | null>(null);

  useEffect(() => {
    estimateGas();
  }, [steps]);

  const estimateGas = async () => {
    try {
      if (typeof window.ethereum === 'undefined') return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const feeData = await provider.getFeeData();

      const gasUnits = BigInt(200000 * steps.length); // More gas for complex strategies
      const gasPrice = feeData.gasPrice || BigInt(0);
      const gasCostWei = gasUnits * gasPrice;
      const gasCostETH = ethers.formatEther(gasCostWei);
      const gasCostUSD = (parseFloat(gasCostETH) * 2000).toFixed(2);

      setGasEstimate({
        gas: gasUnits,
        costETH: parseFloat(gasCostETH).toFixed(6),
        costUSD: gasCostUSD
      });
    } catch (error) {
      console.error('Gas estimation error:', error);
    }
  };

  const addStep = () => {
    setSteps([...steps, {
      action: 'SWAP',
      protocol: 'UNISWAP',
      fromToken: 'EETH',
      toToken: 'WETH',
      amount: '0.5'
    }]);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, field: keyof StrategyStep, value: any) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const handleValidateStrategy = async () => {
    setIsSubmitting(true);
    setValidationResult(null);

    try {
      // Simulate AVS validation process
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Calculate strategy metrics
      const totalAmount = steps.reduce((sum, step) => sum + parseFloat(step.amount || '0'), 0);
      const confidence = Math.floor(Math.random() * 20) + 75; // 75-95%
      const riskScore = Math.floor(Math.random() * 4) + 3; // 3-7 out of 10
      const estimatedAPY = parseFloat((Math.random() * 3 + 2).toFixed(2)); // 2-5%

      const riskFactors = [
        steps.length > 1 && 'Multi-step strategy increases complexity',
        totalAmount > 2 && 'Large position size - consider splitting',
        steps.some(s => s.protocol === 'CURVE') && 'Curve pools may have impermanent loss risk'
      ].filter(Boolean) as string[];

      const recommendations = [
        'Strategy appears sound with acceptable risk levels',
        'Consider monitoring gas prices before execution',
        steps.length > 2 && 'Multi-step strategies benefit from batching',
        'Current market conditions favor this strategy'
      ].filter(Boolean) as string[];

      setValidationResult({
        strategyHash: `0x${Math.random().toString(16).slice(2, 66)}`,
        confidence,
        riskScore,
        estimatedAPY,
        estimatedGasCost: gasEstimate?.costETH || '0',
        riskFactors,
        recommendations,
        operatorAttestations: Math.floor(Math.random() * 3) + 3, // 3-5 operators
        verified: confidence >= 70
      });

    } catch (error: any) {
      console.error('Validation error:', error);
      const errorMessage = handleEthereumError(error);
      alert(`Validation Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          DeFi Strategy Builder
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Build cross-protocol strategies validated by Veritas AVS operators
        </p>
      </div>

      {/* Strategy Steps */}
      <div className="space-y-4 mb-6">
        {steps.map((step, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Step {index + 1}
              </h3>
              {steps.length > 1 && (
                <button
                  onClick={() => removeStep(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Action */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Action
                </label>
                <select
                  value={step.action}
                  onChange={(e) => updateStep(index, 'action', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {Object.entries(STRATEGY_ACTIONS).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Protocol */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Protocol
                </label>
                <select
                  value={step.protocol}
                  onChange={(e) => updateStep(index, 'protocol', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {Object.entries(DEFI_PROTOCOLS).map(([key, { name, icon }]) => (
                    <option key={key} value={key}>{icon} {name}</option>
                  ))}
                </select>
              </div>

              {/* From Token */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  From Token
                </label>
                <select
                  value={step.fromToken}
                  onChange={(e) => updateStep(index, 'fromToken', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {Object.entries(TOKENS).map(([key, { symbol }]) => (
                    <option key={key} value={key}>{symbol}</option>
                  ))}
                </select>
              </div>

              {/* To Token (if applicable) */}
              {(step.action === 'SWAP' || step.action === 'STAKE') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    To Token
                  </label>
                  <select
                    value={step.toToken || 'WETH'}
                    onChange={(e) => updateStep(index, 'toToken', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    {Object.entries(TOKENS).map(([key, { symbol }]) => (
                      <option key={key} value={key}>{symbol}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount
                </label>
                <input
                  type="text"
                  value={step.amount}
                  onChange={(e) => updateStep(index, 'amount', e.target.value)}
                  placeholder="1.0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Step Description */}
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-300">
                {STRATEGY_ACTIONS[step.action].description} on {DEFI_PROTOCOLS[step.protocol].name}
              </p>
            </div>
          </div>
        ))}

        <button
          onClick={addStep}
          className="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
        >
          + Add Another Step
        </button>
      </div>

      {/* Gas Estimate */}
      {gasEstimate && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Estimated Execution Cost
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Gas Limit</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {gasEstimate.gas.toString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Cost (ETH)</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {gasEstimate.costETH} ETH
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Cost (USD)</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                ${gasEstimate.costUSD}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Validate Button */}
      <button
        onClick={handleValidateStrategy}
        disabled={isSubmitting}
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <LoadingSpinner size="sm" color="white" />
            Validating with AVS Operators...
          </span>
        ) : (
          'Submit for AVS Validation'
        )}
      </button>

      {/* Validation Result */}
      {validationResult && (
        <div className="mt-6 space-y-4 animate-fadeIn">
          {/* Confidence Gauge */}
          <div className="flex justify-center py-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <ConfidenceScoreGauge score={validationResult.confidence} size={140} />
          </div>

          {/* Verification Status */}
          <div className={`p-4 rounded-lg border ${
            validationResult.verified
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{validationResult.verified ? '✅' : '⚠️'}</span>
              <h4 className={`font-semibold ${
                validationResult.verified
                  ? 'text-green-800 dark:text-green-300'
                  : 'text-yellow-800 dark:text-yellow-300'
              }`}>
                {validationResult.verified ? 'Strategy Verified by AVS' : 'Caution Recommended'}
              </h4>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {validationResult.operatorAttestations} operators have attested to this strategy
            </p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Risk Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {validationResult.riskScore}/10
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Est. APY</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                +{validationResult.estimatedAPY}%
              </p>
            </div>
          </div>

          {/* Risk Factors */}
          {validationResult.riskFactors.length > 0 && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <h5 className="font-semibold text-red-800 dark:text-red-300 mb-2">Risk Factors</h5>
              <ul className="space-y-1">
                {validationResult.riskFactors.map((factor, i) => (
                  <li key={i} className="text-sm text-red-700 dark:text-red-400 flex items-start gap-2">
                    <span>⚠️</span>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h5 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">AI Recommendations</h5>
            <ul className="space-y-1">
              {validationResult.recommendations.map((rec, i) => (
                <li key={i} className="text-sm text-blue-700 dark:text-blue-400 flex items-start gap-2">
                  <span>💡</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Strategy Hash */}
          <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Strategy Hash</p>
            <p className="text-xs font-mono text-gray-900 dark:text-white break-all">
              {validationResult.strategyHash}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
