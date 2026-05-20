package db

import (
	"errors"

	"gorm.io/gorm"
)

type Token struct {
	Address  string `gorm:"primaryKey"`
	Decimals int
}

func (t Token) TableName() string {
	return "tokens"
}

func (d *Database) GetTokenList() ([]Token, error) {
	var tokens []Token
	err := d.gormDB.Find(&tokens).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return []Token{}, nil
	}
	return tokens, nil
}

func (d *Database) SaveTokenList(tokens []Token) error {
	return d.gormDB.Create(&tokens).Error

}
