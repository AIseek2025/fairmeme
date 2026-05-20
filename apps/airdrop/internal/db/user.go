package db

type UserAirdrop struct {
	UserAddress string `gorm:"primaryKey"`
	ChainName   string `gorm:"primaryKey"`
	Eligible    bool
	TotalUSD    float64
}

func (u UserAirdrop) TableName() string {
	return "user_airdrops"
}

func (d *Database) CheckUserAirdrop(userAddress string, chainName string) (UserAirdrop, bool) {
	var userAirdrop UserAirdrop
	err := d.gormDB.Where("user_address = ? AND chain_name = ?", userAddress, chainName).First(&userAirdrop).Error
	if err == nil {
		return userAirdrop, true
	}
	return userAirdrop, false
}

func (d *Database) SaveUserAirdop(user UserAirdrop) error {
	return d.gormDB.Save(&user).Error
}
