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

var _ MembersDao = (*membersDao)(nil)

type RankingColumn string

const (
	TOTAL   RankingColumn = "total_balance"
	TWITTER RankingColumn = "twitter_balance"
)

// MembersDao defining the dao interface
type MembersDao interface {
	Create(ctx context.Context, table *model.Members) error
	DeleteByID(ctx context.Context, id uint64) error
	UpdateByID(ctx context.Context, table *model.Members) error
	GetByID(ctx context.Context, id uint64) (*model.Members, error)
	GetByColumns(ctx context.Context, params *query.Params) ([]*model.Members, int64, error)
	Ranking(ctx context.Context, rankBy RankingColumn, count int) ([]*model.Members, error)

	CreateByTx(ctx context.Context, tx *gorm.DB, table *model.Members) (uint64, error)
	DeleteByTx(ctx context.Context, tx *gorm.DB, id uint64) error
	UpdateByTx(ctx context.Context, tx *gorm.DB, table *model.Members) error
}

type membersDao struct {
	db    *gorm.DB
	cache cache.MembersCache  // if nil, the cache is not used.
	sfg   *singleflight.Group // if cache is nil, the sfg is not used.
}

// NewMembersDao creating the dao interface
func NewMembersDao(db *gorm.DB, xCache cache.MembersCache) MembersDao {
	if xCache == nil {
		return &membersDao{db: db}
	}
	return &membersDao{
		db:    db,
		cache: xCache,
		sfg:   new(singleflight.Group),
	}
}

func (d *membersDao) deleteCache(ctx context.Context, id uint64) error {
	if d.cache != nil {
		return d.cache.Del(ctx, id)
	}
	return nil
}

// Create a record, insert the record and the id value is written back to the table
func (d *membersDao) Create(ctx context.Context, table *model.Members) error {
	result := d.db.WithContext(ctx).Where("creator_address = ?", table.CreatorAddress).FirstOrCreate(table)

	if result.Error != nil {
		return result.Error
	}
	return nil
}

// DeleteByID delete a record by id
func (d *membersDao) DeleteByID(ctx context.Context, id uint64) error {
	err := d.db.WithContext(ctx).Where("id = ?", id).Delete(&model.Members{}).Error
	if err != nil {
		return err
	}

	// delete cache
	_ = d.deleteCache(ctx, id)

	return nil
}

// UpdateByID update a record by id
func (d *membersDao) UpdateByID(ctx context.Context, table *model.Members) error {
	err := d.updateDataByID(ctx, d.db, table)

	// delete cache
	_ = d.deleteCache(ctx, table.ID)

	return err
}

func (d *membersDao) updateDataByID(ctx context.Context, db *gorm.DB, table *model.Members) error {
	if table.ID < 1 {
		return errors.New("id cannot be 0")
	}

	update := map[string]interface{}{}

	if table.CreatorAddress != "" {
		update["creator_address"] = table.CreatorAddress
	}
	if table.MemberName != "" {
		update["member_name"] = table.MemberName
	}
	if table.PictureUrl != "" {
		update["picture_url"] = table.PictureUrl
	}
	if table.MemberStatus != 0 {
		update["member_status"] = table.MemberStatus
	}
	if table.ChainID != "" {
		update["chain_id"] = table.ChainID
	}

	return db.WithContext(ctx).Model(table).Updates(update).Error
}

// GetByID get a record by id
func (d *membersDao) GetByID(ctx context.Context, id uint64) (*model.Members, error) {
	// no cache
	if d.cache == nil {
		record := &model.Members{}
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
			table := &model.Members{}
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
			err = d.cache.Set(ctx, id, table, cache.MembersExpireTime)
			if err != nil {
				return nil, fmt.Errorf("cache.Set error: %v, id=%d", err, id)
			}
			return table, nil
		})
		if err != nil {
			return nil, err
		}
		table, ok := val.(*model.Members)
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
func (d *membersDao) GetByColumns(ctx context.Context, params *query.Params) ([]*model.Members, int64, error) {
	queryStr, args, err := params.ConvertToGormConditions()
	if err != nil {
		return nil, 0, errors.New("query params error: " + err.Error())
	}

	var total int64
	if params.Sort != "ignore count" { // determine if count is required
		err = d.db.WithContext(ctx).Model(&model.Members{}).Select([]string{"id"}).Where(queryStr, args...).Count(&total).Error
		if err != nil {
			return nil, 0, err
		}
		if total == 0 {
			return nil, total, nil
		}
	}

	records := []*model.Members{}
	order, limit, offset := params.ConvertToPage()
	err = d.db.WithContext(ctx).Order(order).Limit(limit).Offset(offset).Where(queryStr, args...).Find(&records).Error
	if err != nil {
		return nil, 0, err
	}

	return records, total, err
}

func (d *membersDao) Ranking(ctx context.Context, rankBy RankingColumn, count int) (records []*model.Members, err error) {
	err = d.db.WithContext(ctx).Order(string(rankBy)).Limit(count).Find(&records).Error
	return
}

// CreateByTx create a record in the database using the provided transaction
func (d *membersDao) CreateByTx(ctx context.Context, tx *gorm.DB, table *model.Members) (uint64, error) {
	err := tx.WithContext(ctx).Create(table).Error
	return table.ID, err
}

// DeleteByTx delete a record by id in the database using the provided transaction
func (d *membersDao) DeleteByTx(ctx context.Context, tx *gorm.DB, id uint64) error {
	err := tx.WithContext(ctx).Where("id = ?", id).Delete(&model.Members{}).Error
	if err != nil {
		return err
	}

	// delete cache
	_ = d.deleteCache(ctx, id)

	return nil
}

// UpdateByTx update a record by id in the database using the provided transaction
func (d *membersDao) UpdateByTx(ctx context.Context, tx *gorm.DB, table *model.Members) error {
	err := d.updateDataByID(ctx, tx, table)

	// delete cache
	_ = d.deleteCache(ctx, table.ID)

	return err
}
