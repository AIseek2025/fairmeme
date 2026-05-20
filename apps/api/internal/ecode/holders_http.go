package ecode

import (
	"github.com/zhufuyi/sponge/pkg/errcode"
)

// holders business-level http error codes.
// the holdersNO value range is 1~100, if the same error code is used, it will cause panic.
var (
	holdersNO       = 75
	holdersName     = "holders"
	holdersBaseCode = errcode.HCode(holdersNO)

	ErrCreateHolders     = errcode.NewError(holdersBaseCode+1, "failed to create "+holdersName)
	ErrDeleteByIDHolders = errcode.NewError(holdersBaseCode+2, "failed to delete "+holdersName)
	ErrUpdateByIDHolders = errcode.NewError(holdersBaseCode+3, "failed to update "+holdersName)
	ErrGetByIDHolders    = errcode.NewError(holdersBaseCode+4, "failed to get "+holdersName+" details")
	ErrListHolders       = errcode.NewError(holdersBaseCode+5, "failed to list of "+holdersName)

	// error codes are globally unique, adding 1 to the previous error code
)
