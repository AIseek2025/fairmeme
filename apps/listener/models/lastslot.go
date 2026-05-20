package models

import (
	"fmt"
	"github.com/fair-meme/fairmeme/apps/listener/global"
)

type LastSlot struct {
	Id           int    `json:"id"`
	TokenAddress string `json:"token_address"`
	Slot         int64  `json:"slot"`
}

func (LastSlot) TableName() string {
	return "fairmeme_last_slot"
}

func CreateLastSlotTable() error {
	if err := global.App.MysqlDb.AutoMigrate(&LastSlot{}); err != nil {
		fmt.Println("CreateLastSlotTable err", err)
		return err
	}
	fmt.Println("CreateLastSlotTable")
	return nil
}

func CreateLastSlotInfo(tokenAddress string, slot int64) error {
	lastSlot := LastSlot{
		TokenAddress: tokenAddress,
		Slot:         slot,
	}
	tx := global.App.MysqlDb.Begin()
	if err := tx.Create(&lastSlot).Error; err != nil {
		tx.Callback()
		return err
	}
	if err := tx.Model(SolToken{}).Where("token_address = ?", tokenAddress).Update("status", 1).Error; err != nil {
		tx.Callback()
		return err
	}
	tx.Commit()
	return nil
}

func GetLastSlotByTokenAddress(tokenAddress string) (*LastSlot, error) {
	var lastSlot = LastSlot{}
	if err := global.App.MysqlDb.Where("token_address = ?", tokenAddress).First(lastSlot).Error; err != nil {
		return nil, err
	}
	return &lastSlot, nil
}

func UpdateLastSlot(tokenAddress string, slot int64) error {
	if err := global.App.MysqlDb.Where("token_address = ?", tokenAddress).Update("slot", slot).Error; err != nil {
		return err
	}
	return nil
}
