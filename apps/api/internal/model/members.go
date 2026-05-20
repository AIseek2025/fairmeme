package model

import (
	"encoding/json"

	"github.com/zhufuyi/sponge/pkg/ggorm"
)

type Members struct {
	ggorm.Model `gorm:"embedded"` // embed id and time

	CreatorAddress string `gorm:"column:creator_address;type:varchar(255);NOT NULL" json:"creatorAddress"`
	MemberName     string `gorm:"column:member_name;type:varchar(255);NOT NULL" json:"memberName"`
	PictureUrl     string `gorm:"column:picture_url;type:varchar(255);NOT NULL" json:"pictureUrl"`
	MemberStatus   int    `gorm:"column:member_status;type:int2;NOT NULL" json:"memberStatus"`
	ChainID        string `gorm:"column:chain_id;type:varchar(20);NOT NULL" json:"chainId"`
	TotalBalance   int64  `gorm:"column:total_balance;type:bigint;NOT NULL" json:"total_balance"`
	TwitterBalance int64  `gorm:"column:twitter_balance;type:bigint;NOT NULL" json:"twitter_balance"`
	Inviter        int    `gorm:"column:inviter;type:integer;NOT NULL" json:"inviter"`
}

type MemberRewardTransaction struct {
	ID       uint64          `gorm:"column:id;AUTO_INCREMENT" json:"id"`
	MemberID int             `gorm:"NOT NULL" json:"member_id"`
	Amount   int64           `gorm:"NOT NULL" json:"amount"`
	Source   string          `gorm:"NOT NULL" json:"source"`
	Details  json.RawMessage `gorm:"NOT NULL" json:"details"`
}
