'use client';

import { useState, useEffect } from 'react';

interface WalletConnectProps {
  onConnect?: (address: string) => void;
}

export default function WalletConnect({ onConnect }: WalletConnectProps) {
  const [address, setAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check if already connected
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            onConnect?.(accounts[0]);
          }
        });
    }
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);

    try {
      if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask');
        setIsConnecting(false);
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setAddress(accounts[0]);
        onConnect?.(accounts[0]);
      }
    } catch (error) {
      console.error('Connection error:', error);
      alert('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  if (address) {
    return (
      <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
        <p className="text-xs font-medium">Connected</p>
        <p className="text-sm font-mono">
          {address.slice(0, 6)}...{address.slice(-4)}
        </p>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
