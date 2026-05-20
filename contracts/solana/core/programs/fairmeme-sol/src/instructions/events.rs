use anchor_lang::prelude::*;

#[event]
pub struct CreateEvent {
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub auction_period: u64,
    pub mint: Pubkey,
    pub fairmeme_state: Pubkey,
    pub creator: Pubkey,
    pub timestamp: u64,
    pub slot: u64,
    pub token_received: u64,
    pub token_release_per_slot: u64,
}

#[event]
pub struct TradeEvent {
    pub mint: Pubkey,
    pub sol_amount: u64,
    pub token_amount: u64,
    pub is_buy: bool,
    pub user: Pubkey,
    pub timestamp: u64,
    pub slot: u64,
    pub sol_reserves: u64,
    pub token_reserves: u64,
    pub token_locked: u64,
    pub token_release_per_slot: u64,
    pub fee: u64,
}
