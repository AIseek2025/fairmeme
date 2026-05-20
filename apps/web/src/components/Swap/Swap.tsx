/* eslint-disable @typescript-eslint/no-shadow */
'use client';

import { useEffect, useRef } from 'react';
import { AnchorProvider, BN, setProvider } from '@coral-xyz/anchor';
import { useWallet, useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import { SystemProgram, LAMPORTS_PER_SOL, ComputeBudgetProgram, PublicKey } from '@solana/web3.js';
//@ts-ignore
import BigNumber from 'bignumber.js';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Button } from 'primereact/button';
import Image from 'next/image';
import { useBalance, useAccount, useChainId, useConnect } from 'wagmi';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { injected } from 'wagmi/connectors';
import {
    useBoolean,
    useRequest,
    useSafeState,
    useSetState,
    useCreation,
    useMemoizedFn,
    useAsyncEffect,
    useUpdateEffect,
    useDebounceFn,
} from 'ahooks';

import EthIcon from '@/assets/icon/Ethereum.png';
import Setting from '@/assets/icon/seeting.png';
import { solanaIcon } from '@/assets/images';
import {
    estimateTransactionFee,
    fetchTokenBalance,
    getOrCreateATAInstruction,
    handleInputChange,
    openExplorer,
    safeMergeClassName,
    unitFormatter,
} from '@/utils/common';
import useStore from '@/store/zustand';
import { BALANCE_RATIO_CONFIG, CHAIN_ICON_MAP, CHAIN_LIST, DEFAULT_IMG } from '@/constants';
import { useSolanaTransaction } from '@/hooks/useSolanaTransaction';
import BindModal from './modal';
import SettingModal from './settingModal';
import { getFairMemeSolanaProgram } from '@/utils/solana';
import { useAnchorProvider } from '@/context/anchorProviderContext';
import useWalletAddress from '@/hooks/useWalletAddress';
import { getTokenList } from '@/services/api/home';
import useWsHub, { ActionType } from '@/hooks/useWsHub';
import {
    PUBLICKEY_FOR_SOLANA_PROGRAM_ID,
    GLOBAL_SEED,
    FAIR_MEME_STATE_SEED,
    UNIT_PER_TOKEN,
    AIRDROP_TOKEN,
} from '@/constants/solana';
import { ChainsType } from '@/types/common';
import { Skeleton } from 'primereact/skeleton';
import { Dialog } from 'primereact/dialog';
import { ToastMessage } from 'primereact/toast';
import { getTokenTrending } from '@/services/api/meme';
import { nanoid } from 'nanoid';
import SwapWarnModal from '../Modal/SwapWarnModal';
import useSwapWarnModalStore from '@/store/modalStore/swapWarnModalStore';
import { useToast } from '@/context/ToastContext';

type FormattedNumberProps = {
    value: number;
    prefix?: string;
};

const feeCorrection = (amount: number) => amount * 0.98;

const SwapView = () => {
    const { showToast } = useToast();
    const [isClient, setIsClient] = useSafeState(false);
    const [txFee, setTxFee] = useSafeState('');
    const { isOpen, openModal } = useSwapWarnModalStore();
    const [currentRequestId, setCurrentRequestId] = useSafeState<string>();

    const { sendMessage, latestMessage, connectionStatus } = useWsHub<ActionType.swap>({
        onOpen: () => {
            console.log('WebSocket connected');
        },
        onClose: () => {
            console.log('WebSocket disconnected');
        },
        onMessage: (message: any) => {
            if (message.data.requestID !== currentRequestId) return;
            handleSwapDetailsSuccess(isBuy, message);
        },
        onError: (event) => {
            console.error('WebSocket error:', event);
        },
    });

    const establishSwapInfoChannel = useMemoizedFn(
        ({
            tokenAddress,
            chainName,
            isBuy,
            amount,
        }: {
            tokenAddress: string;
            chainName: ChainsType;
            isBuy: boolean;
            amount: number;
        }) => {
            const requestID = nanoid();
            sendMessage({
                action: ActionType.swap,
                payload: {
                    tokenAddress,
                    chainName,
                    isBuy,
                    amount,
                    requestID,
                },
            });
            setCurrentRequestId(requestID);
        },
    );
    const showToastFn = useMemoizedFn(
        (
            type: ToastMessage['severity'],
            message: string,
            description: string | React.ReactNode,
            signature?: string,
        ) => {
            showToast({
                life: 5000,
                severity: type,
                summary: message,
                position: 'bottom-right',
                detail: (
                    <div className="leading-6">
                        {typeof description === 'string' ? <p>{description}</p> : description}
                        {signature && (
                            <p
                                className="cursor-pointer"
                                onClick={() => {
                                    openExplorer(signature, 'tx');
                                }}
                            >
                                View Transaction <i className="pi pi-link text-[16px]"></i>
                            </p>
                        )}
                    </div>
                ),
            });
        },
    );
    // Hooks and state
    const toastConfig = {
        successMessage: 'Swap Successful',
        successDescription: (params: any) => `Swapped ${params.fromAmount} for ${params.toAmount}.`,
        errorMessage: 'Swap Failed',
        errorDescription: (error: any) => `Error: ${error}`,
    };

    const { execute, txStatus, resetStatus } = useSolanaTransaction(showToastFn, toastConfig);
    const currentChain = useStore((state) => state.currentChain);
    const isEvmChain = useCreation(() => currentChain === 'base' || currentChain === 'eth', [currentChain]);

    const AnchorWallet = useAnchorWallet();
    const anchorProvider = useAnchorProvider();
    const { publicKey, connected: isSolanaConnected } = useWallet();
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const balanceForEvm = useBalance({ address, chainId });

    const { connection } = useConnection();
    const { addressTokenDisplayName, addressTokenStr } = useWalletAddress();
    const [isSwapModalOpen, swapModalController] = useBoolean(false);
    const [isSettingModalOpen, settingModalController] = useBoolean(false);
    const [currentOperation, setCurrentOperation] = useSafeState<'buy' | 'sell'>('buy');

    const [currentInputValue, setCurrentInputValue] = useSetState<{ value1: string; value2: string }>({
        value1: '',
        value2: '',
    });
    const [pairReserve, setPairReserve] = useSafeState<{ nativeReserve: string; tokenReserve: string }>({
        nativeReserve: '0',
        tokenReserve: '0',
    });
    useEffect(() => {
        if (!addressTokenStr) {
            setBalance({ value: 0, loading: false });
        }
    }, [addressTokenStr]);
    const isBuy = useCreation(() => currentOperation === 'buy', [currentOperation]);

    const [balance, setBalance] = useSafeState<{ value: number; loading: boolean }>({
        value: 0,
        loading: false,
    });

    const [keyword, setKeyword] = useSafeState('');
    const [customizebalance, setCustomizeBalance] = useSetState<{ value: number; loading: boolean }>({
        value: 0,
        loading: false,
    });
    const [isActive, activeStateController] = useBoolean(false);
    const [morePriceInfo, setMorePriceInfo] = useBoolean(false);

    const [splitId, setSplitId] = useSafeState<number>();
    const [currentToken, setCurrentToken] = useSafeState<FairMemeHome.Item | undefined>();

    const containerRef = useRef<HTMLDivElement | null>(null);
    const containerRef2 = useRef<HTMLDivElement | null>(null);

    const currentSlippage = useStore((state) => state.currentSlippage);
    const [isActive2, activeStateController2] = useBoolean(false);
    const [nativeToToken, { toggle: toggleNativeToToken }] = useBoolean(true);

    const { connect } = useConnect();
    const { setVisible: setSolanaWalletModalVisible } = useWalletModal();
    const calculatePriceImpact = useMemoizedFn((x: string, y: string, delta: string, isSwapAForB: boolean) => {
        const xBN = new BigNumber(x); // SOL
        const yBN = new BigNumber(y); // Token
        const deltaBN = new BigNumber(delta);
        let initialPriceBN, newReserveA, newReserveB, newPriceBN;
        if (isSwapAForB) {
            initialPriceBN = xBN.div(yBN); // SOL/Token
            newReserveA = xBN.plus(deltaBN);
            newReserveB = xBN.times(yBN).div(newReserveA);
            newPriceBN = newReserveA.div(newReserveB); // SOL/Token
        } else {
            initialPriceBN = xBN.div(yBN); // SOL/Token
            newReserveB = yBN.plus(deltaBN);
            newReserveA = xBN.times(yBN).div(newReserveB);
            newPriceBN = newReserveA.div(newReserveB); // SOL/Token
        }

        const priceImpactBN = newPriceBN.div(initialPriceBN).minus(1).times(100);
        return Number(priceImpactBN.toFixed(4));
    });

    const { exchangeRateText, moreInfo } = useCreation(() => {
        let exchangeRateText = '';
        const moreInfo = [
            ['Price Impact', ''],
            ['Minimum Received', ''],
            ['Transaction Fee', `${txFee} SOL`],
        ];
        if (!latestMessage)
            return {
                exchangeRateText,
                moreInfo,
            };
        const { tokenAmount, nativeReserve, tokenReserve, nativeAmount, exchangeRate } = latestMessage.data;

        const scale = 1 - currentSlippage;
        let minReceived = '';
        let toNum = 0;
        if (isBuy) {
            exchangeRateText = nativeToToken
                ? `1SOL = ${unitFormatter('token', exchangeRate)} ${currentToken?.tokenTicker}`
                : `1${currentToken?.tokenTicker} = ${unitFormatter('sol', 1 / +exchangeRate)}SOL`;
            if (currentInputValue.value1) {
                toNum = +tokenAmount;
                minReceived = `${unitFormatter('token', toNum * scale)} ${currentToken?.tokenTicker}`;
            }
        } else {
            exchangeRateText = nativeToToken
                ? `1 ${currentToken?.tokenTicker} = ${unitFormatter('sol', exchangeRate)}SOL`
                : `1 SOL = ${unitFormatter('token', 1 / +exchangeRate)}${currentToken?.tokenTicker}`;
            if (currentInputValue.value2) {
                toNum = +nativeAmount;
                minReceived = `${unitFormatter('sol', toNum * scale)} SOL`;
            }
        }
        if (toNum) {
            const res = calculatePriceImpact(
                nativeReserve,
                tokenReserve,
                isBuy ? currentInputValue.value1 : currentInputValue.value2,
                isBuy,
            );
            moreInfo[0][1] = `${res} %`;
        }

        moreInfo[1][1] = minReceived;
        return {
            exchangeRateText,
            moreInfo,
        };
    }, [latestMessage, isBuy, currentInputValue, currentToken, txFee, currentSlippage, nativeToToken]);

    const { data: tokenTrending, runAsync: fetchTokenTrending } = useRequest(getTokenTrending, {
        manual: true,
        defaultParams: [
            {
                chainName: currentChain,
                limit: 8,
                duration: 24 * 60,
            },
        ],
        refreshDeps: [currentChain],
    });

    // API requests
    const {
        runAsync: fetchSwapTokenList,
        data: swapTokenList,
        loading: swapTokenListLoading,
    } = useRequest(getTokenList, {
        manual: true,
    });

    const handleSwapDetailsSuccess = (isBuy: boolean, message: any) => {
        if (message?.data?.nativeReserve && message?.data?.tokenReserve) {
            setPairReserve({
                nativeReserve: message?.data?.nativeReserve,
                tokenReserve: message?.data?.tokenReserve,
            });
        }
        if (isBuy && message?.data?.tokenAmount) {
            setCurrentInputValue({
                value2: unitFormatter('token', +message.data.tokenAmount, 'string'),
            });
        }
        if (!isBuy && message?.data?.nativeAmount) {
            setCurrentInputValue({
                value1: unitFormatter('sol', +message.data.nativeAmount, 'string'),
            });
        }
    };

    // Memoized values
    const loadingStatForButton = useCreation(() => txStatus.isLoading, [txStatus.isLoading]);

    const isInputValueEmpty = useCreation(
        () => +currentInputValue.value1 === 0 || +currentInputValue.value2 === 0,
        [currentInputValue],
    );

    const resetAllOperation = useMemoizedFn(() => {
        setCurrentInputValue({ value1: '', value2: '' });
        setSplitId(undefined);
    });

    const handleCheck = () => {
        setCurrentOperation((prev) => (prev === 'buy' ? 'sell' : 'buy'));
        resetAllOperation();
    };

    const handleChange = async (data: FairMemeHome.Item) => {
        setCurrentToken(data);
        await getUserBalance();
        await getUserTokenBalance(data);
        swapModalController.setFalse();
        resetAllOperation();
    };

    const inputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 1 | 2) => {
        setSplitId(undefined);
        handleInputChange(
            e.target.value,
            setCurrentInputValue,
            type,
            type === 1 ? balance.value : customizebalance.value,
            // getAnotherAmount.run,
            !!addressTokenStr,
        );
    };

    const handleOpenWalletModal = useMemoizedFn(() => {
        if (currentChain === 'sol' && !isSolanaConnected) {
            setSolanaWalletModalVisible(true);
        } else if (currentChain !== 'sol' && !isConnected) {
            connect({ connector: injected(), chainId: CHAIN_LIST!.find((i) => i.key === currentChain)!.chainId });
        }
    });

    const validateAmount = useMemoizedFn((operation) => {
        let flag = true;
        if (!latestMessage?.data) {
            return flag;
        }
        flag = +currentInputValue.value2 <= +latestMessage?.data.tokenReserve / 2;
        return flag;
    });

    const handleSwap = async (operation: 'buy' | 'sell') => {
        handleOpenWalletModal();
        if (publicKey && AnchorWallet && currentChain === 'sol') {
            if (operation === 'buy') {
                if (+currentInputValue.value1 > +pairReserve.nativeReserve / 2) {
                    openModal();
                    return;
                }
            }
            if (operation === 'sell') {
                if (+currentInputValue.value2 > +pairReserve.tokenReserve / 2) {
                    openModal();
                    return;
                }
            }
            try {
                await performSolanaSwap(operation);
            } finally {
                resetAllOperation();
            }
        }
    };

    useAsyncEffect(async () => {
        if (!publicKey || !AnchorWallet || !currentToken) return;
        const estimatedFee = await estimateTransactionFee(connection, publicKey);
        const txFee = estimatedFee / LAMPORTS_PER_SOL;
        setTxFee(`${txFee}`);
    }, [publicKey, AnchorWallet, currentToken]);

    const performSolanaSwap = async (operation: 'buy' | 'sell') => {
        if (!publicKey || !AnchorWallet || !currentToken) {
            throw new Error('Missing required data for swap');
        }
        const provider = new AnchorProvider(connection, AnchorWallet, {});
        setProvider(provider);
        const programId = new PublicKey(PUBLICKEY_FOR_SOLANA_PROGRAM_ID);
        const mintPublickey = new PublicKey(currentToken.tokenAddress);
        const [globalPDA] = PublicKey.findProgramAddressSync([Buffer.from(GLOBAL_SEED)], programId);
        const [fairMemeStatePDA] = PublicKey.findProgramAddressSync(
            [Buffer.from(FAIR_MEME_STATE_SEED), mintPublickey.toBuffer()],
            programId,
        );
        const fairMemeTokenAccount = await getAssociatedTokenAddress(mintPublickey, fairMemeStatePDA, true);
        const program = getFairMemeSolanaProgram(provider);
        const globalParams = await program.account.global.fetch(globalPDA);

        const fairMemeState = await program.account.fairMemeState.fetch(fairMemeStatePDA);

        const [userTokenAccount, createUserMoveAtaTx] = await getOrCreateATAInstruction(
            mintPublickey,
            publicKey,
            connection,
        );
        const [userDiscountTokenAccount, createUserDiscountAtaTx] = await getOrCreateATAInstruction(
            new PublicKey(AIRDROP_TOKEN),
            publicKey,
            connection,
        );

        const computeBudgetIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 1_000_000 });
        const preIns = [computeBudgetIx];
        if (createUserMoveAtaTx) preIns.push(createUserMoveAtaTx);
        if (createUserDiscountAtaTx) preIns.push(createUserDiscountAtaTx);

        if (fairMemeTokenAccount && currentInputValue.value1 && currentInputValue.value2) {
            const balance_ = await connection.getBalance(publicKey);
            let solAmount: BN;
            let tokenAmount: BN;
            let minTokenOutput: BN;
            let minSolOutput: BN;
            let swapTransaction;

            let fromAmount = operation === 'buy' ? currentInputValue.value1 : currentInputValue.value2;
            let toAmount = operation === 'buy' ? currentInputValue.value2 : currentInputValue.value1;
            if (operation === 'buy') {
                fromAmount = `${fromAmount} ${isEvmChain ? 'ETH' : 'SOL'}`;
                toAmount = `${toAmount} ${currentToken?.tokenName}`;
            } else {
                fromAmount = `${fromAmount} ${currentToken?.tokenName}`;
                toAmount = `${toAmount} ${isEvmChain ? 'ETH' : 'SOL'}`;
            }
            const slippageFactor = 1 - currentSlippage / 100;

            if (operation === 'buy') {
                const maxAmountUserCanPay = balance_ - feeCorrection(+currentInputValue.value1) * LAMPORTS_PER_SOL;
                if (maxAmountUserCanPay <= 0) {
                    showToastFn('error', 'Insufficient balance', 'Insufficient balance to cover transaction fee');
                    return;
                }
                solAmount = new BN(
                    Math.min(+currentInputValue.value1 * LAMPORTS_PER_SOL, maxAmountUserCanPay * LAMPORTS_PER_SOL),
                );
                minTokenOutput = new BN(Math.floor(+currentInputValue.value2 * UNIT_PER_TOKEN * slippageFactor));
                swapTransaction = program.methods.buy(solAmount, minTokenOutput);
            } else {
                const tokenBalance = await connection.getTokenAccountBalance(userTokenAccount);
                const maxTokenAmountUserCanPay = new BN(tokenBalance.value.amount);
                tokenAmount = BN.min(new BN(+currentInputValue.value2 * UNIT_PER_TOKEN), maxTokenAmountUserCanPay);
                minSolOutput = new BN(Math.floor(+currentInputValue.value1 * LAMPORTS_PER_SOL * slippageFactor));
                swapTransaction = program.methods.sell(minSolOutput, tokenAmount);
            }

            try {
                const transaction = await swapTransaction
                    .accounts({
                        user: publicKey,
                        global: globalPDA,
                        feeRecipient: globalParams.feeRecipient,
                        creator: fairMemeState.creator,
                        mint: new PublicKey(mintPublickey),
                        fairMemeState: fairMemeStatePDA,
                        fairMemeTokenAccount,
                        userTokenAccount,
                        tokenProgram: TOKEN_PROGRAM_ID,
                        systemProgram: SystemProgram.programId,
                        userDiscountTokenAccount,
                    })
                    .preInstructions(preIns)
                    .transaction();
                await execute(
                    {
                        instructions: transaction.instructions,
                    },
                    { fromAmount, toAmount },
                );
                await getUserBalance();
                await getUserTokenBalance(currentToken);
            } catch (error) {
                console.error('error', error);
            }
        }
    };

    useEffect(() => {
        return () => resetStatus();
    }, [resetStatus]);

    const handleSlip = (data: number, type: 1 | 2) => {
        const decimal = BigNumber(data).dividedBy(100);
        const balanceValue = type === 1 ? balance?.value : customizebalance?.value;
        const result = BigNumber(balanceValue || 0).multipliedBy(decimal);
        setCurrentInputValue({ [`value${type}`]: result.toString() } as { value1: string; value2: string });
    };

    const handleClickOutside = (event: any) => {
        if (
            containerRef.current &&
            !containerRef.current.contains(event.target) &&
            containerRef2.current &&
            !containerRef2.current.contains(event.target)
        ) {
            activeStateController.setFalse();
            activeStateController2.setFalse();
        }
    };

    const getUserBalance = async () => {
        if (publicKey && currentChain === 'sol') {
            try {
                setBalance({ loading: true, value: 0 });
                const res = await connection.getBalance(publicKey);
                setBalance({ value: unitFormatter('sol', res / 1e9, 'number'), loading: false });
            } catch (error) {
                console.error('Error fetching SOL balance:', error);
                setBalance({ loading: false, value: 0 });
            }
        }
        if (isEvmChain && address) {
            setBalance({ value: unitFormatter('sol', balanceForEvm.data?.formatted ?? '0', 'number'), loading: false });
        }
    };

    const getUserTokenBalance = useMemoizedFn(async (token?: FairMemeHome.Item) => {
        if (!token) {
            setCustomizeBalance({ loading: false, value: 0 });
            return;
        }

        if (publicKey && anchorProvider && currentChain === 'sol') {
            try {
                setCustomizeBalance({ loading: true });
                const tokenBalance = await fetchTokenBalance(publicKey, anchorProvider, token);
                setCustomizeBalance({ value: unitFormatter('token', tokenBalance, 'number'), loading: false });
            } catch (error) {
                setCustomizeBalance({ loading: false, value: 0 });
            }
        }
    });

    const FormattedNumber: React.FC<FormattedNumberProps> = ({ value, prefix = '' }) => {
        const formatNumberWithSubscript = (num: number): React.ReactNode[] => {
            if (num === 0) return [prefix, '0'];

            const parts = num.toFixed(10).toString().split('.');
            if (parts.length === 1) return [prefix, parts[0]];

            const integerPart = parts[0];
            const fractionalPart = parts[1];

            const leadingZeros = fractionalPart.match(/^0+/)?.[0].length ?? 0;
            const significantPart = fractionalPart.slice(leadingZeros);

            if (leadingZeros === 0) {
                return [prefix, `${integerPart}.${fractionalPart}`];
            }

            return [prefix, `${integerPart}.0`, <sub key="subscript">{leadingZeros}</sub>, significantPart];
        };

        return <span className="font-mono price-column text-nowrap">{formatNumberWithSubscript(value)}</span>;
    };

    useEffect(() => {
        isSwapModalOpen &&
            fetchTokenTrending({
                chainName: currentChain,
                limit: 8,
                duration: 24 * 60,
            });
    }, [isSwapModalOpen, currentChain]);

    useAsyncEffect(async () => {
        const columns: any = {
            keyword,
            chainName: currentChain,
            type: 'swap',
        };

        if (isSolanaConnected && publicKey) {
            columns.address = publicKey.toBase58();
        } else if (!isSolanaConnected && address) {
            columns.address = address;
        }

        const res = await fetchSwapTokenList({
            limit: 100,
            page: 1,
            columns,
        });
        await getUserBalance();
        if (res?.items?.length > 0) {
            setCurrentToken(res.items[0]);
            await getUserTokenBalance(res.items[0]);
        } else {
            setCurrentToken(undefined);
        }
    }, [currentChain, publicKey, address, isConnected]);

    const { run: fetchSwapTokenListFn } = useDebounceFn(
        () => {
            const columns: any = {
                keyword,
                chainName: currentChain,
                type: 'swap',
            };

            if (isSolanaConnected && publicKey) {
                columns.address = publicKey.toBase58();
            } else if (!isSolanaConnected && address) {
                columns.address = address;
            }

            fetchSwapTokenList({
                limit: 100,
                page: 1,
                columns,
            });
        },
        {
            wait: 500,
        },
    );

    useUpdateEffect(() => {
        fetchSwapTokenListFn();
    }, [keyword]);

    useEffect(() => {
        if (currentToken?.tokenAddress && currentToken?.chainID && connectionStatus === 'connected') {
            if (isBuy) {
                establishSwapInfoChannel({
                    tokenAddress: currentToken.tokenAddress,
                    chainName: currentToken.chainID,
                    isBuy,
                    amount: feeCorrection(+(currentInputValue?.value1 ?? 0)),
                });
            }
            if (!isBuy) {
                establishSwapInfoChannel({
                    tokenAddress: currentToken.tokenAddress,
                    chainName: currentToken.chainID,
                    isBuy,
                    amount: +(currentInputValue?.value2 ?? 0),
                });
            }
        }
    }, [
        currentToken?.tokenAddress,
        currentToken?.chainID,
        isBuy,
        isBuy ? currentInputValue.value1 : currentInputValue.value2,
        connectionStatus,
    ]);

    useEffect(() => {
        resetAllOperation();
    }, [currentChain, publicKey, address, currentToken]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Render functions
    const renderOrigin = () => (
        <>
            <div className="h-48px flex w-full items-center justify-between">
                <input
                    className="w-[17.5rem] bg-transparent text-[2rem] text-[#EAECEF] caret-[#EAECEF] outline-none"
                    type="text"
                    onChange={(e) => inputChange(e, 1)}
                    value={currentInputValue.value1}
                    placeholder="0"
                    disabled={!isBuy}
                />
                <div className="flex items-center rounded-[10px] text-[18px] text-[#848E9C]">
                    <Image
                        src={isEvmChain ? EthIcon : solanaIcon}
                        className="h-[1.75rem] w-[1.75rem] rounded-full"
                        alt=""
                        width={28}
                        height={28}
                    />
                    <div className="ml-[6px] text-[18px] text-[#EAECEF]">{isEvmChain ? 'ETH' : 'SOL'}</div>
                </div>
            </div>
            <div className="mt-1 flex h-[12px] w-full items-center justify-between text-[12px]">
                {/* <FormattedNumber
                    value={+(latestMessage?.data?.nativeTokenPrice ?? 0) * +(latestMessage?.data?.nativeAmount ?? 0)}
                    prefix="$"
                /> */}
                $
                {+(latestMessage?.data?.nativeTokenPrice ?? 0) * +(latestMessage?.data?.nativeAmount ?? 0) > 0
                    ? (
                          +(latestMessage?.data?.nativeTokenPrice ?? 0) * +(latestMessage?.data?.nativeAmount ?? 0)
                      ).toFixed(9)
                    : 0}
                <div>
                    <span className="text-[#7A89A2]">balance </span>
                    {balance.loading ? <i className="pi pi-spin pi-spinner text-[1rem]"></i> : <>{balance.value}</>}
                </div>
            </div>
        </>
    );

    const renderSwappedToken = () => (
        <>
            <div className="h-48px flex w-full items-center justify-between">
                <input
                    className="w-[17.5rem] bg-transparent text-[2rem] text-[#EAECEF] caret-[#EAECEF] outline-none"
                    type="text"
                    disabled={!currentToken?.balance || isBuy}
                    onChange={(e) => inputChange(e, 2)}
                    value={currentInputValue.value2}
                    placeholder="0"
                />
                <div
                    className="flex cursor-pointer items-center rounded-[10px] text-[18px] text-[#848E9C]"
                    onClick={() => {
                        fetchSwapTokenListFn();
                        swapModalController.setTrue();
                    }}
                >
                    {!currentToken?.tokenName ? (
                        <Skeleton shape="circle" size="1.75rem"></Skeleton>
                    ) : (
                        <>
                            <Image
                                src={currentToken?.tokenLogo ?? DEFAULT_IMG}
                                className="h-[1.75rem] w-[1.75rem] rounded-full"
                                alt=""
                                width={28}
                                height={28}
                            />
                            <div className="mx-[6px] text-[18px] text-[#EAECEF]">{currentToken?.tokenTicker}</div>
                            <i className="pi pi-angle-down text-[1rem] text-[#fff]"></i>
                        </>
                    )}
                </div>
            </div>
            <div className="mt-1 flex h-[12px] w-full items-center justify-between text-[12px]">
                {swapTokenList?.total !== 0 && (
                    <>
                        {/* <FormattedNumber
                            value={+(latestMessage?.data?.tokenPrice ?? 0) * +(latestMessage?.data?.tokenAmount ?? 0)}
                            prefix="$"
                        /> */}
                        $
                        {+(latestMessage?.data?.tokenPrice ?? 0) * +(latestMessage?.data?.tokenAmount ?? 0) > 0
                            ? (
                                  +(latestMessage?.data?.tokenPrice ?? 0) * +(latestMessage?.data?.tokenAmount ?? 0)
                              ).toFixed(9)
                            : 0}
                        <div>
                            <span className="text-[#7A89A2]">balance </span>
                            {customizebalance.loading ? (
                                <i className="pi pi-spin pi-spinner text-[1rem]"></i>
                            ) : (
                                <>{customizebalance.value}</>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );

    const renderRatio = (type: 1 | 2) => (
        <>
            {BALANCE_RATIO_CONFIG?.map(({ name, value, id }) => (
                <div
                    className={safeMergeClassName(
                        'ml-[6px] cursor-pointer rounded-[3px] border-[1px] border-solid border-[#34363D] px-[1rem] py-[.5rem] font-helvetica text-[14px] leading-[16px] text-[#7A89A2] hover:text-yellow',
                        splitId === id ? 'bg-[#34363D] text-yellow' : '',
                    )}
                    key={name}
                    onClick={() => {
                        handleSlip(value, type);
                        setSplitId(id);
                    }}
                >
                    {name}
                </div>
            ))}
        </>
    );

    const dialogHeader = () => {
        return (
            <div className="flex items-center justify-between text-[1.25rem] leading-[1.5rem] text-[#fff]">
                <div>{isSwapModalOpen ? 'Select a token' : 'Set max. slippage'}</div>
                <i
                    onClick={() =>
                        isSwapModalOpen ? swapModalController.setFalse() : settingModalController.setFalse()
                    }
                    className="pi pi-times cursor-pointer text-[1.5rem]"
                ></i>
            </div>
        );
    };
    const getButtonText = () => {
        if (loadingStatForButton) return ' ';
        if (!addressTokenDisplayName) return 'Connect Wallet';
        if (isInputValueEmpty) return 'Enter amount';
        if (!currentToken?.tokenName) return 'Preparing Swap';
        return 'Swap';
    };

    if (!isClient) return null;

    return (
        <>
            <div className="mx-[1rem] mt-[2rem] max-w-[608px] rounded-[1rem] border-[1px] border-solid border-[#34363D] p-[2rem] sm:mx-auto">
                <div className="mb-[12px] w-full">
                    <div className="flex items-center justify-between">
                        <div className="font-helvetica text-[24px]">Swap</div>
                        <div
                            className="flex cursor-pointer items-center font-helvetica text-[12px] text-[#EAECEF]"
                            onClick={settingModalController.setTrue}
                        >
                            <div className="text-[18px] text-[#fff]">
                                <span className="text-[#7A89A2]">Slippage</span> {currentSlippage}%
                            </div>
                            <Image
                                src={Setting}
                                alt=""
                                className="ml-[16px] h-[24px] w-[24px]"
                                width={36}
                                height={35}
                            />
                        </div>
                    </div>
                    <div className="mt-[1.625rem] flex items-center justify-between">
                        <div className="font-helvetica text-[1rem] text-[#848E9C]"> You&apos;re paying</div>
                        <div className="flex">{renderRatio(currentOperation === 'buy' ? 1 : 2)}</div>
                    </div>
                </div>
                <div
                    className={safeMergeClassName(
                        'rounded-[.5rem] border-[1px] border-solid border-[#34363D] px-[1.5rem] py-[1rem]',
                        {
                            'border-[#FFD41A]': isActive,
                        },
                    )}
                    ref={containerRef}
                    onClick={() => {
                        activeStateController2.setFalse();
                        activeStateController.setTrue();
                    }}
                >
                    {currentOperation === 'buy' ? renderOrigin() : renderSwappedToken()}
                </div>
                <div className="relative flex h-[2.625rem] items-center">
                    <div className="font-helvetica text-[1rem] text-[#7A89A2]">to receive</div>
                    <div
                        onClick={handleCheck}
                        className="absolute bottom-0 left-0 right-0 top-0 m-auto flex h-[4.5rem] w-[4.5rem] cursor-pointer items-center justify-center rounded-full border-[1px] border-solid border-[#34363D] bg-[#141519] hover:border-[#FFD41A]"
                    >
                        <div className="pi pi-sort-alt text-[2.25rem] hover:text-[#FFD41A]"></div>
                    </div>
                </div>
                <div
                    className={safeMergeClassName(
                        'rounded-[.5rem] border-[1px] border-solid border-[#34363D] px-[1.5rem] py-[1rem]',
                        {
                            'border-[#FFD41A]': isActive2,
                        },
                    )}
                    ref={containerRef2}
                    onClick={() => {
                        activeStateController.setFalse();
                        activeStateController2.setTrue();
                    }}
                >
                    {currentOperation === 'buy' ? renderSwappedToken() : renderOrigin()}
                </div>
                <Button
                    pt={{
                        root: () => ({
                            className: safeMergeClassName(
                                'bg-[#FFD41A] border-0 flex justify-center items-center text-[1.25rem] font-bold font-helvetica text-[#333]',
                                {
                                    'bg-[#34363D] text-[#707070]': !!addressTokenDisplayName && isInputValueEmpty,
                                },
                            ),
                        }),
                    }}
                    className="mt-[2rem] h-[4rem] w-full"
                    onClick={() => handleSwap(currentOperation)}
                    loading={loadingStatForButton}
                    disabled={!!addressTokenDisplayName && isInputValueEmpty}
                >
                    {getButtonText()}
                </Button>
                {!isInputValueEmpty && (
                    <>
                        <div className="mt-[12px] flex items-center justify-between text-[14px] text-[#7A89A2]">
                            <div
                                className="flex cursor-pointer items-center justify-between hover:text-[#FFD41A]"
                                onClick={toggleNativeToToken}
                            >
                                {exchangeRateText}
                                <i className="pi pi-arrow-right-arrow-left ml-[.75rem]"></i>
                            </div>
                            <div
                                className="flex cursor-pointer items-center text-[#7A89A2] hover:text-[#FFD41A]"
                                onClick={() => setMorePriceInfo.toggle()}
                            >
                                <span className="">{!morePriceInfo ? 'Show more price info' : ''}</span>
                                <i className="pi pi-angle-down text-[1rem] text-[#fff]"></i>
                            </div>
                        </div>
                        <div
                            className={safeMergeClassName(
                                'text-[14px] text-[#7A89A2]',
                                !morePriceInfo ? 'hidden' : 'block',
                            )}
                        >
                            {Array.from(moreInfo).map(([k, v], index) => (
                                <div className="mt-[12px] flex justify-between" key={index}>
                                    <div>{k}</div>
                                    <div>{v}</div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
            <Dialog
                position="top"
                dismissableMask={true}
                draggable={false}
                pt={{
                    root: () => ({
                        className: safeMergeClassName('w-[38rem] bg-[#181A20] rounded-[1rem]', {
                            'top-[9.375rem]': isSettingModalOpen,
                        }),
                    }),
                    header: () => ({
                        className: 'bg-transparent border-b-[1px] border-solid border-[#000]',
                    }),
                    content: () => ({
                        className: 'bg-transparent p-0',
                    }),
                }}
                header={dialogHeader}
                closable={false}
                visible={isSwapModalOpen || isSettingModalOpen}
                onHide={() => (isSwapModalOpen ? swapModalController.setFalse() : settingModalController.setFalse())}
            >
                {isSwapModalOpen ? (
                    <BindModal
                        tokenTrending={tokenTrending}
                        data={swapTokenList?.items ?? []}
                        loading={swapTokenListLoading}
                        onChange={async (e: any) => {
                            await handleChange(e);
                        }}
                        keyword={keyword}
                        setKeyword={setKeyword}
                    />
                ) : (
                    <SettingModal close={settingModalController.setFalse} />
                )}
            </Dialog>
            {latestMessage?.data && isOpen && (
                <SwapWarnModal
                    amount={isBuy ? +latestMessage?.data?.nativeReserve / 2 : +latestMessage?.data?.tokenReserve / 2}
                    currencyName={isBuy ? CHAIN_ICON_MAP[currentChain].nativeCoin : currentToken?.tokenTicker}
                />
            )}
        </>
    );
};
export default SwapView;
