package services

import (
	"fmt"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/ethereum/go-ethereum/common"
	"github.com/fair-meme/fairmeme/apps/listener/common/response"
	"github.com/fair-meme/fairmeme/apps/listener/controllers"
	"github.com/fair-meme/fairmeme/apps/listener/global"
	"github.com/fair-meme/fairmeme/apps/listener/models"
	"github.com/fair-meme/fairmeme/apps/listener/utils"
	"github.com/gin-gonic/gin"
	"math/rand"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

func FuncTest(c *gin.Context) {
	controllers.FuncTest()
	response.Success(c, "success")
}
func GetTokenPriceListByMarketAddress(c *gin.Context) {

	marketAddress := common.HexToAddress(c.Query("marketAddress"))
	if common.HexToAddress("0") == marketAddress {
		response.Fail(c, 1, "params error")
		return
	}
	res, err := controllers.GetTokenPriceListByMarketAddress(marketAddress.Hex())
	if err != nil {
		response.Fail(c, 1, err.Error())
		return
	}
	response.Success(c, res)
}
func GetTokenInfoList(c *gin.Context) {

	limit, err := strconv.Atoi(c.Query("limit"))
	if err != nil {
		response.Fail(c, 1, "param limit error")
		return
	}
	offset, err := strconv.Atoi(c.Query("offset"))
	if err != nil {
		response.Fail(c, 1, "param offset error")
		return
	}
	keyword := c.Query("keyword")
	chainId := c.Query("chainId")
	res, err := controllers.GetTokenInfoList(limit, offset, keyword, chainId)
	if err != nil {
		response.Fail(c, 1, err.Error())
		return
	}
	response.Success(c, res)
}
func Getsymbols(c *gin.Context) {

	symbols := c.Query("symbol")

	res, err := controllers.GetTokenSymbols(symbols)
	if err != nil {
		response.Fail(c, 1, err.Error())
		return
	}
	c.JSON(http.StatusOK, res)
}
func Getsearch(c *gin.Context) {

	limit, err := strconv.Atoi(c.Query("limit"))
	if err != nil {
		response.Fail(c, 1, "param limit error")
		return
	}
	keyword := c.Query("query")

	res, err := controllers.GetTokenLisRaw(limit, keyword)
	if err != nil {
		response.Fail(c, 1, err.Error())
		return
	}
	c.JSON(http.StatusOK, res)
}
func GetTokenList(c *gin.Context) {

	limit, err := strconv.Atoi(c.Query("limit"))
	if err != nil {
		response.Fail(c, 1, "param limit error")
		return
	}
	offset, err := strconv.Atoi(c.Query("offset"))
	if err != nil {
		response.Fail(c, 1, "param offset error")
		return
	}
	keyword := c.Query("keyword")
	chainId := c.Query("chainId")
	res, err := controllers.GetTokenList(limit, offset, keyword, chainId)
	if err != nil {
		response.Fail(c, 1, err.Error())
		return
	}
	response.Success(c, res)
}

func GetBefore24HoursPriceAndCurrentPrice(c *gin.Context) {

	marketAddress := common.HexToAddress(c.Query("marketAddress"))
	tokenName := c.Query("tokenName")
	if common.HexToAddress("0") == marketAddress {
		response.Fail(c, 1, "params error")
		return
	}
	res, err := controllers.GetBefore24HoursPriceAndCurrentPrice(tokenName, marketAddress.Hex())
	if err != nil {
		response.Fail(c, 1, err.Error())
		return
	}
	response.Success(c, res)
}
func GetCurrentPrice(c *gin.Context) {

	marketAddress := common.HexToAddress(c.Query("marketAddress"))
	toeknName := c.Query("tokenName")
	if common.HexToAddress("0") == marketAddress {
		response.Fail(c, 1, "params error")
		return
	}
	res, err := controllers.GetCurrentPrice(toeknName, marketAddress.Hex())
	if err != nil {
		response.Fail(c, 1, err.Error())
		return
	}
	response.Success(c, res)
}

func AddFollow(c *gin.Context) {
	address := common.HexToAddress(c.Query("address"))
	tokenAddress := common.HexToAddress(c.Query("tokenAddress"))
	if common.HexToAddress("0") == tokenAddress || common.HexToAddress("0") == address {
		response.Fail(c, 1, "params error")
		return
	}
	err := controllers.AddFollow(address.Hex(), tokenAddress.Hex())
	if err != nil {
		response.Fail(c, 1, err.Error())
		return
	}
	res := make(map[string]interface{})
	res["success"] = "ok"
	response.Success(c, res)
}
func RemoveFollow(c *gin.Context) {
	address := common.HexToAddress(c.Query("address"))
	tokenAddress := common.HexToAddress(c.Query("tokenAddress"))
	if common.HexToAddress("0") == tokenAddress || common.HexToAddress("0") == address {
		response.Fail(c, 1, "params error")
		return
	}
	err := controllers.RemoveFollow(address.Hex(), tokenAddress.Hex())
	if err != nil {
		response.Fail(c, 1, err.Error())
		return
	}
	res := make(map[string]interface{})
	res["success"] = "ok"
	response.Success(c, res)
}
func GetFollow(c *gin.Context) {
	address := common.HexToAddress(c.Query("address"))
	if common.HexToAddress("0") == address {
		response.Fail(c, 1, "params error")
		return
	}
	res, err := controllers.GetFollow(address.Hex())
	if err != nil {
		response.Fail(c, 1, err.Error())
		return
	}
	response.Success(c, res)
}

func AddView(c *gin.Context) {
	address := common.HexToAddress(c.Query("address"))
	tokenAddress := common.HexToAddress(c.Query("tokenAddress"))
	if common.HexToAddress("0") == tokenAddress || common.HexToAddress("0") == address {
		response.Fail(c, 1, "params error")
		return
	}
	err := controllers.AddView(address.Hex(), tokenAddress.Hex())
	if err != nil {
		response.Fail(c, 1, err.Error())
		return
	}
	res := make(map[string]interface{})
	res["success"] = "ok"
	response.Success(c, res)
}

func UploadFile(c *gin.Context) {
	fileType := c.Param("fileType") // 获取 URL 中的 fileType 参数

	// 获取上传的文件
	file, err := c.FormFile("file")
	if err != nil {
		response.Fail(c, 1, "get upload file err:"+err.Error())
		return
	}
	// 打开文件
	fileObj, err := file.Open()
	if err != nil {

		response.Fail(c, 1, "Open file err:"+err.Error())
		return
	}
	defer fileObj.Close()

	originFileName := file.Filename
	originFileType := strings.ToLower(filepath.Ext(originFileName)) // 获取文件扩展名

	// 生成 UUID 类型的文件名
	rand.Seed(time.Now().UnixNano())
	ossFileName := fmt.Sprintf("%d%s", rand.Int63(), originFileType)
	// 上传文件到 S3
	_, err = global.App.S3Server.PutObject(&s3.PutObjectInput{
		Bucket:      aws.String(global.App.Config.AwsS3.BucketName), // 替换为你的 S3 存储桶名称
		Key:         aws.String(ossFileName),                        // 文件在 S3 中的名称
		Body:        fileObj,
		ContentType: &fileType,
	})
	if err != nil {
		response.Fail(c, 1, "upload file to s3 err:"+err.Error())
		return
	}

	// 返回文件访问 URL
	fileURL := fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", global.App.Config.AwsS3.BucketName, strings.ToLower(global.App.Config.AwsS3.Region), ossFileName)
	//c.String(http.StatusOK, fmt.Sprintf("文件上传成功，访问 URL: %s", fileURL))
	//// 返回文件访问路径
	res := make(map[string]interface{})
	res["fileUrl"] = fileURL
	response.Success(c, res)
}

// ResponseData 定义了 API 响应的数据结构
type ResponseData struct {
	SupportedResolutions   []string `json:"supported_resolutions"`
	SupportsGroupRequest   bool     `json:"supports_group_request"`
	SupportsMarks          bool     `json:"supports_marks"`
	SupportsSearch         bool     `json:"supports_search"`
	SupportsTimescaleMarks bool     `json:"supports_timescale_marks"`
}

func GetConfig(c *gin.Context) {
	responseData := ResponseData{
		SupportedResolutions:   []string{"1", "5", "15", "30", "60", "1D", "1W", "1M"},
		SupportsGroupRequest:   false,
		SupportsMarks:          false,
		SupportsSearch:         true,
		SupportsTimescaleMarks: false,
	}
	c.JSON(http.StatusOK, responseData)

}

func GetKlineByMinutesRaw(c *gin.Context) {

	tokenAddress := c.Query("tokenAddress")
	tokenName := c.Query("symbol")
	startsTime := c.Query("from")
	endsTime := c.Query("to")
	resolution := c.Query("resolution")
	limits := c.Query("countback")
	limit, _ := strconv.ParseInt(limits, 10, 64)
	startTime, _ := strconv.ParseInt(startsTime, 10, 64)
	endTime, _ := strconv.ParseInt(endsTime, 10, 64)
	//resolution, _ := strconv.ParseInt(resolutions, 10, 64)
	//if common.HexToAddress("0") == marketAddress {
	//	response.Fail(c, 1, "params error")
	//	return
	//}
	res, err := controllers.GetKlineByMinutesRaw(tokenName, tokenAddress, startTime, endTime, limit, resolution)
	if err != nil {
		response.Fail(c, 1, err.Error())
		return
	}
	c.JSON(http.StatusOK, res)
}

func GetKlineByMinutes(c *gin.Context) {

	tokenAddress := c.Query("tokenAddress")
	tokenName := c.Query("tokenName")
	startsTime := c.Query("startTime")
	startTime, _ := strconv.ParseInt(startsTime, 10, 64)
	//if common.HexToAddress("0") == marketAddress {
	//	response.Fail(c, 1, "params error")
	//	return
	//}
	res, err := controllers.GetKlineByMinutes(tokenName, tokenAddress, startTime)
	if err != nil {
		response.Fail(c, 1, err.Error())
		return
	}
	response.Success(c, res)
}

// 订阅k线
func SubscribeKline(c *gin.Context) {
	// 读取查询参数
	param := c.Query("tokenAddress") // 假设你有一个名为param的查询参数

	// 保存conn到map中，方便后续推送数据
	//connections[param] = conn
	conn, err := utils.Upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not upgrade WebSocket"})
		return
	}
	defer conn.Close()

	// 订阅币种K线数据
	stopChan := make(chan bool)
	go models.SubscribeKlines(param, conn, stopChan)

	// 接收客户端消息的循环
	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			break
		}
	}

	// 发送停止信号
	close(stopChan)
}

func CreateSolTokenBasics(c *gin.Context) {
	var solTokenBasic models.SolTokenBasic
	c.Bind(&solTokenBasic)
	err := controllers.CreateSolTokenBasic(solTokenBasic)
	if err != nil {
		response.Fail(c, 1, err.Error())
		return
	}
	res := make(map[string]interface{})
	res["success"] = "ok"
	response.Success(c, res)
}
func GetKlinePrice(c *gin.Context) {

	tokenAddress := c.Query("tokenAddress")
	tokenName := c.Query("symbol")
	startsTime := c.Query("from")
	//endsTime := c.Query("to")
	resolutions := c.Query("resolution")
	startTime, _ := strconv.ParseInt(startsTime, 10, 64)
	resolution, _ := strconv.ParseInt(resolutions, 10, 64)
	//if common.HexToAddress("0") == marketAddress {
	//	response.Fail(c, 1, "params error")
	//	return
	//}
	from := utils.CalculateTimestampForHoursAgo(startTime, 4, resolution)
	res, err := controllers.QueryPriceByHour(tokenName, tokenAddress, from, resolution)
	if err != nil {
		response.Fail(c, 1, err.Error())
		return
	}
	c.JSON(http.StatusOK, res)
}
