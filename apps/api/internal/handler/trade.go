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

var _ TradeHandler = (*tradeHandler)(nil)

// TradeHandler defining the handler interface
type TradeHandler interface {
	Create(c *gin.Context)
	UpdateByID(c *gin.Context)
	GetByID(c *gin.Context)
	List(c *gin.Context)
}

type tradeHandler struct {
	iDao dao.TradeDao
}

// NewTradeHandler creating the handler interface
func NewTradeHandler() TradeHandler {
	return &tradeHandler{
		iDao: dao.NewTradeDao(
			model.GetDB(),
			cache.NewTradeCache(model.GetCacheType()),
		),
	}
}

// Create a record
// @Summary create trade
// @Description submit information to create trade
// @Tags trade
// @accept json
// @Produce json
// @Param data body types.CreateTradeRequest true "trade information"
// @Success 200 {object} types.CreateTradeRespond{}
// @Router /api/v1/trade [post]
// @Security BearerAuth
func (h *tradeHandler) Create(c *gin.Context) {
	form := &types.CreateTradeRequest{}
	err := c.ShouldBindJSON(form)
	if err != nil {
		logger.Warn("ShouldBindJSON error: ", logger.Err(err), middleware.GCtxRequestIDField(c))
		response.Error(c, ecode.InvalidParams)
		return
	}

	trade := &model.Trade{}
	err = copier.Copy(trade, form)
	if err != nil {
		response.Error(c, ecode.ErrCreateTrade)
		return
	}
	// Note: if copier.Copy cannot assign a value to a field, add it here

	ctx := middleware.WrapCtx(c)
	err = h.iDao.Create(ctx, trade)
	if err != nil {
		logger.Error("Create error", logger.Err(err), logger.Any("form", form), middleware.GCtxRequestIDField(c))
		response.Output(c, ecode.InternalServerError.ToHTTPCode())
		return
	}

	response.Success(c, gin.H{"id": trade.ID})
}

// UpdateByID update information by id
// @Summary update trade
// @Description update trade information by id
// @Tags trade
// @accept json
// @Produce json
// @Param id path string true "id"
// @Param data body types.UpdateTradeByIDRequest true "trade information"
// @Success 200 {object} types.UpdateTradeByIDRespond{}
// @Router /api/v1/trade/{id} [put]
// @Security BearerAuth
func (h *tradeHandler) UpdateByID(c *gin.Context) {
	_, id, isAbort := getTradeIDFromPath(c)
	if isAbort {
		response.Error(c, ecode.InvalidParams)
		return
	}

	form := &types.UpdateTradeByIDRequest{}
	err := c.ShouldBindJSON(form)
	if err != nil {
		logger.Warn("ShouldBindJSON error: ", logger.Err(err), middleware.GCtxRequestIDField(c))
		response.Error(c, ecode.InvalidParams)
		return
	}
	form.ID = id

	trade := &model.Trade{}
	err = copier.Copy(trade, form)
	if err != nil {
		response.Error(c, ecode.ErrUpdateByIDTrade)
		return
	}
	// Note: if copier.Copy cannot assign a value to a field, add it here

	ctx := middleware.WrapCtx(c)
	err = h.iDao.UpdateByID(ctx, trade)
	if err != nil {
		logger.Error("UpdateByID error", logger.Err(err), logger.Any("form", form), middleware.GCtxRequestIDField(c))
		response.Output(c, ecode.InternalServerError.ToHTTPCode())
		return
	}

	response.Success(c)
}

// GetByID get a record by id
// @Summary get trade detail
// @Description get trade detail by id
// @Tags trade
// @Param id path string true "id"
// @Accept json
// @Produce json
// @Success 200 {object} types.GetTradeByIDRespond{}
// @Router /api/v1/trade/{id} [get]
// @Security BearerAuth
func (h *tradeHandler) GetByID(c *gin.Context) {
	_, id, isAbort := getTradeIDFromPath(c)
	if isAbort {
		response.Error(c, ecode.InvalidParams)
		return
	}

	ctx := middleware.WrapCtx(c)
	trade, err := h.iDao.GetByID(ctx, id)
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

	data := &types.TradeObjDetail{}
	err = copier.Copy(data, trade)
	if err != nil {
		response.Error(c, ecode.ErrGetByIDTrade)
		return
	}
	// Note: if copier.Copy cannot assign a value to a field, add it here

	response.Success(c, gin.H{"trade": data})
}

// List of records by query parameters
// @Summary list of trades by query parameters
// @Description list of trades by paging and conditions
// @Tags trade
// @accept json
// @Produce json
// @Param data body types.Params true "query parameters"
// @Success 200 {object} types.ListTradesRespond{}
// @Router /api/v1/trade/list [post]
// @Security BearerAuth
func (h *tradeHandler) List(c *gin.Context) {
	rawForm := &types.ListTradesRawRequest{}
	err := c.ShouldBindJSON(rawForm)
	if err != nil {
		logger.Warn("ShouldBindJSON error: ", logger.Err(err), middleware.GCtxRequestIDField(c))
		response.Error(c, ecode.InvalidParams)
		return
	}

	Columns := []query.Column{{
		Name:  "token_address",
		Exp:   "=",
		Value: rawForm.Columns.TokenAddress,
	}}
	form := &types.ListCommentsRequest{Params: query.Params{
		Page:    rawForm.Page,
		Limit:   rawForm.Limit,
		Sort:    rawForm.Sort,
		Columns: Columns,
	}}

	ctx := middleware.WrapCtx(c)
	trades, total, err := h.iDao.GetByColumns(ctx, &form.Params)
	if err != nil {
		logger.Error("GetByColumns error", logger.Err(err), logger.Any("form", form), middleware.GCtxRequestIDField(c))
		response.Output(c, ecode.InternalServerError.ToHTTPCode())
		return
	}

	data, err := convertTrades(trades)
	if err != nil {
		response.Error(c, ecode.ErrListTrade)
		return
	}
	response.Success(c, gin.H{
		"items": data,
		"total": total,
		"page":  form.Page,
		"limit": form.Limit,
	})
}

func getTradeIDFromPath(c *gin.Context) (string, uint64, bool) {
	idStr := c.Param("id")
	id, err := utils.StrToUint64E(idStr)
	if err != nil || id == 0 {
		logger.Warn("StrToUint64E error: ", logger.String("idStr", idStr), middleware.GCtxRequestIDField(c))
		return "", 0, true
	}

	return idStr, id, false
}

func convertTrade(trade *model.Trade) (*types.TradeObjDetail, error) {
	data := &types.TradeObjDetail{}
	err := copier.Copy(data, trade)
	if err != nil {
		return nil, err
	}
	// Note: if copier.Copy cannot assign a value to a field, add it here

	return data, nil
}

func convertTrades(fromValues []*model.Trade) ([]*types.TradeObjDetail, error) {
	toValues := []*types.TradeObjDetail{}
	for _, v := range fromValues {
		data, err := convertTrade(v)
		if err != nil {
			return nil, err
		}
		toValues = append(toValues, data)
	}

	return toValues, nil
}
