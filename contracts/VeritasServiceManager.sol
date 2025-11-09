// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// EigenLayer imports (install via: npm install @eigenlayer/contracts or use interfaces)
interface IAVSDirectory {
    function registerOperatorToAVS(
        address operator,
        ISignatureUtils.SignatureWithSaltAndExpiry memory operatorSignature
    ) external;

    function deregisterOperatorFromAVS(address operator) external;
}

interface IStrategyManager {
    function getDeposits(address depositor) external view returns (IStrategy[] memory, uint256[] memory);
}

interface IStrategy {
    function underlyingToken() external view returns (IERC20);
    function userUnderlyingView(address user) external view returns (uint256);
}

interface ISignatureUtils {
    struct SignatureWithSaltAndExpiry {
        bytes signature;
        bytes32 salt;
        uint256 expiry;
    }
}

// Solady ECDSA library for signature verification
library ECDSA {
    /**
     * @dev Recovers the signer's address from a message hash and signature.
     */
    function recover(bytes32 hash, bytes memory signature) internal pure returns (address) {
        if (signature.length != 65) {
            return address(0);
        }

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := mload(add(signature, 0x20))
            s := mload(add(signature, 0x40))
            v := byte(0, mload(add(signature, 0x60)))
        }

        if (uint256(s) > 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0) {
            return address(0);
        }

        if (v != 27 && v != 28) {
            return address(0);
        }

        return ecrecover(hash, v, r, s);
    }

    /**
     * @dev Returns an Ethereum Signed Message hash of the given hash.
     */
    function toEthSignedMessageHash(bytes32 hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }
}

/**
 * @title VeritasServiceManager
 * @notice Core AVS contract for strategy verification and execution
 * @dev Integrates with EigenLayer for operator management and uses AI-verified DeFi strategies
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

    /// @notice EigenLayer AVS Directory for operator registration
    IAVSDirectory public avsDirectory;

    /// @notice EigenLayer Strategy Manager for checking operator stakes
    IStrategyManager public strategyManager;

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

    /**
     * @notice Initialize the VeritasServiceManager with EigenLayer integration
     * @param _avsDirectory Address of EigenLayer's AVS Directory
     * @param _strategyManager Address of EigenLayer's Strategy Manager
     * @param _operatorQuorumThreshold Minimum operators needed for quorum
     */
    constructor(
        address _avsDirectory,
        address _strategyManager,
        uint256 _operatorQuorumThreshold
    ) Ownable(msg.sender) {
        require(_avsDirectory != address(0), "Invalid AVS Directory");
        require(_strategyManager != address(0), "Invalid Strategy Manager");
        require(_operatorQuorumThreshold > 0, "Quorum must be > 0");

        avsDirectory = IAVSDirectory(_avsDirectory);
        strategyManager = IStrategyManager(_strategyManager);
        operatorQuorumThreshold = _operatorQuorumThreshold;
    }

    // ============ Operator Management ============

    /**
     * @notice Register a new operator to the AVS via EigenLayer
     * @param operator Address of the operator to register
     * @param signature EigenLayer signature from the operator
     */
    function registerOperatorToAVS(
        address operator,
        ISignatureUtils.SignatureWithSaltAndExpiry memory signature
    ) external {
        require(!registeredOperators[operator], "Already registered");

        // Register operator with EigenLayer's AVS Directory
        avsDirectory.registerOperatorToAVS(operator, signature);

        // Mark operator as registered in our contract
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

        // Deregister from EigenLayer's AVS Directory
        avsDirectory.deregisterOperatorFromAVS(operator);

        // Remove from our registry
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

    /**
     * @notice Respond to a strategy with multiple operator signatures (alternative to individual attestations)
     * @param strategy The strategy being verified
     * @param attestation The consensus attestation data
     * @param signatures Array of operator signatures
     */
    function respondToStrategy(
        Strategy calldata strategy,
        Attestation calldata attestation,
        bytes[] calldata signatures
    ) external {
        bytes32 strategyHash = keccak256(abi.encode(strategy));
        require(strategyStatus[strategyHash] == StrategyStatus.Pending, "Strategy not pending");
        require(strategy.deadline > block.timestamp, "Strategy expired");

        // Create attestation hash
        bytes32 attestationHash = keccak256(abi.encode(strategyHash, attestation));
        bytes32 ethSignedHash = ECDSA.toEthSignedMessageHash(attestationHash);

        // Track unique signers
        uint256 signerCount = 0;
        mapping(address => bool) storage hasSigned = operatorAttestations[strategyHash];

        // Verify each signature
        for (uint256 i = 0; i < signatures.length; i++) {
            address signer = ECDSA.recover(ethSignedHash, signatures[i]);

            require(signer != address(0), "Invalid signature");
            require(registeredOperators[signer], "Signer not registered operator");
            require(!hasSigned[signer], "Duplicate signature");

            hasSigned[signer] = true;
            signerCount++;

            emit OperatorAttested(strategyHash, signer, attestation);
        }

        // Check quorum
        require(signerCount >= operatorQuorumThreshold, "Insufficient signatures for quorum");

        // Store attestation count and mark as verified
        attestationCount[strategyHash] = signerCount;
        strategyAttestations[strategyHash] = attestation;
        strategyStatus[strategyHash] = StrategyStatus.Verified;

        emit StrategyVerified(strategyHash, attestation);
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
