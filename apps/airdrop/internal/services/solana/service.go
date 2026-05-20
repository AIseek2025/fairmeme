package solana

import (
	"context"
	"errors"
	"log/slog"
	"math"
	"math/big"
	"strconv"

	"github.com/fair-meme/fairmeme/apps/airdrop/internal/db"
	"github.com/fair-meme/fairmeme/apps/airdrop/internal/services/balance"
	"github.com/fair-meme/fairmeme/apps/airdrop/internal/services/chains"
	"github.com/fair-meme/fairmeme/apps/airdrop/internal/services/tokenprice"
	bin "github.com/gagliardetto/binary"
	"github.com/gagliardetto/solana-go"
	"github.com/gagliardetto/solana-go/programs/token"
	"github.com/gagliardetto/solana-go/rpc"
)

const (
	SlotDuration           = 0.4 // 0.4s
	DefaultSolTokenAddress = "SOL"
)

type Service struct {
	logger       *slog.Logger
	rpcUrl       string
	db           *db.Database
	tokenPrice   tokenprice.Provider
	trackedMints map[string]trackedMint

	RpcClient *rpc.Client
}

type trackedMint struct {
	Address  string
	Decimals int
}

// GetUserBalances implements balance.Provider.
func (s *Service) GetUserBalances(ctx context.Context, userAddress string) ([]balance.UserBalance, error) {
	userPubkey, err := solana.PublicKeyFromBase58(userAddress)
	if err != nil {
		return nil, err
	}
	var balances []balance.UserBalance
	solBalance, err := s.RpcClient.GetBalance(ctx, userPubkey, rpc.CommitmentFinalized)
	if err != nil {
		return nil, err
	}
	balances = append(balances, balance.UserBalance{
		UserAddress:  userAddress,
		TokenAddress: DefaultSolTokenAddress,
		Balance:      float64(solBalance.Value) / float64(solana.LAMPORTS_PER_SOL),
	})
	tokenResult, err := s.RpcClient.GetTokenAccountsByOwner(ctx, userPubkey, &rpc.GetTokenAccountsConfig{
		ProgramId: &solana.TokenProgramID,
	}, &rpc.GetTokenAccountsOpts{
		Encoding: solana.EncodingBase64Zstd,
	})
	if err != nil {
		return nil, err
	}
	tokenAccounts := make([]token.Account, 0)
	for _, rawAccount := range tokenResult.Value {
		var tokAcc token.Account
		data := rawAccount.Account.Data.GetBinary()
		dec := bin.NewBinDecoder(data)
		err := dec.Decode(&tokAcc)
		if err != nil {
			s.logger.Error("GetUserBalances: decode failed", "err", err)
			continue
		}
		tokenAccounts = append(tokenAccounts, tokAcc)
	}
	for _, tokenAccount := range tokenAccounts {
		decimals := s.trackedMints[tokenAccount.Mint.String()].Decimals
		balances = append(balances, balance.UserBalance{
			UserAddress:  userAddress,
			TokenAddress: tokenAccount.Mint.String(),
			Balance:      float64(tokenAccount.Amount) / (math.Pow10(decimals)),
		})
	}
	return balances, nil
}

func getTokenListFromBalances(balances []balance.UserBalance) []string {
	var tokenList []string
	for _, balance := range balances {
		if balance.TokenAddress != "" {
			tokenList = append(tokenList, balance.TokenAddress)
		}
	}
	return tokenList
}

var _ balance.Provider = &Service{}

func getTotalUSD(balances []balance.UserBalance, prices []tokenprice.Price) *big.Float {
	total := 0.0
	m := map[string]float64{}
	for _, balance := range balances {
		m[balance.TokenAddress] = balance.Balance
	}
	for _, tokenPrice := range prices {
		if balance, ok := m[tokenPrice.TokenAddress]; ok {
			total += balance * tokenPrice.PriceUSD
		}
	}
	return big.NewFloat(total)
}

type BalanceChange struct {
	UserAddress  string
	TokenAddress string
	Change       float64
	LastSlot     uint64
}

func mergeChanges(backfills []db.BackfillBalanceChange, upstreams []db.UpstreamBalanceChange) []BalanceChange {
	changeMap := make(map[string]BalanceChange)

	makeKey := func(userAddress, tokenAddress string) string {
		return userAddress + tokenAddress
	}
	for _, backfill := range backfills {
		key := makeKey(backfill.UserAddress, backfill.TokenAddress)
		changeMap[key] = BalanceChange{
			UserAddress:  backfill.UserAddress,
			TokenAddress: backfill.TokenAddress,
			Change:       backfill.Change,
			LastSlot:     backfill.LastSlot,
		}
	}
	for _, upstream := range upstreams {
		key := makeKey(upstream.UserAddress, upstream.TokenAddress)
		backfill, ok := changeMap[key]
		if !ok {
			changeMap[key] = BalanceChange{
				UserAddress:  upstream.UserAddress,
				TokenAddress: upstream.TokenAddress,
				Change:       upstream.Change,
				LastSlot:     upstream.LastSlot,
			}
		} else {
			changeMap[key] = BalanceChange{
				UserAddress:  upstream.UserAddress,
				TokenAddress: upstream.TokenAddress,
				Change:       backfill.Change + upstream.Change,
				LastSlot:     upstream.LastSlot,
			}
		}
	}
	// Convert the map back to a slice
	mergedChanges := make([]BalanceChange, 0, len(changeMap))
	for key := range changeMap {
		mergedChanges = append(mergedChanges, changeMap[key])
	}
	return mergedChanges
}

// GetTotalUSDAtBlock implements chains.ClientInterface.
func (s *Service) GetTotalUSDAtBlock(ctx context.Context, opts *chains.GetTotalUSDAtBlockOpts) (*chains.GetTotalUSDAtBlockResult, error) {
	if s.db == nil {
		return nil, errors.New("nil database")
	}
	if s.tokenPrice == nil {
		return nil, errors.New("nil price provider")
	}
	// Check user has balance changes or not
	backfillChanges, err := s.db.GetBackfillChange(opts.UserAddress)
	if err != nil {
		return nil, err
	}
	upstreamChanges, err := s.db.GetUpstreamChange(opts.UserAddress)
	if err != nil {
		return nil, err
	}

	changes := mergeChanges(backfillChanges, upstreamChanges)

	currentBalances, err := s.GetUserBalances(ctx, opts.UserAddress)
	if err != nil {
		return nil, err
	}
	// No changes so balances of user at snapshot time will same with current balances
	if len(changes) == 0 {
		if len(currentBalances) == 0 {
			return &chains.GetTotalUSDAtBlockResult{
				UserAddress: opts.UserAddress,
				TotalUSD:    big.NewFloat(0),
			}, nil
		}
		currentPrices, err := s.tokenPrice.GetTokenPrices(ctx, getTokenListFromBalances(currentBalances))
		if err != nil {
			return nil, err
		}
		s.logger.Info("GetTotalUSDAtBlock", "current_prices", currentPrices)
		return &chains.GetTotalUSDAtBlockResult{
			UserAddress: opts.UserAddress,
			TotalUSD:    getTotalUSD(currentBalances, currentPrices),
		}, nil
	}

	// Get current balances and reverse calculate balance at snapshot time
	var balancesAtSnapshot []balance.UserBalance
	for _, change := range changes {
		for _, current := range currentBalances {
			if current.UserAddress == change.UserAddress && current.TokenAddress == change.TokenAddress {
				snapshotBalance := balance.UserBalance{
					UserAddress:  current.UserAddress,
					TokenAddress: current.TokenAddress,
				}
				b := current.Balance - change.Change
				// Ignore all cases has balance negative
				if b < 0 {
					b = 0
				}
				snapshotBalance.Balance = b
				balancesAtSnapshot = append(balancesAtSnapshot, snapshotBalance)
			}
		}
	}
	pricesAtSnapshot, err := s.tokenPrice.GetTokenPrices(ctx, getTokenListFromBalances(balancesAtSnapshot))
	if err != nil {
		return nil, err
	}
	return &chains.GetTotalUSDAtBlockResult{
		UserAddress: opts.UserAddress,
		TotalUSD:    getTotalUSD(balancesAtSnapshot, pricesAtSnapshot),
	}, nil
}

// EstimateBlockAtTimestamp implements chains.ClientInterface.
func (s *Service) EstimateBlockAtTimestamp(ctx context.Context, timestamp int64) (*big.Int, error) {
	currentSlot, err := s.RpcClient.GetSlot(ctx, rpc.CommitmentFinalized)
	if err != nil {
		return nil, err
	}
	currentBlockTime, err := s.RpcClient.GetBlockTime(ctx, currentSlot)
	if err != nil {
		return nil, err
	}
	currentTimestamp := currentBlockTime.Time().Unix()
	if currentTimestamp < timestamp {
		return nil, errors.New("invalid timestamp in pasa")
	}
	diff := currentTimestamp - timestamp
	diffSlot := int64(float64(diff) / SlotDuration)
	estimatedSlot := int64(currentSlot) - diffSlot
	if estimatedSlot < 0 {
		return nil, errors.New("invalid timestamp")
	}
	return big.NewInt(int64(estimatedSlot)), nil
}

// GetChainName implements chains.ClientInterface.
func (s *Service) GetChainName() string {
	return chains.Solana
}

func NewService(logger *slog.Logger, rpcUrl string, db *db.Database, price tokenprice.Provider) (*Service, error) {
	s := &Service{
		logger:       logger,
		rpcUrl:       rpcUrl,
		RpcClient:    rpc.New(rpcUrl),
		db:           db,
		tokenPrice:   price,
		trackedMints: map[string]trackedMint{},
	}

	tokens := s.tokenPrice.SupportedTokens()
	for _, token := range tokens {
		s.trackedMints[token.Address] = trackedMint{
			Address:  token.Address,
			Decimals: token.Decimals,
		}
	}

	return s, nil
}

var _ chains.ClientInterface = &Service{}

type UserBalanceChange struct {
	Account      string
	SolChange    float64
	TokenChanges []TokenChange
	Slot         uint64
}

type TokenChange struct {
	Mint   string
	Change float64
}

func (s *Service) GetUserBalanceChanges(ctx context.Context, blockNumber uint64) ([]UserBalanceChange, error) {
	block, err := s.RpcClient.GetBlockWithOpts(ctx, blockNumber, &rpc.GetBlockOpts{
		MaxSupportedTransactionVersion: new(uint64),
	})
	if err != nil {
		return nil, err
	}

	var results []UserBalanceChange
	for _, tx := range block.Transactions {
		if tx.Meta == nil {
			continue
		}
		// ignore error tx
		if tx.Meta.Err != nil {
			continue
		}
		parsed, err := s.parseBalanceChangeFromTx(tx, blockNumber)
		if err != nil {
			continue
		}
		results = append(results, parsed...)
	}
	return results, nil
}

func (s *Service) parseBalanceChangeFromTx(txWithMeta rpc.TransactionWithMeta, slot uint64) ([]UserBalanceChange, error) {
	var results []UserBalanceChange
	tx, err := txWithMeta.GetTransaction()
	if err != nil {
		s.logger.Error("get parsed transaction failed", "err", err)
		return nil, err
	}
	accounts, err := tx.AccountMetaList()
	if err != nil {
		return nil, err
	}
	for _, account := range accounts {
		// Ignore program addresses
		if _, ok := ProgramAccount[account.PublicKey.String()]; ok {
			continue
		}
		accountIndex, err := tx.GetAccountIndex(account.PublicKey)
		if err != nil {
			s.logger.Error("get account index failed", "err", err)
			continue
		}
		preSol := txWithMeta.Meta.PreBalances[accountIndex]
		postSol := txWithMeta.Meta.PostBalances[accountIndex]
		solChange := (float64(postSol) - float64(preSol)) / float64(solana.LAMPORTS_PER_SOL)
		// Ignore no change
		if solChange == 0 {
			continue
		}
		results = append(results, UserBalanceChange{
			Account:      account.PublicKey.String(),
			SolChange:    solChange,
			TokenChanges: s.getTokenChanges(accountIndex, txWithMeta),
			Slot:         slot, // Because the slot in meta not available for latest rpc
		})
	}
	return results, nil
}

func (s *Service) getTokenChanges(accountIndex uint16, tx rpc.TransactionWithMeta) []TokenChange {
	preBalances := make(map[string]*rpc.TokenBalance)
	postBalances := make(map[string]*rpc.TokenBalance)
	for _, pre := range tx.Meta.PreTokenBalances {
		if pre.AccountIndex == accountIndex {
			preBalances[pre.Mint.String()] = &pre
		}
	}
	for _, post := range tx.Meta.PostTokenBalances {
		if post.AccountIndex == accountIndex {
			postBalances[post.Mint.String()] = &post
		}
	}
	var results []TokenChange

	for mint, pre := range preBalances {
		if _, ok := s.trackedMints[mint]; !ok {
			continue
		}
		if post, ok := postBalances[mint]; ok {
			postAmount, err := strconv.ParseFloat(post.UiTokenAmount.UiAmountString, 64)
			if err != nil {
				s.logger.Error("ParseFloat error", "err", err, "data", post.UiTokenAmount.UiAmountString)
				continue
			}
			preAmount, err := strconv.ParseFloat(pre.UiTokenAmount.UiAmountString, 64)
			if err != nil {
				s.logger.Error("ParseFloat error", "err", err, "data", pre.UiTokenAmount.UiAmountString)
				continue
			}
			change := postAmount - preAmount
			if change == 0 {
				continue
			}
			results = append(results, TokenChange{
				Mint:   pre.Mint.String(),
				Change: change,
			})
		}
	}
	return results
}

func (s *Service) GetBlocksWithLimit(ctx context.Context, startSlot uint64, limit uint64) ([]uint64, error) {
	result, err := s.RpcClient.GetBlocksWithLimit(ctx, startSlot, limit, rpc.CommitmentFinalized)
	if err != nil {
		return nil, err
	}
	if result == nil {
		return nil, errors.New("blocks nil")
	}
	return *result, nil
}
