use anchor_lang::prelude::*;

use crate::{errors::FairMemeError, state::global::Global};

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    authority: Signer<'info>,

    #[account(
        init,
        space = 8 + Global::LEN,
        seeds = [Global::SEED_PREFIX],
        bump,
        payer = authority,
    )]
    global: Box<Account<'info, Global>>,

    system_program: Program<'info, System>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct InitParams {
    pub fee_recipient: Pubkey,
    pub fair_meme_token: Option<Pubkey>,
}

pub fn initialize(ctx: Context<Initialize>, params: &InitParams) -> Result<()> {
    msg!("Initialize global params");

    let global = &mut ctx.accounts.global;

    require!(!global.initialized, FairMemeError::AlreadyInitialized);

    global.authority = *ctx.accounts.authority.to_account_info().key;
    global.fee_recipient = params.fee_recipient;
    global.fair_meme_token = params.fair_meme_token;
    global.initialized = true;

    Ok(())
}
