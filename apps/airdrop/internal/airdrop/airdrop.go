package airdrop

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"math/big"
	"os"

	"github.com/fair-meme/fairmeme/apps/airdrop/internal/db"
	"github.com/fair-meme/fairmeme/apps/airdrop/internal/services/chains"
	"github.com/fair-meme/fairmeme/apps/airdrop/internal/services/coingecko"
	"github.com/fair-meme/fairmeme/apps/airdrop/internal/services/eth"
	"github.com/fair-meme/fairmeme/apps/airdrop/internal/services/solana"
	"github.com/fair-meme/fairmeme/apps/airdrop/internal/services/tokenprice"
	"github.com/fair-meme/fairmeme/apps/airdrop/internal/sync"
	"github.com/joho/godotenv"
)

var (
	// All users with total balance greater than this value in USD are eligible
	BalanceThresholdUSD = big.NewFloat(500)
)

type CheckAirdropResult struct {
	Chain       string `json:"chain"`
	UserAddress string `json:"userAddress"`
	Eligible    bool   `json:"eligible"`
}

type Airdrop interface {
	CheckAirdrop(userAddress string, chainName string) (*CheckAirdropResult, error)
	RunSync() error
}

type airdrop struct {
	ctx        context.Context
	logger     *slog.Logger
	config     *Config
	clients    map[string]chains.ClientInterface
	solanaSync sync.SolanaSync
	db         *db.Database
}

// RunSync implements Airdrop.
func (a *airdrop) RunSync() error {
	if a.solanaSync == nil {
		a.logger.Info("Solana Syncing is disabled")
		return nil
	}
	currentSlot, err := a.solanaSync.GetCurrentSlot(a.ctx)
	if err != nil {
		return err
	}
	snapshotSlot := currentSlot - uint64(a.config.SnapshotSlotChange)
	a.logger.Info("Start running solana sync", "snapshot_slot", snapshotSlot)
	go func() {
		if err := a.solanaSync.RunUpstream(a.ctx, &sync.UpstreamOptions{}); err != nil {
			a.logger.Error("Run upstream error", "err", err)
		}
	}()
	go func() {
		if err := a.solanaSync.RunBackfill(a.ctx, &sync.BackfillOptions{
			SnapshotSlot: uint64(snapshotSlot),
		}); err != nil {
			a.logger.Error("Run backfill error", "err", err)
		}
	}()
	return nil
}

// CheckAirdrop implements Airdrop.
func (a *airdrop) CheckAirdrop(userAddress string, chainName string) (*CheckAirdropResult, error) {
	a.logger.Info("CheckAirdrop", "user_address", userAddress, "chain_name", chainName)
	if result, found := a.db.CheckUserAirdrop(userAddress, chainName); found {
		return &CheckAirdropResult{
			Chain:       chainName,
			UserAddress: userAddress,
			Eligible:    result.Eligible,
		}, nil
	}
	client, ok := a.clients[chainName]
	if !ok {
		return nil, fmt.Errorf("chain %s is not supported", chainName)
	}

	if client.GetChainName() == chains.Solana && !a.solanaSync.IsSynced() {
		return nil, fmt.Errorf("solana service is not synced")
	}

	var blockSnapshot *big.Int
	if client.GetChainName() == chains.Solana {
		blockSnapshot = big.NewInt(0) // no need on solana
	} else {
		block, err := client.EstimateBlockAtTimestamp(a.ctx, a.config.SnapshotTime)
		if err != nil {
			return nil, err
		}
		blockSnapshot = block
	}

	a.logger.Info("CheckAirdrop", "block_snapshot", blockSnapshot, "chain_name", chainName)

	totalUsdResult, err := client.GetTotalUSDAtBlock(a.ctx, &chains.GetTotalUSDAtBlockOpts{
		UserAddress: userAddress,
		BlockNumber: blockSnapshot,
	})
	if err != nil {
		return nil, err
	}

	eligible := false
	if totalUsdResult.TotalUSD.Cmp(BalanceThresholdUSD) >= 0 {
		eligible = true
	}

	result := CheckAirdropResult{
		Chain:       client.GetChainName(),
		UserAddress: userAddress,
		Eligible:    eligible,
	}
	usd, _ := totalUsdResult.TotalUSD.Float64()
	a.logger.Info("CheckAirdrop result", "user", userAddress, "chain", chainName, "usd", usd, "eligible", eligible)
	if err := a.db.SaveUserAirdop(db.UserAirdrop{
		UserAddress: userAddress,
		ChainName:   chainName,
		Eligible:    eligible,
		TotalUSD:    usd,
	}); err != nil {
		return nil, err
	}
	return &result, nil
}

var _ Airdrop = &airdrop{}

func NewAirdrop(ctx context.Context, logger *slog.Logger, config *Config) (Airdrop, error) {
	err := godotenv.Load()
	if err != nil {
		return nil, err
	}
	a := &airdrop{
		ctx:     ctx,
		logger:  logger,
		config:  config,
		clients: make(map[string]chains.ClientInterface),
	}
	if err := a.init(); err != nil {
		return nil, err
	}
	return a, nil
}

func (a *airdrop) init() error {
	// Init database
	db, err := db.Open(a.ctx, db.Options{
		Logger:   a.logger,
		Host:     a.config.DB.Host,
		Name:     a.config.DB.Name,
		Password: a.config.DB.Password,
		User:     a.config.DB.User,
		Port:     a.config.DB.Port,
		SslMode:  a.config.DB.SslMode,
	})
	if err != nil {
		return err
	}
	a.db = db

	morailsApiKey := os.Getenv("MORALIS_API_KEY")
	if morailsApiKey == "" {
		return errors.New("missing env MORALIS_API_KEY")
	}
	cgkApiKey := os.Getenv("CGK_API_KEY")
	if cgkApiKey == "" {
		return errors.New("missing env CGK_API_KEY")
	}
	for _, chain := range a.config.Chains {
		if chain.Name == "solana" {
			cgk, err := coingecko.NewClient(a.ctx, a.logger, coingecko.DefaultApiUrl, cgkApiKey)
			if err != nil {
				return err
			}
			p := tokenprice.NewProvider(a.logger, cgk, a.db)
			client, err := solana.NewService(a.logger, chain.RpcUrl, a.db, p)
			if err != nil {
				return err
			}
			a.clients[client.GetChainName()] = client
			solanaSync, err := sync.NewSolanaSync(a.logger, client, a.db)
			if err != nil {
				return err
			}
			a.solanaSync = solanaSync
		} else {
			client, err := eth.NewService(a.logger, chain.Name, chain.RpcUrl, morailsApiKey)
			if err != nil {
				return err
			}
			a.clients[client.GetChainName()] = client
		}
	}
	return nil
}
