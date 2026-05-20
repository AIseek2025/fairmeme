package main

import (
	"github.com/fair-meme/fairmeme/apps/listener/bootstrap"
	"github.com/fair-meme/fairmeme/apps/listener/controllers"
	"github.com/fair-meme/fairmeme/apps/listener/models"
	"github.com/fair-meme/fairmeme/apps/listener/services"
	"fmt"
	"time"
)

func main() {

	//初始化配置
	bootstrap.InitializeConfig()
	bootstrap.InitEth()

	// 初始化数据库
	//init mysql
	err := bootstrap.InitializeMysql()
	if err != nil {
		panic(err)
	}
	fmt.Println("mysql init success!")
	models.InitTable()
	errc := bootstrap.InitializeClickHouse()
	if errc != nil {
		panic(errc)
	}
	fmt.Println("clickhouse init success!")
	errr := bootstrap.InitializeRedis()
	if errr != nil {
		panic(errr)
	}
	fmt.Println("redis init success!")
	controllers.SetSolPriceToRedis()
	controllers.SetSlotToRedis()
	//loopUpdateSolPrice()
	// 启动WebSocket服务
	//startWebSocketServer(r)
	solTokenServer, err := NewSolTokenServer()
	if err != nil {
		panic(err)
	}
	go solTokenServer.ListenNewSolToken()
	go solTokenServer.ListenNewTrade()

	select {}
}

const SolanaGenesisUnixTime int64 = 1596048300

func SlotToTimestamp(slot uint64) int64 {
	// 每个slot的持续时间，以秒为单位
	const slotDurationSeconds = 0.4
	// 计算slot的起始时间（纳秒）
	durationInNanoseconds := time.Duration(slot) * time.Duration(int64(slotDurationSeconds*1e9))
	// 计算从创世时间到slot开始的时间戳
	startTime := time.Unix(SolanaGenesisUnixTime, 0).Add(durationInNanoseconds)
	// 转换为Unix时间戳
	return startTime.Unix()
}

//// 添加定时插入clickhouse
//func (s *SolTokenServer) loopUpdateSolPrice() {
//
//	c := cron.New()
//	c.AddFunc("@every "+fmt.Sprintf("%vs", models.TimeStepSol), func() {
//		fmt.Println("开始采集")
//		err := services.LoopReadAddSolToken()
//		if err != nil {
//			fmt.Println(err)
//		}
//		fmt.Println("采集结束")
//	})
//
//	// 启动定时任务
//	c.Start()
//	//堵塞程序
//	select {}
//}
//
//// 添加定时插入clickhouse
//func (s *SolTokenServer) loopCorrectSolPrice() {
//
//	c := cron.New()
//	c.AddFunc("@every "+fmt.Sprintf("%vs", models.TimeStepSol), func() {
//		fmt.Println("开始采集")
//		err := services.LoopCorrectSolToken()
//		if err != nil {
//			fmt.Println(err)
//		}
//		fmt.Println("采集结束")
//	})
//
//	// 启动定时任务
//	c.Start()
//	//堵塞程序
//	select {}
//}

type SolTokenServer struct {
	Tokens map[string]*services.SolTokenPrice
	//redis 获取slot和 sol price
}

func NewSolTokenServer() (*SolTokenServer, error) {
	tokenList, err := models.GetTokenListByChainAndStatus("sol", 1)
	if err != nil {
		panic(err)
	}
	solTokenServer := SolTokenServer{}
	solTokenServer.Tokens = make(map[string]*services.SolTokenPrice)
	nowSlot, err := controllers.GetSlotByRedis()
	if err != nil {
		return nil, err
	}
	for _, token := range tokenList {
		//历史块 需要历史sol price
		//lastSlot, err := models.GetLastSlotByTokenAddress(token.TokenAddress)
		//if err != nil {
		//	fmt.Println("GetLastSlotByTokenAddress err:", err)
		//	break
		//}
		//genesisTimestamp := int64(1596059091) // Solana 主网的 Genesis 时间戳
		//genesisTimestamp := int64(1596049900)
		////slot := int64(319015008)
		//slot := nowSlot
		////slot := token.Slot  // Slot 编号
		//slotDuration := 0.4 // 每个 Slot 的持续时间（秒）

		// 计算时间戳
		//timestamp := genesisTimestamp + int64(float64(slot)*slotDuration)
		timestamp := SlotToTimestamp(uint64(nowSlot))
		solTokenPrice, err := services.NewSolTokenPrice(&token, nowSlot, timestamp)
		if err != nil {
			return nil, err
		}
		solTokenServer.Tokens[token.TokenAddress] = solTokenPrice
	}
	return &solTokenServer, nil
}
func (s *SolTokenServer) ListenNewSolToken() {
	for {
		NewTokenList, err := models.GetTokenListByChainAndStatus("sol", 0)
		if err != nil {
			panic(err)
		}
		for _, newToken := range NewTokenList {
			//create last sol
			err = models.CreateLastSlotInfo(newToken.TokenAddress, newToken.Slot)
			if err != nil {
				fmt.Println("CreateLastSlotInfo err:", err)
				panic(err)
			}
			solTokenPrice, err := services.NewSolTokenPrice(&newToken, newToken.Slot, newToken.CreationTime)
			if err != nil {
				panic(err)
			}
			s.Tokens[newToken.TokenAddress] = solTokenPrice
		}
		time.Sleep(200 * time.Millisecond)
	}
}
func (s *SolTokenServer) ListenNewTrade() {
	for {
		tradeList, err := models.GetTradeByStatus(0)
		if err != nil {
			fmt.Println("GetTradeByStatus err:", err)
			break
		}
		for _, trade := range *tradeList {
			_, b := s.Tokens[trade.TokenAddress]
			if !b {
				fmt.Println("Tokens get  solTokenPrice  err:", err)
				return
			}

			s.Tokens[trade.TokenAddress].Trade(&trade)
			//update amount
			err = models.UpdateSolAmount(trade)
			if err != nil {
				fmt.Println("UpdateSolAmount err:", err)
			}
		}
	}
}
