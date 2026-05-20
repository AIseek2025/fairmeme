package types

import (
	"time"

	"github.com/zhufuyi/sponge/pkg/ggorm/query"
)

var _ time.Time

// Tip: suggested filling in the binding rules https://github.com/go-playground/validator in request struct fields tag.

// CreateLiquidityPoolsRequest request params
type CreateLiquidityPoolsRequest struct {
	Token0ID int64  `json:"token0ID" binding:""` // 为0时，代表原生token，需要查token表的chain_id来确定
	Token1ID int64  `json:"token1ID" binding:""` // 为0时，代表原生token，需要查token表的chain_id来确定
	Reserve0 string `json:"reserve0" binding:""` // token0池子流动量
	Reserve1 string `json:"reserve1" binding:""` // token1池子流动量
}

// UpdateLiquidityPoolsByIDRequest request params
type UpdateLiquidityPoolsByIDRequest struct {
	ID uint64 `json:"id" binding:""` // uint64 id

	Token0ID int64  `json:"token0ID" binding:""` // 为0时，代表原生token，需要查token表的chain_id来确定
	Token1ID int64  `json:"token1ID" binding:""` // 为0时，代表原生token，需要查token表的chain_id来确定
	Reserve0 string `json:"reserve0" binding:""` // token0池子流动量
	Reserve1 string `json:"reserve1" binding:""` // token1池子流动量
}

// LiquidityPoolsObjDetail detail
type LiquidityPoolsObjDetail struct {
	ID uint64 `json:"id"` // convert to uint64 id

	Token0ID  int64     `json:"token0ID"` // 为0时，代表原生token，需要查token表的chain_id来确定
	Token1ID  int64     `json:"token1ID"` // 为0时，代表原生token，需要查token表的chain_id来确定
	Reserve0  string    `json:"reserve0"` // token0池子流动量
	Reserve1  string    `json:"reserve1"` // token1池子流动量
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// CreateLiquidityPoolsRespond only for api docs
type CreateLiquidityPoolsRespond struct {
	Code int    `json:"code"` // return code
	Msg  string `json:"msg"`  // return information description
	Data struct {
		ID uint64 `json:"id"` // id
	} `json:"data"` // return data
}

// DeleteLiquidityPoolsByIDRespond only for api docs
type DeleteLiquidityPoolsByIDRespond struct {
	Result
}

// UpdateLiquidityPoolsByIDRespond only for api docs
type UpdateLiquidityPoolsByIDRespond struct {
	Result
}

// GetLiquidityPoolsByIDRespond only for api docs
type GetLiquidityPoolsByIDRespond struct {
	Code int    `json:"code"` // return code
	Msg  string `json:"msg"`  // return information description
	Data struct {
		LiquidityPools LiquidityPoolsObjDetail `json:"liquidityPools"`
	} `json:"data"` // return data
}

// ListLiquidityPoolssRequest request params
type ListLiquidityPoolssRequest struct {
	query.Params
}

// ListLiquidityPoolssRespond only for api docs
type ListLiquidityPoolssRespond struct {
	Code int    `json:"code"` // return code
	Msg  string `json:"msg"`  // return information description
	Data struct {
		LiquidityPoolss []LiquidityPoolsObjDetail `json:"liquidityPoolss"`
	} `json:"data"` // return data
}
