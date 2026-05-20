package model

import (
	"github.com/zhufuyi/sponge/pkg/ggorm"
)

type Token struct {
	ggorm.Model `gorm:"embedded"` // embed id and time

	TokenName           string  `gorm:"column:token_name;type:varchar(50);NOT NULL" json:"tokenName"`  // token名字
	ChainID             string  `gorm:"column:chain_id;type:varchar(20);NOT NULL" json:"chainId"`      // 链id
	TokenLogo           string  `gorm:"column:token_logo;type:varchar(255);NOT NULL" json:"tokenLogo"` // token图片
	TokenTicker         string  `gorm:"column:token_ticker;type:varchar(50);NOT NULL" json:"tokenTicker"`
	TokenDescribe       string  `gorm:"column:token_describe;type:varchar(255);NOT NULL" json:"tokenDescribe"` // token简洁
	AuctionTime         string  `gorm:"column:auction_time;type:varchar(255);NOT NULL" json:"auctionTime"`     // 拍卖周期
	WebSite             string  `gorm:"column:web_site;type:varchar(255);NOT NULL" json:"webSite"`
	TwitterUrl          string  `gorm:"column:twitter_url;type:varchar(255);NOT NULL" json:"twitterUrl"`
	TelegramUrl         string  `gorm:"column:telegram_url;type:varchar(255);NOT NULL" json:"telegramUrl"`
	TokenAddress        string  `gorm:"column:token_address;type:varchar(255);NOT NULL" json:"tokenAddress"`      // token地址
	Farcaster           string  `gorm:"column:farcaster;type:varchar(255);NOT NULL" json:"farcaster"`             // base链特有，其余为空
	TotalSupply         string  `gorm:"column:total_supply;type:varchar(255);NOT NULL" json:"totalSupply"`        // 发行总量
	StartBlock          int64   `gorm:"column:start_block;type:int8;NOT NULL" json:"startBlock"`                  // 起始区块
	Slot                int64   `gorm:"column:slot;type:int8;NOT NULL" json:"slot"`                               //
	TokenReleasePerSlot int64   `gorm:"column:tokenReleasePerSlot;type:int8;NOT NULL" json:"tokenReleasePerSlot"` //
	EndBlock            int64   `gorm:"column:end_block;type:int8;NOT NULL" json:"endBlock"`                      // 结束区块
	DevPurchase         int64   `gorm:"column:dev_purchase;type:int8;NOT NULL" json:"devPurchase"`                // 开发者比例，÷100
	InitialLiquidity    int64   `gorm:"column:initial_liquidity;type:int8;NOT NULL" json:"initialLiquidity"`      // 初始流动比例，÷100
	TokenPrice          string  `gorm:"column:token_price;type:numeric;NOT NULL" json:"tokenPrice"`               // 代币价格
	ViewCount           int64   `gorm:"column:view_count;type:int8;NOT NULL" json:"viewCount"`                    // 浏览量
	TokenReleased       int64   `gorm:"column:token_released;type:int8;NOT NULL" json:"tokenReleased"`            // 已释放量
	PairAddress         string  `gorm:"column:pair_address;type:varchar(255);NOT NULL" json:"pairAddress"`        // 交易对地址
	CreatorAddress      string  `gorm:"column:creator_address;type:varchar(255);NOT NULL" json:"creatorAddress"`  // 发币地址
	Fee                 int64   `gorm:"column:fee;type:int8;NOT NULL" json:"fee"`
	Price               float64 `gorm:"-" json:"price"`
	Balance             float64 `gorm:"-" json:"balance"`
}

// TableName table name
func (m *Token) TableName() string {
	return "token"
}
