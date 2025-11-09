'use client';

import { useEffect, useState } from 'react';

interface NetworkStatusProps {
  showGasPrice?: boolean;
  showEthPrice?: boolean;
  compact?: boolean;
}

export default function NetworkStatus({
  showGasPrice = true,
  showEthPrice = true,
  compact = false
}: NetworkStatusProps) {
  const [gasPrice, setGasPrice] = useState<number | null>(null);
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [ethPriceChange, setEthPriceChange] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

    const fetchEthPrice = async () => {
      if (!showEthPrice) return;

      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true');
        const data = await response.json();
        if (data.ethereum) {
          setEthPrice(data.ethereum.usd);
          setEthPriceChange(data.ethereum.usd_24h_change || 0);
        }
      } catch (error) {
        console.error('Error fetching ETH price:', error);
        // Fallback to API
        try {
          const marketResponse = await fetch('/api/market');
          const marketData = await marketResponse.json();
          if (marketData.success) {
            setEthPrice(marketData.market.ethPrice);
          }
        } catch {
          setEthPrice(3500); // Ultimate fallback
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
    fetchGasPrice();
    fetchEthPrice();

    // Update gas price every 15 seconds
    const gasInterval = setInterval(fetchGasPrice, 15000);
    // Update ETH price every 30 seconds
    const priceInterval = setInterval(fetchEthPrice, 30000);

    return () => {
      clearInterval(gasInterval);
      clearInterval(priceInterval);
    };
  }, [showGasPrice, showEthPrice]);

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
        {showEthPrice && ethPrice && (
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            ${ethPrice.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </span>
        )}
        {showGasPrice && gasPrice && (
          <span className={`font-mono ${getGasColor(gasPrice)}`}>
            {gasPrice}gwei
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

      {/* ETH Price */}
      {showEthPrice && (
        <>
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-500"
              viewBox="0 0 320 512"
              fill="currentColor"
            >
              <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"/>
            </svg>
            {ethPrice ? (
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  ${ethPrice.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
                {ethPriceChange !== 0 && (
                  <span className={`text-xs font-medium ${ethPriceChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {ethPriceChange >= 0 ? '↗' : '↘'} {Math.abs(ethPriceChange).toFixed(2)}%
                  </span>
                )}
              </div>
            ) : isLoading ? (
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            ) : (
              <span className="text-sm text-gray-400">--</span>
            )}
          </div>
        </>
      )}

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
          ) : isLoading ? (
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
          ) : (
            <span className="text-sm text-gray-400">--</span>
          )}
        </div>
      )}
    </div>
  );
}
