// User and Portfolio Types

/**
 * Represents a user's EtherFi portfolio information
 */
export interface UserPortfolio {
  address: string;
  eethBalance: string;        // in ETH units (e.g., "1.5")
  eethBalanceUSD: number;     // in USD
  currentAPY: number;         // e.g., 3.8
  stakedDate?: Date;
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
