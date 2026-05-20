package business

import (
	"context"
	"encoding/json"
	"net/http"

	"gorm.io/gorm"
)

type Token struct {
	ID                   int64   `json:"id" gorm:"column:id"`
	TokenName            string  `json:"tokenName" gorm:"column:token_name"`
	ChainID              string  `json:"chainId" gorm:"column:chain_id"`
	TokenLogo            string  `json:"tokenLogo" gorm:"column:token_logo"`
	TokenTicker          string  `json:"tokenTicker" gorm:"column:token_ticker"`
	TokenDescribe        string  `json:"tokenDescribe" gorm:"column:token_describe"`
	AuctionTime          string  `json:"auctionTime" gorm:"column:auction_time"`
	WebSite              string  `json:"webSite" gorm:"column:web_site"`
	TwitterURL           string  `json:"twitterUrl" gorm:"column:twitter_url"`
	TelegramURL          string  `json:"telegramUrl" gorm:"column:telegram_url"`
	TokenAddress         string  `json:"tokenAddress" gorm:"column:token_address"`
	Farcaster            string  `json:"farcaster" gorm:"column:farcaster"`
	TotalSupply          string  `json:"totalSupply" gorm:"column:total_supply"`
	StartBlock           int64   `json:"startBlock" gorm:"column:start_block"`
	EndBlock             int64   `json:"endBlock" gorm:"column:end_block"`
	DevPurchase          int64   `json:"devPurchase" gorm:"column:dev_purchase"`
	InitialLiquidity     int64   `json:"initialLiquidity" gorm:"column:initial_liquidity"`
	TokenPrice           float64 `json:"tokenPrice" gorm:"column:token_price"`
	ViewCount            int64   `json:"viewCount" gorm:"column:view_count"`
	TokenReleased        int64   `json:"tokenReleased" gorm:"column:token_released"`
	PairAddress          string  `json:"pairAddress" gorm:"column:pair_address"`
	CreatorAddress       string  `json:"creatorAddress" gorm:"column:creator_address"`
	Fee                  int64   `json:"fee" gorm:"column:fee"`
	CreatedAt            int64   `json:"createdAt" gorm:"column:created_at"`
	UpdatedAt            int64   `json:"updatedAt" gorm:"column:updated_at"`
	TokenReleasePerBlock int64   `json:"tokenReleasePerBlock" gorm:"column:token_releasePerBlock"`
}

func (Token) TableName() string {
	return "token"
}

type TokenServer struct {
	ctx context.Context
	db  *gorm.DB
}

func NewTokenServer(ctx context.Context, db *gorm.DB) *TokenServer {
	return &TokenServer{
		ctx: ctx,
		db:  db,
	}
}

func (s *TokenServer) getTokenCount(ctx context.Context, creatorAddress string) (int64, error) {
	var count int64
	err := s.db.WithContext(ctx).
		Model(&Token{}).
		Where("creator_address = ? AND pair_address IS NOT NULL AND pair_address != ?", creatorAddress, "").
		Count(&count).Error

	if err != nil {
		return 0, err
	}
	return count, nil
}

func (s *TokenServer) respondWithError(w http.ResponseWriter, code int, message string) {
	s.respondWithJSON(w, code, Response{Code: -1, Msg: message, Data: nil})
}

func (s *TokenServer) respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(payload)
}
