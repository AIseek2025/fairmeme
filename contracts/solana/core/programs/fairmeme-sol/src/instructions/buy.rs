use anchor_lang::{prelude::*, solana_program::system_instruction};
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

use crate::{
    amm, calc_fee_maybe_discount,
    errors::FairMemeError,
    get_time_now,
    state::{
        constants::{
            DEFAULT_CREATOR_TRADE_FEE, DEFAULT_MAX_TRADE_ORDER, DEFAULT_PLATFORM_TRADE_FEE,
        },
        fairmeme_state::FairMemeState,
        global::Global,
    },
    TradeEvent,
};
#[event_cpi]
#[derive(Accounts)]
pub struct Buy<'info> {
    #[account(mut)]
    user: Signer<'info>,

    #[account(
        seeds = [Global::SEED_PREFIX],
        bump,
    )]
    global: Box<Account<'info, Global>>,

    /// CHECK: Using global state to validate fee_recipient account
    #[account(mut)]
    fee_recipient: AccountInfo<'info>,

    /// CHECK: Using FairMeme state to validate creator account
    #[account(mut)]
    creator: AccountInfo<'info>,

    mint: Account<'info, Mint>,

    #[account(
        mut,
        seeds = [FairMemeState::SEED_PREFIX, mint.to_account_info().key.as_ref()],
        bump,
    )]
    fairmeme_state: Box<Account<'info, FairMemeState>>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = fairmeme_state,
    )]
    fair_meme_token_account: Box<Account<'info, TokenAccount>>,

    #[account(
        constraint = user_discount_token_account.owner == user.key(),
    )]
    user_discount_token_account: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = user,
    )]
    user_token_account: Box<Account<'info, TokenAccount>>,

    token_program: Program<'info, Token>,

    system_program: Program<'info, System>,
}

pub fn buy(ctx: Context<Buy>, sol_amount: u64, min_token_output: u64) -> Result<()> {
    require!(
        ctx.accounts.global.initialized,
        FairMemeError::NotInitialized
    );

    require!(sol_amount > 0, FairMemeError::InvalidAmount);

    // invalid fee recipient
    require!(
        ctx.accounts.fee_recipient.key == &ctx.accounts.global.fee_recipient,
        FairMemeError::InvalidFeeRecipient
    );

    require!(
        ctx.accounts.creator.key == &ctx.accounts.fairmeme_state.creator,
        FairMemeError::InvalidCreator
    );

    // confirm user has enough SOL
    require!(
        ctx.accounts.user.lamports() >= sol_amount,
        FairMemeError::InsufficientSOL
    );

    // Check whether the user is eligible for discount tiers when a FAIR token is configured.
    if let Some(fair_meme_token) = ctx.accounts.global.fair_meme_token {
        require!(
            ctx.accounts.user_discount_token_account.mint == fair_meme_token,
            FairMemeError::InvalidDiscountTokenAccount,
        );
    }

    let now = Clock::get()?.slot;
    let state = &mut ctx.accounts.fairmeme_state;
    state.update_util(now);

    let max_order = state.sol_reserves * DEFAULT_MAX_TRADE_ORDER / 10000;
    require!(sol_amount <= max_order, FairMemeError::MaxTradeOrder);

    let mut amm = amm::AmmCalculator::new(state.sol_reserves as u128, state.token_reserves as u128);

    let platform_trade_fee = calc_fee_maybe_discount(
        sol_amount,
        DEFAULT_PLATFORM_TRADE_FEE,
        ctx.accounts.user_discount_token_account.amount,
    );
    let creator_trade_fee = calc_fee_maybe_discount(
        sol_amount,
        DEFAULT_CREATOR_TRADE_FEE,
        ctx.accounts.user_discount_token_account.amount,
    );
    let buy_amount_minus_fee = sol_amount - platform_trade_fee - creator_trade_fee;
    require!(buy_amount_minus_fee > 0, FairMemeError::InsufficientFee);

    let buy_result = amm.apply_buy(buy_amount_minus_fee as u128).unwrap();

    require!(
        buy_result.token_amount >= min_token_output,
        FairMemeError::SlippageExceeded,
    );

    state.sol_reserves = amm.sol_reserves as u64;
    state.token_reserves = amm.token_reserves as u64;

    // transfer SOL to pool
    let from_account = &ctx.accounts.user;
    let to_account: &Box<Account<FairMemeState>> = &state;

    let transfer_instruction = system_instruction::transfer(
        from_account.key,
        to_account.to_account_info().key,
        buy_result.sol_amount,
    );

    anchor_lang::solana_program::program::invoke_signed(
        &transfer_instruction,
        &[
            from_account.to_account_info(),
            to_account.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
        &[],
    )?;

    // transfer SOL fee to fee recipient
    let to_fee_recipient_account = &ctx.accounts.fee_recipient;

    let transfer_instruction = system_instruction::transfer(
        from_account.key,
        to_fee_recipient_account.key,
        platform_trade_fee,
    );

    anchor_lang::solana_program::program::invoke_signed(
        &transfer_instruction,
        &[
            from_account.to_account_info(),
            to_fee_recipient_account.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
        &[],
    )?;

    // transfer SOL fee to creator
    let to_fee_creator = &ctx.accounts.creator;

    let transfer_instruction =
        system_instruction::transfer(from_account.key, to_fee_creator.key, creator_trade_fee);

    anchor_lang::solana_program::program::invoke_signed(
        &transfer_instruction,
        &[
            from_account.to_account_info(),
            to_fee_creator.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
        &[],
    )?;

    // transfer SPL token to user
    let cpi_accounts = Transfer {
        from: ctx.accounts.fair_meme_token_account.to_account_info().clone(),
        to: ctx.accounts.user_token_account.to_account_info().clone(),
        authority: state.to_account_info().clone(),
    };

    let signer: [&[&[u8]]; 1] = [&[
        FairMemeState::SEED_PREFIX,
        ctx.accounts.mint.to_account_info().key.as_ref(),
        &[ctx.bumps.fairmeme_state],
    ]];

    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            &signer,
        ),
        buy_result.token_amount,
    )?;

    emit_cpi!(TradeEvent {
        mint: *ctx.accounts.mint.to_account_info().key,
        sol_amount: buy_result.sol_amount,
        token_amount: buy_result.token_amount,
        is_buy: true,
        user: *ctx.accounts.user.to_account_info().key,
        timestamp: get_time_now()?,
        sol_reserves: amm.sol_reserves as u64,
        token_reserves: amm.token_reserves as u64,
        token_locked: state.token_locked,
        token_release_per_slot: state.token_release_per_slot,
        fee: platform_trade_fee + creator_trade_fee,
        slot: Clock::get()?.slot,
    });

    Ok(())
}
