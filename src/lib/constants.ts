/**
 * EtherFi smart contract addresses on Ethereum Mainnet
 */
export const ETHERFI_CONTRACTS = {
  LIQUIDITY_POOL: process.env.NEXT_PUBLIC_ETHERFI_LIQUIDITY_POOL as string,
  EETH_TOKEN: process.env.NEXT_PUBLIC_EETH_TOKEN as string,
} as const;

/**
 * Ethereum network configuration
 */
export const NETWORK_CONFIG = {
  chainId: 1, // Ethereum Mainnet
  chainName: 'Ethereum',
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL as string,
} as const;

/**
 * Gas price thresholds in gwei for categorizing transaction costs
 */
export const GAS_THRESHOLDS = {
  CHEAP: 20,      // gwei - Good time to transact
  MODERATE: 40,   // gwei - Average gas prices
  EXPENSIVE: 60,  // gwei - Consider waiting for lower prices
} as const;

/**
 * EtherFi staking APY rates
 */
export const ETHERFI_APY = {
  BASE: 3.8,      // Base staking APY (%)
  OPTIMAL: 6.2,   // Optimized strategy APY (%)
} as const;
