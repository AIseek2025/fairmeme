package routes

import (
	"github.com/fair-meme/fairmeme/apps/listener/global"
	"github.com/fair-meme/fairmeme/apps/listener/services"
	"github.com/fair-meme/fairmeme/apps/listener/services/prices"
	"fmt"
	"github.com/gin-gonic/gin"
	"log/slog"
)

// SetApiGroupRoutes 定义 api 分组路由
func SetApiGroupRoutes(router *gin.RouterGroup) {
	//UDF使用接口
	router.GET("history", services.GetKlineByMinutesRaw)
	router.GET("config", services.GetConfig)
	router.GET("symbols", services.Getsymbols)
	router.GET("search", services.Getsearch)
	router = router.Group("/api")
	{
		router.GET("/test", services.FuncTest)
		router.GET("getTokenPriceListByMarketAddress", services.GetTokenPriceListByMarketAddress)
		router.GET("getTokenInfoList", services.GetTokenInfoList)
		router.GET("getTokenList", services.GetTokenList)

		router.GET("getBefore24HoursPriceAndCurrentPrice", services.GetBefore24HoursPriceAndCurrentPrice)
		router.GET("getCurrentPrice", services.GetCurrentPrice)
		router.GET("addFollow", services.AddFollow)
		router.GET("removeFollow", services.RemoveFollow)
		router.GET("getFollow", services.GetFollow)
		router.GET("addView", services.AddView)
		// 处理文件上传的路由
		router.POST("/uploadFile/:fileType", services.UploadFile)
		router.POST("/createSolToken", services.CreateSolTokenBasics)

		router.GET("getKlineByMinutes", services.GetKlineByMinutes)
		router.GET("getKlinePrice", services.GetKlinePrice)
		//router.GET("getKlineByMinutes", services.GetKlineByMinutes)

		//router.GET("/kline/:name", services.SubscribeKline)
		solServers, err := prices.NewSolPriceService(slog.Default(), global.App.SolRPC)
		if err != nil {
			fmt.Println("NewSolPriceService error : ", err)
		}

		router.GET("getNowPrice", solServers.GetNowPriceHandler)
		router.GET("getReceivedTokenAmount", solServers.GetReceivedTokenAmountHandler)
		router.GET("getPaidSolAmount", solServers.GetPaidSolAmountHandle)
		router.GET("getSolTokenInfoList", solServers.GetSolTokenInfoListHandler)
		router.GET("getSolTokenList", solServers.GetSolTokenListHandler)
		router.GET("getAmountByChainAndTokenAddress", solServers.GetAmountByChainAndTokenAddressHandler)
		router.GET("solTokenDetail", solServers.SolTokenDetailHandler)
		router.GET("memeCoinInfoHolders", solServers.MemeCoinInfoHoldersHandler)

	}
	// 添加WebSocket路由
	wsRouter := router.Group("/ws")
	{
		wsRouter.GET("/kline", services.SubscribeKline)
	}
}
