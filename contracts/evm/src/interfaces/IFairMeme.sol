// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IFairMeme {
    function feeTo() external view returns (address);
    function setFeeTo(address) external;
    function createMeme(string memory name, string memory symbol, address creator, uint64 auctionBlocks)
        external
        payable;
}
