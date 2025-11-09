'use client';

import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { handleEthereumError } from '@/lib/ethereum';

interface ContractState {
  isLoading: boolean;
  error: string | null;
  txHash: string | null;
}

export function useContract(contractAddress: string, abi: any[]) {
  const [state, setState] = useState<ContractState>({
    isLoading: false,
    error: null,
    txHash: null
  });

  const getContract = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('No wallet provider found');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, abi, signer);
  }, [contractAddress, abi]);

  const call = useCallback(async (method: string, ...args: any[]) => {
    setState({ isLoading: true, error: null, txHash: null });

    try {
      const contract = await getContract();
      const result = await contract[method](...args);
      setState({ isLoading: false, error: null, txHash: null });
      return result;
    } catch (error: any) {
      const errorMessage = handleEthereumError(error);
      setState({ isLoading: false, error: errorMessage, txHash: null });
      throw new Error(errorMessage);
    }
  }, [getContract]);

  const send = useCallback(async (method: string, ...args: any[]) => {
    setState({ isLoading: true, error: null, txHash: null });

    try {
      const contract = await getContract();
      const tx = await contract[method](...args);

      setState(prev => ({ ...prev, txHash: tx.hash }));

      const receipt = await tx.wait();

      setState({ isLoading: false, error: null, txHash: receipt.hash });

      return { transaction: tx, receipt };
    } catch (error: any) {
      const errorMessage = handleEthereumError(error);
      setState({ isLoading: false, error: errorMessage, txHash: null });
      throw new Error(errorMessage);
    }
  }, [getContract]);

  const estimateGas = useCallback(async (method: string, ...args: any[]): Promise<bigint> => {
    try {
      const contract = await getContract();
      const gasEstimate = await contract[method].estimateGas(...args);
      return gasEstimate;
    } catch (error: any) {
      const errorMessage = handleEthereumError(error);
      throw new Error(errorMessage);
    }
  }, [getContract]);

  const getGasPrice = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('No wallet provider found');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const feeData = await provider.getFeeData();

    return {
      gasPrice: feeData.gasPrice,
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
    };
  }, []);

  const estimateTotalCost = useCallback(async (
    method: string,
    ...args: any[]
  ): Promise<{ gasCost: bigint; gasCostUSD: number }> => {
    try {
      const gasEstimate = await estimateGas(method, ...args);
      const { gasPrice } = await getGasPrice();

      if (!gasPrice) {
        throw new Error('Could not fetch gas price');
      }

      const gasCost = gasEstimate * gasPrice;

      // Rough ETH price estimate (in production, fetch from an API)
      const ethPriceUSD = 2000;
      const gasCostUSD = parseFloat(ethers.formatEther(gasCost)) * ethPriceUSD;

      return { gasCost, gasCostUSD };
    } catch (error: any) {
      const errorMessage = handleEthereumError(error);
      throw new Error(errorMessage);
    }
  }, [estimateGas, getGasPrice]);

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, txHash: null });
  }, []);

  return {
    ...state,
    call,
    send,
    estimateGas,
    getGasPrice,
    estimateTotalCost,
    reset
  };
}
