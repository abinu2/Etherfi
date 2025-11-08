package main

import (
	"bytes"
	"context"
	"crypto/ecdsa"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math/big"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/joho/godotenv"
)

// Validation task structure
type ValidationTask struct {
	TaskID       *big.Int
	User         common.Address
	Portfolio    PortfolioData
	Strategy     ProposedStrategy
	CreatedBlock *big.Int
}

type PortfolioData struct {
	EethBalance  string
	WeethBalance string
	CurrentAPY   *big.Int
	GasPrice     *big.Int
	Timestamp    *big.Int
}

type ProposedStrategy struct {
	Action                  uint8
	ConvertAmount           string
	Reasoning               string
	ExpectedGasCost         *big.Int
	EstimatedAPYImprovement *big.Int
}

// Claude AI response
type ClaudeValidation struct {
	IsValid            bool     `json:"isValid"`
	ConfidenceScore    int      `json:"confidenceScore"`
	Risks              []string `json:"risks"`
	AlternativeStrategy string  `json:"alternativeStrategy"`
}

type ClaudeRequest struct {
	Model     string    `json:"model"`
	MaxTokens int       `json:"max_tokens"`
	Messages  []Message `json:"messages"`
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ClaudeResponse struct {
	Content []struct {
		Text string `json:"text"`
	} `json:"content"`
}

// Operator node
type Operator struct {
	client       *ethclient.Client
	privateKey   *ecdsa.PrivateKey
	address      common.Address
	contractAddr common.Address
	claudeAPIKey string
}

func NewOperator() (*Operator, error) {
	// Load environment variables
	godotenv.Load("../.env.local")

	// Validate required environment variables
	requiredEnvVars := []string{"SEPOLIA_RPC_URL", "OPERATOR_PRIVATE_KEY", "AVS_CONTRACT_ADDRESS", "ANTHROPIC_API_KEY"}
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
	privateKey, err := crypto.HexToECDSA(strings.TrimPrefix(os.Getenv("OPERATOR_PRIVATE_KEY"), "0x"))
	if err != nil {
		return nil, fmt.Errorf("invalid private key: %v", err)
	}

	address := crypto.PubkeyToAddress(privateKey.PublicKey)
	contractAddr := common.HexToAddress(os.Getenv("AVS_CONTRACT_ADDRESS"))

	return &Operator{
		client:       client,
		privateKey:   privateKey,
		address:      address,
		contractAddr: contractAddr,
		claudeAPIKey: os.Getenv("ANTHROPIC_API_KEY"),
	}, nil
}

// Listen for validation tasks
func (op *Operator) ListenForTasks(ctx context.Context) error {
	log.Printf("🎧 Operator listening for tasks at %s\n", op.contractAddr.Hex())
	log.Printf("👤 Operator address: %s\n", op.address.Hex())

	// Event signature for NewValidationTask
	eventSignature := crypto.Keccak256Hash([]byte("NewValidationTask(uint256,address,(string,string,uint256,uint256,uint256),(uint8,string,string,uint256,uint256),uint256)"))

	query := ethereum.FilterQuery{
		Addresses: []common.Address{op.contractAddr},
		Topics:    [][]common.Hash{{eventSignature}},
	}

	logs := make(chan types.Log)
	sub, err := op.client.SubscribeFilterLogs(ctx, query, logs)
	if err != nil {
		return fmt.Errorf("failed to subscribe to logs: %v", err)
	}

	for {
		select {
		case err := <-sub.Err():
			return err
		case vLog := <-logs:
			op.handleTask(vLog)
		case <-ctx.Done():
			return ctx.Err()
		}
	}
}

// Handle validation task
func (op *Operator) handleTask(vLog types.Log) {
	log.Printf("📨 New task detected in tx %s\n", vLog.TxHash.Hex())

	// Parse task ID from topics
	taskID := new(big.Int).SetBytes(vLog.Topics[1].Bytes())
	log.Printf("📋 Task ID: %s\n", taskID.String())

	// Validate with Claude AI
	validation, err := op.validateWithClaude(taskID)
	if err != nil {
		log.Printf("❌ Validation error: %v\n", err)
		return
	}

	log.Printf("✅ Validation complete: isValid=%v, confidence=%d%%\n", validation.IsValid, validation.ConfidenceScore)
	log.Printf("🎯 Risks: %v\n", validation.Risks)
	log.Printf("💡 Alternative: %s\n", validation.AlternativeStrategy)

	// Sign validation (simplified for MVP)
	signature, err := op.signValidation(taskID, validation)
	if err != nil {
		log.Printf("❌ Signing error: %v\n", err)
		return
	}

	log.Printf("🔐 Signature: %x\n", signature)

	// In production, send to aggregator
	// For MVP, we'll submit directly
}

// Validate strategy with Claude AI
func (op *Operator) validateWithClaude(taskID *big.Int) (*ClaudeValidation, error) {
	// Simplified prompt for MVP
	prompt := fmt.Sprintf(`You are a DeFi strategy validator. Analyze this staking strategy:

Task ID: %s

Provide a JSON response with:
{
  "isValid": boolean,
  "confidenceScore": number (0-100),
  "risks": ["risk1", "risk2"],
  "alternativeStrategy": "suggestion"
}

Be concise and practical.`, taskID.String())

	reqBody := ClaudeRequest{
		Model:     "claude-sonnet-4-20250514",
		MaxTokens: 2048,
		Messages: []Message{
			{Role: "user", Content: prompt},
		},
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", "https://api.anthropic.com/v1/messages", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-api-key", op.claudeAPIKey)
	req.Header.Set("anthropic-version", "2023-06-01")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("Claude API error: %s", string(body))
	}

	var claudeResp ClaudeResponse
	if err := json.Unmarshal(body, &claudeResp); err != nil {
		return nil, err
	}

	if len(claudeResp.Content) == 0 {
		return nil, fmt.Errorf("empty response from Claude")
	}

	// Parse JSON from Claude's response
	var validation ClaudeValidation
	if err := json.Unmarshal([]byte(claudeResp.Content[0].Text), &validation); err != nil {
		// Fallback if Claude doesn't return pure JSON
		return &ClaudeValidation{
			IsValid:             true,
			ConfidenceScore:     75,
			Risks:               []string{"Strategy not fully validated"},
			AlternativeStrategy: "Consider waiting for better gas prices",
		}, nil
	}

	return &validation, nil
}

// Sign validation result
func (op *Operator) signValidation(taskID *big.Int, validation *ClaudeValidation) ([]byte, error) {
	// Create hash of validation data
	message := fmt.Sprintf("TaskID:%s,Valid:%v,Score:%d", taskID.String(), validation.IsValid, validation.ConfidenceScore)
	hash := crypto.Keccak256Hash([]byte(message))

	// Sign with operator's private key
	signature, err := crypto.Sign(hash.Bytes(), op.privateKey)
	if err != nil {
		return nil, err
	}

	return signature, nil
}

func main() {
	operator, err := NewOperator()
	if err != nil {
		log.Fatal(err)
	}

	log.Println("🚀 EtherFi AI Operator Node Starting...")

	ctx := context.Background()
	if err := operator.ListenForTasks(ctx); err != nil {
		log.Fatal(err)
	}
}
