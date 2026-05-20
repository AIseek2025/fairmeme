package services

import (
	"github.com/fair-meme/fairmeme/apps/listener/controllers"
	"github.com/fair-meme/fairmeme/apps/listener/models"
	"github.com/fair-meme/fairmeme/apps/listener/services/prices"
	"github.com/fair-meme/fairmeme/apps/listener/utils"
	"fmt"
	"sync"
	"time"
)

func LoopReadAddSolToken() error {
	//先从数据库中查询到所有memeMarket
	solList, err := models.GetTokenListByChainAndStatus("sol", 1)
	if err != nil {
		fmt.Println(err)
		return err
	}
	timeStamp := time.Now().Unix() - 4 //- 1900 //2460 - 60
	for i, amount := range solList {

		err = models.AddCoinHistory(solList[i].TokenName, amount.TokenAddress, timeStamp, amount.Id)
		if err != nil {
			fmt.Println("AddCoinHistory", amount, "err:", err)
		}

	}
	return nil
}
func LoopCorrectSolToken() error {
	//先从数据库中查询到所有memeMarket
	solList, err := models.GetTokenListByChainAndStatus("sol", 1)
	if err != nil {
		fmt.Println(err)
		return err
	}
	timeStamp := time.Now().Unix()
	for i, amount := range solList {

		err = models.CorrectCoinHistory(solList[i].TokenName, amount.TokenAddress, timeStamp, amount.Id)
		if err != nil {
			fmt.Println("AddCoinHistory", amount, "err:", err)
		}

	}
	return nil
}

//获取所有币的列表
//维护一个价格的列表(初始价格可以从链上获取)
//如果有交易或者释放 就修改价格
//判断是否释放完 当前slot  释放数量(如果有交易+交易)  算出价格 价格
//

type SolTokenPrice struct {
	TokenAddress        string
	SolAmount           float64
	TokenAmount         float64
	Price               string
	StartSlot           int64
	AuctionTime         int64
	IsReleased          bool
	TokenReleasePerSlot int64
	CurrentSlot         int64
	CurrentTimestamp    int64
	CreateTime          int64
	Lock                sync.RWMutex
}

func (s *SolTokenPrice) GetPrice() string {
	s.Lock.RLock()
	defer s.Lock.RUnlock()
	return s.Price
}
func (s *SolTokenPrice) Trade(trade *models.SolTrade) {
	solPrice, err := controllers.GetSolPriceByRedis()
	if err != nil {
		fmt.Println("GetSolPriceByRedis err :", err)
		return
	}
	s.Lock.Lock()
	defer s.Lock.Unlock()
	if trade.IsBuy == 1 {
		s.SolAmount += trade.SolAmount
		s.TokenAmount -= trade.TokenAmount
	} else {
		s.SolAmount -= trade.SolAmount
		s.TokenAmount += trade.TokenAmount
	}
	//s.CurrentSlot = int64(trade.Slot)
	//s.CurrentTimestamp = int64(float64(s.CurrentSlot) * 0.4)
	s.CalculatePrice(solPrice, int64(float64(s.CurrentSlot)*0.4), true)
}

// SolanaGenesisUnixTime 是Solana区块链的创世时间戳
const SolanaGenesisUnixTime int64 = 1624721407

// SlotToTimestamp 将Solana的slot转换为Unix时间戳
func SlotToTimestamp(slot uint64) int64 {
	// 每个slot的持续时间，以秒为单位
	const slotDurationSeconds = 0.4
	// 计算slot的起始时间（纳秒）
	durationInNanoseconds := time.Duration(slot) * time.Duration(int64(slotDurationSeconds*1e9))
	// 计算从创世时间到slot开始的时间戳
	startTime := time.Unix(SolanaGenesisUnixTime, 0).Add(durationInNanoseconds)
	// 转换为Unix时间戳
	return startTime.Unix()
}
func (s *SolTokenPrice) ReleaseToken(solPrice float64) {
	if s.IsReleased {
		return
	}
	s.Lock.Lock()
	defer s.Lock.Unlock()
	s.TokenAmount += float64(s.TokenReleasePerSlot)

	s.CurrentSlot += 1
	s.CurrentTimestamp = int64(float64(s.CurrentSlot)*0.4) + int64(1596048300)
	//s.CurrentTimestamp = SlotToTimestamp(uint64(s.CurrentSlot))
	fmt.Println("时间戳 err :", s.CurrentTimestamp, "name", s.TokenAddress)
	s.CalculatePrice(solPrice, s.CurrentTimestamp, false)
	if s.CurrentSlot-s.StartSlot > s.AuctionTime {
		s.IsReleased = true
	}
}
func (s *SolTokenPrice) CalculatePrice(solPrice float64, timestamp int64, isTrade bool) {
	tokenSol := utils.Float64Div(s.SolAmount, s.TokenAmount)
	tokenSol = utils.Float64Div(tokenSol, 1000)
	price := utils.Float64Mul(tokenSol, solPrice)
	s.Price = fmt.Sprintf("%.16f", price)
	controllers.SetTokenPrice(s.TokenAddress, s.Price)
	//添加进入redis计算
	if isTrade == true {
		models.CreateRedisUpdatePrice(s.TokenAddress, s.TokenAddress, s.Price, timestamp)
	} else {
		models.CreateRedisPrice(s.TokenAddress, s.Price, timestamp)
	}

}

func NewSolTokenPrice(token *models.SolToken, lastSlot, timestamp int64) (*SolTokenPrice, error) {

	solTokenPrice := &SolTokenPrice{
		TokenAddress:        token.TokenAddress,
		StartSlot:           token.Slot,
		AuctionTime:         token.AuctionTime,
		TokenReleasePerSlot: token.TokenReleasePerSlot,
		CreateTime:          token.CreationTime,
		CurrentSlot:         lastSlot,
		CurrentTimestamp:    timestamp,
	}
	if solTokenPrice.StartSlot+solTokenPrice.AuctionTime < solTokenPrice.CurrentSlot {
		solTokenPrice.IsReleased = true
	}
	solAmount, tokenAmount, err := prices.GetBaseTokenAndSolAmount(token.TokenAddress, solTokenPrice.CurrentSlot)
	if err != nil {
		fmt.Println(err)
	}
	solTokenPrice.SolAmount, _ = solAmount.Float64()
	solTokenPrice.TokenAmount, _ = tokenAmount.Float64()
	solPrice, err := controllers.GetSolPriceByRedis()
	if err != nil {
		fmt.Println("GetSolPriceByRedis err :", err)
		return nil, err
	}
	solTokenPrice.CalculatePrice(solPrice, timestamp, false)
	if !solTokenPrice.IsReleased {
		go func() {
			for {

				if solTokenPrice.IsReleased {
					break
				}
				solPrice, err = controllers.GetSolPriceByRedis()
				if err != nil {
					fmt.Println("GetSolPriceByRedis err:", err)
					panic(err)
				}
				solTokenPrice.ReleaseToken(solPrice)
				//fmt.Printf("tokenAddress:%s price:%s \n", solTokenPrice.TokenAddress, solTokenPrice.Price)

				time.Sleep(400 * time.Millisecond)
			}
		}()
	}
	return solTokenPrice, nil
}
