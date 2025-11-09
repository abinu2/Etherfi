'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

export type WalletProvider = 'metamask' | 'walletconnect' | 'coinbase' | null;

interface WalletState {
  address: string | null;
  balance: string | null;
  chainId: number | null;
  provider: WalletProvider;
  isConnecting: boolean;
  error: string | null;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    balance: null,
    chainId: null,
    provider: null,
    isConnecting: false,
    error: null
  });

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();

          if (accounts.length > 0) {
            const network = await provider.getNetwork();
            const balance = await provider.getBalance(accounts[0].address);

            setState({
              address: accounts[0].address,
              balance: ethers.formatEther(balance),
              chainId: Number(network.chainId),
              provider: 'metamask', // Default assumption
              isConnecting: false,
              error: null
            });
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          setState(prev => ({
            ...prev,
            address: null,
            balance: null,
            chainId: null,
            provider: null
          }));
        } else {
          // User switched accounts
          const provider = new ethers.BrowserProvider(window.ethereum);
          const balance = await provider.getBalance(accounts[0]);

          setState(prev => ({
            ...prev,
            address: accounts[0],
            balance: ethers.formatEther(balance)
          }));
        }
      };

      const handleChainChanged = (chainId: string) => {
        setState(prev => ({
          ...prev,
          chainId: parseInt(chainId, 16)
        }));
        // Reload to avoid any state issues
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const connect = useCallback(async (walletType: WalletProvider = 'metamask') => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      if (walletType === 'metamask') {
        if (typeof window.ethereum === 'undefined') {
          throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        const network = await provider.getNetwork();
        const balance = await provider.getBalance(accounts[0]);

        setState({
          address: accounts[0],
          balance: ethers.formatEther(balance),
          chainId: Number(network.chainId),
          provider: 'metamask',
          isConnecting: false,
          error: null
        });

        return accounts[0];
      } else if (walletType === 'coinbase') {
        // Placeholder for Coinbase Wallet integration
        throw new Error('Coinbase Wallet support coming soon');
      } else if (walletType === 'walletconnect') {
        // Placeholder for WalletConnect integration
        throw new Error('WalletConnect support coming soon');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to connect wallet';
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: errorMessage
      }));
      throw new Error(errorMessage);
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({
      address: null,
      balance: null,
      chainId: null,
      provider: null,
      isConnecting: false,
      error: null
    });
  }, []);

  const switchNetwork = useCallback(async (chainId: number) => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('No wallet provider found');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (error.code === 4902) {
        throw new Error('Network not added to wallet. Please add it manually.');
      }
      throw error;
    }
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!state.address || typeof window.ethereum === 'undefined') return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(state.address);
      setState(prev => ({
        ...prev,
        balance: ethers.formatEther(balance)
      }));
    } catch (error) {
      console.error('Error refreshing balance:', error);
    }
  }, [state.address]);

  return {
    ...state,
    connect,
    disconnect,
    switchNetwork,
    refreshBalance,
    isConnected: !!state.address
  };
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
