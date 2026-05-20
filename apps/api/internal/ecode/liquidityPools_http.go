package ecode

import (
	"github.com/zhufuyi/sponge/pkg/errcode"
)

// liquidityPools business-level http error codes.
// the liquidityPoolsNO value range is 1~100, if the same error code is used, it will cause panic.
var (
	liquidityPoolsNO       = 90
	liquidityPoolsName     = "liquidityPools"
	liquidityPoolsBaseCode = errcode.HCode(liquidityPoolsNO)

	ErrCreateLiquidityPools     = errcode.NewError(liquidityPoolsBaseCode+1, "failed to create "+liquidityPoolsName)
	ErrDeleteByIDLiquidityPools = errcode.NewError(liquidityPoolsBaseCode+2, "failed to delete "+liquidityPoolsName)
	ErrUpdateByIDLiquidityPools = errcode.NewError(liquidityPoolsBaseCode+3, "failed to update "+liquidityPoolsName)
	ErrGetByIDLiquidityPools    = errcode.NewError(liquidityPoolsBaseCode+4, "failed to get "+liquidityPoolsName+" details")
	ErrListLiquidityPools       = errcode.NewError(liquidityPoolsBaseCode+5, "failed to list of "+liquidityPoolsName)

	// error codes are globally unique, adding 1 to the previous error code
)
