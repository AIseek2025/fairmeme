package routers

import (
	"github.com/gin-gonic/gin"

	"github.com/fair-meme/fairmeme/apps/api/internal/handler"
)

func init() {
	apiV1RouterFns = append(apiV1RouterFns, func(group *gin.RouterGroup) {
		membersRouter(group, handler.NewMembersHandler())
	})
}

func membersRouter(group *gin.RouterGroup, h handler.MembersHandler) {
	//group.Use(middleware.Auth()) // all of the following routes use jwt authentication
	// or group.Use(middleware.Auth(middleware.WithVerify(verify))) // token authentication

	group.POST("/login", h.Create)
	group.DELETE("/members/:id", h.DeleteByID)
	group.PUT("/members/:id", h.UpdateByID)
	group.GET("/members/:id", h.GetByID)
	group.POST("/members/list", h.List)
}
