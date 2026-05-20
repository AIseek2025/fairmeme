// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Owned} from "solmate/auth/Owned.sol";

import {SafeMath} from "./libraries/SafeMath.sol";
import {TransferHelper} from "./libraries/TransferHelper.sol";
import {FairMemeSwapLibrary} from "./libraries/FairMemeSwapLibrary.sol";
import {IWETH} from "./interfaces/IWETH.sol";
import {IFairMemeSwapPair} from "./interfaces/IFairMemeSwapPair.sol";

contract FairMemeSwapRouter is Owned(msg.sender) {
    using SafeMath for uint256;

    address public immutable factory;
    address public immutable WETH;

    // Out of 1000
    uint64 public protocolFee;

    // Total Accumulated Protocol Fees
    address public feeTo;

    modifier ensure(uint256 deadline) {
        require(deadline >= block.timestamp, "FairMemeSwapRouter: EXPIRED");
        _;
    }

    constructor(address _factory, address _WETH, address _feeTo, uint64 _protocolFee) {
        factory = _factory;
        WETH = _WETH;
        protocolFee = _protocolFee;
        feeTo = _feeTo;
    }

    receive() external payable {
        assert(msg.sender == WETH); // only accept ETH via fallback from the WETH contract
    }

    /*//////////////////////////////////////////////////////////////
                             FEE FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /*
     * @param _feeTo The address to send the protocol fees to
     */
    function changeFeeTo(address _feeTo) external onlyOwner {
        feeTo = _feeTo;
    }

    /*
     * @param _protocolFee The new protocol fee
     */
    function changeProtocolFee(uint64 _protocolFee) external onlyOwner {
        protocolFee = _protocolFee;
    }

    // **** LIBRARY FUNCTIONS ****
    /// @dev Important note: This does not take into account the router protocol fee
    ///     which will be taken from the ETH side of the trade
    function quote(uint256 amountA, uint256 reserveA, uint256 reserveB) public pure returns (uint256 amountB) {
        return FairMemeSwapLibrary.quote(amountA, reserveA, reserveB);
    }

    /// @dev Important note: This does not take into account the router protocol fee
    ///     which will be taken from the ETH side of the trade
    function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut, uint64 fee)
        public
        pure
        returns (uint256 amountOut)
    {
        return FairMemeSwapLibrary.getAmountOut(amountIn, reserveIn, reserveOut, fee);
    }

    /// @dev Important note: This does not take into account the router protocol fee
    ///     which will be taken from the ETH side of the trade
    function getAmountIn(uint256 amountOut, uint256 reserveIn, uint256 reserveOut, uint64 fee)
        public
        pure
        returns (uint256 amountIn)
    {
        return FairMemeSwapLibrary.getAmountIn(amountOut, reserveIn, reserveOut, fee);
    }

    function swapExactETHForTokens(uint256 amountOutMin, address token, address to, uint256 deadline)
        external
        payable
        ensure(deadline)
        returns (uint256 amountOut)
    {
        address pair = FairMemeSwapLibrary.pairFor(factory, token, WETH);
        uint64 fee = IFairMemeSwapPair(pair).feeTier();
        (uint256 reserveOut, uint256 reserveIn,) = IFairMemeSwapPair(pair).getReserves();

        uint256 feeTaken = (msg.value * protocolFee) / 1000;
        uint256 amountIn = msg.value - feeTaken;

        amountOut = FairMemeSwapLibrary.getAmountOut(amountIn, reserveIn, reserveOut, fee);
        require(amountOut >= amountOutMin, "FairMemeSwapRouter: INSUFFICIENT_OUTPUT_AMOUNT");
        IWETH(WETH).deposit{value: msg.value}();
        assert(IWETH(WETH).transfer(pair, amountIn));
        IWETH(WETH).transfer(feeTo, feeTaken);

        IFairMemeSwapPair(pair).swap(amountOut, 0, to, new bytes(0));
    }

    function swapETHForExactTokens(uint256 amountOut, address token, address to, uint256 deadline)
        external
        payable
        ensure(deadline)
        returns (uint256)
    {
        address pair = FairMemeSwapLibrary.pairFor(factory, token, WETH);
        uint64 fee = IFairMemeSwapPair(pair).feeTier();
        (uint256 reserveOut, uint256 reserveIn,) = IFairMemeSwapPair(pair).getReserves();
        uint256 amountIn = FairMemeSwapLibrary.getAmountIn(amountOut, reserveIn, reserveOut, fee);
        uint256 feeTaken = (amountIn * protocolFee) / 1000;

        require(amountIn + feeTaken <= msg.value, "FairMemeSwapRouter: EXCESSIVE_INPUT_AMOUNT");
        IWETH(WETH).deposit{value: amountIn + feeTaken}();
        address _pair = pair;

        assert(IWETH(WETH).transfer(_pair, amountIn));
        IWETH(WETH).transfer(feeTo, feeTaken);

        uint256 totalAmountIn = feeTaken + amountIn;

        IFairMemeSwapPair(_pair).swap(amountOut, 0, to, new bytes(0));
        // refund dust eth, if any
        if (msg.value > totalAmountIn) {
            TransferHelper.safeTransferETH(msg.sender, msg.value - totalAmountIn);
        }

        return totalAmountIn;
    }

    function swapTokensForExactETH(uint256 amountOut, uint256 amountInMax, address token, address to, uint256 deadline)
        external
        ensure(deadline)
        returns (uint256 amountIn)
    {
        address pair = FairMemeSwapLibrary.pairFor(factory, token, WETH);
        uint64 fee = IFairMemeSwapPair(pair).feeTier();
        (uint256 reserveIn, uint256 reserveOut,) = IFairMemeSwapPair(pair).getReserves();

        uint256 feeTaken = (amountOut * protocolFee) / 1000;
        uint256 amountOwed = amountOut + feeTaken;

        amountIn = FairMemeSwapLibrary.getAmountIn(amountOwed, reserveIn, reserveOut, fee);
        require(amountIn <= amountInMax, "FairMemeSwapRouter: EXCESSIVE_INPUT_AMOUNT");
        TransferHelper.safeTransferFrom(token, msg.sender, pair, amountIn);

        IFairMemeSwapPair(pair).swap(0, amountOwed, address(this), new bytes(0));

        IWETH(WETH).withdraw(amountOut);
        IWETH(WETH).transfer(feeTo, feeTaken);
        TransferHelper.safeTransferETH(to, amountOut);
    }

    function swapExactTokensForETH(uint256 amountIn, uint256 amountOutMin, address token, address to, uint256 deadline)
        external
        ensure(deadline)
        returns (uint256)
    {
        address pair = FairMemeSwapLibrary.pairFor(factory, token, WETH);
        uint64 fee = IFairMemeSwapPair(pair).feeTier();
        (uint256 reserveIn, uint256 reserveOut,) = IFairMemeSwapPair(pair).getReserves();

        uint256 amountOut = FairMemeSwapLibrary.getAmountOut(amountIn, reserveIn, reserveOut, fee);

        uint256 feeTaken = (amountOut * protocolFee) / 1000;
        uint256 amountOwed = amountOut - feeTaken;

        require(amountOwed >= amountOutMin, "FairMemeSwapRouter: INSUFFICIENT_OUTPUT_AMOUNT");
        TransferHelper.safeTransferFrom(token, msg.sender, pair, amountIn);
        IFairMemeSwapPair(pair).swap(0, amountOut, address(this), new bytes(0));

        IWETH(WETH).transfer(feeTo, feeTaken);
        IWETH(WETH).withdraw(amountOwed);
        TransferHelper.safeTransferETH(to, amountOwed);

        return amountOwed;
    }
}
