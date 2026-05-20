package models

import (
	"errors"
	"github.com/fair-meme/fairmeme/apps/listener/global"
	"gorm.io/gorm"
)

type SolToken struct {
	Id                  int64  `json:"id"`
	ChainId             string `json:"chainId"`
	TokenName           string `json:"tokenName"`   //name
	TokenTicker         string `json:"tokenTicker"` //symbol
	TokenLogo           string `json:"tokenLogo"`   //uri
	AuctionTime         int64  `json:"auctionTime"` //auction_period AuctionDays
	TokenAddress        string `json:"tokenAddress"`
	PairAddress         string `json:"pairAddress"`
	CreatorAddress      string `json:"creatorAddress"` //creator
	CreationTime        int64  `json:"creationTime"`   //timestamp  creatorTime
	Slot                int64  `json:"slot"`
	TokenReceived       int64  `json:"tokenReceived"`
	TokenReleasePerSlot int64  `json:"tokenReleasePerSlot"`
	Fee                 int64  `json:"fee"`
	Price               string `json:"price" gorm:"-"`
	TokenBalance        string `json:"tokenBalance" gorm:"-"`
	UstdBalance         string `json:"ustdBalance" gorm:"-"`
	Status              int    `json:"status"`
}
type SolTokenBasic struct {
	Id           int    `json:"id"`
	ChainId      string `json:"chainId"`
	TokenName    string `json:"tokenName"`
	TokenTicker  string `json:"tokenTicker"`
	TokenDesc    string `json:"tokenDesc"`
	TokenLogo    string `json:"tokenLogo"`
	AuctionTime  int    `json:"auctionTime"` //改了 auctiondays->auctionTime
	WebsiteUrl   string `json:"websiteUrl"`
	TwitterUrl   string `json:"twitterUrl"`
	TelegramUrl  string `json:"telegramUrl"`
	FarcasterUrl string `json:"farcasterUrl"`

	TokenAddress string `json:"tokenAddress"`
	TxHash       string `json:"txHash"`
}

func (SolToken) TableName() string {
	return "fairmeme_sol_token"
}
func (SolTokenBasic) TableName() string {
	return "fairmeme_sol_token_basic"
}
func CreateSolTokenBasicTable() error {
	if err := global.App.MysqlDb.AutoMigrate(&SolTokenBasic{}); err != nil {
		return err
	}
	return nil
}
func GetSolTokenListByOffsetAndLimit(limit, offset int, keyword string, chainId string) ([]SolToken, int64, error) {
	solTokens := []SolToken{}
	var total int64
	db := global.App.MysqlDb.Model(SolToken{})
	if len(chainId) > 0 {
		db.Where("chain_id = ?", chainId)
	}
	if len(keyword) > 0 {
		db = db.Where("token_name LIKE ? OR token_address LIKE ? OR pair_address LIKE ?", "%"+keyword+"%", "%"+keyword+"%", "%"+keyword+"%")
	}
	db.Count(&total)
	err := db.Limit(limit).Offset(offset).Find(&solTokens).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, 0, err
	}
	return solTokens, total, nil
}

func GetTokenListByChainAndStatus(chainId string, status int) ([]SolToken, error) {
	var solTokens []SolToken
	db := global.App.MysqlDb.Model(SolToken{})

	err := db.Where("chain_id = ? and status = ?", chainId, status).Find(&solTokens).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}
	return solTokens, nil
}
func GetTokenByTokenAddress(tokenAddress string) (*SolToken, error) {
	var token SolToken
	if err := global.App.MysqlDb.Where("token_address = ?", tokenAddress).First(&token).Error; err != nil {
		return nil, err
	}
	return &token, nil
}
func UpdateTokenStatus(id int, status int) error {
	if err := global.App.MysqlDb.Model(&SolToken{}).Where("id = ?", id).Update("status", status).Error; err != nil {
		return err
	}
	return nil

}

func GetTokenByAddress(chainId string, tokenAddress string) (*SolToken, error) {
	var solToken SolToken
	err := global.App.MysqlDb.Where("chain_id = ? and token_address = ?", chainId, tokenAddress).First(&solToken).Error
	if err != nil {
		return nil, err
	}
	return &solToken, nil
}

func CreateSolTokenBasic(solTokenBasic SolTokenBasic) error {
	return global.App.MysqlDb.Create(&solTokenBasic).Error
}
func GetSolTokenBasicListByOffsetAndLimit(limit, offset int, keyword string, chainId string) ([]SolTokenBasic, int64, error) {
	var solTokenBasic []SolTokenBasic
	var total int64
	db := global.App.MysqlDb.Model(SolTokenBasic{})
	if len(chainId) > 0 {
		db.Where("chain_id = ?", chainId)
	}
	if len(keyword) > 0 {
		db = db.Where("token_name LIKE ? OR token_address LIKE ? LIKE ?", "%"+keyword+"%", "%"+keyword+"%")
	}
	db.Count(&total)
	err := db.Limit(limit).Offset(offset).Find(&solTokenBasic).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, 0, err
	}
	return solTokenBasic, total, nil
}

func SolTokenDetail(tokenAddress string) (*SolToken, error) {
	var solToken SolToken
	if err := global.App.MysqlDb.Model(SolToken{}).Where("token_address = ?", tokenAddress).First(&solToken).Error; err != nil {
		return nil, err
	}
	return &solToken, nil
}
