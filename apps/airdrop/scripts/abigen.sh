#!/bin/sh

abigen -abi ./abis/data/ERC20.json -pkg abis -type ERC20 -out ./abis/erc20_abi.go
