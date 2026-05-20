package service

import (
	"context"
	"github.com/fair-meme/fairmeme/apps/api/internal/dao"
	"github.com/zhufuyi/sponge/pkg/utils"
)

type TokenService struct {
	holdersDao dao.HoldersDao
}

func NewTokenService(holdersDao dao.HoldersDao) *TokenService {
	return &TokenService{
		holdersDao: holdersDao,
	}
}

func (s *TokenService) GetTokensBalanceByMember(ctx context.Context, address string) (map[string]float64, error) {
	holdersList, err := s.holdersDao.GetTokensBalanceByMember(ctx, address)
	if err != nil {
		return nil, err
	}
	holdersMap := make(map[string]float64)
	for _, holder := range holdersList {
		holdersMap[holder.TokenAddress] = utils.StrToFloat64(holder.Balance)

	}

	return holdersMap, nil
}
