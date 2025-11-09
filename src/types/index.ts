// User and Portfolio Types

/**
 * Represents a user's EtherFi portfolio information
 */
export interface UserPortfolio {
  address: string;
  eethBalance: string;        // in ETH units (e.g., "1.5")
  weethBalance: string;       // wrapped eETH balance
  ethBalance: string;         // ETH balance
  eethBalanceUSD: number;     // in USD
  totalStakedUSD: number;     // total staked value in USD
  currentAPY: number;         // e.g., 3.8
  estimatedAPY: number;       // estimated APY
  stakedDate?: Date;
  lastUpdated: Date;          // last update timestamp
}

// Gas Data Types

/**
 * Current gas prices across different priority levels
 */
export interface GasData {
  current: number;            // current gas price in gwei
  fast: number;              // fast gas price
  average: number;           // average gas price
  slow: number;              // slow gas price
  timestamp: Date;
}

/**
 * AI-powered gas price prediction and optimization
 */
export interface GasPrediction {
  optimalTime: Date;         // when to execute transaction
  optimalGasPrice: number;   // expected gas price at that time
  estimatedSavingsUSD: number; // how much user saves by waiting
  confidence: 'low' | 'medium' | 'high';
  reasoning: string;         // AI explanation
}

// Chat Types

/**
 * Represents a single message in the AI chat interface
 */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    gasSavings?: number;
    recommendations?: string[];
  };
}

// AI Analysis Types

/**
 * Comprehensive AI analysis of user's portfolio and strategy
 */
export interface AIAnalysis {
  summary: string;           // 2-3 sentence overview
  healthScore: number;       // 0-100
  recommendations: Recommendation[];
  gasOptimization: GasPrediction;
  risks: string[];
}

/**
 * A single actionable recommendation from the AI
 */
export interface Recommendation {
  title: string;
  description: string;
  impact: string;            // e.g., "+$45/year"
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
}

// API Response Types

/**
 * Standard API response wrapper
 */
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================
// YIELD ARCHITECT ENHANCED TYPES
// ============================================

// Strategy DNA Types

/**
 * Strategy DNA Profile - Unique scoring system
 */
export interface DNAProfile {
  yieldScore: number;           // 1-100
  riskRating: 'A' | 'B' | 'C' | 'D' | 'F';
  gasTier: 1 | 2 | 3 | 4 | 5;
  timeHorizon: 'Short' | 'Medium' | 'Long';
  uniqueOpportunities: string[];
  overallScore: number;
  compatibilityScore: number;
}

/**
 * Strategy Fitness - Multi-dimensional scoring
 */
export interface StrategyFitness {
  yieldPotential: number;
  riskAdjusted: number;
  gasEfficiency: number;
  timeAlignment: number;
  complexityAppropriateness: number;
}

/**
 * Strategy with enhanced metadata
 */
export interface Strategy {
  id: string;
  name: string;
  type: 'yield' | 'leverage' | 'liquidity' | 'arbitrage';
  protocols: string[];
  steps: StrategyStep[];
  risks: string[];
  estimatedGas: number;
  estimatedGasCost: number;
  expectedAnnualYield: number;
  positionSize: number;
  complexity: number;  // 1-10
  description: string;
}

/**
 * Individual step in a strategy
 */
export interface StrategyStep {
  order: number;
  action: string;
  protocol: string;
  estimatedGas: number;
  description: string;
}

/**
 * Strategy Compatibility Assessment
 */
export interface StrategyCompatibility {
  strategy: Strategy;
  fitness: StrategyFitness;
  overallScore: number;
  reasoning: string;
}

/**
 * Compatibility Matrix for strategy recommendations
 */
export interface CompatibilityMatrix {
  userProfile: UserProfile;
  recommendedStrategies: StrategyCompatibility[];
  cautionStrategies: StrategyCompatibility[];
  incompatibleStrategies: StrategyCompatibility[];
}

// User Profile Types

/**
 * Enhanced user profile with experience and preferences
 */
export interface UserProfile {
  address: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  timeHorizon: 'short' | 'medium' | 'long';
  portfolio: UserPortfolio;
  preferences?: {
    gasPreference?: 'low' | 'medium' | 'high';
    complexityPreference?: 'simple' | 'moderate' | 'complex';
  };
}

// Chat Context Types

/**
 * Chat context for conversation tracking
 */
export interface ChatContext {
  sessionId: string;
  userProfile?: UserProfile;
  portfolio?: UserPortfolio;
  conversationHistory: ChatMessage[];
  currentTopic?: string;
}

/**
 * Response style for adaptive chatbot
 */
export type ResponseStyle = 'general' | 'cautious' | 'sophisticated' | 'educational' | 'balanced';

/**
 * User experience level
 */
export type UserLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * Tiered explanation for adaptive learning
 */
export interface TieredExplanation {
  concept: string;
  tier1: string;  // Beginner
  tier2: string;  // Intermediate
  tier3: string;  // Advanced
  confidence: number;
}

/**
 * Conversation path for guided discussions
 */
export interface ConversationPath {
  path: 'EDUCATION_PATH' | 'STRATEGY_PATH' | 'RISK_PATH' | 'EXECUTION_PATH' | 'COMPARISON_PATH';
  nextQuestion: string;
  reasoning: string;
}

// Risk Analysis Types

/**
 * Dynamic risk profile with stress testing
 */
export interface DynamicRiskProfile {
  marketRisk: number;        // 1-100
  liquidityRisk: number;     // 1-100
  smartContractRisk: number; // 1-100
  operationalRisk: number;   // 1-100
  systemicRisk: number;      // 1-100
  stressScenarios: StressScenario[];
  overallRiskScore: number;
}

/**
 * Stress test scenario
 */
export interface StressScenario {
  name: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  mitigation: string;
}

// Market Data Types

/**
 * Market conditions for strategy analysis
 */
export interface MarketConditions {
  ethDominance: number;
  defiTVLTrend: 'up' | 'down' | 'stable';
  gasConditions: 'low' | 'medium' | 'high';
  volatility: number;  // 0-100
  liquidity: 'low' | 'medium' | 'high';
  regulatoryEnvironment: 'favorable' | 'neutral' | 'unfavorable';
  networkHealth: 'excellent' | 'good' | 'fair' | 'poor';
}

// API Router Types

/**
 * Endpoint health status
 */
export interface EndpointHealth {
  responseTime: number;
  successRate: number;
  lastChecked: Date;
  isHealthy: boolean;
}

/**
 * Operation requirements for intelligent routing
 */
export interface OperationRequirements {
  needsArchive: boolean;
  needsSpeed: boolean;
  canRetry: boolean;
}

/**
 * Urgency level for operations
 */
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

/**
 * Retry context for intelligent retry logic
 */
export interface RetryContext {
  importance: 'low' | 'medium' | 'high' | 'critical';
  userFacing: boolean;
  maxAttempts?: number;
}

// Cache Types

/**
 * Cache entry for AI responses
 */
export interface CacheEntry {
  data: any;
  timestamp: Date;
  expiresAt: Date;
  hits: number;
}

// Optimization Types

/**
 * Optimization plan
 */
export interface OptimizationPlan {
  immediateActions: string[];
  mediumTermGoals: string[];
  riskMitigations: string[];
}

/**
 * Confidence metrics for AI analysis
 */
export interface ConfidenceMetrics {
  dataQuality: number;      // 0-100
  marketAlignment: number;  // 0-100
  executionFeasibility: number; // 0-100
}

/**
 * Complete DNA Analysis Response
 */
export interface DNAAnalysisResponse {
  dnaProfile: DNAProfile;
  optimizationPlan: OptimizationPlan;
  confidenceMetrics: ConfidenceMetrics;
}
