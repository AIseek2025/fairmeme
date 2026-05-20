package prices

import (
	"github.com/fair-meme/fairmeme/apps/listener/common/response"
	"fmt"
	"strconv"

	"github.com/gagliardetto/solana-go"
	"github.com/gin-gonic/gin"
)

type GetPriceResponse struct {
	TokenAddress string `json:"tokenAddress"`
	SolAmount    string `json:"solAmount"`
	TokenAmount  string `json:"tokenAmount"`
	Price        string `json:"price"`
}

func (s *SolPriceService) GetNowPriceHandler(c *gin.Context) {
	tokenAddressQuery := c.Query("tokenAddress")
	if tokenAddressQuery == "" {
		response.Fail(c, 1, "param tokenAddress error")
		return
	}

	tokenAddress, err := solana.PublicKeyFromBase58(tokenAddressQuery)
	if err != nil {
		response.Fail(c, 1, "param tokenAddress error:"+err.Error())
		return
	}

	price, err := s.GetNowPrice(tokenAddressQuery)
	if err != nil {
		response.Fail(c, 1, "param tokenAddress error:"+err.Error())
		return
	}
	priceStr := fmt.Sprintf("%.16f", price)
	res := GetPriceResponse{
		TokenAddress: tokenAddress.String(),
		Price:        priceStr,
	}

	response.Success(c, res)
}

func (s *SolPriceService) GetReceivedTokenAmountHandler(c *gin.Context) {
	tokenAddressQuery := c.Query("tokenAddress")
	solAmountQuery := c.Query("solAmount")

	if tokenAddressQuery == "" {
		response.Fail(c, 1, "param tokenAddress error")
		return
	}

	if solAmountQuery == "" {
		response.Fail(c, 1, "param solAmount error")
		return
	}

	tokenAddress, err := solana.PublicKeyFromBase58(tokenAddressQuery)
	if err != nil {
		response.Fail(c, 1, "param tokenAddress error:"+err.Error())
		return
	}

	solAmount, err := strconv.ParseFloat(solAmountQuery, 64)
	if err != nil {
		response.Fail(c, 1, "param solAmount error:"+err.Error())
		return
	}
	if solAmount <= 0 {
		res := GetPriceResponse{
			TokenAddress: tokenAddress.String(),
			SolAmount:    solAmountQuery,
			TokenAmount:  "0",
			//Price:        priceStr,
		}
		response.Success(c, res)
		return
	}
	price, tokenAmount, err := s.GetBuyPrice(tokenAddress.String(), solAmount)
	if err != nil {
		response.Fail(c, 1, "get buy price error:"+err.Error())
		return
	}

	priceStr := fmt.Sprintf("%.16f", price)
	tokenAmountStr := fmt.Sprintf("%.16f", tokenAmount)
	res := GetPriceResponse{
		TokenAddress: tokenAddress.String(),
		SolAmount:    solAmountQuery,
		TokenAmount:  tokenAmountStr,
		Price:        priceStr,
	}
	response.Success(c, res)
}

func (s *SolPriceService) GetPaidSolAmountHandle(c *gin.Context) {
	tokenAddressQuery := c.Query("tokenAddress")
	tokenAmountQuery := c.Query("tokenAmount")

	if tokenAddressQuery == "" {
		response.Fail(c, 1, "param tokenAddress error")
		return
	}

	if tokenAmountQuery == "" {
		response.Fail(c, 1, "param tokenAmount error")
		return
	}

	tokenAddress, err := solana.PublicKeyFromBase58(tokenAddressQuery)
	if err != nil {
		response.Fail(c, 1, "param tokenAddress error:"+err.Error())
		return
	}

	tokenAmount, err := strconv.ParseFloat(tokenAmountQuery, 64)
	if err != nil {
		response.Fail(c, 1, "param tokenAmount error:"+err.Error())
		return
	}
	if tokenAmount <= 0 {
		res := GetPriceResponse{
			TokenAddress: tokenAddress.String(),
			SolAmount:    "0",
			TokenAmount:  tokenAmountQuery,
			//Price:        priceStr,
		}
		response.Success(c, res)
		return
	}
	price, solAmount, err := s.GetSellPrice(tokenAddress.String(), tokenAmount)
	if err != nil {
		response.Fail(c, 1, "get sell price error:"+err.Error())
		return
	}
	priceStr := fmt.Sprintf("%.16f", price)
	solAmountStr := fmt.Sprintf("%.16f", solAmount)
	res := GetPriceResponse{
		TokenAddress: tokenAddress.String(),
		SolAmount:    solAmountStr,
		TokenAmount:  tokenAmountQuery,
		Price:        priceStr,
	}
	response.Success(c, res)
}

func (s *SolPriceService) GetSolTokenInfoListHandler(c *gin.Context) {
	limit, err := strconv.Atoi(c.Query("limit"))
	if err != nil {
		response.Fail(c, 1, "param limit error")
		return
	}
	offset, err := strconv.Atoi(c.Query("offset"))
	if err != nil {
		response.Fail(c, 1, "param offset error")
		return
	}
	keyword := c.Query("keyword")
	chainId := c.Query("chainId")
	res, err := s.GetSolTokenInfoList(limit, offset, keyword, chainId)
	if err != nil {
		response.Fail(c, 1, err.Error())
		return
	}
	response.Success(c, res)
}
func (s *SolPriceService) SolTokenDetailHandler(c *gin.Context) {
	tokenAddressQuery := c.Query("tokenAddress")
	if tokenAddressQuery == "" {
		response.Fail(c, 1, "param tokenAddress error")
		return
	}

	tokenAddress, err := solana.PublicKeyFromBase58(tokenAddressQuery)
	if err != nil {
		response.Fail(c, 1, "param tokenAddress error:"+err.Error())
		return
	}
	res, err := s.SolTokenDetail(tokenAddress.String())
	if err != nil {
		response.Fail(c, 1, err.Error())
		return
	}
	response.Success(c, res)
}
func (s *SolPriceService) MemeCoinInfoHoldersHandler(c *gin.Context) {
	limit, err := strconv.Atoi(c.Query("limit"))
	if err != nil {
		response.Fail(c, 1, "param limit error")
		return
	}
	offset, err := strconv.Atoi(c.Query("offset"))
	if err != nil {
		response.Fail(c, 1, "param offset error")
		return
	}
	tokenAddressQuery := c.Query("tokenAddress")
	if tokenAddressQuery == "" {
		response.Fail(c, 1, "param tokenAddress error")
		return
	}

	tokenAddress, err := solana.PublicKeyFromBase58(tokenAddressQuery)
	if err != nil {
		response.Fail(c, 1, "param tokenAddress error:"+err.Error())
		return
	}
	res, err := s.MemeCoinInfoHolders(limit, offset, tokenAddress.String())
	if err != nil {
		response.Fail(c, 1, err.Error())
		return
	}
	response.Success(c, res)
}

func (s *SolPriceService) GetSolTokenListHandler(c *gin.Context) {

	limit, err := strconv.Atoi(c.Query("limit"))
	if err != nil {
		response.Fail(c, 1, "param limit error")
		return
	}
	offset, err := strconv.Atoi(c.Query("offset"))
	if err != nil {
		response.Fail(c, 1, "param offset error")
		return
	}
	keyword := c.Query("keyword")
	chainId := c.Query("chainId")
	address := c.Query("address")
	res, err := s.GetSolTokenList(limit, offset, keyword, chainId, address)
	if err != nil {
		response.Fail(c, 1, err.Error())
		return
	}
	response.Success(c, res)
}
func (s *SolPriceService) GetAmountByChainAndTokenAddressHandler(c *gin.Context) {
	address := c.Query("address")
	tokenAddress := c.Query("tokenAddress")
	chain := c.Query("chain")

	res, err := s.GetAmountByChainAndTokenAddress(chain, tokenAddress, address)
	if err != nil {
		response.Fail(c, 1, err.Error())
		return
	}
	response.Success(c, res)
}
