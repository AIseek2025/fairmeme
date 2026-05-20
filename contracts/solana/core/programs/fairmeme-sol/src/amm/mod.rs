use crate::errors::FairMemeError;
use anchor_lang::prelude::*;
use spl_math::checked_ceil_div::CheckedCeilDiv;

#[derive(Debug)]
pub struct TradeResult {
    pub token_amount: u64,
    pub sol_amount: u64,
}

#[derive(Debug)]
pub struct AmmCalculator {
    pub token_reserves: u128,
    pub sol_reserves: u128,
}

impl AmmCalculator {
    pub fn new(sol_reserves: u128, token_reserves: u128) -> Self {
        AmmCalculator {
            sol_reserves,
            token_reserves,
        }
    }

    pub fn validate_supply(&self) -> Result<()> {
        if self.sol_reserves == 0 || self.token_reserves == 0 {
            return Err(FairMemeError::EmptySupply.into());
        }
        Ok(())
    }

    pub fn get_buy_price(&self, sol_amount: u128) -> Option<u128> {
        if sol_amount == 0 || sol_amount > self.sol_reserves {
            return None;
        }
        let k = self.token_reserves.checked_mul(self.sol_reserves)?;
        let new_sol_reserves = self.sol_reserves.checked_add(sol_amount)?;
        let new_token_reserves = k.checked_div(new_sol_reserves)?;

        let token_amount = self.token_reserves.checked_sub(new_token_reserves)?;
        Some(token_amount)
    }

    pub fn apply_buy(&mut self, sol_amount: u128) -> Option<TradeResult> {
        let token_amount = self.get_buy_price(sol_amount)?;

        self.sol_reserves = self.sol_reserves.checked_add(sol_amount)?;
        self.token_reserves = self.token_reserves.checked_sub(token_amount)?;

        Some(TradeResult {
            token_amount: token_amount as u64,
            sol_amount: sol_amount as u64,
        })
    }

    pub fn get_sell_price(&self, token_amount: u128) -> Option<u128> {
        if token_amount == 0 || token_amount > self.token_reserves {
            return None;
        }

        let k = self.token_reserves.checked_mul(self.sol_reserves)?;
        let new_token_reserves = self.token_reserves.checked_add(token_amount)?;
        let (new_sol_reserves, _) = k.checked_ceil_div(new_token_reserves)?;

        let sol_amount = self.sol_reserves.checked_sub(new_sol_reserves)?;
        Some(sol_amount)
    }

    pub fn apply_sell(&mut self, token_amount: u128) -> Option<TradeResult> {
        let sol_amount = self.get_sell_price(token_amount)?;
        self.sol_reserves = self.sol_reserves.checked_sub(sol_amount)?;
        self.token_reserves = self.token_reserves.checked_add(token_amount)?;

        Some(TradeResult {
            token_amount: token_amount as u64,
            sol_amount: sol_amount as u64,
        })
    }
}

#[cfg(test)]
mod tests {
    use anchor_lang::prelude::Pubkey;
    use solana_program::native_token::LAMPORTS_PER_SOL;

    use crate::state::fairmeme_state::FairMemeState;

    use super::AmmCalculator;

    #[test]
    fn test_apply_buy() {
        let sol_reserves: u64 = 3000000000;
        let token_reserves: u64 = 1000000000000;
        let token_amount: u64 = 1000000;

        let mut amm = AmmCalculator::new(sol_reserves as u128, token_reserves as u128);
        let buy_result = amm.apply_buy(token_amount as u128).unwrap();

        println!("{:?}", buy_result);
    }

    #[test]
    fn test_apply_sell() {
        let sol_reserves: u64 = 3000000000;
        let token_reserves: u64 = 1000000000000;
        let token_amount: u64 = 100000;

        let mut amm = AmmCalculator::new(sol_reserves as u128, token_reserves as u128);
        let sell_result = amm.apply_sell(token_amount as u128).unwrap();

        println!("{:?}", sell_result);
    }

    #[test]
    fn test_amm_with_state() {
        let auction_period = 12 *60 * 60 * 10 / 4; // 12h
        let token_locked = 896575169778778;
        let token_release_per_slot = token_locked / auction_period;
        let mut state = FairMemeState {
            creator: Pubkey::default(),
            sol_reserves: 3005912100,
            token_reserves: 102224830221222,
            token_locked: 896575169778778,
            last_update_slot: 317952000,
            start_time: 1722254573,
            auction_period,
            token_release_per_slot,
            start_slot: 1722254573,
        };

        let now: u64 = 317952000 + auction_period / 4;
        state.update_util(now);

        print!("state: {:?}", state);

        let amm = AmmCalculator::new(state.sol_reserves as u128, state.token_reserves as u128);
        let sol_amount = LAMPORTS_PER_SOL / 10;
        let price = amm.get_buy_price(sol_amount as u128).unwrap();
        println!("token_amount: {}, price: {}", sol_amount, price);
    }
}
