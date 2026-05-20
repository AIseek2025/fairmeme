package routers

import (
	"github.com/gin-gonic/gin"

	"github.com/fair-meme/fairmeme/apps/api/internal/handler"
)

func init() {
	apiV1RouterFns = append(apiV1RouterFns, func(group *gin.RouterGroup) {
		tokenRouter(group, handler.NewTokenHandler())
	})
}

func tokenRouter(group *gin.RouterGroup, h handler.TokenHandler) {
	//group.Use(middleware.Auth()) // all of the following routes use jwt authentication
	// or group.Use(middleware.Auth(middleware.WithVerify(verify))) // token authentication

	group.POST("/token", h.Create)
	group.PUT("/token/:id", h.UpdateByID)
	group.GET("/token/:address", h.GetByAddress)
	group.POST("/token/list", h.List)
	group.GET("/token/getReceivedTokenAmount", h.GetReceivedTokenAmount)
}
