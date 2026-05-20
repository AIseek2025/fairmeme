package service

import (
	"errors"
	"time"

	"github.com/go-resty/resty/v2"
)

const TweetScoutBaseURL = "https://api.tweetscout.io/api"

type TweetScoutOptions struct {
	ApiKey     string        `json:"api_key"`
	Timeout    time.Duration `json:"timeout"`
	RetryTimes int           `json:"retry_times"`
	RetryWait  time.Duration `json:"retry_wait"`
}

type TweetScoutService struct {
	HttpClient *resty.Client
}

type GetScoreResp struct {
	Score int `json:"score"`
}

func NewTweetScoutService(options TweetScoutOptions) *TweetScoutService {
	client := resty.New().
		SetBaseURL(TweetScoutBaseURL).
		SetHeader("Content-Type", "application/json").
		SetHeader("ApiKey", options.ApiKey).
		SetTimeout(options.Timeout).
		SetRetryCount(options.RetryTimes).
		SetRetryWaitTime(options.RetryWait)
	return &TweetScoutService{
		HttpClient: client,
	}
}

func (s *TweetScoutService) GetUserScore(username string) (int, error) {
	resp, err := s.HttpClient.R().SetResult(&GetScoreResp{}).Get("/score/" + username)
	if err != nil {
		return 0, err
	}

	data, ok := resp.Result().(*GetScoreResp)
	if !ok {
		return 0, errors.New("failed to convert response to score struct")
	}

	return data.Score, nil
}
