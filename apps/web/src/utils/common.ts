/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-useless-return */
/* eslint-disable prefer-destructuring */
import {
    PublicKey,
    Connection,
    TransactionInstruction,
    Transaction,
    RpcResponseAndContext,
    SimulatedTransactionResponse,
    VersionedTransaction,
    SystemProgram,
} from '@solana/web3.js';
import { AnchorError } from '@coral-xyz/anchor';
import {
    TOKEN_PROGRAM_ID,
    createAssociatedTokenAccountInstruction,
    getAccount,
    getAssociatedTokenAddress,
    getAssociatedTokenAddressSync,
} from '@solana/spl-token';
import { Provider, AnchorProvider } from '@coral-xyz/anchor';
import { SetState } from 'ahooks/lib/useSetState';

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { isArray, isNumber, isObject } from 'lodash-es';
import { IS_TEST } from '@/constants/env';

/**
 * Formats an integer with thousand separators
 * @param num The integer to format
 * @param thousandsSep Thousands separator character (optional, default is ',')
 * @returns Formatted integer as a string
 */
export function formatInteger(num: number, thousandsSep = ','): string {
    if (!Number.isInteger(num)) return '0';
    const strNum = Math.abs(num).toString();
    const formattedNum = strNum.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
    return num < 0 ? `-${formattedNum}` : formattedNum;
}

export const formatTimestamp = (input: string | number, decimals = 0): string => {
    const timestamp = typeof input === 'string' ? parseFloat(input) : input;

    if (isNaN(timestamp)) {
        return '';
    }
    if (timestamp < 60) {
        return `${timestamp}s`;
    } else if (timestamp < 86400) {
        const hours = (timestamp / 3600).toFixed(decimals);
        return `${hours}h`;
    } else {
        const days = (timestamp / 86400).toFixed(decimals);
        return `${days}d`;
    }
};

export const formatNumber = (input: string | number | undefined, decimals = 2) => {
    if (!input) return '0';
    const num = typeof input === 'string' ? parseFloat(input) : input;

    if (isNaN(num)) {
        return '';
    }

    const removeTrailingZeros = (value: string) => value.replace(/\.0+$/, '');

    if (num >= 1_000_000_000) {
        return removeTrailingZeros((num / 1_000_000_000).toFixed(decimals)) + 'B';
    }
    if (num >= 1_000_000) {
        return removeTrailingZeros((num / 1_000_000).toFixed(decimals)) + 'M';
    }

    if (num >= 1_000) {
        return removeTrailingZeros((num / 1_000).toFixed(decimals)) + 'K';
    }

    return removeTrailingZeros(num.toFixed(decimals));
};

/**
 * Merges multiple CSS class names and resolves any conflicts according to Tailwind CSS rules.
 *
 * @param {...ClassValue[]} inputs - The CSS class names to be merged. These can be strings,
 *                                   arrays, or objects that `clsx` can interpret.
 * @returns {string} - A single string of merged class names with any Tailwind CSS conflicts resolved.
 */
export const safeMergeClassName = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};
export const getAssetsFile = (url: string) => {
    return new URL(`../assets/${url}`, import.meta.url).href;
};

export const openExplorer = (txId: string, type: 'tx' | 'token' | 'account' | 'address') => {
    switch (type) {
        case 'tx':
            window.open(
                IS_TEST ? `https://solscan.io/tx/${txId}?cluster=devnet` : `https://solscan.io/tx/${txId}`,
                '_blank',
                'noopener,noreferrer',
            );
            break;
        case 'token':
            window.open(
                IS_TEST ? `https://solscan.io/token/${txId}?cluster=devnet` : `https://solscan.io/token/${txId}`,
                '_blank',
                'noopener,noreferrer',
            );
        case 'account':
            window.open(
                IS_TEST ? `https://solscan.io/account/${txId}?cluster=devnet` : `https://solscan.io/account/${txId}`,
                '_blank',
                'noopener,noreferrer',
            );
        case 'address':
            window.open(
                IS_TEST ? `https://solscan.io/address/${txId}?cluster=devnet` : `https://solscan.io/address/${txId}`,
                '_blank',
                'noopener,noreferrer',
            );
        default:
            break;
    }
};

export async function getAndParseTransactionError(connection: Connection, signature: string) {
    try {
        const tx = await connection.getTransaction(signature, {
            maxSupportedTransactionVersion: 0,
            commitment: 'confirmed',
        });

        if (!tx) {
            console.error('Transaction not found');
            return { parsed: null, raw: null };
        }

        if (tx.meta?.err) {
            let parsedError;

            try {
                const anchorError = AnchorError.parse(tx.meta.logMessages ?? []);
                if (!anchorError) return;
                parsedError = {
                    errorCode: anchorError.error.errorCode.number.toString(),
                    errorMessage: anchorError.error.errorMessage,
                    errorData: anchorError,
                };
            } catch (e) {
                const errorLog = tx.meta.logMessages?.find((log) => log.includes('Error:'));
                parsedError = {
                    errorCode: tx.meta.err.toString(),
                    errorMessage: errorLog ? errorLog.split('Error:')[1].trim() : 'Unknown error',
                    errorData: tx.meta.err,
                };
            }

            return { parsed: parsedError, raw: tx.meta.err };
        }

        return { parsed: null, raw: null };
    } catch (error) {
        console.error('Error fetching transaction details:', error);
        return { parsed: null, raw: error };
    }
}

export async function simulateTransaction(
    connection: Connection,
    message: any,
): Promise<RpcResponseAndContext<SimulatedTransactionResponse>> {
    const { blockhash } = await connection.getLatestBlockhash();
    message.recentBlockhash = blockhash;
    const transaction = new VersionedTransaction(message);
    return await connection.simulateTransaction(transaction);
}

export const getImg = (url: string) => {
    return new URL(url, import.meta.url).href;
};

export const log = (e: unknown) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(e);
    }
};

export async function estimateTransactionFee(connection: Connection, publicKey: PublicKey) {
    const recentBlockhash = await connection.getLatestBlockhash();
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: publicKey,
            lamports: 0,
        }),
    );
    transaction.recentBlockhash = recentBlockhash.blockhash;
    transaction.feePayer = publicKey;

    const fees = await transaction.getEstimatedFee(connection);
    return (fees ?? 0) * 1.5; // 50% buffer
}

/**
 * @description: Determines whether two values are of the same type
 * @param {unknown} value1
 * @param {unknown} value2
 * @return {*}
 */
export const areKeysAndTypesEqual = (value1: unknown, value2: unknown) => {
    // Check if both values are of the same type
    if (typeof value1 !== typeof value2) {
        return false;
    }

    // If both are arrays
    if (isArray(value1) && isArray(value2)) {
        if (value1.length !== value2.length) {
            return false;
        }
        for (let i = 0; i < value1.length; i += 1) {
            if (!areKeysAndTypesEqual(value1[i], value2[i])) {
                return false;
            }
        }
        return true;
    }

    // If both are objects
    if (isObject(value1) && isObject(value2)) {
        const keys1 = Object.keys(value1) as (keyof typeof value1)[];
        const keys2 = Object.keys(value2) as (keyof typeof value2)[];

        // Check if the number of keys is the same
        if (keys1.length !== keys2.length) {
            return false;
        }

        // Check if each key exists in both objects and the types of the values are the same
        for (const key of keys1) {
            if (!Object.prototype.hasOwnProperty.call(value2, key)) {
                return false;
            }
            if (!areKeysAndTypesEqual(value1[key], value2[key])) {
                return false;
            }
        }

        return true;
    }

    // For primitive values, the types were already checked at the beginning
    return true;
};

export const getOrCreateATAInstruction = async (
    tokenMint: PublicKey,
    user: PublicKey,
    connection: Connection,
): Promise<[PublicKey, TransactionInstruction?]> => {
    let toAccount;
    try {
        toAccount = getAssociatedTokenAddressSync(tokenMint, user);
        const account = await connection.getAccountInfo(toAccount);
        if (!account) {
            const ix = createAssociatedTokenAccountInstruction(user, toAccount, user, tokenMint);
            return [toAccount, ix];
        }
        return [toAccount, undefined];
    } catch (e) {
        /* handle error */
        console.error('Error::getOrCreateATAInstruction', e);
        throw e;
    }
};

export const getTokenBalance = async (walletAddress: string, tokenMintAddress: string, provider: Provider) => {
    const wallet = new PublicKey(walletAddress);
    const mint = new PublicKey(tokenMintAddress);

    try {
        const tokenAddress = await getAssociatedTokenAddress(mint, wallet, false, TOKEN_PROGRAM_ID);
        const tokenAccount = await getAccount(provider.connection, tokenAddress);
        return tokenAccount.amount;
    } catch (error) {
        return 0;
    }
};

export const getAddressDisplayName = (address?: string, prefix = 6, suffix = -4) => {
    return address ? `${address.slice(0, prefix)}...${address.slice(suffix)}` : '';
};

/* copy address */
export const copyToClipboard = async (str = '') => {
    try {
        await navigator.clipboard.writeText(str);
    } catch (err) {
        console.error('COPY failed', err);
    }
};

export const formatRelativeTime = (seconds: number) => {
    const secondsInDay = 86400;
    const secondsInHour = 3600;
    const secondsInMinute = 60;

    if (seconds < secondsInMinute) {
        return '';
    }
    if (seconds < secondsInHour) {
        const minutes = Math.floor(seconds / secondsInMinute);
        return `${minutes} m`;
    }
    if (seconds < secondsInDay) {
        const hours = Math.floor(seconds / secondsInHour);
        return `${hours} h`;
    }
    const days = Math.floor(seconds / secondsInDay);
    return `${days} d`;
};

export const handleInputChange = async (
    val: string,
    fallback: SetState<{
        value1: string;
        value2: string;
    }>,
    type: 1 | 2,
    max: number,
    // getAnotherAmountRun: DebouncedFunc<() => ReturnType<() => void>>,
    isConnected: boolean,
) => {
    let newValue = val.replace(/[^0-9.]/g, '');

    const maxDecimals = type === 1 ? 9 : 6;

    const isValidInput = new RegExp(
        `^$|^[1-9]\\d*$|^[1-9]\\d*\\.\\d{0,${maxDecimals}}$|^0\\.\\d{0,${maxDecimals}}$|^0$`,
    ).test(newValue);
    if (!isValidInput) return;

    if (newValue === '.') newValue = '0.';

    if (newValue.length > 1 && newValue.startsWith('0') && newValue[1] !== '.') newValue = newValue.slice(1);

    if (!Number(newValue)) {
        fallback({
            value1: type === 1 ? newValue : '0',
            value2: type === 2 ? newValue : '0',
        });
        return;
    }

    const isValueExceedingMax = +newValue > max;
    const adjustedValue = isValueExceedingMax && !!isConnected ? `${max}` : newValue;
    if (type === 1) {
        fallback({ value1: adjustedValue });
    } else {
        fallback({ value2: adjustedValue });
    }
    // getAnotherAmountRun();
};

export const fetchTokenBalance = async (
    publicKey: PublicKey,
    anchorProvider: AnchorProvider,
    data: FairMemeHome.Item,
) => {
    try {
        const balance = await getTokenBalance(publicKey?.toBase58(), data?.tokenAddress, anchorProvider);

        return +(balance || 0).toString() / 1000000;
    } catch (error) {
        return 0;
    }
};

export const formatTinyPrice = (price: number) => {
    if (typeof price !== 'number' || isNaN(price)) {
        return 'Invalid price';
    }

    const priceStr = price.toFixed(12); // Increase precision
    const [intPart, decimalPart] = priceStr.split('.');

    if (intPart !== '0') {
        return `$${price.toFixed(2)}`;
    }

    let leadingZeros = 0;
    while (decimalPart[leadingZeros] === '0' && leadingZeros < decimalPart.length) {
        leadingZeros++;
    }

    if (leadingZeros >= decimalPart.length) {
        return '$0';
    }

    if (leadingZeros <= 4) {
        // If 4 or fewer leading zeros, return the exact representation
        // but trim trailing zeros after the 4th decimal place
        const trimmedPrice = price.toFixed(8).replace(/\.?0+$/, '');
        return `$${trimmedPrice}`;
    }

    // Calculate the number of zeros for the subscript
    // Get the significant digits and round to 4 places
    const significantPart = parseFloat(`0.${decimalPart.slice(leadingZeros)}`)
        .toFixed(4)
        .slice(2); // Remove "0." from the beginning

    return `$0.0<sub>${leadingZeros}</sub>${significantPart}`;
};
export const calculatePercentage = (part: number, whole: number, decimalPlaces = 2) => {
    if (!part || !whole) return 0;
    if (whole === 0) {
        return 0;
    } else {
        const percentage = (part / whole) * 100;
        return Number(percentage.toFixed(decimalPlaces));
    }
};
export const formatAddress = (address: string, startLength = 4, endLength = 4): string => {
    if (!address) return '';
    const middle = '...';
    const start = address.substring(0, startLength);
    const end = address.substring(address.length - endLength);
    return `${start}${middle}${end}`;
};

export const formattedTime = (timestamp: string, includeTime = true) => {
    if (!timestamp) {
        return '';
    }

    const date = new Date(+timestamp * 1000);
    const now = new Date();
    let diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds <= 0) {
        diffInSeconds = 1;
    }
    // If within last 24 hours, show relative time
    if (diffInSeconds < 86400) {
        // 86400 seconds in a day
        if (diffInSeconds < 60) {
            return `${diffInSeconds} sec ago`;
        } else if (diffInSeconds < 3600) {
            // Less than an hour
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} min ago`;
        } else {
            // More than an hour, less than a day
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}h ago`;
        }
    }

    // Otherwise, use the original formatting
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    };

    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.hour12 = false;
    }

    return date.toLocaleString('zh-CN', options).replace(/\//g, '-');
};
export function unitFormatter(type: 'sol' | 'token' | 'usd', value: number | string, formatter: 'number'): number;
export function unitFormatter(type: 'sol' | 'token' | 'usd', value: number | string, formatter?: 'string'): string;
export function unitFormatter(
    type: 'sol' | 'token' | 'usd',
    value: number | string,
    formatter: 'string' | 'number' = 'number',
): string | number {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numValue) || numValue === 0) {
        return formatter === 'number' ? 0 : '0';
    }

    switch (type) {
        case 'sol':
            return formatter === 'number' ? Number(numValue.toFixed(9)) : numValue.toFixed(9);

        case 'token':
            return formatter === 'number' ? Number(numValue.toFixed(6)) : numValue.toFixed(6);

        case 'usd':
            if (numValue >= 1000) {
                const roundedValue = Math.round(numValue);
                return formatter === 'number' ? roundedValue : roundedValue.toLocaleString('en-US');
            } else {
                return formatter === 'number' ? Number(numValue.toFixed(3)) : numValue.toFixed(3);
            }

        default:
            throw new Error(`Unsupported type: ${type}`);
    }
}

export const renderFieldsAirdrop = (
    fields: number | string | undefined,
    checkEligible?: boolean,
    suffix = '$FAIR',
): string => {
    if (!isNumber(fields)) {
        return `-- ${suffix}`;
    }
    if (checkEligible) {
        return fields ? `${fields.toLocaleString()} ${suffix}` : 'Not Eligible';
    }

    return `${fields.toLocaleString()} ${suffix}`;
};
