package models

import (
	"errors"
	"fmt"
	"github.com/fair-meme/fairmeme/apps/listener/global"
	"golang.org/x/net/context"
	"gorm.io/gorm"
	"time"
)

// 间隔10s
const TimeStep = 10
const TimeStepSol = 0.4

type Token struct {
	Id int `json:"id"`
	//HolderAddress            string  `json:"holder_address"`
	//HolderAddressTolowercase string  `json:"holder_address_tolowercase"`
	TokenChainid            string    `json:"token_chainid"`
	TokenAddress            string    `json:"token_address"`
	TokenAddressTolowercase string    `json:"token_address_tolowercase"`
	MarketAddress           string    `json:"market_address"`
	TxHash                  string    `json:"tx_hash"`
	TokenTotal              float32   `json:"token_total"`
	TokenName               string    `json:"token_name"`
	TokenTicker             string    `json:"token_ticker"`
	TokenDesc               string    `json:"token_desc"`
	TokenLogo               string    `json:"token_logo"`
	TokenAdvicePr           float32   `json:"token_advice_pr"`
	TokenInitPrice          float32   `json:"token_init_price"`
	TokenDevPerc            float32   `json:"token_dev_perc"`
	TokenAirdropSt          int       `json:"token_airdrop_st"`
	AuctionDays             int       `json:"auction_days"`
	WebsiteUrl              string    `json:"website_url"`
	TelegramUrl             string    `json:"telegram_url"`
	TwitterUrl              string    `json:"twitter_url"`
	DiscordUrl              string    `json:"discord_url"`
	Status                  int       `json:"status"`
	CreatedTime             time.Time `json:"created_time"`
	ModifyTime              time.Time `json:"modify_time"`
}

func CreateTokenTable() error {
	if err := global.App.MysqlDb.AutoMigrate(&Token{}); err != nil {
		return err
	}
	return nil
}

func GetTokenList() ([]Token, error) {
	var tokens []Token
	err := global.App.MysqlDb.Debug().Find(&tokens).Error
	if err != nil {
		return nil, err
	}
	return tokens, nil
}
func GetTokenListByOffsetAndLimit(limit, offset int, keyword string, chainId string) ([]Token, int64, error) {
	var tokens []Token
	var total int64
	db := global.App.MysqlDb.Model(Token{})
	if len(chainId) > 0 {
		db.Where("token_chainid = ?", chainId)
	}
	if len(keyword) > 0 {
		db = db.Where("token_name LIKE ? OR token_address LIKE ? OR market_address LIKE ?", "%"+keyword+"%", "%"+keyword+"%", "%"+keyword+"%")
	}
	db.Count(&total)
	err := db.Limit(limit).Offset(offset).Find(&tokens).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, 0, err
	}
	return tokens, total, nil
}

type TokenInfo struct {
	Symbol       string   `json:"symbol"`
	FullName     string   `json:"full_name"`
	Description  string   `json:"description"`
	Exchange     string   `json:"exchange"`
	Type         string   `json:"type"`
	LogoURLs     []string `json:"logo_urls"`
	ExchangeLogo string   `json:"exchange_logo"`
}

func GetTokenListByOffsetAndLimitRaw(limit int, keyword string) ([]TokenInfo, int64, error) {
	var tokens []SolToken
	var total int64
	db := global.App.MysqlDb.Model(SolToken{})

	if len(keyword) > 0 {
		db = db.Where("token_name LIKE ?", "%"+keyword+"%")
	}
	db.Count(&total)
	err := db.Limit(limit).Find(&tokens).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, 0, err
	}
	// 将Token切片转换为TokenInfo切片
	var tokenInfos []TokenInfo
	for _, token := range tokens {
		tokenInfo := TokenInfo{
			Symbol:       token.TokenName,
			FullName:     token.TokenName, // 假设FullName与Symbol相同，根据实际情况调整
			Description:  token.TokenName, // 根据实际情况填充
			Exchange:     "",              // 根据实际情况填充
			Type:         "",              // 根据实际情况填充
			LogoURLs:     []string{},      // 根据实际情况填充
			ExchangeLogo: token.TokenLogo, // 根据实际情况填充
		}
		tokenInfos = append(tokenInfos, tokenInfo)
	}
	return tokenInfos, total, nil
}

func GetTokenSymbolss(keyword string) ([]Token, error) {
	var tokens []Token

	db := global.App.MysqlDb.Model(Token{})

	if len(keyword) > 0 {
		db = db.Where("token_name = ?", "%"+keyword+"%")
	}

	err := db.Find(&tokens).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}
	return tokens, nil
}

// StockInfo 结构体用于匹配最终的JSON响应格式
type StockInfo struct {
	Symbol         string  `json:"symbol"`
	Description    string  `json:"description"`
	ExchangeListed string  `json:"exchange-listed"`
	ExchangeTraded string  `json:"exchange-traded"`
	MinMovement    float64 `json:"minmovement"`
	MinMovement2   float64 `json:"minmovement2"`
	PriceScale     int     `json:"pricescale"`
	HasDWM         bool    `json:"has-dwm"`
	HasIntraday    bool    `json:"has-intraday"`
	Type           string  `json:"type"`
	Ticker         string  `json:"ticker"`
	Name           string  `json:"name"`
	Timezone       string  `json:"timezone"`
	SessionRegular string  `json:"session-regular"`
}

// StockInfo 结构体用于匹配最终的JSON响应格式
type StockInfos struct {
	Symbol         []string `json:"symbol"`
	Description    []string `json:"description"`
	ExchangeListed string   `json:"exchange-listed"`
	ExchangeTraded string   `json:"exchange-traded"`
	MinMovement    int      `json:"minmovement"`
	MinMovement2   int      `json:"minmovement2"`
	PriceScale     []int    `json:"pricescale"`
	HasDWM         bool     `json:"has-dwm"`
	HasIntraday    bool     `json:"has-intraday"`
	Type           []string `json:"type"`
	Ticker         []string `json:"ticker"`
	Name           []string `json:"name"`
	Timezone       string   `json:"timezone"`
	SessionRegular string   `json:"session-regular"`
}

func GetTokenSymbols(keyword string) (StockInfo, error) {
	var token SolToken // 只需要一个Token对象

	db := global.App.MysqlDb.Model(&SolToken{})

	if len(keyword) > 0 {
		db = db.Where("token_name = ?", keyword)
	}

	// 修复：确保查询结果填充到token变量中
	err := db.First(&token).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// 没有找到记录，返回零值和nil错误
			return StockInfo{}, nil
		} else {
			// 发生其他错误，返回错误
			return StockInfo{}, err
		}
	}

	// 创建并返回StockInfo对象
	return StockInfo{
		Symbol:         token.TokenName,
		Description:    token.TokenName, // 这里假设Description和Symbol相同，根据实际需求调整
		Name:           token.TokenName, // Name字段赋值
		Ticker:         string(token.Id),
		ExchangeListed: "FAIR",
		ExchangeTraded: "FAIR",
		MinMovement:    0.000001,
		MinMovement2:   0.000001,
		PriceScale:     10000,
		HasDWM:         true,
		HasIntraday:    true,
		Type:           "stock",
		Timezone:       "America/New_York",
		SessionRegular: "0000-2400",
		// 其他字段赋值...
	}, nil
}
func GetTokenSymbolsc(keyword string) (StockInfo, error) {
	var token SolToken // 只需要一个Token对象

	db := global.App.MysqlDb.Model(&SolToken{})

	if len(keyword) > 0 {
		db = db.Where("token_name = ?", keyword)
	}

	err := db.First(&SolToken{}).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// 没有找到记录，返回错误
			return StockInfo{}, err
		} else {
			// 发生其他错误，返回错误
			return StockInfo{}, err
		}
	}

	// 创建并返回StockInfo对象
	return StockInfo{
		Symbol:         token.TokenName,
		Description:    token.TokenName,
		ExchangeListed: "NYSE",
		ExchangeTraded: "NYSE",
		MinMovement:    1,
		MinMovement2:   0,
		HasDWM:         true,
		HasIntraday:    true,
		Type:           "stock",
		Name:           token.TokenName,
		Ticker:         token.TokenTicker,
		Timezone:       "America/New_York",
		SessionRegular: "0900-1600",
		// 其他字段赋值...
	}, nil
}
func GetTokenSymbolsb(keyword string) ([]StockInfos, error) {
	var tokens []Token
	var stocks []StockInfos

	db := global.App.MysqlDb.Model(&Token{})

	if len(keyword) > 0 {
		db = db.Where("token_name = ?", keyword)
	}

	err := db.Limit(1).Find(&tokens).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}
	// 检查是否找到了至少一条记录
	if len(tokens) > 0 {
		token := tokens[0] // 取第一条记录
		stock := StockInfos{
			Symbol:         []string{token.TokenName},
			Description:    []string{token.TokenDesc},
			ExchangeListed: "NYSE",
			ExchangeTraded: "NYSE",
			MinMovement:    1,
			MinMovement2:   0,
			HasDWM:         true,
			HasIntraday:    true,
			Ticker:         []string{token.TokenName},
			Timezone:       "America/New_York",
			SessionRegular: "0900-1600",
			// 其他字段赋值...
		}
		stocks = append(stocks, stock)
	}
	// 假设Token结构体中有字段对应股票代码、最小价格变动和描述
	//for _, token := range tokens {
	//	stock := StockInfo{
	//		Symbol: []string{token.TokenName}, // 假设TokenName是股票代码
	//		//MinPriceMove:  token.MinPriceMove,         // 假设有这个字段
	//		Description:    []string{token.TokenDesc}, // 假设有这个字段
	//		ExchangeListed: "NYSE",
	//		ExchangeTraded: "NYSE",
	//		MinMovement:    1,
	//		MinMovement2:   0,
	//		//PriceScale:     []int{1, 1, 100},
	//		HasDWM:      true,
	//		HasIntraday: true,
	//		//Type:           []string{"stock", "stock", "index"},
	//		Ticker:         []string{token.TokenName},
	//		Timezone:       "America/New_York",
	//		SessionRegular: "0900-1600",
	//	}
	//	stocks = append(stocks, stock)
	//}

	return stocks, nil
}

type TokenPrice struct {
	Id            uint64 `json:"id"`
	MarketAddress string `json:"market_address"`
	Price         string `json:"price"`
	Timestamp     int64  `json:"timestamp"`
}
type Price struct {
	Id        uint64  `json:"id"`
	Price     string  `json:"price"`
	Timestamp int64   `json:"timestamp"`
	StartId1  *uint64 `json:"start_id1" gorm:"type:bigint;default:null"`
	StartId5  *uint64 `json:"start_id5" gorm:"type:bigint;default:null"`
	StartId60 *uint64 `json:"start_id60" gorm:"type:bigint;default:null"`
	HighId1   *uint64 `json:"high_id1" gorm:"type:bigint;default:null"`
	HighId5   *uint64 `json:"high_id5" gorm:"type:bigint;default:null"`
	HighId60  *uint64 `json:"high_id60" gorm:"type:bigint;default:null"`
	LowId1    *uint64 `json:"low_id1" gorm:"type:bigint;default:null"`
	LowId5    *uint64 `json:"low_id5" gorm:"type:bigint;default:null"`
	LowId60   *uint64 `json:"low_id60" gorm:"type:bigint;default:null"`
	CloseId1  *uint64 `json:"close_id1" gorm:"type:bigint;default:null"`
	CloseId5  *uint64 `json:"close_id5" gorm:"type:bigint;default:null"`
	CloseId60 *uint64 `json:"close_id60" gorm:"type:bigint;default:null"`
}

func getPriceTableName(tokenName, markerAddress string) string {
	return "fairmeme_" + tokenName + "_" + markerAddress[2:8]
}
func getPriceTable(tableName string) *gorm.DB {
	return global.App.MysqlDb.Table(tableName)
}
func CreatePriceTable(tokenName, markerAddress string) error {
	fmt.Println("tableName:", tokenName)
	fmt.Println("markerAddress:", markerAddress)
	tableName := getPriceTableName(tokenName, markerAddress)
	sql := fmt.Sprintf(" CREATE TABLE %s ( id bigint unsigned AUTO_INCREMENT, price longtext,timestamp bigint,start_id1 BIGINT UNSIGNED DEFAULT NULL,start_id5 BIGINT UNSIGNED DEFAULT NULL,start_id60 BIGINT UNSIGNED DEFAULT NULL,high_id1  BIGINT UNSIGNED DEFAULT NULL,high_id5  BIGINT UNSIGNED DEFAULT NULL,high_id60 BIGINT UNSIGNED DEFAULT NULL,low_id1   BIGINT UNSIGNED DEFAULT NULL,low_id5   BIGINT UNSIGNED DEFAULT NULL,low_id60  BIGINT UNSIGNED DEFAULT NULL,close_id1 BIGINT UNSIGNED DEFAULT NULL,close_id5 BIGINT UNSIGNED DEFAULT NULL,close_id60 BIGINT UNSIGNED DEFAULT NULL,PRIMARY KEY (id))", tableName)
	if err := global.App.MysqlDb.Exec(sql).Error; err != nil {
		return err
	}
	return nil
}
func CheckPriceTable(tokenName, markerAddress string) (bool, error) {
	tableName := getPriceTableName(tokenName, markerAddress)
	sql := fmt.Sprintf("show tables LIKE '%s'", tableName)
	count := 0
	if err := global.App.MysqlDb.Raw(sql).Scan(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}
func CreatePrice(tokenName, markerAddress string, price Price) error {
	tableName := getPriceTableName(tokenName, markerAddress)
	if err := getPriceTable(tableName).Create(&price).Error; err != nil {
		return err
	}
	return nil
}
func GetLatestPrice(tokenName, marketAddress string) (*Price, error) {
	var price Price
	tableName := getPriceTableName(tokenName, marketAddress)
	if err := getPriceTable(tableName).Order("id desc").First(&price).Error; err != nil {
		return nil, errors.New("GetLatestPrice err:" + err.Error())

	}
	return &price, nil
}

func GetBeforePriceByHours(currentId uint64, tokenName, marketAddress string, hour int64) (*Price, error) {
	var price Price
	var beforeId uint64
	if currentId-uint64(hour)*uint64(time.Hour)/TimeStep >= currentId {
		beforeId = 1
	} else {
		beforeId = currentId - uint64(hour)*uint64(time.Hour)/TimeStep
	}
	tableName := getPriceTableName(tokenName, marketAddress)
	if err := getPriceTable(tableName).Where("id = ?", beforeId).Find(&price).Error; err != nil { //Order("id desc").Limit(1)

		return nil, err

	}
	return &price, nil
}

func GetPriceListByMarketAddress(tokenName, marketAddress string, kLineType int) ([]Price, error) {

	//0 6条一组
	step := 6
	if kLineType == 1 {
		step = 30
	}
	if kLineType == 2 {
		step = 360
	}
	//
	lastPrice, err := GetLatestPrice(tokenName, marketAddress)
	if err != nil {
		return nil, err
	}
	//fmt.Println(lastPrice)
	//fmt.Println(step)
	//获取到当前
	curretId := lastPrice.Id
	beforeId := curretId - uint64(step*100)
	if beforeId < 0 {
		beforeId = 0
	}
	var prices []Price
	tableName := getPriceTableName(tokenName, marketAddress)
	if err = getPriceTable(tableName).Order("id desc").Limit(int(curretId - beforeId)).Find(&prices).Error; err != nil {
		return nil, err
	}
	return prices, nil
}
func ChoosePrice(prices []Price) {

	//ch := make(chan []Price, len(prices))
}

func GetTokenPriceListByMarketAddress(marketAddress string) ([]TokenPrice, error) {
	//, mode int
	//0 6条一组
	//step := 6
	//if mode == 1 {
	//	step = 30
	//}
	//if mode == 2 {
	//	step = 360
	//}
	//
	//lastPrice, err := GetLatestPrice(marketAddress)
	//if err != nil {
	//	return nil, err
	//}
	//fmt.Println(lastPrice)
	//fmt.Println(step)
	////获取到当前
	//curretId:=lastPrice.Id
	//if
	//beforeId:=curretId-step*400
	//if beforeId<0{
	//	beforeId=0
	//}
	var tokenPrices []TokenPrice
	if err := global.App.MysqlDb.Where("market_address = ?", marketAddress).Find(&tokenPrices).Error; err != nil {
		return nil, err
	}
	return tokenPrices, nil
}

// AddPriceRecord 向Redis添加价格记录
func CreateRedisPrice(tokenAddress string, priceStr string, timestamp int64) error {
	var ctx = context.Background()
	//每分钟key
	key := fmt.Sprintf("price_sol:%s:%d", tokenAddress, timestamp)
	priceRecord := fmt.Sprintf(`{"price": "%s", "timestamp": %d}`, priceStr, timestamp)

	// 检查键是否存在
	exists, err := global.App.RedisClient.Exists(ctx, key).Result()
	if err != nil {
		return err
	}

	if exists == 0 {
		// 键不存在，使用LPUSH来插入新记录，并设置键的过期时间为1分钟（60秒）
		_, err = global.App.RedisClient.LPush(ctx, key, priceRecord).Result()
		if err != nil {
			return err
		}
		_, err = global.App.RedisClient.Expire(ctx, key, 1800*time.Second).Result() // 设置过期时间
	} else {
		// 键已存在，使用RPUSH来追加新记录
		_, err = global.App.RedisClient.RPush(ctx, key, priceRecord).Result()
	}

	return err
}

// AddPriceRecord 向Redis添加价格更新记录
func CreateRedisUpdatePrice(tokenName, tokenAddress string, priceStr string, timestamp int64) error {
	var ctx = context.Background()
	//每分钟key
	key := fmt.Sprintf("update_sol:%s:%d", tokenAddress, timestamp)
	priceRecord := fmt.Sprintf(`{"price": "%s", "timestamp": %d}`, priceStr, timestamp)

	// 检查键是否存在
	exists, err := global.App.RedisClient.Exists(ctx, key).Result()
	if err != nil {
		return err
	}

	if exists == 0 {
		// 键不存在，使用LPUSH来插入新记录，并设置键的过期时间为1分钟（60秒）
		_, err = global.App.RedisClient.LPush(ctx, key, priceRecord).Result()
		if err != nil {
			return err
		}
		_, err = global.App.RedisClient.Expire(ctx, key, 600*time.Second).Result() // 设置过期时间
	} else {
		// 键已存在，使用RPUSH来追加新记录
		_, err = global.App.RedisClient.RPush(ctx, key, priceRecord).Result()
	}

	return err
}
