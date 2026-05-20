package eth

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"math/big"
	"net/http"

	"github.com/fair-meme/fairmeme/apps/airdrop/internal/services/chains"

	"github.com/ethereum/go-ethereum/ethclient"
)

const (
	morailsApiUrl = "https://deep-index.moralis.io/api/v2.2"
)

type Service struct {
	chainName     string
	rpcUrl        string
	logger        *slog.Logger
	client        *ethclient.Client
	moralisApiKey string
}

// GetTotalUSDAtBlock implements chains.ClientInterface.
func (c *Service) GetTotalUSDAtBlock(ctx context.Context, opts *chains.GetTotalUSDAtBlockOpts) (*chains.GetTotalUSDAtBlockResult, error) {
	totalUsdResult, err := c.getTotalTokensUSD(ctx, c.chainName, opts.BlockNumber, opts.UserAddress)
	if err != nil {
		return nil, err
	}
	return &chains.GetTotalUSDAtBlockResult{
		UserAddress: opts.UserAddress,
		TotalUSD:    totalUsdResult,
	}, nil
}

// EstimateBlockAtTimestamp implements chains.ClientInterface.
func (c *Service) EstimateBlockAtTimestamp(ctx context.Context, timestamp int64) (*big.Int, error) {
	url := fmt.Sprintf("%s/dateToBlock?chain=%s&date=%d", morailsApiUrl, c.chainName, timestamp)

	body, err := c.doGetRequest(ctx, url)
	if err != nil {
		return nil, err
	}

	type response struct {
		Block int64 `json:"block"`
	}
	var resp response
	if err := json.Unmarshal(body, &resp); err != nil {
		return nil, err
	}
	return big.NewInt(resp.Block), nil
}

// GetChainName implements chains.ClientInterface.
func (c *Service) GetChainName() string {
	return c.chainName
}

func (c *Service) ChainName() string {
	return c.chainName
}

func NewService(logger *slog.Logger, chainName string, rpcUrl string, morailsApiKey string) (*Service, error) {
	c := &Service{
		chainName:     chainName,
		logger:        logger,
		rpcUrl:        rpcUrl,
		moralisApiKey: morailsApiKey,
	}
	client, err := ethclient.Dial(rpcUrl)
	if err != nil {
		return nil, err
	}
	c.client = client
	return c, nil
}

var _ chains.ClientInterface = &Service{}

// getTotalTokensUSD get token balances for a specific wallet address and their token prices in USD with limit 100 items.
func (c *Service) getTotalTokensUSD(ctx context.Context, chain string, block *big.Int, wallet string) (*big.Float, error) {
	url := fmt.Sprintf("%s/wallets/%s/tokens?chain=%s&block=%d&limit=100", morailsApiUrl, wallet, chain, block.Int64())
	body, err := c.doGetRequest(ctx, url)
	if err != nil {
		return nil, err
	}

	type resultItem struct {
		TokenAddress string  `json:"token_address"`
		UsdValue     float64 `json:"usd_value"`
	}

	type response struct {
		Result []resultItem `json:"result"`
	}

	var resp response
	if err := json.Unmarshal(body, &resp); err != nil {
		return nil, err
	}
	var totalUsd float64
	for _, result := range resp.Result {
		totalUsd += result.UsdValue
	}

	return big.NewFloat(totalUsd), nil
}

// doGetRequest does a get request with given url.
func (c *Service) doGetRequest(ctx context.Context, url string) ([]byte, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Add("Accept", "application/json")
	req.Header.Add("X-API-Key", c.moralisApiKey)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}
	return body, nil
}
