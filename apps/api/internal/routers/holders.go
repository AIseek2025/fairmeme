package routers

import (
	"github.com/gin-gonic/gin"

	"github.com/fair-meme/fairmeme/apps/api/internal/handler"
)

func init() {
	apiV1RouterFns = append(apiV1RouterFns, func(group *gin.RouterGroup) {
		holdersRouter(group, handler.NewHoldersHandler())
	})
}

func holdersRouter(group *gin.RouterGroup, h handler.HoldersHandler) {
	//group.Use(middleware.Auth()) // all of the following routes use jwt authentication
	// or group.Use(middleware.Auth(middleware.WithVerify(verify))) // token authentication

	group.POST("/holders", h.Create)
	group.DELETE("/holders/:id", h.DeleteByID)
	group.PUT("/holders/:id", h.UpdateByID)
	group.GET("/holders/:id", h.GetByID)
	group.POST("/holders/list", h.List)
}
