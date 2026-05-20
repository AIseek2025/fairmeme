package types

import (
	"time"

	"github.com/zhufuyi/sponge/pkg/ggorm/query"
)

var _ time.Time

// Tip: suggested filling in the binding rules https://github.com/go-playground/validator in request struct fields tag.

// CreateWatchRequest request params
type CreateWatchRequest struct {
	CreatorAddress string `json:"creatorAddress" binding:""`
	TokenAddress   string `json:"tokenAddress" binding:""`
}

// UpdateWatchByIDRequest request params
type UpdateWatchByIDRequest struct {
	ID uint64 `json:"id" binding:""` // uint64 id

	CreatorAddress string `json:"creatorAddress" binding:""`
	TokenAddress   string `json:"tokenAddress" binding:""`
}

// WatchObjDetail detail
type WatchObjDetail struct {
	ID uint64 `json:"id"` // convert to uint64 id

	CreatorAddress string    `json:"creatorAddress"`
	TokenAddress   string    `json:"tokenAddress"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
}

// CreateWatchRespond only for api docs
type CreateWatchRespond struct {
	Code int    `json:"code"` // return code
	Msg  string `json:"msg"`  // return information description
	Data struct {
		ID uint64 `json:"id"` // id
	} `json:"data"` // return data
}

// DeleteWatchByIDRespond only for api docs
type DeleteWatchByIDRespond struct {
	Result
}

// UpdateWatchByIDRespond only for api docs
type UpdateWatchByIDRespond struct {
	Result
}

// GetWatchByIDRespond only for api docs
type GetWatchByIDRespond struct {
	Code int    `json:"code"` // return code
	Msg  string `json:"msg"`  // return information description
	Data struct {
		Watch WatchObjDetail `json:"watch"`
	} `json:"data"` // return data
}

// ListWatchsRequest request params
type ListWatchsRequest struct {
	query.Params
}

// ListWatchsRespond only for api docs
type ListWatchsRespond struct {
	Code int    `json:"code"` // return code
	Msg  string `json:"msg"`  // return information description
	Data struct {
		Watchs []WatchObjDetail `json:"watchs"`
	} `json:"data"` // return data
}
