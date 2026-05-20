// src/config.ts
import * as dotenv from 'dotenv';

// Load .env into process.env
dotenv.config();

export const DB_HOST = process.env.DB_HOST ?? '127.0.0.1';
export const DB_PORT = Number(process.env.DB_PORT ?? 5432);
export const DB_USER = process.env.DB_USER ?? '';
export const DB_PASS = process.env.DB_PASS ?? '';
export const DB_NAME = process.env.DB_NAME ?? '';

export const SOLANA_RPC_URL =
    process.env.SOLANA_RPC_URL ?? 'https://api.mainnet-beta.solana.com';
export const FAIRMEME_PROGRAM_ID =
    process.env.FAIRMEME_PROGRAM_ID ?? 'HN6v9ASvYLuFbvW6b9tBCKoX6PH546MPKb4R4MSot8c8';
export const FAIRMEME_REFERRAL_PROGRAM_ID =
    process.env.FAIRMEME_REFERRAL_PROGRAM_ID ?? 'B5LrGrvdsdsmjYQPrg24kneF8DpztYm2RScq1DsbE92B';
export const INDEXER_DEBUG = process.env.INDEXER_DEBUG === 'true';

export const debugLog = (...args: unknown[]) => {
    if (INDEXER_DEBUG) {
        console.log(...args);
    }
};
