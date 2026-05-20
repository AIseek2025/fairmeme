package types

import (
	"time"

	"github.com/zhufuyi/sponge/pkg/ggorm/query"
)

var _ time.Time

// Tip: suggested filling in the binding rules https://github.com/go-playground/validator in request struct fields tag.

// CreateTradeRequest request params
type CreateTradeRequest struct {
	Act            int    `json:"act" binding:""`         // 1 buy 2sell
	TradeAmount    string `json:"tradeAmount" binding:""` // 交易金额
	TokenAmount    int64  `json:"tokenAmount" binding:""` // 交易的代币数量
	Txn            string `json:"txn" binding:""`         // 交易hash
	TokenAddress   string `json:"tokenAddress" binding:""`
	CreatorAddress string `json:"creatorAddress" binding:""`
	Fee            int64  `json:"fee" binding:""`
}

// UpdateTradeByIDRequest request params
type UpdateTradeByIDRequest struct {
	ID uint64 `json:"id" binding:""` // uint64 id

	Act            int    `json:"act" binding:""`         // 1 buy 2sell
	TradeAmount    string `json:"tradeAmount" binding:""` // 交易金额
	TokenAmount    int64  `json:"tokenAmount" binding:""` // 交易的代币数量
	Txn            string `json:"txn" binding:""`         // 交易hash
	TokenAddress   string `json:"tokenAddress" binding:""`
	CreatorAddress string `json:"creatorAddress" binding:""`
	Fee            int64  `json:"fee" binding:""`
}

// TradeObjDetail detail
type TradeObjDetail struct {
	ID uint64 `json:"id"` // convert to uint64 id

	Act            int       `json:"act"`         // 1 buy 2sell
	TradeAmount    string    `json:"tradeAmount"` // 交易金额
	TokenAmount    int64     `json:"tokenAmount"` // 交易的代币数量
	Txn            string    `json:"txn"`         // 交易hash
	TokenAddress   string    `json:"tokenAddress"`
	CreatorAddress string    `json:"creatorAddress"`
	Fee            int64     `json:"fee"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
}

// CreateTradeRespond only for api docs
type CreateTradeRespond struct {
	Code int    `json:"code"` // return code
	Msg  string `json:"msg"`  // return information description
	Data struct {
		ID uint64 `json:"id"` // id
	} `json:"data"` // return data
}

// DeleteTradeByIDRespond only for api docs
type DeleteTradeByIDRespond struct {
	Result
}

// UpdateTradeByIDRespond only for api docs
type UpdateTradeByIDRespond struct {
	Result
}

// GetTradeByIDRespond only for api docs
type GetTradeByIDRespond struct {
	Code int    `json:"code"` // return code
	Msg  string `json:"msg"`  // return information description
	Data struct {
		Trade TradeObjDetail `json:"trade"`
	} `json:"data"` // return data
}

// ListTradesRequest request params
type ListTradesRequest struct {
	query.Params
}

// ListTradesRespond only for api docs
type ListTradesRespond struct {
	Code int    `json:"code"` // return code
	Msg  string `json:"msg"`  // return information description
	Data struct {
		Trades []TradeObjDetail `json:"trades"`
	} `json:"data"` // return data
}

// ListTradesRawRequest request params
type ListTradesRawRequest struct {
	Page  int    `json:"page" form:"page" binding:"gte=0"`
	Limit int    `json:"limit" form:"limit" binding:"gte=1"`
	Sort  string `json:"sort,omitempty" form:"sort" binding:""`

	Columns TradeObjDetail `json:"columns,omitempty" form:"columns"` // not required
}
