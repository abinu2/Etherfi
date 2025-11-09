'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import LoadingSpinner from './LoadingSpinner';
import { handleEthereumError } from '@/lib/ethereum';

const CONTRACT_ABI = [
  "function createValidationTask((string,string,uint256,uint256,uint256),(uint8,string,string,uint256,uint256)) external returns (uint256)",
  "event NewValidationTask(uint256 indexed taskId, address indexed user, tuple(string,string,uint256,uint256,uint256), tuple(uint8,string,string,uint256,uint256), uint256)"
];

const STRATEGY_ACTIONS = {
  HOLD: 0,
  CONVERT_TO_WEETH: 1,
  CONVERT_TO_EETH: 2,
  STAKE_MORE: 3,
  UNSTAKE: 4
};

export default function ValidationTaskSubmitter() {
  const [eethBalance, setEethBalance] = useState('5.2');
  const [convertAmount, setConvertAmount] = useState('2.0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [gasEstimate, setGasEstimate] = useState<{gas: bigint; costETH: string; costUSD: string} | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);

  useEffect(() => {
    estimateGas();
  }, [eethBalance, convertAmount]);

  const estimateGas = async () => {
    setIsEstimating(true);
    try {
      if (typeof window.ethereum === 'undefined') return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const feeData = await provider.getFeeData();

      // Estimate gas units (mock for now)
      const gasUnits = BigInt(150000);
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
    } finally {
      setIsEstimating(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contractAddress = process.env.NEXT_PUBLIC_AVS_CONTRACT_ADDRESS || '';
      const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);

      // Portfolio data
      const portfolio = {
        eethBalance: eethBalance,
        weethBalance: '0.0',
        currentAPY: 380, // 3.8%
        gasPrice: 45, // gwei
        timestamp: Math.floor(Date.now() / 1000)
      };

      // Proposed strategy
      const strategy = {
        action: STRATEGY_ACTIONS.CONVERT_TO_WEETH,
        convertAmount: convertAmount,
        reasoning: 'Diversification: Convert eETH to weETH for better DeFi integrations',
        expectedGasCost: ethers.parseEther('0.002'),
        estimatedAPYImprovement: 30 // 0.3%
      };

      console.log('Submitting validation task...');
      const tx = await contract.createValidationTask(portfolio, strategy);
      console.log('Transaction sent:', tx.hash);

      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt.hash);

      // Parse event to get task ID
      const event = receipt.logs.find((log: any) => {
        try {
          return contract.interface.parseLog(log)?.name === 'NewValidationTask';
        } catch {
          return false;
        }
      });

      if (event) {
        const parsedEvent = contract.interface.parseLog(event);
        const newTaskId = parsedEvent?.args[0].toString();
        setTaskId(newTaskId);
        alert(`Task submitted! Task ID: ${newTaskId}`);
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      const errorMessage = handleEthereumError(error);
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Submit Validation Task</h2>
      <p className="text-gray-600 mb-6">
        Operators will validate your strategy using AI and attest on-chain
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Your eETH Balance
          </label>
          <input
            type="text"
            value={eethBalance}
            onChange={(e) => setEethBalance(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="5.2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Amount to Convert to weETH
          </label>
          <input
            type="text"
            value={convertAmount}
            onChange={(e) => setConvertAmount(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="2.0"
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Proposed Strategy:</h3>
          <p className="text-sm text-gray-700">
            Convert {convertAmount} eETH → weETH for diversification and better DeFi integrations
          </p>
        </div>

        {gasEstimate && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold mb-2">Estimated Gas Cost</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Gas Limit</p>
                <p className="text-sm font-medium">{gasEstimate.gas.toString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Cost (ETH)</p>
                <p className="text-sm font-medium">{gasEstimate.costETH} ETH</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Cost (USD)</p>
                <p className="text-sm font-medium">${gasEstimate.costUSD}</p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <LoadingSpinner size="sm" color="white" />
              Submitting to AVS...
            </span>
          ) : (
            'Submit for Validation'
          )}
        </button>

        {taskId && (
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-green-800">
              ✅ Task submitted! Task ID: {taskId}
            </p>
            <p className="text-xs text-green-600 mt-1">
              Operators are now validating your strategy...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
