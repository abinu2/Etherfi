'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { checkNetwork } from '@/lib/ethereum';

interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

const NETWORKS: { [key: number]: NetworkConfig } = {
  1: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://eth.llamarpc.com',
    blockExplorer: 'https://etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
  },
  11155111: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://rpc.sepolia.org',
    blockExplorer: 'https://sepolia.etherscan.io',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 }
  },
  5: {
    chainId: 5,
    name: 'Goerli Testnet',
    rpcUrl: 'https://goerli.infura.io/v3',
    blockExplorer: 'https://goerli.etherscan.io',
    nativeCurrency: { name: 'Goerli Ether', symbol: 'ETH', decimals: 18 }
  }
};

interface NetworkSwitcherProps {
  expectedChainId: number;
  showWarning?: boolean;
}

export default function NetworkSwitcher({
  expectedChainId,
  showWarning = true
}: NetworkSwitcherProps) {
  const { chainId, switchNetwork, isConnected } = useWallet();
  const [isSwitching, setIsSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (isConnected) {
        const correct = await checkNetwork(expectedChainId);
        setIsCorrectNetwork(correct);
      }
    };
    check();
  }, [chainId, expectedChainId, isConnected]);

  const handleSwitch = async () => {
    setIsSwitching(true);
    setError(null);

    try {
      await switchNetwork(expectedChainId);
      setIsCorrectNetwork(true);
    } catch (err: any) {
      setError(err.message || 'Failed to switch network');
    } finally {
      setIsSwitching(false);
    }
  };

  if (!isConnected || isCorrectNetwork) {
    return null;
  }

  const expectedNetwork = NETWORKS[expectedChainId];
  const currentNetwork = chainId ? NETWORKS[chainId] : null;

  if (!showWarning) {
    return (
      <button
        onClick={handleSwitch}
        disabled={isSwitching}
        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
      >
        {isSwitching ? 'Switching...' : `Switch to ${expectedNetwork?.name}`}
      </button>
    );
  }

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-300 mb-1">
            Wrong Network
          </h3>
          <p className="text-sm text-yellow-800 dark:text-yellow-400 mb-3">
            {currentNetwork ? (
              <>
                You are currently on <strong>{currentNetwork.name}</strong>.
                Please switch to <strong>{expectedNetwork?.name}</strong> to continue.
              </>
            ) : (
              <>Please switch to <strong>{expectedNetwork?.name}</strong> to continue.</>
            )}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSwitch}
              disabled={isSwitching}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSwitching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Switching...
                </>
              ) : (
                <>Switch to {expectedNetwork?.name}</>
              )}
            </button>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact version for header
export function NetworkIndicator({ expectedChainId }: { expectedChainId: number }) {
  const { chainId, isConnected } = useWallet();
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (isConnected) {
        const correct = await checkNetwork(expectedChainId);
        setIsCorrectNetwork(correct);
      }
    };
    check();
  }, [chainId, expectedChainId, isConnected]);

  if (!isConnected) return null;

  const network = chainId ? NETWORKS[chainId] : null;

  return (
    <div className={`
      px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2
      ${isCorrectNetwork
        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}
    `}>
      <div className={`w-2 h-2 rounded-full ${isCorrectNetwork ? 'bg-green-500' : 'bg-yellow-500'}`} />
      {network?.name || 'Unknown Network'}
    </div>
  );
}
