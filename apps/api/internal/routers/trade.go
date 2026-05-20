package routers

import (
	"github.com/gin-gonic/gin"

	"github.com/fair-meme/fairmeme/apps/api/internal/handler"
)

func init() {
	apiV1RouterFns = append(apiV1RouterFns, func(group *gin.RouterGroup) {
		tradeRouter(group, handler.NewTradeHandler())
	})
}

func tradeRouter(group *gin.RouterGroup, h handler.TradeHandler) {
	//group.Use(middleware.Auth()) // all of the following routes use jwt authentication
	// or group.Use(middleware.Auth(middleware.WithVerify(verify))) // token authentication

	group.POST("/trade", h.Create)
	group.PUT("/trade/:id", h.UpdateByID)
	group.POST("/trade/list", h.List)
}
