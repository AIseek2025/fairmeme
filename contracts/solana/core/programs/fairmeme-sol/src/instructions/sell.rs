use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

use crate::{
    amm, calc_fee_maybe_discount,
    errors::FairMemeError,
    get_time_now,
    state::{
        constants::{DEFAULT_CREATOR_TRADE_FEE, DEFAULT_PLATFORM_TRADE_FEE},
        fairmeme_state::FairMemeState,
        global::Global,
    },
    TradeEvent,
};

#[event_cpi]
#[derive(Accounts)]
pub struct Sell<'info> {
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

    system_program: Program<'info, System>,

    token_program: Program<'info, Token>,
}

pub fn sell(ctx: Context<Sell>, token_amount: u64, min_sol_output: u64) -> Result<()> {
    require!(
        ctx.accounts.global.initialized,
        FairMemeError::NotInitialized
    );

    require!(token_amount > 0, FairMemeError::InvalidAmount);

    // invalid fee recipient
    require!(
        ctx.accounts.fee_recipient.key == &ctx.accounts.global.fee_recipient,
        FairMemeError::InvalidFeeRecipient,
    );

    require!(
        ctx.accounts.creator.key == &ctx.accounts.fairmeme_state.creator,
        FairMemeError::InvalidCreator
    );

    // confirm user has enough tokens
    require!(
        ctx.accounts.user_token_account.amount >= token_amount,
        FairMemeError::InsufficientTokens,
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

    let mut amm = amm::AmmCalculator::new(state.sol_reserves as u128, state.token_reserves as u128);

    let sell_result = amm.apply_sell(token_amount as u128).unwrap();
    let platform_trade_fee = calc_fee_maybe_discount(
        sell_result.sol_amount,
        DEFAULT_PLATFORM_TRADE_FEE,
        ctx.accounts.user_discount_token_account.amount,
    );
    let creator_trade_fee = calc_fee_maybe_discount(
        sell_result.sol_amount,
        DEFAULT_CREATOR_TRADE_FEE,
        ctx.accounts.user_discount_token_account.amount,
    );

    // the fee is subtracted from the sol amount to confirm the user minimum sol output is met
    let sell_amount_minus_fee = sell_result.sol_amount - platform_trade_fee - creator_trade_fee;

    // confirm min sol output is greater than sol output
    require!(
        sell_amount_minus_fee >= min_sol_output,
        FairMemeError::SlippageExceeded,
    );

    // transfer SPL
    let cpi_accounts = Transfer {
        from: ctx.accounts.user_token_account.to_account_info().clone(),
        to: ctx.accounts.fair_meme_token_account.to_account_info().clone(),
        authority: ctx.accounts.user.to_account_info().clone(),
    };

    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            &[],
        ),
        sell_result.token_amount,
    )?;

    // transfer SOL back to user
    let from_account = &ctx.accounts.fairmeme_state;
    let to_account = &ctx.accounts.user;

    **from_account.to_account_info().try_borrow_mut_lamports()? -= sell_result.sol_amount;
    **to_account.try_borrow_mut_lamports()? += sell_result.sol_amount;

    // transfer fee to fee recipient and creator
    **from_account.to_account_info().try_borrow_mut_lamports()? -= platform_trade_fee;
    **from_account.to_account_info().try_borrow_mut_lamports()? -= creator_trade_fee;

    **ctx.accounts.fee_recipient.try_borrow_mut_lamports()? += platform_trade_fee;
    **ctx.accounts.creator.try_borrow_mut_lamports()? += creator_trade_fee;

    let state = &mut ctx.accounts.fairmeme_state;
    state.sol_reserves = amm.sol_reserves as u64;
    state.token_reserves = amm.token_reserves as u64;

    emit_cpi!(TradeEvent {
        mint: *ctx.accounts.mint.to_account_info().key,
        sol_amount: sell_result.sol_amount,
        token_amount: sell_result.token_amount,
        is_buy: false,
        user: *ctx.accounts.user.to_account_info().key,
        timestamp: get_time_now()?,
        sol_reserves: amm.sol_reserves as u64,
        token_reserves: amm.token_reserves as u64,
        token_locked: state.token_locked,
        token_release_per_slot: state.token_release_per_slot,
        slot: Clock::get()?.slot,
        fee: platform_trade_fee + creator_trade_fee,
    });

    Ok(())
}
