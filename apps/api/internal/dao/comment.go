package dao

import (
	"context"
	"errors"
	"golang.org/x/sync/singleflight"
	"gorm.io/gorm"

	"github.com/fair-meme/fairmeme/apps/api/internal/cache"
	"github.com/fair-meme/fairmeme/apps/api/internal/model"
	"github.com/zhufuyi/sponge/pkg/ggorm/query"
)

var _ CommentDao = (*commentDao)(nil)

// CommentDao defining the dao interface
type CommentDao interface {
	Create(ctx context.Context, table *model.Comment) error
	GetByColumns(ctx context.Context, params *query.Params) ([]*model.Comment, int64, error)

	CreateByTx(ctx context.Context, tx *gorm.DB, table *model.Comment) (uint64, error)
}

type commentDao struct {
	db    *gorm.DB
	cache cache.CommentCache  // if nil, the cache is not used.
	sfg   *singleflight.Group // if cache is nil, the sfg is not used.
}

// NewCommentDao creating the dao interface
func NewCommentDao(db *gorm.DB, xCache cache.CommentCache) CommentDao {
	if xCache == nil {
		return &commentDao{db: db}
	}
	return &commentDao{
		db:    db,
		cache: xCache,
		sfg:   new(singleflight.Group),
	}
}

// Create a record, insert the record and the id value is written back to the table
func (d *commentDao) Create(ctx context.Context, table *model.Comment) error {
	return d.db.WithContext(ctx).Create(table).Error
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
func (d *commentDao) GetByColumns(ctx context.Context, params *query.Params) ([]*model.Comment, int64, error) {
	queryStr, args, err := params.ConvertToGormConditions()
	if err != nil {
		return nil, 0, errors.New("query params error: " + err.Error())
	}

	var total int64
	if params.Sort != "ignore count" { // determine if count is required
		err = d.db.WithContext(ctx).Model(&model.Comment{}).Select([]string{"id"}).Where(queryStr, args...).Count(&total).Error
		if err != nil {
			return nil, 0, err
		}
		if total == 0 {
			return nil, total, nil
		}
	}

	records := []*model.Comment{}
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
func (d *commentDao) CreateByTx(ctx context.Context, tx *gorm.DB, table *model.Comment) (uint64, error) {
	err := tx.WithContext(ctx).Create(table).Error
	return table.ID, err
}
