// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IFairMemeSwapRouter {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);

    function quote(uint256 amountA, uint256 reserveA, uint256 reserveB) external pure returns (uint256 amountB);

    function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut)
        external
        pure
        returns (uint256 amountOut);

    function getAmountIn(uint256 amountOut, uint256 reserveIn, uint256 reserveOut)
        external
        pure
        returns (uint256 amountIn);

    function swapExactETHForTokens(uint256 amountOutMin, address token, address to, uint256 deadline)
        external
        payable
        returns (uint256);

    function swapETHForExactTokens(uint256 amountOut, address token, address to, uint256 deadline)
        external
        payable
        returns (uint256);

    function swapTokensForExactETH(uint256 amountOut, uint256 amountInMax, address token, address to, uint256 deadline)
        external
        returns (uint256);

    function swapExactTokensForETH(uint256 amountIn, uint256 amountOutMin, address token, address to, uint256 deadline)
        external
        returns (uint256);
}
