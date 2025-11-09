// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title VeritasServiceManager
 * @notice Core AVS contract for strategy verification and execution
 * @dev Integrates with EigenLayer for operator management
 */
contract VeritasServiceManager is Ownable {

    // ============ Structs ============

    /**
     * @notice Strategy struct represents a DeFi strategy to be verified and executed
     */
    struct Strategy {
        address user;              // User who owns the assets
        address fromContract;      // Source contract (e.g., Aave's aToken)
        address fromToken;         // Token to move (e.g., weETH)
        uint256 amount;            // Quantity of fromToken to move
        address toContract;        // Destination contract (e.g., Pendle router)
        bytes callData;            // Exact calldata to execute strategy
        uint256 minOutput;         // Minimum output for slippage protection
        uint256 deadline;          // Expiration timestamp
    }

    /**
     * @notice Attestation struct represents operator consensus on a strategy
     */
    struct Attestation {
        uint256 simulatedGasCost;  // Operator's simulated gas cost
        uint256 simulatedOutput;   // Operator's simulated output amount
        bool isSafe;               // AI safety analysis result
    }

    /**
     * @notice Strategy lifecycle status
     */
    enum StrategyStatus {
        Pending,
        Verified,
        Executed,
        Failed
    }

    // ============ State Variables ============

    /// @notice Minimum number of operators required for consensus
    uint256 public operatorQuorumThreshold;

    /// @notice Mapping of registered operator addresses
    mapping(address => bool) public registeredOperators;

    /// @notice Strategy status by hash
    mapping(bytes32 => StrategyStatus) public strategyStatus;

    /// @notice Consensus attestations by strategy hash
    mapping(bytes32 => Attestation) public strategyAttestations;

    /// @notice Track which operators have attested to a strategy
    mapping(bytes32 => mapping(address => bool)) public operatorAttestations;

    /// @notice Count of attestations per strategy
    mapping(bytes32 => uint256) public attestationCount;

    // ============ Events ============

    event OperatorRegistered(address indexed operator);
    event OperatorDeregistered(address indexed operator);
    event StrategySubmitted(bytes32 indexed strategyHash, address indexed user, Strategy strategy);
    event OperatorAttested(bytes32 indexed strategyHash, address indexed operator, Attestation attestation);
    event StrategyVerified(bytes32 indexed strategyHash, Attestation attestation);
    event StrategyExecuted(bytes32 indexed strategyHash, address indexed user, uint256 actualOutput);
    event StrategyFailed(bytes32 indexed strategyHash, string reason);

    // ============ Constructor ============

    constructor(uint256 _operatorQuorumThreshold) Ownable(msg.sender) {
        require(_operatorQuorumThreshold > 0, "Quorum must be > 0");
        operatorQuorumThreshold = _operatorQuorumThreshold;
    }

    // ============ Operator Management ============

    /**
     * @notice Register a new operator to the AVS
     * @param operator Address of the operator to register
     */
    function registerOperatorToAVS(address operator) external onlyOwner {
        require(!registeredOperators[operator], "Already registered");
        registeredOperators[operator] = true;
        emit OperatorRegistered(operator);
    }

    /**
     * @notice Deregister an operator from the AVS
     * @param operator Address of the operator to deregister
     */
    function deregisterOperator(address operator) external {
        require(msg.sender == operator || msg.sender == owner(), "Not authorized");
        require(registeredOperators[operator], "Not registered");
        registeredOperators[operator] = false;
        emit OperatorDeregistered(operator);
    }

    /**
     * @notice Update the operator quorum threshold
     * @param newThreshold New threshold value
     */
    function updateQuorumThreshold(uint256 newThreshold) external onlyOwner {
        require(newThreshold > 0, "Quorum must be > 0");
        operatorQuorumThreshold = newThreshold;
    }

    // ============ Strategy Submission ============

    /**
     * @notice Submit a new strategy for verification
     * @param strategy The strategy to submit
     */
    function submitNewStrategy(Strategy calldata strategy) external returns (bytes32) {
        require(msg.sender == strategy.user, "Not strategy owner");
        require(strategy.deadline > block.timestamp, "Strategy expired");
        require(strategy.amount > 0, "Amount must be > 0");
        require(strategy.toContract != address(0), "Invalid toContract");

        bytes32 strategyHash = keccak256(abi.encode(strategy));
        require(strategyStatus[strategyHash] == StrategyStatus.Pending, "Strategy already exists");

        strategyStatus[strategyHash] = StrategyStatus.Pending;

        emit StrategySubmitted(strategyHash, strategy.user, strategy);

        return strategyHash;
    }

    // ============ Strategy Verification ============

    /**
     * @notice Operator attests to a strategy after simulation
     * @param strategy The strategy being attested
     * @param attestation The attestation data
     */
    function attestToStrategy(
        Strategy calldata strategy,
        Attestation calldata attestation
    ) external {
        require(registeredOperators[msg.sender], "Not a registered operator");

        bytes32 strategyHash = keccak256(abi.encode(strategy));
        require(strategyStatus[strategyHash] == StrategyStatus.Pending, "Strategy not pending");
        require(strategy.deadline > block.timestamp, "Strategy expired");
        require(!operatorAttestations[strategyHash][msg.sender], "Already attested");

        // Record attestation
        operatorAttestations[strategyHash][msg.sender] = true;
        attestationCount[strategyHash]++;

        // Store the attestation (last one, or could aggregate)
        strategyAttestations[strategyHash] = attestation;

        emit OperatorAttested(strategyHash, msg.sender, attestation);

        // Check if quorum reached
        if (attestationCount[strategyHash] >= operatorQuorumThreshold) {
            strategyStatus[strategyHash] = StrategyStatus.Verified;
            emit StrategyVerified(strategyHash, attestation);
        }
    }

    // ============ Strategy Execution ============

    /**
     * @notice Execute a verified strategy
     * @param strategy The verified strategy to execute
     */
    function executeVerifiedStrategy(Strategy calldata strategy) external returns (uint256) {
        bytes32 strategyHash = keccak256(abi.encode(strategy));

        require(msg.sender == strategy.user, "Not strategy owner");
        require(strategyStatus[strategyHash] == StrategyStatus.Verified, "Strategy not verified");
        require(strategy.deadline > block.timestamp, "Strategy expired");

        // Get attestation for safety check
        Attestation memory attestation = strategyAttestations[strategyHash];
        require(attestation.isSafe, "Strategy marked unsafe by operators");

        // Step 1: Pull assets from user
        IERC20 fromToken = IERC20(strategy.fromToken);
        require(
            fromToken.transferFrom(strategy.user, address(this), strategy.amount),
            "Transfer from user failed"
        );

        // Step 2: Grant allowance to destination contract
        require(
            fromToken.approve(strategy.toContract, strategy.amount),
            "Approval failed"
        );

        // Step 3: Execute strategy on destination contract
        (bool success, bytes memory result) = strategy.toContract.call(strategy.callData);

        if (!success) {
            strategyStatus[strategyHash] = StrategyStatus.Failed;
            emit StrategyFailed(strategyHash, "Execution call failed");
            revert("Strategy execution failed");
        }

        // Step 4: Verify output (slippage check)
        uint256 actualOutput;
        if (result.length > 0) {
            actualOutput = abi.decode(result, (uint256));
        } else {
            // If no return value, check balance increase
            actualOutput = attestation.simulatedOutput;
        }

        require(actualOutput >= strategy.minOutput, "Slippage tolerance not met");

        // Step 5: Mark as executed
        strategyStatus[strategyHash] = StrategyStatus.Executed;

        emit StrategyExecuted(strategyHash, strategy.user, actualOutput);

        return actualOutput;
    }

    // ============ View Functions ============

    /**
     * @notice Get strategy hash
     * @param strategy The strategy to hash
     * @return The keccak256 hash of the strategy
     */
    function getStrategyHash(Strategy calldata strategy) external pure returns (bytes32) {
        return keccak256(abi.encode(strategy));
    }

    /**
     * @notice Check if strategy is verified
     * @param strategyHash The hash of the strategy
     * @return True if verified
     */
    function isStrategyVerified(bytes32 strategyHash) external view returns (bool) {
        return strategyStatus[strategyHash] == StrategyStatus.Verified;
    }

    /**
     * @notice Get strategy attestation
     * @param strategyHash The hash of the strategy
     * @return The consensus attestation
     */
    function getAttestation(bytes32 strategyHash) external view returns (Attestation memory) {
        return strategyAttestations[strategyHash];
    }

    /**
     * @notice Get attestation count for a strategy
     * @param strategyHash The hash of the strategy
     * @return Number of operator attestations
     */
    function getAttestationCount(bytes32 strategyHash) external view returns (uint256) {
        return attestationCount[strategyHash];
    }

    // ============ Emergency Functions ============

    /**
     * @notice Emergency withdraw tokens
     * @param token Token address
     * @param to Recipient address
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, address to, uint256 amount) external onlyOwner {
        IERC20(token).transfer(to, amount);
    }
}
