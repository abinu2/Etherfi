# Lumina Finance

> **Illuminate Your DeFi Journey**

An intelligent DeFi strategy platform powered by AI, featuring unique **Strategy DNA™** profiling and hand-crafted design for the modern investor.

![Lumina Finance](https://img.shields.io/badge/Lumina-Finance-10b981?style=for-the-badge)
![Built with](https://img.shields.io/badge/Built_with-Next.js_14-000000?style=for-the-badge&logo=next.js)
![Powered by](https://img.shields.io/badge/Powered_by-Claude_AI-8b5cf6?style=for-the-badge)

---

## ✨ What Makes Lumina Unique

Lumina Finance stands apart from traditional DeFi platforms through its innovative approach to strategy analysis:

### 🧬 Strategy DNA™ Profiling
Unlike generic DeFi dashboards, Lumina analyzes strategies through a **multi-dimensional DNA system**:
- **Yield Score** (1-100): Potential returns analysis
- **Risk Rating** (A-F): Safety and resilience assessment
- **Gas Efficiency Tier** (1-5): Cost optimization metrics
- **Time Horizon Matching**: Short/Medium/Long term alignment
- **Compatibility Score**: Personalized user-strategy matching

### 📊 Portfolio Genome Visualization
Visual DNA-style representation of your asset allocation, making complex portfolio composition instantly understandable.

### 🤖 Architect Chatbot
Intelligent AI assistant with **tiered explanations** that adapt to your experience:
- **Beginner**: Simple analogies and metaphors
- **Intermediate**: Core mechanics and trade-offs
- **Advanced**: Technical implementation details

### ⚡ Gas-Aware Everything
Cost optimization isn't an afterthought—it's built into every recommendation:
- Real-time gas condition analysis
- Optimal execution timing
- Cost-benefit calculations for every action

---

## 🎨 Hand-Crafted Design System

Lumina Finance features a unique, aesthetic design that feels **hand-designed**, not template-based:

### Custom Color Palette
- **Emerald** (#10b981): Growth & Prosperity
- **Violet** (#8b5cf6): Intelligence & Innovation
- **Cyan** (#06b6d4): Clarity & Trust
- **Amber** (#f59e0b): Energy & Optimism

### Organic Animations
- **Liquid Shapes**: Fluid, morphing elements
- **Blob Backgrounds**: Organic gradient meshes
- **Aurora Effects**: Subtle, calming background animations
- **Particle Float**: Natural, physics-based movements

### Typography
- **Outfit**: Modern, clean primary font
- **Caveat**: Handwritten accent font for personal touch

### UI Elements
- Glassmorphism effects
- Soft glows and shadows
- Magnetic hover interactions
- Handcrafted card borders
- Sketch-style underlining

---

## 🚀 Core Features

### 1. **Strategy DNA Analysis**
```typescript
// Multi-dimensional strategy profiling
const analysis = await yieldArchitectAI.analyzeStrategyDNA(
  userPortfolio,
  marketConditions
);

// Returns:
{
  dnaProfile: {
    yieldScore: 85,
    riskRating: 'A',
    gasTier: 4,
    timeHorizon: 'Long',
    uniqueOpportunities: [...]
  }
}
```

### 2. **Compatibility Matrix**
Intelligent matching system that categorizes strategies:
- ✅ **Recommended**: 80+ compatibility score
- ⚠️ **Caution**: 60-80 compatibility score
- ❌ **Incompatible**: <60 compatibility score

### 3. **Dynamic Risk Profiling**
Real-time risk analysis across 5 dimensions:
- Market Risk
- Liquidity Risk
- Smart Contract Risk
- Operational Risk
- Systemic Risk

### 4. **Intelligent API Router**
Multi-RPC fallback system with:
- Automatic health monitoring
- Smart endpoint selection
- Adaptive retry logic
- Exponential backoff

### 5. **Conversational AI**
5 response styles that adapt to context:
- General
- Cautious (high-risk portfolios)
- Sophisticated (large portfolios)
- Educational (beginners)
- Balanced

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Custom CSS Animations** - Hand-crafted effects

### AI & Backend
- **Claude Sonnet 4** - Advanced AI reasoning
- **Anthropic SDK** - AI integration
- **Rate Limiter** - Intelligent request management
- **Caching System** - 5-minute TTL for performance

### Web3
- **Ethers.js** - Ethereum interaction
- **EtherFi Protocol** - Liquid staking integration
- **Multi-RPC System** - Reliability and failover

---

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd Etherfi

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your API keys
# Edit .env.local with your keys

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

---

## ⚙️ Configuration

### Required Environment Variables

```bash
# Lumina Finance Configuration
NEXT_PUBLIC_APP_NAME="Lumina Finance"
ANTHROPIC_API_KEY=sk-ant-your-key-here

# EtherFi Integration
NEXT_PUBLIC_ETHERFI_API_BASE=https://api.ether.fi
NEXT_PUBLIC_EETH_CONTRACT=0x35fA164735182de50811E8e2E824cFb9B6118ac2

# Multi-RPC Fallback
NEXT_PUBLIC_RPC_MAIN=https://eth-mainnet.g.alchemy.com/v2/YOUR-KEY
NEXT_PUBLIC_RPC_BACKUP=https://mainnet.infura.io/v3/YOUR-KEY

# Performance
NEXT_PUBLIC_CACHE_TTL=300  # 5 minute cache
NEXT_PUBLIC_AI_TOKEN_BUDGET=4096  # Max tokens per request
```

---

## 🎯 Key Differentiators

### What Sets Lumina Apart

1. **Strategy DNA™ System**
   - Proprietary multi-dimensional scoring
   - Visual DNA helix representation
   - Unique to Lumina Finance

2. **Adaptive Intelligence**
   - Responses match user experience level
   - Token budget adjusts to complexity
   - Retry strategies adapt to importance

3. **Gas-First Philosophy**
   - All strategies scored on gas efficiency
   - Real-time cost-benefit analysis
   - Optimal execution timing

4. **Hand-Designed Aesthetic**
   - No templates or themes
   - Organic animations and shapes
   - Personal, crafted feel

5. **Portfolio Genome**
   - DNA-style asset visualization
   - Unique metaphor for composition
   - Instant understanding of allocation

---

## 📊 API Endpoints

### Strategy DNA Analysis
```typescript
POST /api/analyze/dna
{
  "userProfile": { ... },
  "marketConditions": { ... }
}

// Returns DNA profile with optimizations
```

### Enhanced Chat
```typescript
POST /api/chat
{
  "message": "What is liquid staking?",
  "sessionId": "...",
  "userProfile": { ... }
}

// Returns adaptive, contextual response
```

### Cache Statistics
```typescript
GET /api/analyze/dna  // Cache stats
GET /api/chat         // Memory stats
```

---

## 🎨 Design Philosophy

Lumina Finance is built on the principle that **DeFi tools should be both powerful and beautiful**:

- **Organic over Geometric**: Flowing shapes instead of harsh angles
- **Soft over Hard**: Gentle glows instead of stark shadows
- **Personal over Generic**: Hand-crafted feel instead of template aesthetics
- **Intelligent over Automated**: Adaptive systems instead of static rules

---

## 🌟 Unique UI Components

### Handcrafted Card
```tsx
<div className="handcrafted-card soft-glow magnetic-hover">
  {/* Content with gradient border on hover */}
</div>
```

### Liquid Shape Animation
```tsx
<div className="liquid-shape">
  {/* Morphing, flowing element */}
</div>
```

### Organic Mesh Background
```tsx
<div className="organic-mesh">
  {/* Subtle, blurred gradient mesh */}
</div>
```

### Hand Underline
```tsx
<span className="hand-underline">
  {/* Animated underline on hover */}
</span>
```

---

## 📈 Performance Optimizations

1. **Adaptive Token Budgeting**
   - Base tokens vary by query type
   - +10% per complexity point
   - Prevents overuse while maintaining quality

2. **Intelligent Caching**
   - 5-minute TTL for strategy analysis
   - Automatic cleanup of expired entries
   - Hit/miss statistics tracking

3. **Smart Retries**
   - Exponential backoff (100ms → 16s)
   - Context-aware max attempts
   - User-facing operation caps

4. **Multi-RPC Fallback**
   - Health checks every 60 seconds
   - Automatic endpoint selection
   - Operation-specific routing

---

## 🔒 Security Features

- **Rate Limiting**: Complexity-based consumption
- **Input Validation**: Comprehensive sanitization
- **Error Masking**: User-friendly messages only
- **Session Management**: 1-hour timeout
- **Encryption Support**: Optional local data encryption

---

## 🚦 Rate Limits

### DNA Analysis API
- **Base limit**: 10 requests/minute
- **Complexity adjustment**: 1-10 points per request
- **Simple strategies**: 1 point
- **Complex strategies**: 5 points

### Chat API
- **Limit**: 20 messages/minute
- **Per client**: IP-based identification

---

## 📚 Documentation

- **[Yield Architect Features](./YIELD_ARCHITECT_FEATURES.md)** - Complete technical documentation
- **[API Reference](./src/app/api/)** - API route implementations
- **[Type Definitions](./src/types/index.ts)** - TypeScript interfaces

---

## 🎯 Roadmap

### Phase 1: Core Platform ✅
- [x] Strategy DNA™ profiling
- [x] Portfolio genome visualization
- [x] Architect chatbot
- [x] Gas optimization
- [x] Hand-crafted UI

### Phase 2: Advanced Features 🚧
- [ ] Real-time market data integration
- [ ] Strategy backtesting
- [ ] Social features & sharing
- [ ] Community ratings

### Phase 3: Machine Learning 📋
- [ ] Strategy success prediction
- [ ] Anomaly detection
- [ ] Personalized recommendations
- [ ] Portfolio auto-rebalancing

---

## 🤝 Contributing

Lumina Finance is built with love for the DeFi community. Contributions are welcome!

---

## 📄 License

Part of the EtherFi ecosystem.

---

## 🌐 Links

- **Documentation**: [YIELD_ARCHITECT_FEATURES.md](./YIELD_ARCHITECT_FEATURES.md)
- **EtherFi Protocol**: https://ether.fi
- **Claude AI**: https://anthropic.com

---

## 💡 Philosophy

> "In the complex world of DeFi, clarity is power. Lumina Finance illuminates the path to optimal strategies through intelligent analysis and beautiful design."

**Lumina Finance** - Where AI meets artistry in DeFi strategy.

---

**© 2025 Lumina Finance** • Intelligent DeFi Strategy Platform • Strategy DNA™
