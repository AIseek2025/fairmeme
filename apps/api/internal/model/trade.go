package model

import (
	"github.com/zhufuyi/sponge/pkg/ggorm"
)

type Trade struct {
	ggorm.Model `gorm:"embedded"` // embed id and time

	Act            int    `gorm:"column:act;type:int2;NOT NULL" json:"act"`                     // 1 buy 2sell
	TradeAmount    string `gorm:"column:trade_amount;type:numeric;NOT NULL" json:"tradeAmount"` // 交易金额
	TokenAmount    int64  `gorm:"column:token_amount;type:int8;NOT NULL" json:"tokenAmount"`    // 交易的代币数量
	Txn            string `gorm:"column:txn;type:varchar(255);NOT NULL" json:"txn"`             // 交易hash
	SolReserves    uint64 `gorm:"column:sol_reserves;type:int8;NOT NULL" json:"solReserves"`
	TokenReserves  uint64 `gorm:"column:token_reserves;type:int8;NOT NULL" json:"tokenReserves"`
	Slot           uint64 `gorm:"column:slot;type:int2;NOT NULL" json:"slot"`
	TokenAddress   string `gorm:"column:token_address;type:varchar(255);NOT NULL" json:"tokenAddress"`
	CreatorAddress string `gorm:"column:creator_address;type:varchar(255);NOT NULL" json:"creatorAddress"`
	Fee            int64  `gorm:"column:fee;type:int8;NOT NULL" json:"fee"`
}

// TableName table name
func (m *Trade) TableName() string {
	return "trade"
}
