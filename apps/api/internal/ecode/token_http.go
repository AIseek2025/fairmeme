package ecode

import (
	"github.com/zhufuyi/sponge/pkg/errcode"
)

// token business-level http error codes.
// the tokenNO value range is 1~100, if the same error code is used, it will cause panic.
var (
	tokenNO       = 15
	tokenName     = "token"
	tokenBaseCode = errcode.HCode(tokenNO)

	ErrCreateToken          = errcode.NewError(tokenBaseCode+1, "failed to create "+tokenName)
	ErrDeleteByIDToken      = errcode.NewError(tokenBaseCode+2, "failed to delete "+tokenName)
	ErrUpdateByIDToken      = errcode.NewError(tokenBaseCode+3, "failed to update "+tokenName)
	ErrGetByIDToken         = errcode.NewError(tokenBaseCode+4, "failed to get "+tokenName+" details")
	ErrListToken            = errcode.NewError(tokenBaseCode+5, "failed to list of "+tokenName)
	ErrInvalidParameterPair = errcode.NewError(tokenBaseCode+6, "both parameters must either be set or both be empty ")
	ErrInvalidTokenAddress  = errcode.NewError(tokenBaseCode+7, "param tokenAddress error"+tokenName)
	ErrInvalidSolAmount     = errcode.NewError(tokenBaseCode+8, "param solAmount error"+tokenName)
	ErrGetGuyPrice          = errcode.NewError(tokenBaseCode+9, "get buy price error")

	// error codes are globally unique, adding 1 to the previous error code
)
