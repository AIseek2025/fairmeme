package contract

import (
	contract "github.com/fair-meme/fairmeme/apps/listener/contract/abi"
	"github.com/fair-meme/fairmeme/apps/listener/global"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
)

func getTokenContract(tokenAddress string) *contract.Token {

	tokenContract, err := contract.NewToken(common.HexToAddress(tokenAddress), global.App.EthRPCClient)
	if err != nil {
		fmt.Println("get enzo contract err:", err)
	}
	return tokenContract
}
func GetMarketCap(tokenAddress string) {
	//getTokenContract(tokenAddress).BalanceOf(nil)
}
