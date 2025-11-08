/**
 * Task Generator - Submits validation tasks to AVS contract
 * Listens for user requests and creates on-chain validation tasks
 */

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Contract ABI (minimal - just what we need)
const CONTRACT_ABI = [
  "function createValidationTask((string,string,uint256,uint256,uint256),(uint8,string,string,uint256,uint256)) external returns (uint256)",
  "function getTask(uint256) external view returns (tuple(uint256 taskId, address user, tuple(string eethBalance, string weethBalance, uint256 currentAPY, uint256 gasPrice, uint256 timestamp) portfolio, tuple(uint8 action, string convertAmount, string reasoning, uint256 expectedGasCost, uint256 estimatedAPYImprovement) strategy, uint256 taskCreatedBlock, uint8 status))",
  "event NewValidationTask(uint256 indexed taskId, address indexed user, tuple(string,string,uint256,uint256,uint256), tuple(uint8,string,string,uint256,uint256), uint256)"
];

class TaskGenerator {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    this.contract = new ethers.Contract(
      process.env.AVS_CONTRACT_ADDRESS,
      CONTRACT_ABI,
      this.wallet
    );
  }

  /**
   * Submit a validation task to the AVS contract
   */
  async submitTask(portfolioData, proposedStrategy) {
    try {
      console.log('📤 Submitting validation task...');

      // Format portfolio data
      const portfolio = {
        eethBalance: portfolioData.eethBalance.toString(),
        weethBalance: portfolioData.weethBalance.toString(),
        currentAPY: portfolioData.currentAPY, // in basis points
        gasPrice: portfolioData.gasPrice, // in gwei
        timestamp: Math.floor(Date.now() / 1000)
      };

      // Format proposed strategy
      const strategy = {
        action: proposedStrategy.action, // 0=HOLD, 1=CONVERT_TO_WEETH, etc.
        convertAmount: proposedStrategy.convertAmount.toString(),
        reasoning: proposedStrategy.reasoning,
        expectedGasCost: ethers.parseEther(proposedStrategy.expectedGasCostETH.toString()),
        estimatedAPYImprovement: proposedStrategy.estimatedAPYImprovement
      };

      // Submit transaction
      const tx = await this.contract.createValidationTask(portfolio, strategy);
      console.log(`⏳ Transaction sent: ${tx.hash}`);

      const receipt = await tx.wait();
      console.log(`✅ Task submitted in block ${receipt.blockNumber}`);

      // Parse task ID from event
      const event = receipt.logs.find(log => {
        try {
          return this.contract.interface.parseLog(log).name === 'NewValidationTask';
        } catch {
          return false;
        }
      });

      if (event) {
        const parsedEvent = this.contract.interface.parseLog(event);
        const taskId = parsedEvent.args[0];
        console.log(`📋 Task ID: ${taskId}`);
        return { taskId: taskId.toString(), txHash: tx.hash };
      }

      return { txHash: tx.hash };
    } catch (error) {
      console.error('❌ Error submitting task:', error.message);
      throw error;
    }
  }

  /**
   * Get task details
   */
  async getTaskDetails(taskId) {
    try {
      const task = await this.contract.getTask(taskId);
      return {
        taskId: task.taskId.toString(),
        user: task.user,
        portfolio: {
          eethBalance: task.portfolio.eethBalance,
          weethBalance: task.portfolio.weethBalance,
          currentAPY: Number(task.portfolio.currentAPY),
          gasPrice: Number(task.portfolio.gasPrice),
          timestamp: Number(task.portfolio.timestamp)
        },
        strategy: {
          action: Number(task.strategy.action),
          convertAmount: task.strategy.convertAmount,
          reasoning: task.strategy.reasoning,
          expectedGasCost: ethers.formatEther(task.strategy.expectedGasCost),
          estimatedAPYImprovement: Number(task.strategy.estimatedAPYImprovement)
        },
        taskCreatedBlock: task.taskCreatedBlock.toString(),
        status: Number(task.status)
      };
    } catch (error) {
      console.error('❌ Error fetching task:', error.message);
      throw error;
    }
  }
}

// Example usage
async function main() {
  const generator = new TaskGenerator();

  // Example validation task
  const portfolioData = {
    eethBalance: "5.2",
    weethBalance: "0.0",
    currentAPY: 380, // 3.8% in basis points
    gasPrice: 45 // gwei
  };

  const proposedStrategy = {
    action: 1, // CONVERT_TO_WEETH
    convertAmount: "2.0",
    reasoning: "Diversification strategy: Convert 2 eETH to weETH for better DeFi integrations",
    expectedGasCostETH: "0.002",
    estimatedAPYImprovement: 30 // 0.3% in basis points
  };

  const result = await generator.submitTask(portfolioData, proposedStrategy);
  console.log('Result:', result);

  // Fetch task details
  if (result.taskId) {
    const taskDetails = await generator.getTaskDetails(result.taskId);
    console.log('Task Details:', JSON.stringify(taskDetails, null, 2));
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { TaskGenerator };
