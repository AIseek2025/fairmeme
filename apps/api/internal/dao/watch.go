package dao

import (
	"context"
	"errors"
	"golang.org/x/sync/singleflight"
	"gorm.io/gorm"

	"github.com/fair-meme/fairmeme/apps/api/internal/cache"
	"github.com/fair-meme/fairmeme/apps/api/internal/model"
)

var _ WatchDao = (*watchDao)(nil)

// WatchDao defining the dao interface
type WatchDao interface {
	Create(ctx context.Context, table *model.Watch) error
	DeleteByID(ctx context.Context, id uint64) error
}

type watchDao struct {
	db    *gorm.DB
	cache cache.WatchCache    // if nil, the cache is not used.
	sfg   *singleflight.Group // if cache is nil, the sfg is not used.
}

// NewWatchDao creating the dao interface
func NewWatchDao(db *gorm.DB, xCache cache.WatchCache) WatchDao {
	if xCache == nil {
		return &watchDao{db: db}
	}
	return &watchDao{
		db:    db,
		cache: xCache,
		sfg:   new(singleflight.Group),
	}
}

func (d *watchDao) deleteCache(ctx context.Context, id uint64) error {
	if d.cache != nil {
		return d.cache.Del(ctx, id)
	}
	return nil
}

// Create a record, insert the record and the id value is written back to the table
func (d *watchDao) Create(ctx context.Context, table *model.Watch) error {
	result := d.db.WithContext(ctx).Where("creator_address = ?", table.CreatorAddress).First(&table)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			createResult := d.db.WithContext(ctx).Create(&table)
			if createResult.Error != nil {
				return createResult.Error
			}
		} else {
			return result.Error
		}
	} else {
		err := d.DeleteByID(ctx, table.ID)
		if err != nil {
			return err
		}
	}

	return nil
}

// DeleteByID delete a record by id
func (d *watchDao) DeleteByID(ctx context.Context, id uint64) error {
	err := d.db.WithContext(ctx).Where("id = ?", id).Delete(&model.Watch{}).Error
	if err != nil {
		return err
	}

	// delete cache
	_ = d.deleteCache(ctx, id)

	return nil
}
