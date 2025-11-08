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
