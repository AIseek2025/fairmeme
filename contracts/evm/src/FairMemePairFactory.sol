// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IFairMemePairFactory} from "./interfaces/IFairMemePairFactory.sol";
import {IFairMemeSwapPair} from "./interfaces/IFairMemeSwapPair.sol";
import {FairMemeSwapPair} from "./FairMemeSwapPair.sol";
import {MEME20} from "./MEME20.sol";

contract FairMemePairFactory is IFairMemePairFactory {
    address public feeTo;
    address public feeToSetter;
    address public WETH;

    mapping(address => address) public getPairETH;
    address[] public allPairs;

    constructor(address _WETH, address _feeToSetter) {
        WETH = _WETH;
        feeToSetter = _feeToSetter;
    }

    function allPairsLength() external view returns (uint256) {
        return allPairs.length;
    }

    function createPairETH(address meme) external returns (address pair) {
        require(meme != WETH, "FairMemePairFactory: IDENTICAL_ADDRESSES");
        require(meme != address(0), "FairMemePairFactory: ZERO_ADDRESS");
        require(getPairETH[meme] == address(0), "FairMemePairFactory: PAIR_EXISTS"); // single check is sufficient
        bytes memory bytecode = type(FairMemeSwapPair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(meme, WETH));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        IFairMemeSwapPair(pair).initialize(meme, WETH);
        getPairETH[meme] = pair;
        allPairs.push(pair);
        emit PairCreated(meme, WETH, pair, allPairs.length);
    }

    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, "FairMemePairFactory: FORBIDDEN");
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, "FairMemePairFactory: FORBIDDEN");
        feeToSetter = _feeToSetter;
    }

    // Allow the contract to receive ETH
    receive() external payable {}

    // Fallback function to accept ETH for the contract
    fallback() external payable {}
}
