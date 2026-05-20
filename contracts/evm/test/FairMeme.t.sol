// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import {MockERC20} from "solmate/test/utils/mocks/MockERC20.sol";

import {FairMeme} from "../src/FairMeme.sol";
import {MEME20} from "../src/MEME20.sol";
import {FairMemeSwapRouter} from "../src/FairMemeSwapRouter.sol";
import {FairMemeSwapPair} from "../src/FairMemeSwapPair.sol";
import {FairMemePairFactory} from "../src/FairMemePairFactory.sol";
import {MockWETH} from "./mocks/MockWETH.sol";

contract FairMemeTest is Test {
    FairMeme public fairMeme;
    FairMemeSwapRouter public mockRouter;
    FairMemePairFactory public mockFactory;
    address public owner = address(0x123);
    address public feeTo = address(0x456);
    address public creator = address(0x789);
    uint64 public auctionPeriod = 10000;
    uint64 public protocolFee = 100;
    MockWETH public WETH = new MockWETH();

    function setUp() public {
        mockFactory = new FairMemePairFactory(address(WETH), feeTo);
        mockRouter = new FairMemeSwapRouter(address(mockFactory), address(WETH), feeTo, protocolFee);
        fairMeme = new FairMeme(owner, address(mockRouter), address(mockFactory), feeTo);
    }

    function testCreateMeme() public {
        vm.startPrank(creator);
        vm.deal(creator, 1 ether); // fund creator with 1 ETH

        string memory name = "Test Meme";
        string memory symbol = "TMEME";

        uint256 amountETH = fairMeme.devBuyETHAmount();
        uint256 fee = amountETH * uint256(fairMeme.createFee()) / 10000;

        assertEq(amountETH, 0.15 ether);

        fairMeme.createMeme{value: amountETH + fee}(name, symbol, creator, auctionPeriod);
    }

    function testSetFeeTo() public {
        address newFeeTo = address(0x999);
        vm.prank(owner);
        fairMeme.setFeeTo(newFeeTo);
        assertEq(fairMeme.feeTo(), newFeeTo, "FeeTo address mismatch");
    }

    function testSetCreateFee() public {
        uint64 newFee = 20; // 0.2%
        vm.prank(owner);
        fairMeme.setCreateFee(newFee);
        assertEq(fairMeme.createFee(), newFee, "CreateFee mismatch");
    }

    function testSetDevBuyETHAmount() public {
        uint256 newAmount = 0.2 ether;
        vm.prank(owner);
        fairMeme.setDevBuyETHAmount(newAmount);
        assertEq(fairMeme.devBuyETHAmount(), newAmount, "DevBuyETHAmount mismatch");
    }

    function testSetDevBuyTokenPercent() public {
        uint64 newPercent = 20; // 0.2%
        vm.prank(owner);
        fairMeme.setDevBuyTokenPercent(newPercent);
        assertEq(fairMeme.devBuyTokenPercent(), newPercent, "DevBuyTokenPercent mismatch");
    }
}
