'use client';
import { useAsyncEffect, useMemoizedFn, useSafeState, useSetState } from 'ahooks';
import React, { useCallback, useEffect, useMemo } from 'react';
import { CHAIN_ICON_MAP, CHAIN_LIST } from '@/constants/index';
import useStore from '@/store/zustand';
import Image from 'next/image';
import { Tag } from 'primereact/tag';
import SlippageSelector from './SlippageSelector';
import { useParams } from 'next/navigation';
import { useTokenInfo } from '@/services/hooks/useGetTokenInfo';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useAnchorProvider } from '@/context/anchorProviderContext';
import { AnchorProvider, BN, setProvider } from '@coral-xyz/anchor';
import {
    AIRDROP_TOKEN,
    FAIR_MEME_STATE_SEED,
    GLOBAL_SEED,
    PUBLICKEY_FOR_SOLANA_PROGRAM_ID,
    UNIT_PER_TOKEN,
} from '@/constants/solana';
import { ComputeBudgetProgram, LAMPORTS_PER_SOL, PublicKey, SystemProgram } from '@solana/web3.js';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { getFairMemeSolanaProgram } from '@/utils/solana';
import {
    fetchTokenBalance,
    getOrCreateATAInstruction,
    handleInputChange,
    openExplorer,
    unitFormatter,
} from '@/utils/common';
import useWsHub, { ActionType } from '@/hooks/useWsHub';
import { useAccount, useBalance, useChainId, useConnect } from 'wagmi';
import { ChainsType } from '@/types/common';
import { useSolanaTransaction } from '@/hooks/useSolanaTransaction';
import { injected } from 'wagmi/connectors';
import { ToastMessage } from 'primereact/toast';
import useWalletAddress from '@/hooks/useWalletAddress';
import { GetTokenDetailInfo } from '@/types/meme';
// @ts-ignore
import { nanoid } from 'nanoid';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import useSwapWarnModalStore from '@/store/modalStore/swapWarnModalStore';
import SwapWarnModal from '@/components/Modal/SwapWarnModal';
import { Button } from 'primereact/button';
import CustomConnectButton from '@/components/connectbutton/CustomConnectButton';
import useGetIsConnected from '@/hooks/useGetIsConnected';
import { useToast } from '@/context/ToastContext';
import { useMemeInfoStore } from '@/store/memeInfoStore';
const feeCorrection = (amount: number) => amount * 0.98;
const Trade = () => {
    const { showToast } = useToast();
    const { openModal } = useSwapWarnModalStore();
    const { token: currentAddress }: { token: string } = useParams();
    const { isConnected: isConnectedEvmAndSol } = useGetIsConnected();
    const [swapLoading, setSwapLoading] = useSafeState<boolean>(false);
    const { addressTokenStr } = useWalletAddress();
    const { data: tokenInfo } = useTokenInfo(currentAddress);
    const { memeItem } = useMemeInfoStore();
    // ws
    const { sendMessage, connectionStatus } = useWsHub<ActionType.swap>({
        onOpen: () => {
            console.log('WebSocket connected MemeInfo Swap');
        },
        onClose: () => {
            console.log('WebSocket disconnected MemeInfo Swap');
        },
        onMessage: (message: any) => {
            if (message.data.requestID !== currentRequestId) return;
            handleSwapDetailsSuccess(isBuy, message);
        },
        onError: (event) => {
            console.error('WebSocket error:', event);
        },
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
    const [currentRequestId, setCurrentRequestId] = useSafeState<string>();
    const { setVisible: setSolanaWalletModalVisible } = useWalletModal();
    const [currentOperation, setCurrentOperation] = useSafeState<'buy' | 'sell'>('buy');
    const [pairReserve, setPairReserve] = useSafeState<{ nativeReserve: string; tokenReserve: string }>({
        nativeReserve: '0',
        tokenReserve: '0',
    });
    const [currentInputValue, setCurrentInputValue] = useSetState<{ value1: string; value2: string }>({
        value1: '',
        value2: '',
    });
    const [inputSlippageValue, setSlippageInputValue] = useSafeState<number>(5);
    const currentChain = useStore((state) => state.currentChain);
    // evm
    const isEvmChain = useMemo(() => currentChain === 'base' || currentChain === 'eth', [currentChain]);
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const balanceForEvm = useBalance({ address, chainId });
    const { connect } = useConnect();
    // solana
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
    const { execute } = useSolanaTransaction(showToastFn, toastConfig);
    const { publicKey, connected: isSolanaConnected } = useWallet();
    // const [currentToken, setCurrentToken] = useSafeState<FairMemeHome.Item | undefined>();
    const AnchorWallet = useAnchorWallet();
    const anchorProvider = useAnchorProvider();
    const { connection } = useConnection();
    // balance

    const [balance, setBalance] = useSafeState<{ value: number; loading: boolean }>({
        value: 0,
        loading: false,
    });
    const [customizebalance, setCustomizeBalance] = useSetState<{ value: number; loading: boolean }>({
        value: 0,
        loading: false,
    });

    // program
    const isBuy = useMemo(() => currentOperation === 'buy', [currentOperation]);
    const performSolanaSwap = async (operation: 'buy' | 'sell') => {
        if (!publicKey || !AnchorWallet || !currentAddress) {
            throw new Error('Missing required data for swap');
        }
        const provider = new AnchorProvider(connection, AnchorWallet, {});
        setProvider(provider);
        const programId = new PublicKey(PUBLICKEY_FOR_SOLANA_PROGRAM_ID);
        const mintPublickey = new PublicKey(currentAddress);
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
            // const estimatedFee = await estimateTransactionFee(connection, publicKey);
            const balance_ = await connection.getBalance(publicKey);
            let solAmount: BN;
            let tokenAmount: BN;
            let minTokenOutput: BN;
            let minSolOutput: BN;
            let swapTransaction;
            let fromAmount = operation === 'buy' ? currentInputValue.value1 : currentInputValue.value2;
            let toAmount = operation === 'buy' ? currentInputValue.value2 : currentInputValue.value1;
            if (operation === 'buy') {
                fromAmount = `${fromAmount}${isEvmChain ? 'ETH' : 'SOL'}`;
                toAmount = `${toAmount} ${memeItem?.tokenTicker}`;
            } else {
                fromAmount = `${fromAmount}${memeItem?.tokenTicker}`;
                toAmount = `${toAmount} ${isEvmChain ? 'ETH' : 'SOL'}`;
            }
            // console.log('===============fromAmount===============', fromAmount);
            // console.log('===============toAmount===============', toAmount);
            // console.log('===============solAmount===============', solAmount);
            // console.log('===============+currentInputValue.value1===============', +currentInputValue.value1);
            const slippageFactor = 1 - inputSlippageValue / 100;
            // console.log(
            //     '===========minTokenOutput===================',
            //     Math.floor(+currentInputValue.value2 * UNIT_PER_TOKEN * slippageFactor),
            // );
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
                // minTokenOutput = new BN(Math.floor(1));
                // swapTransaction = program.methods.buy(solAmount, minTokenOutput);
            } else {
                const tokenBalance = await connection.getTokenAccountBalance(userTokenAccount);
                const maxTokenAmountUserCanPay = new BN(tokenBalance.value.amount);
                tokenAmount = BN.min(new BN(+currentInputValue.value2 * UNIT_PER_TOKEN), maxTokenAmountUserCanPay);
                minSolOutput = new BN(Math.floor(+currentInputValue.value1 * LAMPORTS_PER_SOL * slippageFactor));
                swapTransaction = program.methods.sell(tokenAmount, minSolOutput);
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
            } catch (error) {
                console.error('error', error);
            }
        }
    };
    // connect modal
    const handleOpenWalletModal = useMemoizedFn(() => {
        if (currentChain === 'sol' && !isSolanaConnected) {
            setSolanaWalletModalVisible(true);
        } else if (currentChain !== 'sol' && !isConnected) {
            connect({ connector: injected(), chainId: CHAIN_LIST!.find((i) => i.key === currentChain)!.chainId });
        }
    });
    // swap function
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
                setSwapLoading(true);
                await performSolanaSwap(operation);
                getUserTokenBalance(tokenInfo?.token);
                getUserBalance();
            } finally {
                setSwapLoading(false);
                resetAllOperation();
            }
        }
    };
    // Callbacks and event handlers
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
            setBalance({
                value: unitFormatter('sol', balanceForEvm.data?.formatted ?? '0', 'number'),
                loading: false,
            });
        }
    };

    const getUserTokenBalance = useCallback(
        async (token?: GetTokenDetailInfo.Response['token']) => {
            if (!token) {
                setCustomizeBalance({ loading: false, value: 0 });
                return;
            }

            if (publicKey && anchorProvider && currentChain === 'sol') {
                try {
                    setCustomizeBalance({ loading: true });
                    // @ts-ignore
                    const tokenBalance = await fetchTokenBalance(publicKey, anchorProvider, token);
                    setCustomizeBalance({ value: unitFormatter('token', tokenBalance, 'number'), loading: false });
                } catch (error) {
                    setCustomizeBalance({ loading: false, value: 0 });
                }
            }
        },
        [publicKey, tokenInfo?.token, currentChain, anchorProvider],
    );
    const resetAllOperation = useMemoizedFn(() => {
        setCurrentInputValue({ value1: '', value2: '' });
    });
    // Callbacks and event handlers
    const inputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 1 | 2) => {
        handleInputChange(
            e.target.value,
            setCurrentInputValue,
            type,
            type === 1 ? balance.value : customizebalance.value,
            !!addressTokenStr,
        );
    };
    // Effects
    useAsyncEffect(async () => {
        if (isSolanaConnected && publicKey) {
            resetAllOperation();
            getUserTokenBalance(tokenInfo?.token);
            getUserBalance();
        }
    }, [currentChain, publicKey, address, isConnected, tokenInfo]);

    useEffect(() => {
        if (currentAddress && currentChain && connectionStatus === 'connected') {
            if (isBuy) {
                establishSwapInfoChannel({
                    tokenAddress: currentAddress,
                    chainName: currentChain,
                    isBuy,
                    amount: feeCorrection(+(currentInputValue?.value1 ?? 0)),
                });
            }
            if (!isBuy) {
                establishSwapInfoChannel({
                    tokenAddress: currentAddress,
                    chainName: currentChain,
                    isBuy,
                    amount: +(currentInputValue?.value2 ?? 0),
                });
            }
        }
    }, [
        currentAddress,
        currentChain,
        isBuy,
        connectionStatus,
        isBuy ? currentInputValue.value1 : currentInputValue.value2,
    ]);
    const disable = isBuy ? +currentInputValue.value1 > 0 : +currentInputValue.value2 > 0;

    return (
        <div className="rounded-md bg-[#171821] p-4">
            <div className="h-[4.25rem] rounded-md border border-[#34363D] bg-[#1E2028] px-2 py-1.5 md:h-12">
                <div className="relative h-full w-full items-center overflow-hidden rounded-md text-base text-white">
                    <div
                        className={`z-10 h-full w-1/2 ${isBuy ? '' : 'translate-x-full'} ${isBuy ? 'bg-[#1BAB75]' : 'bg-[#FF3B54]'} rounded-md transition-all duration-700`}
                    ></div>
                    <div className="absolute bottom-0 left-0 right-0 top-0 flex h-full w-full bg-transparent">
                        <div
                            className={`z-20 flex h-full flex-1 items-center justify-center bg-transparent ${isBuy ? 'font-bold' : 'text-[#7A89A2]'} transition-all duration-700`}
                            onClick={() => {
                                setCurrentOperation((prev) => 'buy');
                                resetAllOperation();
                            }}
                        >
                            Buy
                        </div>
                        <div
                            className={`z-20 flex h-full flex-1 items-center justify-center bg-transparent ${!isBuy ? 'font-bold' : 'text-[#7A89A2]'} transition-all duration-700`}
                            onClick={() => {
                                setCurrentOperation((prev) => 'sell');
                                resetAllOperation();
                            }}
                        >
                            Sell
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4 h-[4.25rem] w-full justify-between overflow-hidden rounded-md border border-[#34363D] bg-[#181A20] text-lg flex-items-center md:h-12">
                <span className="h-full bg-[#1E2028] p-3 text-[#7A89A2] flex-items-center">Amount</span>

                {currentOperation === 'buy' ? (
                    <input
                        type="text"
                        value={currentInputValue.value1}
                        onChange={(e) => inputChange(e, 1)}
                        placeholder="Enter a number"
                        className="h-full min-w-0 flex-1 border-none bg-transparent px-3 !text-sm text-white focus:border-none focus:shadow-none focus:outline-none"
                    />
                ) : (
                    <input
                        type="text"
                        value={currentInputValue.value2}
                        onChange={(e) => inputChange(e, 2)}
                        placeholder="Enter a number"
                        className="h-full min-w-0 flex-1 border-none bg-transparent px-3 !text-sm text-white focus:border-none focus:shadow-none focus:outline-none"
                    />
                )}
                {currentOperation === 'buy' && (
                    <div className="gap-2 p-3 text-white flex-items-center">
                        <Image src={CHAIN_ICON_MAP[currentChain].icon} width={24} height={24} alt="currentChainIcon" />
                        <span>{CHAIN_ICON_MAP[currentChain].nativeCoin}</span>
                    </div>
                )}
                {currentOperation === 'sell' && (
                    <div className="gap-2 p-3 text-white flex-items-center">
                        {tokenInfo?.token?.tokenLogo && (
                            <Image src={tokenInfo?.token?.tokenLogo} width={24} height={24} alt="tokenLogo" />
                        )}
                        <span>{tokenInfo?.token?.tokenTicker}</span>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between md:text-xs">
                <div className="flex h-full flex-wrap pb-2 pt-3 text-[#7A89A2] flex-items-center">
                    <p>You will receive</p>&nbsp;&nbsp;&nbsp;
                    <p className="text-white">
                        {currentOperation === 'buy' ? currentInputValue.value2 : currentInputValue.value1}
                        &nbsp;&nbsp;&nbsp;
                        {currentOperation === 'buy'
                            ? tokenInfo?.token?.tokenTicker
                            : CHAIN_ICON_MAP[currentChain].title}
                    </p>
                </div>
                <SlippageSelector
                    inputSlippageValue={inputSlippageValue}
                    setSlippageInputValue={setSlippageInputValue}
                />
            </div>

            <div className="flex gap-2">
                {currentOperation === 'buy'
                    ? ['Reset', '0.1', '0.5', '1'].map((item) => {
                          return (
                              <Tag
                                  key={item}
                                  className="border border-[#34363D] bg-[#1E2028] px-6 py-2 text-[#7A89A2] hover:bg-[#34363D] hover:text-white md:px-3"
                                  onClick={() => {
                                      if (item === 'Reset') {
                                          setCurrentInputValue({ value1: '' });
                                          return;
                                      }
                                      handleInputChange(
                                          item,
                                          setCurrentInputValue,
                                          1,
                                          balance.value,
                                          !!addressTokenStr,
                                      );
                                  }}
                              >
                                  {item}&nbsp;
                                  {item !== 'Reset' && CHAIN_ICON_MAP[currentChain].nativeCoin}
                              </Tag>
                          );
                      })
                    : ['Reset', '25', '50', '75', '100'].map((item) => {
                          return (
                              <Tag
                                  key={item}
                                  className="border border-[#34363D] bg-[#1E2028] px-6 py-2 text-[#7A89A2] hover:bg-[#34363D] hover:text-white md:px-3"
                                  onClick={() => {
                                      if (!addressTokenStr) return;
                                      if (item === 'Reset') {
                                          setCurrentInputValue({ value2: '' });
                                          return;
                                      }
                                      handleInputChange(
                                          ((customizebalance.value * Number(item)) / 100).toFixed(6),
                                          setCurrentInputValue,
                                          2,
                                          customizebalance.value,
                                          !!addressTokenStr,
                                      );
                                  }}
                              >
                                  {item === 'Reset' ? item : item + '%'}
                              </Tag>
                          );
                      })}
            </div>
            <div>
                {addressTokenStr ? (
                    <p className="mt-2 text-xs text-[#7A89A2]">
                        You balance： {currentOperation === 'buy' ? balance.value + '' : customizebalance.value + ''}
                        &nbsp;&nbsp;
                        {currentOperation === 'buy'
                            ? CHAIN_ICON_MAP[currentChain].title
                            : tokenInfo?.token?.tokenTicker}
                    </p>
                ) : null}
            </div>

            {isConnectedEvmAndSol ? (
                <Button
                    disabled={!disable}
                    onClick={() => {
                        handleSwap(currentOperation);
                    }}
                    loading={swapLoading}
                    className={`mt-4 flex w-full items-center justify-center rounded-md border-none py-5 text-white md:py-3 ${currentOperation === 'buy' ? 'bg-[#1BAB75]' : 'bg-[#FF3B54]'} transition-all duration-700`}
                >
                    {!disable ? (
                        <span className="text-sm font-bold">Enter Amount</span>
                    ) : (
                        <span className="text-sm font-bold">{swapLoading ? '' : 'Trade'}</span>
                    )}
                </Button>
            ) : (
                <CustomConnectButton className="mt-4 flex w-full items-center justify-center rounded-md border-none bg-yellow py-5 text-black md:py-3" />
            )}
            <SwapWarnModal
                amount={currentOperation === 'buy' ? +pairReserve.nativeReserve / 2 : +pairReserve.tokenReserve / 2}
                currencyName={
                    currentOperation === 'buy' ? CHAIN_ICON_MAP[currentChain].nativeCoin : tokenInfo?.token?.tokenTicker
                }
            />
        </div>
    );
};

export default Trade;
