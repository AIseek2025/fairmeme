package contract

import (
	contract "github.com/fair-meme/fairmeme/apps/listener/contract/abi"
	"github.com/fair-meme/fairmeme/apps/listener/global"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
)

const (
	fairMemeFactoryAddress = "0x50e323cb01027532f79289c522cda6a628670e34"
)

//	func sen() {
//		msg := ethereum.CallMsg{From: common.Address{}, To: &q.Address, Data: data, GasPrice: big.NewInt(0), Value: big.NewInt(0)}
//		ret, err := client.PendingCallContract(context.Background(), msg)
//	}
func getFairMemeFactoryContract() *contract.FairMemeFactoryCaller {
	fairMemeFactoryContract, err := contract.NewFairMemeFactoryCaller(common.HexToAddress(fairMemeFactoryAddress), global.App.EthRPCClient)
	if err != nil {
		fmt.Println("get FairMemeFactory contract err:", err)
	}
	return fairMemeFactoryContract
}
