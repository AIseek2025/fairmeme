package handler

import (
	"github.com/fair-meme/fairmeme/apps/api/internal/cache"
	"github.com/fair-meme/fairmeme/apps/api/internal/dao"
	"github.com/fair-meme/fairmeme/apps/api/internal/ecode"
	"github.com/fair-meme/fairmeme/apps/api/internal/model"
	"github.com/fair-meme/fairmeme/apps/api/internal/types"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/copier"
	"github.com/zhufuyi/sponge/pkg/ggorm/query"
	"github.com/zhufuyi/sponge/pkg/gin/middleware"
	"github.com/zhufuyi/sponge/pkg/gin/response"
	"github.com/zhufuyi/sponge/pkg/logger"
)

var _ CommentHandler = (*commentHandler)(nil)

// CommentHandler defining the handler interface
type CommentHandler interface {
	Create(c *gin.Context)
	List(c *gin.Context)
}

type commentHandler struct {
	iDao dao.CommentDao
}

// NewCommentHandler creating the handler interface
func NewCommentHandler() CommentHandler {
	return &commentHandler{
		iDao: dao.NewCommentDao(
			model.GetDB(),
			cache.NewCommentCache(model.GetCacheType()),
		),
	}
}

// Create a record
// @Summary create comment
// @Description submit information to create comment
// @Tags comment
// @accept json
// @Produce json
// @Param data body types.CreateCommentRequest true "comment information"
// @Success 200 {object} types.CreateCommentRespond{}
// @Router /api/v1/comment [post]
// @Security BearerAuth
func (h *commentHandler) Create(c *gin.Context) {
	form := &types.CreateCommentRequest{}
	err := c.ShouldBindJSON(form)
	if err != nil {
		logger.Warn("ShouldBindJSON error: ", logger.Err(err), middleware.GCtxRequestIDField(c))
		response.Error(c, ecode.InvalidParams)
		return
	}

	commentContent := map[string]interface{}{
		"images": form.Images,
		"text":   form.Text,
	}
	var commentContentBytes []byte
	commentContentBytes, err = json.Marshal(commentContent)
	comment := &model.Comment{
		TokenAddress:   form.TokenAddress,
		CreatorAddress: form.CreatorAddress,
		CommentContent: commentContentBytes,
	}
	if err != nil {
		response.Error(c, ecode.ErrCreateComment)
		return
	}
	// Note: if copier.Copy cannot assign a value to a field, add it here

	ctx := middleware.WrapCtx(c)
	err = h.iDao.Create(ctx, comment)
	if err != nil {
		logger.Error("Create error", logger.Err(err), logger.Any("form", form), middleware.GCtxRequestIDField(c))
		response.Output(c, ecode.InternalServerError.ToHTTPCode())
		return
	}

	response.Success(c, gin.H{"id": comment.ID})
}

// List of records by query parameters
// @Summary list of comments by query parameters
// @Description list of comments by paging and conditions
// @Tags comment
// @accept json
// @Produce json
// @Param data body types.Params true "query parameters"
// @Success 200 {object} types.ListCommentsRespond{}
// @Router /api/v1/comment/list [post]
// @Security BearerAuth
func (h *commentHandler) List(c *gin.Context) {
	rawForm := &types.ListCommentsRawRequest{}
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
	var (
		comments []*model.Comment
		total    int64
	)
	comments, total, err = h.iDao.GetByColumns(ctx, &form.Params)
	if err != nil {
		logger.Error("GetByColumns error", logger.Err(err), logger.Any("form", form), middleware.GCtxRequestIDField(c))
		response.Output(c, ecode.InternalServerError.ToHTTPCode())
		return
	}
	var data []*types.CommentObjDetail
	data, err = convertComments(comments)

	if err != nil {
		response.Error(c, ecode.ErrListComment)
		return
	}
	response.Success(c, gin.H{
		"items": data,
		"total": total,
		"page":  form.Page,
		"limit": form.Limit,
	})
}

func convertComment(comment *model.Comment) (*types.CommentObjDetail, error) {
	data := &types.CommentObjDetail{}
	err := copier.Copy(data, comment)
	if err != nil {
		return nil, err
	}
	// Note: if copier.Copy cannot assign a value to a field, add it here

	return data, nil
}

func convertComments(fromValues []*model.Comment) ([]*types.CommentObjDetail, error) {
	toValues := []*types.CommentObjDetail{}
	for _, v := range fromValues {
		data, err := convertComment(v)
		if err != nil {
			return nil, err
		}
		toValues = append(toValues, data)
	}

	return toValues, nil
}
