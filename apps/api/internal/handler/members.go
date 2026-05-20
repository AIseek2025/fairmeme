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

var _ MembersHandler = (*membersHandler)(nil)

// MembersHandler defining the handler interface
type MembersHandler interface {
	Create(c *gin.Context)
	DeleteByID(c *gin.Context)
	UpdateByID(c *gin.Context)
	GetByID(c *gin.Context)
	List(c *gin.Context)
}

type membersHandler struct {
	iDao dao.MembersDao
}

// NewMembersHandler creating the handler interface
func NewMembersHandler() MembersHandler {
	return &membersHandler{
		iDao: dao.NewMembersDao(
			model.GetDB(),
			cache.NewMembersCache(model.GetCacheType()),
		),
	}
}

// Create a record
// @Summary create members
// @Description submit information to create members
// @Tags members
// @accept json
// @Produce json
// @Param data body types.CreateMembersRequest true "members information"
// @Success 200 {object} types.CreateMembersRespond{}
// @Router /api/v1/members [post]
// @Security BearerAuth
func (h *membersHandler) Create(c *gin.Context) {
	form := &types.CreateMembersRequest{}
	err := c.ShouldBindJSON(form)
	if err != nil {
		logger.Warn("ShouldBindJSON error: ", logger.Err(err), middleware.GCtxRequestIDField(c))
		response.Error(c, ecode.InvalidParams)
		return
	}

	//var member model.Members
	//h.iDao.
	members := &model.Members{}
	err = copier.Copy(members, form)
	if err != nil {
		response.Error(c, ecode.ErrCreateMembers)
		return
	}
	// Note: if copier.Copy cannot assign a value to a field, add it here

	ctx := middleware.WrapCtx(c)

	err = h.iDao.Create(ctx, members)
	if err != nil {
		logger.Error("Create error", logger.Err(err), logger.Any("form", form), middleware.GCtxRequestIDField(c))
		response.Output(c, ecode.InternalServerError.ToHTTPCode())
		return
	}

	response.Success(c, gin.H{"id": members.ID})
}

// DeleteByID delete a record by id
// @Summary delete members
// @Description delete members by id
// @Tags members
// @accept json
// @Produce json
// @Param id path string true "id"
// @Success 200 {object} types.DeleteMembersByIDRespond{}
// @Router /api/v1/members/{id} [delete]
// @Security BearerAuth
func (h *membersHandler) DeleteByID(c *gin.Context) {
	_, id, isAbort := getMembersIDFromPath(c)
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
// @Summary update members
// @Description update members information by id
// @Tags members
// @accept json
// @Produce json
// @Param id path string true "id"
// @Param data body types.UpdateMembersByIDRequest true "members information"
// @Success 200 {object} types.UpdateMembersByIDRespond{}
// @Router /api/v1/members/{id} [put]
// @Security BearerAuth
func (h *membersHandler) UpdateByID(c *gin.Context) {
	_, id, isAbort := getMembersIDFromPath(c)
	if isAbort {
		response.Error(c, ecode.InvalidParams)
		return
	}

	form := &types.UpdateMembersByIDRequest{}
	err := c.ShouldBindJSON(form)
	if err != nil {
		logger.Warn("ShouldBindJSON error: ", logger.Err(err), middleware.GCtxRequestIDField(c))
		response.Error(c, ecode.InvalidParams)
		return
	}
	form.ID = id

	members := &model.Members{}
	err = copier.Copy(members, form)
	if err != nil {
		response.Error(c, ecode.ErrUpdateByIDMembers)
		return
	}
	// Note: if copier.Copy cannot assign a value to a field, add it here

	ctx := middleware.WrapCtx(c)
	err = h.iDao.UpdateByID(ctx, members)
	if err != nil {
		logger.Error("UpdateByID error", logger.Err(err), logger.Any("form", form), middleware.GCtxRequestIDField(c))
		response.Output(c, ecode.InternalServerError.ToHTTPCode())
		return
	}

	response.Success(c)
}

// GetByID get a record by id
// @Summary get members detail
// @Description get members detail by id
// @Tags members
// @Param id path string true "id"
// @Accept json
// @Produce json
// @Success 200 {object} types.GetMembersByIDRespond{}
// @Router /api/v1/members/{id} [get]
// @Security BearerAuth
func (h *membersHandler) GetByID(c *gin.Context) {
	_, id, isAbort := getMembersIDFromPath(c)
	if isAbort {
		response.Error(c, ecode.InvalidParams)
		return
	}

	ctx := middleware.WrapCtx(c)
	members, err := h.iDao.GetByID(ctx, id)
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

	data := &types.MembersObjDetail{}
	err = copier.Copy(data, members)
	if err != nil {
		response.Error(c, ecode.ErrGetByIDMembers)
		return
	}
	// Note: if copier.Copy cannot assign a value to a field, add it here

	response.Success(c, gin.H{"members": data})
}

// List of records by query parameters
// @Summary list of memberss by query parameters
// @Description list of memberss by paging and conditions
// @Tags members
// @accept json
// @Produce json
// @Param data body types.Params true "query parameters"
// @Success 200 {object} types.ListMemberssRespond{}
// @Router /api/v1/members/list [post]
// @Security BearerAuth
func (h *membersHandler) List(c *gin.Context) {
	form := &types.ListMemberssRequest{}
	err := c.ShouldBindJSON(form)
	if err != nil {
		logger.Warn("ShouldBindJSON error: ", logger.Err(err), middleware.GCtxRequestIDField(c))
		response.Error(c, ecode.InvalidParams)
		return
	}

	ctx := middleware.WrapCtx(c)
	memberss, total, err := h.iDao.GetByColumns(ctx, &form.Params)
	if err != nil {
		logger.Error("GetByColumns error", logger.Err(err), logger.Any("form", form), middleware.GCtxRequestIDField(c))
		response.Output(c, ecode.InternalServerError.ToHTTPCode())
		return
	}

	data, err := convertMemberss(memberss)
	if err != nil {
		response.Error(c, ecode.ErrListMembers)
		return
	}

	response.Success(c, gin.H{
		"items": data,
		"total": total,
		"page":  form.Page,
		"limit": form.Limit,
	})
}

func getMembersIDFromPath(c *gin.Context) (string, uint64, bool) {
	idStr := c.Param("id")
	id, err := utils.StrToUint64E(idStr)
	if err != nil || id == 0 {
		logger.Warn("StrToUint64E error: ", logger.String("idStr", idStr), middleware.GCtxRequestIDField(c))
		return "", 0, true
	}

	return idStr, id, false
}

func convertMembers(members *model.Members) (*types.MembersObjDetail, error) {
	data := &types.MembersObjDetail{}
	err := copier.Copy(data, members)
	if err != nil {
		return nil, err
	}
	// Note: if copier.Copy cannot assign a value to a field, add it here

	return data, nil
}

func convertMemberss(fromValues []*model.Members) ([]*types.MembersObjDetail, error) {
	toValues := []*types.MembersObjDetail{}
	for _, v := range fromValues {
		data, err := convertMembers(v)
		if err != nil {
			return nil, err
		}
		toValues = append(toValues, data)
	}

	return toValues, nil
}
