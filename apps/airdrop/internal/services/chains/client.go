package chains

import (
	"context"
	"math/big"
	"time"
)

const (
	DefaulNetworkTimeout = 10 * time.Second

	// Chain name constants
	Solana            = "solana"
	Ethereum          = "eth"
	Base              = "base"
	BinanceSmartChain = "bsc"
)

type GetTokenBalanceAtBlockOpts struct {
	BlockNumber  *big.Int
	TokenAddress string
	UserAddress  string
}

type GetTotalUSDAtBlockResult struct {
	UserAddress string
	TotalUSD    *big.Float
}

type GetTotalUSDAtBlockOpts struct {
	UserAddress string
	BlockNumber *big.Int
}

type ClientInterface interface {
	// GetChainName gets name of chain client
	GetChainName() string

	// EstimateBlockAtTimestamp get block number at specific timestamp in seconds
	EstimateBlockAtTimestamp(ctx context.Context, timestamp int64) (*big.Int, error)

	// GetTotalUSDAtBlock returns total balance in usd of user address at sepecific block number
	GetTotalUSDAtBlock(ctx context.Context, opts *GetTotalUSDAtBlockOpts) (*GetTotalUSDAtBlockResult, error)
}
