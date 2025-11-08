// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title EtherFiStrategyValidator
 * @notice AVS contract that validates EtherFi staking strategies using AI operators
 * @dev Operators validate strategies off-chain with Claude AI and submit attestations
 */
contract EtherFiStrategyValidator {

    // ==================== STRUCTS ====================

    struct ValidationTask {
        uint256 taskId;
        address user;
        PortfolioData portfolio;
        ProposedStrategy strategy;
        uint256 taskCreatedBlock;
        TaskStatus status;
    }

    struct PortfolioData {
        string eethBalance;      // String to avoid precision loss
        string weethBalance;
        uint256 currentAPY;      // Basis points (380 = 3.8%)
        uint256 gasPrice;        // In gwei
        uint256 timestamp;
    }

    struct ProposedStrategy {
        StrategyAction action;
        string convertAmount;    // Amount to convert
        string reasoning;
        uint256 expectedGasCost; // In wei
        uint256 estimatedAPYImprovement; // Basis points
    }

    struct ValidationResult {
        uint256 taskId;
        bool isValid;
        uint256 confidenceScore;  // 0-100
        string[] risks;
        string alternativeStrategy;
        address[] operators;      // Operators who validated
        bytes aggregatedSignature;
        uint256 validatedAt;
    }

    enum StrategyAction {
        HOLD,
        CONVERT_TO_WEETH,
        CONVERT_TO_EETH,
        STAKE_MORE,
        UNSTAKE
    }

    enum TaskStatus {
        PENDING,
        VALIDATED,
        REJECTED,
        EXPIRED
    }

    // ==================== STATE VARIABLES ====================

    uint256 public nextTaskId;
    uint256 public constant TASK_EXPIRY_BLOCKS = 240; // ~1 hour at 15s blocks
    uint256 public constant MIN_CONFIDENCE_SCORE = 60;

    mapping(uint256 => ValidationTask) public tasks;
    mapping(uint256 => ValidationResult) public validationResults;
    mapping(address => bool) public registeredOperators;
    mapping(address => uint256) public operatorStake;

    uint256 public totalOperatorStake;
    address public owner;
    address public aggregator;

    // ==================== EVENTS ====================

    event NewValidationTask(
        uint256 indexed taskId,
        address indexed user,
        PortfolioData portfolio,
        ProposedStrategy strategy,
        uint256 taskCreatedBlock
    );

    event ValidationComplete(
        uint256 indexed taskId,
        bool isValid,
        uint256 confidenceScore,
        address[] operators,
        uint256 validatedAt
    );

    event OperatorRegistered(address indexed operator, uint256 stake);
    event OperatorDeregistered(address indexed operator);

    // ==================== MODIFIERS ====================

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyAggregator() {
        require(msg.sender == aggregator, "Only aggregator");
        _;
    }

    // ==================== CONSTRUCTOR ====================

    constructor(address _aggregator) {
        owner = msg.sender;
        aggregator = _aggregator;
        nextTaskId = 1;
    }

    // ==================== OPERATOR MANAGEMENT ====================

    function registerOperator() external payable {
        require(!registeredOperators[msg.sender], "Already registered");
        require(msg.value >= 0.1 ether, "Minimum 0.1 ETH stake required");

        registeredOperators[msg.sender] = true;
        operatorStake[msg.sender] = msg.value;
        totalOperatorStake += msg.value;

        emit OperatorRegistered(msg.sender, msg.value);
    }

    function deregisterOperator() external {
        require(registeredOperators[msg.sender], "Not registered");
        uint256 stake = operatorStake[msg.sender];

        registeredOperators[msg.sender] = false;
        operatorStake[msg.sender] = 0;
        totalOperatorStake -= stake;

        payable(msg.sender).transfer(stake);
        emit OperatorDeregistered(msg.sender);
    }

    // ==================== TASK SUBMISSION ====================

    function createValidationTask(
        PortfolioData memory portfolio,
        ProposedStrategy memory strategy
    ) external returns (uint256) {
        uint256 taskId = nextTaskId++;

        ValidationTask storage task = tasks[taskId];
        task.taskId = taskId;
        task.user = msg.sender;
        task.portfolio = portfolio;
        task.strategy = strategy;
        task.taskCreatedBlock = block.number;
        task.status = TaskStatus.PENDING;

        emit NewValidationTask(taskId, msg.sender, portfolio, strategy, block.number);
        return taskId;
    }

    // ==================== VALIDATION SUBMISSION ====================

    function submitValidationResult(
        uint256 taskId,
        bool isValid,
        uint256 confidenceScore,
        string[] memory risks,
        string memory alternativeStrategy,
        address[] memory operators,
        bytes memory aggregatedSignature
    ) external onlyAggregator {
        ValidationTask storage task = tasks[taskId];
        require(task.status == TaskStatus.PENDING, "Task not pending");
        require(block.number <= task.taskCreatedBlock + TASK_EXPIRY_BLOCKS, "Task expired");

        // Verify operators
        for (uint256 i = 0; i < operators.length; i++) {
            require(registeredOperators[operators[i]], "Invalid operator");
        }
        require(operators.length >= 1, "Need at least 1 operator");

        // Store validation result
        ValidationResult storage result = validationResults[taskId];
        result.taskId = taskId;
        result.isValid = isValid;
        result.confidenceScore = confidenceScore;
        result.risks = risks;
        result.alternativeStrategy = alternativeStrategy;
        result.operators = operators;
        result.aggregatedSignature = aggregatedSignature;
        result.validatedAt = block.timestamp;

        task.status = confidenceScore >= MIN_CONFIDENCE_SCORE
            ? TaskStatus.VALIDATED
            : TaskStatus.REJECTED;

        emit ValidationComplete(taskId, isValid, confidenceScore, operators, block.timestamp);
    }

    // ==================== VIEW FUNCTIONS ====================

    function getTask(uint256 taskId) external view returns (ValidationTask memory) {
        return tasks[taskId];
    }

    function getValidationResult(uint256 taskId) external view returns (ValidationResult memory) {
        return validationResults[taskId];
    }

    function isTaskExpired(uint256 taskId) external view returns (bool) {
        return block.number > tasks[taskId].taskCreatedBlock + TASK_EXPIRY_BLOCKS;
    }

    // ==================== ADMIN FUNCTIONS ====================

    function setAggregator(address _aggregator) external onlyOwner {
        aggregator = _aggregator;
    }
}
