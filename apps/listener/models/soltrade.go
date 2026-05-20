package models

import (
	"errors"
	"github.com/fair-meme/fairmeme/apps/listener/global"
	"gorm.io/gorm"
	"math/big"
)

type SolTrade struct {
	Id                  int     `json:"id"`
	TokenAddress        string  `json:"token_address"`
	SolAmount           float64 `json:"sol_amount"`
	TokenAmount         float64 `json:"token_amount"`
	IsBuy               int     `json:"is_buy"`
	User                string  `json:"user"`
	CreationTime        uint64  `json:"creation_time"`
	Slot                uint64  `json:"slot"`
	SolReserves         uint64  `json:"sol_reserves"`
	TokenReserves       uint64  `json:"token_reserves"`
	TokenLocked         uint64  `json:"token_locked"`
	TokenReleasePerSlot uint64  `json:"token_release_per_slot"`
	Fee                 uint64  `json:"fee"`
	//AuctionStartTime    uint64 `json:"auction_start_time"`
	//AuctionPeriod       uint64 `json:"auction_period"`
	//TokenReleaseTick    uint64 `json:"token_release_tick"`
	//TokenReleasePerTime uint64 `json:"token_release_per_time"`
	Status int `json:"status"`
}

func (SolTrade) TableName() string {
	return "fairmeme_sol_trade"
}

func GetLastSolTrade(tokenAddress string) (*SolTrade, error) {
	db := global.App.MysqlDb.Model(SolTrade{})
	var lastSolTrade SolTrade
	if err := db.Where("token_address = ?", tokenAddress).Order("id DESC").First(&lastSolTrade).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		} else {
			return nil, err
		}
	}
	return &lastSolTrade, nil
}
func GetTradeByStatus(status int) (*[]SolTrade, error) {
	var tradeList []SolTrade
	if err := global.App.MysqlDb.Where("status = ?", status).Find(&tradeList).Error; err != nil {
		return nil, err
	}
	return &tradeList, nil
}
func GetTradeCountBySlot(fromSlot uint64, tokenAddress string) (int64, error) {
	var count int64

	if err := global.App.MysqlDb.Model(SolTrade{}).Where("token_address = ? and slot >= ?", tokenAddress, fromSlot).Count(&count).Error; err != nil {
		return -1, err
	}
	return count, nil
}
func GetTradeSolAmountBySlot(fromSlot uint64, tokenAddress string) (*big.Float, error) {
	var solTradeList []SolTrade
	if err := global.App.MysqlDb.Model(SolTrade{}).Where("token_address = ? and slot >= ?", tokenAddress, fromSlot).Find(&solTradeList).Error; err != nil {
		return nil, err
	}
	totalAmount := new(big.Float).SetInt64(0)
	for _, trade := range solTradeList {
		solAmount := new(big.Float).SetFloat64(trade.SolAmount)
		totalAmount = new(big.Float).Add(totalAmount, solAmount)
	}
	return totalAmount, nil
}
func GetTradeListByUser(user string) (*[]SolTrade, error) {
	var tradeList []SolTrade
	if err := global.App.MysqlDb.Where("user = ?", user).Find(&tradeList).Error; err != nil {
		return nil, err
	}
	return &tradeList, nil
}
