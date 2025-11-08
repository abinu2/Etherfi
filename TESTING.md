# Testing Guide - EtherFi Strategy Validator AVS

This guide provides step-by-step instructions for setting up and testing the EtherFi AVS application.

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Go** 1.21+ ([Download](https://go.dev/dl/))
- **Foundry** (for smart contracts) ([Install](https://book.getfoundry.sh/getting-started/installation))
- **Sepolia Testnet ETH** ([Faucet](https://sepoliafaucet.com/))
- **Anthropic API Key** ([Get API Key](https://console.anthropic.com/))
- **Ethereum RPC URL** (Infura, Alchemy, or similar)

---

## Common Errors and Solutions

### Error: `npm ERR! ERESOLVE unable to resolve dependency tree`

**Cause**: ESLint version conflict between eslint@9.x and eslint-config-next@14.x

**Solution**: This has been fixed in the latest version. The package.json now uses `eslint@^8.57.1` which is compatible with `eslint-config-next@14.2.0`.

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

### Error: `Cannot find module 'dotenv'`

**Cause**: Missing dotenv dependency for task-generator

**Solution**: This has been fixed. The package.json now includes `dotenv@^16.4.5` as a dependency.

```bash
npm install
```

---

### Error: `missing go.sum entry for module`

**Cause**: Go modules need to download dependencies and generate go.sum files

**Solution**:
```bash
# For operator
cd operator
go mod tidy
go mod download
cd ..

# For aggregator
cd aggregator
go mod tidy
go mod download
cd ..
```

---

### Error: `ANTHROPIC_API_KEY is not configured`

**Cause**: Missing or incorrect environment variable configuration

**Solution**:
1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your actual values:
   ```env
   ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR-PROJECT-ID
   AVS_CONTRACT_ADDRESS=0x...
   PRIVATE_KEY=0x...
   OPERATOR_PRIVATE_KEY=0x...
   AGGREGATOR_PRIVATE_KEY=0x...
   ```

---

### TypeScript Errors: `Cannot find module 'react'` etc.

**Cause**: Dependencies not installed

**Solution**:
```bash
npm install
```

---

## Setup Instructions

### Step 1: Clone and Install

```bash
git clone https://github.com/abinu2/Etherfi.git
cd Etherfi

# Install Node.js dependencies
npm install

# Initialize Go modules for operator
cd operator
go mod tidy
go mod download
cd ..

# Initialize Go modules for aggregator
cd aggregator
go mod tidy
go mod download
cd ..
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit with your actual values
nano .env.local  # or use your preferred editor
```

**Required environment variables**:
- `ANTHROPIC_API_KEY` - Get from https://console.anthropic.com/
- `SEPOLIA_RPC_URL` - Get from Infura, Alchemy, or similar
- `AVS_CONTRACT_ADDRESS` - Deploy contract first (see Step 3)
- `PRIVATE_KEY` - For task generator
- `OPERATOR_PRIVATE_KEY` - For operator node
- `AGGREGATOR_PRIVATE_KEY` - For aggregator

### Step 3: Deploy Smart Contract (Optional)

```bash
cd contracts

# Install Foundry if not already installed
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Compile contract
forge build

# Deploy to Sepolia (replace $AGGREGATOR_ADDRESS with your aggregator wallet address)
forge create --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  EtherFiStrategyValidator \
  --constructor-args $AGGREGATOR_ADDRESS

# Copy the deployed contract address to .env.local
# Update both AVS_CONTRACT_ADDRESS and NEXT_PUBLIC_AVS_CONTRACT_ADDRESS
```

### Step 4: Verify Installation

```bash
# Test Next.js build
npm run build

# Test TypeScript compilation
npx tsc --noEmit

# Test operator build
cd operator && go build && cd ..

# Test aggregator build
cd aggregator && go build && cd ..
```

If all commands complete successfully, your environment is properly configured!

---

## Running the Application

### Terminal 1: Frontend (Next.js)

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

**Expected**:
- Landing page loads without errors
- Can navigate to /dashboard
- No console errors related to missing modules

### Terminal 2: Operator Node

```bash
cd operator
go run main.go
```

**Expected output**:
```
🚀 EtherFi AI Operator Node Starting...
🎧 Operator listening for tasks at 0x...
👤 Operator address: 0x...
```

**If you see errors**:
- ❌ `required environment variable X is not set` → Check your `.env.local` file
- ❌ `failed to connect to Ethereum` → Verify your `SEPOLIA_RPC_URL` is correct
- ❌ `invalid private key` → Check your `OPERATOR_PRIVATE_KEY` format (should start with 0x)

### Terminal 3: Aggregator

```bash
cd aggregator
go run main.go
```

**Expected output**:
```
🔄 EtherFi AVS Aggregator Starting...
📍 Aggregator address: 0x...
📝 Contract address: 0x...
✅ Aggregator ready and waiting for operator validations...
```

### Terminal 4: Task Generator (Optional)

```bash
npm run task-generator
```

This submits a test validation task to the contract.

---

## Testing Checklist

### Frontend Tests

- [ ] npm install completes without errors
- [ ] npm run dev starts successfully
- [ ] http://localhost:3000 loads
- [ ] No console errors about missing modules
- [ ] Can navigate to /dashboard
- [ ] TypeScript compilation succeeds (`npx tsc --noEmit`)

### Operator Tests

- [ ] go mod download completes
- [ ] go build succeeds
- [ ] go run main.go starts without errors
- [ ] All required environment variables are validated
- [ ] Connects to Ethereum successfully
- [ ] Listens for events on the contract

### Aggregator Tests

- [ ] go mod download completes
- [ ] go build succeeds
- [ ] go run main.go starts without errors
- [ ] Environment variables validated correctly
- [ ] Mock validation submission works

### Integration Tests

- [ ] Submit task from frontend
- [ ] Operator detects task event
- [ ] Claude AI validates strategy
- [ ] Aggregator collects signature
- [ ] Result submitted to contract
- [ ] Frontend displays validation result

---

## Debugging

### Enable Verbose Logging

**Go services**:
```go
// Add to main.go
log.SetFlags(log.LstdFlags | log.Lshortfile)
```

**Next.js**:
```bash
# Set in .env.local
DEBUG=*
NODE_ENV=development
```

### Check Network Connectivity

```bash
# Test RPC connection
curl -X POST $SEPOLIA_RPC_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# Test Claude API
curl https://api.anthropic.com/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{"model":"claude-sonnet-4-20250514","max_tokens":100,"messages":[{"role":"user","content":"Hello"}]}'
```

### Common Issues

**Issue**: Task generator fails with "Cannot find contract"
**Solution**: Make sure AVS_CONTRACT_ADDRESS is set in .env.local

**Issue**: Operator doesn't detect tasks
**Solution**:
- Verify contract address is correct
- Check operator is listening on correct network (Sepolia)
- Ensure task was actually submitted on-chain

**Issue**: Claude API returns 401
**Solution**: Check your ANTHROPIC_API_KEY is valid and not expired

---

## Performance Testing

### ETH Price Oracle

Test that CoinGecko integration works:

```bash
# In browser console on the dashboard
fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
  .then(r => r.json())
  .then(console.log)
```

Expected: `{ ethereum: { usd: XXXX } }`

### Gas Price Monitoring

Check that real-time gas prices are fetched:

```javascript
// In the frontend, check that gas prices update
// Should see values like 20-50 gwei for Sepolia
```

### AI Response Time

- Submit a validation request
- Measure time from submission to result
- Target: 30-60 seconds for complete validation

---

## Troubleshooting Matrix

| Symptom | Possible Cause | Solution |
|---------|---------------|----------|
| npm install fails | ESLint version conflict | Use eslint@8.57.1 (fixed in latest version) |
| dotenv error | Missing dependency | npm install (dotenv is now included) |
| go.sum errors | Dependencies not downloaded | Run `go mod tidy && go mod download` |
| TypeScript errors | node_modules not installed | Run `npm install` |
| API key errors | Missing .env.local | Copy .env.example to .env.local and configure |
| Contract not found | AVS not deployed | Deploy contract or use existing address |
| Operator not listening | Wrong network/RPC | Verify SEPOLIA_RPC_URL |
| No task detected | Event not emitted | Check transaction succeeded on Etherscan |

---

## Success Criteria

Your setup is complete when:

1. ✅ `npm install` completes without errors
2. ✅ `npm run dev` starts successfully
3. ✅ Frontend loads at http://localhost:3000
4. ✅ Operator starts and listens for events
5. ✅ Aggregator starts successfully
6. ✅ No environment variable errors
7. ✅ Can submit a validation task
8. ✅ Operator validates with Claude AI
9. ✅ Result is displayed in frontend

---

## Additional Resources

- **EigenLayer Docs**: https://docs.eigenlayer.xyz/
- **EtherFi Docs**: https://etherfi.gitbook.io/
- **Claude API Docs**: https://docs.anthropic.com/
- **Foundry Book**: https://book.getfoundry.sh/
- **Next.js Docs**: https://nextjs.org/docs

---

## Getting Help

If you encounter issues not covered in this guide:

1. Check the GitHub Issues: https://github.com/abinu2/Etherfi/issues
2. Review recent commits for fixes
3. Verify all prerequisites are installed
4. Double-check environment variables
5. Try a clean install: `rm -rf node_modules && npm install`

For Go module issues, try:
```bash
go clean -modcache
go mod tidy
go mod download
```
