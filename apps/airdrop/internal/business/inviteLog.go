package business

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"gorm.io/gorm"
)

type Response struct {
	Code int         `json:"code"`
	Msg  string      `json:"msg"`
	Data interface{} `json:"data"`
}

func (InviteLog) TableName() string {
	return "invitation_log"
}

type InviteLog struct {
	ID             int64  `json:"id"`
	InvitedAddress string `json:"invitedAddress" gorm:"column:invited_address"`
	Rewards        int64  `json:"total" gorm:"column:rewards"`
	CreatedTime    int64  `json:"createdTime" gorm:"column:created_time"`
	Type           int64  `json:"type" gorm:"column:type"`
	CreatorAddress string `json:"creatorAddress" gorm:"column:creator_address"`
}

type RequestParams struct {
	CreatorAddress string `json:"creatorAddress"`
	Page           int    `json:"page"`
	PageSize       int    `json:"pageSize"`
}

type InviteServer struct {
	ctx context.Context
	db  *gorm.DB
}

func NewInvitationServer(ctx context.Context, db *gorm.DB) *InviteServer {
	return &InviteServer{
		ctx: ctx,
		db:  db,
	}
}

func (s *InviteServer) GetInviteLogsHandler(w http.ResponseWriter, r *http.Request) {
	var params RequestParams
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if params.CreatorAddress == "" {
		s.respondWithError(w, http.StatusBadRequest, "Creator address is required")
		return
	}

	if params.Page == 0 {
		params.Page = 1
	}
	if params.PageSize == 0 {
		params.PageSize = 10
	}

	offset := (params.Page - 1) * params.PageSize

	var total int64
	err := s.db.WithContext(s.ctx).
		Model(&InviteLog{}).
		Where("creator_address = ?", params.CreatorAddress).
		Count(&total).Error
	if err != nil {
		s.respondWithError(w, http.StatusInternalServerError, "Error fetching total invitation logs: "+err.Error())
		return
	}

	logs, err := s.getInviteLogs(s.ctx, params.CreatorAddress, params.PageSize, offset)
	if err != nil {
		s.respondWithError(w, http.StatusInternalServerError, "Error fetching invitation logs: "+err.Error())
		return
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

func (s *InviteServer) getInviteLogs(ctx context.Context, creatorAddress string, limit, offset int) ([]InviteLog, error) {
	var logs []InviteLog

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

func (s *InviteServer) getInviteTotal(ctx context.Context, creatorAddress string) (int64, int64, error) {
	var result struct {
		TotalRewards int64
		InviteCount  int64
	}
	err := s.db.WithContext(ctx).
		Model(&InviteLog{}).
		Where("creator_address = ?", creatorAddress).
		Select("COALESCE(SUM(rewards), 0) AS total_rewards").
		Scan(&result).Error
	if err != nil {
		return 0, 0, err
	}

	err = s.db.WithContext(ctx).
		Raw(`SELECT COUNT(*)
			FROM members m
			INNER JOIN members s ON CAST(m.id AS VARCHAR) = s.invited_code
			WHERE m.creator_address = ?`, creatorAddress).
		Scan(&result.InviteCount).Error
	if err != nil {
		return 0, 0, err
	}

	return result.TotalRewards, result.InviteCount, nil
}

func (s *InviteServer) respondWithError(w http.ResponseWriter, code int, message string) {
	s.respondWithJSON(w, code, Response{Code: -1, Msg: message, Data: nil})
}

func (s *InviteServer) respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(payload)
}

func (s *InviteServer) inviteAward(creatorAddress string, rewards int, inviteType int) {
	var member Member
	s.db.WithContext(s.ctx).Where("creator_address = ?", creatorAddress).First(&member)
	if member.InvitedCode != "" {
		var inviteMember Member
		s.db.WithContext(s.ctx).Where("id = ?", member.InvitedCode).First(&inviteMember)
		inviteLog := InviteLog{
			InvitedAddress: creatorAddress,
			Rewards:        int64(rewards / 10),
			Type:           int64(inviteType),
			CreatorAddress: inviteMember.CreatorAddress,
			CreatedTime:    time.Now().Unix(),
		}
		s.db.WithContext(s.ctx).Create(&inviteLog)
	}
}
