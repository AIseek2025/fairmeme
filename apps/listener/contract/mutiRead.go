package contract

import (
	"context"
	"github.com/fair-meme/fairmeme/apps/listener/global"
	"github.com/fair-meme/fairmeme/apps/listener/models"
	"fmt"
	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"math/big"
	"time"
)

var contractAbi = `[
    {
        "outputs": [
            {
                "components": [
                    {
                        "name": "cToken",
                        "internalType": "address",
                        "type": "address"
                    },
                    {
                        "name": "balanceOf",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "borrowBalanceCurrent",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "balanceOfUnderlying",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "tokenBalance",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "tokenAllowance",
                        "internalType": "uint256",
                        "type": "uint256"
                    }
                ],
                "name": "",
                "internalType": "struct CompoundLens.CTokenBalances",
                "type": "tuple"
            }
        ],
        "inputs": [
            {
                "indexed": false,
                "name": "cToken",
                "internalType": "contract EToken",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "account",
                "internalType": "address payable",
                "type": "address"
            }
        ],
        "name": "cTokenBalances",
        "anonymous": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "outputs": [
            {
                "components": [
                    {
                        "name": "cToken",
                        "internalType": "address",
                        "type": "address"
                    },
                    {
                        "name": "balanceOf",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "borrowBalanceCurrent",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "balanceOfUnderlying",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "tokenBalance",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "tokenAllowance",
                        "internalType": "uint256",
                        "type": "uint256"
                    }
                ],
                "name": "",
                "internalType": "struct CompoundLens.CTokenBalances[]",
                "type": "tuple[]"
            }
        ],
        "inputs": [
            {
                "indexed": false,
                "name": "cTokens",
                "internalType": "contract EToken[]",
                "type": "address[]"
            },
            {
                "indexed": false,
                "name": "account",
                "internalType": "address payable",
                "type": "address"
            }
        ],
        "name": "cTokenBalancesAll",
        "anonymous": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "outputs": [
            {
                "components": [
                    {
                        "name": "cToken",
                        "internalType": "address",
                        "type": "address"
                    },
                    {
                        "name": "exchangeRateCurrent",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "supplyRatePerBlock",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "borrowRatePerBlock",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "reserveFactorMantissa",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "totalBorrows",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "totalReserves",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "totalSupply",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "totalCash",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "isListed",
                        "internalType": "bool",
                        "type": "bool"
                    },
                    {
                        "name": "collateralFactorMantissa",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "underlyingAssetAddress",
                        "internalType": "address",
                        "type": "address"
                    },
                    {
                        "name": "cTokenDecimals",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "underlyingDecimals",
                        "internalType": "uint256",
                        "type": "uint256"
                    }
                ],
                "name": "",
                "internalType": "struct CompoundLens.CTokenMetadata",
                "type": "tuple"
            }
        ],
        "inputs": [
            {
                "indexed": false,
                "name": "cToken",
                "internalType": "contract EToken",
                "type": "address"
            }
        ],
        "name": "cTokenMetadata",
        "anonymous": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "outputs": [
            {
                "components": [
                    {
                        "name": "cToken",
                        "internalType": "address",
                        "type": "address"
                    },
                    {
                        "name": "exchangeRateCurrent",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "supplyRatePerBlock",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "borrowRatePerBlock",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "reserveFactorMantissa",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "totalBorrows",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "totalReserves",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "totalSupply",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "totalCash",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "isListed",
                        "internalType": "bool",
                        "type": "bool"
                    },
                    {
                        "name": "collateralFactorMantissa",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "underlyingAssetAddress",
                        "internalType": "address",
                        "type": "address"
                    },
                    {
                        "name": "cTokenDecimals",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "underlyingDecimals",
                        "internalType": "uint256",
                        "type": "uint256"
                    }
                ],
                "name": "",
                "internalType": "struct CompoundLens.CTokenMetadata[]",
                "type": "tuple[]"
            }
        ],
        "inputs": [
            {
                "indexed": false,
                "name": "cTokens",
                "internalType": "contract EToken[]",
                "type": "address[]"
            }
        ],
        "name": "cTokenMetadataAll",
        "anonymous": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "outputs": [
            {
                "name": "collateralFactorMantissa",
                "internalType": "uint256",
                "type": "uint256"
            },
            {
                "name": "exchangeRateCurrent",
                "internalType": "uint256",
                "type": "uint256"
            },
            {
                "name": "supplyRatePerBlock",
                "internalType": "uint256",
                "type": "uint256"
            },
            {
                "name": "borrowRatePerBlock",
                "internalType": "uint256",
                "type": "uint256"
            },
            {
                "name": "reserveFactorMantissa",
                "internalType": "uint256",
                "type": "uint256"
            },
            {
                "name": "totalBorrows",
                "internalType": "uint256",
                "type": "uint256"
            },
            {
                "name": "totalReserves",
                "internalType": "uint256",
                "type": "uint256"
            },
            {
                "name": "totalSupply",
                "internalType": "uint256",
                "type": "uint256"
            },
            {
                "name": "totalCash",
                "internalType": "uint256",
                "type": "uint256"
            },
            {
                "name": "isListed",
                "internalType": "bool",
                "type": "bool"
            },
            {
                "name": "underlyingAssetAddress",
                "internalType": "address",
                "type": "address"
            },
            {
                "name": "underlyingDecimals",
                "internalType": "uint256",
                "type": "uint256"
            }
        ],
        "inputs": [
            {
                "indexed": false,
                "name": "cToken",
                "internalType": "contract EToken",
                "type": "address"
            }
        ],
        "name": "cTokenMetadataExpand",
        "anonymous": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "outputs": [
            {
                "components": [
                    {
                        "name": "cToken",
                        "internalType": "address",
                        "type": "address"
                    },
                    {
                        "name": "underlyingPrice",
                        "internalType": "uint256",
                        "type": "uint256"
                    }
                ],
                "name": "",
                "internalType": "struct CompoundLens.CTokenUnderlyingPrice",
                "type": "tuple"
            }
        ],
        "inputs": [
            {
                "indexed": false,
                "name": "cToken",
                "internalType": "contract CToken",
                "type": "address"
            }
        ],
        "name": "cTokenUnderlyingPrice",
        "anonymous": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "outputs": [
            {
                "components": [
                    {
                        "name": "cToken",
                        "internalType": "address",
                        "type": "address"
                    },
                    {
                        "name": "underlyingPrice",
                        "internalType": "uint256",
                        "type": "uint256"
                    }
                ],
                "name": "",
                "internalType": "struct CompoundLens.CTokenUnderlyingPrice[]",
                "type": "tuple[]"
            }
        ],
        "inputs": [
            {
                "indexed": false,
                "name": "cTokens",
                "internalType": "contract CToken[]",
                "type": "address[]"
            }
        ],
        "name": "cTokenUnderlyingPriceAll",
        "anonymous": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "outputs": [
            {
                "components": [
                    {
                        "name": "markets",
                        "internalType": "contract CToken[]",
                        "type": "address[]"
                    },
                    {
                        "name": "liquidity",
                        "internalType": "uint256",
                        "type": "uint256"
                    },
                    {
                        "name": "shortfall",
                        "internalType": "uint256",
                        "type": "uint256"
                    }
                ],
                "name": "",
                "internalType": "struct CompoundLens.AccountLimits",
                "type": "tuple"
            }
        ],
        "inputs": [
            {
                "indexed": false,
                "name": "comptroller",
                "internalType": "contract ComptrollerLensInterface",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "account",
                "internalType": "address",
                "type": "address"
            }
        ],
        "name": "getAccountLimits",
        "anonymous": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "outputs": [
            {
                "name": "liquidity",
                "internalType": "uint256",
                "type": "uint256"
            },
            {
                "name": "shortfall",
                "internalType": "uint256",
                "type": "uint256"
            },
            {
                "name": "markets",
                "internalType": "contract CToken[]",
                "type": "address[]"
            }
        ],
        "inputs": [
            {
                "indexed": false,
                "name": "comptroller",
                "internalType": "contract ComptrollerLensInterface",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "account",
                "internalType": "address",
                "type": "address"
            }
        ],
        "name": "getAccountLimitsExpand",
        "anonymous": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "outputs": [
            {
                "name": "balance",
                "internalType": "uint256",
                "type": "uint256"
            },
            {
                "name": "allocated",
                "internalType": "uint256",
                "type": "uint256"
            }
        ],
        "inputs": [
            {
                "indexed": false,
                "name": "comp",
                "internalType": "contract EIP20Interface",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "comptroller",
                "internalType": "contract ComptrollerLensInterface",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "account",
                "internalType": "address",
                "type": "address"
            }
        ],
        "name": "getCompBalanceWithAccrued",
        "anonymous": false,
        "stateMutability": "view",
        "type": "function"
    }
]`

type output struct {
	Amount *big.Int
}

func ReadAllMemeCoinPrice() {
	//先从数据库中查询到所有memeMarket
	list, err := models.GetTokenList()
	if err != nil {
		fmt.Println(err)
		return
	}
	var addressList []common.Address
	for _, token := range list {
		addressList = append(addressList, common.HexToAddress(token.MarketAddress))
	}
	coin, err := GetEthPrice()
	if err != nil {
		fmt.Println(err)
		return
	}
	ethPrice, _ := new(big.Float).SetString(coin.PriceUsd)
	//1179762221 / 1e18
	//1179762221 / 1e18 * 4000
	//0.00000471904
	ether, _ := new(big.Float).SetString("1000000000000000000")
	timeStamp := time.Now().Unix()
	//var tokenPriceList []models.TokenPrice
	amountList := SplitCall(addressList)
	for i, amount := range amountList {
		temp, _ := new(big.Float).SetString(amount.String())
		temp = temp.Mul(temp, ethPrice)
		temp = temp.Quo(temp, ether)

		//ishave, err := models.CheckPriceTable(list[i].TokenName, list[i].MarketAddress)
		//if err != nil {
		//	fmt.Println("CheckPriceTable ", addressList[i].Hex(), "err:", err)
		//	continue
		//}
		//if !ishave {
		//	err = models.CreatePriceTable(list[i].TokenName, list[i].MarketAddress)
		//	if err != nil {
		//		fmt.Println("CreatePriceTable ", addressList[i].Hex(), "err:", err)
		//	}
		//	continue
		//}
		err = models.CreatePrice(list[i].TokenName, list[i].MarketAddress, models.Price{
			Price:     fmt.Sprintf("%.18f", temp),
			Timestamp: timeStamp,
		})
		if err != nil {
			fmt.Println("CreatePrice", addressList[i].Hex(), "err:", err)
		}

	}
}

func SplitCall(addressList []common.Address) []*big.Float {
	current := 0
	split := 100
	var totalAllocated []*big.Float
	var tempList []*big.Float
	for {
		if current+split > len(addressList)-1 {
			tempList, _ = GetPreviewETHOutListByMultiCall(addressList[current:])
			totalAllocated = append(totalAllocated, tempList...)
			break
		}
		tempList, _ = GetPreviewETHOutListByMultiCall(addressList[current : current+split])
		totalAllocated = append(totalAllocated, tempList...)
		current += split
	}
	return totalAllocated
}

type Coin struct {
	Symbol   string `json:"symbol"`
	Name     string `json:"name"`
	PriceUsd string `json:"priceUsd"`
}

type Call struct {
	Target   common.Address
	CallData *[]byte
}

var (
	BytesSlice, _ = abi.NewType("bytes[]", "", nil)
	Uint256, _    = abi.NewType("uint256", "", nil)
)

type CallResult struct {
	BlockNumber *big.Int
	ReturnData  [][]byte
}

func GetPreviewETHOutListByMultiCall(marketAddressList []common.Address) ([]*big.Float, error) {

	marketData, err := global.App.MarketAbi.Pack("previewETHOut", big.NewInt(1000000000000000000))
	if err != nil {
		fmt.Println("Error packing:", err)
		return nil, err
	}
	calls := []Call{}
	for _, marketAddress := range marketAddressList {
		calls = append(calls, Call{marketAddress, &marketData})
	}

	data, err := global.App.MultiCallAbi.Pack("aggregate", calls)
	if err != nil {
		fmt.Println("Error packing:", err)
		return nil, err
	}
	multicallContract := common.HexToAddress("0x1116C409DF82bAB4338Cb9bE35b1a46FA6433add")
	msg := ethereum.CallMsg{From: common.Address{}, To: &multicallContract, Data: data, GasPrice: big.NewInt(0), Value: big.NewInt(0)}
	res, err := global.App.EthRPCClient.PendingCallContract(context.Background(), msg)

	if err != nil {
		fmt.Println("Error calling:", err)
		return nil, err
	}
	//fmt.Println("string:", common.Bytes2Hex(res))

	// (uint256 blockNumber, bytes[] memory returnData)
	a := abi.Arguments{abi.Argument{Type: Uint256}, abi.Argument{Type: BytesSlice}}
	//for i := 0; i < len(marketAddressList); i++ {
	//	a = append(a, abi.Argument{Type: BytesSlice})
	//}
	//fmt.Println("a:", a)
	unpackData, err := a.Unpack(res)
	if err != nil {
		fmt.Println("Error unpacking:", err)
		return nil, err
	}
	var result CallResult
	if blockNumber, ok := unpackData[0].(*big.Int); ok {
		result.BlockNumber = blockNumber
	} else {
		fmt.Println("Type assertion for BlockNumber failed")
		return nil, err
	}

	if returnData, ok := unpackData[1].([][]byte); ok {
		result.ReturnData = returnData
	} else {
		fmt.Println("Type assertion for ReturnData failed")
		return nil, err
	}
	var amountList []*big.Float
	for _, returnData := range result.ReturnData {
		priceNumber := new(big.Int)
		fmt.Println("BlockNumber:", result.BlockNumber)
		fmt.Println("ReturnData:", common.Bytes2Hex(returnData))
		priceNumber, _ = priceNumber.SetString(common.Bytes2Hex(returnData)[2:], 16)
		fmt.Println("ReturnData hex to bit int:", priceNumber)
		amountList = append(amountList, new(big.Float).SetInt(priceNumber))
	}

	return amountList, nil
}
