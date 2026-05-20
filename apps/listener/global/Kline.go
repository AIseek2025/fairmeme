package global

import (
	"math/big"
)

// KLineResult 结构体用于存储最终的查询结果
type KLineResult struct {
	S        string    `json:"s"` // 状态`
	T        []int64   `json:"t"` // 时间戳数组
	C        []float64 `json:"c"` // Close 价格数组
	O        []float64 `json:"o"` // Open 价格数组
	H        []float64 `json:"h"` // High 价格数组
	L        []float64 `json:"l"` // Low 价格数组
	V        []float64 `json:"v"` // Low 价格数组
	NextTime int64     `json:"nextTime"`
}
type KPriceResult struct {
	TokenName string  `json:"tokenName"` // 状态`
	Price     float64 `json:"price"`     // Close 价格数组
}
type KLineResults struct {
	S        string       `json:"s"` // 状态`
	T        []int64      `json:"t"` // 时间戳数组
	C        []*big.Float `json:"c"` // Close 价格数组
	O        []*big.Float `json:"o"` // Open 价格数组
	H        []*big.Float `json:"h"` // High 价格数组
	L        []*big.Float `json:"l"` // Low 价格数组
	NextTime int64        `json:"nextTime"`
}
