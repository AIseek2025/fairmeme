// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/console2.sol";
import "forge-std/Script.sol";

import {FairMemePairFactory} from "../src/FairMemePairFactory.sol";

contract DeployPairFactory is Script {
    function run() external {
        address feeToSetter = 0x50599Ca7aA7732b5aDbCFb4eC8608898aCA3cF6C; // Set the feeToSetter as the deployer's address
        address WETH = 0x4200000000000000000000000000000000000006;
        vm.startBroadcast();

        // Deploy the FairMemePairFactory contract
        FairMemePairFactory factory = new FairMemePairFactory(WETH, feeToSetter);

        // forge script script/DeployPairFactory.s.sol:DeployPairFactory --broadcast --rpc-url http://localhost:8545 --private-key <PRIVATE_KEY>

        console2.log("FairMemePairFactory", address(factory));

        vm.stopBroadcast();
    }
}
