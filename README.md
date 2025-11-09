# Lumina Finance ✨

> **Illuminate Your DeFi Journey with AI-Powered Strategy Validation**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Claude AI](https://img.shields.io/badge/Claude-Sonnet_4-8b5cf6?style=for-the-badge)](https://www.anthropic.com/)
[![EigenLayer](https://img.shields.io/badge/EigenLayer-AVS-10b981?style=for-the-badge)](https://www.eigenlayer.xyz/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

Lumina Finance is an intelligent DeFi strategy platform combining cutting-edge AI validation through EigenLayer AVS (Actively Validated Services) with an innovative **Strategy DNA™** profiling system. Built for the modern DeFi investor who demands both security and sophistication.

---

## 🌟 What Makes Lumina Unique

### 🔐 Veritas AVS - AI-Powered Strategy Validation
Built on EigenLayer's AVS framework, Lumina leverages a decentralized network of operators running **Claude Sonnet 4** to validate DeFi strategies before execution:
- **Pre-execution Validation**: Submit strategies for AI analysis before risking capital
- **Decentralized Consensus**: Multiple operators attest to strategy safety
- **Real-time Risk Assessment**: Identify vulnerabilities, market risks, and gas inefficiencies
- **Alternative Recommendations**: Get optimized strategy suggestions from AI

### 🧬 Strategy DNA™ Profiling
Unique multi-dimensional strategy analysis system:
- **Yield Score** (1-100): Comprehensive return potential analysis
- **Risk Rating** (A-F): Multi-factor safety assessment
- **Gas Efficiency Tier** (1-5): Cost optimization metrics
- **Time Horizon Matching**: Short/Medium/Long term alignment
- **Compatibility Score**: Personalized user-strategy matching

### 🤖 Architect AI Chatbot
Intelligent assistant with tiered explanations:
- **Beginner Mode**: Simple analogies and educational content
- **Intermediate Mode**: Core mechanics and trade-offs
- **Advanced Mode**: Technical implementation details and smart contract analysis

### 📊 Portfolio Genome Visualization
Visual DNA-style representation of your DeFi portfolio for instant comprehension of complex allocations.

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    Lumina Finance Platform                    │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐         ┌──────────────┐                   │
│  │  Frontend   │────────▶│  Veritas AVS │                   │
│  │  Next.js 14 │         │  Contract    │                   │
│  └─────────────┘         └──────┬───────┘                   │
│                                  │                            │
│                                  │ StrategySubmitted Event   │
│                                  │                            │
│                     ┌────────────▼─────────────┐             │
│                     │   Operator Network       │             │
│                     │   (Claude Sonnet 4 AI)   │             │
│                     └────────────┬─────────────┘             │
│                                  │                            │
│                                  │ Signed Attestations       │
│                                  │                            │
│                     ┌────────────▼─────────────┐             │
│                     │   Signature Aggregation  │             │
│                     └────────────┬─────────────┘             │
│                                  │                            │
│                                  ▼                            │
│                     ┌────────────────────────┐               │
│                     │  On-chain Verification │               │
│                     │  & Execution           │               │
│                     └────────────────────────┘               │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **MetaMask** or compatible Web3 wallet
- **Anthropic API Key** ([Get one here](https://console.anthropic.com/))
- **Ethereum RPC** - Sepolia testnet for development
- *Optional*: Go 1.21+ for running operator nodes

### Installation

```bash
# Clone the repository
git clone https://github.com/abinu2/Etherfi.git
cd Etherfi

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Configuration

Edit `.env.local` with your credentials:

```env
# Anthropic AI
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Blockchain
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR-KEY
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR-KEY

# Contracts
NEXT_PUBLIC_VERITAS_CONTRACT=0x... # Veritas AVS contract address

# Operator (if running operator node)
OPERATOR_PRIVATE_KEY=0x...
VERITAS_CONTRACT_ADDRESS=0x...
```

### Run Development Server

```bash
# Start the Next.js development server
npm run dev

# Open your browser to http://localhost:3000
```

### Optional: Run Operator Node

If you want to participate as an AVS operator:

```bash
# TypeScript operator
npm run operator:ts

# Or Go operator (requires Go 1.21+)
npm run operator
```

---

## 📦 Project Structure

```
lumina-finance/
├── src/
│   ├── app/                      # Next.js 14 App Router
│   │   ├── page.tsx             # Landing page
│   │   ├── dashboard/           # Main dashboard
│   │   ├── demo/                # AVS demo
│   │   ├── api/                 # API routes
│   │   │   ├── analyze/         # Strategy DNA analysis
│   │   │   ├── chat/            # AI chatbot
│   │   │   ├── gas/             # Gas price monitoring
│   │   │   ├── market/          # Market data
│   │   │   └── strategy/        # Strategy generation & validation
│   │   ├── globals.css          # Global styles with custom properties
│   │   └── layout.tsx           # Root layout
│   │
│   ├── components/              # React components
│   │   ├── AIStrategyChat.tsx           # AI chatbot interface
│   │   ├── AnimatedNumber.tsx           # Number animations
│   │   ├── GasMonitor.tsx               # Real-time gas tracking
│   │   ├── LiveValidationSimulator.tsx  # AVS validation demo
│   │   ├── PortfolioGenome.tsx          # Visual portfolio DNA
│   │   ├── Providers.tsx                # Web3 & React Query providers
│   │   ├── SimulatedOperatorNetwork.tsx # Operator network visualization
│   │   ├── StrategyDNACard.tsx          # Strategy DNA display
│   │   ├── StrategyVerificationAVS.tsx  # AVS strategy submission
│   │   ├── VeritasStrategyExecutor.tsx  # Verified strategy execution
│   │   ├── WalletConnect.tsx            # Wallet connection
│   │   └── WalletHoldings.tsx           # Token holdings display
│   │
│   └── lib/                     # Utilities & libraries
│       ├── blockchain/          # Blockchain utilities
│       │   └── token-tracker.ts # Token balance tracking
│       ├── ai/
│       │   └── yield-architect.ts # AI strategy analysis
│       ├── simulatedEigenLayer.ts # AVS simulation for demo
│       └── wagmi.ts             # Wagmi configuration
│
├── operator/                    # AVS Operator Node
│   ├── operator-service.ts      # TypeScript operator implementation
│   └── main.go                  # Go operator implementation
│
├── contracts/                   # Smart Contracts
│   ├── VeritasServiceManager.sol # Main AVS contract
│   └── foundry.toml             # Foundry configuration
│
├── aggregator/                  # Signature Aggregator (Go)
│
├── public/                      # Static assets
│
├── package.json                 # Dependencies & scripts
├── next.config.mjs             # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

---

## 🎯 Key Features

### 1. Strategy Validation AVS

Submit DeFi strategies for decentralized AI validation:

```typescript
// Strategy submission
const strategy = {
  user: address,
  fromContract: aavePoolAddress,
  fromToken: weETHAddress,
  amount: parseEther("1.0"),
  toContract: pendleMarketAddress,
  callData: encodedCallData,
  minOutput: parseEther("0.95"),
  deadline: Date.now() + 3600
};

// Submit to Veritas AVS
await veritasContract.submitNewStrategy(strategy);
```

**Operators analyze with Claude AI:**
- Gas cost simulation
- Output prediction
- Risk assessment
- Market condition analysis
- Alternative strategy recommendations

### 2. Strategy DNA™ Analysis

Multi-dimensional strategy profiling:

```typescript
POST /api/analyze/dna

{
  "portfolio": {
    "eethBalance": "10.5",
    "weethBalance": "5.2",
    "currentAPY": 3.8,
    "gasPrice": 25
  },
  "strategy": {
    "action": "Convert 2 eETH to weETH",
    "amount": "2.0",
    "protocol": "EtherFi"
  }
}

// Response includes DNA profile
{
  "dnaProfile": {
    "yieldScore": 78,
    "riskRating": "B+",
    "gasTier": 3,
    "timeHorizon": "Medium",
    "compatibilityScore": 85
  }
}
```

### 3. AI Chatbot Assistant

Tiered explanations adapting to user expertise:

```typescript
POST /api/chat

{
  "message": "What's the best way to maximize yield on my weETH?",
  "context": {
    "portfolio": {...},
    "expertiseLevel": "intermediate"
  }
}

// AI provides contextual, personalized advice
```

### 4. Gas-Aware Recommendations

Every suggestion optimized for gas costs:
- Real-time gas monitoring
- Optimal execution timing
- Cost-benefit analysis
- Alternative low-gas strategies

### 5. Portfolio Genome Visualization

Visual representation of asset allocation using DNA-style graphics for intuitive understanding of complex portfolios.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS with custom design system
- **Web3**: Wagmi 2.x, Viem 2.x
- **State**: React Query (TanStack Query)
- **Fonts**: Plus Jakarta Sans, JetBrains Mono

### Backend & APIs
- **Runtime**: Node.js 18+
- **AI**: Anthropic Claude Sonnet 4
- **Blockchain**: Viem, Ethers.js 6.x

### Smart Contracts
- **Language**: Solidity 0.8.x
- **Framework**: Foundry
- **Testing**: Forge

### Operator Nodes
- **Languages**: TypeScript (tsx), Go 1.21+
- **AI Integration**: Anthropic SDK
- **Blockchain**: Viem (TS), go-ethereum (Go)

### Infrastructure
- **Deployment**: Vercel (recommended)
- **Network**: Ethereum Sepolia (testnet), Mainnet (production)
- **AVS Framework**: EigenLayer

---

## 🎨 Design System

Lumina features a hand-crafted, unique design system:

### Color Palette
```css
--primary: #10b981    /* Emerald - Growth & Prosperity */
--secondary: #8b5cf6  /* Violet - Intelligence & Innovation */
--accent: #06b6d4     /* Cyan - Clarity & Trust */
--tertiary: #f59e0b   /* Amber - Energy & Optimism */
```

### Visual Elements
- **Glassmorphism** effects for depth
- **Soft glows** and organic shadows
- **Aurora gradients** for background ambiance
- **Animated numbers** for dynamic data
- **Handcrafted borders** and underlines
- **Responsive** mobile-first design

---

## 📖 API Reference

### Strategy DNA Analysis
```http
POST /api/analyze/dna
Content-Type: application/json

{
  "portfolio": {
    "eethBalance": "10.5",
    "weethBalance": "5.2",
    "currentAPY": 3.8,
    "gasPrice": 25
  },
  "strategy": {
    "action": "string",
    "amount": "string",
    "protocol": "string"
  }
}
```

### AI Chat
```http
POST /api/chat
Content-Type: application/json

{
  "message": "string",
  "context": {
    "portfolio": {...},
    "expertiseLevel": "beginner|intermediate|advanced"
  }
}
```

### Gas Monitoring
```http
GET /api/gas

Response:
{
  "gasPrice": number,
  "trend": "rising|falling|stable",
  "recommendation": "string"
}
```

### Strategy Generation
```http
POST /api/strategy/generate
Content-Type: application/json

{
  "portfolio": {...},
  "riskTolerance": "low|medium|high",
  "timeHorizon": "short|medium|long"
}
```

---

## 🧪 Testing & Development

### Run Linter
```bash
npm run lint
```

### Build for Production
```bash
npm run build
```

### Run Production Build
```bash
npm run start
```

### Type Checking
```bash
npx tsc --noEmit
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**: Link your GitHub repo to Vercel
2. **Configure Environment Variables**: Add all variables from `.env.local`
3. **Deploy**: Automatic deployment on push to main branch

```bash
# Or deploy manually
vercel deploy --prod
```

### Environment Variables for Production

Required variables:
- `ANTHROPIC_API_KEY`
- `NEXT_PUBLIC_SEPOLIA_RPC_URL` (or mainnet RPC)
- `NEXT_PUBLIC_VERITAS_CONTRACT`
- `SEPOLIA_RPC_URL`

### Smart Contract Deployment

```bash
cd contracts

# Deploy to Sepolia
forge create --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  VeritasServiceManager \
  --constructor-args $AGGREGATOR_ADDRESS

# Verify on Etherscan
forge verify-contract \
  --chain sepolia \
  $CONTRACT_ADDRESS \
  VeritasServiceManager
```

---

## 🔒 Security Considerations

### Best Practices
- ✅ Never commit private keys or API keys
- ✅ Use environment variables for all sensitive data
- ✅ Test thoroughly on Sepolia before mainnet deployment
- ✅ Audit smart contracts before production
- ✅ Implement rate limiting on API routes
- ✅ Validate all user inputs
- ✅ Use separate wallets for different roles (operator, aggregator, etc.)

### Smart Contract Security
- Contracts should be audited by professional security firms
- Implement proper access controls
- Use OpenZeppelin libraries for standard patterns
- Test edge cases and failure scenarios
- Monitor contract activity post-deployment

---

## 📊 Performance Optimizations

### Implemented Optimizations
- ✅ Next.js Image component for optimized images
- ✅ Dynamic imports for code splitting
- ✅ React Query for efficient data caching
- ✅ CSS-in-JS with Tailwind for minimal bundle size
- ✅ API route optimization with rate limiting
- ✅ BigInt constructor for ES2019 compatibility
- ✅ Font loading via CSS import (no build-time network calls)

---

## 🗺️ Roadmap

### MVP (Current)
- ✅ Strategy DNA™ profiling system
- ✅ AI-powered chatbot with tiered explanations
- ✅ Veritas AVS integration
- ✅ Real-time gas monitoring
- ✅ Portfolio genome visualization
- ✅ Simulated operator network

### Phase 2 (Q1 2025)
- [ ] Mainnet deployment
- [ ] Multi-operator AVS network
- [ ] BLS signature aggregation
- [ ] Historical strategy performance tracking
- [ ] Advanced portfolio rebalancing
- [ ] Mobile app (React Native)

### Phase 3 (Q2 2025)
- [ ] Multi-chain support (Arbitrum, Optimism, Base)
- [ ] Yield aggregator integration
- [ ] Automated strategy execution
- [ ] Social features (strategy sharing)
- [ ] DAO governance for operator selection
- [ ] Slashing mechanisms for operator accountability

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain consistent code style (use ESLint)
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[EigenLayer](https://www.eigenlayer.xyz/)** - AVS framework and restaking infrastructure
- **[Anthropic](https://www.anthropic.com/)** - Claude AI for intelligent strategy analysis
- **[EtherFi](https://www.ether.fi/)** - Liquid staking protocol and inspiration
- **[Next.js](https://nextjs.org/)** - React framework for production
- **[Vercel](https://vercel.com/)** - Deployment platform
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Wagmi](https://wagmi.sh/)** - React Hooks for Ethereum

---

## 📞 Support & Community

- **GitHub Issues**: [Report bugs or request features](https://github.com/abinu2/Etherfi/issues)
- **Documentation**: Additional docs in `/docs` folder
  - [Veritas AVS Setup](VERITAS_AVS_SETUP.md)
  - [Demo Setup Instructions](DEMO_SETUP_INSTRUCTIONS.md)
  - [Hackathon Demo Guide](HACKATHON_DEMO_GUIDE.md)
  - [Yield Architect Features](YIELD_ARCHITECT_FEATURES.md)

---

## 🎯 Quick Links

- [Live Demo](https://lumina-finance.vercel.app) (coming soon)
- [Documentation](./docs)
- [Smart Contracts](./contracts)
- [API Reference](#-api-reference)
- [Contributing Guidelines](#-contributing)

---

<div align="center">

**Built with 💜 by the Lumina Finance Team**

*Illuminate Your DeFi Journey* ✨

[Website](#) • [Twitter](#) • [Discord](#) • [GitHub](https://github.com/abinu2/Etherfi)

</div>
