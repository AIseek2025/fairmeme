package handler

import (
	"errors"
	"github.com/zhufuyi/sponge/pkg/ggorm/query"

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

var _ HoldersHandler = (*holdersHandler)(nil)

// HoldersHandler defining the handler interface
type HoldersHandler interface {
	Create(c *gin.Context)
	DeleteByID(c *gin.Context)
	UpdateByID(c *gin.Context)
	GetByID(c *gin.Context)
	List(c *gin.Context)
}

type holdersHandler struct {
	iDao dao.HoldersDao
}

// NewHoldersHandler creating the handler interface
func NewHoldersHandler() HoldersHandler {
	return &holdersHandler{
		iDao: dao.NewHoldersDao(
			model.GetDB(),
			cache.NewHoldersCache(model.GetCacheType()),
		),
	}
}

// Create a record
// @Summary create holders
// @Description submit information to create holders
// @Tags holders
// @accept json
// @Produce json
// @Param data body types.CreateHoldersRequest true "holders information"
// @Success 200 {object} types.CreateHoldersRespond{}
// @Router /api/v1/holders [post]
// @Security BearerAuth
func (h *holdersHandler) Create(c *gin.Context) {
	form := &types.CreateHoldersRequest{}
	err := c.ShouldBindJSON(form)
	if err != nil {
		logger.Warn("ShouldBindJSON error: ", logger.Err(err), middleware.GCtxRequestIDField(c))
		response.Error(c, ecode.InvalidParams)
		return
	}

	holders := &model.Holders{}
	err = copier.Copy(holders, form)
	if err != nil {
		response.Error(c, ecode.ErrCreateHolders)
		return
	}
	// Note: if copier.Copy cannot assign a value to a field, add it here

	ctx := middleware.WrapCtx(c)
	err = h.iDao.Create(ctx, holders)
	if err != nil {
		logger.Error("Create error", logger.Err(err), logger.Any("form", form), middleware.GCtxRequestIDField(c))
		response.Output(c, ecode.InternalServerError.ToHTTPCode())
		return
	}

	response.Success(c, gin.H{"id": holders.ID})
}

// DeleteByID delete a record by id
// @Summary delete holders
// @Description delete holders by id
// @Tags holders
// @accept json
// @Produce json
// @Param id path string true "id"
// @Success 200 {object} types.DeleteHoldersByIDRespond{}
// @Router /api/v1/holders/{id} [delete]
// @Security BearerAuth
func (h *holdersHandler) DeleteByID(c *gin.Context) {
	_, id, isAbort := getHoldersIDFromPath(c)
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
// @Summary update holders
// @Description update holders information by id
// @Tags holders
// @accept json
// @Produce json
// @Param id path string true "id"
// @Param data body types.UpdateHoldersByIDRequest true "holders information"
// @Success 200 {object} types.UpdateHoldersByIDRespond{}
// @Router /api/v1/holders/{id} [put]
// @Security BearerAuth
func (h *holdersHandler) UpdateByID(c *gin.Context) {
	_, id, isAbort := getHoldersIDFromPath(c)
	if isAbort {
		response.Error(c, ecode.InvalidParams)
		return
	}

	form := &types.UpdateHoldersByIDRequest{}
	err := c.ShouldBindJSON(form)
	if err != nil {
		logger.Warn("ShouldBindJSON error: ", logger.Err(err), middleware.GCtxRequestIDField(c))
		response.Error(c, ecode.InvalidParams)
		return
	}
	form.ID = id

	holders := &model.Holders{}
	err = copier.Copy(holders, form)
	if err != nil {
		response.Error(c, ecode.ErrUpdateByIDHolders)
		return
	}
	// Note: if copier.Copy cannot assign a value to a field, add it here

	ctx := middleware.WrapCtx(c)
	err = h.iDao.UpdateByID(ctx, holders)
	if err != nil {
		logger.Error("UpdateByID error", logger.Err(err), logger.Any("form", form), middleware.GCtxRequestIDField(c))
		response.Output(c, ecode.InternalServerError.ToHTTPCode())
		return
	}

	response.Success(c)
}

// GetByID get a record by id
// @Summary get holders detail
// @Description get holders detail by id
// @Tags holders
// @Param id path string true "id"
// @Accept json
// @Produce json
// @Success 200 {object} types.GetHoldersByIDRespond{}
// @Router /api/v1/holders/{id} [get]
// @Security BearerAuth
func (h *holdersHandler) GetByID(c *gin.Context) {
	_, id, isAbort := getHoldersIDFromPath(c)
	if isAbort {
		response.Error(c, ecode.InvalidParams)
		return
	}

	ctx := middleware.WrapCtx(c)
	holders, err := h.iDao.GetByID(ctx, id)
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

	data := &types.HoldersObjDetail{}
	err = copier.Copy(data, holders)
	if err != nil {
		response.Error(c, ecode.ErrGetByIDHolders)
		return
	}
	// Note: if copier.Copy cannot assign a value to a field, add it here

	response.Success(c, gin.H{"holders": data})
}

// List of records by query parameters
// @Summary list of holderss by query parameters
// @Description list of holderss by paging and conditions
// @Tags holders
// @accept json
// @Produce json
// @Param data body types.Params true "query parameters"
// @Success 200 {object} types.ListHolderssRespond{}
// @Router /api/v1/holders/list [post]
// @Security BearerAuth
func (h *holdersHandler) List(c *gin.Context) {
	rawForm := &types.ListHoldersRawRequest{}
	err := c.ShouldBindJSON(rawForm)
	if err != nil {
		logger.Warn("ShouldBindJSON error: ", logger.Err(err), middleware.GCtxRequestIDField(c))
		response.Error(c, ecode.InvalidParams)
		return
	}
	Columns := []query.Column{{
		Name:  "token_address",
		Exp:   "like",
		Value: rawForm.Columns.TokenAddress,
	}}
	form := &types.ListCommentsRequest{Params: query.Params{
		Page:    rawForm.Page,
		Limit:   rawForm.Limit,
		Sort:    rawForm.Sort,
		Columns: Columns,
	}}

	ctx := middleware.WrapCtx(c)
	holderss, total, err := h.iDao.GetByColumns(ctx, &form.Params)
	if err != nil {
		logger.Error("GetByColumns error", logger.Err(err), logger.Any("form", form), middleware.GCtxRequestIDField(c))
		response.Output(c, ecode.InternalServerError.ToHTTPCode())
		return
	}

	data, err := convertHolderss(holderss)
	if err != nil {
		response.Error(c, ecode.ErrListHolders)
		return
	}

	response.Success(c, gin.H{
		"items": data,
		"total": total,
		"page":  form.Page,
		"limit": form.Limit,
	})
}

func getHoldersIDFromPath(c *gin.Context) (string, uint64, bool) {
	idStr := c.Param("id")
	id, err := utils.StrToUint64E(idStr)
	if err != nil || id == 0 {
		logger.Warn("StrToUint64E error: ", logger.String("idStr", idStr), middleware.GCtxRequestIDField(c))
		return "", 0, true
	}

	return idStr, id, false
}

func convertHolders(holders *model.Holders) (*types.HoldersObjDetail, error) {
	data := &types.HoldersObjDetail{}
	err := copier.Copy(data, holders)
	if err != nil {
		return nil, err
	}
	// Note: if copier.Copy cannot assign a value to a field, add it here

	return data, nil
}

func convertHolderss(fromValues []*model.Holders) ([]*types.HoldersObjDetail, error) {
	toValues := []*types.HoldersObjDetail{}
	for _, v := range fromValues {
		data, err := convertHolders(v)
		if err != nil {
			return nil, err
		}
		toValues = append(toValues, data)
	}

	return toValues, nil
}
