package main

import (
	"context"
	"fmt"
	"github.com/davecgh/go-spew/spew"
	"github.com/gagliardetto/solana-go"
	"github.com/gagliardetto/solana-go/rpc"
	"github.com/gagliardetto/solana-go/rpc/ws"
	"log"
	"os"
)

func main() {
	//a, b := 2.3329, 3.1234
	//
	//c := decimal.NewFromFloat(a)
	//d := decimal.NewFromFloat(b)
	//fmt.Println(a, b)
	//fmt.Println(c, d)
	//fmt.Println("此时ab 与 cd 相同")
	//
	//fmt.Println(a + b)    //5.456300000000001}
	//fmt.Println(c.Add(d)) //5.4563}
	//fmt.Println(utils.Float64Div(20, 100))
	//fmt.Println(utils.Float64Mod(20, 100))
	//client, err := ws.Connect(context.Background(), "wss://docs-demo.solana-mainnet.quiknode.pro/")

	//client, err := ws.Connect(context.Background(), "wss://api.devnet.solana.io")
	solanaWSURL := os.Getenv("SOLANA_WS_URL")
	if solanaWSURL == "" {
		log.Fatal("SOLANA_WS_URL is required")
	}
	client, err := ws.Connect(context.Background(), solanaWSURL)

	//client, err := ws.Connect(context.Background(), rpc.DevNet_WS)
	if err != nil {
		log.Fatalf("连接错误: %v", err)
	}
	defer client.Close()
	// 程序的公共密钥
	//program := solana.MustPublicKeyFromBase58("JBHnGuqyTxwbnpWiTjRqydkwSRYJFcQnwUQnLfesdRG9")
	program := solana.MustPublicKeyFromBase58("5gM8g1sucQ6prXjkpVV7FWzWLn73z6Fy7Rx9vPfZ7Pkp")

	//Subscribe to log events that mention the provided pubkey:
	fmt.Println("start lis")
	sub, err := client.LogsSubscribeMentions(
		program,
		//rpc.CommitmentProcessed,
		rpc.CommitmentFinalized,
	)
	if err != nil {
		panic(err)
	}
	defer sub.Unsubscribe()

	for {
		got, err := sub.Recv()
		if err != nil {
			panic(err)
		}
		spew.Dump(got)
	}

	//// Subscribe to all log events:
	//sub, err := client.LogsSubscribe(
	//	ws.LogsSubscribeFilterAll,
	//	rpc.CommitmentRecent,
	//)
	//if err != nil {
	//	panic(err)
	//}
	//defer sub.Unsubscribe()
	//
	//for {
	//	got, err := sub.Recv()
	//	if err != nil {
	//		panic(err)
	//	}
	//	spew.Dump(got)
	//}

}
