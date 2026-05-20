package models

import (
	"github.com/fair-meme/fairmeme/apps/listener/global"
	"time"
)

type View struct {
	Id           int    `json:"id" `
	Address      string `json:"address" gorm:"not null"`
	TokenAddress string `json:"tokenAddress" gorm:"not null"`
	CreateTime   int64  `json:"createTime" gorm:"not null"`
}

func (View) TableName() string {
	return "fairmeme_sol_view"
}
func CreateViewTable() error {
	if err := global.App.MysqlDb.AutoMigrate(&View{}); err != nil {
		return err
	}
	return nil
}
func AddView(address string, tokenAddress string) error {
	view := &View{
		Address:      address,
		TokenAddress: tokenAddress,
		CreateTime:   time.Now().Unix(),
	}
	if err := global.App.MysqlDb.Create(view).Error; err != nil {
		if err != nil {
			return err
		}
	}

	return nil
}
func GetViewCountByTokenAddress(tokenAddress string, beforeTime int64) (int64, error) {
	var total int64
	if err := global.App.MysqlDb.Model(View{}).Where("token_address = ? and create_time >= ?", tokenAddress, beforeTime).Count(&total).Error; err != nil {

		return 0, err
	}
	return total, nil
}
