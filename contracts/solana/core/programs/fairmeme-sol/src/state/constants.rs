//! Constants using in the contract

// Token config
pub const DEFAULT_DECIMALS: u8 = 6;
pub const DEFAULT_TOKEN_LAMPORTS: u64 = (10_u64).pow(DEFAULT_DECIMALS as u32);
pub const DEFAULT_TOKEN_SUPPLY: u64 = 1_000_000_000 * DEFAULT_TOKEN_LAMPORTS;

// Trading config
pub const DEFAULT_MAX_TRADE_ORDER: u64 = 5000; // 50%
pub const DEFAULT_PLATFORM_TRADE_FEE: u64 = 100; // 1%
pub const DEFAULT_CREATOR_TRADE_FEE: u64 = 100; // 1%

// Auction config
pub const DEFAULT_DEV_BUY_AMOUNT: u64 = 1_000_000_000; // 1 SOL
pub const DEFAULT_DEV_BUY_PERCENT: u64 = 5; // 0.05%

// Discount config
pub const DISCOUNT_LEVEL1_AMOUNT: u64 = 200_000 * DEFAULT_TOKEN_LAMPORTS;
pub const DISCOUNT_LEVEL1_PERCENT: u64 = 2000; // 20%
pub const DISCOUNT_LEVEL2_AMOUNT: u64 = 1_000_000 * DEFAULT_TOKEN_LAMPORTS;
pub const DISCOUNT_LEVEL2_PERCENT: u64 = 5000; // 50%
