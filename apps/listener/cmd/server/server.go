package main

import (
	"github.com/fair-meme/fairmeme/apps/listener/bootstrap"
	"github.com/fair-meme/fairmeme/apps/listener/models"
	"fmt"
)

func main() {
	//初始化配置
	bootstrap.InitializeConfig()

	bootstrap.InitEth()
	//开启一个协程启动定时服务

	// 初始化数据库
	//初始化mongodb连接
	//ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	//defer cancel()
	//bootstrap.InitializeMongodb(ctx)
	//fmt.Println("mongodb init success!")
	//init mysql
	bootstrap.InitAwsS3()
	fmt.Println("aws s3 init success")
	err := bootstrap.InitializeMysql()
	if err != nil {
		panic(err)
	}
	fmt.Println("mysql init success!")
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

	//go controllers.SubscribeMarketMemeCoinTxEvent()
	//controllers.ReadEventFromLogs()
	models.InitTable()
	//go controllers.LoopReadTrade()
	bootstrap.RunServer()
}
