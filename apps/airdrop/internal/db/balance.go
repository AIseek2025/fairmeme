package db

import (
	"errors"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type UpstreamState struct {
	Id        uint64 `gorm:"primaryKey"`
	StartSlot uint64
}

func (us UpstreamState) TableName() string {
	return "upstream_state"
}

func (d *Database) SaveUpstreamState(startSlot uint64) error {
	state := UpstreamState{
		Id:        1,
		StartSlot: startSlot,
	}
	return d.gormDB.Save(&state).Error
}

func (d *Database) GetUpstreamState() (UpstreamState, error) {
	var state UpstreamState
	err := d.gormDB.Where("id = 1").First(&state).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return UpstreamState{
			StartSlot: 0,
		}, nil
	}
	return state, err
}

func (b UpstreamBalanceChange) TableName() string {
	return "upstream_balance_changes"
}

type UpstreamBalanceChange struct {
	UserAddress  string `gorm:"primaryKey"`
	TokenAddress string `gorm:"primaryKey"` // using "SOL" for native solana
	Change       float64
	LastSlot     uint64 `gorm:"index"`
}

func (d *Database) SaveUpstreamChanges(changes []UpstreamBalanceChange) error {
	if len(changes) == 0 {
		return nil
	}
	// Batch insert or update
	err := d.gormDB.Clauses(
		clause.OnConflict{
			Columns: []clause.Column{
				{
					Name: "user_address",
				},
				{
					Name: "token_address",
				},
			},
			DoUpdates: clause.AssignmentColumns([]string{"change", "last_slot"}),
		},
	).Create(&changes).Error // Use Create to perform the batch insert
	return err
}

func (d *Database) GetUpstreamChange(userAddress string) ([]UpstreamBalanceChange, error) {
	var changes []UpstreamBalanceChange
	err := d.gormDB.Where("user_address = ?", userAddress).Find(&changes).Error
	// Ignore record not found error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return changes, nil
	}
	return changes, err
}

func (d *Database) GetUpstreamChanges(userAddressList []string) ([]UpstreamBalanceChange, error) {
	var changes []UpstreamBalanceChange
	err := d.gormDB.Where("user_address IN ?", userAddressList).Find(&changes).Error
	// Ignore record not found error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return changes, nil
	}
	return changes, err
}

func (d *Database) GetUpstreamLastSlot() (uint64, error) {
	var change UpstreamBalanceChange
	err := d.gormDB.Order("last_slot desc").First(&change).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return 0, nil
	}
	return change.LastSlot, err
}

func (b BackfillBalanceChange) TableName() string {
	return "backfill_balance_changes"
}

type BackfillBalanceChange struct {
	UserAddress  string `gorm:"primaryKey"`
	TokenAddress string `gorm:"primaryKey"` // using "SOL" for native solana
	Change       float64
	LastSlot     uint64 `gorm:"index"`
}

func (d *Database) SaveBackfillChanges(changes []BackfillBalanceChange) error {
	if len(changes) == 0 {
		return nil
	}
	// Batch insert or update
	err := d.gormDB.Clauses(
		clause.OnConflict{
			Columns: []clause.Column{
				{
					Name: "user_address",
				},
				{
					Name: "token_address",
				},
			},
			DoUpdates: clause.AssignmentColumns([]string{"change", "last_slot"}),
		},
	).Create(&changes).Error // Use Create to perform the batch insert
	return err
}

func (d *Database) GetBackfillChange(userAddress string) ([]BackfillBalanceChange, error) {
	var changes []BackfillBalanceChange
	err := d.gormDB.Where("user_address = ?", userAddress).Find(&changes).Error
	// Ignore record not found error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return changes, nil
	}
	return changes, err
}

func (d *Database) GetBackfillChanges(userAddressList []string) ([]BackfillBalanceChange, error) {
	var changes []BackfillBalanceChange
	err := d.gormDB.Where("user_address IN ?", userAddressList).Find(&changes).Error
	// Ignore record not found error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return changes, nil
	}
	return changes, err
}

func (d *Database) GetBackfillLastSlot() (uint64, error) {
	var change BackfillBalanceChange
	err := d.gormDB.Order("last_slot desc").First(&change).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return 0, nil
	}
	return change.LastSlot, err
}
