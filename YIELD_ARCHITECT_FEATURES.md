# Yield Architect Features Documentation

## Overview

Yield Architect is an enhanced AI-powered DeFi strategy platform built on top of EtherFi, featuring unique capabilities for portfolio analysis, strategy optimization, and intelligent chatbot interactions.

## Core Features

### 1. Strategy DNA Profiling System

**Location:** `src/lib/ai/claude-core.ts`

The Strategy DNA system provides a unique multi-dimensional analysis of DeFi strategies:

- **Yield Score (1-100)**: Measures potential returns
- **Risk Rating (A-F)**: Letter grade assessment of risk level
- **Gas Efficiency Tier (1-5)**: How cost-effective the strategy is
- **Time Horizon**: Short/Medium/Long term alignment
- **Compatibility Score**: How well the strategy matches user profile

**Key Features:**
- Adaptive token budgeting based on strategy complexity
- Portfolio genome visualization
- Intelligent caching with 5-minute TTL
- Complexity scoring algorithm

**Usage:**
```typescript
import { yieldArchitectAI } from '@/lib/ai/claude-core';

const analysis = await yieldArchitectAI.analyzeStrategyDNA(
  userPortfolio,
  marketConditions
);
```

### 2. Architect Chatbot with Tiered Explanations

**Location:** `src/lib/ai/architect-chatbot.ts`

Enhanced chatbot with context-aware responses and adaptive complexity:

**Unique Features:**
- **5 Response Styles**: General, Cautious, Sophisticated, Educational, Balanced
- **Tiered Explanations**: 3 levels (Beginner, Intermediate, Advanced)
- **Conversation Path Guidance**: Automatically guides users through strategy discussions
- **Portfolio Risk Heat Mapping**: Real-time risk assessment

**Conversation Paths:**
- EDUCATION_PATH - Concept explanations
- STRATEGY_PATH - Strategy recommendations
- RISK_PATH - Risk analysis
- EXECUTION_PATH - Implementation guidance
- COMPARISON_PATH - Option comparison

**Usage:**
```typescript
import { architectChatbot } from '@/lib/ai/architect-chatbot';

// Get tiered explanation
const explanation = await architectChatbot.generateTieredExplanation(
  'liquid staking',
  'beginner'
);

// Get contextual response
const response = await architectChatbot.generateContextualResponse(
  userInput,
  chatContext
);
```

### 3. Strategy Genome Analyzer

**Location:** `src/lib/ai/strategy-genome.ts`

Advanced strategy analysis with unique scoring metrics:

**Multi-Dimensional Fitness Scoring:**
- Yield Potential (30% weight)
- Risk-Adjusted Returns (25% weight)
- Gas Efficiency (20% weight)
- Time Alignment (15% weight)
- Complexity Appropriateness (10% weight)

**Features:**
- Compatibility Matrix Generation
- Dynamic Risk Profiling with stress testing
- User-Strategy matching algorithm
- Gas-aware yield calculations

**Usage:**
```typescript
import { strategyGenomeAnalyzer } from '@/lib/ai/strategy-genome';

// Calculate strategy fitness
const fitness = strategyGenomeAnalyzer.calculateStrategyFitness(
  strategy,
  userProfile
);

// Generate compatibility matrix
const matrix = await strategyGenomeAnalyzer.generateCompatibilityMatrix(
  userProfile,
  strategies
);

// Get dynamic risk profile
const riskProfile = await strategyGenomeAnalyzer.generateDynamicRiskProfile(
  strategy,
  marketConditions
);
```

### 4. Intelligent API Router

**Location:** `src/lib/api/intelligent-router.ts`

Multi-RPC fallback system with intelligent endpoint selection:

**Features:**
- Automatic endpoint health monitoring
- Intelligent endpoint selection based on operation type
- Adaptive retry logic with exponential backoff
- Complexity-based retry strategies

**Endpoint Types:**
- Primary RPC - Main endpoint
- Backup RPC - Fallback for reliability
- Archive Node - Historical data queries

**Usage:**
```typescript
import { intelligentAPIRouter } from '@/lib/api/intelligent-router';

// Select optimal endpoint
const endpoint = await intelligentAPIRouter.selectOptimalEndpoint(
  'eth_call',
  'high'
);

// Execute with intelligent retry
const result = await intelligentAPIRouter.executeWithIntelligentRetry(
  async () => performOperation(),
  {
    importance: 'high',
    userFacing: true
  }
);
```

### 5. Strategy DNA Visualizer Component

**Location:** `src/components/StrategyDNAVisualizer.tsx`

React component for visual strategy analysis:

**Visual Elements:**
- DNA Helix representation with 3 strands (Yield, Risk, Gas)
- Animated progress bars
- Color-coded ratings
- Unique opportunities list
- Time horizon badges

**Usage:**
```tsx
import { StrategyDNAVisualizer } from '@/components/StrategyDNAVisualizer';

<StrategyDNAVisualizer
  strategy={strategy}
  userProfile={userProfile}
/>
```

### 6. Enhanced API Routes

#### DNA Analysis Route
**Location:** `src/app/api/analyze/dna/route.ts`

**Features:**
- Complexity-based rate limiting
- Tiered analysis depth (quick/standard/deep)
- Optimization suggestions
- Context-aware error messages
- Processing time metrics

**Endpoints:**
- `POST /api/analyze/dna` - Analyze strategy DNA
- `GET /api/analyze/dna` - Get cache statistics

#### Enhanced Chat Route
**Location:** `src/app/api/chat/route.ts`

**Features:**
- Rate limiting (20 messages/minute)
- Session-based context storage
- Conversation path guidance
- Adaptive response styling
- Memory statistics endpoint

**Endpoints:**
- `POST /api/chat` - Send chat message
- `GET /api/chat` - Get memory statistics

## Environment Configuration

**Location:** `.env.example`

### Required Variables

```bash
# Application
NEXT_PUBLIC_APP_NAME="Yield Architect"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# Claude AI
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Security
NEXT_PUBLIC_ENCRYPTION_KEY=your-encryption-key-here
NEXT_PUBLIC_SESSION_TIMEOUT=3600

# EtherFi Integration
NEXT_PUBLIC_ETHERFI_API_BASE=https://api.ether.fi
NEXT_PUBLIC_EETH_CONTRACT=0x35fA164735182de50811E8e2E824cFb9B6118ac2
NEXT_PUBLIC_WEETH_CONTRACT=0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee

# Multi-RPC Fallback
NEXT_PUBLIC_RPC_MAIN=https://eth-mainnet.g.alchemy.com/v2/YOUR-KEY
NEXT_PUBLIC_RPC_BACKUP=https://mainnet.infura.io/v3/YOUR-KEY
NEXT_PUBLIC_RPC_ARCHIVE=https://arbitrum-mainnet.infura.io/v3/YOUR-KEY

# Performance
NEXT_PUBLIC_CACHE_TTL=300
NEXT_PUBLIC_MAX_STRATEGY_COMPLEXITY=10
NEXT_PUBLIC_AI_TOKEN_BUDGET=4096
```

## TypeScript Types

**Location:** `src/types/index.ts`

### Key Interfaces

- `DNAProfile` - Strategy DNA analysis results
- `StrategyFitness` - Multi-dimensional fitness scores
- `Strategy` - Complete strategy definition
- `StrategyCompatibility` - User-strategy matching
- `CompatibilityMatrix` - Full recommendation matrix
- `UserProfile` - Enhanced user profile with preferences
- `ChatContext` - Conversation context tracking
- `TieredExplanation` - Multi-level explanations
- `DynamicRiskProfile` - Risk analysis with stress testing
- `MarketConditions` - Market state for analysis

## Rate Limiting

### DNA Analysis API
- **Base limit**: 10 requests per minute
- **Complexity adjustment**: Consumes 1-10 points based on strategy complexity
- **Simple strategies** (complexity 1-2): 1 point
- **Complex strategies** (complexity 9-10): 5 points

### Chat API
- **Limit**: 20 messages per minute per client
- **Identifier**: IP address (x-forwarded-for or x-real-ip)

## Caching Strategy

### Strategy DNA Cache
- **TTL**: 5 minutes (configurable via `NEXT_PUBLIC_CACHE_TTL`)
- **Automatic cleanup**: Removes expired entries on each new request
- **Cache key**: Combination of prompt and system prompt
- **Statistics**: Available via `GET /api/analyze/dna`

### Conversation Memory
- **Storage**: In-memory Map per session
- **Lifecycle**: Stored until session ends or manually cleared
- **Statistics**: Available via `GET /api/chat`

## Performance Optimizations

1. **Adaptive Token Budgeting**
   - Adjusts Claude token usage based on query complexity
   - Base tokens: Chat (1024), Analysis (2048), Strategy (3072), Risk (1536)
   - Complexity multiplier: +10% per complexity point

2. **Intelligent Retry Logic**
   - Exponential backoff: 100ms, 200ms, 400ms, 800ms, 1600ms
   - Context-aware max retries: Critical (5), High (3), Medium (2), Low (1)
   - User-facing operation caps: Max 3 retries, max 5s delay

3. **Multi-RPC Fallback**
   - Health checks cached for 1 minute
   - Automatic endpoint selection based on:
     - Response time
     - Success rate
     - Operation requirements
     - Urgency level

## Unique Value Propositions

### 1. Strategy DNA Metaphor
- Visual DNA helix representation
- Genome-style portfolio visualization
- Biological metaphors for strategy compatibility

### 2. Gas-Aware Everything
- All strategies scored on gas efficiency
- Real-time gas condition integration
- Cost-benefit analysis built into recommendations

### 3. Adaptive Intelligence
- Response complexity matches user experience level
- Token budget adjusts to query complexity
- Retry strategies adapt to operation importance

### 4. Comprehensive Risk Analysis
- 5 risk dimensions (Market, Liquidity, Smart Contract, Operational, Systemic)
- Stress test scenarios with probability and mitigation
- Dynamic risk scoring based on market conditions

### 5. User-Centric Design
- Context-aware error messages with recovery suggestions
- Processing time transparency
- Tiered explanations for all experience levels

## Dependencies Added

```json
{
  "rate-limiter-flexible": "^5.0.0"
}
```

## Testing the Implementation

### 1. Type Check
```bash
npx tsc --noEmit --skipLibCheck
```

### 2. Build Check (requires network)
```bash
npm run build
```

### 3. Development Server
```bash
npm run dev
```

### 4. Test DNA Analysis
```bash
curl -X POST http://localhost:3000/api/analyze/dna \
  -H "Content-Type: application/json" \
  -d '{
    "userProfile": {
      "address": "0x...",
      "experienceLevel": "intermediate",
      "riskTolerance": "moderate",
      "timeHorizon": "medium",
      "portfolio": {
        "address": "0x...",
        "eethBalance": "1.5",
        "eethBalanceUSD": 3000,
        "currentAPY": 3.8
      }
    }
  }'
```

### 5. Test Chat API
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is liquid staking?",
    "sessionId": "test-session-123"
  }'
```

## Future Enhancements

1. **Real-time Market Data Integration**
   - Live gas price feeds
   - DeFi TVL tracking
   - Volatility indices

2. **Strategy Backtesting**
   - Historical performance simulation
   - Monte Carlo risk analysis
   - Scenario planning

3. **Social Features**
   - Strategy sharing
   - Community ratings
   - Expert verification badges

4. **Advanced Visualizations**
   - Interactive DNA charts
   - 3D portfolio mapping
   - Time-series yield projections

5. **Machine Learning Enhancements**
   - Strategy success prediction
   - Anomaly detection
   - Personalized recommendations

## Support

For issues or questions:
1. Check this documentation
2. Review TypeScript types in `src/types/index.ts`
3. Examine example usage in API routes
4. Contact development team

## License

Part of the EtherFi AVS Validator project.
