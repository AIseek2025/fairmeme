package main

import (
	"github.com/fair-meme/fairmeme/apps/listener/bootstrap"
	"github.com/fair-meme/fairmeme/apps/listener/contract"
	"github.com/fair-meme/fairmeme/apps/listener/models"
	"fmt"
	"github.com/robfig/cron/v3"
	"strconv"
)

func main() {
	//初始化配置
	bootstrap.InitializeConfig()

	bootstrap.InitializeClickHouse()
	//init mysql
	err := bootstrap.InitializeMysql()

	if err != nil {
		panic(err)
	}
	fmt.Println("mysql init success!")
	EachDayFixedTimeCallContract()
}

// EachDayFixedTimeCallContract 每天固定时间去读取合约
func EachDayFixedTimeCallContract() {
	////创建东八区时区2
	//loc := time.FixedZone("CST", 8*3600)
	////创建一个cron对象，withLocation设置时区，WithSends秒级别支持
	//c := cron.New(cron.WithLocation(loc), cron.WithSeconds())
	c := cron.New()
	c.AddFunc("@every "+strconv.Itoa(models.TimeStepSol)+"s", func() {
		fmt.Println("开始采集")
		contract.ReadAllMemeCoinPrice()
		fmt.Println("采集结束")
	})
	// 启动定时任务
	c.Start()
	//堵塞程序
	select {}
}
