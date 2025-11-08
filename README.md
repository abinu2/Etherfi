# EtherFi Strategy Validator AVS

**AI-Powered Staking Strategy Validation via EigenLayer**

An Actively Validated Service (AVS) where operators use Claude AI to validate EtherFi staking strategies and attest to their correctness on-chain.

## 🎯 What is This?

This is a custom AVS built on EigenLayer that validates whether your proposed eETH/weETH reallocation strategies are optimal. Think of it like a decentralized AI advisory service secured by restaked ETH.

## 🏗️ Architecture

```
┌─────────────────┐
│   User          │  Submits strategy for validation
└────────┬────────┘
         ↓
┌─────────────────┐
│ Task Generator  │  Creates validation task on-chain
└────────┬────────┘
         ↓
┌─────────────────┐
│  AVS Contract   │  Emits NewValidationTask event
└────────┬────────┘
         ↓
┌─────────────────┐
│  Operators      │  Listen for tasks, validate with Claude AI
└────────┬────────┘
         ↓
┌─────────────────┐
│  Aggregator     │  Collects operator signatures
└────────┬────────┘
         ↓
┌─────────────────┐
│  AVS Contract   │  Verifies signatures, stores result
└─────────────────┘
```

## 📦 Components

### 1. Smart Contracts (`contracts/`)
- **EtherFiStrategyValidator.sol**: Main AVS contract
  - Task submission and storage
  - Operator registration
  - Validation result verification

### 2. Task Generator (`task-generator/`)
- Node.js service that submits validation tasks to the AVS contract
- Fetches portfolio data and proposed strategies
- Emits on-chain events for operators

### 3. Operator Node (`operator/`)
- Go service that listens for validation tasks
- Integrates with Claude Sonnet 4 AI for strategy analysis
- Signs validation results with operator's private key

### 4. Aggregator (`aggregator/`)
- Go service that collects operator signatures
- Combines results and submits to AVS contract
- Enforces quorum requirements

### 5. Frontend (`src/`)
- Next.js 14 dashboard for submitting strategies
- View validation results with confidence scores
- Real-time gas monitoring

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Go 1.21+
- Foundry (for smart contracts)
- MetaMask or compatible wallet
- Anthropic API key
- Ethereum testnet RPC (Sepolia)

### Installation

```bash
# Clone repository
git clone https://github.com/abinu2/CBC-Hackathon-Etherfi.git
cd CBC-Hackathon-Etherfi

# Install frontend dependencies
npm install

# Install Go dependencies for operator
cd operator && go mod download && cd ..

# Install Go dependencies for aggregator
cd aggregator && go mod download && cd ..
```

### Configuration

1. **Copy environment file:**
```bash
cp .env.example .env.local
```

2. **Configure `.env.local`:**
```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR-KEY
NEXT_PUBLIC_AVS_CONTRACT_ADDRESS=0x... # After deployment
PRIVATE_KEY=0x...
OPERATOR_PRIVATE_KEY=0x...
AGGREGATOR_PRIVATE_KEY=0x...
```

### Deploy Smart Contract

```bash
cd contracts

# Install Foundry if not installed
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Compile contract
forge build

# Deploy to Sepolia
forge create --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  EtherFiStrategyValidator \
  --constructor-args $AGGREGATOR_ADDRESS

# Copy deployed address to .env.local
```

### Run the AVS

**Terminal 1 - Frontend:**
```bash
npm run dev
# Open http://localhost:3000
```

**Terminal 2 - Operator:**
```bash
cd operator
go run main.go
```

**Terminal 3 - Aggregator:**
```bash
cd aggregator
go run main.go
```

**Terminal 4 - Task Generator (optional manual testing):**
```bash
npm run task-generator
```

## 📋 Usage Flow

1. **Connect Wallet**: Connect MetaMask to Sepolia testnet
2. **Submit Strategy**: Enter your portfolio and proposed strategy
3. **Wait for Validation**: Operators analyze with Claude AI (~30-60 seconds)
4. **View Results**: See confidence scores, risks, and alternative recommendations

## 🔧 Development

### Project Structure
```
etherfi-avs-validator/
├── contracts/              # Solidity smart contracts
│   ├── EtherFiStrategyValidator.sol
│   └── foundry.toml
├── task-generator/         # Node.js task submission service
│   └── index.js
├── operator/               # Go operator node with Claude AI
│   ├── main.go
│   └── go.mod
├── aggregator/             # Go signature aggregator
│   ├── main.go
│   └── go.mod
├── src/                    # Next.js frontend
│   ├── app/
│   │   ├── page.tsx
│   │   └── dashboard/
│   ├── components/
│   │   ├── ValidationTaskSubmitter.tsx
│   │   ├── ValidationResults.tsx
│   │   ├── WalletConnect.tsx
│   │   └── GasMonitor.tsx
│   └── lib/
├── package.json
└── README.md
```

### Tech Stack
- **Smart Contracts**: Solidity 0.8.19, Foundry
- **Operator/Aggregator**: Go 1.21, go-ethereum
- **AI**: Claude Sonnet 4 via Anthropic API
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Blockchain**: Ethereum Sepolia, ethers.js

## 🎯 MVP Features

✅ Task submission from frontend
✅ Operator listening and Claude AI validation
✅ Simple signature aggregation
✅ On-chain result verification
✅ Confidence scores and risk assessment

## 🚧 Future Enhancements

- [ ] BLS signature aggregation (currently ECDSA)
- [ ] Full EigenLayer integration
- [ ] Multiple operator support with quorum
- [ ] Slashing mechanisms
- [ ] Mainnet deployment
- [ ] Historical validation dashboard

## 📊 Sample Validation

**Input:**
```json
{
  "eethBalance": "5.2",
  "convertAmount": "2.0",
  "action": "CONVERT_TO_WEETH"
}
```

**Output:**
```json
{
  "isValid": true,
  "confidenceScore": 85,
  "risks": ["High gas costs", "Market volatility"],
  "alternativeStrategy": "Wait for gas below 30 gwei"
}
```

## 🔒 Security

- Private keys must NEVER be committed
- Use separate keys for task generator, operator, and aggregator
- Test on Sepolia before mainnet
- Audit smart contracts before production

## 📝 License

MIT License

## 🙋 Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/abinu2/CBC-Hackathon-Etherfi/issues)
- EigenLayer Docs: [https://docs.eigenlayer.xyz/](https://docs.eigenlayer.xyz/)

## 🎉 Acknowledgments

- EigenLayer AVS Framework
- Anthropic Claude AI
- EtherFi Protocol
- Next.js & Vercel

---

**Built for CBC Hackathon** 🚀
