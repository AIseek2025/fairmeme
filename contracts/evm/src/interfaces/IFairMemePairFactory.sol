// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IFairMemePairFactory {
    event PairCreated(address indexed token0, address indexed token1, address pair, uint256);

    function WETH() external view returns (address);

    function feeTo() external view returns (address);
    function feeToSetter() external view returns (address);
    function setFeeTo(address) external;
    function setFeeToSetter(address) external;

    function getPairETH(address meme) external view returns (address pair);
    function allPairs(uint256) external view returns (address pair);
    function allPairsLength() external view returns (uint256);

    function createPairETH(address meme) external returns (address pair);
}
