package types

import (
	"time"

	"github.com/zhufuyi/sponge/pkg/ggorm/query"
)

var _ time.Time

// Tip: suggested filling in the binding rules https://github.com/go-playground/validator in request struct fields tag.

// CreateHoldersRequest request params
type CreateHoldersRequest struct {
	CreatorAddress string `json:"creatorAddress" binding:""` // 持有人地址
	TokenAddress   string `json:"tokenAddress" binding:""`   // 代币地址
	Balance        string `json:"balance" binding:""`        // 持仓
	Cost           string `json:"cost" binding:""`           // 买入交易使用的代币总量
	Sold           string `json:"sold" binding:""`           // 卖出交易使用的代币总量
}

// UpdateHoldersByIDRequest request params
type UpdateHoldersByIDRequest struct {
	ID uint64 `json:"id" binding:""` // uint64 id

	CreatorAddress string `json:"creatorAddress" binding:""` // 持有人地址
	TokenAddress   string `json:"tokenAddress" binding:""`   // 代币地址
	Balance        string `json:"balance" binding:""`        // 持仓
	Cost           string `json:"cost" binding:""`           // 买入交易使用的代币总量
	Sold           string `json:"sold" binding:""`           // 卖出交易使用的代币总量
}

// HoldersObjDetail detail
type HoldersObjDetail struct {
	ID uint64 `json:"id"` // convert to uint64 id

	CreatorAddress string    `json:"creatorAddress"` // 持有人地址
	TokenAddress   string    `json:"tokenAddress"`   // 代币地址
	Balance        string    `json:"balance"`        // 持仓
	Cost           string    `json:"cost"`           // 买入交易使用的代币总量
	Sold           string    `json:"sold"`           // 卖出交易使用的代币总量
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
}

// CreateHoldersRespond only for api docs
type CreateHoldersRespond struct {
	Code int    `json:"code"` // return code
	Msg  string `json:"msg"`  // return information description
	Data struct {
		ID uint64 `json:"id"` // id
	} `json:"data"` // return data
}

// DeleteHoldersByIDRespond only for api docs
type DeleteHoldersByIDRespond struct {
	Result
}

// UpdateHoldersByIDRespond only for api docs
type UpdateHoldersByIDRespond struct {
	Result
}

// GetHoldersByIDRespond only for api docs
type GetHoldersByIDRespond struct {
	Code int    `json:"code"` // return code
	Msg  string `json:"msg"`  // return information description
	Data struct {
		Holders HoldersObjDetail `json:"holders"`
	} `json:"data"` // return data
}

// ListHolderssRequest request params
type ListHolderssRequest struct {
	query.Params
}

// ListHolderssRespond only for api docs
type ListHolderssRespond struct {
	Code int    `json:"code"` // return code
	Msg  string `json:"msg"`  // return information description
	Data struct {
		Holderss []HoldersObjDetail `json:"holderss"`
	} `json:"data"` // return data
}

// ListHoldersRawRequest request params
type ListHoldersRawRequest struct {
	Page  int    `json:"page" form:"page" binding:"gte=0"`
	Limit int    `json:"limit" form:"limit" binding:"gte=1"`
	Sort  string `json:"sort,omitempty" form:"sort" binding:""`

	Columns HoldersObjDetail `json:"columns,omitempty" form:"columns"` // not required
}
