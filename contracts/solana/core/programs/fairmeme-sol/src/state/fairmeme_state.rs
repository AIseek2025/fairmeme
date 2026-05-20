use anchor_lang::prelude::*;

#[account]
#[derive(Default, Debug)]
pub struct FairMemeState {
    pub creator: Pubkey,
    // Pool state
    pub sol_reserves: u64,
    pub token_reserves: u64,
    pub token_locked: u64,
    pub last_update_slot: u64,

    // Token releasing state
    pub start_time: u64, // by seconds
    pub start_slot: u64,
    pub auction_period: u64, // by slots
    pub token_release_per_slot: u64,
}

impl FairMemeState {
    pub const LEN: usize = 8 + std::mem::size_of::<FairMemeState>();
    pub const SEED_PREFIX: &'static [u8; 15] = b"fair-meme-state";

    pub fn update_util(&mut self, now: u64) {
        let unlock_amount = self.get_token_unlock_util(now);
        self.token_reserves += unlock_amount;
        self.token_locked -= unlock_amount;
        self.last_update_slot = now;
    }

    pub fn get_token_unlock_util(&self, now: u64) -> u64 {
        if self.token_locked == 0 {
            return 0;
        }
        if now <= self.last_update_slot {
            return 0;
        }
        // unlock all locked token when end auction session
        if now >= self.start_slot + self.auction_period && self.token_locked > 0 {
            return self.token_locked;
        }
        let diff: u64 = now - self.last_update_slot;
        let unlock_amount = self.token_release_per_slot * diff;
        unlock_amount
    }
}

#[cfg(test)]
mod tests {
    use anchor_lang::prelude::Pubkey;

    use crate::state::fairmeme_state::FairMemeState;

    #[test]
    fn test_state() {
        let mut state = FairMemeState {
            creator: Pubkey::default(),
            sol_reserves: 3000000002,
            token_reserves: 998999999334000,
            token_locked: 0,
            last_update_slot: 319979103,
            start_time: 1724092008,
            auction_period: 64800000,
            token_release_per_slot: 15401234,
            start_slot: 317952000,
        };

        let now: u64 = 317952000 + 64800000 * 4;
        state.update_util(now);

        print!("state: {:?}", state);
    }
}
