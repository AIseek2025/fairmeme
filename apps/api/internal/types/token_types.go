package types

import (
	"time"

	"github.com/zhufuyi/sponge/pkg/ggorm/query"
)

var _ time.Time

// Tip: suggested filling in the binding rules https://github.com/go-playground/validator in request struct fields tag.

// CreateTokenRequest request params
type CreateTokenRequest struct {
	TokenName        string `json:"tokenName" binding:""` // token名字
	ChainID          string `json:"chainID" binding:""`   // 链id
	TokenLogo        string `json:"tokenLogo" binding:""` // token图片
	TokenTicker      string `json:"tokenTicker" binding:""`
	TokenDescribe    string `json:"tokenDescribe" binding:""` // token简洁
	AuctionTime      string `json:"auctionTime" binding:""`   // 拍卖周期
	WebSite          string `json:"webSite" binding:""`
	TwitterUrl       string `json:"twitterUrl" binding:""`
	TelegramUrl      string `json:"telegramUrl" binding:""`
	TokenAddress     string `json:"tokenAddress" binding:""`     // token地址
	Farcaster        string `json:"farcaster" binding:""`        // base链特有，其余为空
	TotalSupply      string `json:"totalSupply" binding:""`      // 发行总量
	StartBlock       int64  `json:"startBlock" binding:""`       // 起始区块
	EndBlock         int64  `json:"endBlock" binding:""`         // 结束区块
	DevPurchase      int64  `json:"devPurchase" binding:""`      // 开发者比例，÷100
	InitialLiquidity int64  `json:"initialLiquidity" binding:""` // 初始流动比例，÷100
	TokenPrice       int64  `json:"tokenPrice" binding:""`       // 代币价格
	TokenLiquidity   int64  `json:"tokenLiquidity" binding:""`   // 代币流动性
	ViewCount        int64  `json:"viewCount" binding:""`        // 浏览量
	TokenReleased    int64  `json:"tokenReleased" binding:""`    // 已释放量
	PairAddress      string `json:"pairAddress" binding:""`      // 交易对地址
	CreatorAddress   string `json:"creatorAddress" binding:""`   // 发币地址
	Fee              int64  `json:"fee" binding:""`
}

// UpdateTokenByIDRequest request params
type UpdateTokenByIDRequest struct {
	ID uint64 `json:"id" binding:""` // uint64 id

	TokenName        string `json:"tokenName" binding:""` // token名字
	ChainID          string `json:"chainID" binding:""`   // 链id
	TokenLogo        string `json:"tokenLogo" binding:""` // token图片
	TokenTicker      string `json:"tokenTicker" binding:""`
	TokenDescribe    string `json:"tokenDescribe" binding:""` // token简洁
	AuctionTime      string `json:"auctionTime" binding:""`   // 拍卖周期
	WebSite          string `json:"webSite" binding:""`
	TwitterUrl       string `json:"twitterUrl" binding:""`
	TelegramUrl      string `json:"telegramUrl" binding:""`
	TokenAddress     string `json:"tokenAddress" binding:""`     // token地址
	Farcaster        string `json:"farcaster" binding:""`        // base链特有，其余为空
	TotalSupply      string `json:"totalSupply" binding:""`      // 发行总量
	StartBlock       int64  `json:"startBlock" binding:""`       // 起始区块
	EndBlock         int64  `json:"endBlock" binding:""`         // 结束区块
	DevPurchase      int64  `json:"devPurchase" binding:""`      // 开发者比例，÷100
	InitialLiquidity int64  `json:"initialLiquidity" binding:""` // 初始流动比例，÷100
	TokenPrice       string `json:"tokenPrice" binding:""`       // 代币价格
	TokenLiquidity   string `json:"tokenLiquidity" binding:""`   // 代币流动性
	ViewCount        int64  `json:"viewCount" binding:""`        // 浏览量
	TokenReleased    int64  `json:"tokenReleased" binding:""`    // 已释放量
	PairAddress      string `json:"pairAddress" binding:""`      // 交易对地址
	CreatorAddress   string `json:"creatorAddress" binding:""`   // 发币地址
	Fee              int64  `json:"fee" binding:""`
}

// TokenObjDetail detail
type TokenObjDetail struct {
	ID uint64 `json:"id"` // convert to uint64 id

	TokenName        string    `json:"tokenName"` // token名字
	ChainID          string    `json:"chainID"`   // 链id
	TokenLogo        string    `json:"tokenLogo"` // token图片
	TokenTicker      string    `json:"tokenTicker"`
	TokenDescribe    string    `json:"tokenDescribe"` // token简洁
	AuctionTime      string    `json:"auctionTime"`   // 拍卖周期
	WebSite          string    `json:"webSite"`
	TwitterUrl       string    `json:"twitterUrl"`
	TelegramUrl      string    `json:"telegramUrl"`
	TokenAddress     string    `json:"tokenAddress"`     // token地址
	Farcaster        string    `json:"farcaster"`        // base链特有，其余为空
	TotalSupply      string    `json:"totalSupply"`      // 发行总量
	StartBlock       int64     `json:"startBlock"`       // 起始区块
	EndBlock         int64     `json:"endBlock"`         // 结束区块
	DevPurchase      int64     `json:"devPurchase"`      // 开发者比例，÷100
	InitialLiquidity int64     `json:"initialLiquidity"` // 初始流动比例，÷100
	TokenPrice       int64     `json:"tokenPrice"`       // 代币价格
	TokenLiquidity   int64     `json:"tokenLiquidity"`   // 代币流动性
	ViewCount        int64     `json:"viewCount"`        // 浏览量
	TokenReleased    int64     `json:"tokenReleased"`    // 已释放量
	PairAddress      string    `json:"pairAddress"`      // 交易对地址
	CreatorAddress   string    `json:"creatorAddress"`   // 发币地址
	Fee              int64     `json:"fee"`
	Price            float64   `json:"price"`
	Balance          float64   `json:"balance"`
	CreatedAt        time.Time `json:"createdAt"`
	UpdatedAt        time.Time `json:"updatedAt"`
}

// CreateTokenRespond only for api docs
type CreateTokenRespond struct {
	Code int    `json:"code"` // return code
	Msg  string `json:"msg"`  // return information description
	Data struct {
		ID uint64 `json:"id"` // id
	} `json:"data"` // return data
}

// DeleteTokenByIDRespond only for api docs
type DeleteTokenByIDRespond struct {
	Result
}

// UpdateTokenByIDRespond only for api docs
type UpdateTokenByIDRespond struct {
	Result
}

// GetTokenByIDRespond only for api docs
type GetTokenByIDRespond struct {
	Code int    `json:"code"` // return code
	Msg  string `json:"msg"`  // return information description
	Data struct {
		Token TokenObjDetail `json:"token"`
	} `json:"data"` // return data
}

// ListTokensRequest request params
type ListTokensRequest struct {
	query.Params
}

// ListTokensRespond only for api docs
type ListTokensRespond struct {
	Code int    `json:"code"` // return code
	Msg  string `json:"msg"`  // return information description
	Data struct {
		Tokens []TokenObjDetail `json:"tokens"`
	} `json:"data"` // return data
}

type TokenInfoRequest struct {
	TokenName   string `json:"tokenName" binding:""`
	MemberToken string `json:"memberToken" binding:""`
	ID          uint64 `json:"id" binding:""`
}

type ListTokenListColumns struct {
	Keyword string `json:"keyword" binding:""`
	ChainID string `json:"chainID" binding:""`
	Address string `json:"address" binding:""`
}

// ListTokensRawRequest request params
type ListTokensRawRequest struct {
	Page  int    `json:"page" form:"page" binding:"gte=0"`
	Limit int    `json:"limit" form:"limit" binding:"gte=1"`
	Sort  string `json:"sort,omitempty" form:"sort" binding:""`

	Columns ListTokenListColumns `json:"columns,omitempty" form:"columns"` // not required
}
