package model

import (
	"time"
)

type Watch struct {
	ID             uint64     `gorm:"column:id;type:int4;primary_key" json:"id"`
	CreatorAddress string     `gorm:"column:creator_address;type:varchar(255);NOT NULL" json:"creatorAddress"`
	TokenAddress   string     `gorm:"column:token_address;type:varchar(255);NOT NULL" json:"tokenAddress"`
	CreatedAt      *time.Time `gorm:"column:created_at;type:timestamp" json:"createdAt"`
	UpdatedAt      *time.Time `gorm:"column:updated_at;type:timestamp" json:"updatedAt"`
	DeletedAt      *time.Time `gorm:"column:deleted_at;type:timestamp" json:"deletedAt"`
}

// TableName table name
func (m *Watch) TableName() string {
	return "watch"
}
