package models

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/fair-meme/fairmeme/apps/listener/global"
	"github.com/gorilla/websocket"
	"log"
	"math/big"
	"sort"
	"strconv"
	"strings"
	"time"
)

type History struct {
	Id        int64   `json:"id"`
	Address   string  `json:"address"`
	Name      string  `json:"name"`
	Open      float64 `json:"open"`
	Close     float64 `json:"close"`
	High      float64 `json:"high"`
	Low       float64 `json:"low"`
	Volume    float64 `json:"volume"`
	Timestamp string  `json:"timestamp"`
	TokenId   int64   `json:"tokenid"`
	SortKey   int64   `json:"sortkey"`
}

//	type KLineData struct {
//		Timestamp string  `ch:"timestamp"`
//		Name      string  `ch:"name"`
//		Open      float64 `ch:"open"`
//		Close     float64 `ch:"close"`
//		High      float64 `ch:"highs"`
//		Low       float64 `ch:"lows"`
//	}
//
// PriceRange 结构体用于表示价格范围
type PriceRange struct {
	StartPrice, MinPrice, MaxPrice, EndPrice float64
}

// PriceRange 结构体用于表示价格范围
type UpdatePriceRange struct {
	StartPrice, MinPrice, MaxPrice, EndPrice float64
}
type KLineDataWeb struct {
	Timestamp  int64     `ch:"timestamp" json:"timestamp"`
	Minutetamp time.Time `ch:"timestamp" json:"timestamp"`
	Address    string    `ch:"address" json:"address"`
	Id         string    `ch:"id" json:"id"`
	Name       string    `ch:"name" json:"name"` // 使用 json 标签来控制 JSON 字段名称
	Open       float64   `ch:"open" json:"open"`
	Close      float64   `ch:"close" json:"close"`
	High       float64   `ch:"highs" json:"high"`
	Low        float64   `ch:"lows" json:"low"`
	Volume     float64   `ch:"volume" json:"volume"`
}

// 获取基本信息
func GetInfo(marketAddress string) map[string]interface{} {

	//从数据库中获取
	token := make(map[string]interface{})
	global.App.MysqlDb.Raw("SELECT * FROM `fairmeme_token` WHERE address = ?", marketAddress).Debug().Scan(&token)
	if token != nil {
		return token
	}
	return nil
}

// PriceRecord 表示存储在Redis中的价格记录
type PriceRecord struct {
	Price     float64 `json:"price"`
	Timestamp int64   `json:"timestamp"`
}

// MinutePriceStats 表示每分钟的价格统计信息
type MinutePriceStats struct {
	MinuteKey  int64   `json:"minute_key"`
	StartPrice float64 `json:"start_price"`
	EndPrice   float64 `json:"end_price"`
	MinPrice   float64 `json:"min_price"`
	MaxPrice   float64 `json:"max_price"`
}

func CalculatePriceRangeCorrect(tokenAddress string) ([]MinutePriceStats, error) {
	ctx := context.Background()
	client := global.App.RedisClient // 确保你有正确初始化的Redis客户端
	pattern := fmt.Sprintf("update_sol:%s:*", tokenAddress)
	var cursor uint64
	var statsMap = make(map[int64][]PriceRecord) // 使用map存储每分钟的价格记录

	// 使用Scan命令迭代键
	for {
		var keys []string
		keys, newCursor, err := global.App.RedisClient.Scan(ctx, cursor, pattern, 20).Result()
		//cursor, keys, err := client.Scan(ctx, cursor, pattern, 20).Result()
		if err != nil {
			return nil, err
		}
		if len(keys) == 0 {
			break
		}

		for _, key := range keys {
			values, err := client.LRange(ctx, key, 0, -1).Result()
			if err != nil {
				return nil, err
			}

			minuteKey, err := strconv.ParseInt(strings.Split(key, ":")[2], 10, 64)
			if err != nil {
				continue // 如果分钟键解析失败，则跳过
			}

			// 解析价格记录并存储到map中
			for _, value := range values {
				var record PriceRecord
				if err := json.Unmarshal([]byte(value), &record); err != nil {
					continue // 如果JSON解析失败，则跳过
				}
				statsMap[minuteKey] = append(statsMap[minuteKey], record)
			}
		}
		cursor = newCursor // 准备下一次迭代
	}

	// 转换map为MinutePriceStats切片
	var statsList []MinutePriceStats
	for minuteKey, records := range statsMap {
		if len(records) == 0 {
			continue
		}

		// 按价格排序，找到最小和最大价格
		sort.Slice(records, func(i, j int) bool {
			return records[i].Price < records[j].Price
		})

		statsList = append(statsList, MinutePriceStats{
			MinuteKey:  minuteKey,
			StartPrice: records[0].Price,              // 列表的第一个价格
			EndPrice:   records[len(records)-1].Price, // 列表的最后一个价格
			MinPrice:   records[0].Price,
			MaxPrice:   records[len(records)-1].Price,
		})
	}

	// 按MinuteKey排序
	sort.Slice(statsList, func(i, j int) bool {
		return statsList[i].MinuteKey < statsList[j].MinuteKey
	})

	return statsList, nil
}
func CalculatePriceRangeCorrectBack(tokenName string) (*PriceRange, error) {
	var ctx = context.Background()
	var allPrices []float64
	pattern := fmt.Sprintf("update_sol:%s:*", tokenName)
	cursor := uint64(0) // Redis scan 游标

	// 循环直到游标返回0，表示没有更多元素
	for {
		keys, newCursor, err := global.App.RedisClient.Scan(ctx, cursor, pattern, 20).Result()
		if err != nil {
			return nil, err
		}
		if len(keys) == 0 {
			break // 没有更多键
		}

		// 处理当前游标返回的所有键
		for _, key := range keys {
			prices, err := global.App.RedisClient.LRange(ctx, key, 0, -1).Result()
			if err != nil {
				return nil, err
			}
			for _, priceStr := range prices {
				var priceRecord struct {
					Price     string `json:"price"`
					Timestamp int64  `json:"timestamp"`
				}
				if err := json.Unmarshal([]byte(priceStr), &priceRecord); err != nil {
					continue // JSON 解析出错则跳过
				}
				price, err := strconv.ParseFloat(priceRecord.Price, 64)
				if err != nil {
					continue // 转换价格出错则跳过
				}
				allPrices = append(allPrices, price)
			}
		}

		cursor = newCursor // 准备下一次迭代
	}

	if len(allPrices) == 0 {
		return nil, fmt.Errorf("no price records found for token: %s", tokenName)
	}

	// 计算价格范围
	sort.Float64s(allPrices) // 排序价格列表
	minPrice, maxPrice := allPrices[0], allPrices[len(allPrices)-1]
	// 假设价格列表是按时间顺序存储的
	startPrice, endPrice := allPrices[0], allPrices[len(allPrices)-1]

	// 创建并返回 PriceRange 结构
	return &PriceRange{
		StartPrice: startPrice,
		MinPrice:   minPrice,
		MaxPrice:   maxPrice,
		EndPrice:   endPrice,
	}, nil
}

// 计算价格范围，包括开始价格、最低价格、最高价格和结束价格
func CalculatePriceRangeAdd(tokenName string, timestamp int64) (*PriceRange, error) {
	var ctx = context.Background()
	key := fmt.Sprintf("price_sol:%s:%d", tokenName, timestamp)
	//key := fmt.Sprintf("%s:prices:%d", tokenName, timestamp/60)
	prices, err := global.App.RedisClient.LRange(ctx, key, 0, -1).Result()
	if err != nil {
		return nil, err
	}

	// 如果没有价格记录，返回错误
	if len(prices) == 0 {
		return nil, err //fmt.Errorf("no prices found")
	}
	fmt.Println(prices[0])
	// 解析价格记录
	var priceList []float64
	for _, priceStr := range prices {
		var priceRecord struct {
			Price     string `json:"price"`
			Timestamp int64  `json:"timestamp"`
		}
		err := json.Unmarshal([]byte(priceStr), &priceRecord)
		if err != nil {
			return nil, err
		}
		price, err := strconv.ParseFloat(priceRecord.Price, 64)
		if err != nil {
			return nil, err
		}
		priceList = append(priceList, price)
	}

	// 检查是否有价格记录
	if len(priceList) == 0 {
		return nil, fmt.Errorf("no price records found")
	}

	// 开始价格和结束价格
	startPrice := priceList[0]
	endPrice := priceList[len(priceList)-1]

	// 计算最大最小值
	minPrice := priceList[0]
	maxPrice := priceList[0]
	for _, price := range priceList {
		if price < minPrice {
			minPrice = price
		}
		if price > maxPrice {
			maxPrice = price
		}
	}

	// 创建PriceRange结构体并返回
	priceRange := &PriceRange{
		StartPrice: startPrice,
		MinPrice:   minPrice,
		MaxPrice:   maxPrice,
		EndPrice:   endPrice,
	}
	return priceRange, nil

}

// 计算价格范围，包括开始价格、最低价格、最高价格和结束价格
func CalculatePriceRange(tokenName string, timestamp int64) (float64, float64, float64, float64, error) {
	var ctx = context.Background()
	key := fmt.Sprintf("price_sol:%s:%d", tokenName, timestamp)
	//key := fmt.Sprintf("%s:prices:%d", tokenName, timestamp/60)
	prices, err := global.App.RedisClient.LRange(ctx, key, 0, -1).Result()
	if err != nil {
		return 0, 0, 0, 0, err
	}

	// 如果没有价格记录，返回错误
	if len(prices) == 0 {
		return 0, 0, 0, 0, err //fmt.Errorf("no prices found")
	}
	fmt.Println(prices[0])
	// 解析价格记录
	var priceList []float64
	for _, priceStr := range prices {
		var priceRecord struct {
			Price     string `json:"price"`
			Timestamp int64  `json:"timestamp"`
		}
		err := json.Unmarshal([]byte(priceStr), &priceRecord)
		if err != nil {
			return 0, 0, 0, 0, err
		}
		price, err := strconv.ParseFloat(priceRecord.Price, 64)
		if err != nil {
			return 0, 0, 0, 0, err
		}
		priceList = append(priceList, price)
	}

	// 检查是否有价格记录
	if len(priceList) == 0 {
		return 0, 0, 0, 0, fmt.Errorf("no price records found")
	}

	// 开始价格和结束价格
	startPrice := priceList[0]
	endPrice := priceList[len(priceList)-1]

	// 计算最大最小值
	minPrice := priceList[0]
	maxPrice := priceList[0]
	for _, price := range priceList {
		if price < minPrice {
			minPrice = price
		}
		if price > maxPrice {
			maxPrice = price
		}
	}

	return startPrice, endPrice, minPrice, maxPrice, nil

	// 初始化价格变量
	//firstPrice, _ := strconv.ParseFloat(prices[0], 64) // 列表不为空，直接解析第一个价格
	//minPrice, maxPrice := firstPrice, firstPrice
	//lastPrice := firstPrice // 开始时，假设第一个价格也是最后一个价格
	//
	//// 遍历价格列表，找到最大和最小价格
	//for _, priceStr := range prices[1:] { // 从第二个元素开始遍历，因为我们已经处理了第一个
	//	price, err := strconv.ParseFloat(priceStr, 64)
	//	if err != nil {
	//		continue // 如果转换失败，则跳过当前价格
	//	}
	//	if price < minPrice {
	//		minPrice = price
	//	}
	//	if price > maxPrice {
	//		maxPrice = price
	//	}
	//	// 更新最后一个价格
	//	lastPrice = price
	//}

}

func AddCoinHistoryBatch() {
	// 准备批量插入的数据
	var stockDataArray []KLineDataWeb

	// 示例数据，你可以根据需要添加更多数据
	stockDataArray = append(stockDataArray, KLineDataWeb{
		//Address:   "hdh",
		//Name:      "eth",
		//Open:      200,
		//Close:     400,
		//Low:       100,
		//High:      900,
		//Volume:    5.8,
		//Timestamp: "2024-07-27 09:01:00",
	})
	// 可以继续添加更多代币的价格数据...

	// 构建批量插入的SQL语句
	tableName := "stock_min_data_2"
	columnNames := []string{"address", "name", "open", "close", "lows", "highs", "volume", "timestamp"}
	columnsStr := `(address, name, open, close, lows, highs, volume, timestamp)`
	//valuesStr := `(` + "`" + strings.Join(columnNames, ", ?, ") + "`)" // 根据实际情况调整

	// 构建参数占位符字符串
	valueArgs := make([]string, 0, len(stockDataArray)*len(columnNames))
	for range stockDataArray {
		for range columnNames {
			valueArgs = append(valueArgs, "?")
		}
	}
	valueArgsStr := strings.Join(valueArgs, ", ")

	// 完整的批量插入SQL语句
	query := fmt.Sprintf("INSERT INTO %s %s VALUES %s", tableName, columnsStr, valueArgsStr)

	// 使用上下文执行批量插入
	ctx := context.Background()
	stmt, err := global.App.ClickHouseDb.Prepare(query)
	if err != nil {
		log.Fatalf("Error preparing statement: %v", err)
	}
	defer stmt.Close()

	// 执行批量插入
	for _, data := range stockDataArray {
		_, err = stmt.ExecContext(ctx,
			data.Timestamp, data.Name, data.Open, data.Close, data.Low, data.High, data.Volume, data.Timestamp,
		)
		if err != nil {
			log.Printf("Error inserting data: %v", err)
		}
	}
}

// ConvertAndFormatUnixTimestamp 将Unix时间戳转换为time.Time类型，并格式化为字符串。
func ConvertAndFormatUnixTimestamp(unixTimestamp int64) string {
	// 将Unix时间戳转换为time.Time类型
	timestampTime := time.Unix(unixTimestamp, 0)

	// 格式化time.Time类型为字符串
	formattedTimestamp := timestampTime.Format("2006-01-02 15:04:05")

	return formattedTimestamp
}
func toDateTimes(value string) (time.Time, error) {
	// 解析字符串到 time.Time 类型
	parsedTime, err := time.Parse("2006-01-02 15:04:05", value)
	if err != nil {
		return time.Time{}, err // 返回错误
	}
	return parsedTime, nil
}
func toDateTime(seconds int64) (time.Time, error) {
	// 将 int64 转换为 time.Time 类型
	// 注意：Unix 时间通常是以秒为单位的，如果 int64 表示毫秒，则需要除以 1000
	parsedTime := time.Unix(seconds, 0)
	return parsedTime, nil
}
func AddCoinHistory(tokenName string, tokenMint string, timestamp int64, tokenId int64) error {
	log.Printf("Attempting to add history for token: %s, at timestamp: %d\n", tokenMint, timestamp)

	priceRange, err := CalculatePriceRangeAdd(tokenMint, timestamp)
	if err != nil {
		log.Printf("Error calculating price range for token: %s, error: %v\n", tokenMint, err)
		return err
	}

	if priceRange == nil || priceRange.StartPrice == 0 && priceRange.MinPrice == 0 && priceRange.MaxPrice == 0 && priceRange.EndPrice == 0 {
		log.Printf("No valid price range data for token: %s, at timestamp: %d\n", tokenMint, timestamp)
		return nil // 没有有效的价格数据，不执行插入操作
	}

	// 格式化时间戳
	formattedTimestamp := time.Unix(timestamp, 0).Format("2006-01-02 15:04:05")

	// 创建要插入的记录
	h := History{
		Id:        tokenId,
		Address:   tokenMint,
		Name:      tokenName,
		Open:      priceRange.StartPrice,
		High:      priceRange.MaxPrice,
		Low:       priceRange.MinPrice,
		Close:     priceRange.EndPrice,
		Volume:    22.0001, // 假设这是从某个地方获取的
		TokenId:   tokenId,
		Timestamp: formattedTimestamp,
		// 假设 sort_key 是一个自增的版本号
		SortKey: tokenId*100 + int64((time.Now().UnixNano()/1000000)%100),
	}

	tableName := "stock_min_data_11"

	// 检查相同 tokenId 和 timestamp 的记录是否存在
	checkQuery := fmt.Sprintf("SELECT COUNT(*) FROM %s WHERE tokenid = ? AND timestamp = toDateTime(?)", tableName)
	var count int
	err = global.App.ClickHouseDb.QueryRow(checkQuery, tokenId, timestamp).Scan(&count)
	if err != nil {
		return err
	}

	if count == 0 {
		// 记录不存在，执行插入操作
		insertQuery := fmt.Sprintf(
			"INSERT INTO %s (Id, address, name, timestamp, open, highs, lows, close, volume, sort_key,tokenid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
			tableName,
		)
		_, err = global.App.ClickHouseDb.Exec(insertQuery, h.Id, h.Address, h.Name, h.Timestamp, h.Open, h.High, h.Low, h.Close, h.Volume, h.SortKey, h.TokenId)
		if err != nil {
			log.Printf("Error inserting data for token: %s, error: %v\n", tokenMint, err)
			return err
		}
		log.Printf("Data inserted successfully for token: %s, at timestamp: %s\n", tokenMint, formattedTimestamp)
	} else {
		// 记录已存在，不执行插入操作
		log.Printf("Record already exists for token: %s, at timestamp: %s\n", tokenMint, formattedTimestamp)
	}

	return nil
}
func AddCoinHistoryBack(tokenName string, tokenMint string, timestamp int64, tokenId int64) error {

	log.Println("新增插入数据", tokenMint)
	log.Println("新增插入数据时间", timestamp)
	priceRange, err := CalculatePriceRangeAdd(tokenMint, timestamp)
	if err != nil {
		// 处理错误，例如记录日志或通知用户
		log.Println("Error calculating price range:", err)
		return nil
	}
	if priceRange == nil {
		// 处理错误，例如记录日志或通知用户
		log.Println("Error calculating price range,no redis record:", err)
		return nil
	}

	// 如果priceRange的所有值都为0，这可能意味着没有有效的价格数据
	if priceRange.StartPrice == 0 && priceRange.MinPrice == 0 && priceRange.MaxPrice == 0 && priceRange.EndPrice == 0 {
		// 根据你的逻辑继续处理，比如跳过当前的tokenName或timestamp
		return nil
	}
	log.Println("新增有效插入数据时间", timestamp)
	//roundedVolume, err := strconv.ParseFloat("22.6132", 64)
	// 创建要插入的记录
	h := History{
		Id:        tokenId, // 假设ID是自动生成的
		Address:   tokenMint,
		Name:      tokenName,
		Open:      priceRange.StartPrice,
		Close:     priceRange.EndPrice,
		Low:       priceRange.MinPrice,
		High:      priceRange.MaxPrice,
		Volume:    22.0001,
		TokenId:   tokenId,
		Timestamp: time.Unix(timestamp, 0).Format("2006-01-02 15:04:05"), // 格式化时间戳
	}
	fmt.Println(h)

	tableName := fmt.Sprintf("stock_min_data_11")
	// 检查相同name和timestamp的记录是否存在
	checkQuery := fmt.Sprintf("SELECT COUNT(*) FROM %s WHERE tokenid = ? AND timestamp = ?", tableName)
	var count int
	row := global.App.ClickHouseDb.QueryRow(checkQuery, h.TokenId, h.Timestamp)
	err = row.Scan(&count)
	if err != nil {
		return err
	}

	// 如果记录存在，则跳过插入
	if count > 0 {
		fmt.Println("Record already exists, skipping insert.")
		return nil
	}

	//query := fmt.Sprintf("INSERT INTO %s (Id, address, name, timestamp, open, highs, lows, close, volume) VALUES (1, '0x123abc', 'TokenA', toDateTime('2024-08-26 12:34:56'), 100.5, 102.0, 99.0, 100.5, 1500.0)", tableName)
	query := fmt.Sprintf("INSERT INTO %s (tokenid,address, name, timestamp, open, highs, lows, close, volume) VALUES (?, ?, ?, toDateTime(?), ?, ?, ?, ?, ?)", tableName)
	fmt.Println(query)

	re, err := global.App.ClickHouseDb.Exec(query, h.TokenId, h.Address, h.Name, timestamp, h.Open, h.High, h.Low, h.Close, h.Volume)
	fmt.Println(re)
	log.Println("插入数据成功", timestamp)
	if err != nil {
		// 处理错误
		fmt.Println("Error inserting data:", err)
	}
	return nil

}

func CorrectCoinHistory(tokenName string, tokenMint string, timestamp int64, tokenId int64) error {
	//firstPrice, minPrice, maxPrice, lastPrice, err := CalculatePriceRange(tokenName, timestamp)
	priceRange, err := CalculatePriceRangeCorrect(tokenName)
	if err != nil {
		return err // 如果计算价格范围出错，返回错误
	}
	for _, token := range priceRange {
		// 创建要更新或插入的记录
		h := History{
			Id:        tokenId, // 假设ID是自动生成的
			Address:   tokenMint,
			Name:      tokenName,
			Open:      token.StartPrice,
			Close:     token.EndPrice,
			Low:       token.MinPrice,
			High:      token.MaxPrice,
			Timestamp: time.Unix(token.MinuteKey, 0).Format("2006-01-02 15:04:05"), // 格式化时间戳
		}
		fmt.Println(h)

		tableName := "stock_min_data_7" // 表名

		// 检查相同name和timestamp的记录是否存在
		checkQuery := "SELECT COUNT(*) FROM " + tableName + " WHERE name = ? AND timestamp = ?"
		var count int
		row := global.App.ClickHouseDb.QueryRow(checkQuery, h.Name, h.Timestamp)
		err = row.Scan(&count)
		if err != nil {
			return err
		}

		if count > 0 {
			// 记录存在，执行更新操作
			updateQuery := "UPDATE " + tableName + " SET open = ?, close = ?, low = ?, high = ? WHERE name = ? AND timestamp = ?"
			_, err = global.App.ClickHouseDb.Exec(updateQuery, h.Open, h.Close, h.Low, h.High, h.Name, h.Timestamp)
			if err != nil {
				fmt.Println("Error updating data:", err)
				return err
			}
			fmt.Println("Record updated successfully.")
		}
	}
	//else {
	//	// 记录不存在，执行插入操作
	//	insertQuery := "INSERT INTO " + tableName + " (id, address, name, open, close, low, high, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
	//	_, err = global.App.ClickHouseDb.Exec(insertQuery, h.Id, h.Address, h.Name, h.Open, h.Close, h.Low, h.High, h.Timestamp)
	//	if err != nil {
	//		fmt.Println("Error inserting data:", err)
	//		return err
	//	}
	//	fmt.Println("Record inserted successfully.")
	//}
	return nil
}
func QueryBack(tokenName string, marketAddress string) ([]KLineDataWeb, error) {
	// 准备SQL查询，这里使用命名查询以防止SQL注入。
	query := `SELECT
    name,
    toUnixTimestamp(toStartOfMinute(timestamp)) AS timestamp,
    min(open) AS open,
    max(close) AS close,
    max(highs) AS high,
    min(lows) AS low
FROM ?
WHERE
    name = ? AND
    timestamp >= toDateTime(?) AND
        timestamp < toDateTime(?)
GROUP BY name, timestamp
ORDER BY timestamp`
	fmt.Println("4hhhh12")
	// 定义查询参数：表名、股票代码、开始时间、结束时间。
	tableName := "default.stock_min_data_2"
	stockSymbol := "eth"
	startTime := "2024-07-27 09:00:00"
	endTime := "2024-07-27 09:03:00"
	rows, err := global.App.ClickHouseDb.QueryContext(context.Background(), query, tableName, stockSymbol, startTime, endTime)
	if err != nil {
		//log.Fatal(err)
		return nil, fmt.Errorf("failed to open ClickHouse connection: %w", err)
	}
	var klines []KLineDataWeb
	for rows.Next() {
		var kline KLineDataWeb
		err := rows.Scan(&kline.Name, &kline.Timestamp, &kline.Open, &kline.Close, &kline.High, &kline.Low)
		if err != nil {
			log.Fatalf("Scan failed: %v", err)
		}
		klines = append(klines, kline)
	}

	if err = rows.Err(); err != nil {
		log.Fatalf("Iteration over rows failed: %v", err)
	}

	// 打印查询结果
	for _, kline := range klines {
		fmt.Printf("%+v\n", kline)
	}
	return klines, err
}
func QueryB(tokenName string, marketAddress string) ([]KLineDataWeb, error) {
	// 准备SQL查询，这里使用直接的查询字符串而不是参数化查询
	tableName := "default.stock_min_data_2"
	stockSymbol := "eth"
	startTime := "2024-07-27 09:00:00"
	endTime := "2024-07-27 09:03:00"
	query := fmt.Sprintf(`SELECT
        name,
        toUnixTimestamp(toStartOfMinute(timestamp)) AS timestamp,
        min(open) AS open,
        max(close) AS close,
        max(highs) AS high,
        min(lows) AS low
    FROM %s
    WHERE
        name = '%s' AND
        timestamp >= toDateTime('%s') AND
        timestamp < toDateTime('%s')
    GROUP BY name, timestamp
    ORDER BY timestamp`, tableName, stockSymbol, startTime, endTime)

	rows, err := global.App.ClickHouseDb.QueryContext(context.Background(), query)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}
	defer rows.Close() // 确保在函数结束时关闭结果集

	var klines []KLineDataWeb
	for rows.Next() {
		var kline KLineDataWeb
		if err := rows.Scan(&kline.Name, &kline.Timestamp, &kline.Open, &kline.Close, &kline.High, &kline.Low); err != nil {
			return nil, fmt.Errorf("Scan failed: %w", err)
		}
		klines = append(klines, kline)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("Iteration over rows failed: %w", err)
	}

	return klines, nil
}

func QueryA(tokenName string, tokenAddress string, startTime int64, endTime int64, limit int64) (*global.KLineResults, error) {
	tableName := "default.stock_min_data_7"
	startTimeStr := time.Unix(startTime, 0).Format("2006-01-02 15:04:05")
	endTimeStr := time.Unix(endTime, 0).Format("2006-01-02 15:04:05")
	//var queryLimit int64 = 100 // 默认limit为100
	//if limit > 0 {
	//	queryLimit = limit
	//}

	query := fmt.Sprintf(`SELECT
        name,
        address,
        toUnixTimestamp(toStartOfMinute(timestamp)) AS timestamp,
        min(open) AS open,
        max(close) AS close,
        max(highs) AS high,
        min(lows) AS low
    FROM %s
    WHERE
        name = '%s' AND
        timestamp >= toDateTime('%s') AND
        timestamp < toDateTime('%s')
    GROUP BY name, address, timestamp
    ORDER BY timestamp LIMIT %d`, tableName, tokenName, startTimeStr, endTimeStr, 50)
	fmt.Println(query)
	ctx := context.Background()

	// 使用 QueryContext 执行查询
	rows, err := global.App.ClickHouseDb.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}
	defer rows.Close() // 确保在函数结束时关闭结果

	var klines []KLineDataWeb
	for rows.Next() {
		var kline KLineDataWeb
		if err := rows.Scan(&kline.Name, &kline.Address, &kline.Timestamp, &kline.Open, &kline.Close, &kline.High, &kline.Low); err != nil {
			return nil, fmt.Errorf("Scan failed: %w", err)
		}
		klines = append(klines, kline)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("Iteration over rows failed: %w", err)
	}

	if len(klines) == 0 {
		// 获取最近的记录时间
		recentTime, err := getRecentTime(global.App.ClickHouseDb, tableName, tokenName)
		if err != nil {
			return nil, fmt.Errorf("failed to get recent time: %w", err)
		}
		return &global.KLineResults{
			S:        "no_data",
			NextTime: recentTime, // 使用 Unix 时间戳
		}, nil
	}

	// 根据 klines 切片创建 KLineResult 结构体
	result := &global.KLineResults{
		S: "ok",
		T: make([]int64, 0, len(klines)),
		C: make([]*big.Float, 0, len(klines)),
		O: make([]*big.Float, 0, len(klines)),
		H: make([]*big.Float, 0, len(klines)),
		L: make([]*big.Float, 0, len(klines)),
		//V: make([]int64, 0, len(klines)),
	}

	for _, kline := range klines {
		result.T = append(result.T, kline.Timestamp)
		result.C = append(result.C, Float64ToBigFloat(kline.Close))
		result.O = append(result.O, Float64ToBigFloat(kline.Open))
		result.H = append(result.H, Float64ToBigFloat(kline.High))
		result.L = append(result.L, Float64ToBigFloat(kline.Low))
		// 如果需要成交量字段
		// result.V = append(result.V, kline.Volume)
	}

	// 返回 KLineResult 结构体
	return result, nil
}

// Float64ToBigFloat 将 float64 转换为 *big.Float
func Float64ToBigFloat(f float64) *big.Float {
	bigVal := new(big.Float).SetPrec(256).SetFloat64(f)
	return bigVal
}

// 假设这是用于获取最近记录时间的函数
func getRecentTime(db *sql.DB, tableName string, tokenName string) (int64, error) {
	var recentTime time.Time
	err := db.QueryRow("SELECT max(timestamp) FROM "+tableName+" WHERE name = ?", tokenName).Scan(&recentTime)
	if err != nil {
		return 0, fmt.Errorf("failed to get recent time: %w", err)
	}

	// 将 time.Time 对象转换为 Unix 时间戳
	unixTimestamp := recentTime.Unix()
	return unixTimestamp, nil
}

// mustFloat64ToStrNoSci 将 float64 转换为非科学记数法的字符串，然后转换回 float64
func mustFloat64ToStrNoSci(f float64) float64 {
	noSciStr := fmt.Sprintf("%.10f", f*10000) // 格式化为非科学记数法的字符串
	parsedFloat, err := strconv.ParseFloat(noSciStr, 64)
	if err != nil {
		// 在实际应用中，您应该更恰当地处理这个错误
		panic(fmt.Sprintf("failed to parse float64 from string: %v", err))
	}
	return parsedFloat
}
func QueryPriceByHour(tokenName string, tokenAddress string, startsTime int64, resolution int64) (*global.KPriceResult, error) {
	tableName := "default.stock_min_data_7"
	startTime := time.Unix(startsTime, 0).Format("2006-01-02 15:04:05")
	// 注意：这里我们使用参数化查询来避免SQL注入
	//	query := fmt.Sprintf(`
	//      SELECT
	//          name,
	//         toStartOfHour(timestamp) AS hour_bucket,  -- 将时间戳对齐到小时的开始
	//--           max(highs) AS max_high_nh_ago,             -- n小时前桶内的最高价
	//--           min(lows) AS min_low_nh_ago,              -- n小时前桶内的最低价
	//--           sum(volume) AS total_volume_nh_ago,        -- n小时内的总成交量
	//         first(open) AS open_price     -- n小时桶内的第一个开盘价
	//--       last(close) AS last_close_nh_ago          -- n小时桶内的最后一个收盘价
	//      FROM %s
	//      WHERE   name = '%s' AND
	//      timestamp >= now() - INTERVAL %d HOUR AND timestamp < now()
	//      GROUP BY name,hour_bucket
	//      ORDER BY hour_bucket DESC
	//            LIMIT 1;`, tableName, tokenName, resolution)
	query := fmt.Sprintf(`
	SELECT
	name,
		timestamp,
		open AS open_price
	FROM %s
	WHERE
	name = '%s' AND
	 timestamp = toStartOfMinute(now() - INTERVAL %d HOUR) 
	  LIMIT 1;`, tableName, tokenName, resolution)
	//fmt.Println(query)
	var result global.KPriceResult // 假设这是你要返回的结果结构体

	ctx := context.Background()

	// 使用 QueryContext 执行查询
	rows, err := global.App.ClickHouseDb.QueryContext(ctx, query, tokenName, startTime, time.Now())
	if err != nil {
		return nil, err // 如果有错误发生，返回错误
	}
	defer rows.Close()

	// 遍历结果集
	for rows.Next() {
		var data struct {
			Name      string
			Timestamp time.Time
			OpenPrice float64
		}
		if err := rows.Scan(&data.Name, &data.Timestamp, &data.OpenPrice); err != nil {
			return nil, err // 如果扫描失败，返回错误
		}
		// 假设Result结构体中有一个字段用于存储价格数据
		result.Price = data.OpenPrice
		result.TokenName = data.Name
	}

	if err := rows.Err(); err != nil {
		return nil, err // 检查迭代过程中是否有错误发生
	}

	return &result, nil // 返回结果
}

// 用于后端对接的查询
func QuerySeconds(tokenName string, tokenAddress string, startsTime int64, endsTime int64, limit int64, resolution int64) (*global.KLineResult, error) {
	tableName := "stock_min_data_10"
	startTime := time.Unix(startsTime, 0).Format("2006-01-02 15:04:05")
	endTime := time.Unix(endsTime, 0).Format("2006-01-02 15:04:05")
	query := fmt.Sprintf(`SELECT
        Id,
        address,
        toUnixTimestamp(toStartOfInterval(timestamp, INTERVAL %d SECONDS)) AS timestamp,
        min(open) AS open,
        max(close) AS close,
        max(highs) AS high,
        min(lows) AS low
    FROM %s
    WHERE
        Id = '%s' AND
        timestamp >= toDateTime('%s') AND
        timestamp < toDateTime('%s')
    GROUP BY id, address, timestamp
    ORDER BY timestamp LIMIT %d`, resolution, tableName, tokenName, startTime, endTime, limit)
	fmt.Println(query)
	ctx := context.Background()

	// 使用 QueryContext 执行查询
	rows, err := global.App.ClickHouseDb.QueryContext(ctx, query, tokenAddress, startTime, endTime)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}
	defer rows.Close() // 确保在函数结束时关闭结果集

	var klines []KLineDataWeb
	for rows.Next() {
		var kline KLineDataWeb
		if err := rows.Scan(&kline.Name, &kline.Address, &kline.Timestamp, &kline.Open, &kline.Close, &kline.High, &kline.Low); err != nil {
			return nil, fmt.Errorf("Scan failed: %w", err)
		}
		klines = append(klines, kline)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("Iteration over rows failed: %w", err)
	}
	if len(klines) == 0 {
		// 如果没有数据，返回特定的结构体
		return &global.KLineResult{
			S:        "no_data",
			T:        make([]int64, len(klines)),
			C:        make([]float64, len(klines)),
			O:        make([]float64, len(klines)),
			H:        make([]float64, len(klines)),
			L:        make([]float64, len(klines)),
			V:        make([]float64, len(klines)),
			NextTime: endsTime,
		}, nil
	}
	// 准备 KLineResult 结构体
	result := &global.KLineResult{
		S: "ok",
		T: make([]int64, len(klines)),
		C: make([]float64, len(klines)),
		O: make([]float64, len(klines)),
		H: make([]float64, len(klines)),
		L: make([]float64, len(klines)),
		V: make([]float64, len(klines)),
	}

	for i, kline := range klines {
		result.T[i] = kline.Timestamp
		//result.C[i] = kline.Close
		//result.O[i] = kline.Open
		//result.H[i] = kline.High
		//result.L[i] = kline.Low
		result.C[i] = mustFloat64ToStrNoSci(kline.Close)
		result.O[i] = mustFloat64ToStrNoSci(kline.Open)
		result.H[i] = mustFloat64ToStrNoSci(kline.High)
		result.L[i] = mustFloat64ToStrNoSci(kline.Low)
		result.V[i] = 36.361255
	}
	lastTimestamp := klines[len(klines)-1].Timestamp
	firstPrice, minPrice, maxPrice, lastPrice, err := CalculatePriceRange(tokenName, lastTimestamp)
	if err != nil {
		return nil, fmt.Errorf("failed to calculate price range: %w", err)
	}

	// 将实时价格数据添加到result的最后一条记录
	result.T[len(result.T)-1] = lastTimestamp
	result.C[len(result.C)-1] = lastPrice  // 假设lastPrice是最后的价格
	result.O[len(result.O)-1] = firstPrice // 假设firstPrice是第一条价格
	result.H[len(result.H)-1] = maxPrice
	result.L[len(result.L)-1] = minPrice

	return result, nil
}

// 用于后端对接的查询
func QuerySecondsMinutes(tokenName string, tokenAddress string, startsTime int64, endsTime int64, limit int64, resolution int64) (*global.KLineResult, error) {
	tableName := "stock_min_data_10"
	startTime := time.Unix(startsTime, 0).Format("2006-01-02 15:04:05")
	endTime := time.Unix(endsTime, 0).Format("2006-01-02 15:04:05")

	query := fmt.Sprintf(`SELECT
        address,
        name,
        Id,
        toStartOfInterval(timestamp, INTERVAL %d minute) as minute_timestamp,
        min(open) AS open,
        argMax(close, toUnixTimestamp(timestamp)) AS close, -- 取每分钟内最后一秒的收盘价
        max(highs) AS high,
        min(lows) AS low,
        sum(volume) as volume
    FROM %s
    WHERE
        Id = '%s' AND
        timestamp >= toDateTime('%s') AND
        timestamp < toDateTime('%s')
    GROUP BY  address, name,Id, minute_timestamp
    ORDER BY minute_timestamp LIMIT %d`, resolution, tableName, tokenName, startTime, endTime, limit)
	fmt.Println(query)
	ctx := context.Background()

	// 使用 QueryContext 执行查询
	rows, err := global.App.ClickHouseDb.QueryContext(ctx, query, tokenAddress, startTime, endTime)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}
	defer rows.Close() // 确保在函数结束时关闭结果集

	var klines []KLineDataWeb
	for rows.Next() {
		var kline KLineDataWeb
		if err := rows.Scan(&kline.Address, &kline.Name, &kline.Id, &kline.Minutetamp, &kline.Open, &kline.Close, &kline.High, &kline.Low, &kline.Volume); err != nil {
			return nil, fmt.Errorf("Scan failed: %w", err)
		}
		klines = append(klines, kline)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("Iteration over rows failed: %w", err)
	}
	if len(klines) == 0 {
		// 如果没有数据，返回特定的结构体
		return &global.KLineResult{
			S:        "no_data",
			T:        make([]int64, len(klines)),
			C:        make([]float64, len(klines)),
			O:        make([]float64, len(klines)),
			H:        make([]float64, len(klines)),
			L:        make([]float64, len(klines)),
			V:        make([]float64, len(klines)),
			NextTime: endsTime,
		}, nil
	}
	// 准备 KLineResult 结构体
	result := &global.KLineResult{
		S: "ok",
		T: make([]int64, len(klines)),
		C: make([]float64, len(klines)),
		O: make([]float64, len(klines)),
		H: make([]float64, len(klines)),
		L: make([]float64, len(klines)),
		V: make([]float64, len(klines)),
	}

	for i, kline := range klines {
		result.T[i] = kline.Timestamp
		//result.C[i] = kline.Close
		//result.O[i] = kline.Open
		//result.H[i] = kline.High
		//result.L[i] = kline.Low
		result.C[i] = mustFloat64ToStrNoSci(kline.Close)
		result.O[i] = mustFloat64ToStrNoSci(kline.Open)
		result.H[i] = mustFloat64ToStrNoSci(kline.High)
		result.L[i] = mustFloat64ToStrNoSci(kline.Low)
		result.V[i] = 36.361255
	}
	//lastTimestamp := klines[len(klines)-1].Timestamp
	//firstPrice, minPrice, maxPrice, lastPrice, err := CalculatePriceRange(tokenName, lastTimestamp)
	//if err != nil {
	//	return nil, fmt.Errorf("failed to calculate price range: %w", err)
	//}
	//
	//// 将实时价格数据添加到result的最后一条记录
	//result.T[len(result.T)-1] = lastTimestamp
	//result.C[len(result.C)-1] = lastPrice  // 假设lastPrice是最后的价格
	//result.O[len(result.O)-1] = firstPrice // 假设firstPrice是第一条价格
	//result.H[len(result.H)-1] = maxPrice
	//result.L[len(result.L)-1] = minPrice

	return result, nil
}

// 用于后端对接的查询
func Query(tokenName string, tokenAddress string, startsTime int64, endsTime int64, limit int64, resolution int64) (*global.KLineResult, error) {
	tableName := "default.stock_min_data_7"
	startTime := time.Unix(startsTime, 0).Format("2006-01-02 15:04:05")
	endTime := time.Unix(endsTime, 0).Format("2006-01-02 15:04:05")
	query := fmt.Sprintf(`SELECT
        tid AS id,
        name,
        address,
        toUnixTimestamp(toStartOfInterval(timestamp, INTERVAL %d MINUTE)) AS timestamp,
        min(open) AS open,
        max(close) AS close,
        max(highs) AS high,
        min(lows) AS low
    FROM %s
    WHERE
        tid = '%s' AND
        timestamp >= toDateTime('%s') AND
        timestamp < toDateTime('%s')
    GROUP BY name, address, timestamp
    ORDER BY timestamp LIMIT %d`, resolution, tableName, tokenName, startTime, endTime, limit)
	fmt.Println(query)
	ctx := context.Background()

	// 使用 QueryContext 执行查询
	rows, err := global.App.ClickHouseDb.QueryContext(ctx, query, tokenAddress, startTime, endTime)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}
	defer rows.Close() // 确保在函数结束时关闭结果集

	var klines []KLineDataWeb
	for rows.Next() {
		var kline KLineDataWeb
		if err := rows.Scan(&kline.Name, &kline.Address, &kline.Timestamp, &kline.Open, &kline.Close, &kline.High, &kline.Low); err != nil {
			return nil, fmt.Errorf("Scan failed: %w", err)
		}
		klines = append(klines, kline)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("Iteration over rows failed: %w", err)
	}
	if len(klines) == 0 {
		// 如果没有数据，返回特定的结构体
		return &global.KLineResult{
			S:        "no_data",
			T:        make([]int64, len(klines)),
			C:        make([]float64, len(klines)),
			O:        make([]float64, len(klines)),
			H:        make([]float64, len(klines)),
			L:        make([]float64, len(klines)),
			V:        make([]float64, len(klines)),
			NextTime: endsTime,
		}, nil
	}
	// 准备 KLineResult 结构体
	result := &global.KLineResult{
		S: "ok",
		T: make([]int64, len(klines)),
		C: make([]float64, len(klines)),
		O: make([]float64, len(klines)),
		H: make([]float64, len(klines)),
		L: make([]float64, len(klines)),
		V: make([]float64, len(klines)),
	}

	for i, kline := range klines {
		result.T[i] = kline.Timestamp
		//result.C[i] = kline.Close
		//result.O[i] = kline.Open
		//result.H[i] = kline.High
		//result.L[i] = kline.Low
		result.C[i] = mustFloat64ToStrNoSci(kline.Close)
		result.O[i] = mustFloat64ToStrNoSci(kline.Open)
		result.H[i] = mustFloat64ToStrNoSci(kline.High)
		result.L[i] = mustFloat64ToStrNoSci(kline.Low)
		result.V[i] = 36.361255
	}

	return result, nil
}

// 用于前端对接的查询
func QueryWeb(tokenName string, tokenAddress string, startsTime int64) ([]KLineDataWeb, error) {

	// 执行查询
	tableName := "default.stock_min_data_7"
	//stockSymbol := tokenName
	startTime := time.Unix(startsTime, 0).Format("2006-01-02 15:04:05")
	endTime := time.Unix(time.Now().Unix(), 0).Format("2006-01-02 15:04:05")
	query := fmt.Sprintf(`SELECT
        name,
        address,
        toUnixTimestamp(toStartOfMinute(timestamp)) AS time,
        min(open) AS open,
        max(close) AS close,
        max(highs) AS high,
        min(lows) AS low
    FROM %s
    WHERE
        address = '%s' AND
        timestamp >= toDateTime('%s') AND
        timestamp < toDateTime('%s')
    GROUP BY name, address, timestamp
    ORDER BY timestamp`, tableName, tokenAddress, startTime, endTime)
	fmt.Println(query)
	rows, err := global.App.ClickHouseDb.QueryContext(context.Background(), query)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}
	defer rows.Close() // 确保在函数结束时关闭结果集

	var klines []KLineDataWeb
	for rows.Next() {
		var kline KLineDataWeb
		if err := rows.Scan(&kline.Name, &kline.Address, &kline.Timestamp, &kline.Open, &kline.Close, &kline.High, &kline.Low); err != nil {
			return nil, fmt.Errorf("Scan failed: %w", err)
		}
		klines = append(klines, kline)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("Iteration over rows failed: %w", err)
	}

	return klines, nil
}
func QuerySocket(tokenAddress string) ([]KLineDataWeb, error) {

	// 执行查询
	tableName := "default.stock_min_data_7"
	//stockSymbol := tokenName
	startTime := time.Unix(time.Now().Unix()-3600*24*15, 0).Format("2006-01-02 15:04:05")
	endTime := time.Unix(time.Now().Unix(), 0).Format("2006-01-02 15:04:05")
	query := fmt.Sprintf(`SELECT
        name,
        address,
        toUnixTimestamp(toStartOfMinute(timestamp)) AS timestamp,
        min(open) AS open,
        max(close) AS close,
        max(highs) AS high,
        min(lows) AS low
    FROM %s
    WHERE
        address = '%s' AND
        timestamp >= toDateTime('%s') AND
        timestamp < toDateTime('%s')
    GROUP BY name, address, timestamp
    ORDER BY timestamp`, tableName, tokenAddress, startTime, endTime)
	fmt.Println(query)
	rows, err := global.App.ClickHouseDb.QueryContext(context.Background(), query)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}
	defer rows.Close() // 确保在函数结束时关闭结果集

	var klines []KLineDataWeb
	for rows.Next() {
		var kline KLineDataWeb
		if err := rows.Scan(&kline.Name, &kline.Timestamp, &kline.Open, &kline.Close, &kline.High, &kline.Low); err != nil {
			return nil, fmt.Errorf("Scan failed: %w", err)
		}
		klines = append(klines, kline)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("Iteration over rows failed: %w", err)
	}

	return klines, nil
}
func T(i interface{}) string {
	//clickhouse-client -h 43.133.58.143 --port 9000
	str := ""
	switch i.(type) {
	case int64:
		str = fmt.Sprintf("%d", i)
		break
	case float64:
		str = fmt.Sprintf("%f", i)
		break
	case float32:
		str = fmt.Sprintf("%f", i)
	case int:
		str = fmt.Sprintf("%d", i)
		break
	case int32:
		str = fmt.Sprintf("%d", i)
		break
	case int8:
		str = fmt.Sprintf("%d", i)
		break
	}
	return str
}

// 订阅K线数据并实时推送
func SubscribeKlines(tokenName string, conn *websocket.Conn, stopChan chan bool) {
	ticker := time.NewTicker(10 * time.Second) // 每10秒推送一次
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			klineData, _ := QuerySocket(tokenName)
			//klineData := models.GetMockKLineData(name)
			if err := conn.WriteJSON(klineData); err != nil {
				// 处理错误
				return
			}
		case <-stopChan:
			return
		}
	}
}
