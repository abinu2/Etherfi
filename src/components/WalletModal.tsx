'use client';

import { useState } from 'react';
import { useWallet, WalletProvider } from '@/hooks/useWallet';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect?: (address: string) => void;
}

export default function WalletModal({ isOpen, onClose, onConnect }: WalletModalProps) {
  const { connect, isConnecting, error } = useWallet();
  const [selectedWallet, setSelectedWallet] = useState<WalletProvider>(null);

  if (!isOpen) return null;

  const handleConnect = async (walletType: WalletProvider) => {
    setSelectedWallet(walletType);
    try {
      const address = await connect(walletType);
      if (address) {
        onConnect?.(address);
        onClose();
      }
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const wallets = [
    {
      id: 'metamask' as WalletProvider,
      name: 'MetaMask',
      description: 'Connect using MetaMask browser extension',
      icon: '🦊',
      available: typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
    },
    {
      id: 'coinbase' as WalletProvider,
      name: 'Coinbase Wallet',
      description: 'Connect using Coinbase Wallet',
      icon: '🔵',
      available: false,
      comingSoon: true
    },
    {
      id: 'walletconnect' as WalletProvider,
      name: 'WalletConnect',
      description: 'Connect using WalletConnect protocol',
      icon: '🔗',
      available: false,
      comingSoon: true
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Connect Wallet
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleConnect(wallet.id)}
              disabled={!wallet.available || isConnecting}
              className={`
                w-full p-4 rounded-lg border-2 transition-all
                ${wallet.available
                  ? 'border-gray-200 hover:border-blue-500 dark:border-gray-700 dark:hover:border-blue-500 cursor-pointer hover:shadow-md'
                  : 'border-gray-100 dark:border-gray-800 opacity-50 cursor-not-allowed'
                }
                ${selectedWallet === wallet.id && isConnecting ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}
              `}
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">{wallet.icon}</div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {wallet.name}
                    </h3>
                    {wallet.comingSoon && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                        Soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {wallet.description}
                  </p>
                </div>
                {!wallet.available && !wallet.comingSoon && (
                  <div className="text-sm text-red-500">Not installed</div>
                )}
                {selectedWallet === wallet.id && isConnecting && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            By connecting a wallet, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
