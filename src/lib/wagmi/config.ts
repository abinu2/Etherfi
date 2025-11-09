import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(process.env.NEXT_PUBLIC_RPC_MAIN || process.env.NEXT_PUBLIC_RPC_URL || 'https://eth.llamarpc.com'),
    [sepolia.id]: http(),
  },
});
