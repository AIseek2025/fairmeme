package service

import (
	"errors"
	"time"

	"github.com/go-resty/resty/v2"
)

type AirdropOptions struct {
	BaseURL    string
	Timeout    time.Duration `json:"timeout"`
	RetryTimes int           `json:"retry_times"`
	RetryWait  time.Duration `json:"retry_wait"`
}

type AirdropService struct {
	HttpClient *resty.Client
}

type CheckAirdropOptions struct {
	UserAddress string `json:"user_address" form:"user_address"`
	Chain       string `json:"chain" form:"chain"`
}

type CheckAirdropResponse struct {
	Chain       string `json:"chain"`
	UserAddress string `json:"userAddress"`
	Eligible    bool   `json:"eligible"`
}

func NewAirdropService(options AirdropOptions) *AirdropService {
	client := resty.New().
		SetBaseURL(options.BaseURL).
		SetHeader("Content-Type", "application/json").
		SetTimeout(options.Timeout).
		SetRetryCount(options.RetryTimes).
		SetRetryWaitTime(options.RetryWait)
	return &AirdropService{
		HttpClient: client,
	}
}

func (s *AirdropService) CheckAirdrop(options CheckAirdropOptions) (*CheckAirdropResponse, error) {
	resp, err := s.HttpClient.R().SetResult(&CheckAirdropResponse{}).Get("/checkAirdrop")
	if err != nil {
		return nil, err
	}

	data, ok := resp.Result().(*CheckAirdropResponse)
	if !ok {
		return nil, errors.New("failed to convert response to checkAirdrop")
	}
	return data, nil
}
