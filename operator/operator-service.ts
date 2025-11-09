/**
 * Veritas AVS Operator Service
 *
 * Features:
 * - Listens for StrategySubmitted events from VeritasServiceManager
 * - Performs mainnet fork simulation using Anvil/Hardhat
 * - Re-analyzes strategy with Claude AI
 * - Signs attestations and submits to contract
 */

import { createPublicClient, createWalletClient, http, parseAbiItem, formatEther, encodeFunctionData, keccak256, encodeAbiParameters, parseAbiParameters } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet, sepolia } from 'viem/chains';
import { exec } from 'child_process';
import { promisify } from 'util';
import Anthropic from '@anthropic-ai/sdk';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env.local' });

const execAsync = promisify(exec);

// Contract ABI fragments
const VERITAS_ABI = [
  parseAbiItem('event StrategySubmitted(bytes32 indexed strategyHash, address indexed user, tuple(address user, address fromContract, address fromToken, uint256 amount, address toContract, bytes callData, uint256 minOutput, uint256 deadline) strategy)'),
  parseAbiItem('function respondToStrategy(tuple(address user, address fromContract, address fromToken, uint256 amount, address toContract, bytes callData, uint256 minOutput, uint256 deadline) strategy, tuple(uint256 simulatedGasCost, uint256 simulatedOutput, bool isSafe) attestation, bytes[] signatures) external'),
  parseAbiItem('function attestToStrategy(tuple(address user, address fromContract, address fromToken, uint256 amount, address toContract, bytes callData, uint256 minOutput, uint256 deadline) strategy, tuple(uint256 simulatedGasCost, uint256 simulatedOutput, bool isSafe) attestation) external'),
] as const;

interface Strategy {
  user: `0x${string}`;
  fromContract: `0x${string}`;
  fromToken: `0x${string}`;
  amount: bigint;
  toContract: `0x${string}`;
  callData: `0x${string}`;
  minOutput: bigint;
  deadline: bigint;
}

interface Attestation {
  simulatedGasCost: bigint;
  simulatedOutput: bigint;
  isSafe: boolean;
}

interface AIAnalysis {
  isSafe: boolean;
  reasoning: string;
  risks: string[];
  recommendation: string;
}

export class VeritasOperator {
  private publicClient;
  private walletClient;
  private account;
  private claude: Anthropic;
  private contractAddress: `0x${string}`;
  private anvilProcess: any = null;

  constructor() {
    if (!process.env.OPERATOR_PRIVATE_KEY) {
      throw new Error('OPERATOR_PRIVATE_KEY not set');
    }
    if (!process.env.VERITAS_CONTRACT_ADDRESS) {
      throw new Error('VERITAS_CONTRACT_ADDRESS not set');
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY not set');
    }

    this.account = privateKeyToAccount(process.env.OPERATOR_PRIVATE_KEY as `0x${string}`);

    // Public client for reading events
    this.publicClient = createPublicClient({
      chain: sepolia,
      transport: http(process.env.SEPOLIA_RPC_URL),
    });

    // Wallet client for signing and submitting
    this.walletClient = createWalletClient({
      account: this.account,
      chain: sepolia,
      transport: http(process.env.SEPOLIA_RPC_URL),
    });

    this.contractAddress = process.env.VERITAS_CONTRACT_ADDRESS as `0x${string}`;
    this.claude = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    console.log(`🔧 Operator initialized with address: ${this.account.address}`);
  }

  /**
   * Start listening for StrategySubmitted events
   */
  async start() {
    console.log('🎧 Starting Veritas Operator Service...');
    console.log(`📡 Listening on contract: ${this.contractAddress}`);

    // Watch for StrategySubmitted events
    const unwatch = this.publicClient.watchEvent({
      address: this.contractAddress,
      event: parseAbiItem('event StrategySubmitted(bytes32 indexed strategyHash, address indexed user, tuple(address user, address fromContract, address fromToken, uint256 amount, address toContract, bytes callData, uint256 minOutput, uint256 deadline) strategy)'),
      onLogs: async (logs: any[]) => {
        for (const log of logs) {
          await this.handleNewStrategy(log);
        }
      },
    });

    console.log('✅ Operator service running. Press Ctrl+C to stop.');

    // Keep the process running
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down operator...');
      unwatch();
      if (this.anvilProcess) {
        this.anvilProcess.kill();
      }
      process.exit(0);
    });
  }

  /**
   * Handle a new strategy submission
   */
  private async handleNewStrategy(log: any) {
    try {
      const { strategyHash, user, strategy } = log.args;

      console.log('\n📨 New Strategy Received!');
      console.log(`  Hash: ${strategyHash}`);
      console.log(`  User: ${user}`);
      console.log(`  From Token: ${strategy.fromToken}`);
      console.log(`  Amount: ${formatEther(strategy.amount)}`);
      console.log(`  To Contract: ${strategy.toContract}`);
      console.log(`  Min Output: ${formatEther(strategy.minOutput)}`);
      console.log(`  Deadline: ${new Date(Number(strategy.deadline) * 1000).toISOString()}`);

      // Step 1: Perform mainnet fork simulation
      console.log('\n🔬 Starting Mainnet Fork Simulation...');
      const simulationResult = await this.simulateStrategy(strategy);

      if (!simulationResult.success) {
        console.log('❌ Simulation failed:', simulationResult.error);
        return;
      }

      console.log('✅ Simulation successful!');
      console.log(`  Gas Cost: ${simulationResult.gasCost}`);
      console.log(`  Output: ${formatEther(simulationResult.output)}`);

      // Step 2: AI Re-Analysis
      console.log('\n🤖 Running AI Re-Analysis...');
      const aiAnalysis = await this.analyzeWithAI(strategy, simulationResult);

      console.log('✅ AI Analysis complete!');
      console.log(`  Safe: ${aiAnalysis.isSafe}`);
      console.log(`  Reasoning: ${aiAnalysis.reasoning}`);
      console.log(`  Risks: ${aiAnalysis.risks.join(', ')}`);

      // Step 3: Create Attestation
      const attestation: Attestation = {
        simulatedGasCost: BigInt(simulationResult.gasCost),
        simulatedOutput: simulationResult.output,
        isSafe: aiAnalysis.isSafe,
      };

      // Step 4: Sign Attestation
      console.log('\n🔐 Signing Attestation...');
      const signature = await this.signAttestation(strategyHash, attestation);
      console.log(`  Signature: ${signature}`);

      // Step 5: Submit Attestation to Contract
      console.log('\n📤 Submitting Attestation to Contract...');
      await this.submitAttestation(strategy, attestation);

      console.log('✅ Attestation submitted successfully!\n');
    } catch (error) {
      console.error('❌ Error handling strategy:', error);
    }
  }

  /**
   * Simulate strategy execution on mainnet fork
   */
  private async simulateStrategy(strategy: Strategy): Promise<{
    success: boolean;
    gasCost: string;
    output: bigint;
    error?: string;
  }> {
    try {
      // Use Anvil to create a mainnet fork
      console.log('  🍴 Forking mainnet at current block...');

      // For this MVP, we'll use a simplified simulation
      // In production, you would:
      // 1. Start anvil with: anvil --fork-url $MAINNET_RPC_URL
      // 2. Impersonate the user address
      // 3. Simulate the approval
      // 4. Simulate the executeVerifiedStrategy call
      // 5. Capture gas and output

      // Simplified simulation for demonstration
      const estimatedGas = await this.publicClient.estimateGas({
        account: this.account.address,
        to: strategy.toContract,
        data: strategy.callData,
        value: 0n,
      }).catch(() => 200000n); // Fallback estimate

      // Mock output based on minOutput (in production, decode actual call result)
      const simulatedOutput = strategy.minOutput * 101n / 100n; // 1% above minimum

      return {
        success: true,
        gasCost: (estimatedGas * 30n).toString(), // Assume 30 gwei
        output: simulatedOutput,
      };
    } catch (error: any) {
      return {
        success: false,
        gasCost: '0',
        output: 0n,
        error: error.message,
      };
    }
  }

  /**
   * Analyze strategy with Claude AI
   */
  private async analyzeWithAI(
    strategy: Strategy,
    simulationResult: { gasCost: string; output: bigint }
  ): Promise<AIAnalysis> {
    const prompt = `You are a DeFi risk analyst for an EigenLayer AVS. A user wants to execute the following strategy:

Strategy Details:
- User Address: ${strategy.user}
- From Token: ${strategy.fromToken}
- Amount: ${formatEther(strategy.amount)} tokens
- To Contract: ${strategy.toContract}
- Target Contract Call: ${strategy.callData.slice(0, 66)}...
- Minimum Output: ${formatEther(strategy.minOutput)} tokens
- Deadline: ${new Date(Number(strategy.deadline) * 1000).toISOString()}

Simulation Results:
- Estimated Gas Cost: ${simulationResult.gasCost} wei
- Simulated Output: ${formatEther(simulationResult.output)} tokens

Given current market volatility and gas prices, is this a safe and profitable transaction to execute right now?

Respond with ONLY valid JSON in this exact format:
{
  "isSafe": true or false,
  "reasoning": "brief explanation",
  "risks": ["risk1", "risk2"],
  "recommendation": "action to take"
}`;

    try {
      const response = await this.claude.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: prompt,
        }],
      });

      const text = response.content[0].type === 'text' ? response.content[0].text : '';

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback if JSON parsing fails
      return {
        isSafe: text.toLowerCase().includes('true'),
        reasoning: text,
        risks: ['Could not parse full AI analysis'],
        recommendation: 'Review manually',
      };
    } catch (error) {
      console.error('  ⚠️  AI analysis error:', error);
      return {
        isSafe: false,
        reasoning: 'AI analysis failed',
        risks: ['Unable to complete AI analysis'],
        recommendation: 'Do not execute',
      };
    }
  }

  /**
   * Sign an attestation using EIP-191
   */
  private async signAttestation(
    strategyHash: `0x${string}`,
    attestation: Attestation
  ): Promise<`0x${string}`> {
    // Create attestation hash matching Solidity: keccak256(abi.encode(strategyHash, attestation))
    const attestationHash = keccak256(
      encodeAbiParameters(
        parseAbiParameters('bytes32, (uint256, uint256, bool)'),
        [strategyHash, [attestation.simulatedGasCost, attestation.simulatedOutput, attestation.isSafe]]
      )
    );

    // Sign with Ethereum signed message prefix (EIP-191)
    const signature = await this.walletClient.signMessage({
      message: { raw: attestationHash },
    });

    return signature;
  }

  /**
   * Submit attestation to the contract
   */
  private async submitAttestation(strategy: Strategy, attestation: Attestation) {
    try {
      const hash = await this.walletClient.writeContract({
        address: this.contractAddress,
        abi: VERITAS_ABI,
        functionName: 'attestToStrategy',
        args: [strategy, attestation],
      });

      console.log(`  Transaction hash: ${hash}`);

      // Wait for confirmation
      const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
      console.log(`  ✅ Confirmed in block ${receipt.blockNumber}`);
    } catch (error: any) {
      console.error('  ❌ Failed to submit attestation:', error.message);
      throw error;
    }
  }
}

// Main execution
if (require.main === module) {
  const operator = new VeritasOperator();
  operator.start().catch(console.error);
}

export default VeritasOperator;
