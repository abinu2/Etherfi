import type {
  EndpointHealth,
  OperationRequirements,
  UrgencyLevel,
  RetryContext,
} from '@/types';

/**
 * INTELLIGENT API ROUTER
 * Multi-RPC fallback system with intelligent endpoint selection
 */
export class IntelligentAPIRouter {
  private endpoints = {
    primary: process.env.NEXT_PUBLIC_RPC_MAIN || '',
    backup: process.env.NEXT_PUBLIC_RPC_BACKUP || '',
    archive: process.env.NEXT_PUBLIC_RPC_ARCHIVE || '',
  };

  private healthCache = new Map<string, EndpointHealth>();
  private healthCacheTTL = 60000; // 1 minute

  /**
   * Check endpoint health
   */
  private async checkEndpointHealth(): Promise<Record<string, EndpointHealth>> {
    const now = new Date();
    const health: Record<string, EndpointHealth> = {};

    for (const [name, url] of Object.entries(this.endpoints)) {
      if (!url) continue;

      // Check cache first
      const cached = this.healthCache.get(name);
      if (cached && now.getTime() - cached.lastChecked.getTime() < this.healthCacheTTL) {
        health[name] = cached;
        continue;
      }

      // Perform health check
      try {
        const startTime = Date.now();
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
            id: 1,
          }),
        });

        const responseTime = Date.now() - startTime;
        const isHealthy = response.ok;

        const endpointHealth: EndpointHealth = {
          responseTime,
          successRate: isHealthy ? 1.0 : 0.0,
          lastChecked: now,
          isHealthy,
        };

        this.healthCache.set(name, endpointHealth);
        health[name] = endpointHealth;
      } catch (error) {
        const endpointHealth: EndpointHealth = {
          responseTime: 9999,
          successRate: 0.0,
          lastChecked: now,
          isHealthy: false,
        };

        this.healthCache.set(name, endpointHealth);
        health[name] = endpointHealth;
      }
    }

    return health;
  }

  /**
   * Get operation requirements
   */
  private getOperationRequirements(operation: string): OperationRequirements {
    const requiresArchive = operation.includes('getLogs') || operation.includes('getCode');
    const requiresSpeed = operation.includes('sendTransaction') || operation.includes('call');

    return {
      needsArchive: requiresArchive,
      needsSpeed: requiresSpeed,
      canRetry: !operation.includes('sendTransaction'),
    };
  }

  /**
   * Select optimal endpoint
   * Unique feature: Intelligent endpoint selection
   */
  async selectOptimalEndpoint(operation: string, urgency: UrgencyLevel): Promise<string> {
    const endpointHealth = await this.checkEndpointHealth();
    const operationRequirements = this.getOperationRequirements(operation);

    // Score each endpoint
    const scores = Object.entries(endpointHealth)
      .filter(([, health]) => health.isHealthy)
      .map(([name, health]) => {
        let score = health.responseTime;

        // Adjust based on operation needs
        if (operationRequirements.needsArchive && name === 'archive') {
          score *= 0.8; // Prefer archive for archive operations
        }
        if (operationRequirements.needsSpeed && health.responseTime < 1000) {
          score *= 0.7; // Prefer fast endpoints for speed-critical ops
        }
        if (urgency === 'high' && health.successRate > 0.95) {
          score *= 0.6; // Prefer reliable endpoints for high urgency
        }
        if (urgency === 'critical') {
          score *= 0.5; // Strongly prefer best endpoint for critical ops
        }

        return { name, score, health };
      });

    // If no healthy endpoints, return primary as fallback
    if (scores.length === 0) {
      console.warn('No healthy endpoints available, using primary');
      return this.endpoints.primary;
    }

    // Select best endpoint (lowest score)
    const bestEndpoint = scores.sort((a, b) => a.score - b.score)[0];
    return this.endpoints[bestEndpoint.name as keyof typeof this.endpoints];
  }

  /**
   * Calculate max retries based on context
   */
  private calculateMaxRetries(context: RetryContext): number {
    const baseRetries: Record<string, number> = {
      critical: 5,
      high: 3,
      medium: 2,
      low: 1,
    };

    const maxRetries = baseRetries[context.importance];

    // Reduce retries for user-facing operations to avoid long waits
    return context.userFacing ? Math.min(3, maxRetries) : maxRetries;
  }

  /**
   * Calculate base delay for retries
   */
  private calculateBaseDelay(context: RetryContext): number {
    const baseDelays: Record<string, number> = {
      critical: 100,
      high: 500,
      medium: 1000,
      low: 2000,
    };

    return baseDelays[context.importance];
  }

  /**
   * Calculate exponential backoff delay
   */
  private calculateExponentialBackoff(
    attempt: number,
    baseDelay: number,
    context: RetryContext
  ): number {
    const exponential = baseDelay * Math.pow(2, attempt - 1);

    // Cap delays for user-facing operations
    if (context.userFacing) {
      return Math.min(5000, exponential);
    }

    return Math.min(16000, exponential);
  }

  /**
   * Determine if error should trigger retry
   */
  private shouldRetryError(error: any, context: RetryContext): boolean {
    // Network errors - always retry
    if (error.name === 'NetworkError' || error.message?.includes('network')) {
      return true;
    }

    // Rate limiting - retry
    if (error.status === 429 || error.message?.includes('rate limit')) {
      return true;
    }

    // Server errors - retry
    if (error.status >= 500 && error.status < 600) {
      return true;
    }

    // Timeout errors - retry
    if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
      return true;
    }

    // Client errors - don't retry (bad request, unauthorized, etc.)
    if (error.status >= 400 && error.status < 500 && error.status !== 429) {
      return false;
    }

    // Unknown errors - retry for critical operations only
    return context.importance === 'critical';
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Execute operation with intelligent retry
   * Unique feature: Adaptive retry logic
   */
  async executeWithIntelligentRetry<T>(
    operation: () => Promise<T>,
    context: RetryContext
  ): Promise<T> {
    const maxRetries = this.calculateMaxRetries(context);
    const baseDelay = this.calculateBaseDelay(context);

    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        if (attempt === maxRetries) {
          throw error;
        }

        const shouldRetry = this.shouldRetryError(error, context);

        if (!shouldRetry) {
          throw error;
        }

        const delay = this.calculateExponentialBackoff(attempt, baseDelay, context);

        console.warn(
          `Retry attempt ${attempt}/${maxRetries} after ${delay}ms delay`,
          error
        );

        await this.delay(delay);
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }

  /**
   * Get endpoint health stats
   */
  async getHealthStats(): Promise<Record<string, EndpointHealth>> {
    return await this.checkEndpointHealth();
  }

  /**
   * Clear health cache
   */
  clearHealthCache(): void {
    this.healthCache.clear();
  }
}

// Export singleton instance
export const intelligentAPIRouter = new IntelligentAPIRouter();
