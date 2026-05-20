package routers

import (
	"github.com/gin-gonic/gin"

	"github.com/fair-meme/fairmeme/apps/api/internal/handler"
)

func init() {
	apiV1RouterFns = append(apiV1RouterFns, func(group *gin.RouterGroup) {
		liquidityPoolsRouter(group, handler.NewLiquidityPoolsHandler())
	})
}

func liquidityPoolsRouter(group *gin.RouterGroup, h handler.LiquidityPoolsHandler) {
	//group.Use(middleware.Auth()) // all of the following routes use jwt authentication
	// or group.Use(middleware.Auth(middleware.WithVerify(verify))) // token authentication

	group.POST("/liquidityPools", h.Create)
	group.DELETE("/liquidityPools/:id", h.DeleteByID)
	group.PUT("/liquidityPools/:id", h.UpdateByID)
	group.GET("/liquidityPools/:id", h.GetByID)
	group.POST("/liquidityPools/list", h.List)
}
