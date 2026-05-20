package main

import (
	"context"
	"github.com/fair-meme/fairmeme/apps/listener/bootstrap"
	"github.com/fair-meme/fairmeme/apps/listener/contract"
	"github.com/fair-meme/fairmeme/apps/listener/global"
	"github.com/fair-meme/fairmeme/apps/listener/models"
	"fmt"
	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/ethereum/go-ethereum/event"
	"log"
	"math/big"
	"time"
)

const (
	buyToken  = "BuyToken(address,uint256,uint256,uint256)"
	sellToken = "SellToken(address,uint256,uint256,uint256)"
	wss       = "wss://ethereum-sepolia-rpc.publicnode.com"
)

type TxEvent struct {
	//Buyer       common.Address `json:"buyer"`
	EthAmount   *big.Int `json:"ethAmount"`
	TokenAmount *big.Int `json:"tokenAmount"`
	Timestamp   *big.Int `json:"timestamp"`
}

// 监听链上事件
func main() {
	//初始化配置
	bootstrap.InitializeConfig()

	bootstrap.InitEth()

	//init mysql
	err := bootstrap.InitializeMysql()
	if err != nil {
		panic(err)
	}
	fmt.Println("mysql init success!")
	//tokenList, err := GetTokenList()
	//if err != nil {
	//	panic(err)
	//}
	//models.CreateTransactionTable()
	//SubscribeMarketMemeCoinTxEvent("0x1f50f6141be2Feb05439dF6908D411Fb67729619")
	ReadEventFromLogs()

	//eventChan := make()

}

// 监听event事件
// 用graph 存储事件 监听变化就行
// 通过监听事件来触发调整数据

// SubscribeMarketMemeCoinTxEvent 实时监听
func SubscribeMarketMemeCoinTxEvent(marketAddress string) {
	//contractAddress := common.HexToAddress("0xbA31700B09763745a28e2b183Bc75CBeB10E9cB3")
	contractAddress := common.HexToAddress(marketAddress)
	client, err := ethclient.Dial(wss)
	if err != nil {
		fmt.Printf("Failed to connect to wssbsc: %s\n", err)
		panic(err)
	}
	topicBuyToken := crypto.Keccak256Hash([]byte(buyToken))
	topicSellToken := crypto.Keccak256Hash([]byte(sellToken))
	fmt.Println("topicBuyToken:", topicBuyToken)
	fmt.Println("topicSellToken:", topicSellToken)
	//过滤处理
	query := ethereum.FilterQuery{
		FromBlock: big.NewInt(6308400),
		Addresses: []common.Address{contractAddress},
		Topics:    [][]common.Hash{{topicBuyToken, topicSellToken}},
	}
	logs := make(chan types.Log)
	sub := event.Resubscribe(2*time.Second, func(ctx context.Context) (event.Subscription, error) {
		return client.SubscribeFilterLogs(ctx, query, logs)
	})
	//订阅返回处理
	for {
		//select可以阻塞监控多个channel
		//任意一个channel有消息，select解除阻塞，并执行case内channel
		select {
		case err = <-sub.Err():
			fmt.Println("get sub err", err)
			//会异常关闭
		case vLog := <-logs:
			//将消息转换为json格式
			data, err := vLog.MarshalJSON()
			fmt.Println(string(data), err)
		}
	}
}

// ReadEventFromLogs 从logs中查找
func ReadEventFromLogs() {
	client, err := ethclient.Dial(wss)
	if err != nil {
		log.Fatal(err)
	}
	//contractAddress := common.HexToAddress("0xbA31700B09763745a28e2b183Bc75CBeB10E9cB3")
	contractAddress := common.HexToAddress("0x1f50f6141be2Feb05439dF6908D411Fb67729619")
	topicBuyToken := crypto.Keccak256Hash([]byte(buyToken))
	topicSellToken := crypto.Keccak256Hash([]byte(sellToken))
	fmt.Println("topicBuyToken:", topicBuyToken)
	fmt.Println("topicSellToken:", topicSellToken)
	query := ethereum.FilterQuery{
		FromBlock: big.NewInt(
			6308400),
		//ToBlock:   big.NewInt(2394201),
		Topics: [][]common.Hash{{topicBuyToken, topicSellToken}}, //, {topicSellToken}
		Addresses: []common.Address{
			contractAddress,
		},
	}

	logs, err := client.FilterLogs(context.Background(), query)
	if err != nil {
		fmt.Println("FilterLogs err", err)
	}

	for _, vLog := range logs {
		//将消息转换为json格式
		data, err := vLog.MarshalJSON()
		fmt.Println(string(data), err)
		//0是方法
		//1是from 地址
		address := common.HexToAddress(vLog.Topics[1].Hex())
		txType := 0
		eventName := ""
		if vLog.Topics[0] == topicBuyToken {
			fmt.Println("买 address:", address)
			eventName = "BuyToken"
			txType = 1
		} else if vLog.Topics[0] == topicSellToken {
			fmt.Println("卖 address:", address)
			txType = 2
			eventName = "BuyToken"
		}
		event := ByteToTxEvent(vLog.Data, eventName)
		fmt.Println("交易信息:", event)
		fmt.Println("txType:", txType)
		//type Transaction struct {
		//	Id            uint64  `json:"id"`
		//	Address       string  `json:"address"`
		//	MarketAddress string  `json:"market_address"`
		//	TxHash        string  `json:"tx_hash"`
		//	TxType        int     `json:"tx_type"` //1买 2卖
		//	Count         float64 `json:"Count"`
		//	EthPrice      float64 `json:"eth_price"`
		//	Amount        float64 `json:"amount"`
		//	CreateTime    uint64  `json:"create_time"`
		//}
		ethPrice, err := contract.GetEthPriceByChainLink()
		if err != nil {
			fmt.Println(err)
		}
		fEthPrice := new(big.Float).SetInt(ethPrice)
		unit8, _ := new(big.Float).SetString("100000000")
		unit18, _ := new(big.Float).SetString("1000000000000000000")
		fEthPrice = fEthPrice.Quo(fEthPrice, unit8)
		fmt.Println("fEthPrice:", fEthPrice)
		fEthAmount := new(big.Float).SetInt(event.EthAmount)
		fEthAmount = fEthAmount.Quo(fEthAmount, unit18)
		fEthAmount = fEthAmount.Mul(fEthAmount, fEthPrice)
		tx := models.Transaction{
			Address:       address.Hex(),
			MarketAddress: vLog.Address.Hex(),
			TxHash:        vLog.TxHash.Hex(),
			TxType:        txType,
		}
		fmt.Println("tx:", tx)
	}

}

// ByteToTxEvent "SellToken" "BuyToken"
func ByteToTxEvent(bytes []byte, name string) TxEvent {
	txEvent := TxEvent{}
	err := global.App.MarketAbi.UnpackIntoInterface(&txEvent, name, bytes) //(&EventReserve, vLog.Data)
	if err != nil {
		//log.Fatal(err)
		fmt.Println("UnpackIntoInterface eventReserve err", err)
	}
	//fmt.Println("er", eventReserve)
	return txEvent
}
