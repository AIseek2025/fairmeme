package sync

import (
	"context"
	"fmt"
	"log/slog"
	"strings"
	"sync/atomic"
	"time"

	"github.com/fair-meme/fairmeme/apps/airdrop/internal/db"
	"github.com/fair-meme/fairmeme/apps/airdrop/internal/queue"
	"github.com/fair-meme/fairmeme/apps/airdrop/internal/services/solana"
	"github.com/gagliardetto/solana-go/rpc"
)

const (
	defaultSyncInterval = 100 * time.Millisecond
	defaultWaitInterval = 1 * time.Second
	defaultSlotLimit    = 1000
)

type BackfillOptions struct {
	SnapshotSlot uint64
}

type UpstreamOptions struct{}

// SolanaSync a interface running sync data from solana network.
type SolanaSync interface {
	RunBackfill(ctx context.Context, opts *BackfillOptions) error
	RunUpstream(ctx context.Context, opts *UpstreamOptions) error

	// IsSynced checks the backfill service is done
	IsSynced() bool
	GetCurrentSlot(ctx context.Context) (uint64, error)
}

var _ SolanaSync = &solanaSync{}

func NewSolanaSync(logger *slog.Logger, client *solana.Service, db *db.Database) (SolanaSync, error) {
	s := &solanaSync{
		logger:        logger,
		client:        client,
		db:            db,
		backfillSlots: queue.Queue[uint64]{},
		stopBackfill:  make(chan uint64, 1),
	}
	return s, nil
}

type solanaSync struct {
	logger        *slog.Logger
	client        *solana.Service
	db            *db.Database
	backfillSlots queue.Queue[uint64]
	synced        atomic.Bool
	stopBackfill  chan uint64
}

// GetCurrentSlot implements SolanaSync.
func (s *solanaSync) GetCurrentSlot(ctx context.Context) (uint64, error) {
	slot, err := s.client.RpcClient.GetSlot(context.Background(), rpc.CommitmentFinalized)
	if err != nil {
		return 0, err
	}
	return slot, nil
}

// IsSynced implements SolanaSync.
func (s *solanaSync) IsSynced() bool {
	return s.synced.Load()
}

// RunBackfill implements SolanaSync.
func (s *solanaSync) RunBackfill(ctx context.Context, opts *BackfillOptions) error {
	var stopSlot uint64
	// Wait for upstream task update backfillStopSlot
	waitTicker := time.NewTicker(defaultWaitInterval)
	defer waitTicker.Stop()
	done := false
	for !done {
		select {
		case <-ctx.Done():
			s.logger.Info("RunBackfill: context done")
			return nil
		case <-waitTicker.C:
			upstreamState, err := s.db.GetUpstreamState()
			if err != nil {
				s.logger.Error("RunBackfill: get upstream state failed", "err", err)
				continue
			}
			if upstreamState.StartSlot == 0 {
				continue
			}
			stopSlot = upstreamState.StartSlot
			s.logger.Info("RunBackfill: found stop slot from upstream state", "slot", stopSlot)
			done = true
		}
	}
	lastSlot, err := s.db.GetBackfillLastSlot()
	if err != nil {
		s.logger.Error("RunBackfill: get last slot failed", "err", err)
		return err
	}
	s.logger.Info("RunBackfill: last slot", "slot", lastSlot)

	startSlot := opts.SnapshotSlot
	if lastSlot != 0 {
		startSlot = lastSlot
	}
	s.logger.Info("RunBackfill: config", "start_slot", startSlot, "stop_slot", stopSlot)
	if startSlot >= stopSlot {
		return fmt.Errorf("RunBackfill: invalid startSlot:%d, stopSlot: %d", startSlot, stopSlot)
	}
	if stopSlot-startSlot <= defaultSlotLimit {
		blocks, err := s.client.GetBlocksWithLimit(ctx, startSlot, stopSlot-startSlot)
		if err != nil {
			s.logger.Error("RunBackfill: get blocks with limit failed", "err", err)
			return err
		}
		if len(blocks) <= 2 {
			s.logger.Info("RunBackfill: already synced")
			s.synced.Store(true)
			return nil
		}
	}

	// Spawms go routine for processing new slot
	go s.handleBackfillSlot(ctx)

	ticker := time.NewTicker(defaultSyncInterval)
	defer ticker.Stop()
	for {
		select {
		case <-ctx.Done():
			s.logger.Warn("RunBackfill: context done")
			return nil
		case <-ticker.C:
			blocks, err := s.client.GetBlocksWithLimit(ctx, startSlot, defaultSlotLimit)
			if err != nil {
				s.logger.Error("RunBackfill: get blocks with limit failed", "err", err)
				continue
			}
			if len(blocks) <= 1 {
				continue
			}
			for _, block := range blocks[1:] {
				if block == stopSlot {
					s.logger.Info("RunBackfill: the backfill met stop slot", "slot", block)
					s.stopBackfill <- stopSlot
					s.backfillSlots.Push(block)
					return nil
				}
				s.backfillSlots.Push(block)
			}
			startSlot = blocks[len(blocks)-1]
		}
	}
}

// RunUpstream implements SolanaSync.
func (s *solanaSync) RunUpstream(ctx context.Context, opts *UpstreamOptions) error {
	lastSlot, err := s.db.GetUpstreamLastSlot()
	if err != nil {
		s.logger.Error("RunUpstream: get last slot failed", "err", err)
		return err
	}
	s.logger.Info("RunUpstream: ", "last_slot", lastSlot)
	currentSlot, err := s.client.RpcClient.GetSlot(ctx, rpc.CommitmentFinalized)
	if err != nil {
		s.logger.Error("RunUpstream: get slot from rpc failed", "err", err)
		return err
	}
	if lastSlot != 0 {
		// Process next slot from last state
		currentSlot = lastSlot + 1
	}
	s.logger.Info("RunUpstream: ", "current_slot", currentSlot)
	isSet := false
	upstreamState, err := s.db.GetUpstreamState()
	if err != nil {
		s.logger.Error("RunUpstream: get upstream state failed", "err", err)
		return err
	}
	if upstreamState.StartSlot != 0 {
		isSet = true
	}
	ticker := time.NewTicker(defaultSyncInterval)
	defer ticker.Stop()
	for {
		select {
		case <-ctx.Done():
			s.logger.Warn("RunUpstream: context done")
			return nil
		case <-ticker.C:
			if !isSet {
				s.logger.Info("RunUpstream: setting backfill stop slot", "slot", currentSlot)
				if err := s.db.SaveUpstreamState(currentSlot); err != nil {
					s.logger.Error("RunUpstream: save upstream state failed", "err", err)
					return err
				}
				isSet = true
			}
			changes, err := s.client.GetUserBalanceChanges(ctx, currentSlot)
			if err != nil {
				if strings.Contains(err.Error(), "Block not available") {
					s.logger.Warn("RunUpstream: Block not available", "err", err)
					continue
				}
				if strings.Contains(err.Error(), "was skipped") {
					s.logger.Warn("RunUpstream: block was skipped", "err", err)
					currentSlot += 1
					continue
				}
				s.logger.Error("RunUpstream: get user balance changes error", "err", err)
				continue
			}
			if err := s.updateUpstreamChanges(changes); err != nil {
				s.logger.Error("RunUpstream: update balance changes error", "err", err)
				continue
			}
			currentSlot += 1
		}
	}
}

func (s *solanaSync) handleBackfillSlot(ctx context.Context) {
	var stop uint64
	for {
		select {
		case slot := <-s.stopBackfill:
			stop = slot
		default:
			slot, err := s.backfillSlots.Pop(ctx)
			if err != nil {
				s.logger.Error("handleBackfillSlot: pop slot error", "err", err)
				return
			}
			if slot == stop {
				s.logger.Info("The backfill was synced")
				s.synced.Store(true)
				return
			}
			s.logger.Info("Backfill: processing slot", "slot", slot)
			changes, err := s.client.GetUserBalanceChanges(ctx, slot)
			if err != nil {
				s.logger.Error("handleBackfillSlot: get user balance changes error", "err", err)
				continue
			}
			if err := s.updateBackfillChanges(changes); err != nil {
				s.logger.Error("handleBackfillSlot: update balance changes error", "err", err)
				continue
			}
		}
	}
}

func (s *solanaSync) updateBackfillChanges(changes []solana.UserBalanceChange) error {
	var userAddressList []string
	for _, change := range changes {
		userAddressList = append(userAddressList, change.Account)
	}
	currentChanges, err := s.db.GetBackfillChanges(userAddressList)
	if err != nil {
		s.logger.Error("get balance changes failed", "err", err)
		return err
	}
	// Apply changes
	newChanges := makeBackfillChanges(currentChanges, changes)
	if err := s.db.SaveBackfillChanges(newChanges); err != nil {
		s.logger.Error("save balance changes failed", "err", err)
		return err
	}
	return nil
}

func (s *solanaSync) updateUpstreamChanges(changes []solana.UserBalanceChange) error {
	var userAddressList []string
	for _, change := range changes {
		userAddressList = append(userAddressList, change.Account)
	}
	currentChanges, err := s.db.GetUpstreamChanges(userAddressList)
	if err != nil {
		s.logger.Error("get balance changes failed", "err", err)
		return err
	}
	// Apply changes
	newChanges := makeUpstreamChanges(currentChanges, changes)
	if err := s.db.SaveUpstreamChanges(newChanges); err != nil {
		s.logger.Error("save balance changes failed", "err", err)
		return err
	}
	return nil
}

func makeUpstreamChanges(currents []db.UpstreamBalanceChange, changes []solana.UserBalanceChange) []db.UpstreamBalanceChange {
	changeMap := make(map[string]db.UpstreamBalanceChange)
	for _, current := range currents {
		key := current.UserAddress + current.TokenAddress
		changeMap[key] = current
	}
	for _, change := range changes {
		solKey := change.Account + solana.DefaultSolTokenAddress
		if current, ok := changeMap[solKey]; ok {
			current.Change += change.SolChange
			changeMap[solKey] = current
		} else {
			changeMap[solKey] = db.UpstreamBalanceChange{
				UserAddress:  change.Account,
				TokenAddress: solana.DefaultSolTokenAddress,
				Change:       change.SolChange,
				LastSlot:     change.Slot,
			}
		}
		for _, tokenChange := range change.TokenChanges {
			tokenKey := change.Account + tokenChange.Mint
			if current, ok := changeMap[tokenKey]; ok {
				current.Change += tokenChange.Change
				changeMap[tokenKey] = current
			} else {
				changeMap[tokenKey] = db.UpstreamBalanceChange{
					UserAddress:  change.Account,
					TokenAddress: tokenChange.Mint,
					Change:       tokenChange.Change,
					LastSlot:     change.Slot,
				}
			}
		}
	}
	var results []db.UpstreamBalanceChange
	for _, change := range changeMap {
		results = append(results, change)
	}
	return results
}

func makeBackfillChanges(currents []db.BackfillBalanceChange, changes []solana.UserBalanceChange) []db.BackfillBalanceChange {
	changeMap := make(map[string]db.BackfillBalanceChange)
	for _, current := range currents {
		key := current.UserAddress + current.TokenAddress
		changeMap[key] = current
	}
	for _, change := range changes {
		solKey := change.Account + solana.DefaultSolTokenAddress
		if current, ok := changeMap[solKey]; ok {
			current.Change += change.SolChange
			changeMap[solKey] = current
		} else {
			changeMap[solKey] = db.BackfillBalanceChange{
				UserAddress:  change.Account,
				TokenAddress: solana.DefaultSolTokenAddress,
				Change:       change.SolChange,
				LastSlot:     change.Slot,
			}
		}
		for _, tokenChange := range change.TokenChanges {
			tokenKey := change.Account + tokenChange.Mint
			if current, ok := changeMap[tokenKey]; ok {
				current.Change += tokenChange.Change
				changeMap[tokenKey] = current
			} else {
				changeMap[tokenKey] = db.BackfillBalanceChange{
					UserAddress:  change.Account,
					TokenAddress: tokenChange.Mint,
					Change:       tokenChange.Change,
					LastSlot:     change.Slot,
				}
			}
		}
	}
	var results []db.BackfillBalanceChange
	for _, change := range changeMap {
		results = append(results, change)
	}
	return results
}
