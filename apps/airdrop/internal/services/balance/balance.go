package balance

import (
	"context"
)

type UserBalance struct {
	UserAddress  string
	TokenAddress string
	Balance      float64 // Balance is accouting by token decimals
}

type Provider interface {
	GetUserBalances(ctx context.Context, userAddress string) ([]UserBalance, error)
}

var _ Provider = noopBalance{}

type noopBalance struct{}

// GetUserBalances implements BalanceProvider.
func (n noopBalance) GetUserBalances(ctx context.Context, userAddress string) ([]UserBalance, error) {
	panic("unimplemented")
}
