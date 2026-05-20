package models

import (
	"github.com/fair-meme/fairmeme/apps/listener/global"
	"errors"
	"gorm.io/gorm"
	"time"
)

type Transaction struct {
	Id            uint64  `json:"id"`
	Address       string  `json:"address"`
	MarketAddress string  `json:"market_address"`
	TxHash        string  `json:"tx_hash"`
	TxType        int     `json:"tx_type"` //1买 2卖
	Count         float64 `json:"Count"`
	EthPrice      float64 `json:"eth_price"`
	Amount        float64 `json:"amount"`
	CreateTime    uint64  `json:"create_time"`
}

func CreateTransactionTable() error {
	if err := global.App.MysqlDb.AutoMigrate(&Transaction{}); err != nil {
		return err
	}
	return nil
}
func CreateTransaction(tx *Transaction) error {
	if err := global.App.MysqlDb.FirstOrCreate(tx, Transaction{TxHash: tx.TxHash}).Error; err != nil {
		return err
	}
	return nil
}

func GetAddressBuyAndSale(address string, marketAddress string) (*[]Transaction, *[]Transaction, error) {
	var buyTxs []Transaction
	var sellTxs []Transaction
	query := global.App.MysqlDb.Where("address=? and market_address=?", address, marketAddress)
	if err := query.Where("tx_type = 1").Find(&buyTxs).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil, err
		}
	}
	if err := query.Where("tx_type = 2").Find(&sellTxs).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil, err
		}
	}
	return &buyTxs, &sellTxs, nil
}

func GetTransactionByDuration(marketAddress string, hour int64) (*[]Transaction, error) {
	var txs []Transaction
	time := time.Now().Add(-time.Duration(hour) * time.Hour).Unix()
	if err := global.App.MysqlDb.Where("market_address = ? and create_time >= ?", marketAddress, time).First(&txs).Error; err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, err
		}
	}
	return &txs, nil
}
