package model

import (
	"github.com/zhufuyi/sponge/pkg/ggorm"
	"gorm.io/datatypes"
)

type Comment struct {
	ggorm.Model `gorm:"embedded"` // embed id and time

	TokenAddress   string         `gorm:"column:token_address;type:varchar(255);NOT NULL" json:"tokenAddress"`     // 代币地址
	CreatorAddress string         `gorm:"column:creator_address;type:varchar(255);NOT NULL" json:"creatorAddress"` // 评论人地址
	CommentContent datatypes.JSON `gorm:"column:comment_content;type:json;NOT NULL" json:"commentContent"`         // 评论内容
}

// TableName table name
func (m *Comment) TableName() string {
	return "comment"
}
