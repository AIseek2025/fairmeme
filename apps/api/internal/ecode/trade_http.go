package ecode

import (
	"github.com/zhufuyi/sponge/pkg/errcode"
)

// trade business-level http error codes.
// the tradeNO value range is 1~100, if the same error code is used, it will cause panic.
var (
	tradeNO       = 10
	tradeName     = "trade"
	tradeBaseCode = errcode.HCode(tradeNO)

	ErrCreateTrade     = errcode.NewError(tradeBaseCode+1, "failed to create "+tradeName)
	ErrDeleteByIDTrade = errcode.NewError(tradeBaseCode+2, "failed to delete "+tradeName)
	ErrUpdateByIDTrade = errcode.NewError(tradeBaseCode+3, "failed to update "+tradeName)
	ErrGetByIDTrade    = errcode.NewError(tradeBaseCode+4, "failed to get "+tradeName+" details")
	ErrListTrade       = errcode.NewError(tradeBaseCode+5, "failed to list of "+tradeName)

	// error codes are globally unique, adding 1 to the previous error code
)
