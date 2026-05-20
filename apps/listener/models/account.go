package models

import (
	"github.com/fair-meme/fairmeme/apps/listener/global"
	"errors"
	"fmt"
	"gorm.io/gorm"
	"math/big"
)

type Account struct {
	Id           uint64  `json:"id"`
	Chain        string  `json:"chain"`
	Address      string  `json:"address"`
	TokenAddress string  `json:"token_address"`
	Count        float64 `json:"count"`
	Cost         float64 `json:"cost"` //累计花费sol的数量总和
	Sold         float64 `json:"sold"` //累计卖出获取sol的总和
	//Profit       float64 `json:"profit"` //Profit=sold+balance-cost
	//Rate         float64 `json:"rate"`   //Rate=profit/cost*100%
	UpdateTime uint64 `json:"update_time"`
}

func CreateAccountTable() error {
	if err := global.App.MysqlDb.AutoMigrate(&Account{}); err != nil {
		return err
	}
	return nil
}

func UpdateEthAmount(tx *Transaction) error {
	var account Account
	if err := global.App.MysqlDb.Where("chain = ? and address = ? and token_address = ?", "eth", tx.Address, tx.MarketAddress).First(&account).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			count := float64(0)

			if tx.TxType == 1 {
				count = tx.Count

			} else if tx.TxType == 2 {
				count = -tx.Count
			}
			if tx.TxType == 1 || tx.TxType == 2 {
				if err = global.App.MysqlDb.Create(Account{
					Address:      tx.Address,
					TokenAddress: tx.MarketAddress,
					Count:        count,
					UpdateTime:   tx.CreateTime,
				}).Error; err != nil {
					return err
				}
				return nil
			}

		} else {
			return err
		}
	}

	count := account.Count
	txCount := tx.Count
	if tx.TxType == 1 {
		count += txCount
	} else if tx.TxType == 2 {
		count -= txCount
	}
	if err := global.App.MysqlDb.Model(&account).Updates(&Account{Count: count, UpdateTime: tx.CreateTime}).Error; err != nil {
		return err
	}
	return nil
}
func GetAmountList(limit, offset int, tokenAddress string) ([]Account, error) {
	var accounts []Account
	if err := global.App.MysqlDb.Where("token_address =? ", tokenAddress).Order("amount  desc").Limit(limit).Offset(offset).Find(&accounts).Error; err != nil {
		return nil, errors.New("GetAmountList err:" + err.Error())
	}
	return accounts, nil
}

func UpdateSolAmount(tx SolTrade) error {
	var account Account
	db := global.App.MysqlDb.Begin()
	if err := db.Model(Account{}).Where("chain = ? and address = ? and token_address = ?", "sol", tx.User, tx.TokenAddress).First(&account).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			count := new(big.Float)
			cost := float64(0)
			sold := float64(0)
			//profit := float64(0)
			//rate := float64(0)
			if tx.IsBuy == 1 {
				count = new(big.Float).SetFloat64(tx.TokenAmount)
				cost = tx.SolAmount

			} else {
				temp := new(big.Float).SetFloat64(tx.TokenAmount)
				fmt.Println("tx.TokenAmount:", tx.TokenAmount)
				count = count.Sub(count, temp)
				sold = tx.SolAmount
			}
			countFloat, _ := count.Float64()

			if err = global.App.MysqlDb.Create(&Account{
				Chain:        "sol",
				Address:      tx.User,
				TokenAddress: tx.TokenAddress,
				Count:        countFloat,
				Cost:         cost,
				Sold:         sold,
				//Profit:       profit, //初次交易算出来是0
				//Rate:         rate,
				UpdateTime: tx.CreationTime,
			}).Error; err != nil {
				db.Rollback()
				return err
			}
			if err = db.Model(SolTrade{}).Where("id = ?", tx.Id).Update("status", 1).Error; err != nil {
				db.Rollback()
				return err
			}

			db.Commit()
			return nil

		} else {
			db.Rollback()
			return err
		}
	}
	//fmt.Println("找到数据:", account)

	count := new(big.Float).SetFloat64(account.Count)
	tokenAmount := new(big.Float).SetFloat64(tx.TokenAmount)
	cost := float64(0)
	sold := float64(0)
	//profit := float64(0)
	//rate := float64(0)
	if tx.IsBuy == 1 {
		count = count.Add(count, tokenAmount)
		cost = tx.SolAmount + account.Cost
		sold = account.Sold
	} else {
		count = count.Sub(count, tokenAmount)
		cost = account.Cost
		sold = tx.SolAmount + account.Sold
	}
	countF, _ := count.Float64()
	if err := global.App.MysqlDb.Model(&account).Updates(&Account{Count: countF,
		Cost: cost,
		Sold: sold,
		//Profit:
		//Rate:
		UpdateTime: tx.CreationTime}).Error; err != nil {
		db.Rollback()
		return err
	}
	if err := db.Model(SolTrade{}).Where("id = ?", tx.Id).Update("status", 1).Error; err != nil {
		db.Rollback()
		return err
	}
	db.Commit()
	return nil
}
func GetAmountByChainAndTokenAddress(chain string, tokenAddress string, address string) (*Account, error) {
	var account Account
	if err := global.App.MysqlDb.Where("chain = ? and token_address = ? and address = ?", chain, tokenAddress, address).First(&account).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &Account{
				Chain:        chain,
				Address:      address,
				TokenAddress: tokenAddress,
				Count:        0,
			}, nil
		} else {
			return nil, err
		}
	}
	return &account, nil
}

func GetTokenHolders(tokenAddress string, creatorAddress string) (int64, error) {
	var count int64
	var creatorCount int64

	if err := global.App.MysqlDb.Model(Account{}).Where("token_address = ? and address = ?", tokenAddress, creatorAddress).Count(&creatorCount).Error; err != nil {
		return -1, err
	}
	if err := global.App.MysqlDb.Model(Account{}).Where("token_address = ? and count > 0 ", tokenAddress).Count(&count).Error; err != nil {
		return -1, err
	}
	if creatorCount < 1 {
		count += 1
	}
	return count, nil
}
