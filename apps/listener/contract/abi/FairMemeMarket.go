// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package contract

import (
	"errors"
	"math/big"
	"strings"

	ethereum "github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/event"
)

// Reference imports to suppress errors if they are not otherwise used.
var (
	_ = errors.New
	_ = big.NewInt
	_ = strings.NewReader
	_ = ethereum.NotFound
	_ = bind.Bind
	_ = common.Big1
	_ = types.BloomLookup
	_ = event.NewSubscription
)

// FairMemeMarketMetaData contains all meta data concerning the FairMemeMarket contract.
var FairMemeMarketMetaData = &bind.MetaData{
	ABI: "[{\"type\":\"constructor\",\"inputs\":[{\"name\":\"_tokenAddress\",\"type\":\"address\",\"internalType\":\"address\"},{\"name\":\"_sablierNFTStream\",\"type\":\"address\",\"internalType\":\"address\"}],\"stateMutability\":\"nonpayable\"},{\"type\":\"receive\",\"stateMutability\":\"payable\"},{\"type\":\"function\",\"name\":\"buyToken\",\"inputs\":[],\"outputs\":[],\"stateMutability\":\"payable\"},{\"type\":\"function\",\"name\":\"previewETHOut\",\"inputs\":[{\"name\":\"amount\",\"type\":\"uint256\",\"internalType\":\"uint256\"}],\"outputs\":[{\"name\":\"\",\"type\":\"uint256\",\"internalType\":\"uint256\"}],\"stateMutability\":\"nonpayable\"},{\"type\":\"function\",\"name\":\"previewTokenOut\",\"inputs\":[{\"name\":\"amount\",\"type\":\"uint256\",\"internalType\":\"uint256\"}],\"outputs\":[{\"name\":\"\",\"type\":\"uint256\",\"internalType\":\"uint256\"}],\"stateMutability\":\"nonpayable\"},{\"type\":\"function\",\"name\":\"sablierNFTStream\",\"inputs\":[],\"outputs\":[{\"name\":\"\",\"type\":\"address\",\"internalType\":\"address\"}],\"stateMutability\":\"view\"},{\"type\":\"function\",\"name\":\"sablierStreamId\",\"inputs\":[],\"outputs\":[{\"name\":\"\",\"type\":\"uint256\",\"internalType\":\"uint256\"}],\"stateMutability\":\"view\"},{\"type\":\"function\",\"name\":\"sellToken\",\"inputs\":[{\"name\":\"amount\",\"type\":\"uint256\",\"internalType\":\"uint256\"}],\"outputs\":[],\"stateMutability\":\"nonpayable\"},{\"type\":\"function\",\"name\":\"setStreamId\",\"inputs\":[{\"name\":\"_streamId\",\"type\":\"uint256\",\"internalType\":\"uint256\"}],\"outputs\":[],\"stateMutability\":\"nonpayable\"},{\"type\":\"function\",\"name\":\"tokenAddress\",\"inputs\":[],\"outputs\":[{\"name\":\"\",\"type\":\"address\",\"internalType\":\"address\"}],\"stateMutability\":\"view\"}]",
}

// FairMemeMarketABI is the input ABI used to generate the binding from.
// Deprecated: Use FairMemeMarketMetaData.ABI instead.
var FairMemeMarketABI = FairMemeMarketMetaData.ABI

// FairMemeMarket is an auto generated Go binding around an Ethereum contract.
type FairMemeMarket struct {
	FairMemeMarketCaller     // Read-only binding to the contract
	FairMemeMarketTransactor // Write-only binding to the contract
	FairMemeMarketFilterer   // Log filterer for contract events
}

// FairMemeMarketCaller is an auto generated read-only Go binding around an Ethereum contract.
type FairMemeMarketCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FairMemeMarketTransactor is an auto generated write-only Go binding around an Ethereum contract.
type FairMemeMarketTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FairMemeMarketFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type FairMemeMarketFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FairMemeMarketSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type FairMemeMarketSession struct {
	Contract     *FairMemeMarket  // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// FairMemeMarketCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type FairMemeMarketCallerSession struct {
	Contract *FairMemeMarketCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts          // Call options to use throughout this session
}

// FairMemeMarketTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type FairMemeMarketTransactorSession struct {
	Contract     *FairMemeMarketTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts          // Transaction auth options to use throughout this session
}

// FairMemeMarketRaw is an auto generated low-level Go binding around an Ethereum contract.
type FairMemeMarketRaw struct {
	Contract *FairMemeMarket // Generic contract binding to access the raw methods on
}

// FairMemeMarketCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type FairMemeMarketCallerRaw struct {
	Contract *FairMemeMarketCaller // Generic read-only contract binding to access the raw methods on
}

// FairMemeMarketTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type FairMemeMarketTransactorRaw struct {
	Contract *FairMemeMarketTransactor // Generic write-only contract binding to access the raw methods on
}

// NewFairMemeMarket creates a new instance of FairMemeMarket, bound to a specific deployed contract.
func NewFairMemeMarket(address common.Address, backend bind.ContractBackend) (*FairMemeMarket, error) {
	contract, err := bindFairMemeMarket(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &FairMemeMarket{FairMemeMarketCaller: FairMemeMarketCaller{contract: contract}, FairMemeMarketTransactor: FairMemeMarketTransactor{contract: contract}, FairMemeMarketFilterer: FairMemeMarketFilterer{contract: contract}}, nil
}

// NewFairMemeMarketCaller creates a new read-only instance of FairMemeMarket, bound to a specific deployed contract.
func NewFairMemeMarketCaller(address common.Address, caller bind.ContractCaller) (*FairMemeMarketCaller, error) {
	contract, err := bindFairMemeMarket(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &FairMemeMarketCaller{contract: contract}, nil
}

// NewFairMemeMarketTransactor creates a new write-only instance of FairMemeMarket, bound to a specific deployed contract.
func NewFairMemeMarketTransactor(address common.Address, transactor bind.ContractTransactor) (*FairMemeMarketTransactor, error) {
	contract, err := bindFairMemeMarket(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &FairMemeMarketTransactor{contract: contract}, nil
}

// NewFairMemeMarketFilterer creates a new log filterer instance of FairMemeMarket, bound to a specific deployed contract.
func NewFairMemeMarketFilterer(address common.Address, filterer bind.ContractFilterer) (*FairMemeMarketFilterer, error) {
	contract, err := bindFairMemeMarket(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &FairMemeMarketFilterer{contract: contract}, nil
}

// bindFairMemeMarket binds a generic wrapper to an already deployed contract.
func bindFairMemeMarket(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := abi.JSON(strings.NewReader(FairMemeMarketABI))
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_FairMemeMarket *FairMemeMarketRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _FairMemeMarket.Contract.FairMemeMarketCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_FairMemeMarket *FairMemeMarketRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FairMemeMarket.Contract.FairMemeMarketTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_FairMemeMarket *FairMemeMarketRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _FairMemeMarket.Contract.FairMemeMarketTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_FairMemeMarket *FairMemeMarketCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _FairMemeMarket.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_FairMemeMarket *FairMemeMarketTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FairMemeMarket.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_FairMemeMarket *FairMemeMarketTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _FairMemeMarket.Contract.contract.Transact(opts, method, params...)
}

// SablierNFTStream is a free data retrieval call binding the contract method 0xe83fad29.
//
// Solidity: function sablierNFTStream() view returns(address)
func (_FairMemeMarket *FairMemeMarketCaller) SablierNFTStream(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FairMemeMarket.contract.Call(opts, &out, "sablierNFTStream")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// SablierNFTStream is a free data retrieval call binding the contract method 0xe83fad29.
//
// Solidity: function sablierNFTStream() view returns(address)
func (_FairMemeMarket *FairMemeMarketSession) SablierNFTStream() (common.Address, error) {
	return _FairMemeMarket.Contract.SablierNFTStream(&_FairMemeMarket.CallOpts)
}

// SablierNFTStream is a free data retrieval call binding the contract method 0xe83fad29.
//
// Solidity: function sablierNFTStream() view returns(address)
func (_FairMemeMarket *FairMemeMarketCallerSession) SablierNFTStream() (common.Address, error) {
	return _FairMemeMarket.Contract.SablierNFTStream(&_FairMemeMarket.CallOpts)
}

// SablierStreamId is a free data retrieval call binding the contract method 0x71dc4795.
//
// Solidity: function sablierStreamId() view returns(uint256)
func (_FairMemeMarket *FairMemeMarketCaller) SablierStreamId(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _FairMemeMarket.contract.Call(opts, &out, "sablierStreamId")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// SablierStreamId is a free data retrieval call binding the contract method 0x71dc4795.
//
// Solidity: function sablierStreamId() view returns(uint256)
func (_FairMemeMarket *FairMemeMarketSession) SablierStreamId() (*big.Int, error) {
	return _FairMemeMarket.Contract.SablierStreamId(&_FairMemeMarket.CallOpts)
}

// SablierStreamId is a free data retrieval call binding the contract method 0x71dc4795.
//
// Solidity: function sablierStreamId() view returns(uint256)
func (_FairMemeMarket *FairMemeMarketCallerSession) SablierStreamId() (*big.Int, error) {
	return _FairMemeMarket.Contract.SablierStreamId(&_FairMemeMarket.CallOpts)
}

// TokenAddress is a free data retrieval call binding the contract method 0x9d76ea58.
//
// Solidity: function tokenAddress() view returns(address)
func (_FairMemeMarket *FairMemeMarketCaller) TokenAddress(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FairMemeMarket.contract.Call(opts, &out, "tokenAddress")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// TokenAddress is a free data retrieval call binding the contract method 0x9d76ea58.
//
// Solidity: function tokenAddress() view returns(address)
func (_FairMemeMarket *FairMemeMarketSession) TokenAddress() (common.Address, error) {
	return _FairMemeMarket.Contract.TokenAddress(&_FairMemeMarket.CallOpts)
}

// TokenAddress is a free data retrieval call binding the contract method 0x9d76ea58.
//
// Solidity: function tokenAddress() view returns(address)
func (_FairMemeMarket *FairMemeMarketCallerSession) TokenAddress() (common.Address, error) {
	return _FairMemeMarket.Contract.TokenAddress(&_FairMemeMarket.CallOpts)
}

// BuyToken is a paid mutator transaction binding the contract method 0xa4821719.
//
// Solidity: function buyToken() payable returns()
func (_FairMemeMarket *FairMemeMarketTransactor) BuyToken(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FairMemeMarket.contract.Transact(opts, "buyToken")
}

// BuyToken is a paid mutator transaction binding the contract method 0xa4821719.
//
// Solidity: function buyToken() payable returns()
func (_FairMemeMarket *FairMemeMarketSession) BuyToken() (*types.Transaction, error) {
	return _FairMemeMarket.Contract.BuyToken(&_FairMemeMarket.TransactOpts)
}

// BuyToken is a paid mutator transaction binding the contract method 0xa4821719.
//
// Solidity: function buyToken() payable returns()
func (_FairMemeMarket *FairMemeMarketTransactorSession) BuyToken() (*types.Transaction, error) {
	return _FairMemeMarket.Contract.BuyToken(&_FairMemeMarket.TransactOpts)
}

// PreviewETHOut is a paid mutator transaction binding the contract method 0x93fc9e26.
//
// Solidity: function previewETHOut(uint256 amount) returns(uint256)
func (_FairMemeMarket *FairMemeMarketTransactor) PreviewETHOut(opts *bind.TransactOpts, amount *big.Int) (*types.Transaction, error) {
	return _FairMemeMarket.contract.Transact(opts, "previewETHOut", amount)
}

// PreviewETHOut is a paid mutator transaction binding the contract method 0x93fc9e26.
//
// Solidity: function previewETHOut(uint256 amount) returns(uint256)
func (_FairMemeMarket *FairMemeMarketSession) PreviewETHOut(amount *big.Int) (*types.Transaction, error) {
	return _FairMemeMarket.Contract.PreviewETHOut(&_FairMemeMarket.TransactOpts, amount)
}

// PreviewETHOut is a paid mutator transaction binding the contract method 0x93fc9e26.
//
// Solidity: function previewETHOut(uint256 amount) returns(uint256)
func (_FairMemeMarket *FairMemeMarketTransactorSession) PreviewETHOut(amount *big.Int) (*types.Transaction, error) {
	return _FairMemeMarket.Contract.PreviewETHOut(&_FairMemeMarket.TransactOpts, amount)
}

// PreviewTokenOut is a paid mutator transaction binding the contract method 0x696e094a.
//
// Solidity: function previewTokenOut(uint256 amount) returns(uint256)
func (_FairMemeMarket *FairMemeMarketTransactor) PreviewTokenOut(opts *bind.TransactOpts, amount *big.Int) (*types.Transaction, error) {
	return _FairMemeMarket.contract.Transact(opts, "previewTokenOut", amount)
}

// PreviewTokenOut is a paid mutator transaction binding the contract method 0x696e094a.
//
// Solidity: function previewTokenOut(uint256 amount) returns(uint256)
func (_FairMemeMarket *FairMemeMarketSession) PreviewTokenOut(amount *big.Int) (*types.Transaction, error) {
	return _FairMemeMarket.Contract.PreviewTokenOut(&_FairMemeMarket.TransactOpts, amount)
}

// PreviewTokenOut is a paid mutator transaction binding the contract method 0x696e094a.
//
// Solidity: function previewTokenOut(uint256 amount) returns(uint256)
func (_FairMemeMarket *FairMemeMarketTransactorSession) PreviewTokenOut(amount *big.Int) (*types.Transaction, error) {
	return _FairMemeMarket.Contract.PreviewTokenOut(&_FairMemeMarket.TransactOpts, amount)
}

// SellToken is a paid mutator transaction binding the contract method 0x2397e4d7.
//
// Solidity: function sellToken(uint256 amount) returns()
func (_FairMemeMarket *FairMemeMarketTransactor) SellToken(opts *bind.TransactOpts, amount *big.Int) (*types.Transaction, error) {
	return _FairMemeMarket.contract.Transact(opts, "sellToken", amount)
}

// SellToken is a paid mutator transaction binding the contract method 0x2397e4d7.
//
// Solidity: function sellToken(uint256 amount) returns()
func (_FairMemeMarket *FairMemeMarketSession) SellToken(amount *big.Int) (*types.Transaction, error) {
	return _FairMemeMarket.Contract.SellToken(&_FairMemeMarket.TransactOpts, amount)
}

// SellToken is a paid mutator transaction binding the contract method 0x2397e4d7.
//
// Solidity: function sellToken(uint256 amount) returns()
func (_FairMemeMarket *FairMemeMarketTransactorSession) SellToken(amount *big.Int) (*types.Transaction, error) {
	return _FairMemeMarket.Contract.SellToken(&_FairMemeMarket.TransactOpts, amount)
}

// SetStreamId is a paid mutator transaction binding the contract method 0xa85a8caa.
//
// Solidity: function setStreamId(uint256 _streamId) returns()
func (_FairMemeMarket *FairMemeMarketTransactor) SetStreamId(opts *bind.TransactOpts, _streamId *big.Int) (*types.Transaction, error) {
	return _FairMemeMarket.contract.Transact(opts, "setStreamId", _streamId)
}

// SetStreamId is a paid mutator transaction binding the contract method 0xa85a8caa.
//
// Solidity: function setStreamId(uint256 _streamId) returns()
func (_FairMemeMarket *FairMemeMarketSession) SetStreamId(_streamId *big.Int) (*types.Transaction, error) {
	return _FairMemeMarket.Contract.SetStreamId(&_FairMemeMarket.TransactOpts, _streamId)
}

// SetStreamId is a paid mutator transaction binding the contract method 0xa85a8caa.
//
// Solidity: function setStreamId(uint256 _streamId) returns()
func (_FairMemeMarket *FairMemeMarketTransactorSession) SetStreamId(_streamId *big.Int) (*types.Transaction, error) {
	return _FairMemeMarket.Contract.SetStreamId(&_FairMemeMarket.TransactOpts, _streamId)
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_FairMemeMarket *FairMemeMarketTransactor) Receive(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FairMemeMarket.contract.RawTransact(opts, nil) // calldata is disallowed for receive function
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_FairMemeMarket *FairMemeMarketSession) Receive() (*types.Transaction, error) {
	return _FairMemeMarket.Contract.Receive(&_FairMemeMarket.TransactOpts)
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_FairMemeMarket *FairMemeMarketTransactorSession) Receive() (*types.Transaction, error) {
	return _FairMemeMarket.Contract.Receive(&_FairMemeMarket.TransactOpts)
}
