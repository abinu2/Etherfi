'use client';

import { useState, useEffect } from 'react';
import { usePublicClient, useWalletClient, useAccount } from 'wagmi';
import { parseAbi, Address, keccak256, encodeAbiParameters, parseEther } from 'viem';
import LoadingSpinner from './LoadingSpinner';
import AnimatedNumber, { AnimatedPercentage } from './AnimatedNumber';

// EigenLayer AVS Contract ABIs
const VERITAS_ABI = parseAbi([
  'function submitNewStrategy((address,address,address,uint256,address,bytes,uint256,uint256)) external',
  'function executeVerifiedStrategy((address,address,address,uint256,address,bytes,uint256,uint256)) external',
  'function strategyStatus(bytes32) external view returns (uint8)',
  'function strategyAttestations(bytes32) external view returns (uint256,uint256,bool)',
  'function registeredOperators(address) external view returns (bool)',
  'event StrategySubmitted(bytes32 indexed strategyHash, address indexed user)',
  'event StrategyVerified(bytes32 indexed strategyHash, uint256 simulatedGasCost, uint256 simulatedOutput, bool isSafe)',
  'event StrategyExecuted(bytes32 indexed strategyHash, address indexed user)'
]);

const ERC20_ABI = parseAbi([
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function balanceOf(address owner) external view returns (uint256)'
]);

// Strategy struct matching Solidity
interface Strategy {
  user: Address;
  fromContract: Address;
  fromToken: Address;
  amount: bigint;
  toContract: Address;
  callData: `0x${string}`;
  minOutput: bigint;
  deadline: bigint;
}

// Attestation struct
interface Attestation {
  simulatedGasCost: bigint;
  simulatedOutput: bigint;
  isSafe: boolean;
}

enum StrategyStatus {
  Pending = 0,
  Verified = 1,
  Executed = 2,
  Failed = 3
}

interface StrategyOption {
  id: string;
  name: string;
  description: string;
  fromProtocol: string;
  toProtocol: string;
  estimatedAPY: number;
  riskLevel: 'low' | 'medium' | 'high';
  fromContract: Address;
  fromToken: Address;
  toContract: Address;
  amount: string;
}

const VERITAS_CONTRACT = (process.env.NEXT_PUBLIC_VERITAS_CONTRACT || '0x0000000000000000000000000000000000000000') as Address;

export default function StrategyVerificationAVS() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [selectedStrategy, setSelectedStrategy] = useState<StrategyOption | null>(null);
  const [currentStrategy, setCurrentStrategy] = useState<Strategy | null>(null);
  const [strategyHash, setStrategyHash] = useState<`0x${string}` | null>(null);
  const [step, setStep] = useState<'select' | 'submit' | 'approve' | 'verify' | 'execute' | 'complete'>('select');
  const [attestation, setAttestation] = useState<Attestation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  // Pre-defined strategy options
  const strategyOptions: StrategyOption[] = [
    {
      id: 'aave-pendle',
      name: 'Aave → Pendle PT-weETH',
      description: 'Move weETH from Aave to Pendle for fixed-rate yield. Earn predictable returns.',
      fromProtocol: 'Aave V3',
      toProtocol: 'Pendle',
      estimatedAPY: 12.5,
      riskLevel: 'medium',
      fromContract: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2' as Address,
      fromToken: '0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee' as Address,
      toContract: '0x00000000005BBB0EF59571E58418F9a4357b68A0' as Address,
      amount: '1.0'
    },
    {
      id: 'compound-morpho',
      name: 'Compound → Morpho Blue',
      description: 'Migrate USDC position to Morpho for superior rates with lower risk.',
      fromProtocol: 'Compound V3',
      toProtocol: 'Morpho Blue',
      estimatedAPY: 8.3,
      riskLevel: 'low',
      fromContract: '0xc3d688B66703497DAA19211EEdff47f25384cdc3' as Address,
      fromToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as Address,
      toContract: '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb' as Address,
      amount: '1000.0'
    },
    {
      id: 'curve-convex',
      name: 'Curve → Convex Boost',
      description: 'Stake Curve LP tokens in Convex for boosted CRV and CVX rewards.',
      fromProtocol: 'Curve Finance',
      toProtocol: 'Convex',
      estimatedAPY: 15.7,
      riskLevel: 'medium',
      fromContract: '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022' as Address,
      fromToken: '0x06325440D014e39736583c165C2963BA99fAf14E' as Address,
      toContract: '0xF403C135812408BFbE8713b5A23a04b3D48AAE31' as Address,
      amount: '10.0'
    }
  ];

  // Build strategy from option
  const buildStrategy = (option: StrategyOption): Strategy => {
    if (!address) throw new Error('Wallet not connected');

    // Generate mock calldata (in production, this comes from AI)
    const callData = '0x' as `0x${string}`;

    return {
      user: address,
      fromContract: option.fromContract,
      fromToken: option.fromToken,
      amount: parseEther(option.amount),
      toContract: option.toContract,
      callData,
      minOutput: parseEther((parseFloat(option.amount) * 0.95).toString()), // 5% slippage
      deadline: BigInt(Math.floor(Date.now() / 1000) + 3600) // 1 hour
    };
  };

  // Step 1: Submit strategy to AVS
  const handleSubmitStrategy = async () => {
    if (!selectedStrategy || !walletClient || !publicClient || !address) return;

    setIsLoading(true);
    setError(null);

    try {
      const strategy = buildStrategy(selectedStrategy);
      setCurrentStrategy(strategy);

      // Submit to contract
      const hash = await walletClient.writeContract({
        address: VERITAS_CONTRACT,
        abi: VERITAS_ABI,
        functionName: 'submitNewStrategy',
        args: [strategy]
      });

      setTxHash(hash);
      await publicClient.waitForTransactionReceipt({ hash });

      // Calculate strategy hash
      const encodedStrategy = encodeAbiParameters(
        [
          { type: 'address' },
          { type: 'address' },
          { type: 'address' },
          { type: 'uint256' },
          { type: 'address' },
          { type: 'bytes' },
          { type: 'uint256' },
          { type: 'uint256' }
        ],
        [
          strategy.user,
          strategy.fromContract,
          strategy.fromToken,
          strategy.amount,
          strategy.toContract,
          strategy.callData,
          strategy.minOutput,
          strategy.deadline
        ]
      );

      const hash32 = keccak256(encodedStrategy);
      setStrategyHash(hash32);
      setStep('verify');

      // Start listening for verification
      listenForVerification(hash32);
    } catch (err: any) {
      console.error('Submit error:', err);
      setError(err.message || 'Failed to submit strategy');
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for verification event
  const listenForVerification = (hash: `0x${string}`) => {
    if (!publicClient) return;

    const pollInterval = setInterval(async () => {
      try {
        const status = await publicClient.readContract({
          address: VERITAS_CONTRACT,
          abi: VERITAS_ABI,
          functionName: 'strategyStatus',
          args: [hash]
        }) as number;

        if (status === StrategyStatus.Verified) {
          clearInterval(pollInterval);

          // Fetch attestation
          const attestationData = await publicClient.readContract({
            address: VERITAS_CONTRACT,
            abi: VERITAS_ABI,
            functionName: 'strategyAttestations',
            args: [hash]
          }) as [bigint, bigint, boolean];

          setAttestation({
            simulatedGasCost: attestationData[0],
            simulatedOutput: attestationData[1],
            isSafe: attestationData[2]
          });

          setStep('approve');
        }
      } catch (err) {
        console.error('Poll error:', err);
      }
    }, 3000);

    setTimeout(() => clearInterval(pollInterval), 300000);
  };

  // Step 2: Approve token
  const handleApprove = async () => {
    if (!currentStrategy || !walletClient || !publicClient) return;

    setIsLoading(true);
    setError(null);

    try {
      const hash = await walletClient.writeContract({
        address: currentStrategy.fromToken,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [VERITAS_CONTRACT, currentStrategy.amount]
      });

      setTxHash(hash);
      await publicClient.waitForTransactionReceipt({ hash });
      setStep('execute');
    } catch (err: any) {
      console.error('Approve error:', err);
      setError(err.message || 'Failed to approve tokens');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Execute strategy
  const handleExecute = async () => {
    if (!currentStrategy || !walletClient || !publicClient) return;

    setIsLoading(true);
    setError(null);

    try {
      const hash = await walletClient.writeContract({
        address: VERITAS_CONTRACT,
        abi: VERITAS_ABI,
        functionName: 'executeVerifiedStrategy',
        args: [currentStrategy]
      });

      setTxHash(hash);
      await publicClient.waitForTransactionReceipt({ hash });
      setStep('complete');
    } catch (err: any) {
      console.error('Execute error:', err);
      setError(err.message || 'Failed to execute strategy');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'border-green-500 bg-green-50 dark:bg-green-900/10';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10';
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-900/10';
      default: return 'border-gray-300 bg-gray-50 dark:bg-gray-900/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-violet-500/10 to-cyan-500/10 rounded-2xl p-8 border border-emerald-500/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Veritas AVS
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Decentralized strategy verification powered by EigenLayer operators
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-500 mb-1">Network Operators</div>
            <div className="text-4xl font-bold text-emerald-600">12</div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mt-6">
          {['Select', 'Submit', 'Verify', 'Approve', 'Execute'].map((label, idx) => {
            const stepNames = ['select', 'submit', 'verify', 'approve', 'execute', 'complete'];
            const currentIdx = stepNames.indexOf(step);
            const isActive = idx <= currentIdx;

            return (
              <div key={label} className="flex items-center flex-1">
                <div className={`flex items-center gap-2 ${idx < 4 ? 'flex-1' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                    isActive
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className={`text-sm font-medium ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                    {label}
                  </span>
                </div>
                {idx < 4 && (
                  <div className={`h-1 flex-1 mx-2 rounded ${
                    idx < currentIdx ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategy Selection */}
      {step === 'select' && (
        <div className="grid md:grid-cols-3 gap-4">
          {strategyOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                setSelectedStrategy(option);
                setStep('submit');
              }}
              className={`text-left p-6 rounded-xl border-2 transition-all hover:scale-105 ${getRiskColor(option.riskLevel)}`}
            >
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                {option.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {option.description}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mb-3">
                <span>{option.fromProtocol}</span>
                <span className="text-lg">→</span>
                <span>{option.toProtocol}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium">
                  {option.riskLevel} risk
                </span>
                <span className="text-xl font-bold text-emerald-600">
                  {option.estimatedAPY}% APY
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Submit Step */}
      {step === 'submit' && selectedStrategy && (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Review Strategy
          </h3>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Strategy:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{selectedStrategy.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Amount:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{selectedStrategy.amount} tokens</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Estimated APY:</span>
              <span className="font-semibold text-emerald-600">{selectedStrategy.estimatedAPY}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Risk Level:</span>
              <span className={`font-semibold ${selectedStrategy.riskLevel === 'low' ? 'text-green-600' : selectedStrategy.riskLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                {selectedStrategy.riskLevel}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setStep('select');
                setSelectedStrategy(null);
              }}
              className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmitStrategy}
              disabled={isLoading || !address}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? 'Submitting...' : 'Submit to AVS'}
            </button>
          </div>
        </div>
      )}

      {/* Verification Step */}
      {step === 'verify' && (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800">
          <div className="text-center py-8">
            <LoadingSpinner size="lg" text="Waiting for operator verification..." />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              EigenLayer operators are simulating your strategy on a mainnet fork
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              This usually takes 10-30 seconds
            </p>
          </div>
        </div>
      )}

      {/* Approve Step */}
      {step === 'approve' && attestation && selectedStrategy && (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">✅</span>
              <h3 className="text-xl font-bold text-green-900 dark:text-green-300">
                Strategy Verified by Operators!
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Simulated Gas</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  <AnimatedNumber value={Number(attestation.simulatedGasCost)} decimals={0} />
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Expected Output</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {(Number(attestation.simulatedOutput) / 1e18).toFixed(4)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Safety Check</p>
                <p className={`text-lg font-bold ${attestation.isSafe ? 'text-green-600' : 'text-red-600'}`}>
                  {attestation.isSafe ? '✓ Safe' : '✗ Unsafe'}
                </p>
              </div>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Before executing, you need to approve the Veritas contract to spend your tokens.
          </p>

          <button
            onClick={handleApprove}
            disabled={isLoading || !attestation.isSafe}
            className="w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-xl hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? 'Approving...' : 'Approve Tokens'}
          </button>
        </div>
      )}

      {/* Execute Step */}
      {step === 'execute' && attestation && (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Execute
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Tokens approved! Click below to execute your verified strategy.
          </p>

          <button
            onClick={handleExecute}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? 'Executing...' : 'Execute Strategy'}
          </button>
        </div>
      )}

      {/* Complete Step */}
      {step === 'complete' && (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Strategy Executed Successfully!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your DeFi strategy has been safely executed with AVS verification
          </p>
          <button
            onClick={() => {
              setStep('select');
              setSelectedStrategy(null);
              setCurrentStrategy(null);
              setAttestation(null);
              setStrategyHash(null);
            }}
            className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors"
          >
            Submit Another Strategy
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p className="text-red-800 dark:text-red-400">❌ {error}</p>
        </div>
      )}
    </div>
  );
}
