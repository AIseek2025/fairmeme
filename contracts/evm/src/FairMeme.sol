// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Owned} from "solmate/auth/Owned.sol";
import {ReentrancyGuard} from "solmate/utils/ReentrancyGuard.sol";

import {IFairMeme} from "./interfaces/IFairMeme.sol";
import {MEME20} from "./MEME20.sol";
import {IFairMemeSwapRouter} from "./interfaces/IFairMemeSwapRouter.sol";
import {IFairMemeSwapPair} from "./interfaces/IFairMemeSwapPair.sol";
import {IFairMemePairFactory} from "./interfaces/IFairMemePairFactory.sol";
import {FairMemeSwapPair} from "./FairMemeSwapPair.sol";

contract FairMeme is Owned, IFairMeme, ReentrancyGuard {
    event MemeCreated(address indexed memeAddress, address indexed creator, address indexed pair);

    struct CreatedInfo {
        address creator;
        uint64 auctionBlocks;
        uint112 tokenUnlockPerBlock;
        uint112 initialTokenLocked;
    }

    address public feeTo;
    uint64 public createFee;
    uint256 public devBuyETHAmount;
    uint64 public devBuyTokenPercent;

    address public fairMemeRouter;
    address public pairFactory;

    mapping(address => CreatedInfo) public createdInfos;

    constructor(address _owner, address _fairMemeRouter, address _pairFactory, address _feeTo) Owned(_owner) {
        fairMemeRouter = _fairMemeRouter;
        pairFactory = _pairFactory;
        feeTo = _feeTo;
        createFee = 100; // 1%
        devBuyETHAmount = 0.15 ether;
        devBuyTokenPercent = 10; // 0.1%
    }

    function createMeme(string memory _name, string memory _symbol, address _creator, uint64 _auctionBlocks)
        external
        payable
        nonReentrant
    {
        require(_auctionBlocks >= 360 && _auctionBlocks <= 3153600, "Invalid auction blocks range: 1h to 365days");

        uint256 fee = createFee * devBuyETHAmount / 10000;
        require(msg.value >= devBuyETHAmount + fee, "Must pay enough ETH and fee for create a meme");

        MEME20 meme = new MEME20(_name, _symbol);
        address memeAddress = address(meme);

        uint112 tokenAddLiquidity = uint112(meme.totalSupply() / 10000) * uint112(devBuyTokenPercent);
        uint112 tokenShouldLocked = uint112(meme.totalSupply()) - tokenAddLiquidity - tokenAddLiquidity;
        uint112 tokenUnlockPerBlock = tokenShouldLocked / _auctionBlocks;

        address pair = IFairMemePairFactory(pairFactory).createPairETH(memeAddress);
        meme.approve(pair, tokenShouldLocked + tokenAddLiquidity);
        IFairMemeSwapPair(pair).initLiquidity{value: devBuyETHAmount}(
            tokenAddLiquidity, tokenShouldLocked, tokenUnlockPerBlock
        );

        // transfer token to user
        meme.transfer(_creator, tokenAddLiquidity);

        createdInfos[memeAddress] = CreatedInfo({
            creator: _creator,
            auctionBlocks: _auctionBlocks,
            tokenUnlockPerBlock: tokenUnlockPerBlock,
            initialTokenLocked: tokenShouldLocked
        });
        emit MemeCreated(memeAddress, _creator, pair);
    }

    function setFeeTo(address _feeTo) external onlyOwner {
        feeTo = _feeTo;
    }

    function setCreateFee(uint64 _fee) external onlyOwner {
        createFee = _fee;
    }

    function setDevBuyETHAmount(uint256 _amount) external onlyOwner {
        devBuyETHAmount = _amount;
    }

    function setDevBuyTokenPercent(uint64 _percent) external onlyOwner {
        devBuyTokenPercent = _percent;
    }

    // Allow the contract to receive ETH
    receive() external payable {}

    // Fallback function to accept ETH for the contract
    fallback() external payable {}
}
