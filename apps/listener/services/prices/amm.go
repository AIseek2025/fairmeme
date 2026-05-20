package prices

import (
	"errors"
	"fmt"
	"math/big"
)

// TradeResult holds the result of a trade operation
type TradeResult struct {
	TokenAmount uint64
	SolAmount   uint64
}

// AmmOpts holds the Automated Market Maker (AMM) values
type AmmOpts struct {
	TokenReserves *big.Int
	SolReserves   *big.Int
}

func (a AmmOpts) Validate() error {
	if a.TokenReserves.Int64() == 0 || a.SolReserves.Int64() == 0 {
		return fmt.Errorf("invalid AMM:  sol: %s, token: %s,", a.SolReserves.String(), a.TokenReserves.String())
	}
	return nil
}

// GetBuyPrice calculates the amount of tokens for a given amount of SOL
func GetBuyPrice(solAmount *big.Int, solAMM AmmOpts) (*big.Int, error) {
	if err := solAMM.Validate(); err != nil {
		return nil, err
	}
	if solAmount.Cmp(big.NewInt(0)) == 0 || solAmount.Cmp(solAMM.SolReserves) > 0 {
		return nil, errors.New("invalid sol amount")
	}

	k := new(big.Int).Mul(solAMM.TokenReserves, solAMM.SolReserves)
	newSolReserves := new(big.Int).Add(solAMM.SolReserves, solAmount)
	newTokenReserves := new(big.Int).Div(k, newSolReserves)
	tokenAmount := new(big.Int).Sub(solAMM.TokenReserves, newTokenReserves)

	return tokenAmount, nil
}

// GetSellPrice calculates the amount of SOL for a given amount of tokens
func GetSellPrice(tokenAmount *big.Int, solAMM AmmOpts) (*big.Int, error) {
	if err := solAMM.Validate(); err != nil {
		return nil, err
	}
	if tokenAmount.Cmp(big.NewInt(0)) == 0 || tokenAmount.Cmp(solAMM.TokenReserves) > 0 {
		return nil, errors.New("invalid token amount")
	}

	k := new(big.Int).Mul(solAMM.TokenReserves, solAMM.SolReserves)
	newTokenReserves := new(big.Int).Add(solAMM.TokenReserves, tokenAmount)
	newSolReserves := new(big.Int).Div(k, newTokenReserves)
	solAmount := new(big.Int).Sub(solAMM.SolReserves, newSolReserves)
	return solAmount, nil
}

func GetPrice(solAMM AmmOpts) (*big.Float, error) {
	if err := solAMM.Validate(); err != nil {
		return nil, err
	}
	tokenReserves, _ := new(big.Float).SetString(solAMM.TokenReserves.String())
	solReserves, _ := new(big.Float).SetString(solAMM.SolReserves.String())
	solAmount := new(big.Float).Quo(solReserves, tokenReserves)
	//精度差 sol是9   创建token是6
	solAmount = new(big.Float).Quo(solAmount, big.NewFloat(1000))
	return solAmount, nil
}
