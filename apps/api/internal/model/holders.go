package model

import (
	"github.com/zhufuyi/sponge/pkg/ggorm"
)

type Holders struct {
	ggorm.Model `gorm:"embedded"` // embed id and time

	CreatorAddress string `gorm:"column:creator_address;type:varchar(255);NOT NULL" json:"creatorAddress"` // 持有人地址
	TokenAddress   string `gorm:"column:token_address;type:varchar(255);NOT NULL" json:"tokenAddress"`     // 代币地址
	Balance        string `gorm:"column:balance;type:numeric;NOT NULL" json:"balance"`                     // 持仓
	Cost           string `gorm:"column:cost;type:numeric;NOT NULL" json:"cost"`                           // 买入交易使用的代币总量
	Sold           string `gorm:"column:sold;type:numeric;NOT NULL" json:"sold"`                           // 卖出交易使用的代币总量
}
