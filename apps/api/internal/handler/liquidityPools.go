package handler

import (
	"errors"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/copier"

	"github.com/zhufuyi/sponge/pkg/gin/middleware"
	"github.com/zhufuyi/sponge/pkg/gin/response"
	"github.com/zhufuyi/sponge/pkg/logger"
	"github.com/zhufuyi/sponge/pkg/utils"

	"github.com/fair-meme/fairmeme/apps/api/internal/cache"
	"github.com/fair-meme/fairmeme/apps/api/internal/dao"
	"github.com/fair-meme/fairmeme/apps/api/internal/ecode"
	"github.com/fair-meme/fairmeme/apps/api/internal/model"
	"github.com/fair-meme/fairmeme/apps/api/internal/types"
)

var _ LiquidityPoolsHandler = (*liquidityPoolsHandler)(nil)

// LiquidityPoolsHandler defining the handler interface
type LiquidityPoolsHandler interface {
	Create(c *gin.Context)
	DeleteByID(c *gin.Context)
	UpdateByID(c *gin.Context)
	GetByID(c *gin.Context)
	List(c *gin.Context)
}

type liquidityPoolsHandler struct {
	iDao dao.LiquidityPoolsDao
}

// NewLiquidityPoolsHandler creating the handler interface
func NewLiquidityPoolsHandler() LiquidityPoolsHandler {
	return &liquidityPoolsHandler{
		iDao: dao.NewLiquidityPoolsDao(
			model.GetDB(),
			cache.NewLiquidityPoolsCache(model.GetCacheType()),
		),
	}
}

// Create a record
// @Summary create liquidityPools
// @Description submit information to create liquidityPools
// @Tags liquidityPools
// @accept json
// @Produce json
// @Param data body types.CreateLiquidityPoolsRequest true "liquidityPools information"
// @Success 200 {object} types.CreateLiquidityPoolsRespond{}
// @Router /api/v1/liquidityPools [post]
// @Security BearerAuth
func (h *liquidityPoolsHandler) Create(c *gin.Context) {
	form := &types.CreateLiquidityPoolsRequest{}
	err := c.ShouldBindJSON(form)
	if err != nil {
		logger.Warn("ShouldBindJSON error: ", logger.Err(err), middleware.GCtxRequestIDField(c))
		response.Error(c, ecode.InvalidParams)
		return
	}

	liquidityPools := &model.LiquidityPools{}
	err = copier.Copy(liquidityPools, form)
	if err != nil {
		response.Error(c, ecode.ErrCreateLiquidityPools)
		return
	}
	// Note: if copier.Copy cannot assign a value to a field, add it here

	ctx := middleware.WrapCtx(c)
	err = h.iDao.Create(ctx, liquidityPools)
	if err != nil {
		logger.Error("Create error", logger.Err(err), logger.Any("form", form), middleware.GCtxRequestIDField(c))
		response.Output(c, ecode.InternalServerError.ToHTTPCode())
		return
	}

	response.Success(c, gin.H{"id": liquidityPools.ID})
}

// DeleteByID delete a record by id
// @Summary delete liquidityPools
// @Description delete liquidityPools by id
// @Tags liquidityPools
// @accept json
// @Produce json
// @Param id path string true "id"
// @Success 200 {object} types.DeleteLiquidityPoolsByIDRespond{}
// @Router /api/v1/liquidityPools/{id} [delete]
// @Security BearerAuth
func (h *liquidityPoolsHandler) DeleteByID(c *gin.Context) {
	_, id, isAbort := getLiquidityPoolsIDFromPath(c)
	if isAbort {
		response.Error(c, ecode.InvalidParams)
		return
	}

	ctx := middleware.WrapCtx(c)
	err := h.iDao.DeleteByID(ctx, id)
	if err != nil {
		logger.Error("DeleteByID error", logger.Err(err), logger.Any("id", id), middleware.GCtxRequestIDField(c))
		response.Output(c, ecode.InternalServerError.ToHTTPCode())
		return
	}

	response.Success(c)
}

// UpdateByID update information by id
// @Summary update liquidityPools
// @Description update liquidityPools information by id
// @Tags liquidityPools
// @accept json
// @Produce json
// @Param id path string true "id"
// @Param data body types.UpdateLiquidityPoolsByIDRequest true "liquidityPools information"
// @Success 200 {object} types.UpdateLiquidityPoolsByIDRespond{}
// @Router /api/v1/liquidityPools/{id} [put]
// @Security BearerAuth
func (h *liquidityPoolsHandler) UpdateByID(c *gin.Context) {
	_, id, isAbort := getLiquidityPoolsIDFromPath(c)
	if isAbort {
		response.Error(c, ecode.InvalidParams)
		return
	}

	form := &types.UpdateLiquidityPoolsByIDRequest{}
	err := c.ShouldBindJSON(form)
	if err != nil {
		logger.Warn("ShouldBindJSON error: ", logger.Err(err), middleware.GCtxRequestIDField(c))
		response.Error(c, ecode.InvalidParams)
		return
	}
	form.ID = id

	liquidityPools := &model.LiquidityPools{}
	err = copier.Copy(liquidityPools, form)
	if err != nil {
		response.Error(c, ecode.ErrUpdateByIDLiquidityPools)
		return
	}
	// Note: if copier.Copy cannot assign a value to a field, add it here

	ctx := middleware.WrapCtx(c)
	err = h.iDao.UpdateByID(ctx, liquidityPools)
	if err != nil {
		logger.Error("UpdateByID error", logger.Err(err), logger.Any("form", form), middleware.GCtxRequestIDField(c))
		response.Output(c, ecode.InternalServerError.ToHTTPCode())
		return
	}

	response.Success(c)
}

// GetByID get a record by id
// @Summary get liquidityPools detail
// @Description get liquidityPools detail by id
// @Tags liquidityPools
// @Param id path string true "id"
// @Accept json
// @Produce json
// @Success 200 {object} types.GetLiquidityPoolsByIDRespond{}
// @Router /api/v1/liquidityPools/{id} [get]
// @Security BearerAuth
func (h *liquidityPoolsHandler) GetByID(c *gin.Context) {
	_, id, isAbort := getLiquidityPoolsIDFromPath(c)
	if isAbort {
		response.Error(c, ecode.InvalidParams)
		return
	}

	ctx := middleware.WrapCtx(c)
	liquidityPools, err := h.iDao.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, model.ErrRecordNotFound) {
			logger.Warn("GetByID not found", logger.Err(err), logger.Any("id", id), middleware.GCtxRequestIDField(c))
			response.Error(c, ecode.NotFound)
		} else {
			logger.Error("GetByID error", logger.Err(err), logger.Any("id", id), middleware.GCtxRequestIDField(c))
			response.Output(c, ecode.InternalServerError.ToHTTPCode())
		}
		return
	}

	data := &types.LiquidityPoolsObjDetail{}
	err = copier.Copy(data, liquidityPools)
	if err != nil {
		response.Error(c, ecode.ErrGetByIDLiquidityPools)
		return
	}
	// Note: if copier.Copy cannot assign a value to a field, add it here

	response.Success(c, gin.H{"liquidityPools": data})
}

// List of records by query parameters
// @Summary list of liquidityPoolss by query parameters
// @Description list of liquidityPoolss by paging and conditions
// @Tags liquidityPools
// @accept json
// @Produce json
// @Param data body types.Params true "query parameters"
// @Success 200 {object} types.ListLiquidityPoolssRespond{}
// @Router /api/v1/liquidityPools/list [post]
// @Security BearerAuth
func (h *liquidityPoolsHandler) List(c *gin.Context) {
	form := &types.ListLiquidityPoolssRequest{}
	err := c.ShouldBindJSON(form)
	if err != nil {
		logger.Warn("ShouldBindJSON error: ", logger.Err(err), middleware.GCtxRequestIDField(c))
		response.Error(c, ecode.InvalidParams)
		return
	}

	ctx := middleware.WrapCtx(c)
	liquidityPoolss, total, err := h.iDao.GetByColumns(ctx, &form.Params)
	if err != nil {
		logger.Error("GetByColumns error", logger.Err(err), logger.Any("form", form), middleware.GCtxRequestIDField(c))
		response.Output(c, ecode.InternalServerError.ToHTTPCode())
		return
	}

	data, err := convertLiquidityPoolss(liquidityPoolss)
	if err != nil {
		response.Error(c, ecode.ErrListLiquidityPools)
		return
	}

	response.Success(c, gin.H{
		"liquidityPoolss": data,
		"total":           total,
	})
}

func getLiquidityPoolsIDFromPath(c *gin.Context) (string, uint64, bool) {
	idStr := c.Param("id")
	id, err := utils.StrToUint64E(idStr)
	if err != nil || id == 0 {
		logger.Warn("StrToUint64E error: ", logger.String("idStr", idStr), middleware.GCtxRequestIDField(c))
		return "", 0, true
	}

	return idStr, id, false
}

func convertLiquidityPools(liquidityPools *model.LiquidityPools) (*types.LiquidityPoolsObjDetail, error) {
	data := &types.LiquidityPoolsObjDetail{}
	err := copier.Copy(data, liquidityPools)
	if err != nil {
		return nil, err
	}
	// Note: if copier.Copy cannot assign a value to a field, add it here

	return data, nil
}

func convertLiquidityPoolss(fromValues []*model.LiquidityPools) ([]*types.LiquidityPoolsObjDetail, error) {
	toValues := []*types.LiquidityPoolsObjDetail{}
	for _, v := range fromValues {
		data, err := convertLiquidityPools(v)
		if err != nil {
			return nil, err
		}
		toValues = append(toValues, data)
	}

	return toValues, nil
}
