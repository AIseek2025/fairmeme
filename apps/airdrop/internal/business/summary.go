package business

import (
	"context"
	"encoding/json"
	"errors"
	"github.com/go-redis/redis/v8"
	"gorm.io/gorm"
	"net/http"
	"sort"
	"strconv"
	"time"
)

type SummaryRequestParams struct {
	CreatorAddress string `json:"creatorAddress"`
}

type SummaryResponse struct {
	SumTotal     int64   `json:"total"`
	TradeTotal   int64   `json:"tradeTotal"`
	TwTotal      int64   `json:"twTotal"`
	CreateTotal  int64   `json:"createTotal"`
	AddressTotal int64   `json:"addressTotal"`
	InviteTotal  int64   `json:"inviteTotal"`
	CreatCount   int64   `json:"creatorCount"`
	TradeVol     float64 `json:"tradeVol"`
	Invitees     int64   `json:"inviteCount"`
	Eligible     string  `json:"eligible"`
	Member
}

type SummaryServer struct {
	db           *gorm.DB
	rdb          *redis.Client
	ctx          context.Context
	InviteServer *InviteServer
	TradeServer  *TradeLogServer
	MemberServer *MemberServer
	TokenServer  *TokenServer
}

func NewSummaryServer(ctx context.Context, db *gorm.DB, rdb *redis.Client) *SummaryServer {
	return &SummaryServer{
		db:           db,
		rdb:          rdb,
		ctx:          ctx,
		InviteServer: NewInvitationServer(ctx, db),
		TradeServer:  NewTradeLogServer(ctx, db),
		MemberServer: NewMemberServer(ctx, db),
		TokenServer:  NewTokenServer(ctx, db),
	}
}

func (s *SummaryServer) GetSummaryHandler(w http.ResponseWriter, r *http.Request) {
	var params SummaryRequestParams
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		s.respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}
	if params.CreatorAddress == "" {
		s.respondWithError(w, http.StatusBadRequest, "Creator address is required")
		return
	}
	summaryResp, err := s.getSummaryTotal(params.CreatorAddress)
	if err != nil {
		s.respondWithError(w, http.StatusInternalServerError, "Error fetching summary total: "+err.Error())
		return
	}
	s.respondWithJSON(w, http.StatusOK, Response{
		Code: 0,
		Msg:  "ok",
		Data: summaryResp,
	})
}

func (s *SummaryServer) GetProgress(w http.ResponseWriter, r *http.Request) {
	type TotalSchedule struct {
		Consume      string `json:"consume"`
		Twitter      string `json:"twitter"`
		Address      string `json:"address"`
		AddressCount string `json:"addressCount"`
		TwitterCount string `json:"twitterCount"`
	}

	schedule := TotalSchedule{
		Consume:      s.rdb.Get(context.Background(), "consumeProgress").Val(),
		Twitter:      s.rdb.Get(context.Background(), "twitterProgress").Val(),
		Address:      s.rdb.Get(context.Background(), "addressProgress").Val(),
		AddressCount: s.rdb.Get(context.Background(), "addressCount").Val(),
		TwitterCount: s.rdb.Get(context.Background(), "twitterCount").Val(),
	}
	s.respondWithJSON(w, http.StatusOK, Response{
		Code: 0,
		Msg:  "ok",
		Data: schedule,
	})
}

func (s *SummaryServer) AutoProgress() {
	type RewardsSum struct {
		Type  int64
		Total int64
	}
	var rewardsSums []RewardsSum

	s.db.Model(&InviteLog{}).
		Select("type, COALESCE(SUM(rewards), 0) as total").
		Where("type IN ?", []int64{1, 2, 3}).
		Group("type").
		Find(&rewardsSums)

	var sumType1, sumType2, sumType3 int64
	for _, rs := range rewardsSums {
		switch rs.Type {
		case 1:
			sumType1 = rs.Total
		case 2:
			sumType2 = rs.Total
		case 3:
			sumType3 = rs.Total
		}
	}
	var createTotal, tradeTotal, twitterTotal, addressTotal, twitterCount, addressCount int64
	s.db.Model(&Token{}).Where("pair_address IS NOT NULL AND pair_address != ?", "").Count(&createTotal)
	s.db.Model(&TradeLog{}).Select("COALESCE(SUM(rewards), 0)").Scan(&tradeTotal)
	s.db.Model(&Member{}).Select("COALESCE(SUM(tw_reward), 0)").Scan(&twitterTotal)
	s.db.Model(&UserAirdrop{}).Where("eligible = ?", true).Count(&addressTotal)
	s.db.Model(&Member{}).Count(&addressCount)
	consume := sumType1 + (createTotal * 5e4) + tradeTotal
	twitter := sumType2 + twitterTotal
	address := sumType3 + (addressTotal * 1e4)
	s.db.Model(&Member{}).Where("tw_name IS NOT NULL and tw_name != ''").Count(&twitterCount)
	s.rdb.Set(context.Background(), "consumeProgress", consume, 0)
	s.rdb.Set(context.Background(), "twitterProgress", twitter, 0)
	s.rdb.Set(context.Background(), "addressProgress", address, 0)
	s.rdb.Set(context.Background(), "addressCount", addressCount, 0)
	s.rdb.Set(context.Background(), "twitterCount", twitterCount, 0)
}

func (s *SummaryServer) UpdateTwScoreHandler(w http.ResponseWriter, r *http.Request) {
	var params UpdateMemberParams
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if params.CreatorAddress == "" || params.TwUserName == "" {
		s.respondWithError(w, http.StatusBadRequest, "Creator address, Chain ID, and Twitter Username are required")
		return
	}

	score, err := s.MemberServer.twitter.GetUserScore(params.TwUserName)
	if err != nil {
		s.respondWithError(w, http.StatusInternalServerError, "Error fetching Twitter score: "+err.Error())
		return
	}

	byScore := s.MemberServer.getAirdropAmountByScore(int64(score))
	err = s.MemberServer.updateMemberTwScore(s.ctx, params.CreatorAddress, score, strconv.FormatInt(byScore, 10))
	s.InviteServer.inviteAward(params.CreatorAddress, int(byScore), 2)
	if err != nil {
		s.respondWithError(w, http.StatusInternalServerError, "Error updating member tw_score: "+err.Error())
		return
	}

	s.respondWithJSON(w, http.StatusOK, Response{
		Code: 0,
		Msg:  "ok",
		Data: nil,
	})
}

func (s *SummaryServer) getSummaryTotal(creatorAddress string) (*SummaryResponse, error) {
	summaryResp := &SummaryResponse{}

	member, err := s.MemberServer.getMember(s.ctx, creatorAddress)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return summaryResp, nil
	}
	if member.TwScore == "" {
		member.TwScore = "0"
	}
	twScore, err := strconv.ParseInt(member.TwScore, 10, 64)
	if err != nil {
		return nil, err
	}

	summaryResp.Member = *member
	summaryResp.TwTotal = s.MemberServer.getAirdropAmountByScore(twScore)

	summaryResp.InviteTotal, summaryResp.Invitees, err = s.InviteServer.getInviteTotal(s.ctx, creatorAddress)
	if err != nil {
		return nil, err
	}

	summaryResp.TradeTotal, summaryResp.TradeVol, err = s.TradeServer.getTradeTotal(s.ctx, creatorAddress)
	if err != nil {
		return nil, err
	}
	summaryResp.CreatCount, err = s.TokenServer.getTokenCount(s.ctx, creatorAddress)
	if err != nil {
		return nil, err
	}
	summaryResp.CreateTotal = summaryResp.CreatCount * 50000

	summaryResp.AddressTotal, err = s.getAddressTotal(creatorAddress)
	if err != nil {
		return nil, err
	}

	eligibility, err := s.getAddressEligibilityStatus(creatorAddress)
	if err != nil {
		return nil, err
	}
	summaryResp.Eligible = eligibility

	summaryResp.SumTotal = summaryResp.TwTotal + summaryResp.InviteTotal + summaryResp.TradeTotal + summaryResp.CreateTotal + summaryResp.AddressTotal

	return summaryResp, nil
}

func (s *SummaryServer) GetAirdropRankHandler(w http.ResponseWriter, r *http.Request) {
	type AirdropRankingRequestParams struct {
		Page     int `json:"page"`
		PageSize int `json:"pageSize"`
	}
	type AirdropRankingResponse struct {
		CreatorAddress string `json:"creatorAddress"`
		TotalAirdrop   int64  `json:"total"`
	}

	var params AirdropRankingRequestParams
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

	rankingData, err := s.rdb.Get(s.ctx, "airdrop_ranking").Result()
	if errors.Is(err, redis.Nil) {
		s.respondWithError(w, http.StatusNotFound, "Ranking data not found in Redis")
		return
	} else if err != nil {
		s.respondWithError(w, http.StatusInternalServerError, "Error fetching ranking data from Redis: "+err.Error())
		return
	}

	var rankings []AirdropRankingResponse
	if err := json.Unmarshal([]byte(rankingData), &rankings); err != nil {
		s.respondWithError(w, http.StatusInternalServerError, "Error parsing ranking data: "+err.Error())
		return
	}

	totalRankings := len(rankings)
	startIndex := (params.Page - 1) * params.PageSize
	endIndex := startIndex + params.PageSize

	if startIndex >= totalRankings {
		s.respondWithJSON(w, http.StatusOK, Response{
			Code: 0,
			Msg:  "ok",
			Data: map[string]interface{}{
				"item":     []AirdropRankingResponse{},
				"total":    totalRankings,
				"page":     params.Page,
				"pageSize": params.PageSize,
			},
		})
		return
	}

	if endIndex > totalRankings {
		endIndex = totalRankings
	}

	paginatedRankings := rankings[startIndex:endIndex]

	s.respondWithJSON(w, http.StatusOK, Response{
		Code: 0,
		Msg:  "ok",
		Data: map[string]interface{}{
			"item":     paginatedRankings,
			"total":    totalRankings,
			"page":     params.Page,
			"pageSize": params.PageSize,
		},
	})
}

func (s *SummaryServer) UpdateAirdropRanking() {
	var rankings []struct {
		CreatorAddress string `json:"creatorAddress" gorm:"column:creator_address"`
		Total          int64  `json:"total" gorm:"column:total"`
	}
	err := s.db.WithContext(s.ctx).Raw(`
		WITH RankingData AS (
			SELECT
				m.creator_address AS creator_address,
				COALESCE(CAST(NULLIF(m.tw_reward, '') AS INTEGER), 0) AS tw_reward,
				(SELECT COALESCE(SUM(Rewards), 0) FROM invitation_log i WHERE i.creator_address = m.creator_address) AS invite_total,
				(SELECT COALESCE(SUM(Rewards), 0) FROM trade_log t WHERE t.creator_address = m.creator_address) AS trade_total,
				(SELECT COUNT(*) * 50000 FROM token tk WHERE tk.creator_address = m.creator_address AND tk.pair_address IS NOT NULL AND tk.pair_address != '') AS create_total,
				(SELECT COALESCE(SUM(CASE WHEN ua.eligible THEN 10000 ELSE 0 END), 0) FROM user_airdrops ua WHERE ua.user_address = m.creator_address) AS address_total
			FROM
				members m
		)
		SELECT
			creator_address,
			(tw_reward + invite_total + trade_total + create_total + address_total) AS total
		FROM
			RankingData
		WHERE
			(tw_reward + invite_total + trade_total + create_total + address_total) > 0
	`).Scan(&rankings).Error
	if err != nil {
		return
	}
	sort.Slice(rankings, func(i, j int) bool {
		return rankings[i].Total > rankings[j].Total
	})
	rankingData, err := json.Marshal(rankings)
	if err != nil {
		return
	}
	err = s.rdb.Set(s.ctx, "airdrop_ranking", rankingData, 0).Err()
	if err != nil {
		return
	}
}

type UserAirdrop struct {
	UserAddress string `gorm:"column:user_address;primaryKey"`
	ChainName   string `gorm:"column:chain_name;primaryKey"`
	Eligible    *bool  `gorm:"column:eligible"`
}

func (s *SummaryServer) getAddressTotal(creatorAddress string) (int64, error) {
	var eligible bool

	err := s.db.WithContext(s.ctx).
		Model(&UserAirdrop{}).
		Select("eligible").
		Where("user_address = ?", creatorAddress).
		Scan(&eligible).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return 0, nil
		}
		return 0, err
	}

	if eligible {
		return 10000, nil
	}
	return 0, nil
}

func (s *SummaryServer) getAddressEligibilityStatus(creatorAddress string) (string, error) {
	var userAirdrop UserAirdrop
	err := s.db.WithContext(s.ctx).
		Model(&UserAirdrop{}).
		Where("user_address = ?", creatorAddress).
		First(&userAirdrop).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return "", nil
		}
		return "", err
	}

	if userAirdrop.Eligible == nil {
		return "", nil
	} else if *userAirdrop.Eligible {
		return "1", nil
	} else {
		return "0", nil
	}
}

func (s *SummaryServer) GetAirdropTotal(creatorAddress string) (int64, error) {
	var result struct {
		TwTotal      int64 `gorm:"column:tw_total"`
		InviteTotal  int64 `gorm:"column:invite_total"`
		TradeTotal   int64 `gorm:"column:trade_total"`
		CreateTotal  int64 `gorm:"column:create_total"`
		AddressTotal int64 `gorm:"column:address_total"`
	}

	err := s.db.Raw(`
		SELECT
			COALESCE(CAST(NULLIF(m.tw_score, '') AS INTEGER), 0) AS tw_total,
			(SELECT COALESCE(SUM(Rewards), 0) FROM invitation_log i WHERE i.creator_address = m.creator_address) AS invite_total,
			(SELECT COALESCE(SUM(Rewards), 0) FROM trade_log t WHERE t.creator_address = m.creator_address) AS trade_total,
			(SELECT COUNT(*) * 50000 FROM token tk WHERE tk.creator_address = m.creator_address AND tk.pair_address IS NOT NULL AND tk.pair_address != '') AS create_total,
			(SELECT COALESCE(SUM(CASE WHEN ua.eligible THEN 10000 ELSE 0 END), 0) FROM user_airdrops ua WHERE ua.user_address = m.creator_address) AS address_total
		FROM
			members m
		WHERE
			m.creator_address = ?
	`, creatorAddress).Scan(&result).Error

	if err != nil {
		return 0, err
	}
	total := s.MemberServer.getAirdropAmountByScore(result.TwTotal) + result.InviteTotal + result.TradeTotal + result.CreateTotal + result.AddressTotal
	return total, nil
}

func (s *SummaryServer) respondWithError(w http.ResponseWriter, code int, message string) {
	s.respondWithJSON(w, code, Response{Code: -1, Msg: message, Data: nil})
}

func (s *SummaryServer) respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(payload)
}

func (s *SummaryServer) BindingInvite() {
	pubsub := s.rdb.Subscribe(context.Background(), "referral")
	defer pubsub.Close()

	pubsub.Receive(context.Background())

	ch := pubsub.Channel()

	type Payload struct {
		InviteCode string `json:"invited_code"`
		User       string `json:"user"`
	}
	for msg := range ch {
		var payload Payload
		json.Unmarshal([]byte(msg.Payload), &payload)
		var inviteMember Member
		result := s.db.Model(&Member{}).Where("id = ?", payload.InviteCode).First(&inviteMember)
		if result.Error == nil {
			if !errors.Is(result.Error, gorm.ErrRecordNotFound) {
				var count int64
				s.db.Model(&InviteLog{}).Where("invited_address = ? and type = 3", payload.User).Count(&count)
				if count > 0 {
					continue
				}
				airdorpTotal, _ := s.GetAirdropTotal(payload.User)
				s.db.Model(&Member{}).Where("creator_address = ?", payload.User).Update("invited_code", payload.InviteCode)
				s.db.Model(&InviteLog{}).Create(&InviteLog{
					InvitedAddress: payload.User,
					Rewards:        airdorpTotal / 10,
					Type:           3,
					CreatorAddress: inviteMember.CreatorAddress,
					CreatedTime:    time.Now().Unix(),
				})
			}
		}
	}
}
