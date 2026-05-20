package types

import (
	"time"

	"github.com/zhufuyi/sponge/pkg/ggorm/query"
)

var _ time.Time

// Tip: suggested filling in the binding rules https://github.com/go-playground/validator in request struct fields tag.

// CreateMembersRequest request params
type CreateMembersRequest struct {
	CreatorAddress string `json:"creatorAddress" binding:""`
	MemberName     string `json:"memberName" binding:""`
	PictureUrl     string `json:"pictureUrl" binding:""`
	MemberStatus   int    `json:"memberStatus" binding:""`
	ChainID        string `json:"chainID" binding:""`
}

// UpdateMembersByIDRequest request params
type UpdateMembersByIDRequest struct {
	ID uint64 `json:"id" binding:""` // uint64 id

	CreatorAddress string `json:"creatorAddress" binding:""`
	MemberName     string `json:"memberName" binding:""`
	PictureUrl     string `json:"pictureUrl" binding:""`
	MemberStatus   int    `json:"memberStatus" binding:""`
	ChainID        string `json:"chainID" binding:""`
}

// MembersObjDetail detail
type MembersObjDetail struct {
	ID uint64 `json:"id"` // convert to uint64 id

	CreatorAddress string    `json:"creatorAddress"`
	MemberName     string    `json:"memberName"`
	PictureUrl     string    `json:"pictureUrl"`
	MemberStatus   int       `json:"memberStatus"`
	ChainID        string    `json:"chainID"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
}

// CreateMembersRespond only for api docs
type CreateMembersRespond struct {
	Code int    `json:"code"` // return code
	Msg  string `json:"msg"`  // return information description
	Data struct {
		ID uint64 `json:"id"` // id
	} `json:"data"` // return data
}

// DeleteMembersByIDRespond only for api docs
type DeleteMembersByIDRespond struct {
	Result
}

// UpdateMembersByIDRespond only for api docs
type UpdateMembersByIDRespond struct {
	Result
}

// GetMembersByIDRespond only for api docs
type GetMembersByIDRespond struct {
	Code int    `json:"code"` // return code
	Msg  string `json:"msg"`  // return information description
	Data struct {
		Members MembersObjDetail `json:"members"`
	} `json:"data"` // return data
}

// ListMemberssRequest request params
type ListMemberssRequest struct {
	query.Params
}

// ListMemberssRespond only for api docs
type ListMemberssRespond struct {
	Code int    `json:"code"` // return code
	Msg  string `json:"msg"`  // return information description
	Data struct {
		Memberss []MembersObjDetail `json:"memberss"`
	} `json:"data"` // return data
}
