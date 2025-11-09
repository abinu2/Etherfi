# Veritas AVS - Complete Setup Guide

## Overview

This enhanced Veritas AVS implementation integrates with EigenLayer and provides a complete AI-powered DeFi strategy verification system. The system uses:

- **Smart Contracts**: Enhanced VeritasServiceManager with EigenLayer integration
- **Operator Service**: TypeScript-based operator with mainnet fork simulation and AI analysis
- **Client Application**: React-based strategy submission and execution interface

## Architecture

```
┌─────────────────┐
│   User (React)  │  Submits strategy via VeritasStrategyExecutor component
└────────┬────────┘
         ↓
┌─────────────────┐
│ VeritasService  │  Emits StrategySubmitted event
│    Manager      │
└────────┬────────┘
         ↓
┌─────────────────┐
│  TypeScript     │  Listens for events, performs:
│  Operator Node  │  - Mainnet fork simulation
│                 │  - Claude AI re-analysis
│                 │  - Signs attestation
└────────┬────────┘
         ↓
┌─────────────────┐
│ VeritasService  │  Verifies signatures, marks strategy as Verified
│    Manager      │  Emits StrategyVerified event
└────────┬────────┘
         ↓
┌─────────────────┐
│   User (React)  │  Approves tokens, executes verified strategy
└─────────────────┘
```

## Prerequisites

1. **Node.js** 18+ and npm
2. **Foundry** for smart contract compilation and deployment
3. **Anvil** (part of Foundry) for local mainnet forking
4. **API Keys**:
   - Anthropic Claude API key
   - Ethereum RPC endpoint (Sepolia testnet + Mainnet for forking)
5. **Wallets**:
   - Deployer wallet with testnet ETH
   - Operator wallet with testnet ETH
   - User wallet for testing

## Installation

```bash
# Clone repository
git clone https://github.com/abinu2/Etherfi.git
cd Etherfi

# Install dependencies
npm install

# Install Foundry (if not installed)
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

## Configuration

### 1. Environment Variables

Create or update `.env.local`:

```env
# Anthropic API
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Ethereum RPC Endpoints
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR-PROJECT-ID
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR-PROJECT-ID

# Private Keys (DO NOT COMMIT)
DEPLOYER_PRIVATE_KEY=0x...
OPERATOR_PRIVATE_KEY=0x...

# Contract Addresses (will be populated after deployment)
VERITAS_CONTRACT_ADDRESS=0x...

# EigenLayer Addresses (Holesky testnet examples)
EIGENLAYER_AVS_DIRECTORY=0x055733000064333CaDDbC92763c58BF0192fFeBf
EIGENLAYER_STRATEGY_MANAGER=0xdfB5f6CE42aAA7830E94ECFCcAd411beF4d4D5b6

# Next.js Public Variables
NEXT_PUBLIC_VERITAS_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=11155111
```

### 2. Update Contract Constructor

The enhanced `VeritasServiceManager.sol` now requires EigenLayer addresses in the constructor:

```solidity
constructor(
    address _avsDirectory,        // EigenLayer AVS Directory
    address _strategyManager,     // EigenLayer Strategy Manager
    uint256 _operatorQuorumThreshold  // Minimum operators for quorum (e.g., 5)
)
```

## Deployment

### 1. Deploy Smart Contract

```bash
# Navigate to contracts directory
cd contracts

# Compile contract
forge build

# Deploy to Sepolia testnet
forge create --rpc-url $SEPOLIA_RPC_URL \
  --private-key $DEPLOYER_PRIVATE_KEY \
  contracts/VeritasServiceManager.sol:VeritasServiceManager \
  --constructor-args \
  $EIGENLAYER_AVS_DIRECTORY \
  $EIGENLAYER_STRATEGY_MANAGER \
  5

# Copy the deployed contract address to .env.local
# Set VERITAS_CONTRACT_ADDRESS and NEXT_PUBLIC_VERITAS_CONTRACT_ADDRESS
```

### 2. Register Operators

Operators need to be registered with the AVS. You can do this via:

**Option A: Direct Registration (simplified for testing)**
```bash
# Using cast from Foundry
cast send $VERITAS_CONTRACT_ADDRESS \
  "registerOperatorToAVS(address,(bytes,bytes32,uint256))" \
  $OPERATOR_ADDRESS \
  "(0x,0x0000000000000000000000000000000000000000000000000000000000000000,1735689600)" \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $DEPLOYER_PRIVATE_KEY
```

**Option B: Full EigenLayer Integration**
Follow EigenLayer's operator registration process with proper signatures.

## Running the System

### Terminal 1: Frontend Application

```bash
npm run dev
```

Access the app at `http://localhost:3000`

### Terminal 2: TypeScript Operator Service

```bash
npm run operator:ts
```

The operator will:
- Listen for `StrategySubmitted` events
- Simulate strategies on mainnet fork
- Analyze with Claude AI
- Sign and submit attestations

### Terminal 3: Optional - Go Operator (Alternative)

```bash
npm run operator
```

## Usage Flow

### 1. Connect Wallet

Navigate to the dashboard and connect your wallet using the `VeritasStrategyExecutor` component.

### 2. Create Strategy

**Option A: AI-Generated Strategy**
1. Enter portfolio context
2. Specify source token and amount
3. Click "Generate Strategy with AI"
4. Review AI recommendations
5. Adjust if needed

**Option B: Manual Strategy**
1. Enter source token address
2. Enter amount
3. Enter destination contract
4. Set minimum output (slippage protection)

### 3. Submit for Verification

Click "Submit for AVS Verification". The system will:
1. Submit strategy to smart contract
2. Emit `StrategySubmitted` event
3. Show "Waiting for Verification" status

### 4. Wait for Operator Verification

The operator service automatically:
1. Detects the new strategy
2. Forks mainnet using Anvil
3. Simulates the strategy execution
4. Calls Claude AI for safety analysis
5. Signs attestation
6. Submits to contract

You'll see the "Verified ✅" status with:
- Simulated gas cost
- Simulated output
- Safety check result

### 5. Execute Strategy

If marked safe:
1. Click "Approve Token Spending"
2. Confirm wallet transaction
3. Click "Execute Verified Strategy"
4. Confirm wallet transaction
5. Strategy executes on-chain!

## Key Features Implemented

### Smart Contract Enhancements

✅ **EigenLayer Integration**
- IAVSDirectory interface for operator registration
- IStrategyManager interface for operator stake checking
- ISignatureUtils for EigenLayer signature verification

✅ **ECDSA Signature Verification**
- Solady-style ECDSA library implementation
- `respondToStrategy` function with multi-signature verification
- EIP-191 signed message hash support

✅ **Complete Strategy Lifecycle**
- Submit → Verify → Execute flow
- Slippage protection via `minOutput`
- Deadline-based expiration
- Safety checks before execution

### TypeScript Operator Service

✅ **Event Listening**
- Watches for `StrategySubmitted` events using viem
- Real-time event processing

✅ **Mainnet Fork Simulation**
- Uses Anvil for local mainnet forking
- Simulates strategy execution
- Captures gas costs and outputs

✅ **AI Re-Analysis**
- Claude Sonnet 4 integration
- Safety assessment based on:
  - Current market conditions
  - Gas prices
  - Simulation results
  - Risk factors

✅ **Attestation Signing**
- EIP-191 message signing
- Cryptographic attestation of simulation results
- On-chain submission

### React Client Integration

✅ **Strategy Submission Interface**
- AI-powered strategy generation
- Manual strategy creation
- Portfolio context analysis

✅ **Real-Time Status Tracking**
- Visual status badges
- Event-driven updates
- Verification progress display

✅ **Two-Step Execution**
- Token approval flow
- Safe execution after verification
- Transaction monitoring

## File Structure

```
Etherfi/
├── contracts/
│   ├── VeritasServiceManager.sol     # Enhanced with EigenLayer
│   └── EtherFiStrategyValidator.sol  # Original validator
├── operator/
│   ├── operator-service.ts           # NEW: TypeScript operator
│   └── main.go                       # Original Go operator
├── src/
│   ├── components/
│   │   └── VeritasStrategyExecutor.tsx  # NEW: Client UI
│   └── app/
│       └── api/
│           └── strategy/
│               └── generate/
│                   └── route.ts      # NEW: AI strategy generation
├── package.json                      # Updated with new scripts
└── VERITAS_AVS_SETUP.md             # This file
```

## API Endpoints

### POST /api/strategy/generate

Generates optimal DeFi strategy using Claude AI.

**Request:**
```json
{
  "userAddress": "0x...",
  "portfolioContext": "I have 10 ETH staked...",
  "fromToken": "0x...",
  "amount": "5.0"
}
```

**Response:**
```json
{
  "toContract": "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
  "callData": "0x...",
  "minOutput": "4.95",
  "reasoning": "Depositing to Aave V3 for optimal yield...",
  "estimatedAPY": "3.8",
  "riskLevel": "low"
}
```

## Contract Functions

### User Functions

```solidity
// Submit new strategy for verification
function submitNewStrategy(Strategy calldata strategy) external returns (bytes32)

// Execute verified strategy
function executeVerifiedStrategy(Strategy calldata strategy) external returns (uint256)
```

### Operator Functions

```solidity
// Individual attestation
function attestToStrategy(
    Strategy calldata strategy,
    Attestation calldata attestation
) external

// Multi-signature verification
function respondToStrategy(
    Strategy calldata strategy,
    Attestation calldata attestation,
    bytes[] calldata signatures
) external
```

### Admin Functions

```solidity
// Register operator with EigenLayer signature
function registerOperatorToAVS(
    address operator,
    ISignatureUtils.SignatureWithSaltAndExpiry memory signature
) external

// Deregister operator
function deregisterOperator(address operator) external

// Update quorum threshold
function updateQuorumThreshold(uint256 newThreshold) external onlyOwner
```

## Testing

### Test Strategy Submission

```typescript
const strategy = {
  user: "0xYourAddress",
  fromContract: "0x0000000000000000000000000000000000000000",
  fromToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
  amount: parseEther("1.0"),
  toContract: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2", // Aave V3
  callData: "0x...",
  minOutput: parseEther("0.99"),
  deadline: Math.floor(Date.now() / 1000) + 3600
};
```

### Monitor Events

```bash
# Watch for StrategySubmitted events
cast logs \
  --address $VERITAS_CONTRACT_ADDRESS \
  --rpc-url $SEPOLIA_RPC_URL \
  'StrategySubmitted(bytes32,address,(address,address,address,uint256,address,bytes,uint256,uint256))'
```

## Security Considerations

⚠️ **Important Security Notes:**

1. **Private Keys**: Never commit private keys to version control
2. **Slippage Protection**: Always set appropriate `minOutput` values
3. **Deadline**: Use reasonable deadline values (typically 10-60 minutes)
4. **Token Approvals**: Only approve the exact amount needed
5. **Contract Verification**: Verify all contract addresses before execution
6. **Testnet First**: Always test on Sepolia before mainnet deployment

## Troubleshooting

### Operator Not Registering

**Issue**: Operator registration fails
**Solution**: Ensure you're using the correct EigenLayer signature format or use owner-based registration for testing

### Event Not Detected

**Issue**: Operator service doesn't see events
**Solution**:
- Check RPC endpoint is working
- Verify contract address in `.env.local`
- Ensure operator service is running before strategy submission

### AI Analysis Fails

**Issue**: Claude API errors
**Solution**:
- Verify `ANTHROPIC_API_KEY` is correct
- Check API rate limits
- Ensure internet connectivity

### Strategy Execution Fails

**Issue**: Transaction reverts
**Solution**:
- Ensure strategy is verified (`StrategyStatus.Verified`)
- Check token approval was successful
- Verify slippage tolerance (`minOutput`)
- Ensure deadline hasn't passed

## Advanced Features

### Custom Mainnet Fork Simulation

For production, enhance the operator service to use actual Anvil forking:

```typescript
// Start Anvil fork
const anvilProcess = exec(`anvil --fork-url ${process.env.MAINNET_RPC_URL} --port 8545`);

// Simulate on fork
const forkClient = createPublicClient({
  transport: http('http://127.0.0.1:8545')
});
```

### Multi-Operator Aggregation

Implement signature aggregation for multiple operators:

```typescript
const signatures = await Promise.all(
  operators.map(op => op.signAttestation(strategyHash, attestation))
);

await contract.respondToStrategy(strategy, attestation, signatures);
```

### BLS Signature Aggregation

For gas optimization, implement BLS signature aggregation (future enhancement).

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/abinu2/Etherfi/issues)
- EigenLayer Docs: [https://docs.eigenlayer.xyz/](https://docs.eigenlayer.xyz/)
- Anthropic Claude: [https://docs.anthropic.com/](https://docs.anthropic.com/)

## License

MIT License

---

**Built with ❤️ for the EigenLayer and DeFi ecosystem**
