package routers

import (
	"github.com/gin-gonic/gin"

	"github.com/fair-meme/fairmeme/apps/api/internal/handler"
)

func init() {
	apiV1RouterFns = append(apiV1RouterFns, func(group *gin.RouterGroup) {
		watchRouter(group, handler.NewWatchHandler())
	})
}

func watchRouter(group *gin.RouterGroup, h handler.WatchHandler) {
	//group.Use(middleware.Auth()) // all of the following routes use jwt authentication
	// or group.Use(middleware.Auth(middleware.WithVerify(verify))) // token authentication

	group.POST("/followAction", h.FollowAction)
}
