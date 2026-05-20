use anchor_lang::prelude::*;

use crate::state::constants::{
    DISCOUNT_LEVEL1_AMOUNT, DISCOUNT_LEVEL1_PERCENT, DISCOUNT_LEVEL2_AMOUNT,
    DISCOUNT_LEVEL2_PERCENT,
};

pub fn calc_fee_maybe_discount(amount: u64, fee_basic_points: u64, fair_holdings: u64) -> u64 {
    let base_fee = amount * fee_basic_points / 10000;
    if fair_holdings >= DISCOUNT_LEVEL1_AMOUNT && fair_holdings < DISCOUNT_LEVEL2_AMOUNT {
        base_fee * (10000 - DISCOUNT_LEVEL1_PERCENT) / 10000
    } else if fair_holdings >= DISCOUNT_LEVEL2_AMOUNT {
        base_fee * (10000 - DISCOUNT_LEVEL2_PERCENT) / 10000
    } else {
        base_fee
    }
}

pub fn get_time_now() -> Result<u64> {
    let time = Clock::get()?.unix_timestamp;
    if time > 0 {
        Ok(time as u64)
    } else {
        Err(ProgramError::InvalidAccountData.into())
    }
}

#[cfg(test)]
mod tests {
    use crate::state::constants::DEFAULT_TOKEN_LAMPORTS;

    use super::*;

    #[test]
    fn test_calc_fee_with_discount() {
        let amount = 1_000_000 * DEFAULT_TOKEN_LAMPORTS;
        let fee: u64 = 100; // 1%
        let holdings1 = 100_000 * DEFAULT_TOKEN_LAMPORTS;
        let holdings2 = 200_000 * DEFAULT_TOKEN_LAMPORTS;
        let holdings3 = 800_000 * DEFAULT_TOKEN_LAMPORTS;
        let holdings4 = 2_000_000 * DEFAULT_TOKEN_LAMPORTS;

        let discount1 = calc_fee_maybe_discount(amount, fee, holdings1);
        assert_eq!(discount1, 10000 * DEFAULT_TOKEN_LAMPORTS);

        let discount2 = calc_fee_maybe_discount(amount, fee, holdings2);
        assert_eq!(discount2, 8000 * DEFAULT_TOKEN_LAMPORTS);

        let discount3 = calc_fee_maybe_discount(amount, fee, holdings3);
        assert_eq!(discount3, 8000 * DEFAULT_TOKEN_LAMPORTS);

        let discount4 = calc_fee_maybe_discount(amount, fee, holdings4);
        assert_eq!(discount4, 5000 * DEFAULT_TOKEN_LAMPORTS);
    }
}
