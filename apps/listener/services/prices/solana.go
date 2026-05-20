package prices

import (
	"context"
	"github.com/fair-meme/fairmeme/apps/listener/models"
	"github.com/fair-meme/fairmeme/apps/listener/utils"
	"errors"
	"fmt"
	"github.com/gagliardetto/solana-go/rpc"
	"log/slog"
	"math/big"
	"sync"
	"time"
)

type SolPriceService struct {
	logger *slog.Logger

	RpcClient       *rpc.Client
	mu              sync.RWMutex
	latestSlot      uint64
	latestBlockTime uint64
}

func NewSolPriceService(logger *slog.Logger, rpcClient *rpc.Client) (*SolPriceService, error) {
	s := &SolPriceService{
		logger:    logger,
		RpcClient: rpcClient,
	}
	return s, nil
}

func (s *SolPriceService) GetSolTokenInfoList(limit, offset int, keyword string, chainId string) (map[string]interface{}, error) {
	tokenBasicList, total, err := models.GetSolTokenBasicListByOffsetAndLimit(limit, offset, keyword, chainId)
	if err != nil {
		return nil, err
	}
	tokenArr := []interface{}{}
	nowSlot, err := s.RpcClient.GetSlot(context.Background(), "")
	if err != nil {
		return nil, err
	}
	//nowsolpriice
	solPrice, err := utils.FormatSolPrice()
	if err != nil {
		return nil, err
	}
	for _, token := range tokenBasicList {
		onchainToken, _ := models.GetTokenByTokenAddress(token.TokenAddress)
		info := make(map[string]interface{})
		if onchainToken != nil {
			info["tokenLogo"] = onchainToken.TokenLogo
			info["tokenName"] = onchainToken.TokenName
			info["chain"] = onchainToken.ChainId
			info["tokenTicker"] = onchainToken.TokenTicker
			createdTime := int64(float64(int64(nowSlot)-onchainToken.Slot) * 0.4)
			if createdTime > 0 {
				info["createdTime"] = utils.FormatDuration(createdTime)
			} else {
				info["createdTime"] = "-"
			}
			price, err := s.GetNowPriceBySlotAndSolPrice(onchainToken.TokenAddress, solPrice, nowSlot)
			if err != nil {
				return nil, err
			}
			info["price"] = fmt.Sprintf("%.9f", price)
			marketCap := new(big.Float)
			if int64(nowSlot)-onchainToken.Slot >= onchainToken.AuctionTime {
				marketCap = new(big.Float).Mul(price, new(big.Float).SetFloat64(1000000000))
				info["marketCap"] = utils.FormatUnit(marketCap)
				liquidity := new(big.Float).Mul(marketCap, new(big.Float).SetFloat64(2))
				info["liquidity"] = utils.FormatUnit(liquidity)
				info["aucP"] = "100%"
			} else {
				initTokenAmount := new(big.Float).SetFloat64(100000000000)
				count := int64(nowSlot) - onchainToken.Slot
				addTokenAmount := new(big.Float).Mul(new(big.Float).SetFloat64(float64(count)), new(big.Float).SetFloat64(float64(onchainToken.TokenReleasePerSlot)))
				tokenAmount := new(big.Float).Add(initTokenAmount, addTokenAmount)
				tokenAmount = tokenAmount.Quo(tokenAmount, new(big.Float).SetFloat64(1000000))
				marketCap = new(big.Float).Mul(price, tokenAmount)
				info["marketCap"] = utils.FormatUnit(marketCap)
				liquidity := new(big.Float).Mul(marketCap, new(big.Float).SetFloat64(2))
				info["liquidity"] = utils.FormatUnit(liquidity)
				aucP := float64(count) / float64(onchainToken.AuctionTime) * 100
				info["aucP"] = fmt.Sprintf("%.2f%", aucP)
			}
			fdmc := new(big.Float).Mul(new(big.Float).SetFloat64(1000000000), price)
			info["fdmc"] = utils.FormatUnit(fdmc)
			before24HourSlot := nowSlot - 24*60*60/0.4
			before12HourSlot := nowSlot - 12*60*60/0.4
			before6HourSlot := nowSlot - 6*60*60/0.4
			before1HourSlot := nowSlot - 1*60*60/0.4
			volSolAmount, err := models.GetTradeSolAmountBySlot(before24HourSlot, onchainToken.TokenAddress)
			volAmount := new(big.Float).Mul(volSolAmount, solPrice)
			if err != nil {
				fmt.Println(err)
				info["vol24"] = "-"
			} else {
				info["vol24"] = utils.FormatUnit(volAmount)
			}
			turnover := new(big.Float).Quo(volAmount, marketCap)
			turnoverF, _ := turnover.Float64()
			info["turnover24"] = utils.FormatFloatUnit(turnoverF)

			volSolAmount, err = models.GetTradeSolAmountBySlot(before12HourSlot, onchainToken.TokenAddress)
			volAmount = new(big.Float).Mul(volSolAmount, solPrice)
			if err != nil {
				fmt.Println(err)
				info["vol12"] = "-"
			} else {
				info["vol12"] = utils.FormatUnit(volAmount)
			}
			turnover = new(big.Float).Quo(volAmount, marketCap)
			turnoverF, _ = turnover.Float64()
			info["turnover12"] = utils.FormatFloatUnit(turnoverF)

			volSolAmount, err = models.GetTradeSolAmountBySlot(before6HourSlot, onchainToken.TokenAddress)
			volAmount = new(big.Float).Mul(volSolAmount, solPrice)
			if err != nil {
				fmt.Println(err)
				info["vol6"] = "-"
			} else {
				info["vol6"] = utils.FormatUnit(volAmount)
			}
			turnover = new(big.Float).Quo(volAmount, marketCap)
			turnoverF, _ = turnover.Float64()
			info["turnover6"] = utils.FormatFloatUnit(turnoverF)

			volSolAmount, err = models.GetTradeSolAmountBySlot(before1HourSlot, onchainToken.TokenAddress)
			volAmount = new(big.Float).Mul(volSolAmount, solPrice)
			if err != nil {
				fmt.Println(err)
				info["vol1"] = "-"
			} else {
				info["vol1"] = utils.FormatUnit(volAmount)
			}
			turnover = new(big.Float).Quo(volAmount, marketCap)
			turnoverF, _ = turnover.Float64()
			info["turnover1"] = utils.FormatFloatUnit(turnoverF)

			txs, err := models.GetTradeCountBySlot(before24HourSlot, onchainToken.TokenAddress)
			if err != nil {
				fmt.Println(err)
				info["txs24"] = "-"
			} else {
				info["txs24"] = utils.FormatFloatUnit(float64(txs))
			}
			txs, err = models.GetTradeCountBySlot(before12HourSlot, onchainToken.TokenAddress)
			if err != nil {
				fmt.Println(err)
				info["txs12"] = "-"
			} else {
				info["txs12"] = utils.FormatFloatUnit(float64(txs))
			}
			txs, err = models.GetTradeCountBySlot(before6HourSlot, onchainToken.TokenAddress)
			if err != nil {
				fmt.Println(err)
				info["txs6"] = "-"
			} else {
				info["txs6"] = utils.FormatFloatUnit(float64(txs))
			}
			txs, err = models.GetTradeCountBySlot(before1HourSlot, onchainToken.TokenAddress)
			if err != nil {
				fmt.Println(err)
				info["txs1"] = "-"
			} else {
				info["txs1"] = utils.FormatFloatUnit(float64(txs))
			}
			holders, err := models.GetTokenHolders(onchainToken.TokenAddress, onchainToken.CreatorAddress)
			if err != nil {
				fmt.Println(err)
				info["hoders"] = "-"
			}
			info["hoders"] = utils.FormatFloatUnit(float64(holders))
			watchers, err := models.GetFollowCountByTokenAddress(onchainToken.TokenAddress)
			if err != nil {
				fmt.Println(err)
				info["watchers"] = "-"
			}
			info["watchers"] = utils.FormatFloatUnit(float64(watchers))
			before24HourTimestimp := time.Now().Add(-24 * time.Hour).Unix()
			views, err := models.GetViewCountByTokenAddress(onchainToken.TokenAddress, before24HourTimestimp)
			if err != nil {
				fmt.Println(err)
				info["views"] = "-"
			}
			info["views"] = utils.FormatFloatUnit(float64(views))
			info["aucT"] = utils.FormatDuration(int64(float64(onchainToken.AuctionTime) * 0.4))
			//24小时前价格
			from := utils.CalculateTimestampForHoursAgo(int64(nowSlot), 4, 24)
			resp, err := models.QueryPriceByHour(onchainToken.TokenName, onchainToken.TokenAddress, from, 24)
			if err != nil {
				return nil, errors.New("Get QueryPriceByHour error:" + err.Error())
			}
			//fmt.Println("beforPrice:", resp.Price)
			beforPrice := new(big.Float).SetFloat64(resp.Price)
			//fmt.Println("beforPrice:", beforPrice)
			subPrice := new(big.Float).Sub(price, beforPrice)
			//fmt.Println("subPrice:", subPrice)
			volPrice := new(big.Float).Quo(subPrice, price)
			//fmt.Println("volPrice:", volPrice)
			volPrice = new(big.Float).Mul(volPrice, new(big.Float).SetFloat64(100))
			//fmt.Println("volPrice:", volPrice)
			info["24h"] = utils.FormatScale(volPrice)
			//12小时前价格
			from = utils.CalculateTimestampForHoursAgo(int64(nowSlot), 4, 12)
			resp, err = models.QueryPriceByHour(onchainToken.TokenName, onchainToken.TokenAddress, from, 12)
			if err != nil {
				return nil, errors.New("Get QueryPriceByHour error:" + err.Error())
			}
			beforPrice = new(big.Float).SetFloat64(resp.Price)
			subPrice = new(big.Float).Sub(price, beforPrice)
			volPrice = new(big.Float).Quo(subPrice, price)
			volPrice = new(big.Float).Mul(volPrice, new(big.Float).SetFloat64(100))
			info["12h"] = utils.FormatScale(volPrice)
			//6小时前价格
			from = utils.CalculateTimestampForHoursAgo(int64(nowSlot), 4, 6)
			resp, err = models.QueryPriceByHour(onchainToken.TokenName, onchainToken.TokenAddress, from, 6)
			if err != nil {
				return nil, errors.New("Get QueryPriceByHour error:" + err.Error())
			}
			beforPrice = new(big.Float).SetFloat64(resp.Price)
			subPrice = new(big.Float).Sub(price, beforPrice)
			volPrice = new(big.Float).Quo(subPrice, price)
			volPrice = new(big.Float).Mul(volPrice, new(big.Float).SetFloat64(100))
			info["5h"] = utils.FormatScale(volPrice)
			//1小时前价格
			from = utils.CalculateTimestampForHoursAgo(int64(nowSlot), 4, 1)
			resp, err = models.QueryPriceByHour(onchainToken.TokenName, onchainToken.TokenAddress, from, 1)
			if err != nil {
				return nil, errors.New("Get QueryPriceByHour error:" + err.Error())
			}
			beforPrice = new(big.Float).SetFloat64(resp.Price)
			subPrice = new(big.Float).Sub(price, beforPrice)
			volPrice = new(big.Float).Quo(subPrice, price)
			volPrice = new(big.Float).Mul(volPrice, new(big.Float).SetFloat64(100))
			info["1h"] = utils.FormatScale(volPrice)
		} else {
			info["tokenLogo"] = token.TokenLogo
			info["tokenName"] = token.TokenName
			info["chain"] = token.ChainId
			info["tokenTicker"] = token.TokenTicker
			info["createdTime"] = "-"
			info["price"] = "-"
			info["marketCap"] = "-"
			info["liquidity"] = "-"
			info["fdmc"] = "-"
			info["vol24"] = "-"
			info["hoders"] = "-"
			info["watchers"] = "-"
			info["views"] = "-"
			info["aucT"] = "-"
			info["aucP"] = "-"
			info["turnover"] = "-"
		}

		info["tokenDesc"] = token.TokenDesc
		info["tokenAddress"] = token.TokenAddress

		tokenArr = append(tokenArr, info)
	}
	res := map[string]interface{}{}
	res["tokenList"] = tokenArr
	res["total"] = total
	return res, err
}
func (s *SolPriceService) GetSolTokenList(limit, offset int, keyword string, chainId string, address string) (map[string]interface{}, error) {
	tokenList, total, err := models.GetSolTokenListByOffsetAndLimit(limit, offset, keyword, chainId)
	if err != nil {
		return nil, err
	}
	for i := 0; i < len(tokenList); i++ {
		price, err := s.GetNowPrice(tokenList[i].TokenAddress)
		if err != nil {
			fmt.Println("GetNowPrice err", err)
		}
		tokenList[i].Price = fmt.Sprintf("%.16f", price)
		amount, err := models.GetAmountByChainAndTokenAddress("sol", tokenList[i].TokenAddress, address)
		if err != nil {
			return nil, err
		}
		if amount.Count == 0 || len(address) < 1 {
			tokenList[i].TokenBalance = "0"
			tokenList[i].UstdBalance = "0"
		} else {

			amountFloat := new(big.Float).SetFloat64(amount.Count)
			amountFloat = new(big.Float).Quo(amountFloat, new(big.Float).SetInt64(1000000))
			tokenBalance := amountFloat.String()
			tokenList[i].TokenBalance = tokenBalance
			amountFloat = amountFloat.Mul(amountFloat, price)
			tokenList[i].UstdBalance = fmt.Sprintf("%.16f", amountFloat)
		}
	}
	res := map[string]interface{}{}
	res["tokenList"] = tokenList
	res["total"] = total
	return res, err
}
func (s *SolPriceService) GetAmountByChainAndTokenAddress(chain string, tokenAddress string, address string) (map[string]interface{}, error) {
	amount, err := models.GetAmountByChainAndTokenAddress(chain, tokenAddress, address)
	if err != nil {
		return nil, err
	}
	var res = make(map[string]interface{})
	res["chain"] = amount.Chain
	res["address"] = amount.Address
	res["tokenAddress"] = amount.TokenAddress
	if amount.Count == 0 {

		res["count"] = amount.Count
		return res, nil
	}

	tokenPrice, err := s.GetNowPrice(amount.TokenAddress)
	if err != nil {
		return nil, errors.New("GetNowPrice err:" + err.Error())
	}
	amountFloat := new(big.Float).SetFloat64(amount.Count)
	amountFloat = new(big.Float).Quo(amountFloat, new(big.Float).SetInt64(1000000))
	amountFloat = amountFloat.Mul(amountFloat, tokenPrice)

	res["amount"] = fmt.Sprintf("%.16f", amountFloat)
	return res, nil
}

func (s *SolPriceService) GetNowPrice(tokenAddress string) (*big.Float, error) {
	price, _, err := s.GetPrice(tokenAddress, 0, 0)
	return price, err
}
func (s *SolPriceService) GetBuyPrice(tokenAddress string, solAmount float64) (*big.Float, *big.Float, error) {
	return s.GetPrice(tokenAddress, 0, solAmount)
}
func (s *SolPriceService) GetSellPrice(tokenAddress string, tokenAmount float64) (*big.Float, *big.Float, error) {
	return s.GetPrice(tokenAddress, tokenAmount, 0)
}
func (s *SolPriceService) GetTokenSolPrice(tokenAddress string) (*big.Float, *big.Float, error) {
	//nowslot
	nowSlot, err := s.RpcClient.GetSlot(context.Background(), "")
	if err != nil {
		return nil, nil, err
	}
	baseSol, baseToken, err := GetBaseTokenAndSolAmount(tokenAddress, int64(nowSlot))
	if err != nil {
		return nil, nil, err
	}
	priceSol := new(big.Float).Quo(baseSol, baseToken)
	priceSol = priceSol.Quo(priceSol, new(big.Float).SetFloat64(1000))
	return priceSol, baseToken, nil
}
func (s *SolPriceService) GetPrice(tokenAddress string, tokenAmount, solAmount float64) (*big.Float, *big.Float, error) {
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
	baseSol, baseToken, err := GetBaseTokenAndSolAmount(tokenAddress, int64(nowSlot))
	if err != nil {
		return nil, nil, err
	}
	baseToken = baseToken.Quo(baseToken, tokenDecimal)
	baseSol = baseSol.Quo(baseSol, solDecimal)
	totalTokenAmount := new(big.Float).Add(addTokenAmount, baseToken)
	totalSolAmount := new(big.Float).Add(addSolAmount, baseSol)
	priceSol := new(big.Float).Quo(totalSolAmount, totalTokenAmount)
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
func (s *SolPriceService) GetNowPriceBySlotAndSolPrice(tokenAddress string, solPrice *big.Float, nowSlot uint64) (*big.Float, error) {
	baseSol, baseToken, err := GetBaseTokenAndSolAmount(tokenAddress, int64(nowSlot))
	if err != nil {
		return nil, err
	}
	priceSol := new(big.Float).Quo(baseSol, baseToken)
	priceSol = priceSol.Quo(priceSol, new(big.Float).SetFloat64(1000))
	priceUstd := priceSol.Mul(priceSol, solPrice)
	return priceUstd, nil
}

func (s *SolPriceService) SolTokenDetail(tokenAddress string) (map[string]interface{}, error) {
	token, err := models.SolTokenDetail(tokenAddress)
	if err != nil {
		return nil, err
	}
	res := make(map[string]interface{})
	res["tokenAddress"] = token.TokenAddress
	res["circulatingSupply"] = "1B"
	res["creatorAddress"] = token.CreatorAddress
	res["pairAddress"] = token.PairAddress
	nowSlot, err := s.RpcClient.GetSlot(context.Background(), "")
	if err != nil {
		return nil, err
	}
	//nowsolpriice
	solPrice, err := utils.FormatSolPrice()
	if err != nil {
		return nil, err
	}
	price, err := s.GetNowPriceBySlotAndSolPrice(token.TokenAddress, solPrice, nowSlot)
	if err != nil {
		return nil, err
	}
	marketCap := new(big.Float)
	if int64(nowSlot)-token.Slot >= token.AuctionTime {
		marketCap = new(big.Float).Mul(price, new(big.Float).SetFloat64(1000000000))
		//res["liquidity"] = "1000000000" + token.TokenTicker + "/" + utils.FormatUnit(marketCap) + token.ChainId
		res["unlocked"] = "0%"
		res["unlocked"] = "100%"
		res["tokenAmount"] = "1000000000"
		res["marketCap"] = utils.FormatUnit(marketCap)
		res["chainId"] = token.ChainId
		res["tokenTicker"] = token.TokenTicker
	} else {
		initTokenAmount := new(big.Float).SetFloat64(100000000000)
		count := int64(nowSlot) - token.Slot
		addTokenAmount := new(big.Float).Mul(new(big.Float).SetFloat64(float64(count)), new(big.Float).SetFloat64(float64(token.TokenReleasePerSlot)))
		tokenAmount := new(big.Float).Add(initTokenAmount, addTokenAmount)
		tokenAmount = tokenAmount.Quo(tokenAmount, new(big.Float).SetFloat64(1000000))
		marketCap = new(big.Float).Mul(price, tokenAmount)
		res["tokenAmount"] = utils.FormatUnit(tokenAmount)
		res["marketCap"] = utils.FormatUnit(marketCap)
		res["chainId"] = token.ChainId
		res["tokenTicker"] = token.TokenTicker
		//
		scale := float64(count) / float64(token.AuctionTime) * 100
		unlocked := utils.FormatUnit(tokenAmount)
		res["unlocked"] = unlocked
		res["unlockedScale"] = fmt.Sprintf("%.2f", scale)
		unlockedAmount := new(big.Float).Sub(new(big.Float).SetFloat64(float64(998000000)), tokenAmount)
		res["locked"] = utils.FormatUnit(unlockedAmount)
		res["lockedScale"] = fmt.Sprintf("%.2f", 100-scale)
	}
	res["auctionTime"] = utils.FormatDuration(int64(float64(token.AuctionTime) * 0.4))
	res["poolCreated"] = time.Unix(token.CreationTime, 0).Format("2006-01-02 15:04")
	res["startBlock"] = token.Slot
	res["endBlock"] = token.Slot + token.AuctionTime
	res["tokenSupply"] = "1,000,000,000(1B)"
	res["devPurchase"] = "0.1% (1M)"
	res["initialLiquidity"] = "0.1% (1M)"
	res["auctionSupply"] = "99.8% (998M)"

	return res, nil
}
func (s *SolPriceService) MemeCoinInfoHolders(limit, offset int, tokenAddress string) (map[string]interface{}, error) {
	accounts, err := models.GetAmountList(limit, offset, tokenAddress)
	if err != nil {
		return nil, err
	}
	var res = make(map[string]interface{})
	var addressInfoList []interface{}
	tokenSolPrice, baseToken, err := s.GetTokenSolPrice(tokenAddress)
	if err != nil {
		return nil, err
	}
	for _, account := range accounts {
		count := new(big.Float).SetFloat64(account.Count)
		tokenSolBalance := new(big.Float).Mul(count, tokenSolPrice)
		scale := new(big.Float).Quo(count, baseToken)
		scale = new(big.Float).Mul(scale, new(big.Float).SetFloat64(100))
		cost := new(big.Float).Quo(new(big.Float).SetFloat64(account.Cost), new(big.Float).SetFloat64(1000000000))
		sold := new(big.Float).Quo(new(big.Float).SetFloat64(account.Sold), new(big.Float).SetFloat64(1000000000))
		profit := new(big.Float).Add(sold, tokenSolBalance)
		profit = new(big.Float).Sub(profit, cost)
		rate := new(big.Float).Quo(profit, cost)
		rate = new(big.Float).Mul(rate, new(big.Float).SetFloat64(100))
		addressInfoList = append(addressInfoList, struct {
			TokenAddress string `json:"tokenAddress"`
			Balance      string `json:"balance"`
			BalanceScale string `json:"balanceScale"`
			Cost         string `json:"cost"`
			Sold         string `json:"sold"`
			Profit       string `json:"profit"`
			Rate         string `json:"rate"`
		}{
			TokenAddress: tokenAddress,
			Balance:      fmt.Sprintf("%.2f", tokenSolBalance),
			BalanceScale: fmt.Sprintf("%.2f", scale) + "%",
			Cost:         fmt.Sprintf("%.2f", cost),
			Sold:         fmt.Sprintf("%.2f", sold),
			Profit:       fmt.Sprintf("%.2f", profit),
			Rate:         fmt.Sprintf("%.2f", rate) + "%",
		})
	}
	res["addressInfoList"] = addressInfoList
	return res, nil
}
func GetBaseTokenAndSolAmount(tokenAddress string, nowSlot int64) (*big.Float, *big.Float, error) {
	token, err := models.GetTokenByTokenAddress(tokenAddress)
	if err != nil {
		return nil, nil, err
	}
	createSlot := token.Slot
	trade, err := models.GetLastSolTrade(tokenAddress)
	if err != nil {
		return nil, nil, err
	}
	//no have trade
	if trade == nil {
		solAmount, _ := new(big.Float).SetString("3000000000")
		if nowSlot-createSlot >= token.AuctionTime {
			//auction over
			tokenAmount, _ := new(big.Float).SetString("999000000000000")
			fmt.Println(fmt.Sprintf("solAmount:%.1f", solAmount))
			fmt.Println(fmt.Sprintf("tokenAmount:%.1f", tokenAmount))
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
	if int64(trade.Slot) < createSlot+token.AuctionTime {
		count := int64(0)
		if nowSlot < createSlot+token.AuctionTime {
			count = nowSlot - int64(trade.Slot)
		} else {
			count = createSlot + token.AuctionTime - int64(trade.Slot)
		}
		addTokenAmount := new(big.Float).Mul(new(big.Float).SetFloat64(float64(count)), new(big.Float).SetFloat64(float64(token.TokenReleasePerSlot)))
		tokenAmount = new(big.Float).Add(tokenAmount, addTokenAmount)
	}
	return solAmount, tokenAmount, nil
}
