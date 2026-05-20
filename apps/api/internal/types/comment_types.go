package types

import (
	"encoding/json"
	"time"

	"github.com/zhufuyi/sponge/pkg/ggorm/query"
)

var _ time.Time

// Tip: suggested filling in the binding rules https://github.com/go-playground/validator in request struct fields tag.

// CreateCommentRequest request params
type CreateCommentRequest struct {
	TokenAddress   string   `json:"tokenAddress" binding:""`   // 代币地址
	CreatorAddress string   `json:"creatorAddress" binding:""` // 评论人地址
	Images         []string `json:"images" binding:""`         // 评论内容
	Text           string   `json:"text" binding:""`           // 评论内容
}

// CommentObjDetail detail
type CommentObjDetail struct {
	ID uint64 `json:"id"` // convert to uint64 id

	TokenAddress   string          `json:"tokenAddress"`   // 代币地址
	CreatorAddress string          `json:"creatorAddress"` // 评论人地址
	CommentContent json.RawMessage `json:"commentContent"` // 评论内容
	CreatedAt      time.Time       `json:"createdAt"`
	UpdatedAt      time.Time       `json:"updatedAt"`
}

// CreateCommentRespond only for api docs
type CreateCommentRespond struct {
	Code int    `json:"code"` // return code
	Msg  string `json:"msg"`  // return information description
	Data struct {
		ID uint64 `json:"id"` // id
	} `json:"data"` // return data
}

// ListCommentsRequest request params
type ListCommentsRequest struct {
	query.Params
}

// ListCommentsRawRequest request params
type ListCommentsRawRequest struct {
	Page  int    `json:"page" form:"page" binding:"gte=0"`
	Limit int    `json:"limit" form:"limit" binding:"gte=1"`
	Sort  string `json:"sort,omitempty" form:"sort" binding:""`

	Columns CommentObjDetail `json:"columns,omitempty" form:"columns"` // not required
}
