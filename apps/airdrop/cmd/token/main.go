package main

import (
	"context"
	"log"
	"log/slog"
	"os"

	"github.com/fair-meme/fairmeme/apps/airdrop/internal/airdrop"
	"github.com/fair-meme/fairmeme/apps/airdrop/internal/db"
	"github.com/fair-meme/fairmeme/apps/airdrop/internal/services/chains"
	"github.com/fair-meme/fairmeme/apps/airdrop/internal/services/coingecko"
	solanaservice "github.com/fair-meme/fairmeme/apps/airdrop/internal/services/solana"
	"github.com/gagliardetto/solana-go"
	"github.com/gagliardetto/solana-go/rpc"
	"github.com/joho/godotenv"
)

const (
	defaultConfigPath = "./config.toml"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal(err)
	}
	config, err := airdrop.LoadConfig(defaultConfigPath)
	if err != nil {
		log.Fatal(err)
	}

	ctx := context.Background()
	logger := slog.Default()

	cgkApiKey := os.Getenv("CGK_API_KEY")
	if cgkApiKey == "" {
		log.Fatal("missing cgk api key")
	}
	cgk, err := coingecko.NewClient(ctx, logger, coingecko.DefaultApiUrl, cgkApiKey)
	if err != nil {
		log.Fatal(err)
	}
	// Init database
	d, err := db.Open(ctx, db.Options{
		Logger:   logger,
		Host:     config.DB.Host,
		Name:     config.DB.Name,
		Password: config.DB.Password,
		User:     config.DB.User,
		Port:     config.DB.Port,
		SslMode:  config.DB.SslMode,
	})
	if err != nil {
		log.Fatal(err)
	}

	var client *rpc.Client
	for _, chain := range config.Chains {
		if chain.Name == chains.Solana {
			client = rpc.New(chain.RpcUrl)
		}
	}

	if client == nil {
		log.Fatal("solana not supported")
	}
	var tokens []db.Token
	listAddrs := cgk.ListTokenAddrs()
	for _, addr := range listAddrs {
		if addr == solanaservice.DefaultSolTokenAddress {
			tokens = append(tokens, db.Token{
				Address:  addr,
				Decimals: 9,
			})
			continue
		}
		mint, err := solana.PublicKeyFromBase58(addr)
		if err != nil {
			logger.Error("parse public key failed", "err", err, "addr", addr)
			continue
		}
		logger.Info("Get decimals for token", "addr", addr)
		supply, err := client.GetTokenSupply(ctx, mint, rpc.CommitmentFinalized)
		if err != nil {
			logger.Error("get token suplly failed", "err", err, "addr", addr)
			continue
		}
		tokens = append(tokens, db.Token{
			Address:  addr,
			Decimals: int(supply.Value.Decimals),
		})
	}
	if len(tokens) == 0 {
		logger.Info("no tokens found")
		return
	}
	logger.Info("found token list, saving...", "len", len(tokens))
	if err := d.SaveTokenList(tokens); err != nil {
		log.Fatal(err)
	}
}
