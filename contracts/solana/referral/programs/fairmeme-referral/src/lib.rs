use anchor_lang::prelude::*;

declare_id!("B5LrGrvdsdsmjYQPrg24kneF8DpztYm2RScq1DsbE92B");

#[program]
pub mod fairmeme_referral {
    use super::*;

    pub fn store(ctx: Context<Store>, invited_code: String) -> Result<()> {
        let referral = &mut ctx.accounts.referral;
        referral.user = *ctx.accounts.user.key;
        referral.invited_code = invited_code;
        Ok(())
    }
}

#[account]
#[derive(Default, Debug)]
pub struct Referral {
    user: Pubkey,
    invited_code: String,
}

impl Referral {
    pub const LEN: usize = 8 + std::mem::size_of::<Referral>();
    pub const SEED_PREFIX: &'static [u8; 8] = b"referral";
}

#[derive(Accounts)]
pub struct Store<'info> {
    #[account(mut)]
    user: Signer<'info>,

    #[account(
        init,
        payer = user,
        seeds = [Referral::SEED_PREFIX, user.to_account_info().key.as_ref()],
        bump,
        space = 8 + Referral::LEN,
    )]
    referral: Box<Account<'info, Referral>>,

    system_program: Program<'info, System>,
}
