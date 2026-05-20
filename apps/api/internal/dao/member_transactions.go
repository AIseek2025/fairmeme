package dao

import (
	"context"
	"github.com/fair-meme/fairmeme/apps/api/internal/model"
	"errors"

	"github.com/zhufuyi/sponge/pkg/ggorm/query"
	"gorm.io/gorm"
)

var _ MemberTransactionsDao = (*memberTransactionsDao)(nil)

type memberTransactionsDao struct {
	db *gorm.DB
}

type MemberTransactionsDao interface {
	Create(ctx context.Context, table *model.MemberRewardTransaction) error
	DeleteByID(ctx context.Context, id uint64) error
	GetByID(ctx context.Context, id uint64) (*model.MemberRewardTransaction, error)
	GetByColumns(ctx context.Context, params *query.Params) ([]*model.MemberRewardTransaction, int64, error)

	CreateByTx(ctx context.Context, tx *gorm.DB, table *model.MemberRewardTransaction) (uint64, error)
	DeleteByTx(ctx context.Context, tx *gorm.DB, id uint64) error
}

func NewMemberTransactionsDao(db *gorm.DB) *memberTransactionsDao {
	return &memberTransactionsDao{
		db,
	}
}

func (d *memberTransactionsDao) Create(ctx context.Context, table *model.MemberRewardTransaction) error {
	return d.db.WithContext(ctx).Create(table).Error
}

func (d *memberTransactionsDao) DeleteByID(ctx context.Context, id uint64) error {
	err := d.db.WithContext(ctx).Where("id = ?", id).Delete(&model.MemberRewardTransaction{}).Error
	if err != nil {
		return err
	}

	return nil
}

func (d *memberTransactionsDao) GetByID(ctx context.Context, id uint64) (*model.MemberRewardTransaction, error) {
	record := &model.MemberRewardTransaction{}
	err := d.db.WithContext(ctx).Where("id = ?", id).First(record).Error
	return record, err
}

func (d *memberTransactionsDao) GetByColumns(ctx context.Context, params *query.Params) ([]*model.MemberRewardTransaction, int64, error) {
	queryStr, args, err := params.ConvertToGormConditions()
	if err != nil {
		return nil, 0, errors.New("query params error: " + err.Error())
	}

	var total int64
	if params.Sort != "ignore count" { // determine if count is required
		err = d.db.WithContext(ctx).Model(&model.MemberRewardTransaction{}).Select([]string{"id"}).Where(queryStr, args...).Count(&total).Error
		if err != nil {
			return nil, 0, err
		}
		if total == 0 {
			return nil, total, nil
		}
	}

	records := []*model.MemberRewardTransaction{}
	order, limit, offset := params.ConvertToPage()
	err = d.db.WithContext(ctx).Order(order).Limit(limit).Offset(offset).Where(queryStr, args...).Find(&records).Error
	if err != nil {
		return nil, 0, err
	}

	return records, total, err
}

func (d *memberTransactionsDao) CreateByTx(ctx context.Context, tx *gorm.DB, table *model.MemberRewardTransaction) (uint64, error) {
	err := tx.WithContext(ctx).Create(table).Error
	return table.ID, err
}

func (d *memberTransactionsDao) DeleteByTx(ctx context.Context, tx *gorm.DB, id uint64) error {
	return tx.WithContext(ctx).Where("id = ?", id).Delete(&model.Members{}).Error
}
