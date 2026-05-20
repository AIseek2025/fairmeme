/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { PublicKey } from '@solana/web3.js';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useReducer } from 'react';
import { useAsyncEffect, useCreation, useMemoizedFn, useUpdateEffect } from 'ahooks';
import { IS_TEST } from '@/constants/env';
import { fairmemeReferralIDL } from '@/abi/fairmemeReferral';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { SystemProgram } from '@solana/web3.js';
import { checkAirdrop, checkInviteCode, getSummary } from '@/services/api/airdrop';
import useWalletAddress from './useWalletAddress';
import useStore from '@/store/zustand';
import { CHAIN_TYPE } from '@/constants/airdrop';
import { getAndParseTransactionError } from '@/utils/common';
import { GetSummary } from '@/types/meme';
import { buildOptimalTransaction } from '@/utils/buildOptimalTransaction';

// Configuration
const REFERRAL_PROGRAM_ID = new PublicKey(
    IS_TEST ? 'B5LrGrvdsdsmjYQPrg24kneF8DpztYm2RScq1DsbE92B' : 'B5LrGrvdsdsmjYQPrg24kneF8DpztYm2RScq1DsbE92B',
);
const REFERRAL_SEED = 'referral';

// Types
type ReferralState = {
    isCodeValid: boolean | null;
    isRelationshipEstablished: boolean | null;
    hasAddressAirdropQualification: boolean;
    isWalletConnected: boolean;
    referrerCode: string | null;
    summary: GetSummary.Response;
    isUserChecked: boolean;
    error: string | null;
    isLoading: boolean;
    isSuccess: boolean;
    hash: string;
    initLoading: boolean;
};

type ReferralAction =
    | { type: 'SET_WALLET_CONNECTION'; payload: boolean }
    | { type: 'SET_CODE_VALIDITY'; payload: boolean | null }
    | { type: 'SET_RELATIONSHIP_STATUS'; payload: boolean | null }
    | { type: 'SET_REFERRER_CODE'; payload: string | null }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_SUMMARY'; payload: GetSummary.Response }
    | { type: 'SET_IS_USER_CHECKED'; payload: boolean }
    | { type: 'SET_HAS_ADDRESS_AIRDROP_QUALIFICATION'; payload: boolean }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_INIT_LOADING'; payload: boolean }
    | { type: 'SET_SUCCESS_STATUS'; payload: boolean }
    | { type: 'SET_HASH'; payload: string };

const initialReferralState: ReferralState = {
    isCodeValid: null,
    isRelationshipEstablished: null,
    hasAddressAirdropQualification: false,
    isWalletConnected: false,
    referrerCode: null,
    isUserChecked: false,
    summary: {
        total: 0,
        tradeTotal: 0,
        twTotal: 0,
        createTotal: 0,
        addressTotal: 0,
        inviteTotal: 0,
        creatorCount: 0,
        tradeVol: 0,
        inviteCount: 0,
        id: 0,
        creatorAddress: '',
        memberName: '',
        pictureUrl: '',
        memberStatus: 0,
        chainId: '',
        twName: '',
        twUserName: '',
        twAvatarUrl: '',
        twScore: '',
        inviteCode: '',
        invitedCode: '',
        eligible: '',
    },
    isLoading: false,
    error: null,
    isSuccess: false,
    hash: '',
    initLoading: true,
};

function referralReducer(state: ReferralState, action: ReferralAction): ReferralState {
    switch (action.type) {
        case 'SET_WALLET_CONNECTION':
            return { ...state, isWalletConnected: action.payload, error: null };
        case 'SET_CODE_VALIDITY':
            return { ...state, isCodeValid: action.payload, error: null };
        case 'SET_RELATIONSHIP_STATUS':
            return { ...state, isRelationshipEstablished: action.payload, error: null };
        case 'SET_REFERRER_CODE':
            return { ...state, referrerCode: action.payload, error: null };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'SET_SUMMARY':
            return { ...state, summary: action.payload };
        case 'SET_IS_USER_CHECKED':
            return { ...state, isUserChecked: action.payload };
        case 'SET_HAS_ADDRESS_AIRDROP_QUALIFICATION':
            return { ...state, hasAddressAirdropQualification: action.payload };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_SUCCESS_STATUS':
            return { ...state, isSuccess: action.payload };
        case 'SET_HASH':
            return { ...state, hash: action.payload };
        case 'SET_INIT_LOADING':
            return { ...state, initLoading: action.payload };
        default:
            return state;
    }
}
type ShowToastFunction = (
    type: 'success' | 'error',
    message: string,
    description: string | React.ReactNode,
    signature?: string,
) => void;
type ReferralSystemProps = {
    referralCode?: string | null;
    showToastFn: ShowToastFunction;
};

const useReferralSystem = ({ referralCode, showToastFn }: ReferralSystemProps) => {
    const { addressTokenStr } = useWalletAddress();
    const anchorWallet = useAnchorWallet();
    const [state, dispatch] = useReducer(referralReducer, initialReferralState);
    const { publicKey, connected, connect } = useWallet();
    const { connection } = useConnection();
    const currentChainStr = useStore(({ currentChain }) => currentChain);

    const program = useCreation(() => {
        if (!anchorWallet) return null;
        const provider = new AnchorProvider(connection, anchorWallet, { commitment: 'confirmed' });
        return new Program(fairmemeReferralIDL, REFERRAL_PROGRAM_ID, provider);
    }, [connection, anchorWallet]);
    useUpdateEffect(() => {
        if (state.isSuccess || state.error || state.hash) {
            const toastType = state.isSuccess ? 'success' : 'error';
            const message = state.isSuccess ? 'Successful' : state.error || 'Failed';
            showToastFn(toastType, message, '', state.hash);
        }
    }, [state.hash, state.isSuccess, state.error]);

    // const ensureWalletConnection = useMemoizedFn(async () => {
    //     if (!connected) {
    //         try {
    //             await connect();
    //             dispatch({ type: 'SET_WALLET_CONNECTION', payload: true });
    //         } catch (error) {
    //             console.error('Failed to connect wallet:', error);
    //             dispatch({ type: 'SET_WALLET_CONNECTION', payload: false });
    //             dispatch({ type: 'SET_ERROR', payload: 'Failed to connect wallet' });
    //         }
    //     } else {
    //         dispatch({ type: 'SET_WALLET_CONNECTION', payload: true });
    //     }
    // });

    const validateReferralCode = useMemoizedFn(async () => {
        if (!referralCode) {
            dispatch({ type: 'SET_CODE_VALIDITY', payload: false });
            return;
        }
        if (!connected) return;
        try {
            const { checkResult } = await checkInviteCode({ id: referralCode, address: publicKey?.toBase58() ?? '' });
            dispatch({ type: 'SET_CODE_VALIDITY', payload: checkResult });
        } catch (error) {
            console.error('error:', error);
            dispatch({ type: 'SET_CODE_VALIDITY', payload: false });
            // dispatch({ type: 'SET_ERROR', payload: 'Error validating referral code' });
        }
    });

    const establishReferralRelationship = useMemoizedFn(async () => {
        // if (!addressTokenStr) {
        //     await ensureWalletConnection();
        //     if (!state.isWalletConnected) {
        //         dispatch({ type: 'SET_ERROR', payload: 'Failed to connect wallet. Cannot proceed.' });
        //         return;
        //     }
        // }

        if (!publicKey || !program) return;
        dispatch({ type: 'SET_LOADING', payload: true });
        if (!referralCode || (referralCode && !state.isCodeValid)) {
            await checkAddressAirdropRelationship();
            dispatch({
                type: 'SET_SUCCESS_STATUS',
                payload: true,
            });
        } else {
            try {
                const instruction = await program.methods
                    .store(referralCode)
                    .accounts({
                        user: publicKey,
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction();
                const { transaction, recentBlockhash } = await buildOptimalTransaction(
                    connection,
                    [instruction],
                    publicKey,
                    [],
                );
                const signedTransaction = await anchorWallet!.signTransaction(transaction);
                const signature = await connection.sendRawTransaction(signedTransaction.serialize());
                await connection.confirmTransaction(
                    {
                        signature,
                        blockhash: recentBlockhash.blockhash,
                        lastValidBlockHeight: recentBlockhash.lastValidBlockHeight,
                    },
                    'confirmed',
                );
                const errorResult = await getAndParseTransactionError(connection, signature);
                if (!errorResult?.parsed) {
                    await checkAddressAirdropRelationship();
                    dispatch({
                        type: 'SET_SUCCESS_STATUS',
                        payload: true,
                    });
                    dispatch({
                        type: 'SET_HASH',
                        payload: signature,
                    });
                } else {
                    dispatch({
                        type: 'SET_SUCCESS_STATUS',
                        payload: false,
                    });
                    dispatch({ type: 'SET_ERROR', payload: errorResult?.parsed?.errorMessage ?? '' });
                }
                // console.log('signature', signature);
                // console.log('errorResult', errorResult);
            } catch (error) {
                console.error('establishReferralRelationshipError', error);
                // dispatch({
                //     type: 'SET_ERROR',
                //     payload: 'The service is currently unavailable. Please try again later.',
                // });
            }
        }

        // try {
        //     await checkAddressAirdropRelationship();
        // } catch (error) {
        //     console.error(error);
        //     dispatch({
        //         type: 'SET_ERROR',
        //         payload: 'Cannot establish referral relationship: address airdrop check failed',
        //     });
        // }

        dispatch({ type: 'SET_LOADING', payload: false });
    });

    const checkAddressAirdropRelationship = useMemoizedFn(async () => {
        if (!addressTokenStr) {
            // dispatch({ type: 'SET_RELATIONSHIP_STATUS', payload: null });
            return;
        }

        try {
            const { eligible } = await checkAirdrop({
                user_address: addressTokenStr,
                chain: CHAIN_TYPE[currentChainStr],
            });
            dispatch({ type: 'SET_HAS_ADDRESS_AIRDROP_QUALIFICATION', payload: !eligible });
        } catch (error) {
            console.error('error:', error);
            // dispatch({ type: 'SET_RELATIONSHIP_STATUS', payload: null });
            // dispatch({ type: 'SET_ERROR', payload: 'The service is currently unavailable. Please try again later.' });
        }
    });

    const getSummaryFn = useMemoizedFn(async () => {
        if (!addressTokenStr || !publicKey) {
            // dispatch({ type: 'SET_ERROR', payload: 'Do not connect' });
            return;
        }
        if (!program) {
            // dispatch({
            //     type: 'SET_ERROR',
            //     payload: 'The service is currently unavailable. Please try again later.',
            // });
            return;
        }
        try {
            const res = await getSummary({ creatorAddress: addressTokenStr });
            dispatch({ type: 'SET_SUMMARY', payload: res });
            dispatch({ type: 'SET_IS_USER_CHECKED', payload: res.eligible !== '' });
        } catch (error) {
            console.error('error', error);
            dispatch({ type: 'SET_IS_USER_CHECKED', payload: false });
            // dispatch({ type: 'SET_ERROR', payload: 'The service is currently unavailable. Please try again later.' });
        }
    });

    useAsyncEffect(async () => {
        // await ensureWalletConnection();
        // if (state.isWalletConnected) {
        // console.log('referralCode change', referralCode);
        if (!referralCode) {
            await getSummaryFn();
        } else {
            await Promise.all([validateReferralCode(), getSummaryFn()]);
        }
        dispatch({
            type: 'SET_INIT_LOADING',
            payload: false,
        });
    }, [referralCode, validateReferralCode, getSummaryFn, addressTokenStr]);

    return {
        ...state,
        establishReferralRelationship,
        // connectWallet: ensureWalletConnection,
        getSummaryFn,
    };
};

export default useReferralSystem;
