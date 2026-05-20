package contract

import (
	"context"
	contract "github.com/fair-meme/fairmeme/apps/listener/contract/abi"
	"github.com/fair-meme/fairmeme/apps/listener/global"
	"fmt"
	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"math/big"
)

func getFairMemeMarketTransactor(fairMemeMarketAddress string) *contract.FairMemeMarketTransactor {
	fairMemeMarketTransactor, err := contract.NewFairMemeMarketTransactor(common.HexToAddress(fairMemeMarketAddress), global.App.EthRPCClient)
	if err != nil {
		fmt.Println("get fairMemeCoinMarket contract err:", err)
	}
	return fairMemeMarketTransactor
}

// GetPreviewETHOut 获取相对eth的价格
func GetPreviewETHOut(marketAddress common.Address) (*big.Int, error) {
	data, err := global.App.MarketAbi.Pack("previewETHOut", big.NewInt(1000000000000000000))
	if err != nil {
		fmt.Println("Error packing:", err)
		return nil, err
	}
	//marketAddress := common.HexToAddress("0x6103d43a1AAAC71B8715C3Db345A47ebA0BfcCEe")
	msg := ethereum.CallMsg{From: common.Address{}, To: &marketAddress, Data: data, GasPrice: big.NewInt(0), Value: big.NewInt(0)}
	ret, err := global.App.EthRPCClient.PendingCallContract(context.Background(), msg)
	if err != nil {
		fmt.Println("Error calling:", err)
		return nil, err
	}
	fmt.Println("string:", new(big.Int).SetBytes(ret))
	//token / 1e18 * ethPrice
	return new(big.Int).SetBytes(data), nil
}

func getMulticallTransactor(multicall string) *contract.MulticallTransactor {
	multicallTransactor, err := contract.NewMulticallTransactor(common.HexToAddress(multicall), global.App.EthRPCClient)
	if err != nil {
		fmt.Println("get multicallTransactor contract err:", err)
	}
	return multicallTransactor
}
func GetMemePrice() {
	data, err := global.App.MarketAbi.Pack("previewETHOut", big.NewInt(1000000000000000000))
	if err != nil {
		fmt.Println("Error packing:", err)
	}
	var calls []contract.MultiCallCall
	//encoded, err := bind.([]interface{}{signature, value})
	call := contract.MultiCallCall{
		Target:   common.HexToAddress("0x6103d43a1AAAC71B8715C3Db345A47ebA0BfcCEe"),
		CallData: data,
	}
	calls = append(calls, call)
	txs, err := getMulticallTransactor("0x1116c409df82bab4338cb9be35b1a46fa6433add").Aggregate(
		&bind.TransactOpts{
			From: common.Address{}, GasPrice: big.NewInt(0), Value: big.NewInt(0),
		},
		calls)
	if err != nil {
		fmt.Println("get multicallTransactor err:", err)
	}
	fmt.Println(txs)
}
