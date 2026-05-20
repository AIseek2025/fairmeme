package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/copier"

	"github.com/fair-meme/fairmeme/apps/api/internal/cache"
	"github.com/fair-meme/fairmeme/apps/api/internal/dao"
	"github.com/fair-meme/fairmeme/apps/api/internal/ecode"
	"github.com/fair-meme/fairmeme/apps/api/internal/model"
	"github.com/fair-meme/fairmeme/apps/api/internal/types"
	"github.com/zhufuyi/sponge/pkg/gin/middleware"
	"github.com/zhufuyi/sponge/pkg/gin/response"
	"github.com/zhufuyi/sponge/pkg/logger"
)

var _ WatchHandler = (*watchHandler)(nil)

// WatchHandler defining the handler interface
type WatchHandler interface {
	FollowAction(c *gin.Context)
}

type watchHandler struct {
	iDao dao.WatchDao
}

// NewWatchHandler creating the handler interface
func NewWatchHandler() WatchHandler {
	return &watchHandler{
		iDao: dao.NewWatchDao(
			model.GetDB(),
			cache.NewWatchCache(model.GetCacheType()),
		),
	}
}

func (h *watchHandler) FollowAction(c *gin.Context) {
	form := &types.CreateWatchRequest{}
	err := c.ShouldBindJSON(form)
	if err != nil {
		logger.Warn("ShouldBindJSON error: ", logger.Err(err), middleware.GCtxRequestIDField(c))
		response.Error(c, ecode.InvalidParams)
		return
	}

	watch := &model.Watch{}
	err = copier.Copy(watch, form)
	if err != nil {
		response.Error(c, ecode.ErrCreateWatch)
		return
	}
	// Note: if copier.Copy cannot assign a value to a field, add it here

	ctx := middleware.WrapCtx(c)

	err = h.iDao.Create(ctx, watch)
	if err != nil {
		logger.Error("Create error", logger.Err(err), logger.Any("form", form), middleware.GCtxRequestIDField(c))
		response.Output(c, ecode.InternalServerError.ToHTTPCode())
		return
	}

	response.Success(c)
}
