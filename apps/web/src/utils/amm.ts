import { Connection, PublicKey } from '@solana/web3.js';

export interface TradeResult {
    tokenAmount: bigint;
    solAmount: bigint;
}

export class AMM {
    constructor(
        public solReserves: bigint,
        public tokenReserves: bigint,
    ) {}

    getBuyPrice(tokens: bigint): bigint {
        if (tokens <= 0 || tokens > this.tokenReserves) {
            return BigInt(0);
        }
        const k = this.solReserves * this.tokenReserves;
        const newTokenReserves = this.tokenReserves - tokens;
        const newSolReserves = k / newTokenReserves;
        const solAmount = newSolReserves - this.solReserves;
        return solAmount;
    }

    applyBuy(tokenAmount: bigint): TradeResult {
        const finalTokenAmount = tokenAmount > this.tokenReserves ? this.tokenReserves : tokenAmount;
        const solAmount = this.getBuyPrice(finalTokenAmount);

        this.tokenReserves -= finalTokenAmount;
        this.solReserves += solAmount;
        return {
            tokenAmount: finalTokenAmount,
            solAmount,
        };
    }

    applySell(tokenAmount: bigint): TradeResult {
        const solAmount = this.getSellPrice(tokenAmount);
        this.solReserves -= solAmount;
        this.tokenReserves += tokenAmount;
        return {
            tokenAmount,
            solAmount,
        };
    }

    getSellPrice(tokens: bigint): bigint {
        if (tokens <= 0 || tokens > this.tokenReserves) {
            return BigInt(0);
        }
        const k = this.solReserves * this.tokenReserves;
        const newTokenReserves = this.tokenReserves - tokens;
        const newSolReserves = k / newTokenReserves;
        const solAmount = this.solReserves - newSolReserves;
        return solAmount;
    }

    updateTokenReserves(amount: bigint) {
        this.tokenReserves += amount;
    }
}
