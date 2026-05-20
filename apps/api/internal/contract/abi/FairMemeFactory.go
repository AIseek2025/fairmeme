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

// FairMemeFactoryMetaData contains all meta data concerning the FairMemeFactory contract.
var FairMemeFactoryMetaData = &bind.MetaData{
	ABI: "[{\"type\":\"constructor\",\"inputs\":[{\"name\":\"_sablierNFT\",\"type\":\"address\",\"internalType\":\"address\"}],\"stateMutability\":\"nonpayable\"},{\"type\":\"function\",\"name\":\"createFairMemeMarket\",\"inputs\":[{\"name\":\"name\",\"type\":\"string\",\"internalType\":\"string\"},{\"name\":\"symbol\",\"type\":\"string\",\"internalType\":\"string\"},{\"name\":\"devAddress\",\"type\":\"address\",\"internalType\":\"address\"},{\"name\":\"devPercent\",\"type\":\"uint256\",\"internalType\":\"uint256\"},{\"name\":\"auctionPrice\",\"type\":\"uint256\",\"internalType\":\"uint256\"},{\"name\":\"auctionTime\",\"type\":\"uint256\",\"internalType\":\"uint256\"}],\"outputs\":[{\"name\":\"token\",\"type\":\"address\",\"internalType\":\"address\"},{\"name\":\"market\",\"type\":\"address\",\"internalType\":\"address\"}],\"stateMutability\":\"payable\"},{\"type\":\"function\",\"name\":\"owner\",\"inputs\":[],\"outputs\":[{\"name\":\"\",\"type\":\"address\",\"internalType\":\"address\"}],\"stateMutability\":\"view\"},{\"type\":\"function\",\"name\":\"ownerWithdrawEth\",\"inputs\":[],\"outputs\":[],\"stateMutability\":\"nonpayable\"},{\"type\":\"function\",\"name\":\"renounceOwnership\",\"inputs\":[],\"outputs\":[],\"stateMutability\":\"nonpayable\"},{\"type\":\"function\",\"name\":\"sablierNFT\",\"inputs\":[],\"outputs\":[{\"name\":\"\",\"type\":\"address\",\"internalType\":\"address\"}],\"stateMutability\":\"view\"},{\"type\":\"function\",\"name\":\"transferOwnership\",\"inputs\":[{\"name\":\"newOwner\",\"type\":\"address\",\"internalType\":\"address\"}],\"outputs\":[],\"stateMutability\":\"nonpayable\"},{\"type\":\"event\",\"name\":\"OwnershipTransferred\",\"inputs\":[{\"name\":\"previousOwner\",\"type\":\"address\",\"indexed\":true,\"internalType\":\"address\"},{\"name\":\"newOwner\",\"type\":\"address\",\"indexed\":true,\"internalType\":\"address\"}],\"anonymous\":false}]",
}

// FairMemeFactoryABI is the input ABI used to generate the binding from.
// Deprecated: Use FairMemeFactoryMetaData.ABI instead.
var FairMemeFactoryABI = FairMemeFactoryMetaData.ABI

// FairMemeFactory is an auto generated Go binding around an Ethereum contract.
type FairMemeFactory struct {
	FairMemeFactoryCaller     // Read-only binding to the contract
	FairMemeFactoryTransactor // Write-only binding to the contract
	FairMemeFactoryFilterer   // Log filterer for contract events
}

// FairMemeFactoryCaller is an auto generated read-only Go binding around an Ethereum contract.
type FairMemeFactoryCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FairMemeFactoryTransactor is an auto generated write-only Go binding around an Ethereum contract.
type FairMemeFactoryTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FairMemeFactoryFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type FairMemeFactoryFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FairMemeFactorySession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type FairMemeFactorySession struct {
	Contract     *FairMemeFactory // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// FairMemeFactoryCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type FairMemeFactoryCallerSession struct {
	Contract *FairMemeFactoryCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts           // Call options to use throughout this session
}

// FairMemeFactoryTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type FairMemeFactoryTransactorSession struct {
	Contract     *FairMemeFactoryTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts           // Transaction auth options to use throughout this session
}

// FairMemeFactoryRaw is an auto generated low-level Go binding around an Ethereum contract.
type FairMemeFactoryRaw struct {
	Contract *FairMemeFactory // Generic contract binding to access the raw methods on
}

// FairMemeFactoryCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type FairMemeFactoryCallerRaw struct {
	Contract *FairMemeFactoryCaller // Generic read-only contract binding to access the raw methods on
}

// FairMemeFactoryTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type FairMemeFactoryTransactorRaw struct {
	Contract *FairMemeFactoryTransactor // Generic write-only contract binding to access the raw methods on
}

// NewFairMemeFactory creates a new instance of FairMemeFactory, bound to a specific deployed contract.
func NewFairMemeFactory(address common.Address, backend bind.ContractBackend) (*FairMemeFactory, error) {
	contract, err := bindFairMemeFactory(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &FairMemeFactory{FairMemeFactoryCaller: FairMemeFactoryCaller{contract: contract}, FairMemeFactoryTransactor: FairMemeFactoryTransactor{contract: contract}, FairMemeFactoryFilterer: FairMemeFactoryFilterer{contract: contract}}, nil
}

// NewFairMemeFactoryCaller creates a new read-only instance of FairMemeFactory, bound to a specific deployed contract.
func NewFairMemeFactoryCaller(address common.Address, caller bind.ContractCaller) (*FairMemeFactoryCaller, error) {
	contract, err := bindFairMemeFactory(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &FairMemeFactoryCaller{contract: contract}, nil
}

// NewFairMemeFactoryTransactor creates a new write-only instance of FairMemeFactory, bound to a specific deployed contract.
func NewFairMemeFactoryTransactor(address common.Address, transactor bind.ContractTransactor) (*FairMemeFactoryTransactor, error) {
	contract, err := bindFairMemeFactory(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &FairMemeFactoryTransactor{contract: contract}, nil
}

// NewFairMemeFactoryFilterer creates a new log filterer instance of FairMemeFactory, bound to a specific deployed contract.
func NewFairMemeFactoryFilterer(address common.Address, filterer bind.ContractFilterer) (*FairMemeFactoryFilterer, error) {
	contract, err := bindFairMemeFactory(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &FairMemeFactoryFilterer{contract: contract}, nil
}

// bindFairMemeFactory binds a generic wrapper to an already deployed contract.
func bindFairMemeFactory(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := abi.JSON(strings.NewReader(FairMemeFactoryABI))
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_FairMemeFactory *FairMemeFactoryRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _FairMemeFactory.Contract.FairMemeFactoryCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_FairMemeFactory *FairMemeFactoryRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FairMemeFactory.Contract.FairMemeFactoryTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_FairMemeFactory *FairMemeFactoryRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _FairMemeFactory.Contract.FairMemeFactoryTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_FairMemeFactory *FairMemeFactoryCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _FairMemeFactory.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_FairMemeFactory *FairMemeFactoryTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FairMemeFactory.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_FairMemeFactory *FairMemeFactoryTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _FairMemeFactory.Contract.contract.Transact(opts, method, params...)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_FairMemeFactory *FairMemeFactoryCaller) Owner(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FairMemeFactory.contract.Call(opts, &out, "owner")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_FairMemeFactory *FairMemeFactorySession) Owner() (common.Address, error) {
	return _FairMemeFactory.Contract.Owner(&_FairMemeFactory.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_FairMemeFactory *FairMemeFactoryCallerSession) Owner() (common.Address, error) {
	return _FairMemeFactory.Contract.Owner(&_FairMemeFactory.CallOpts)
}

// SablierNFT is a free data retrieval call binding the contract method 0xc27090d0.
//
// Solidity: function sablierNFT() view returns(address)
func (_FairMemeFactory *FairMemeFactoryCaller) SablierNFT(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _FairMemeFactory.contract.Call(opts, &out, "sablierNFT")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// SablierNFT is a free data retrieval call binding the contract method 0xc27090d0.
//
// Solidity: function sablierNFT() view returns(address)
func (_FairMemeFactory *FairMemeFactorySession) SablierNFT() (common.Address, error) {
	return _FairMemeFactory.Contract.SablierNFT(&_FairMemeFactory.CallOpts)
}

// SablierNFT is a free data retrieval call binding the contract method 0xc27090d0.
//
// Solidity: function sablierNFT() view returns(address)
func (_FairMemeFactory *FairMemeFactoryCallerSession) SablierNFT() (common.Address, error) {
	return _FairMemeFactory.Contract.SablierNFT(&_FairMemeFactory.CallOpts)
}

// CreateFairMemeMarket is a paid mutator transaction binding the contract method 0xf2c6ff9d.
//
// Solidity: function createFairMemeMarket(string name, string symbol, address devAddress, uint256 devPercent, uint256 auctionPrice, uint256 auctionTime) payable returns(address token, address market)
func (_FairMemeFactory *FairMemeFactoryTransactor) CreateFairMemeMarket(opts *bind.TransactOpts, name string, symbol string, devAddress common.Address, devPercent *big.Int, auctionPrice *big.Int, auctionTime *big.Int) (*types.Transaction, error) {
	return _FairMemeFactory.contract.Transact(opts, "createFairMemeMarket", name, symbol, devAddress, devPercent, auctionPrice, auctionTime)
}

// CreateFairMemeMarket is a paid mutator transaction binding the contract method 0xf2c6ff9d.
//
// Solidity: function createFairMemeMarket(string name, string symbol, address devAddress, uint256 devPercent, uint256 auctionPrice, uint256 auctionTime) payable returns(address token, address market)
func (_FairMemeFactory *FairMemeFactorySession) CreateFairMemeMarket(name string, symbol string, devAddress common.Address, devPercent *big.Int, auctionPrice *big.Int, auctionTime *big.Int) (*types.Transaction, error) {
	return _FairMemeFactory.Contract.CreateFairMemeMarket(&_FairMemeFactory.TransactOpts, name, symbol, devAddress, devPercent, auctionPrice, auctionTime)
}

// CreateFairMemeMarket is a paid mutator transaction binding the contract method 0xf2c6ff9d.
//
// Solidity: function createFairMemeMarket(string name, string symbol, address devAddress, uint256 devPercent, uint256 auctionPrice, uint256 auctionTime) payable returns(address token, address market)
func (_FairMemeFactory *FairMemeFactoryTransactorSession) CreateFairMemeMarket(name string, symbol string, devAddress common.Address, devPercent *big.Int, auctionPrice *big.Int, auctionTime *big.Int) (*types.Transaction, error) {
	return _FairMemeFactory.Contract.CreateFairMemeMarket(&_FairMemeFactory.TransactOpts, name, symbol, devAddress, devPercent, auctionPrice, auctionTime)
}

// OwnerWithdrawEth is a paid mutator transaction binding the contract method 0x2da9bdf3.
//
// Solidity: function ownerWithdrawEth() returns()
func (_FairMemeFactory *FairMemeFactoryTransactor) OwnerWithdrawEth(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FairMemeFactory.contract.Transact(opts, "ownerWithdrawEth")
}

// OwnerWithdrawEth is a paid mutator transaction binding the contract method 0x2da9bdf3.
//
// Solidity: function ownerWithdrawEth() returns()
func (_FairMemeFactory *FairMemeFactorySession) OwnerWithdrawEth() (*types.Transaction, error) {
	return _FairMemeFactory.Contract.OwnerWithdrawEth(&_FairMemeFactory.TransactOpts)
}

// OwnerWithdrawEth is a paid mutator transaction binding the contract method 0x2da9bdf3.
//
// Solidity: function ownerWithdrawEth() returns()
func (_FairMemeFactory *FairMemeFactoryTransactorSession) OwnerWithdrawEth() (*types.Transaction, error) {
	return _FairMemeFactory.Contract.OwnerWithdrawEth(&_FairMemeFactory.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_FairMemeFactory *FairMemeFactoryTransactor) RenounceOwnership(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FairMemeFactory.contract.Transact(opts, "renounceOwnership")
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_FairMemeFactory *FairMemeFactorySession) RenounceOwnership() (*types.Transaction, error) {
	return _FairMemeFactory.Contract.RenounceOwnership(&_FairMemeFactory.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_FairMemeFactory *FairMemeFactoryTransactorSession) RenounceOwnership() (*types.Transaction, error) {
	return _FairMemeFactory.Contract.RenounceOwnership(&_FairMemeFactory.TransactOpts)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_FairMemeFactory *FairMemeFactoryTransactor) TransferOwnership(opts *bind.TransactOpts, newOwner common.Address) (*types.Transaction, error) {
	return _FairMemeFactory.contract.Transact(opts, "transferOwnership", newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_FairMemeFactory *FairMemeFactorySession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _FairMemeFactory.Contract.TransferOwnership(&_FairMemeFactory.TransactOpts, newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_FairMemeFactory *FairMemeFactoryTransactorSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _FairMemeFactory.Contract.TransferOwnership(&_FairMemeFactory.TransactOpts, newOwner)
}

// FairMemeFactoryOwnershipTransferredIterator is returned from FilterOwnershipTransferred and is used to iterate over the raw logs and unpacked data for OwnershipTransferred events raised by the FairMemeFactory contract.
type FairMemeFactoryOwnershipTransferredIterator struct {
	Event *FairMemeFactoryOwnershipTransferred // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *FairMemeFactoryOwnershipTransferredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(FairMemeFactoryOwnershipTransferred)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(FairMemeFactoryOwnershipTransferred)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *FairMemeFactoryOwnershipTransferredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *FairMemeFactoryOwnershipTransferredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// FairMemeFactoryOwnershipTransferred represents a OwnershipTransferred event raised by the FairMemeFactory contract.
type FairMemeFactoryOwnershipTransferred struct {
	PreviousOwner common.Address
	NewOwner      common.Address
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferred is a free log retrieval operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_FairMemeFactory *FairMemeFactoryFilterer) FilterOwnershipTransferred(opts *bind.FilterOpts, previousOwner []common.Address, newOwner []common.Address) (*FairMemeFactoryOwnershipTransferredIterator, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _FairMemeFactory.contract.FilterLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return &FairMemeFactoryOwnershipTransferredIterator{contract: _FairMemeFactory.contract, event: "OwnershipTransferred", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferred is a free log subscription operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_FairMemeFactory *FairMemeFactoryFilterer) WatchOwnershipTransferred(opts *bind.WatchOpts, sink chan<- *FairMemeFactoryOwnershipTransferred, previousOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _FairMemeFactory.contract.WatchLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(FairMemeFactoryOwnershipTransferred)
				if err := _FairMemeFactory.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseOwnershipTransferred is a log parse operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_FairMemeFactory *FairMemeFactoryFilterer) ParseOwnershipTransferred(log types.Log) (*FairMemeFactoryOwnershipTransferred, error) {
	event := new(FairMemeFactoryOwnershipTransferred)
	if err := _FairMemeFactory.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
