package model

import (
	"time"
)

type LiquidityPools struct {
	ID        uint64     `gorm:"column:id;type:int8;primary_key" json:"id"`
	Token0ID  int64      `gorm:"column:token0_id;type:int8;NOT NULL" json:"token0Id"`   // 为0时，代表原生token，需要查token表的chain_id来确定
	Token1ID  int64      `gorm:"column:token1_id;type:int8;NOT NULL" json:"token1Id"`   // 为0时，代表原生token，需要查token表的chain_id来确定
	Reserve0  string     `gorm:"column:reserve0;type:numeric;NOT NULL" json:"reserve0"` // token0池子流动量
	Reserve1  string     `gorm:"column:reserve1;type:numeric;NOT NULL" json:"reserve1"` // token1池子流动量
	CreatedAt *time.Time `gorm:"column:created_at;type:timestamp" json:"createdAt"`
	UpdatedAt *time.Time `gorm:"column:updated_at;type:timestamp" json:"updatedAt"`
	DeletedAt *time.Time `gorm:"column:deleted_at;type:timestamp" json:"deletedAt"`
}
