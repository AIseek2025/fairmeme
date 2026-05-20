package tokenprice

import (
	"context"
	"log/slog"

	"github.com/fair-meme/fairmeme/apps/airdrop/internal/db"
	"github.com/fair-meme/fairmeme/apps/airdrop/internal/services/coingecko"
)

type Price struct {
	TokenAddress string
	PriceUSD     float64
}

type Provider interface {
	// GetTokenPrices return list token prices given by token addresses list
	GetTokenPrices(ctx context.Context, tokenAddressList []string) ([]Price, error)

	// SupportedTokens gets list token supported by price service
	SupportedTokens() []TokenInfo
}

type TokenInfo struct {
	Address  string
	Decimals int
}

var _ Provider = &provider{}

type provider struct {
	logger *slog.Logger
	cgk    *coingecko.Client
	db     *db.Database
}

func NewProvider(logger *slog.Logger, cgk *coingecko.Client, db *db.Database) Provider {
	p := provider{
		cgk: cgk,
		db:  db,
	}
	return &p
}

// SupportedTokens implements Provider.
func (p *provider) SupportedTokens() []TokenInfo {
	addrs := p.cgk.ListTokenAddrs()
	tokenList, err := p.db.GetTokenList()
	if err != nil {
		p.logger.Error("Get token list from db failed", "err", err)
		return []TokenInfo{}
	}
	var results []TokenInfo
	for _, addr := range addrs {
		for _, token := range tokenList {
			if addr == token.Address {
				results = append(results, TokenInfo{
					Address:  addr,
					Decimals: token.Decimals,
				})
			}
		}
	}
	return results
}

// GetTokenPrices implements PriceProvider.
func (p *provider) GetTokenPrices(ctx context.Context, tokenAddressList []string) ([]Price, error) {
	var results []Price
	prices := p.cgk.GetTokenPrices(tokenAddressList)
	for _, price := range prices {
		results = append(results, Price{
			TokenAddress: price.Address,
			PriceUSD:     price.Price,
		})
	}
	return results, nil
}
