import { ethers } from 'ethers';
import { ETHERFI_CONTRACTS, NETWORK_CONFIG } from './constants';

/**
 * EtherFi Liquidity Pool ABI (simplified - add full ABI as needed)
 */
const LIQUIDITY_POOL_ABI = [
  'function deposit() payable returns (uint256)',
  'function withdraw(uint256 amount) returns (uint256)',
  'function totalValueOutOfLp() view returns (uint256)',
  'function getTotalPooledEther() view returns (uint256)',
];

/**
 * eETH Token ABI (ERC20)
 */
const EETH_TOKEN_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
];

/**
 * Get ethers provider
 */
export function getProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(NETWORK_CONFIG.rpcUrl);
}

/**
 * Get eETH token contract instance
 */
export function getEETHContract(
  signerOrProvider?: ethers.Signer | ethers.Provider
): ethers.Contract {
  const provider = signerOrProvider || getProvider();
  return new ethers.Contract(ETHERFI_CONTRACTS.EETH_TOKEN, EETH_TOKEN_ABI, provider);
}

/**
 * Get EtherFi Liquidity Pool contract instance
 */
export function getLiquidityPoolContract(
  signerOrProvider?: ethers.Signer | ethers.Provider
): ethers.Contract {
  const provider = signerOrProvider || getProvider();
  return new ethers.Contract(
    ETHERFI_CONTRACTS.LIQUIDITY_POOL,
    LIQUIDITY_POOL_ABI,
    provider
  );
}

/**
 * Get eETH balance for an address
 */
export async function getEETHBalance(address: string): Promise<string> {
  try {
    const contract = getEETHContract();
    const balance = await contract.balanceOf(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error fetching eETH balance:', error);
    throw new Error('Failed to fetch eETH balance');
  }
}

/**
 * Get current gas price in gwei
 */
export async function getCurrentGasPrice(): Promise<number> {
  try {
    const provider = getProvider();
    const feeData = await provider.getFeeData();
    if (feeData.gasPrice) {
      return Number(ethers.formatUnits(feeData.gasPrice, 'gwei'));
    }
    return 0;
  } catch (error) {
    console.error('Error fetching gas price:', error);
    throw new Error('Failed to fetch gas price');
  }
}

/**
 * Estimate gas for a transaction
 */
export async function estimateGas(
  to: string,
  data: string,
  value?: bigint
): Promise<bigint> {
  try {
    const provider = getProvider();
    return await provider.estimateGas({ to, data, value });
  } catch (error) {
    console.error('Error estimating gas:', error);
    throw new Error('Failed to estimate gas');
  }
}

/**
 * Get ETH to USD price (placeholder - integrate with price oracle)
 */
export async function getETHPrice(): Promise<number> {
  // TODO: Integrate with Chainlink or other price oracle
  // For now, returning a placeholder value
  return 3000; // $3000 per ETH
}

/**
 * Error handling utilities for Ethereum transactions
 */

interface EthereumError extends Error {
  code?: number | string;
  reason?: string;
  action?: string;
  transaction?: any;
}

/**
 * Handle and format Ethereum/Web3 errors into user-friendly messages
 */
export function handleEthereumError(error: EthereumError): string {
  // User rejected transaction
  if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
    return 'Transaction rejected by user';
  }

  // Insufficient funds
  if (error.code === -32000 || error.message?.includes('insufficient funds')) {
    return 'Insufficient funds to complete this transaction. Please check your wallet balance.';
  }

  // Gas estimation error
  if (error.message?.includes('gas') || error.message?.includes('Gas')) {
    if (error.message?.includes('exceeds block gas limit')) {
      return 'Transaction requires too much gas. The operation may be too complex.';
    }
    if (error.message?.includes('gas too low')) {
      return 'Gas price too low. Please increase gas price and try again.';
    }
    return 'Gas estimation failed. The transaction may fail or the contract may have an error.';
  }

  // Network errors
  if (error.message?.includes('network') || error.message?.includes('Network')) {
    return 'Network error. Please check your connection and try again.';
  }

  // Nonce errors
  if (error.message?.includes('nonce')) {
    return 'Transaction nonce error. Please reset your wallet or try again.';
  }

  // Contract errors
  if (error.reason) {
    return `Contract error: ${error.reason}`;
  }

  // Timeout
  if (error.message?.includes('timeout')) {
    return 'Transaction timeout. The network may be congested. Please try again.';
  }

  // Wrong network
  if (error.message?.includes('chain') || error.message?.includes('network')) {
    return 'Wrong network. Please switch to the correct network.';
  }

  // Generic error
  return error.message || 'An unknown error occurred. Please try again.';
}

/**
 * Check if user is on correct network
 */
export async function checkNetwork(expectedChainId: number): Promise<boolean> {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('No wallet provider found');
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    return Number(network.chainId) === expectedChainId;
  } catch (error) {
    console.error('Error checking network:', error);
    return false;
  }
}

/**
 * Format transaction hash for display
 */
export function formatTxHash(hash: string): string {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

/**
 * Get Etherscan URL for transaction
 */
export function getEtherscanTxUrl(txHash: string, chainId: number = 1): string {
  const baseUrls: { [key: number]: string } = {
    1: 'https://etherscan.io',
    11155111: 'https://sepolia.etherscan.io',
    5: 'https://goerli.etherscan.io',
    137: 'https://polygonscan.com',
    80001: 'https://mumbai.polygonscan.com'
  };

  const baseUrl = baseUrls[chainId] || 'https://etherscan.io';
  return `${baseUrl}/tx/${txHash}`;
}

/**
 * Get Etherscan URL for address
 */
export function getEtherscanAddressUrl(address: string, chainId: number = 1): string {
  const baseUrls: { [key: number]: string } = {
    1: 'https://etherscan.io',
    11155111: 'https://sepolia.etherscan.io',
    5: 'https://goerli.etherscan.io',
    137: 'https://polygonscan.com',
    80001: 'https://mumbai.polygonscan.com'
  };

  const baseUrl = baseUrls[chainId] || 'https://etherscan.io';
  return `${baseUrl}/address/${address}`;
}

/**
 * Wait for transaction with timeout
 */
export async function waitForTransaction(
  txHash: string,
  confirmations: number = 1,
  timeout: number = 60000 // 1 minute default
): Promise<ethers.TransactionReceipt> {
  const provider = getProvider();

  return Promise.race([
    provider.waitForTransaction(txHash, confirmations),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Transaction confirmation timeout')), timeout)
    )
  ]) as Promise<ethers.TransactionReceipt>;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
