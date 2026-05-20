package bootstrap

import (
	"fmt"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/fair-meme/fairmeme/apps/listener/global"
	"github.com/gagliardetto/solana-go/rpc"
	"io"
	"os"
	"strings"

	"github.com/ethereum/go-ethereum/ethclient"
)

const (
	defaultEthURL       = "https://ethereum-rpc.publicnode.com"
	defaultChainLinkURL = "https://rpc.payload.de"
	defaultSolanaURL    = "https://api.devnet.solana.com"
)

func InitEth() {
	var err error
	ethURL := firstNonEmpty(os.Getenv("ETHEREUM_RPC_URL"), global.App.Config.Chains.EthereumRPC, defaultEthURL)
	chainLinkURL := firstNonEmpty(os.Getenv("CHAINLINK_RPC_URL"), global.App.Config.Chains.ChainlinkRPC, defaultChainLinkURL)
	solanaURL := firstNonEmpty(os.Getenv("SOLANA_RPC_URL"), global.App.Config.Chains.SolanaRPC, defaultSolanaURL)
	global.App.EthRPCClient, err = ethclient.Dial(ethURL)
	if err != nil {
		fmt.Println("eth client.Dial error : ", err)
		//os.Exit(0)
	}
	global.App.ChainLinkClient, err = ethclient.Dial(chainLinkURL)
	if err != nil {
		fmt.Println("chain link client.Dial error : ", err)
		//os.Exit(0)
	}
	global.App.SolRPC = rpc.New(solanaURL)
	if err != nil {
		fmt.Println("ws client.Dial error : ", err)
	}

	global.App.MarketAbi, err = ReadFairMemeMarketAbi()
	if err != nil {
		fmt.Println("ReadFairMemeMarketAbi error : ", err)
		//os.Exit(0)
	}
	global.App.MultiCallAbi, err = ReadMultiCallAbi()
	if err != nil {
		fmt.Println("ReadMultiCallAbi error : ", err)
		//os.Exit(0)
	}
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if value != "" {
			return value
		}
	}
	return ""
}
func ReadFairMemeMarketAbi() (*abi.ABI, error) {
	p, err := os.Getwd()
	if err != nil {
		fmt.Println("GetPreviewTokenOut os.Getwd err:", err)
		return nil, err
	}
	file, err := os.Open(p + "/contract/abi/FairMemeMarket.json")
	if err != nil {
		fmt.Println("Error opening file:", err)
		return nil, err
	}
	defer file.Close()
	// 读取 ABI JSON 文件内容
	AbiData, err := io.ReadAll(file)
	if err != nil {
		fmt.Println("Error reading file:", err)
		return nil, err
	}
	// 解析 ABI JSON 文件
	cAbi, err := abi.JSON(strings.NewReader(string(AbiData)))
	if err != nil {
		fmt.Println("Error parsing ABI:", err)
		return nil, err
	}
	return &cAbi, nil
}

func ReadMultiCallAbi() (*abi.ABI, error) {
	p, err := os.Getwd()
	if err != nil {
		fmt.Println("ReadMultiCallAbi os.Getwd err:", err)
		return nil, err
	}
	file, err := os.Open(p + "/contract/abi/multicall.json")
	if err != nil {
		fmt.Println("Error opening file:", err)
		return nil, err
	}
	defer file.Close()
	// 读取 ABI JSON 文件内容
	AbiData, err := io.ReadAll(file)
	if err != nil {
		fmt.Println("Error reading file:", err)
		return nil, err
	}
	// 解析 ABI JSON 文件
	cAbi, err := abi.JSON(strings.NewReader(string(AbiData)))
	if err != nil {
		fmt.Println("Error parsing ABI:", err)
		return nil, err
	}
	return &cAbi, nil
}
