package service

import (
	"context"
	"github.com/fair-meme/fairmeme/apps/api/internal/cache"
	"github.com/fair-meme/fairmeme/apps/api/internal/config"
	"github.com/fair-meme/fairmeme/apps/api/internal/dao"
	"github.com/fair-meme/fairmeme/apps/api/internal/model"
	"github.com/fair-meme/fairmeme/apps/api/internal/pkg/utils"
	"fmt"
	"math/big"
	"sync"

	"github.com/gagliardetto/solana-go/rpc"
	"github.com/gagliardetto/solana-go/rpc/ws"
)

type SolanaService struct {
	holdersDao dao.HoldersDao
	tradeDao   dao.TradeDao
	tokenDao   dao.TokenDao

	RpcClient *rpc.Client
	WsClient  *ws.Client

	mu              sync.RWMutex
	latestSlot      uint64
	latestBlockTime uint64
}

func NewSolanaService() *SolanaService {
	rpcClient := rpc.New(config.Get().Solana.Url)
	wsClient, _ := ws.Connect(context.Background(), config.Get().Solana.WssUrl)

	return &SolanaService{
		holdersDao: dao.NewHoldersDao(
			model.GetDB(),
			cache.NewHoldersCache(model.GetCacheType()),
		),
		tokenDao: dao.NewTokenDao(
			model.GetDB(),
			cache.NewTokenCache(model.GetCacheType()),
		),
		tradeDao: dao.NewTradeDao(
			model.GetDB(),
			cache.NewTradeCache(model.GetCacheType()),
		),
		RpcClient: rpcClient,
		WsClient:  wsClient,
	}
}

//func (s *SolPriceService) GetAmountByChainAndTokenAddress(chain string, tokenAddress string, address string) (map[string]interface{}, error) {
//	amount, err := models.GetAmountByChainAndTokenAddress(chain, tokenAddress, address)
//	if err != nil {
//		return nil, err
//	}
//	var res = make(map[string]interface{})
//	res["chain"] = amount.Chain
//	res["address"] = amount.Address
//	res["tokenAddress"] = amount.TokenAddress
//	if amount.Count == 0 {
//
//		res["count"] = amount.Count
//		return res, nil
//	}
//
//	tokenPrice, err := s.GetNowPrice(amount.TokenAddress)
//	if err != nil {
//		return nil, errors.New("GetNowPrice err:" + err.Error())
//	}
//	amountFloat := new(big.Float).SetFloat64(amount.Count)
//	amountFloat = new(big.Float).Quo(amountFloat, new(big.Float).SetInt64(1000000))
//	amountFloat = amountFloat.Mul(amountFloat, tokenPrice)
//
//	res["amount"] = fmt.Sprintf("%.16f", amountFloat)
//	return res, nil
//}

func (s *SolanaService) GetBuyPrice(tokenAddress string, solAmount float64) (*big.Float, *big.Float, error) {
	return s.GetPrice(tokenAddress, 0, solAmount)
}

func (s *SolanaService) GetPrice(tokenAddress string, tokenAmount, solAmount float64) (*big.Float, *big.Float, error) {
	tokenDecimal := new(big.Float).SetFloat64(1000000)
	solDecimal := new(big.Float).SetFloat64(1000000000)

	addTokenAmount := new(big.Float).SetFloat64(tokenAmount) //Mul(new(big.Float).SetFloat64(float64(tokenAmount)), tokenDecimal)
	addSolAmount := new(big.Float).SetFloat64(solAmount)     //Mul(new(big.Float).SetFloat64(float64(solAmount)), solDecimal)
	//nowslot
	nowSlot, err := s.RpcClient.GetSlot(context.Background(), "")
	if err != nil {
		return nil, nil, err
	}
	//nowsolpriice
	solPrice, err := utils.FormatSolPrice()
	if err != nil {
		return nil, nil, err
	}
	baseSol, baseToken, err := s.GetBaseTokenAndSolAmount(tokenAddress, int64(nowSlot))
	if err != nil {
		return nil, nil, err
	}
	baseToken = baseToken.Quo(baseToken, tokenDecimal)
	baseSol = baseSol.Quo(baseSol, solDecimal)
	totalTokenAmount := new(big.Float).Add(addTokenAmount, baseToken)
	totalSolAmount := new(big.Float).Add(addSolAmount, baseSol)
	priceSol := new(big.Float).Quo(totalSolAmount, totalTokenAmount)
	fmt.Println("22222", priceSol, solPrice)
	priceUstd := priceSol.Mul(priceSol, solPrice)
	resAmount := new(big.Float)
	if tokenAmount > 0 {
		resAmount = new(big.Float).Quo(totalSolAmount, totalTokenAmount)
		resAmount = new(big.Float).Mul(resAmount, new(big.Float).SetFloat64(tokenAmount))
	}
	if solAmount > 0 {
		resAmount = new(big.Float).Quo(totalTokenAmount, totalSolAmount)
		resAmount = new(big.Float).Mul(resAmount, new(big.Float).SetFloat64(solAmount))
	}
	return priceUstd, resAmount, nil
}

func (s *SolanaService) GetBaseTokenAndSolAmount(tokenAddress string, nowSlot int64) (*big.Float, *big.Float, error) {
	token, err := s.tokenDao.GetTokenByTokenAddress(tokenAddress)
	if err != nil {
		return nil, nil, err
	}
	createSlot := token.StartBlock
	trade, err := s.tradeDao.GetLastSolTrade(tokenAddress)
	if err != nil {
		return nil, nil, err
	}
	//no have trade
	if trade == nil {
		solAmount, _ := new(big.Float).SetString("3000000000")
		if nowSlot >= token.EndBlock {
			//auction over
			tokenAmount, _ := new(big.Float).SetString("999000000000000")
			return solAmount, tokenAmount, nil
		} else {
			initTokenAmount, _ := new(big.Float).SetString("1000000000000")
			count := nowSlot - createSlot
			addTokenAmount := new(big.Float).Mul(new(big.Float).SetFloat64(float64(count)), new(big.Float).SetFloat64(float64(token.TokenReleasePerSlot)))
			tokenAmount := new(big.Float).Add(initTokenAmount, addTokenAmount)
			return solAmount, tokenAmount, nil
		}
	}

	//have trade
	solAmount := new(big.Float).SetFloat64(float64(trade.SolReserves))
	tokenAmount := new(big.Float).SetFloat64(float64(trade.TokenReserves))
	if int64(trade.Slot) < token.EndBlock {
		count := int64(0)
		if nowSlot < token.EndBlock {
			count = nowSlot - int64(trade.Slot)
		} else {
			count = token.EndBlock - int64(trade.Slot)
		}
		addTokenAmount := new(big.Float).Mul(new(big.Float).SetFloat64(float64(count)), new(big.Float).SetFloat64(float64(token.TokenReleasePerSlot)))
		tokenAmount = new(big.Float).Add(tokenAmount, addTokenAmount)
	}
	return solAmount, tokenAmount, nil
}
