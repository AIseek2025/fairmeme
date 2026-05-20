package main

import (
	"github.com/fair-meme/fairmeme/apps/listener/bootstrap"
	"github.com/fair-meme/fairmeme/apps/listener/models"
	"github.com/fair-meme/fairmeme/apps/listener/services"
	"fmt"
	"github.com/robfig/cron/v3"
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

	loopUpdateSolPrice()
	//go loopCorrectSolPrice()
	select {}
}

// 添加定时插入clickhouse
func loopUpdateSolPrice() {

	c := cron.New()
	c.AddFunc("@every "+fmt.Sprintf("%vs", models.TimeStepSol), func() {
		fmt.Println("开始采集")
		err := services.LoopReadAddSolToken()
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println("采集结束")
	})

	// 启动定时任务
	c.Start()
	//堵塞程序
	select {}
}

// 添加定时插入clickhouse
func loopCorrectSolPrice() {

	c := cron.New()
	c.AddFunc("@every "+fmt.Sprintf("%vs", models.TimeStepSol), func() {
		fmt.Println("开始采集")
		err := services.LoopCorrectSolToken()
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println("采集结束")
	})

	// 启动定时任务
	c.Start()
	//堵塞程序
	select {}
}
