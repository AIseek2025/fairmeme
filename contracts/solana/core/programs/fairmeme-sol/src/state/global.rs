use anchor_lang::prelude::*;

#[account]
#[derive(Default, Debug)]
pub struct Global {
    pub authority: Pubkey,
    pub initialized: bool,
    pub fee_recipient: Pubkey,
    pub fair_meme_token: Option<Pubkey>,
}

impl Global {
    pub const LEN: usize = 8 + std::mem::size_of::<Global>();
    pub const SEED_PREFIX: &'static [u8; 6] = b"global";
}
