package handler

import (
	"context"
	"github.com/fair-meme/fairmeme/apps/api/internal/service"
	"errors"
	"fmt"
	"github.com/gagliardetto/solana-go"
	"github.com/zhufuyi/sponge/pkg/ggorm/query"
	"strconv"
	"strings"

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

var _ TokenHandler = (*tokenHandler)(nil)

// TokenHandler defining the handler interface
type TokenHandler interface {
	Create(c *gin.Context)
	UpdateByID(c *gin.Context)
	GetByAddress(c *gin.Context)
	List(c *gin.Context)
	GetReceivedTokenAmount(c *gin.Context)
}

type tokenHandler struct {
	iDao          dao.TokenDao
	holdersDao    dao.HoldersDao
	solanaService *service.SolanaService
}

// NewTokenHandler creating the handler interface
func NewTokenHandler() TokenHandler {
	return &tokenHandler{
		iDao: dao.NewTokenDao(
			model.GetDB(),
			cache.NewTokenCache(model.GetCacheType()),
		),
		holdersDao: dao.NewHoldersDao(
			model.GetDB(),
			cache.NewHoldersCache(model.GetCacheType()),
		),
		solanaService: service.NewSolanaService(),
	}
}

// Create a record
// @Summary create token
// @Description submit information to create token
// @Tags token
// @accept json
// @Produce json
// @Param data body types.CreateTokenRequest true "token information"
// @Success 200 {object} types.CreateTokenRespond{}
// @Router /api/v1/token [post]
// @Security BearerAuth
func (h *tokenHandler) Create(c *gin.Context) {
	form := &types.CreateTokenRequest{}
	err := c.ShouldBindJSON(form)
	if err != nil {
		logger.Warn("ShouldBindJSON error: ", logger.Err(err), middleware.GCtxRequestIDField(c))
		response.Error(c, ecode.InvalidParams)
		return
	}

	token := &model.Token{}
	err = copier.Copy(token, form)
	if err != nil {
		response.Error(c, ecode.ErrCreateToken)
		return
	}
	// Note: if copier.Copy cannot assign a value to a field, add it here
	form.DevPurchase = 10
	form.InitialLiquidity = 10
	ctx := middleware.WrapCtx(c)
	err = h.iDao.Create(ctx, token)
	if err != nil {
		logger.Error("Create error", logger.Err(err), logger.Any("form", form), middleware.GCtxRequestIDField(c))
		response.Output(c, ecode.InternalServerError.ToHTTPCode())
		return
	}

	response.Success(c, gin.H{"id": token.ID})
}

// UpdateByID update information by id
// @Summary update token
// @Description update token information by id
// @Tags token
// @accept json
// @Produce json
// @Param id path string true "id"
// @Param data body types.UpdateTokenByIDRequest true "token information"
// @Success 200 {object} types.UpdateTokenByIDRespond{}
// @Router /api/v1/token/{id} [put]
// @Security BearerAuth
func (h *tokenHandler) UpdateByID(c *gin.Context) {
	address, isAbort := getTokenAddressFromPath(c)
	if isAbort {
		response.Error(c, ecode.InvalidParams)
		return
	}

	form := &types.UpdateTokenByIDRequest{}
	err := c.ShouldBindJSON(form)
	if err != nil {
		logger.Warn("ShouldBindJSON error: ", logger.Err(err), middleware.GCtxRequestIDField(c))
		response.Error(c, ecode.InvalidParams)
		return
	}
	form.TokenAddress = address

	token := &model.Token{}
	err = copier.Copy(token, form)
	if err != nil {
		response.Error(c, ecode.ErrUpdateByIDToken)
		return
	}
	// Note: if copier.Copy cannot assign a value to a field, add it here

	ctx := middleware.WrapCtx(c)
	err = h.iDao.UpdateByAddress(ctx, token)
	if err != nil {
		logger.Error("UpdateByID error", logger.Err(err), logger.Any("form", form), middleware.GCtxRequestIDField(c))
		response.Output(c, ecode.InternalServerError.ToHTTPCode())
		return
	}

	response.Success(c)
}

// GetByAddress get a record by id
// @Summary get token detail
// @Description get token detail by id
// @Tags token
// @Param id path string true "id"
// @Accept json
// @Produce json
// @Success 200 {object} types.GetTokenByIDRespond{}
// @Router /api/v1/token/{id} [get]
// @Security BearerAuth
func (h *tokenHandler) GetByAddress(c *gin.Context) {
	address, isAbort := getTokenAddressFromPath(c)
	if isAbort {
		response.Error(c, ecode.InvalidParams)
		return
	}

	ctx := middleware.WrapCtx(c)
	token, err := h.iDao.GetByAddress(ctx, address)
	if err != nil {
		if errors.Is(err, model.ErrRecordNotFound) {
			logger.Warn("GetByID not found", logger.Err(err), logger.Any("token_address", address), middleware.GCtxRequestIDField(c))
			response.Error(c, ecode.NotFound)
		} else {
			logger.Error("GetByID error", logger.Err(err), logger.Any("token_address", address), middleware.GCtxRequestIDField(c))
			response.Output(c, ecode.InternalServerError.ToHTTPCode())
		}
		return
	}

	data := &types.TokenObjDetail{}
	err = copier.Copy(data, token)
	if err != nil {
		response.Error(c, ecode.ErrGetByIDToken)
		return
	}
	// Note: if copier.Copy cannot assign a value to a field, add it here

	response.Success(c, gin.H{"token": data})
}

// List of records by query parameters
// @Summary list of tokens by query parameters
// @Description list of tokens by paging and conditions
// @Tags token
// @accept json
// @Produce json
// @Param data body types.Params true "query parameters"
// @Success 200 {object} types.ListTokensRespond{}
// @Router /api/v1/token/list [post]
// @Security BearerAuth
func (h *tokenHandler) List(c *gin.Context) {
	rawForm := &types.ListTokensRawRequest{}
	err := c.ShouldBindJSON(rawForm)
	if err != nil {
		logger.Warn("ShouldBindJSON error: ", logger.Err(err), middleware.GCtxRequestIDField(c))
		response.Error(c, ecode.InvalidParams)
		return
	}
	ctx := middleware.WrapCtx(c)

	if (rawForm.Columns.ChainID == "" && rawForm.Columns.Address != "") || (rawForm.Columns.ChainID != "" && rawForm.Columns.Address == "") {
		response.Error(c, ecode.ErrInvalidParameterPair)
		return
	}
	var form *types.ListCommentsRequest
	form, err = h.convertFrom(ctx, rawForm)
	var (
		tokens []*model.Token
		total  int64
	)

	tokens, total, err = h.iDao.GetByColumns(ctx, &form.Params)
	if err != nil {
		logger.Error("GetByColumns error", logger.Err(err), logger.Any("form", form), middleware.GCtxRequestIDField(c))
		response.Output(c, ecode.InternalServerError.ToHTTPCode())
		return
	}
	if rawForm.Columns.Address != "" {
		var holdersList map[string]float64
		tokenService := service.NewTokenService(h.holdersDao)
		holdersList, err = tokenService.GetTokensBalanceByMember(ctx, rawForm.Columns.Address)
		for _, token := range tokens {
			balance, exists := holdersList[token.TokenAddress]
			if !exists {
				token.Price = 0
				token.Balance = 0
			} else {
				//todo modifi real price
				token.Price = 1.01
				token.Balance = balance
			}
		}
	}
	data, err := convertTokens(tokens)
	if err != nil {
		response.Error(c, ecode.ErrListToken)
		return
	}

	response.Success(c, gin.H{
		"items": data,
		"total": total,
		"page":  form.Page,
		"limit": form.Limit,
	})
}

func getTokenAddressFromPath(c *gin.Context) (string, bool) {
	address := c.Param("address")

	return address, false
}

func convertToken(token *model.Token) (*types.TokenObjDetail, error) {
	data := &types.TokenObjDetail{}
	err := copier.Copy(data, token)
	if err != nil {
		return nil, err
	}
	// Note: if copier.Copy cannot assign a value to a field, add it here

	return data, nil
}

func convertTokens(fromValues []*model.Token) ([]*types.TokenObjDetail, error) {
	toValues := []*types.TokenObjDetail{}
	for _, v := range fromValues {
		data, err := convertToken(v)
		if err != nil {
			return nil, err
		}
		toValues = append(toValues, data)
	}

	return toValues, nil
}

func (h *tokenHandler) convertFrom(ctx context.Context, rawForm *types.ListTokensRawRequest) (*types.ListCommentsRequest, error) {
	var Columns []query.Column

	if rawForm.Columns.ChainID != "" {
		Columns = append(Columns, query.Column{
			Name:  "chain_id",
			Exp:   "=",
			Value: rawForm.Columns.ChainID,
			Logic: "and",
		})
	}
	if rawForm.Columns.Address != "" && rawForm.Columns.Keyword == "" {
		addresses, err := h.holdersDao.GetTokensByMember(ctx, rawForm.Columns.Address)
		if err != nil {
			return nil, err
		}
		Columns = append(Columns, query.Column{
			Name:  "token_address",
			Exp:   "in",
			Value: strings.Join(addresses, ","),
			Logic: "and",
		})
	}

	if rawForm.Columns.Keyword != "" {
		Columns = append(Columns, []query.Column{{
			Name:  "token_address",
			Exp:   "like",
			Value: rawForm.Columns.Keyword,
			Logic: "or",
		}, {
			Name:  "token_name",
			Exp:   "like",
			Value: rawForm.Columns.Keyword,
			Logic: "or",
		}, {
			Name:  "token_ticker",
			Exp:   "like",
			Value: rawForm.Columns.Keyword,
			Logic: "or",
		}}...)
	}

	from := &types.ListCommentsRequest{Params: query.Params{
		Page:    rawForm.Page,
		Limit:   rawForm.Limit,
		Sort:    rawForm.Sort,
		Columns: Columns,
	}}
	return from, nil
}

func (s *tokenHandler) GetReceivedTokenAmount(c *gin.Context) {
	tokenAddressQuery := c.Query("tokenAddress")
	solAmountQuery := c.Query("solAmount")

	if tokenAddressQuery == "" {
		response.Error(c, ecode.ErrInvalidTokenAddress)
		return
	}

	if solAmountQuery == "" {
		response.Error(c, ecode.ErrInvalidSolAmount)
		return
	}

	tokenAddress, err := solana.PublicKeyFromBase58(tokenAddressQuery)
	if err != nil {
		response.Error(c, ecode.ErrInvalidTokenAddress)
		return
	}

	solAmount, err := strconv.ParseFloat(solAmountQuery, 64)
	if err != nil {
		response.Error(c, ecode.ErrInvalidSolAmount)
		return
	}
	if solAmount <= 0 {
		res := types.GetPriceResponse{
			TokenAddress: tokenAddress.String(),
			SolAmount:    solAmountQuery,
			TokenAmount:  "0",
			//Price:        priceStr,
		}
		response.Success(c, res)
		return
	}

	price, tokenAmount, err := s.solanaService.GetBuyPrice(tokenAddress.String(), solAmount)
	if err != nil {
		response.Error(c, ecode.ErrGetGuyPrice)
		return
	}
	priceStr := fmt.Sprintf("%.16f", price)
	tokenAmountStr := fmt.Sprintf("%.16f", tokenAmount)
	res := types.GetPriceResponse{
		TokenAddress: tokenAddress.String(),
		SolAmount:    solAmountQuery,
		TokenAmount:  tokenAmountStr,
		Price:        priceStr,
	}
	response.Success(c, res)
}
