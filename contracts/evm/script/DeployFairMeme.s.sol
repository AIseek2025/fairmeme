// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/console2.sol";
import "forge-std/Script.sol";

import {FairMeme} from "../src/FairMeme.sol";

contract DeployFairMeme is Script {
    function run() public {
        vm.startBroadcast();

        address fairMemeRouter = 0x9C1706DC8156ca7559f1705444B4428C5ff414E7;
        address pairFactory = 0x417f73C4160756b1aC33AafC23A6D894383fD200;
        address feeTo = 0x50599Ca7aA7732b5aDbCFb4eC8608898aCA3cF6C;

        // Deploy the FairMeme contract
        FairMeme fairMeme = new FairMeme(msg.sender, fairMemeRouter, pairFactory, feeTo);

        // forge script script/DeployFairMeme.s.sol:DeployFairMeme --broadcast --rpc-url http://localhost:8545 --private-key <PRIVATE_KEY>

        console2.log("FairMeme", address(fairMeme));

        vm.stopBroadcast();
    }
}
