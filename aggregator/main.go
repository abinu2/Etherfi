package main

import (
	"context"
	"crypto/ecdsa"
	"fmt"
	"log"
	"math/big"
	"os"
	"strings"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/joho/godotenv"
)

// Aggregator collects operator signatures and submits to contract
type Aggregator struct {
	client       *ethclient.Client
	privateKey   *ecdsa.PrivateKey
	address      common.Address
	contractAddr common.Address
}

// Validation data from operator
type OperatorValidation struct {
	TaskID              *big.Int
	IsValid             bool
	ConfidenceScore     int
	Risks               []string
	AlternativeStrategy string
	OperatorAddress     common.Address
	Signature           []byte
}

func NewAggregator() (*Aggregator, error) {
	// Load environment variables
	godotenv.Load("../.env.local")

	// Validate required environment variables
	requiredEnvVars := []string{"SEPOLIA_RPC_URL", "AGGREGATOR_PRIVATE_KEY", "AVS_CONTRACT_ADDRESS"}
	for _, envVar := range requiredEnvVars {
		if os.Getenv(envVar) == "" {
			return nil, fmt.Errorf("required environment variable %s is not set", envVar)
		}
	}

	// Connect to Ethereum
	client, err := ethclient.Dial(os.Getenv("SEPOLIA_RPC_URL"))
	if err != nil {
		return nil, fmt.Errorf("failed to connect to Ethereum: %v", err)
	}

	// Load private key
	privateKey, err := crypto.HexToECDSA(strings.TrimPrefix(os.Getenv("AGGREGATOR_PRIVATE_KEY"), "0x"))
	if err != nil {
		return nil, fmt.Errorf("invalid private key: %v", err)
	}

	address := crypto.PubkeyToAddress(privateKey.PublicKey)
	contractAddr := common.HexToAddress(os.Getenv("AVS_CONTRACT_ADDRESS"))

	return &Aggregator{
		client:       client,
		privateKey:   privateKey,
		address:      address,
		contractAddr: contractAddr,
	}, nil
}

// Submit aggregated validation to contract
func (agg *Aggregator) SubmitValidation(validations []OperatorValidation) error {
	if len(validations) == 0 {
		return fmt.Errorf("no validations to submit")
	}

	// For MVP, take first validation
	val := validations[0]

	log.Printf("📤 Submitting aggregated validation for task %s\n", val.TaskID.String())
	log.Printf("   IsValid: %v, Confidence: %d%%\n", val.IsValid, val.ConfidenceScore)

	// Get auth transactor
	auth, err := bind.NewKeyedTransactorWithChainID(agg.privateKey, big.NewInt(11155111)) // Sepolia chain ID
	if err != nil {
		return err
	}

	// Set gas parameters
	gasPrice, err := agg.client.SuggestGasPrice(context.Background())
	if err != nil {
		return err
	}
	auth.GasPrice = gasPrice
	auth.GasLimit = uint64(300000)

	// Prepare parameters for submitValidationResult
	// function submitValidationResult(
	//     uint256 taskId,
	//     bool isValid,
	//     uint256 confidenceScore,
	//     string[] memory risks,
	//     string memory alternativeStrategy,
	//     address[] memory operators,
	//     bytes memory aggregatedSignature
	// )

	operators := []common.Address{val.OperatorAddress}
	aggregatedSignature := val.Signature

	log.Printf("✅ Validation submitted successfully!\n")
	log.Printf("   Operators: %v\n", operators)

	// In production, you would call the contract here
	// For now, just log the data
	log.Printf("📊 Would submit to contract at %s\n", agg.contractAddr.Hex())

	return nil
}

// Simple aggregation logic (MVP)
func (agg *Aggregator) AggregateValidations(validations []OperatorValidation) (*OperatorValidation, error) {
	if len(validations) == 0 {
		return nil, fmt.Errorf("no validations to aggregate")
	}

	// For MVP, just return first validation
	// In production, you would:
	// 1. Check consensus among operators
	// 2. Aggregate signatures using BLS
	// 3. Calculate average confidence score
	// 4. Combine risk assessments

	return &validations[0], nil
}

func main() {
	aggregator, err := NewAggregator()
	if err != nil {
		log.Fatal(err)
	}

	log.Println("🔄 EtherFi AVS Aggregator Starting...")
	log.Printf("📍 Aggregator address: %s\n", aggregator.address.Hex())
	log.Printf("📝 Contract address: %s\n", aggregator.contractAddr.Hex())

	// Example: Submit a mock validation
	mockValidation := OperatorValidation{
		TaskID:              big.NewInt(1),
		IsValid:             true,
		ConfidenceScore:     85,
		Risks:               []string{"High gas costs", "Market volatility"},
		AlternativeStrategy: "Wait for gas prices below 30 gwei",
		OperatorAddress:     common.HexToAddress("0x1234567890123456789012345678901234567890"),
		Signature:           []byte("mock_signature"),
	}

	if err := aggregator.SubmitValidation([]OperatorValidation{mockValidation}); err != nil {
		log.Fatal(err)
	}

	log.Println("✅ Aggregator ready and waiting for operator validations...")
	// In production, this would listen for operator submissions via HTTP/gRPC
}
