package coingecko

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"strings"
	"sync"
	"time"
)

const (
	DefaultApiUrl           = "https://pro-api.coingecko.com/api/v3"
	PublicApiUrl            = "https://api.coingecko.com/api/v3"
	DefaultGetPriceInterval = 5 * time.Minute
	cgkMaxPage              = 250
)

type Client struct {
	ctx    context.Context
	apiUrl string
	apiKey string
	logger *slog.Logger
	// A map between coingecko id and token address on solana
	idToSolanaAddrs map[string]string

	mu     sync.RWMutex
	prices map[string]*coinTracked
}

type coinTracked struct {
	CgkId   string
	Address string
	Price   *float64
}

type PriceInfo struct {
	Address string
	Price   float64
}

func (c *Client) GetTokenPrices(tokenAddressList []string) []PriceInfo {
	c.mu.RLock()
	defer c.mu.RUnlock()
	var results []PriceInfo
	for _, tokenAddress := range tokenAddressList {
		priceInfo, found := c.prices[tokenAddress]
		if !found {
			c.logger.Warn("price info not found", "token_address", tokenAddress)
			continue
		}
		if priceInfo.Price == nil {
			c.logger.Warn("price not available now", "token_address", tokenAddress)
			continue
		}
		results = append(results, PriceInfo{
			Address: tokenAddress,
			Price:   *priceInfo.Price,
		})
	}
	return results
}

func (c *Client) ListTokenAddrs() []string {
	var addrs []string
	for id := range c.idToSolanaAddrs {
		addrs = append(addrs, c.idToSolanaAddrs[id])
	}
	return addrs
}

func NewClient(ctx context.Context, logger *slog.Logger, apiUrl string, apiKey string) (*Client, error) {
	c := &Client{
		ctx:             ctx,
		apiUrl:          apiUrl,
		apiKey:          apiKey,
		logger:          logger,
		idToSolanaAddrs: map[string]string{},
	}
	if err := c.init(); err != nil {
		return nil, err
	}
	go c.runInternal()
	return c, nil
}

func (c *Client) runInternal() {
	ticker := time.NewTicker(DefaultGetPriceInterval)
	defer ticker.Stop()
	for {
		select {
		case <-c.ctx.Done():
			c.logger.Info("context done")
		case <-ticker.C:
			if err := c.updatePrices(); err != nil {
				c.logger.Error("Get and update prices from coingecko error", "err", err)
			}
		}
	}
}

type coinsListItem struct {
	Id        string            `json:"id"`
	Symbol    string            `json:"symbol"`
	Name      string            `json:"name"`
	Platforms map[string]string `json:"platforms"`
}

func (c *Client) init() error {
	solanaCoinsList, err := c.getSolanaCoinsWithoutNative()
	if err != nil {
		return err
	}
	var listIds []string
	for _, coin := range solanaCoinsList {
		c.idToSolanaAddrs[coin.Id] = coin.Platforms["solana"]
		listIds = append(listIds, coin.Id)
	}

	// Hardcode address for solana native token
	c.idToSolanaAddrs["solana"] = "SOL"
	listIds = append(listIds, "solana")

	markets, err := c.getCoinsMarket(listIds)
	if err != nil {
		return err
	}
	c.updatePricesWithMarkets(markets)
	return nil
}

func (c *Client) getCoinsMarket(listIds []string) ([]coinsMarketItem, error) {
	var (
		allItems []coinsMarketItem
		mu       sync.Mutex
		wg       sync.WaitGroup
		errChan  = make(chan error, len(listIds)/cgkMaxPage+1)
	)
	for i := 0; i < len(listIds); i += cgkMaxPage {
		wg.Add(1)
		end := i + cgkMaxPage
		if end > len(listIds) {
			end = len(listIds)
		}
		batch := listIds[i:end]

		go func(batch []string) {
			defer wg.Done()
			items, err := c.getCoinsMarketPerPage(batch)
			if err != nil {
				errChan <- err
				return
			}
			mu.Lock()
			allItems = append(allItems, items...)
			mu.Unlock()
		}(batch)
	}
	wg.Wait()
	close(errChan)
	for err := range errChan {
		if err != nil {
			return nil, err
		}
	}
	return allItems, nil
}

func (c *Client) getListIds() []string {
	var ids []string
	for id := range c.idToSolanaAddrs {
		ids = append(ids, id)
	}
	return ids
}

func (c *Client) updatePrices() error {
	ids := c.getListIds()
	markets, err := c.getCoinsMarket(ids)
	if err != nil {
		return err
	}
	c.mu.Lock()
	defer c.mu.Unlock()
	c.updatePricesWithMarkets(markets)
	return nil
}

func (c *Client) updatePricesWithMarkets(markets []coinsMarketItem) {
	c.prices = make(map[string]*coinTracked)
	for _, m := range markets {
		addr, ok := c.idToSolanaAddrs[m.Id]
		if !ok {
			c.logger.Info("id not found", "id", m.Id)
			continue
		}
		c.prices[addr] = &coinTracked{
			Address: addr,
			Price:   &m.CurrentPrice,
		}
	}
}

type coinsMarketItem struct {
	Id            string  `json:"id"`
	CurrentPrice  float64 `json:"current_price"`
	MarketCapRank *uint64 `json:"market_cap_rank"`
}

func (c *Client) getCoinsMarketPerPage(listIds []string) ([]coinsMarketItem, error) {
	if len(listIds) > cgkMaxPage {
		return nil, fmt.Errorf("list ids have limit %d items, got: %d", cgkMaxPage, len(listIds))
	}
	ids := strings.Join(listIds, ",")
	url := fmt.Sprintf("%s/coins/markets?vs_currency=usd&order=market_cap_desc&sparkline=false&per_page=%d&ids=%s", c.apiUrl, cgkMaxPage, ids)
	body, err := c.doRequest(url)
	if err != nil {
		return nil, err
	}
	var resp []coinsMarketItem
	if err := json.Unmarshal(body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

// getSolanaCoinsWithoutNative gets all coins have solana platform
func (c *Client) getSolanaCoinsWithoutNative() ([]coinsListItem, error) {
	coinsList, err := c.getCoinsList()
	if err != nil {
		return nil, err
	}
	var solanaCoinsList []coinsListItem
	for _, coin := range coinsList {
		if coin.Platforms == nil {
			continue
		}
		if _, ok := coin.Platforms["solana"]; ok {
			solanaCoinsList = append(solanaCoinsList, coin)
		}
	}
	return solanaCoinsList, nil
}

// getCoinsList gets all coins are active and supported by coingecko with include platform
func (c *Client) getCoinsList() ([]coinsListItem, error) {
	url := fmt.Sprintf("%s/coins/list?include_platform=true&active=true", c.apiUrl)
	body, err := c.doRequest(url)
	if err != nil {
		return nil, err
	}
	var resp []coinsListItem
	if err := json.Unmarshal(body, &resp); err != nil {
		return nil, err
	}
	return resp, nil
}

func (c *Client) doRequest(url string) ([]byte, error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Add("accept", "application/json")
	if c.apiKey != "" {
		req.Header.Add("x-cg-pro-api-key", c.apiKey)
	}
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
