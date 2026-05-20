// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "solmate/tokens/ERC20.sol";
import {Owned} from "solmate/auth/Owned.sol";
import {ReentrancyGuard} from "solmate/utils/ReentrancyGuard.sol";

import {Math} from "./libraries/Math.sol";
import {UQ112x112} from "./libraries/UQ112x112.sol";
import {TransferHelper} from "./libraries/TransferHelper.sol";
import {FairMemeSwapLibrary} from "./libraries/FairMemeSwapLibrary.sol";
import {IERC20} from "./interfaces/IERC20.sol";
import {IFairMemeSwapCallee} from "./interfaces/IFairMemeSwapCallee.sol";
import {IWETH} from "./interfaces/IWETH.sol";

contract FairMemeSwapPair is ERC20("FairMemeSwap", "FAIR-ETH", 18), Owned(msg.sender), ReentrancyGuard {
    using UQ112x112 for uint224;

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/
    event Swap(
        address indexed sender,
        uint256 amount0In,
        uint256 amount1In,
        uint256 amount0Out,
        uint256 amount1Out,
        address indexed to
    );

    event Sync(uint112 reserve0, uint112 reserve1);

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/
    bytes4 private constant SELECTOR = bytes4(keccak256(bytes("transfer(address,uint256)")));

    /// @notice token0 is meme token
    address public token0;
    /// @notice token1 is WETH
    address public token1;

    address public factory;

    uint112 private reserve0; // uses single storage slot, accessible via getReserves
    uint112 private reserve1; // uses single storage slot, accessible via getReserves
    uint32 private blockTimestampLast; // uses single storage slot, accessible via getReserves

    uint112 private memeLocked;
    uint112 private memeUnlockPerBlock;
    uint256 private lastUnlockBlock;

    uint256 public price0CumulativeLast;
    uint256 public price1CumulativeLast;
    uint256 public kLast; // reserve0 * reserve1, as of immediately after the most recent liquidity event

    uint64 public feeTier;

    constructor() {
        factory = msg.sender;
    }

    // called once by the factory at time of deployment
    function initialize(address _meme, address _WETH) external {
        require(msg.sender == factory, "FairMemeSwapPair: FORBIDDEN"); // sufficient check
        token0 = _meme;
        token1 = _WETH;
        feeTier = 200; // 2%
    }

    function initLiquidity(uint112 reserve, uint112 locked, uint112 unlockPerBlock) external payable {
        require(reserve0 == 0 && reserve1 == 0, "FairMemeSwapPair: liquidity added");
        require(reserve > 0, "FairMemeSwapPair: invalid reserve");
        TransferHelper.safeTransferFrom(token0, msg.sender, address(this), reserve + locked);
        IWETH(token1).deposit{value: msg.value}();
        assert(IWETH(token1).transfer(address(this), msg.value));

        lastUnlockBlock = block.number;
        memeLocked = locked;
        memeUnlockPerBlock = unlockPerBlock;
    }

    receive() external payable {}

    function getMemeLocked() public view returns (uint112 _memeLocked, uint112 _memeUnlockPerBlock) {
        _memeLocked = memeLocked;
        _memeUnlockPerBlock = memeUnlockPerBlock;
    }

    function meme() public view returns (address) {
        return token0;
    }

    function WETH() public view returns (address) {
        return token1;
    }

    function unlockMeme() internal {
        // update memeLocked, reserve0, lastUnlockBlock
        uint256 blocksPassed = block.number - lastUnlockBlock;
        if (blocksPassed > 0 && memeLocked > 0) {
            if (memeLocked <= memeUnlockPerBlock) {
                reserve0 = reserve0 + memeLocked;
                memeLocked = 0;
            } else {
                memeLocked = memeLocked - memeUnlockPerBlock;
                reserve0 = reserve0 + memeUnlockPerBlock;
            }
            lastUnlockBlock = block.number;
        }
    }

    function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) {
        _reserve0 = reserve0;
        _reserve1 = reserve1;
        _blockTimestampLast = blockTimestampLast;
    }

    /// @notice "Safe" transfer (ignores bool return)
    function _safeTransfer(address token, address to, uint256 value) internal {
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(SELECTOR, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), "FairMemeSwap: TRANSFER_FAILED");
    }

    /// @notice Adjust the LP Fee of the pool, 3 being 0.3%
    function modifyFeeTier(uint64 _feeTier) external onlyOwner {
        feeTier = _feeTier;
    }

    mapping(address => bool) public isAllowedRouter;

    function toggleRouterAuthorization(address router, bool status) external onlyOwner {
        isAllowedRouter[router] = status;
    }

    modifier onlyAuthorizedRouters() {
        require(isAllowedRouter[msg.sender], "FairMemeSwap: UNAUTHORIZED");
        _;
    }

    /*//////////////////////////////////////////////////////////////
                             CORE FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    // update reserves and, on the first call per block, price accumulators
    function _update(uint256 balance0, uint256 balance1, uint112 _reserve0, uint112 _reserve1) internal {
        require(balance0 <= type(uint112).max && balance1 <= type(uint112).max, "FairMemeSwap: OVERFLOW");
        uint32 blockTimestamp = uint32(block.timestamp % 2 ** 32);
        uint32 timeElapsed = blockTimestamp - blockTimestampLast; // overflow is desired
        if (timeElapsed > 0 && _reserve0 != 0 && _reserve1 != 0) {
            // * never overflows, and + overflow is desired
            price0CumulativeLast += uint256(UQ112x112.encode(_reserve1).uqdiv(_reserve0)) * timeElapsed;
            price1CumulativeLast += uint256(UQ112x112.encode(_reserve0).uqdiv(_reserve1)) * timeElapsed;
        }
        reserve0 = uint112(balance0);
        reserve1 = uint112(balance1);
        blockTimestampLast = blockTimestamp;

        emit Sync(reserve0, reserve1);
    }

    // this low-level function should be called from a contract which performs important safety checks
    function swap(uint256 amount0Out, uint256 amount1Out, address to, bytes calldata data)
        external
        onlyAuthorizedRouters
        nonReentrant
    {
        require(amount0Out > 0 || amount1Out > 0, "FairMemeSwap: INSUFFICIENT_OUTPUT_AMOUNT");
        unlockMeme();
        (uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
        require(amount0Out < _reserve0 && amount1Out < _reserve1, "FairMemeSwap: INSUFFICIENT_LIQUIDITY");

        uint256 balance0;
        uint256 balance1;
        {
            // scope for _token{0,1}, avoids stack too deep errors
            address _token0 = token0;
            address _token1 = token1;
            require(to != _token0 && to != _token1, "FairMemeSwap: INVALID_TO");
            if (amount0Out > 0) _safeTransfer(_token0, to, amount0Out); // optimistically transfer tokens
            if (amount1Out > 0) _safeTransfer(_token1, to, amount1Out); // optimistically transfer tokens
            if (data.length > 0) {
                IFairMemeSwapCallee(to).fairMemeSwapCall(msg.sender, amount0Out, amount1Out, data);
            }
            balance0 = balance0WithoutLock();
            balance1 = IERC20(_token1).balanceOf(address(this));
        }
        uint256 amount0In = balance0 > _reserve0 - amount0Out ? balance0 - (_reserve0 - amount0Out) : 0;
        uint256 amount1In = balance1 > _reserve1 - amount1Out ? balance1 - (_reserve1 - amount1Out) : 0;
        require(amount0In > 0 || amount1In > 0, "FairMemeSwap: INSUFFICIENT_INPUT_AMOUNT");
        {
            // scope for reserve{0,1}Adjusted, avoids stack too deep errors
            uint256 balance0Adjusted = balance0 * (1000) - (amount0In * (feeTier));
            uint256 balance1Adjusted = balance1 * (1000) - (amount1In * (feeTier));
            require(
                balance0Adjusted * (balance1Adjusted) >= uint256(_reserve0) * (_reserve1) * (1000 ** 2), "FairMemeSwap: K"
            );
        }

        _update(balance0, balance1, _reserve0, _reserve1);
        emit Swap(msg.sender, amount0In, amount1In, amount0Out, amount1Out, to);
    }

    // force reserves to match balances
    function sync() external nonReentrant {
        unlockMeme();
        _update(IERC20(token0).balanceOf(address(this)), IERC20(token1).balanceOf(address(this)), reserve0, reserve1);
    }

    function balance0WithoutLock() internal view returns (uint256 balance) {
        balance = IERC20(token0).balanceOf(address(this)) <= memeLocked
            ? 0
            : IERC20(token0).balanceOf(address(this)) - memeLocked;
    }
}
