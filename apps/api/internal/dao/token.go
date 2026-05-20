package dao

import (
	"context"
	"errors"
	"fmt"
	"golang.org/x/sync/singleflight"
	"gorm.io/gorm"
	"strings"

	"github.com/fair-meme/fairmeme/apps/api/internal/cache"
	"github.com/fair-meme/fairmeme/apps/api/internal/model"
	cacheBase "github.com/zhufuyi/sponge/pkg/cache"
	"github.com/zhufuyi/sponge/pkg/ggorm/query"
)

var _ TokenDao = (*tokenDao)(nil)

// TokenDao defining the dao interface
type TokenDao interface {
	Create(ctx context.Context, table *model.Token) error
	UpdateByAddress(ctx context.Context, table *model.Token) error
	GetByAddress(ctx context.Context, address string) (*model.Token, error)
	GetByColumns(ctx context.Context, params *query.Params) ([]*model.Token, int64, error)

	CreateByTx(ctx context.Context, tx *gorm.DB, table *model.Token) (uint64, error)
	UpdateByTx(ctx context.Context, tx *gorm.DB, table *model.Token) error

	GetTokenByTokenAddress(tokenAddress string) (*model.Token, error)
}

type tokenDao struct {
	db    *gorm.DB
	cache cache.TokenCache    // if nil, the cache is not used.
	sfg   *singleflight.Group // if cache is nil, the sfg is not used.
}

// NewTokenDao creating the dao interface
func NewTokenDao(db *gorm.DB, xCache cache.TokenCache) TokenDao {
	if xCache == nil {
		return &tokenDao{db: db}
	}
	return &tokenDao{
		db:    db,
		cache: xCache,
		sfg:   new(singleflight.Group),
	}
}

func (d *tokenDao) deleteCache(ctx context.Context, address string) error {
	if d.cache != nil {
		return d.cache.Del(ctx, address)
	}
	return nil
}

// Create a record, insert the record and the id value is written back to the table
func (d *tokenDao) Create(ctx context.Context, table *model.Token) error {

	return d.db.WithContext(ctx).Create(table).Error
}

// UpdateByAddress update a record by address
func (d *tokenDao) UpdateByAddress(ctx context.Context, table *model.Token) error {
	err := d.updateDataByID(ctx, d.db, table)

	// delete cache
	_ = d.deleteCache(ctx, table.TokenAddress)

	return err
}

func (d *tokenDao) updateDataByID(ctx context.Context, db *gorm.DB, table *model.Token) error {
	if table.ID < 1 {
		return errors.New("id cannot be 0")
	}

	update := map[string]interface{}{}

	if table.TokenName != "" {
		update["token_name"] = table.TokenName
	}
	if table.ChainID != "" {
		update["chain_id"] = table.ChainID
	}
	if table.TokenLogo != "" {
		update["token_logo"] = table.TokenLogo
	}
	if table.TokenTicker != "" {
		update["token_ticker"] = table.TokenTicker
	}
	if table.TokenDescribe != "" {
		update["token_describe"] = table.TokenDescribe
	}
	if table.AuctionTime != "" {
		update["auction_time"] = table.AuctionTime
	}
	if table.WebSite != "" {
		update["web_site"] = table.WebSite
	}
	if table.TwitterUrl != "" {
		update["twitter_url"] = table.TwitterUrl
	}
	if table.TelegramUrl != "" {
		update["telegram_url"] = table.TelegramUrl
	}
	if table.TokenAddress != "" {
		update["token_address"] = table.TokenAddress
	}
	if table.Farcaster != "" {
		update["farcaster"] = table.Farcaster
	}
	if table.TotalSupply != "" {
		update["total_supply"] = table.TotalSupply
	}
	if table.StartBlock != 0 {
		update["start_block"] = table.StartBlock
	}
	if table.EndBlock != 0 {
		update["end_block"] = table.EndBlock
	}
	if table.DevPurchase != 0 {
		update["dev_purchase"] = table.DevPurchase
	}
	if table.InitialLiquidity != 0 {
		update["initial_liquidity"] = table.InitialLiquidity
	}
	if table.TokenPrice != "" {
		update["token_price"] = table.TokenPrice
	}
	if table.ViewCount != 0 {
		update["view_count"] = table.ViewCount
	}
	if table.TokenReleased != 0 {
		update["token_released"] = table.TokenReleased
	}
	if table.PairAddress != "" {
		update["pair_address"] = table.PairAddress
	}
	if table.CreatorAddress != "" {
		update["creator_address"] = table.CreatorAddress
	}
	if table.Fee != 0 {
		update["fee"] = table.Fee
	}

	return db.WithContext(ctx).Model(table).Updates(update).Error
}

// GetByAddress get a record by address
func (d *tokenDao) GetByAddress(ctx context.Context, address string) (*model.Token, error) {
	// no cache
	if d.cache == nil {
		record := &model.Token{}
		err := d.db.WithContext(ctx).Where("token_address = ?", address).First(record).Error
		return record, err
	}

	// get from cache or database
	record, err := d.cache.Get(ctx, address)
	if err == nil {
		return record, nil
	}

	if errors.Is(err, model.ErrCacheNotFound) {
		// for the same id, prevent high concurrent simultaneous access to database
		val, err, _ := d.sfg.Do(address, func() (interface{}, error) { //nolint
			table := &model.Token{}
			err = d.db.WithContext(ctx).Where("token_address = ?", address).First(table).Error
			if err != nil {
				// if data is empty, set not found cache to prevent cache penetration, default expiration time 10 minutes
				if errors.Is(err, model.ErrRecordNotFound) {
					err = d.cache.SetCacheWithNotFound(ctx, address)
					if err != nil {
						return nil, err
					}
					return nil, model.ErrRecordNotFound
				}
				return nil, err
			}
			// set cache
			err = d.cache.Set(ctx, address, table, cache.TokenExpireTime)
			if err != nil {
				return nil, fmt.Errorf("cache.Set error: %v, id=%s", err, address)
			}
			return table, nil
		})
		if err != nil {
			return nil, err
		}
		table, ok := val.(*model.Token)
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
func (d *tokenDao) GetByColumns(ctx context.Context, params *query.Params) ([]*model.Token, int64, error) {
	queryStr, args, err := params.ConvertToGormConditions()

	if len(params.Columns) >= 4 {
		lastAndIndex := strings.LastIndex(queryStr, "AND")
		if lastAndIndex != -1 {
			queryStr = queryStr[:lastAndIndex+3] + " (" + queryStr[lastAndIndex+4:] + ")"
		}
	}

	if err != nil {
		return nil, 0, errors.New("query params error: " + err.Error())
	}

	var total int64
	if params.Sort != "ignore count" { // determine if count is required
		err = d.db.WithContext(ctx).Model(&model.Token{}).Select([]string{"id"}).Where(queryStr, args...).Count(&total).Error
		if err != nil {
			return nil, 0, err
		}
		if total == 0 {
			return nil, total, nil
		}
	}

	records := []*model.Token{}
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
func (d *tokenDao) CreateByTx(ctx context.Context, tx *gorm.DB, table *model.Token) (uint64, error) {
	err := tx.WithContext(ctx).Create(table).Error
	return table.ID, err
}

// UpdateByTx update a record by id in the database using the provided transaction
func (d *tokenDao) UpdateByTx(ctx context.Context, tx *gorm.DB, table *model.Token) error {
	err := d.updateDataByID(ctx, tx, table)

	// delete cache
	_ = d.deleteCache(ctx, table.TokenAddress)

	return err
}

func (d *tokenDao) GetTokenByTokenAddress(tokenAddress string) (*model.Token, error) {
	var token model.Token
	if err := d.db.Where("token_address = ?", tokenAddress).First(&token).Error; err != nil {
		return nil, err
	}
	return &token, nil
}
