// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {MockERC20} from "solmate/test/utils/mocks/MockERC20.sol";

import {FairMemePairFactory} from "../src/FairMemePairFactory.sol";
import {FairMemeSwapLibrary} from "../src/libraries/FairMemeSwapLibrary.sol";
import {IFairMemeSwapPair} from "../src/interfaces/IFairMemeSwapPair.sol";

contract FairMemePairFactoryTest is Test {
    FairMemePairFactory public pairFactory;
    MockERC20 token0;
    MockERC20 WETH;

    address feeToSetter;

    function setUp() public {
        token0 = new MockERC20("Meme Token", "MEME", 18);
        WETH = new MockERC20("Wrapped ETH", "WETH", 18);
        feeToSetter = 0xbc24A9BCc76A2cD505FA99DEA21d4509C9af3388;
        pairFactory = new FairMemePairFactory(address(WETH), feeToSetter);
    }

    function testCreatePairETH() public {
        address tokenPair = pairFactory.createPairETH(address(token0));

        (uint112 _memeLocked, uint112 _memeUnlockPerBlock) = IFairMemeSwapPair(tokenPair).getMemeLocked();

        assertEq(pairFactory.allPairsLength(), 1);
        assertEq(pairFactory.allPairs(0), tokenPair);
        assertEq(_memeLocked, 0);
        assertEq(_memeUnlockPerBlock, 0);
        assertEq(IFairMemeSwapPair(tokenPair).meme(), address(token0));
        assertEq(IFairMemeSwapPair(tokenPair).WETH(), address(WETH));
    }
}
