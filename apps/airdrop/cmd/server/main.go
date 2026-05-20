package main

import (
	"context"
	"fmt"
	"github.com/robfig/cron/v3"
	"log"
	"log/slog"

	"github.com/fair-meme/fairmeme/apps/airdrop/internal/airdrop"
	business "github.com/fair-meme/fairmeme/apps/airdrop/internal/business"
)

const (
	defaultConfigPath = "./config.toml"
)

func main() {
	config, err := airdrop.LoadConfig(defaultConfigPath)
	if err != nil {
		log.Fatal(err)
	}

	logger := slog.Default()
	ctx := context.Background()
	a, err := airdrop.NewAirdrop(ctx, logger, config)
	if err != nil {
		log.Fatal(err)
	}

	// Run syncing
	if err := a.RunSync(); err != nil {
		log.Fatal("Airdrop run sync error: ", err)
	}

	if err := airdrop.InitGorm(config.DB); err != nil {
		log.Fatal("Error initializing GORM:", err)
	}
	if err := airdrop.InitRedis(ctx, config.Redis); err != nil {
		log.Fatal("Error initializing Redis:", err)
	}
	gormDB := airdrop.GetGormDB()
	rdb := airdrop.GetRedisClient()
	summaryServer := business.NewSummaryServer(ctx, gormDB, rdb)

	c := cron.New(cron.WithSeconds())

	go summaryServer.BindingInvite()
	_, err = c.AddFunc("0 */10 * * * *", summaryServer.AutoProgress)
	if err != nil {
		fmt.Println("添加定时任务出错：", err)
		return
	}
	if _, err := c.AddFunc("0 */10 * * * *", summaryServer.UpdateAirdropRanking); err != nil {
		fmt.Println("add UpdateAirdropRanking error：", err)
		return
	}
	c.Start()

	addr := fmt.Sprintf(":%s", config.ServerPort)
	s, err := airdrop.NewServer(ctx, logger, addr, a, summaryServer)
	if err != nil {
		log.Fatal(err)
	}
	logger.Info("starting server", "addr", addr)
	log.Fatal(s.Start())
}
