use anchor_lang::prelude::*;

use crate::{errors::FairMemeError, state::global::Global};

#[derive(Accounts)]
pub struct SetGlobal<'info> {
    #[account(
        mut,
        seeds = [Global::SEED_PREFIX],
        bump,
    )]
    global: Box<Account<'info, Global>>,

    user: Signer<'info>,

    system_program: Program<'info, System>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct SetGlobalParams {
    pub fair_meme_token: Pubkey,
}

pub fn set_global(ctx: Context<SetGlobal>, params: &SetGlobalParams) -> Result<()> {
    let global = &mut ctx.accounts.global;

    // confirm program is initialized
    require!(global.initialized, FairMemeError::NotInitialized);

    // confirm user is the authority
    require!(
        global.authority == *ctx.accounts.user.to_account_info().key,
        FairMemeError::InvalidAuthority
    );

    global.fair_meme_token = Some(params.fair_meme_token);
    Ok(())
}
