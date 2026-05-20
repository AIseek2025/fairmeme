package business

import (
	"context"
	"encoding/json"
	"net/http"

	"gorm.io/gorm"
)

type TradeLog struct {
	ID             int64   `json:"id" gorm:"column:id"`
	TradeVolume    int64   `json:"tradeVolume" gorm:"column:trade_volume"`
	TradeVolFloat  float64 `json:"tradeVolFloat"`
	TxHash         string  `json:"txHash" gorm:"column:tx_hash"`
	Rewards        int64   `json:"total" gorm:"column:rewards"`
	CreatedTime    int64   `json:"createdTime" gorm:"column:created_time"`
	CreatorAddress string  `json:"creatorAddress" gorm:"column:creator_address"`
}

func (TradeLog) TableName() string {
	return "trade_log"
}

type TradeLogRequestParams struct {
	Page           int    `json:"page"`
	PageSize       int    `json:"pageSize"`
	CreatorAddress string `json:"creatorAddress"`
}

type TradeLogServer struct {
	ctx context.Context
	db  *gorm.DB
}

func NewTradeLogServer(ctx context.Context, db *gorm.DB) *TradeLogServer {
	return &TradeLogServer{
		ctx: ctx,
		db:  db,
	}
}

func (s *TradeLogServer) GetTradeLogsHandler(w http.ResponseWriter, r *http.Request) {
	var params TradeLogRequestParams
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		s.respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if params.Page == 0 {
		params.Page = 1
	}
	if params.PageSize == 0 {
		params.PageSize = 10
	}

	if params.CreatorAddress == "" {
		s.respondWithError(w, http.StatusBadRequest, "Creator address is required")
		return
	}

	offset := (params.Page - 1) * params.PageSize

	var total int64
	err := s.db.WithContext(s.ctx).
		Model(&TradeLog{}).
		Where("creator_address = ?", params.CreatorAddress).
		Count(&total).Error
	if err != nil {
		s.respondWithError(w, http.StatusInternalServerError, "Error fetching total trade logs: "+err.Error())
		return
	}

	logs, err := s.getTradeLogs(s.ctx, params.CreatorAddress, params.PageSize, offset)
	if err != nil {
		s.respondWithError(w, http.StatusInternalServerError, "Error fetching trade logs: "+err.Error())
		return
	}
	for i, log := range logs {
		logs[i].TradeVolFloat = float64(log.TradeVolume) / 1000000000.0
	}
	s.respondWithJSON(w, http.StatusOK, Response{
		Code: 0,
		Msg:  "ok",
		Data: map[string]interface{}{
			"item":     logs,
			"total":    total,
			"page":     params.Page,
			"pageSize": params.PageSize,
		},
	})
}
func (s *TradeLogServer) getTradeLogs(ctx context.Context, creatorAddress string, limit, offset int) ([]TradeLog, error) {
	var logs []TradeLog

	err := s.db.WithContext(ctx).
		Where("creator_address = ?", creatorAddress).
		Order("created_time DESC").
		Limit(limit).
		Offset(offset).
		Find(&logs).Error

	if err != nil {
		return nil, err
	}
	return logs, nil
}

func (s *TradeLogServer) getTradeTotal(ctx context.Context, creatorAddress string) (int64, float64, error) {
	var result struct {
		TotalRewards  int64
		TotalTradeVol float64
	}

	err := s.db.WithContext(ctx).
		Model(&TradeLog{}).
		Where("creator_address = ?", creatorAddress).
		Select("COALESCE(SUM(rewards), 0) AS total_rewards, COALESCE(SUM(trade_volume)/1000000000, 0) AS total_trade_vol").
		Scan(&result).Error
	if err != nil {
		return 0, 0, err
	}

	return result.TotalRewards, result.TotalTradeVol, nil
}

func (s *TradeLogServer) respondWithError(w http.ResponseWriter, code int, message string) {
	s.respondWithJSON(w, code, Response{Code: -1, Msg: message, Data: nil})
}

func (s *TradeLogServer) respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(payload)
}
