use anchor_lang::prelude::*;
use anchor_spl::token::Mint;

use crate::{amm::AmmCalculator, errors::FairMemeError, state::fairmeme_state::FairMemeState};

#[derive(Accounts)]
pub struct GetSellPrice<'info> {
    pub mint: Account<'info, Mint>,

    #[account(
        seeds = [FairMemeState::SEED_PREFIX, mint.to_account_info().key.as_ref()],
        bump,
    )]
    pub fairmeme_state: Box<Account<'info, FairMemeState>>,
}

pub fn get_sell_price(ctx: Context<GetSellPrice>, token_amount: u64) -> Result<u64> {
    let now = Clock::get()?.slot;
    let fairmeme_state = &ctx.accounts.fairmeme_state;
    let token_unlock = fairmeme_state.get_token_unlock_util(now);
    let amm = AmmCalculator::new(
        fairmeme_state.sol_reserves as u128,
        (fairmeme_state.token_reserves + token_unlock) as u128,
    );
    match amm.get_sell_price(token_amount as u128) {
        Some(price) => Ok(price as u64),
        None => Err(FairMemeError::InvalidAmount.into()),
    }
}
