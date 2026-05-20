package controllers

import (
	"github.com/fair-meme/fairmeme/apps/listener/contract"
	"github.com/fair-meme/fairmeme/apps/listener/global"
	"github.com/fair-meme/fairmeme/apps/listener/models"
	"github.com/fair-meme/fairmeme/apps/listener/utils"
	"errors"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"strconv"
	"time"
)

func FuncTest() {
	////创建
	//models.CreateTable()
	//err := models.CreateUser("li", 22)
	//fmt.Println(err)
	//user, err := models.GetUserByID(2)
	//if err != nil {
	//	fmt.Println(err)
	//	return
	//}
	//fmt.Println(*user)
	//contract.GetPreviewETHOut(common.HexToAddress("0x6103d43a1AAAC71B8715C3Db345A47ebA0BfcCEe"))
	//contract.ReadAllMemeCoinPrice()

	addressList := []common.Address{}
	addressList = append(addressList, common.HexToAddress("0x6103d43a1AAAC71B8715C3Db345A47ebA0BfcCEe"))
	//contract.GetPreviewETHOutListByMultiCall(addressList)
	contract.ReadAllMemeCoinPrice()
	// contract.GetMemePrice()
}
func GetTokenInfoList(limit, offset int, keyword string, chanId string) (map[string]interface{}, error) {
	var tokenArr []interface{}
	tokenList, total, err := models.GetTokenListByOffsetAndLimit(limit, offset, keyword, chanId)
	if err != nil {
		return nil, err
	}
	for _, token := range tokenList {
		info := make(map[string]interface{})
		tokenLogo := token.TokenLogo
		info["tokenLogo"] = tokenLogo
		tokenName := token.TokenName
		info["tokenName"] = tokenName
		tokenTicker := token.TokenTicker
		info["tokenDesc"] = token.TokenDesc
		info["tokenTicker"] = tokenTicker
		tokenAddress := token.TokenAddress
		info["tokenAddress"] = tokenAddress

		createdTime := time.Now().Unix() - token.CreatedTime.Unix()
		info["createdTime"] = createdTime

		priceObj, err := models.GetLatestPrice(token.TokenName, token.MarketAddress)
		if err != nil {
			fmt.Println("GetLatestPrice err:", err)
			continue
		}
		price := priceObj.Price
		info["price"] = price
		//MarketCap TODO
		info["marketCap"] = "-"
		//Liquidity TODO
		info["liquidity"] = "-"
		//FDV 10亿*当前价格 已经有价格了就不返回这个了
		//info["fdv"] = "-"
		//Vol
		txs24, err := models.GetTransactionByDuration(token.MarketAddress, 24)
		if err != nil {
			fmt.Println("GetTransactionByDuration 24 hour err:", err)
		}
		vol24 := float64(0)
		for _, tx := range *txs24 {
			vol24 = utils.Float64Add(vol24, tx.Count)
		}
		info["vol24"] = strconv.FormatFloat(vol24, 'f', 2, 64)
		txs12, err := models.GetTransactionByDuration(token.MarketAddress, 12)
		if err != nil {
			fmt.Println("GetTransactionByDuration  12 hour err:", err)
		}
		vol12 := float64(0)
		for _, tx := range *txs12 {
			vol24 = utils.Float64Add(vol12, tx.Count)
		}
		info["vol12"] = strconv.FormatFloat(vol12, 'f', 2, 64)

		before24PriceObj, err := models.GetBeforePriceByHours(priceObj.Id, token.TokenName, token.MarketAddress, 24)
		if err != nil {
			fmt.Println("GetBeforePriceByHours 24 err:", err)
		}
		info["before24HourPrice"] = before24PriceObj.Price
		before12PriceObj, err := models.GetBeforePriceByHours(priceObj.Id, token.TokenName, token.MarketAddress, 12)
		if err != nil {
			fmt.Println("GetBeforePriceByHours 12 err:", err)
		}
		info["before12HourPrice"] = before12PriceObj.Price
		//Hoders TODO
		info["hoders"] = "-"
		watchers, err := models.GetFollowCountByTokenAddress(token.MarketAddress)
		if err != nil {
			fmt.Println("GetFollowByTokenAddress err:", err)
		}
		info["watchers"] = watchers

		//views, err := models.GetViewCountByTokenAddress(token.MarketAddress)
		//if err != nil {
		//	fmt.Println("GetFollowByTokenAddress err:", err)
		//}
		//info["views"] = views
		//AucValuation
		info["aucValuation"] = token.TokenInitPrice
		//AucDays
		info["aucDays"] = token.AuctionDays
		//AucProcess
		aucProcess := createdTime / int64(token.AuctionDays*86400)
		info["aucProcess"] = aucProcess
		tokenArr = append(tokenArr, info)
	}
	res := map[string]interface{}{}
	res["tokenList"] = tokenArr
	res["total"] = total
	return res, err
}
func GetTokenSymbols(keyword string) (interface{}, error) {
	tokenList, err := models.GetTokenSymbols(keyword)

	if err != nil {
		return nil, err
	}

	return tokenList, err
}
func GetTokenLisRaw(limit int, keyword string) (interface{}, error) {
	tokenList, total, err := models.GetTokenListByOffsetAndLimitRaw(limit, keyword)
	fmt.Println(total)
	if err != nil {
		return nil, err
	}

	return tokenList, err
}
func GetTokenList(limit, offset int, keyword string, chainId string) (map[string]interface{}, error) {
	tokenList, total, err := models.GetTokenListByOffsetAndLimit(limit, offset, keyword, chainId)
	if err != nil {
		return nil, err
	}
	res := map[string]interface{}{}
	res["tokenList"] = tokenList
	res["total"] = total
	return res, err
}

func GetTokenPriceListByMarketAddress(marketAddress string) (map[string]interface{}, error) {
	var res = make(map[string]interface{})
	priceList, err := models.GetTokenPriceListByMarketAddress(marketAddress)
	if err != nil {
		return nil, err
	}
	res["priceList"] = priceList
	return res, nil
}
func GetBefore24HoursPriceAndCurrentPrice(tokenName, marketAddress string) (map[string]interface{}, error) {
	var res = make(map[string]interface{})
	currentPrice, err := models.GetLatestPrice(tokenName, marketAddress)
	if err != nil {
		return nil, errors.New("Get latest price error:" + err.Error())
	}
	beforePrice, err := models.GetBeforePriceByHours(currentPrice.Id, tokenName, marketAddress, 24)
	if err != nil {
		return nil, errors.New("Get before price error:" + err.Error())
	}
	res["currentPrice"] = currentPrice
	res["beforePrice"] = beforePrice
	return res, nil
}
func GetCurrentPrice(tokenName, marketAddress string) (map[string]interface{}, error) {
	var res = make(map[string]interface{})
	currentPrice, err := models.GetLatestPrice(tokenName, marketAddress)
	if err != nil {
		return nil, errors.New("Get latest price error:" + err.Error())
	}
	res["currentPrice"] = currentPrice
	return res, nil
}
func GetPriceListByMarketAddress(tokenName, marketAddress string, kLineType int) (map[string]interface{}, error) {
	prices, err := models.GetPriceListByMarketAddress(tokenName, marketAddress, kLineType)
	if err != nil {
		return nil, err
	}
	fmt.Println(len(prices))
	return nil, nil
}

func AddFollow(address string, tokenAddress string) error {
	return models.AddFollow(address, tokenAddress)
}
func RemoveFollow(address string, tokenAddress string) error {
	return models.RemoveFollow(address, tokenAddress)
}
func GetFollow(address string) (map[string]interface{}, error) {
	follows, err := models.GetFollowByAddress(address)
	if err != nil {
		return nil, err
	}
	res := make(map[string]interface{})
	marketAddressList := []string{}
	for _, follow := range *follows {
		marketAddressList = append(marketAddressList, follow.Address)
	}
	res["marketAddressList"] = marketAddressList
	return res, nil
}
func AddView(address string, tokenAddress string) error {
	return models.AddView(address, tokenAddress)
}

func GetKlineByMinutes(tokenName, marketAddress string, startTime int64) (map[string]interface{}, error) {
	var res = make(map[string]interface{})
	resp, err := models.QueryWeb(tokenName, marketAddress, startTime)
	if err != nil {
		return nil, errors.New("Get KlineByMinutes error:" + err.Error())
	}

	res["kline"] = resp
	return res, nil
}

func CreateSolTokenBasic(solTokenBasic models.SolTokenBasic) error {
	return models.CreateSolTokenBasic(solTokenBasic)
}

func GetKlineByMinutesRaw(tokenName, marketAddress string, startTime, endTime, limit int64, resolution string) (*global.KLineResult, error) {
	var resp *global.KLineResult
	var err error

	switch resolution {
	case "1s":
		resp, err = models.QuerySeconds(tokenName, marketAddress, startTime, endTime, limit, 1)
	case "1d":
		resp, err = models.QuerySecondsMinutes(tokenName, marketAddress, startTime, endTime, limit, 100)
	default:
		// 假设 '1', '10', '30' 是分钟级别的K线，需要统一处理
		resolution, _ := strconv.ParseInt(resolution, 10, 64)
		resp, err = models.QuerySecondsMinutes(tokenName, marketAddress, startTime, endTime, limit, resolution)
	}

	if err != nil {
		return nil, errors.New("Get KlineByMinutes error: " + err.Error())
	}

	return resp, nil
}
func QueryPriceByHour(tokenName, marketAddress string, startTime int64, resolution int64) (*global.KPriceResult, error) {
	resp, err := models.QueryPriceByHour(tokenName, marketAddress, startTime, resolution)
	if err != nil {
		return nil, errors.New("Get QueryPriceByHour error:" + err.Error())
	}

	return resp, nil
}
