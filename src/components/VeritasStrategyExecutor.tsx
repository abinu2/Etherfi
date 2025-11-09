/**
 * Veritas Strategy Executor Component
 *
 * This component handles the full lifecycle of strategy execution:
 * 1. User submits a strategy for verification
 * 2. Listens for AVS verification
 * 3. Shows verification results
 * 4. Allows user to approve and execute the verified strategy
 */

'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWalletClient, usePublicClient, useWatchContractEvent } from 'wagmi';
import { parseAbi, formatEther, parseEther, encodeFunctionData, keccak256, encodeAbiParameters, parseAbiParameters } from 'viem';
import Anthropic from '@anthropic-ai/sdk';

const VERITAS_ABI = parseAbi([
  'function submitNewStrategy(tuple(address user, address fromContract, address fromToken, uint256 amount, address toContract, bytes callData, uint256 minOutput, uint256 deadline) strategy) external returns (bytes32)',
  'function executeVerifiedStrategy(tuple(address user, address fromContract, address fromToken, uint256 amount, address toContract, bytes callData, uint256 minOutput, uint256 deadline) strategy) external returns (uint256)',
  'function getStrategyHash(tuple(address user, address fromContract, address fromToken, uint256 amount, address toContract, bytes callData, uint256 minOutput, uint256 deadline) strategy) external pure returns (bytes32)',
  'function isStrategyVerified(bytes32 strategyHash) external view returns (bool)',
  'function getAttestation(bytes32 strategyHash) external view returns (tuple(uint256 simulatedGasCost, uint256 simulatedOutput, bool isSafe))',
  'event StrategySubmitted(bytes32 indexed strategyHash, address indexed user, tuple(address user, address fromContract, address fromToken, uint256 amount, address toContract, bytes callData, uint256 minOutput, uint256 deadline) strategy)',
  'event StrategyVerified(bytes32 indexed strategyHash, tuple(uint256 simulatedGasCost, uint256 simulatedOutput, bool isSafe) attestation)',
  'event StrategyExecuted(bytes32 indexed strategyHash, address indexed user, uint256 actualOutput)',
]);

const ERC20_ABI = parseAbi([
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
  'function symbol() external view returns (string)',
]);

interface Strategy {
  user: `0x${string}`;
  fromContract: `0x${string}`;
  fromToken: `0x${string}`;
  amount: bigint;
  toContract: `0x${string}`;
  callData: `0x${string}`;
  minOutput: bigint;
  deadline: bigint;
}

interface Attestation {
  simulatedGasCost: bigint;
  simulatedOutput: bigint;
  isSafe: boolean;
}

interface VeritasStrategyExecutorProps {
  contractAddress: `0x${string}`;
}

type ExecutionStatus =
  | 'idle'
  | 'generating'
  | 'submitting'
  | 'waiting_verification'
  | 'verified'
  | 'approving'
  | 'executing'
  | 'completed'
  | 'failed';

export default function VeritasStrategyExecutor({ contractAddress }: VeritasStrategyExecutorProps) {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const [status, setStatus] = useState<ExecutionStatus>('idle');
  const [currentStrategy, setCurrentStrategy] = useState<Strategy | null>(null);
  const [strategyHash, setStrategyHash] = useState<`0x${string}` | null>(null);
  const [attestation, setAttestation] = useState<Attestation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiStrategy, setAiStrategy] = useState<string>('');

  // Form inputs
  const [fromToken, setFromToken] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [toContract, setToContract] = useState<string>('');
  const [minOutput, setMinOutput] = useState<string>('');
  const [portfolioContext, setPortfolioContext] = useState<string>('');

  // Watch for StrategyVerified event for current strategy
  useWatchContractEvent({
    address: contractAddress,
    abi: VERITAS_ABI,
    eventName: 'StrategyVerified',
    onLogs(logs) {
      for (const log of logs) {
        if (log.args.strategyHash === strategyHash) {
          setAttestation({
            simulatedGasCost: log.args.attestation.simulatedGasCost,
            simulatedOutput: log.args.attestation.simulatedOutput,
            isSafe: log.args.attestation.isSafe,
          });
          setStatus('verified');
        }
      }
    },
  });

  /**
   * Step 1: Generate Strategy with Claude AI
   */
  const generateStrategyWithAI = async () => {
    if (!address) {
      setError('Please connect your wallet');
      return;
    }

    setStatus('generating');
    setError(null);

    try {
      // Call your API route that uses Claude to generate strategy
      const response = await fetch('/api/strategy/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: address,
          portfolioContext,
          fromToken,
          amount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate strategy');
      }

      // Populate form with AI-generated strategy
      setToContract(data.toContract);
      setMinOutput(data.minOutput);
      setAiStrategy(data.reasoning);

      setStatus('idle');
    } catch (err: any) {
      setError(err.message);
      setStatus('failed');
    }
  };

  /**
   * Step 2: Submit Strategy for Verification
   */
  const submitStrategy = async () => {
    if (!address || !walletClient || !publicClient) {
      setError('Please connect your wallet');
      return;
    }

    setStatus('submitting');
    setError(null);

    try {
      // Build strategy object
      const strategy: Strategy = {
        user: address,
        fromContract: '0x0000000000000000000000000000000000000000' as `0x${string}`, // Not using fromContract for now
        fromToken: fromToken as `0x${string}`,
        amount: parseEther(amount),
        toContract: toContract as `0x${string}`,
        callData: '0x' as `0x${string}`, // Would be populated by AI
        minOutput: parseEther(minOutput),
        deadline: BigInt(Math.floor(Date.now() / 1000) + 3600), // 1 hour from now
      };

      // Submit to contract
      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi: VERITAS_ABI,
        functionName: 'submitNewStrategy',
        args: [strategy],
      });

      console.log('Strategy submitted, tx:', hash);

      // Wait for transaction
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log('Transaction confirmed:', receipt);

      // Calculate strategy hash
      const computedHash = keccak256(
        encodeAbiParameters(
          parseAbiParameters('(address,address,address,uint256,address,bytes,uint256,uint256)'),
          [[
            strategy.user,
            strategy.fromContract,
            strategy.fromToken,
            strategy.amount,
            strategy.toContract,
            strategy.callData,
            strategy.minOutput,
            strategy.deadline,
          ]]
        )
      );

      setStrategyHash(computedHash);
      setCurrentStrategy(strategy);
      setStatus('waiting_verification');
    } catch (err: any) {
      setError(err.message);
      setStatus('failed');
    }
  };

  /**
   * Step 3: Approve Token Spending
   */
  const approveTokens = async () => {
    if (!currentStrategy || !walletClient || !publicClient) {
      return;
    }

    setStatus('approving');
    setError(null);

    try {
      const hash = await walletClient.writeContract({
        address: currentStrategy.fromToken,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [contractAddress, currentStrategy.amount],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      console.log('Approval confirmed');
      // Stay in verified state, user can now execute
      setStatus('verified');
    } catch (err: any) {
      setError(err.message);
      setStatus('failed');
    }
  };

  /**
   * Step 4: Execute Verified Strategy
   */
  const executeStrategy = async () => {
    if (!currentStrategy || !walletClient || !publicClient) {
      return;
    }

    setStatus('executing');
    setError(null);

    try {
      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi: VERITAS_ABI,
        functionName: 'executeVerifiedStrategy',
        args: [currentStrategy],
      });

      console.log('Executing strategy, tx:', hash);

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      console.log('Strategy executed successfully:', receipt);
      setStatus('completed');
    } catch (err: any) {
      setError(err.message);
      setStatus('failed');
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setCurrentStrategy(null);
    setStrategyHash(null);
    setAttestation(null);
    setError(null);
    setFromToken('');
    setAmount('');
    setToContract('');
    setMinOutput('');
    setAiStrategy('');
    setPortfolioContext('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Veritas Strategy Executor</h2>
        <p className="text-purple-200">AI-Powered DeFi Strategy Verification via EigenLayer AVS</p>
      </div>

      {/* Status Display */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Status</h3>
          <StatusBadge status={status} />
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-4">
            <p className="text-red-200">❌ {error}</p>
          </div>
        )}

        {status === 'waiting_verification' && (
          <div className="bg-yellow-900/50 border border-yellow-500 rounded-lg p-4 animate-pulse">
            <p className="text-yellow-200">⏳ Waiting for AVS operator verification...</p>
            <p className="text-yellow-300 text-sm mt-2">Strategy Hash: {strategyHash?.slice(0, 20)}...</p>
          </div>
        )}

        {status === 'verified' && attestation && (
          <div className="bg-green-900/50 border border-green-500 rounded-lg p-4 space-y-3">
            <p className="text-green-200 font-semibold">✅ Strategy Verified by AVS!</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Simulated Gas Cost</p>
                <p className="text-white font-mono">{formatEther(attestation.simulatedGasCost)} ETH</p>
              </div>
              <div>
                <p className="text-gray-400">Simulated Output</p>
                <p className="text-white font-mono">{formatEther(attestation.simulatedOutput)} tokens</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400">Safety Check</p>
                <p className={`font-semibold ${attestation.isSafe ? 'text-green-400' : 'text-red-400'}`}>
                  {attestation.isSafe ? '✅ Safe to Execute' : '⚠️ Not Safe'}
                </p>
              </div>
            </div>
          </div>
        )}

        {status === 'completed' && (
          <div className="bg-blue-900/50 border border-blue-500 rounded-lg p-4">
            <p className="text-blue-200">🎉 Strategy executed successfully!</p>
          </div>
        )}
      </div>

      {/* Strategy Form */}
      {status === 'idle' && (
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 space-y-4">
          <h3 className="text-xl font-semibold text-white mb-4">Create Strategy</h3>

          <div>
            <label className="block text-gray-300 mb-2">Portfolio Context</label>
            <textarea
              className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg p-3"
              placeholder="Describe your current DeFi portfolio..."
              value={portfolioContext}
              onChange={(e) => setPortfolioContext(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">From Token Address</label>
              <input
                type="text"
                className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg p-3"
                placeholder="0x..."
                value={fromToken}
                onChange={(e) => setFromToken(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Amount</label>
              <input
                type="text"
                className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg p-3"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={generateStrategyWithAI}
            disabled={!address || !fromToken || !amount}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            🤖 Generate Strategy with AI
          </button>

          {aiStrategy && (
            <div className="bg-indigo-900/50 border border-indigo-500 rounded-lg p-4">
              <p className="text-indigo-200 text-sm">{aiStrategy}</p>
            </div>
          )}

          <div>
            <label className="block text-gray-300 mb-2">To Contract Address</label>
            <input
              type="text"
              className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg p-3"
              placeholder="0x..."
              value={toContract}
              onChange={(e) => setToContract(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Minimum Output (Slippage Protection)</label>
            <input
              type="text"
              className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg p-3"
              placeholder="0.0"
              value={minOutput}
              onChange={(e) => setMinOutput(e.target.value)}
            />
          </div>

          <button
            onClick={submitStrategy}
            disabled={!address || !fromToken || !amount || !toContract || !minOutput}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            📤 Submit for AVS Verification
          </button>
        </div>
      )}

      {/* Execution Controls */}
      {status === 'verified' && attestation && attestation.isSafe && (
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 space-y-4">
          <h3 className="text-xl font-semibold text-white mb-4">Execute Strategy</h3>

          <button
            onClick={approveTokens}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            1️⃣ Approve Token Spending
          </button>

          <button
            onClick={executeStrategy}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            2️⃣ Execute Verified Strategy
          </button>
        </div>
      )}

      {(status === 'completed' || status === 'failed') && (
        <button
          onClick={resetForm}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          🔄 Start New Strategy
        </button>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: ExecutionStatus }) {
  const statusConfig = {
    idle: { label: 'Ready', color: 'bg-gray-500' },
    generating: { label: 'Generating...', color: 'bg-purple-500 animate-pulse' },
    submitting: { label: 'Submitting...', color: 'bg-blue-500 animate-pulse' },
    waiting_verification: { label: 'Awaiting Verification', color: 'bg-yellow-500 animate-pulse' },
    verified: { label: 'Verified ✅', color: 'bg-green-500' },
    approving: { label: 'Approving...', color: 'bg-yellow-500 animate-pulse' },
    executing: { label: 'Executing...', color: 'bg-blue-500 animate-pulse' },
    completed: { label: 'Completed 🎉', color: 'bg-green-600' },
    failed: { label: 'Failed ❌', color: 'bg-red-500' },
  };

  const config = statusConfig[status];

  return (
    <span className={`${config.color} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
      {config.label}
    </span>
  );
}
