package ecode

import (
	"github.com/zhufuyi/sponge/pkg/errcode"
)

// watch business-level http error codes.
// the watchNO value range is 1~100, if the same error code is used, it will cause panic.
var (
	watchNO       = 50
	watchName     = "watch"
	watchBaseCode = errcode.HCode(watchNO)

	ErrCreateWatch     = errcode.NewError(watchBaseCode+1, "failed to create "+watchName)
	ErrDeleteByIDWatch = errcode.NewError(watchBaseCode+2, "failed to delete "+watchName)
	ErrUpdateByIDWatch = errcode.NewError(watchBaseCode+3, "failed to update "+watchName)
	ErrGetByIDWatch    = errcode.NewError(watchBaseCode+4, "failed to get "+watchName+" details")
	ErrListWatch       = errcode.NewError(watchBaseCode+5, "failed to list of "+watchName)

	// error codes are globally unique, adding 1 to the previous error code
)
