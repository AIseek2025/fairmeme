// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/console2.sol";
import "forge-std/Script.sol";

import {FairMemeSwapRouter} from "../src/FairMemeSwapRouter.sol";

contract DeployRouter is Script {
    function run() public {
        vm.startBroadcast();

        address pairFactory = 0x417f73C4160756b1aC33AafC23A6D894383fD200;
        address WETH = 0x4200000000000000000000000000000000000006;
        address feeTo = 0x50599Ca7aA7732b5aDbCFb4eC8608898aCA3cF6C;
        uint64 protocolFee = 200; // 2%

        // Deploy the FairMemeSwapRouter contract
        FairMemeSwapRouter router = new FairMemeSwapRouter(pairFactory, WETH, feeTo, protocolFee);

        // forge script script/DeployRouter.s.sol:DeployRouter --broadcast --rpc-url http://localhost:8545 --private-key <PRIVATE_KEY>

        console2.log("FairMemeSwapRouter", address(router));

        vm.stopBroadcast();
    }
}
