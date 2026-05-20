package controllers

import (
	"context"
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

// 监听event事件
// 用graph 存储事件 监听变化就行
// 通过监听事件来触发调整数据
func ReadMarketMeme() {}

// SubscribeMarketMemeCoinTxEvent 实时监听
func SubscribeMarketMemeCoinTxEvent() {
	//eventName := "OwnershipTransferred (index_topic_1 address previousOwner, index_topic_2 address newOwner)"
	marketCreated := "MarketCreated(address,address)"
	//需要使用websocket
	wssbsc := "wss://ethereum-sepolia-rpc.publicnode.com"
	contractAddress := common.HexToAddress("0x49e224FBE343b1E6F9C0c721065ac35928A9C943")
	client, err := ethclient.Dial(wssbsc)
	if err != nil {
		fmt.Printf("Failed to connect to wssbsc: %s\n", err)
	}
	//topicHash := crypto.Keccak256Hash([]byte(eventName))
	topicHash := crypto.Keccak256Hash([]byte(marketCreated))
	fmt.Println("topicHash:", topicHash)
	//过滤处理
	query := ethereum.FilterQuery{
		//FromBlock: big.NewInt(6242693),
		FromBlock: big.NewInt(6250000),
		Addresses: []common.Address{contractAddress},
		Topics:    [][]common.Hash{{topicHash}},
	}
	logs := make(chan types.Log)
	//sub, err := client.SubscribeFilterLogs(context.Background(), query, logs)
	//if err != nil {
	//	fmt.Println("failed to SubscribeFilterLogs", err)
	//	return
	//}
	sub := event.Resubscribe(2*time.Second, func(ctx context.Context) (event.Subscription, error) {
		return client.SubscribeFilterLogs(ctx, query, logs)
	})
	//订阅返回处理
	for {
		//select可以阻塞监控多个channel
		//任意一个channel有消息，select解除阻塞，并执行case内channel
		select {
		case err := <-sub.Err():
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
	client, err := ethclient.Dial("wss://ethereum-sepolia-rpc.publicnode.com")
	if err != nil {
		log.Fatal(err)
	}

	contractAddress := common.HexToAddress("0x49e224FBE343b1E6F9C0c721065ac35928A9C943")
	marketCreated := "MarketCreated(address,address)"
	topicHash := crypto.Keccak256Hash([]byte(marketCreated))
	query := ethereum.FilterQuery{
		FromBlock: big.NewInt(6242693),
		//ToBlock:   big.NewInt(2394201),
		Topics: [][]common.Hash{{topicHash}},
		Addresses: []common.Address{
			contractAddress,
		},
	}

	logs, err := client.FilterLogs(context.Background(), query)
	if err != nil {
		log.Fatal(err)
	}

	//contractAbi, err := abi.JSON(strings.NewReader(string(store.StoreABI)))
	//if err != nil {
	//	log.Fatal(err)
	//}

	for _, vLog := range logs {

		//将消息转换为json格式
		data, err := vLog.MarshalJSON()
		fmt.Println(string(data), err)

		//fmt.Println(vLog.BlockHash.Hex()) // 0x3404b8c050aa0aacd0223e91b5c32fee6400f357764771d0684fa7b3f448f1a8
		//fmt.Println(vLog.BlockNumber)     // 2394201
		//fmt.Println(vLog.TxHash.Hex())    // 0x280201eda63c9ff6f305fcee51d5eb86167fab40ca3108ec784e8652a0e2b1a6

		//event := struct {
		//	Key   [32]byte
		//	Value [32]byte
		//}{}
		//err := contractAbi.Unpack(&event, "ItemSet", vLog.Data)
		//if err != nil {
		//	log.Fatal(err)
		//}

		//fmt.Println(string(event.Key[:]))   // foo
		//fmt.Println(string(event.Value[:])) // bar

		//var topics [4]string
		//for i := range vLog.Topics {
		//	topics[i] = vLog.Topics[i].Hex()
		//}
		//
		//fmt.Println(topics[0]) // 0xe79e73da417710ae99aa2088575580a60415d359acfad9cdd3382d59c80281d4
	}

	//eventSignature := []byte("ItemSet(bytes32,bytes32)")
	//hash := crypto.Keccak256Hash(eventSignature)
	//fmt.Println(hash.Hex()) // 0xe79e73da417710ae99aa2088575580a60415d359acfad9cdd3382d59c80281d4
}
