package utils

import (
	"github.com/fair-meme/fairmeme/apps/api/internal/config"
	contract "github.com/fair-meme/fairmeme/apps/api/internal/contract/abi"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"math/big"
)

const (
	ChainLinkEthAddress = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"
	ChainLinkSolAddress = "0x4ffC43a60e009B551865A93d232E33Fce9f01507"
)

var ChainLinkClient *ethclient.Client

func NewChainLinkClient() {
	var err error
	ChainLinkClient, err = ethclient.Dial(config.Get().ChainLink.Url)
	if err != nil {
		fmt.Println("chain link client.Dial error : ", err)
		//os.Exit(0)
	}
}

func getChainLinkContractSolPrice() *contract.SolPrice {
	if ChainLinkClient == nil {
		NewChainLinkClient()
	}
	chainLinkContract, err := contract.NewSolPrice(common.HexToAddress(ChainLinkSolAddress), ChainLinkClient)
	if err != nil {
		fmt.Println("get enzo contract err:", err)
	}
	return chainLinkContract
}

func GetSolPriceByChainLink() (*big.Int, error) {
	price, err := getChainLinkContractSolPrice().LatestAnswer(nil)
	if err != nil {
		fmt.Println("GetEthPriceByChainLink err:", err)
		return nil, err
	}
	return price, nil
}
