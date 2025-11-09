/**
 * Simulated EigenLayer Data for Hackathon Demo
 * Provides realistic operator and AVS data without requiring real blockchain integration
 */

export interface SimulatedOperator {
  address: string;
  name: string;
  operatorId: string;
  avatar: string;
  totalStake: string; // in ETH
  restakingStrategies: RestakingStrategy[];
  reputation: number; // 0-100
  totalValidations: number;
  successfulValidations: number;
  averageResponseTime: number; // in ms
  uptime: number; // percentage
  joinedDate: Date;
  isActive: boolean;
  recentActivity: OperatorActivity[];
}

export interface RestakingStrategy {
  name: string;
  protocol: string;
  stakedAmount: string; // in ETH
  apy: number;
  address: string;
}

export interface OperatorActivity {
  timestamp: Date;
  type: 'validation' | 'registration' | 'stake_update' | 'reward_claimed';
  taskId?: number;
  amount?: string;
  status?: 'success' | 'pending' | 'failed';
}

export interface AVSMetrics {
  totalValueLocked: string;
  operatorCount: number;
  activeValidations: number;
  totalValidationsCompleted: number;
  averageConfidenceScore: number;
  quorumThreshold: number;
  uptimePercentage: number;
}

// Generate realistic operator names
const OPERATOR_NAMES = [
  'Coinbase Cloud',
  'Figment',
  'P2P Validator',
  'Staked.us',
  'Everstake',
  'Kiln',
  'Chorus One',
  'InfStones',
  'Blockdaemon',
  'Stakefish',
  'Lido Node Operator',
  'RocketPool DAO',
  'Ankr',
  'Allnodes',
  'Staking Facilities'
];

// Restaking strategies
const STRATEGIES = [
  { name: 'Lido stETH', protocol: 'Lido', apy: 3.8 },
  { name: 'Rocket Pool rETH', protocol: 'RocketPool', apy: 3.5 },
  { name: 'Coinbase cbETH', protocol: 'Coinbase', apy: 3.2 },
  { name: 'Native ETH', protocol: 'Ethereum', apy: 4.0 },
  { name: 'Frax sfrxETH', protocol: 'Frax', apy: 4.2 },
  { name: 'Ankr ankrETH', protocol: 'Ankr', apy: 3.6 },
];

/**
 * Generate simulated operators with realistic data
 */
export function generateSimulatedOperators(count: number = 12): SimulatedOperator[] {
  const operators: SimulatedOperator[] = [];

  for (let i = 0; i < count; i++) {
    const totalStake = (Math.random() * 500 + 100).toFixed(2); // 100-600 ETH
    const reputation = Math.floor(Math.random() * 20 + 80); // 80-100
    const totalValidations = Math.floor(Math.random() * 1000 + 100);
    const successRate = Math.random() * 0.05 + 0.95; // 95-100%

    // Generate restaking strategies (1-4 per operator)
    const strategyCount = Math.floor(Math.random() * 3) + 1;
    const operatorStrategies = [];
    const usedStrategies = new Set<number>();

    let remainingStake = parseFloat(totalStake);

    for (let j = 0; j < strategyCount; j++) {
      let strategyIndex;
      do {
        strategyIndex = Math.floor(Math.random() * STRATEGIES.length);
      } while (usedStrategies.has(strategyIndex));

      usedStrategies.add(strategyIndex);

      const isLast = j === strategyCount - 1;
      const amount = isLast
        ? remainingStake
        : remainingStake * (Math.random() * 0.4 + 0.2); // 20-60% of remaining

      remainingStake -= amount;

      const strategy = STRATEGIES[strategyIndex];
      operatorStrategies.push({
        name: strategy.name,
        protocol: strategy.protocol,
        stakedAmount: amount.toFixed(2),
        apy: strategy.apy,
        address: `0x${Math.random().toString(16).slice(2, 42)}`,
      });
    }

    // Generate recent activity
    const recentActivity: OperatorActivity[] = [];
    for (let k = 0; k < 5; k++) {
      const hoursAgo = Math.random() * 24;
      recentActivity.push({
        timestamp: new Date(Date.now() - hoursAgo * 3600000),
        type: Math.random() > 0.3 ? 'validation' : 'reward_claimed',
        taskId: Math.random() > 0.3 ? Math.floor(Math.random() * 1000) : undefined,
        status: Math.random() > 0.05 ? 'success' : 'pending',
        amount: Math.random() > 0.5 ? (Math.random() * 0.1).toFixed(4) : undefined,
      });
    }

    operators.push({
      address: `0x${Math.random().toString(16).slice(2, 42)}`,
      name: OPERATOR_NAMES[i % OPERATOR_NAMES.length] + (i >= OPERATOR_NAMES.length ? ` ${Math.floor(i / OPERATOR_NAMES.length) + 1}` : ''),
      operatorId: `op_${i.toString().padStart(4, '0')}`,
      avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=${i}`,
      totalStake,
      restakingStrategies: operatorStrategies,
      reputation,
      totalValidations,
      successfulValidations: Math.floor(totalValidations * successRate),
      averageResponseTime: Math.floor(Math.random() * 2000 + 500), // 500-2500ms
      uptime: Math.random() * 2 + 98, // 98-100%
      joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 3600000), // Random date in past year
      isActive: Math.random() > 0.1, // 90% active
      recentActivity,
    });
  }

  // Sort by total stake descending
  return operators.sort((a, b) => parseFloat(b.totalStake) - parseFloat(a.totalStake));
}

/**
 * Generate AVS metrics
 */
export function generateAVSMetrics(operators: SimulatedOperator[]): AVSMetrics {
  const totalValueLocked = operators.reduce(
    (sum, op) => sum + parseFloat(op.totalStake),
    0
  ).toFixed(2);

  const activeOperators = operators.filter(op => op.isActive).length;

  const totalValidations = operators.reduce(
    (sum, op) => sum + op.totalValidations,
    0
  );

  const totalSuccessful = operators.reduce(
    (sum, op) => sum + op.successfulValidations,
    0
  );

  const avgConfidence = totalSuccessful / totalValidations * 100;

  return {
    totalValueLocked,
    operatorCount: activeOperators,
    activeValidations: Math.floor(Math.random() * 10 + 5), // 5-15 active
    totalValidationsCompleted: totalValidations,
    averageConfidenceScore: Math.round(avgConfidence),
    quorumThreshold: 67,
    uptimePercentage: 99.8,
  };
}

/**
 * Simulate real-time operator stake updates
 */
export function simulateStakeUpdate(operator: SimulatedOperator): SimulatedOperator {
  const change = (Math.random() - 0.5) * 10; // +/- 5 ETH
  const newStake = Math.max(100, parseFloat(operator.totalStake) + change);

  return {
    ...operator,
    totalStake: newStake.toFixed(2),
  };
}

/**
 * Simulate validation task processing
 */
export async function simulateValidation(
  taskId: number,
  operators: SimulatedOperator[],
  onProgress?: (stage: string, operator?: string) => void
): Promise<{
  taskId: number;
  isValid: boolean;
  confidenceScore: number;
  risks: string[];
  alternativeStrategy: string;
  participatingOperators: string[];
  signatures: string[];
  processingTime: number;
}> {
  const startTime = Date.now();

  // Select random operators for quorum (67% minimum)
  const quorumSize = Math.max(
    Math.ceil(operators.length * 0.67),
    3
  );

  const shuffled = [...operators].sort(() => Math.random() - 0.5);
  const selectedOperators = shuffled.slice(0, quorumSize);

  // Simulate validation process
  onProgress?.('task_received', 'Broadcasting task to operators...');
  await delay(800);

  const operatorResults = [];

  for (const operator of selectedOperators) {
    onProgress?.('validating', operator.name);

    // Simulate operator processing time
    await delay(operator.averageResponseTime);

    operatorResults.push({
      operator: operator.address,
      approved: Math.random() > 0.05, // 95% approval rate
      confidence: Math.floor(Math.random() * 20 + 80), // 80-100
    });

    onProgress?.('signature_received', operator.name);
  }

  // Aggregate results
  onProgress?.('aggregating', 'Aggregating signatures...');
  await delay(1000);

  const approvals = operatorResults.filter(r => r.approved).length;
  const avgConfidence = operatorResults.reduce((sum, r) => sum + r.confidence, 0) / operatorResults.length;

  const isValid = approvals >= quorumSize * 0.67;

  // Generate risks and alternatives
  const allRisks = [
    'High gas costs during peak hours',
    'Potential impermanent loss in liquidity pools',
    'Smart contract risk in newer protocols',
    'Slippage risk for large transactions',
    'Market volatility may affect returns',
    'Lock-up period reduces liquidity',
  ];

  const risks = allRisks
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 3) + 1);

  const alternatives = [
    'Consider waiting for gas prices to drop below 30 gwei',
    'Split transaction into smaller amounts to reduce slippage',
    'Utilize cross-chain bridges for lower fees',
    'Consider alternative protocols with similar APY but lower risk',
  ];

  onProgress?.('complete', 'Validation complete');
  await delay(500);

  return {
    taskId,
    isValid,
    confidenceScore: Math.round(avgConfidence),
    risks,
    alternativeStrategy: alternatives[Math.floor(Math.random() * alternatives.length)],
    participatingOperators: selectedOperators.map(op => op.address),
    signatures: selectedOperators.map(() => `0x${Math.random().toString(16).slice(2, 66)}`),
    processingTime: Date.now() - startTime,
  };
}

/**
 * Generate historical TVL data for charts
 */
export function generateHistoricalTVL(days: number = 30): { date: Date; tvl: number }[] {
  const data = [];
  const currentTVL = 3500; // Starting TVL

  for (let i = days; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 3600000);
    const randomVariation = (Math.random() - 0.5) * 200;
    const trend = (days - i) * 50; // Upward trend
    const tvl = currentTVL - trend + randomVariation;

    data.push({ date, tvl });
  }

  return data;
}

/**
 * Generate validation history data
 */
export function generateValidationHistory(count: number = 50): {
  taskId: number;
  timestamp: Date;
  confidenceScore: number;
  status: 'validated' | 'rejected';
  processingTime: number;
}[] {
  const history = [];

  for (let i = 0; i < count; i++) {
    const hoursAgo = Math.random() * 24 * 7; // Past week
    const confidence = Math.floor(Math.random() * 40 + 60); // 60-100

    history.push({
      taskId: 1000 + i,
      timestamp: new Date(Date.now() - hoursAgo * 3600000),
      confidenceScore: confidence,
      status: confidence >= 70 ? 'validated' as const : 'rejected' as const,
      processingTime: Math.floor(Math.random() * 5000 + 2000), // 2-7 seconds
    });
  }

  return history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

/**
 * Utility function for delays
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Demo scenarios for judges to test
 */
export const DEMO_SCENARIOS = [
  {
    id: 'conservative',
    name: 'Conservative Strategy',
    description: 'Low-risk staking with minimal gas costs',
    portfolio: {
      eethBalance: '10.5',
      weethBalance: '5.2',
      currentAPY: 3.8,
      gasPrice: 25,
    },
    strategy: {
      action: 'HOLD',
      amount: 0,
      protocol: 'EtherFi',
      reasoning: 'Current APY is optimal, gas prices are high',
    },
    expectedConfidence: 92,
  },
  {
    id: 'aggressive',
    name: 'High-Yield Strategy',
    description: 'Maximize returns with cross-protocol staking',
    portfolio: {
      eethBalance: '25.0',
      weethBalance: '0',
      currentAPY: 3.2,
      gasPrice: 15,
    },
    strategy: {
      action: 'STAKE_MORE',
      amount: 10,
      protocol: 'Lido',
      reasoning: 'Low gas, higher APY available on Lido (4.2%)',
    },
    expectedConfidence: 85,
  },
  {
    id: 'risky',
    name: 'Risky Reallocation',
    description: 'High gas, volatile market conditions',
    portfolio: {
      eethBalance: '50.0',
      weethBalance: '20.0',
      currentAPY: 3.5,
      gasPrice: 150,
    },
    strategy: {
      action: 'CONVERT_TO_WEETH',
      amount: 40,
      protocol: 'EtherFi',
      reasoning: 'Want to convert during high gas period',
    },
    expectedConfidence: 45,
  },
];
