package contract

import (
	contract "github.com/fair-meme/fairmeme/apps/listener/contract/abi"
	"github.com/fair-meme/fairmeme/apps/listener/global"
	"encoding/json"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"io/ioutil"
	"log"
	"math/big"
	"net/http"
)

const (
	ChainLinkEthAddress = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"
	ChainLinkSolAddress = "0x4ffC43a60e009B551865A93d232E33Fce9f01507"
)

func getChainLinkContractEthPrice() *contract.EthPrice {
	chainLinkContract, err := contract.NewEthPrice(common.HexToAddress(ChainLinkEthAddress), global.App.ChainLinkClient)
	if err != nil {
		fmt.Println("get enzo contract err:", err)
	}
	return chainLinkContract
}

// GetEthPrice 交易所获取eth价格
func GetEthPrice() (Coin, error) {
	url := "http://api.coincap.io/v2/assets/" + "ethereum"
	method := "GET"
	client := &http.Client{}
	req, err := http.NewRequest(method, url, nil)

	type Res struct {
		Data      Coin    `json:"data"`
		Timestamp float64 `json:"timestamp"`
	}

	if err != nil {
		fmt.Println(err)
		return Coin{}, err
	}
	res, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return Coin{}, err
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err)
		return Coin{}, err
	}
	//fmt.Println(string(body))
	bodystr := string(body)
	var btcRes Res
	err = json.Unmarshal([]byte(bodystr), &btcRes)
	if err != nil {
		log.Fatal(err)
		return Coin{}, err
	}
	//fmt.Printf("BTC price: %f USD\n", btcRes.Data["priceUsd"])
	fmt.Printf("ETH price: %s USD\n", btcRes.Data.PriceUsd)
	return btcRes.Data, nil

}
func GetEthPriceByChainLink() (*big.Int, error) {
	price, err := getChainLinkContractEthPrice().LatestAnswer(nil)
	if err != nil {
		fmt.Println("GetEthPriceByChainLink err:", err)
		return nil, err
	}
	return price, nil
}
func getChainLinkContractSolPrice() *contract.SolPrice {
	chainLinkContract, err := contract.NewSolPrice(common.HexToAddress(ChainLinkSolAddress), global.App.ChainLinkClient)
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
