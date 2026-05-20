use anchor_lang::error_code;

#[error_code]
pub enum FairMemeError {
    #[msg("Global Already Initialized")]
    AlreadyInitialized,
    #[msg("Global Not Initialized")]
    NotInitialized,
    #[msg("Invalid Authority")]
    InvalidAuthority,
    #[msg("Insufficient Tokens")]
    InsufficientTokens,
    #[msg("Insufficient SOL")]
    InsufficientSOL,
    #[msg("Insufficient Fee")]
    InsufficientFee,
    #[msg("Min buy is 1 Token")]
    InvalidFeeRecipient,
    #[msg("Slippage Exceeded")]
    SlippageExceeded,
    #[msg("Invalid Amount")]
    InvalidAmount,
    #[msg("Empty Supply")]
    EmptySupply,
    #[msg("Max Trade Order")]
    MaxTradeOrder,
    #[msg("Invalid Creator")]
    InvalidCreator,
    #[msg("Invalid Discount Token Account")]
    InvalidDiscountTokenAccount,
}
