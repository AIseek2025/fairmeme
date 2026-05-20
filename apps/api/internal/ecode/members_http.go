package ecode

import (
	"github.com/zhufuyi/sponge/pkg/errcode"
)

// members business-level http error codes.
// the membersNO value range is 1~100, if the same error code is used, it will cause panic.
var (
	membersNO       = 37
	membersName     = "members"
	membersBaseCode = errcode.HCode(membersNO)

	ErrCreateMembers     = errcode.NewError(membersBaseCode+1, "failed to create "+membersName)
	ErrDeleteByIDMembers = errcode.NewError(membersBaseCode+2, "failed to delete "+membersName)
	ErrUpdateByIDMembers = errcode.NewError(membersBaseCode+3, "failed to update "+membersName)
	ErrGetByIDMembers    = errcode.NewError(membersBaseCode+4, "failed to get "+membersName+" details")
	ErrListMembers       = errcode.NewError(membersBaseCode+5, "failed to list of "+membersName)

	// error codes are globally unique, adding 1 to the previous error code
)
