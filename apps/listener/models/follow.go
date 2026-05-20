package models

import (
	"github.com/fair-meme/fairmeme/apps/listener/global"
	"time"
)

type Follow struct {
	Id           int    `json:"id" `
	Address      string `json:"address" gorm:"not null"`
	TokenAddress string `json:"TokenAddress" gorm:"not null"`
	CreateTime   int64  `json:"createTime" gorm:"not null"`
}

func CreateFollowTable() error {
	if err := global.App.MysqlDb.AutoMigrate(&Follow{}); err != nil {
		return err
	}
	return nil
}
func AddFollow(address string, tokenAddress string) error {
	follow := &Follow{
		Address:      address,
		TokenAddress: tokenAddress,
		CreateTime:   time.Now().Unix(),
	}
	if err := global.App.MysqlDb.Where("address = ? and token_address = ?", address, tokenAddress).FirstOrCreate(follow).Error; err != nil {
		if err != nil {
			return err
		}
	}

	return nil
}
func GetFollowByAddress(address string) (*[]Follow, error) {
	var follows []Follow
	if err := global.App.MysqlDb.Where("address = ?", address).Find(&follows).Error; err != nil {

		return nil, err
	}
	return &follows, nil
}
func GetFollowCountByTokenAddress(tokenAddress string) (int64, error) {
	var total int64
	if err := global.App.MysqlDb.Model(Token{}).Where("token_address = ?", tokenAddress).Count(&total).Error; err != nil {

		return 0, err
	}
	return total, nil
}
func RemoveFollow(address string, tokenAddress string) error {
	query := global.App.MysqlDb.Where("address = ? and token_address = ?", address, tokenAddress)
	if err := query.Delete(&Follow{}).Error; err != nil {
		return err
	}
	return nil
}
