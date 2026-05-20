use anchor_lang::prelude::*;

use anchor_spl::{
    associated_token::AssociatedToken, 
    metadata::{
        create_metadata_accounts_v3, mpl_token_metadata::types::DataV2, CreateMetadataAccountsV3, Metadata
    }, 
    token::{
        self, mint_to, spl_token::instruction::AuthorityType, Mint, MintTo, Token, TokenAccount, Transfer,
    }};
use solana_program::system_instruction;

use crate::{
    errors::FairMemeError, get_time_now, state::{
        constants::{DEFAULT_DECIMALS, DEFAULT_DEV_BUY_AMOUNT, DEFAULT_DEV_BUY_PERCENT, DEFAULT_TOKEN_SUPPLY}, fairmeme_state::FairMemeState, global::Global
    }, CreateEvent
};

#[event_cpi]
#[derive(Accounts)]
pub struct Create<'info> {
    #[account(mut)]
    creator: Signer<'info>,

    #[account(
        init,
        payer = creator,
        mint::decimals = DEFAULT_DECIMALS,
        mint::authority = mint_authority,
        mint::freeze_authority = mint_authority
    )]
    mint: Box<Account<'info, Mint>>,

    /// CHECK: Using seed to validate mint_authority account
    #[account(
        seeds=[b"mint-authority"],
        bump,
    )]
    mint_authority: AccountInfo<'info>,

    #[account(
        init_if_needed,
        payer = creator,
        associated_token::mint = mint,
        associated_token::authority = creator,
    )]
    creator_token_account: Box<Account<'info, TokenAccount>>,

    #[account(
        init,
        payer = creator,
        seeds = [FairMemeState::SEED_PREFIX, mint.to_account_info().key.as_ref()],
        bump,
        space = 8 + FairMemeState::LEN,
    )]
    fairmeme_state: Box<Account<'info, FairMemeState>>,

    #[account(
        init_if_needed,
        payer = creator,
        associated_token::mint = mint,
        associated_token::authority = fairmeme_state,
    )]
    fair_meme_token_account: Box<Account<'info, TokenAccount>>,

    #[account(
        seeds = [Global::SEED_PREFIX],
        bump,
    )]
    global: Box<Account<'info, Global>>,

    ///CHECK: Using seed to validate metadata account
    #[account(
        mut,
        seeds = [
            b"metadata", 
            token_metadata_program.key.as_ref(), 
            mint.to_account_info().key.as_ref()
        ],
        seeds::program = token_metadata_program.key(),
        bump,
    )]
    metadata: AccountInfo<'info>,

    system_program: Program<'info, System>,
    token_program: Program<'info, Token>,
    associated_token_program: Program<'info, AssociatedToken>,
    token_metadata_program: Program<'info, Metadata>,
    rent: Sysvar<'info, Rent>,
}

pub fn create(
    ctx: Context<Create>, 
    name: String, 
    symbol: String, 
    uri: String,
    auction_period: u64,
) -> Result<()> {
    require!(
        ctx.accounts.global.initialized,
        FairMemeError::NotInitialized
    );

    let sol_needed = DEFAULT_DEV_BUY_AMOUNT;

    // transfer SOL to pool
    let from_account = &ctx.accounts.creator;
    let to_account = &ctx.accounts.fairmeme_state;
    let transfer_instruction = system_instruction::transfer(
        from_account.key,
        to_account.to_account_info().key,
        sol_needed,
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

    let seeds = &["mint-authority".as_bytes(), &[ctx.bumps.mint_authority]];
    let signer = [&seeds[..]];

    create_metadata_accounts_v3(
        CpiContext::new_with_signer(
            ctx.accounts.token_metadata_program.to_account_info(),
            CreateMetadataAccountsV3 {
                payer: ctx.accounts.creator.to_account_info(),
                update_authority: ctx.accounts.mint_authority.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                metadata: ctx.accounts.metadata.to_account_info(),
                mint_authority: ctx.accounts.mint_authority.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
            &signer,
        ), 
        DataV2 {
            name: name.clone(),
            symbol: symbol.clone(),
            uri: uri.clone(),
            seller_fee_basis_points: 0,
            creators: None,
            collection: None,
            uses: None,
        }, 
        false,
         true, 
         None,
    )?;

    let token_supply = DEFAULT_TOKEN_SUPPLY;

    // mint tokens to fair_meme_token_account
    mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                authority: ctx.accounts.mint_authority.to_account_info(),
                to: ctx.accounts.fair_meme_token_account.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
            },
            &signer,
        ),
        token_supply,
    )?;

    // remove mint_authority
    let cpi_context = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        token::SetAuthority {
            current_authority: ctx.accounts.mint_authority.to_account_info(),
            account_or_mint: ctx.accounts.mint.to_account_info(),
        },
        &signer,
    );
    token::set_authority(cpi_context, AuthorityType::MintTokens, None)?;

    // transfer token to creator
    let received_token_amount = token_supply * DEFAULT_DEV_BUY_PERCENT / 10000;
    let cpi_accounts = Transfer {
        from: ctx.accounts.fair_meme_token_account.to_account_info().clone(),
        to: ctx.accounts.creator_token_account.to_account_info().clone(),
        authority: ctx.accounts.fairmeme_state.to_account_info().clone(),
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
        received_token_amount,
    )?;

    let token_locked = token_supply - 2*received_token_amount; // the remeaning tokens go to locked
    let token_release_per_slot = token_locked / auction_period;

    let state = &mut ctx.accounts.fairmeme_state;
    state.token_reserves = received_token_amount; // 0.1% add to reserves
    state.token_locked = token_locked;
    state.sol_reserves = sol_needed;
    state.last_update_slot = Clock::get()?.slot;
    state.start_time = get_time_now()?;
    state.auction_period = auction_period;
    state.token_release_per_slot = token_release_per_slot;
    state.creator = *ctx.accounts.creator.to_account_info().key;
    state.start_slot = Clock::get()?.slot;

    emit_cpi!(CreateEvent{
        name, 
        symbol, 
        uri,
        auction_period,
        token_release_per_slot,
        mint: *ctx.accounts.mint.to_account_info().key, 
        fairmeme_state: *ctx.accounts.fairmeme_state.to_account_info().key, 
        creator: *ctx.accounts.creator.to_account_info().key, 
        timestamp: get_time_now()?,
        slot: Clock::get()?.slot,
        token_received: received_token_amount,
    });

    Ok(())
}
