'use client';

import { useEffect, useState } from 'react';

interface NetworkStatusProps {
  showGasPrice?: boolean;
  compact?: boolean;
}

export default function NetworkStatus({ showGasPrice = true, compact = false }: NetworkStatusProps) {
  const [gasPrice, setGasPrice] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          setIsConnected(accounts.length > 0);

          const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
          setChainId(parseInt(chainIdHex, 16));
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };

    const fetchGasPrice = async () => {
      if (!showGasPrice) return;

      try {
        const response = await fetch('/api/gas');
        const data = await response.json();
        if (data.success) {
          setGasPrice(data.data.current);
        }
      } catch (error) {
        console.error('Error fetching gas price:', error);
      }
    };

    checkConnection();
    fetchGasPrice();

    const interval = setInterval(fetchGasPrice, 15000);
    return () => clearInterval(interval);
  }, [showGasPrice]);

  const getChainName = (chainId: number | null) => {
    switch (chainId) {
      case 1: return 'Ethereum';
      case 11155111: return 'Sepolia';
      case 5: return 'Goerli';
      default: return 'Unknown';
    }
  };

  const getGasColor = (price: number) => {
    if (price < 20) return 'text-green-500';
    if (price < 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
        {showGasPrice && gasPrice && (
          <span className={`font-mono ${getGasColor(gasPrice)}`}>
            {gasPrice} gwei
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
          }`}
          title={isConnected ? 'Connected' : 'Disconnected'}
        />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {getChainName(chainId)}
        </span>
      </div>

      {/* Divider */}
      {showGasPrice && <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />}

      {/* Gas Price */}
      {showGasPrice && (
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          {gasPrice ? (
            <span className={`text-sm font-mono font-semibold ${getGasColor(gasPrice)}`}>
              {gasPrice} gwei
            </span>
          ) : (
            <span className="text-sm text-gray-400">--</span>
          )}
        </div>
      )}
    </div>
  );
}
