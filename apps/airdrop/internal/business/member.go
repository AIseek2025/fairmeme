package business

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"strconv"
	"time"

	"gorm.io/gorm"
)

type Member struct {
	ID             int64  `json:"id" gorm:"column:id"`
	CreatorAddress string `json:"creatorAddress" gorm:"column:creator_address"`
	MemberName     string `json:"memberName" gorm:"column:member_name"`
	PictureURL     string `json:"pictureUrl" gorm:"column:picture_url"`
	MemberStatus   int    `json:"memberStatus" gorm:"column:member_status"`
	ChainID        string `json:"chainId" gorm:"column:chain_id"`
	TwName         string `json:"twName" gorm:"column:tw_name"`
	TwUserName     string `json:"twUserName" gorm:"column:tw_userName"`
	TwAvatarUrl    string `json:"twAvatarUrl" gorm:"column:tw_AvatarUrl"`
	TwScore        string `json:"twScore" gorm:"column:tw_score"`
	InviteCode     string `json:"inviteCode" gorm:"column:invite_code"`
	InvitedCode    string `json:"invitedCode" gorm:"column:invited_code"`
}

func (Member) TableName() string {
	return "members"
}

type GetTwScoreParams struct {
	CreatorAddress string `json:"creatorAddress"`
}

type UpdateMemberParams struct {
	CreatorAddress string `json:"creatorAddress"`
	TwUserName     string `json:"twUserName"`
}

type MemberServer struct {
	ctx     context.Context
	db      *gorm.DB
	twitter *TweetScoutService
}

func NewMemberServer(ctx context.Context, db *gorm.DB) *MemberServer {
	return &MemberServer{
		ctx: ctx,
		db:  db,
		twitter: NewTweetScoutService(TweetScoutOptions{
			ApiKey:     os.Getenv("TWEETSCOUT_API_KEY"),
			Timeout:    10 * time.Second,
			RetryTimes: 3,
			RetryWait:  2 * time.Second,
		}),
	}
}

func (s *MemberServer) GetTwScoreHandler(w http.ResponseWriter, r *http.Request) {
	var params GetTwScoreParams
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		s.respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if params.CreatorAddress == "" {
		s.respondWithError(w, http.StatusBadRequest, "Creator address and Chain ID are required")
		return
	}

	score, err := s.getTwScore(s.ctx, params.CreatorAddress)
	if err != nil {
		s.respondWithError(w, http.StatusInternalServerError, "Error fetching Twitter score: "+err.Error())
		return
	}

	s.respondWithJSON(w, http.StatusOK, Response{
		Code: 0,
		Msg:  "ok",
		Data: map[string]string{
			"tw_score": score,
		},
	})
}

func (s *MemberServer) GetTwRankHandler(w http.ResponseWriter, r *http.Request) {
	type GetTwRankParams struct {
		Page     int `json:"page"`
		PageSize int `json:"pageSize"`
	}

	type TwRankResponse struct {
		ID             int64  `json:"id" gorm:"column:id"`
		MemberName     string `json:"memberName" gorm:"column:member_name"`
		TwName         string `json:"twName" gorm:"column:tw_name"`
		TwUserName     string `json:"twUserName" gorm:"column:tw_userName"`
		TwAvatarUrl    string `json:"twAvatarUrl" gorm:"column:tw_AvatarUrl"`
		TwScore        string `json:"total" gorm:"column:tw_score"`
		CreatorAddress string `json:"creatorAddress" gorm:"column:creator_address"`
	}

	var params GetTwRankParams
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		s.respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if params.Page <= 0 {
		params.Page = 1
	}
	if params.PageSize <= 0 {
		params.PageSize = 10
	}

	offset := (params.Page - 1) * params.PageSize

	var total int64
	err := s.db.WithContext(s.ctx).
		Model(&Member{}).
		Where(`COALESCE(NULLIF(tw_reward, ''), '0') != '0'`).
		Count(&total).Error
	if err != nil {
		s.respondWithError(w, http.StatusInternalServerError, "Error fetching total members: "+err.Error())
		return
	}

	members := make([]TwRankResponse, 0)
	err = s.db.WithContext(s.ctx).
		Model(&Member{}).
		Select(`id, creator_address, tw_name, "tw_userName", "tw_AvatarUrl", member_name, COALESCE(NULLIF(tw_reward, ''), '0') as tw_score`).
		Where(`COALESCE(NULLIF(tw_reward, ''), '0') != '0'`).
		Order(`CAST(COALESCE(NULLIF(tw_reward, ''), '0') AS INTEGER) DESC`).
		Limit(params.PageSize).
		Offset(offset).
		Scan(&members).Error
	if err != nil {
		s.respondWithError(w, http.StatusInternalServerError, "Error fetching Twitter rank: "+err.Error())
		return
	}

	s.respondWithJSON(w, http.StatusOK, Response{
		Code: 0,
		Msg:  "ok",
		Data: map[string]interface{}{
			"item":     members,
			"total":    total,
			"page":     params.Page,
			"pageSize": params.PageSize,
		},
	})
}
func (s *MemberServer) updateMemberTwScore(ctx context.Context, creatorAddress string, twScore int, twReward string) error {
	return s.db.WithContext(ctx).
		Model(&Member{}).
		Where("creator_address = ?", creatorAddress).
		Updates(map[string]interface{}{
			"tw_score":  strconv.Itoa(twScore),
			"tw_reward": twReward,
		}).Error
}
func (s *MemberServer) getTwScore(ctx context.Context, creatorAddress string) (string, error) {
	var member Member
	err := s.db.WithContext(ctx).Where("creator_address = ?", creatorAddress).First(&member).Error
	if err != nil {
		return "", err
	}
	return member.TwScore, nil
}

func (s *MemberServer) getMember(ctx context.Context, creatorAddress string) (*Member, error) {
	var member Member
	err := s.db.WithContext(ctx).Where("creator_address = ?", creatorAddress).First(&member).Error
	if err != nil {
		return nil, err
	}
	return &member, nil
}

func (s *MemberServer) respondWithError(w http.ResponseWriter, code int, message string) {
	s.respondWithJSON(w, code, Response{Code: -1, Msg: message, Data: nil})
}

type CheckInviteCodeRequestParams struct {
	ID      string `json:"id"`
	Address string `json:"address"`
}

func (s *MemberServer) CheckInviteCode(w http.ResponseWriter, r *http.Request) {
	var params CheckInviteCodeRequestParams
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		s.respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}
	var member Member
	var checkResult bool
	result := s.db.WithContext(s.ctx).Where("id = ? and creator_address != ?", params.ID, params.Address).First(&member)
	if result.Error == nil {
		checkResult = true
	}

	s.respondWithJSON(w, http.StatusOK, Response{
		Code: 0,
		Msg:  "Invite Code Exist",
		Data: map[string]interface{}{
			"checkResult": checkResult,
		},
	})
}

func (s *MemberServer) respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(payload)
}

func (s *MemberServer) getAirdropAmountByScore(score int64) int64 {
	scoreRanges := []struct {
		min, max, airdrop int64
	}{
		{4000, 5000, 4000000},
		{3000, 3999, 3000000},
		{2000, 2999, 2000000},
		{1500, 1999, 1500000},
		{1000, 1499, 1000000},
		{900, 999, 900000},
		{800, 899, 800000},
		{700, 799, 700000},
		{600, 699, 600000},
		{500, 599, 500000},
		{400, 499, 400000},
		{300, 399, 300000},
		{200, 299, 200000},
		{100, 199, 100000},
		{90, 99, 90000},
		{80, 89, 80000},
		{70, 79, 70000},
		{60, 69, 60000},
		{50, 59, 50000},
		{40, 49, 40000},
		{30, 39, 30000},
		{20, 29, 20000},
		{10, 19, 10000},
	}

	for _, rangeVal := range scoreRanges {
		if score >= rangeVal.min && score <= rangeVal.max {
			return rangeVal.airdrop
		}
	}
	return 0
}
