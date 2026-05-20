use anchor_lang::prelude::*;

pub mod amm;
pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("AyVwefFVyuwgtBQ2cTteN3ZKo4Z4rCgvBtr3tgvnaPpb");

#[program]
pub mod fairmeme_sol {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, params: InitParams) -> Result<()> {
        initialize::initialize(ctx, &params)
    }

    pub fn set_global(ctx: Context<SetGlobal>, params: SetGlobalParams) -> Result<()> {
        set_global::set_global(ctx, &params)
    }

    pub fn create(
        ctx: Context<Create>,
        name: String,
        symbol: String,
        uri: String,
        auction_period: u64,
    ) -> Result<()> {
        create::create(ctx, name, symbol, uri, auction_period)
    }

    pub fn buy(ctx: Context<Buy>, sol_amount: u64, min_token_output: u64) -> Result<()> {
        buy::buy(ctx, sol_amount, min_token_output)
    }

    pub fn sell(ctx: Context<Sell>, token_amount: u64, min_sol_output: u64) -> Result<()> {
        sell::sell(ctx, token_amount, min_sol_output)
    }

    pub fn get_buy_price(ctx: Context<GetBuyPrice>, token_amount: u64) -> Result<u64> {
        get_buy_price::get_buy_price(ctx, token_amount)
    }

    pub fn get_sell_price(ctx: Context<GetSellPrice>, token_amount: u64) -> Result<u64> {
        get_sell_price::get_sell_price(ctx, token_amount)
    }
}
