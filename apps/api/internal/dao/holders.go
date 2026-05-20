package dao

import (
	"context"
	"errors"
	"fmt"

	"golang.org/x/sync/singleflight"
	"gorm.io/gorm"

	cacheBase "github.com/zhufuyi/sponge/pkg/cache"
	"github.com/zhufuyi/sponge/pkg/ggorm/query"
	"github.com/zhufuyi/sponge/pkg/utils"

	"github.com/fair-meme/fairmeme/apps/api/internal/cache"
	"github.com/fair-meme/fairmeme/apps/api/internal/model"
)

var _ HoldersDao = (*holdersDao)(nil)

// HoldersDao defining the dao interface
type HoldersDao interface {
	Create(ctx context.Context, table *model.Holders) error
	DeleteByID(ctx context.Context, id uint64) error
	UpdateByID(ctx context.Context, table *model.Holders) error
	GetByID(ctx context.Context, id uint64) (*model.Holders, error)
	GetTokensByMember(ctx context.Context, address string) ([]string, error)
	GetMembersByToken(ctx context.Context, address string) ([]string, error)
	GetByColumns(ctx context.Context, params *query.Params) ([]*model.Holders, int64, error)
	GetTokensBalanceByMember(ctx context.Context, address string) ([]*model.Holders, error)

	CreateByTx(ctx context.Context, tx *gorm.DB, table *model.Holders) (uint64, error)
	DeleteByTx(ctx context.Context, tx *gorm.DB, id uint64) error
	UpdateByTx(ctx context.Context, tx *gorm.DB, table *model.Holders) error
}

type holdersDao struct {
	db    *gorm.DB
	cache cache.HoldersCache  // if nil, the cache is not used.
	sfg   *singleflight.Group // if cache is nil, the sfg is not used.
}

// NewHoldersDao creating the dao interface
func NewHoldersDao(db *gorm.DB, xCache cache.HoldersCache) HoldersDao {
	if xCache == nil {
		return &holdersDao{db: db}
	}
	return &holdersDao{
		db:    db,
		cache: xCache,
		sfg:   new(singleflight.Group),
	}
}

func (d *holdersDao) deleteCache(ctx context.Context, id uint64) error {
	if d.cache != nil {
		return d.cache.Del(ctx, id)
	}
	return nil
}

// Create a record, insert the record and the id value is written back to the table
func (d *holdersDao) Create(ctx context.Context, table *model.Holders) error {
	return d.db.WithContext(ctx).Create(table).Error
}

// DeleteByID delete a record by id
func (d *holdersDao) DeleteByID(ctx context.Context, id uint64) error {
	err := d.db.WithContext(ctx).Where("id = ?", id).Delete(&model.Holders{}).Error
	if err != nil {
		return err
	}

	// delete cache
	_ = d.deleteCache(ctx, id)

	return nil
}

// UpdateByID update a record by id
func (d *holdersDao) UpdateByID(ctx context.Context, table *model.Holders) error {
	err := d.updateDataByID(ctx, d.db, table)

	// delete cache
	_ = d.deleteCache(ctx, table.ID)

	return err
}

func (d *holdersDao) updateDataByID(ctx context.Context, db *gorm.DB, table *model.Holders) error {
	if table.ID < 1 {
		return errors.New("id cannot be 0")
	}

	update := map[string]interface{}{}

	if table.CreatorAddress != "" {
		update["creator_address"] = table.CreatorAddress
	}
	if table.TokenAddress != "" {
		update["token_address"] = table.TokenAddress
	}
	if table.Balance != "" {
		update["balance"] = table.Balance
	}
	if table.Cost != "" {
		update["cost"] = table.Cost
	}
	if table.Sold != "" {
		update["sold"] = table.Sold
	}

	return db.WithContext(ctx).Model(table).Updates(update).Error
}

// GetByID get a record by id
func (d *holdersDao) GetByID(ctx context.Context, id uint64) (*model.Holders, error) {
	// no cache
	if d.cache == nil {
		record := &model.Holders{}
		err := d.db.WithContext(ctx).Where("id = ?", id).First(record).Error
		return record, err
	}

	// get from cache or database
	record, err := d.cache.Get(ctx, id)
	if err == nil {
		return record, nil
	}

	if errors.Is(err, model.ErrCacheNotFound) {
		// for the same id, prevent high concurrent simultaneous access to database
		val, err, _ := d.sfg.Do(utils.Uint64ToStr(id), func() (interface{}, error) { //nolint
			table := &model.Holders{}
			err = d.db.WithContext(ctx).Where("id = ?", id).First(table).Error
			if err != nil {
				// if data is empty, set not found cache to prevent cache penetration, default expiration time 10 minutes
				if errors.Is(err, model.ErrRecordNotFound) {
					err = d.cache.SetCacheWithNotFound(ctx, id)
					if err != nil {
						return nil, err
					}
					return nil, model.ErrRecordNotFound
				}
				return nil, err
			}
			// set cache
			err = d.cache.Set(ctx, id, table, cache.HoldersExpireTime)
			if err != nil {
				return nil, fmt.Errorf("cache.Set error: %v, id=%d", err, id)
			}
			return table, nil
		})
		if err != nil {
			return nil, err
		}
		table, ok := val.(*model.Holders)
		if !ok {
			return nil, model.ErrRecordNotFound
		}
		return table, nil
	} else if errors.Is(err, cacheBase.ErrPlaceholder) {
		return nil, model.ErrRecordNotFound
	}

	// fail fast, if cache error return, don't request to db
	return nil, err
}

// GetByColumns get paging records by column information,
// Note: query performance degrades when table rows are very large because of the use of offset.
//
// params includes paging parameters and query parameters
// paging parameters (required):
//
//	page: page number, starting from 0
//	limit: lines per page
//	sort: sort fields, default is id backwards, you can add - sign before the field to indicate reverse order, no - sign to indicate ascending order, multiple fields separated by comma
//
// query parameters (not required):
//
//	name: column name
//	exp: expressions, which default is "=",  support =, !=, >, >=, <, <=, like, in
//	value: column value, if exp=in, multiple values are separated by commas
//	logic: logical type, defaults to and when value is null, only &(and), ||(or)
//
// example: search for a male over 20 years of age
//
//	params = &query.Params{
//	    Page: 0,
//	    Limit: 20,
//	    Columns: []query.Column{
//		{
//			Name:    "age",
//			Exp: ">",
//			Value:   20,
//		},
//		{
//			Name:  "gender",
//			Value: "male",
//		},
//	}
func (d *holdersDao) GetByColumns(ctx context.Context, params *query.Params) ([]*model.Holders, int64, error) {
	queryStr, args, err := params.ConvertToGormConditions()
	if err != nil {
		return nil, 0, errors.New("query params error: " + err.Error())
	}

	var total int64
	if params.Sort != "ignore count" { // determine if count is required
		err = d.db.WithContext(ctx).Model(&model.Holders{}).Select([]string{"id"}).Where(queryStr, args...).Count(&total).Error
		if err != nil {
			return nil, 0, err
		}
		if total == 0 {
			return nil, total, nil
		}
	}

	var records []*model.Holders
	order, limit, offset := params.ConvertToPage()
	if params.Page == 1 {
		offset = 0
	}
	err = d.db.WithContext(ctx).Order(order).Limit(limit).Offset(offset).Where(queryStr, args...).Find(&records).Error
	if err != nil {
		return nil, 0, err
	}

	return records, total, err
}

// CreateByTx create a record in the database using the provided transaction
func (d *holdersDao) CreateByTx(ctx context.Context, tx *gorm.DB, table *model.Holders) (uint64, error) {
	err := tx.WithContext(ctx).Create(table).Error
	return table.ID, err
}

// DeleteByTx delete a record by id in the database using the provided transaction
func (d *holdersDao) DeleteByTx(ctx context.Context, tx *gorm.DB, id uint64) error {
	err := tx.WithContext(ctx).Where("id = ?", id).Delete(&model.Holders{}).Error
	if err != nil {
		return err
	}

	// delete cache
	_ = d.deleteCache(ctx, id)

	return nil
}

// UpdateByTx update a record by id in the database using the provided transaction
func (d *holdersDao) UpdateByTx(ctx context.Context, tx *gorm.DB, table *model.Holders) error {
	err := d.updateDataByID(ctx, tx, table)

	// delete cache
	_ = d.deleteCache(ctx, table.ID)

	return err
}

func (d *holdersDao) GetTokensByMember(ctx context.Context, address string) ([]string, error) {
	Addresses := []string{}

	err := d.db.WithContext(ctx).
		Model(model.Holders{}).
		Where("creator_address = ?", address).
		Pluck("token_address", &Addresses).
		Error
	if len(Addresses) == 0 {
		Addresses = append(Addresses, "0")
	}
	return Addresses, err
}

func (d *holdersDao) GetMembersByToken(ctx context.Context, address string) ([]string, error) {
	Addresses := []string{}

	err := d.db.WithContext(ctx).
		Model(model.Holders{}).
		Where("token_address = ?", address).
		Pluck("creator_address", &Addresses).
		Error
	if len(Addresses) == 0 {
		Addresses = append(Addresses, "0")
	}
	return Addresses, err
}

func (d *holdersDao) GetTokensBalanceByMember(ctx context.Context, address string) ([]*model.Holders, error) {
	Addresses := []*model.Holders{}
	err := d.db.WithContext(ctx).
		Model(model.Holders{}).
		Where("creator_address = ?", address).
		Pluck("token_address,balance", &Addresses).
		Error

	return Addresses, err
}
