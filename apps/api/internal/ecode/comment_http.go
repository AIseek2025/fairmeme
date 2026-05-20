package ecode

import (
	"github.com/zhufuyi/sponge/pkg/errcode"
)

// comment business-level http error codes.
// the commentNO value range is 1~100, if the same error code is used, it will cause panic.
var (
	commentNO       = 98
	commentName     = "comment"
	commentBaseCode = errcode.HCode(commentNO)

	ErrCreateComment     = errcode.NewError(commentBaseCode+1, "failed to create "+commentName)
	ErrDeleteByIDComment = errcode.NewError(commentBaseCode+2, "failed to delete "+commentName)
	ErrUpdateByIDComment = errcode.NewError(commentBaseCode+3, "failed to update "+commentName)
	ErrGetByIDComment    = errcode.NewError(commentBaseCode+4, "failed to get "+commentName+" details")
	ErrListComment       = errcode.NewError(commentBaseCode+5, "failed to list of "+commentName)

	// error codes are globally unique, adding 1 to the previous error code
)
