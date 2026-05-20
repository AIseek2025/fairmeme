/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-shadow */
'use client';

import React, { ReactNode, useLayoutEffect, useRef } from 'react';
import { SelectButton } from 'primereact/selectbutton';
import { SelectItemOptionsType } from 'primereact/selectitem';
import { safeMergeClassName } from '@/utils/common';
import { Images } from '@/utils/imagesMap';
import { injected } from 'wagmi/connectors';
import { FileUpload, FileUploadUploadEvent } from 'primereact/fileupload';
import { Image as PrImage } from 'primereact/image';
import { useBoolean, useCreation, useMemoizedFn, useRequest, useSafeState, useSetState } from 'ahooks';
import { ChainsType } from '@/types/common';
import { ComputeBudgetProgram, PublicKey, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import ExtendedImage from './ExtendedImage';
import LengthCounter from './LengthCounter';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { CHAIN_ICON_MAP, CHAIN_LIST, ESTIMATE_BLOCK_TIME } from '@/constants';
import { InputSwitch } from 'primereact/inputswitch';
import { classNames } from 'primereact/utils';
import { tokenCreate } from '@/services/api/createMeme';
import { useAccount, useConnect, useSwitchChain, useWriteContract } from 'wagmi';
import useStore from '@/store/zustand';
import useWalletAddress from '@/hooks/useWalletAddress';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { isObject } from 'lodash-es';
import { useRouter } from 'next/navigation';
import { CreateMemeFormType } from '@/types/createMeme';
import { parseEther } from 'viem';
import fairMemeFactoryAbi from '@/abi/fairMemeFactoryAbi';
import { useAnchorProvider } from '@/context/anchorProviderContext';
import { getCommonAccountParams, getFairMemeSolanaProgram } from '@/utils/solana';
import { BN } from '@coral-xyz/anchor';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import Image from 'next/image';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useToast } from '@/context/ToastContext';
import { Metadata, useIpfsUpload } from '@/hooks/useIpfsUpload';

const justifyTemplate = (option: any) => {
    const { icon, label } = option;
    return (
        <div className="flex">
            {icon && <PrImage src={icon} alt={label} width="24" height="24" className="mr-3"></PrImage>}
            <span className="text-[0.875rem] sm:text-[20px]">{label}</span>
        </div>
    );
};

function constrainDayNumber(day: number): number {
    day = Math.floor(Number(day));
    if (day < 1) return 0;
    if (day > 365) return 365;
    return day;
}

const options: SelectItemOptionsType = [
    {
        label: 'SOL',
        value: 'sol',
        key: 'sol',
        className: 'text-[#fff]',
        icon: Images.COMMON.SOLANA_SVG,
    },
    {
        label: 'ETH',
        key: 'eth',
        value: 'eth',
        className: 'text-[#fff]',
        icon: Images.COMMON.ETH_SVG,
        disabled: true,
    },
    {
        label: 'Base',
        key: 'base',
        value: 'base',
        className: 'text-[#fff]',
        icon: Images.COMMON.BASE_SVG,
        disabled: true,
    },
    {
        label: 'BNB',
        key: 'bnb',
        value: 'bnb',
        className: 'text-[#fff]',
        icon: Images.COMMON.BNB_SVG,
        disabled: true,
    },
];

const initialFormValues = {
    creatorAddress: null,
    tokenLogo: '',
    auctionCycle: '',
    tokenName: '',
    chainID: options[0].value,
    tokenTicker: '',
    tokenDescribe: '',
    webSite: '',
    twitterUrl: '',
    telegramUrl: '',
    farcaster: '',
    more: false,
};

const emptyTemplate = <div className="rounded-[3px] border-[#34363D] bg-[#1E2028] sm:h-[171px] sm:w-[171px]"></div>;
const chooseOptions = {
    icon: (
        <div>
            <PrImage
                src={Images.COMMON.DEFAULT_IMG_SVG}
                width="64"
                height="64"
                alt="img"
                className="absolute left-[50%] top-8 -ml-[32px]"
            />
            <p className="absolute bottom-[17px] left-[50%] -ml-[78.15px] text-sm text-[#464A5A]">
                JPEG/PNG/WEBP/GIF Less than 4MB
            </p>
        </div>
    ),
    iconOnly: true,
    className:
        'custom-choose-btn p-button-outlined rounded-[3px] border-[#34363D] bg-[#1E2028] h-[171px] w-[171px] relative',
};

const CreateForm = () => {
    // Toast
    const { showToast } = useToast();
    // *** State ***
    const [isLayoutFilled, { setTrue: setIsLayoutFilledTrue }] = useBoolean(false);

    const [formValues, setFormValues] = useSetState<{
        creatorAddress: PublicKey | null;
        tokenLogo: string;
        auctionCycle: string;
        tokenName: string;
        chainID: ChainsType;
        tokenTicker: string;
        tokenDescribe: string;
        webSite?: string;
        twitterUrl?: string;
        telegramUrl?: string;
        farcaster?: string;
        more?: boolean;
    }>(initialFormValues);
    const [auctionCycleForDay, setAuctionCycleForDay] = useSafeState('');
    const [tokenLogoIsLoading, { setFalse: setTokenLogoIsLoadingFalse, setTrue: setTokenLogoIsLoadingTrue }] =
        useBoolean(false);
    const [needMore, { toggle: moreOptionToggle }] = useBoolean(false);
    const fileUploadRef = useRef<FileUpload>(null);
    const currentChain = useStore((state) => state.currentChain);
    const [createLoading, { setFalse: setCreateLoadingFalse, setTrue: setCreateLoadingTrue }] = useBoolean(false);
    const { addressToken, publicKey, addressTokenStr } = useWalletAddress();
    const isEvmChain = useCreation(() => currentChain === 'base' || currentChain === 'eth', [currentChain]);
    const [confirmDialogVisible, { setFalse: setConfirmDialogVisibleFalse, setTrue: setConfirmDialogVisibleTrue }] =
        useBoolean(false);
    const [file, setFile] = useSafeState<any>();

    const validateCreateForm = (formValues: CreateMemeFormType): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];
        if (!formValues.tokenLogo) {
            errors.push('Token logo is required');
        }
        if (!formValues.tokenName || formValues.tokenName.trim().length === 0) {
            errors.push('Token name is required');
        } else if (formValues.tokenName.length > 15) {
            errors.push('Token name should not exceed 15 characters');
        }
        if (!formValues.tokenTicker || formValues.tokenTicker.trim().length === 0) {
            errors.push('Token ticker is required');
        } else if (formValues.tokenTicker.length > 10) {
            errors.push('Token ticker should not exceed 10 characters');
        }
        if (!formValues.tokenDescribe || formValues.tokenDescribe.trim().length === 0) {
            errors.push('Token description is required');
        } else if (formValues.tokenDescribe.length > 500) {
            errors.push('Token description should not exceed 500 characters');
        }
        if ((formValues.auctionCycle === '0' && !auctionCycleForDay) || !formValues.auctionCycle) {
            errors.push('Auction time is required');
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    };
    const { isValid } = validateCreateForm(formValues);

    // *** Api ***
    const { runAsync: createTokenAsync } = useRequest(tokenCreate, { manual: true });

    // *** Method ***
    const { uploadMetadataToIpfs, uploadFileToIpfs } = useIpfsUpload();
    const { switchChain } = useSwitchChain();
    const { connect } = useConnect();
    const { setVisible: setSolanaWalletModalVisible } = useWalletModal();
    const { isConnected } = useAccount();
    const { connection } = useConnection();
    const router = useRouter();
    const { writeContractAsync } = useWriteContract();
    const anchorProvider = useAnchorProvider();
    const { sendTransaction, connected: isSolanaConnected } = useWallet();
    // const onUpload = useMemoizedFn(async (event: FileUploadUploadEvent) => {
    //     setTokenLogoIsLoadingTrue();
    //     const file = event.files[0];
    //     const res = JSON.parse(event.xhr.response);
    //     if (file) {
    //         setFile(file);
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setFormValues({ tokenLogo: res?.data?.fileUrl || '' });
    //         };
    //         reader.readAsDataURL(file);
    //     }
    //     setTokenLogoIsLoadingFalse();
    // });

    const onUpload = useMemoizedFn(async (event: { files: File[] }) => {
        setTokenLogoIsLoadingTrue();
        const file = event.files[0];
        if (file) {
            try {
                const ipfsRes = await uploadFileToIpfs(file);
                const ipfsUrl = ipfsRes?.fileCid ?? '';
                setFile(file);
                setFormValues({ tokenLogo: ipfsUrl });
            } catch (error) {
                console.error('Error uploading to IPFS:', error);
                showToast({
                    severity: 'error',
                    summary: 'error',
                    detail: 'Upload picture failed, please try again.',
                    life: 3000,
                });
            }
        }
        setTokenLogoIsLoadingFalse();
    });

    const handleOpenWalletModal = useMemoizedFn(() => {
        if (currentChain === 'sol' && !isSolanaConnected) {
            setSolanaWalletModalVisible(true);
        } else if (currentChain !== 'sol' && !isConnected) {
            connect({ connector: injected(), chainId: CHAIN_LIST!.find((i) => i.key === currentChain)!.chainId });
        }
    });

    const onClear = () => {
        setFormValues({ tokenLogo: '' });
        if (fileUploadRef.current) {
            fileUploadRef.current.clear();
        }
    };
    const handleInputChange = useMemoizedFn((e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        if (!/^\d*$/.test(inputValue)) {
            return;
        }
        if (inputValue === '' || inputValue === '0') {
            setAuctionCycleForDay('');
            setFormValues({ auctionCycle: '0' });
            return;
        }
        const constrainedValue = constrainDayNumber(Number(inputValue));
        setAuctionCycleForDay(constrainedValue.toString());
        setFormValues({ auctionCycle: '0' });
    });
    const createMemeFromContract = useMemoizedFn(async (params: CreateMemeFormType): Promise<any> => {
        if (isEvmChain) {
            try {
                const address = '0x7b405fc41aa639beabc629a45d3a44fe1d931a0a';
                const tokenInitPrice = parseEther('0.3');
                const tokenDevPercent = 0.2 * 1000;
                // const valueToSend = parseEther(String(tokenDevPercent * 0.3));
                // sendTransaction({ to: contractAddress, value: parseEther('0.5') })
                if (addressToken) {
                    const res = await writeContractAsync({
                        address,
                        abi: fairMemeFactoryAbi,
                        functionName: 'createFairMemeMarket',
                        args: [
                            params.tokenName,
                            params.tokenTicker,
                            addressToken,
                            BigInt(tokenDevPercent),
                            tokenInitPrice,
                            BigInt(+params.auctionCycle * 86400),
                        ],
                    });
                    return res;
                }
                return false;
            } catch (error) {
                console.error(error);
            }
        } else if (publicKey && anchorProvider) {
            const {
                mint,
                globalPDA,
                fairMemeStatePDA,
                metadataAddress,
                fairMemeTokenAccount,
                mintAuthority,
                ASSOCIATED_TOKEN_PROGRAM_ID,
                TOKEN_PROGRAM_ID,
                TOKEN_METADATA_PROGRAM_ID,
                SYSVAR_RENT_PUBKEY,
                systemProgram,
                creatorTokenAccount,
            } = await getCommonAccountParams(publicKey);
            const auctionPeriod = new BN(params.auctionCycle);
            const program = getFairMemeSolanaProgram(anchorProvider);
            const metadata: Metadata = {
                name: params.tokenName,
                symbol: params.tokenTicker,
                description: params.tokenDescribe,
                twitter: params?.twitterUrl || '',
                telegram: params?.telegramUrl || '',
                website: params?.webSite || '',
            };

            const { jsonCid, errorMessage } = await uploadMetadataToIpfs(file, metadata);

            if (errorMessage) {
                showToast({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorMessage,
                    position: 'bottom-right',
                    life: 3000,
                });
                setConfirmDialogVisibleFalse();
                setCreateLoadingFalse();
                return;
            }
            const instruction = await program.methods
                .create(params.tokenName, params.tokenTicker, jsonCid ?? '', auctionPeriod)
                .accounts({
                    mint: mint.publicKey,
                    creator: publicKey,
                    mintAuthority,
                    // feeRecipient: globalParams.feeRecipient,
                    fairMemeState: fairMemeStatePDA,
                    global: globalPDA,
                    fairMemeTokenAccount,
                    creatorTokenAccount,
                    metadata: metadataAddress,
                    systemProgram,
                    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
                    rent: SYSVAR_RENT_PUBKEY,
                })
                .instruction();

            const messageV0 = new TransactionMessage({
                payerKey: publicKey,
                recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
                instructions: [instruction, instruction],
            }).compileToV0Message();
            const transaction = new VersionedTransaction(messageV0);
            const simulation = await connection.simulateTransaction(transaction);
            const unitsUsed = simulation.value.unitsConsumed;
            const unitsWithBuffer = Math.ceil(1000);
            const computeBudgetIx = ComputeBudgetProgram.setComputeUnitLimit({ units: unitsWithBuffer });

            const createTransaction = await program.methods
                .create(params.tokenName, params.tokenTicker, jsonCid ?? '', auctionPeriod)
                .accounts({
                    mint: mint.publicKey,
                    creator: publicKey,
                    mintAuthority,
                    // feeRecipient: globalParams.feeRecipient,
                    fairMemeState: fairMemeStatePDA,
                    global: fairMemeStatePDA,
                    fairMemeTokenAccount,
                    creatorTokenAccount,
                    metadata: metadataAddress,
                    systemProgram,
                    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
                    rent: SYSVAR_RENT_PUBKEY,
                })
                .preInstructions([computeBudgetIx])
                .transaction();
            try {
                const txHash = await sendTransaction(createTransaction, anchorProvider.connection, {
                    signers: [mint],
                    skipPreflight: true,
                });
                setCreateLoadingFalse();
                return { txHash, tokenAddress: mint.publicKey.toString(), marketAddress: fairMemeTokenAccount.toString() };
            } catch (error: any) {
                setCreateLoadingFalse();
                setConfirmDialogVisibleFalse();
                console.error(error);
                // messageApi.error(error?.message || 'unknown error');
                return false;
            }
        }

        return false;
    });
    const handleCreateMeme = useMemoizedFn(async () => {
        setCreateLoadingTrue();
        setConfirmDialogVisibleTrue();
        if (formValues.chainID && currentChain !== formValues.chainID) {
            switchChain({ chainId: CHAIN_ICON_MAP[formValues.chainID]?.chainId ?? 1 });
            return;
        }
        if (publicKey) {
            try {
                const balance = await connection.getBalance(publicKey);
                if (balance / 1e9 < 1) {
                    // console.log('Insufficient balance,at least 1 SOL for create.');
                    setCreateLoadingFalse();
                    showToast({
                        severity: 'warn',
                        position: 'bottom-right',
                        life: 3000,
                        summary: 'Warn',
                        detail: 'Insufficient balance, at least 1 SOL is required to create.',
                    });
                    // void messageApi.warning('Insufficient balance,at least 3 SOL for create.');
                    return;
                }
            } catch (error) {
                setCreateLoadingFalse();
                console.error('get balance error', error);
            }
        }
        const auctionDaysValue =
            +formValues.auctionCycle === 0 ? +auctionCycleForDay : +formValues.auctionCycle * 60 * 60;
        const blockCalculation = `${+auctionDaysValue / ESTIMATE_BLOCK_TIME[currentChain]}`;

        // Create a new object to pass to the createMemeFromContract function
        const modifiedValues = {
            ...formValues,
            creatorAddress: '0x00' as any,
            auctionCycle: `023x${blockCalculation}`,
        };
        const res = await createMemeFromContract(modifiedValues);
        if (isObject(res)) {
            const { tokenAddress } = res as any;
            setCreateLoadingFalse();
            setConfirmDialogVisibleTrue();
            await createTokenAsync({ ...modifiedValues, tokenAddress });
            setConfirmDialogVisibleFalse();

            router.push(`/meme/${tokenAddress}`);
        }
    });

    useLayoutEffect(() => {
        setIsLayoutFilledTrue();
    }, [isLayoutFilled]);
    // *** Component Render ***
    const renderFormItem = useMemoizedFn(
        ({
            title,
            content,
            isRequired,
            counter,
            width,
        }: {
            width: number;
            title: string;
            content: ReactNode;
            isRequired?: boolean;
            counter?: {
                currentLength: number;
                maxLength: number;
            };
        }) => (
            <div style={{ width }}>
                {counter ? (
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-xl text-[#fff]">
                            {title}
                            {isRequired && <span className="text-[#ff0000]"> *</span>}
                        </h3>
                        <LengthCounter currentLength={counter.currentLength} maxLength={counter.maxLength} />
                    </div>
                ) : (
                    <h3 className="mb-4 text-xl text-[#fff]">
                        {title}
                        {isRequired && <span className="text-[#ff0000]"> *</span>}
                    </h3>
                )}
                {content}
            </div>
        ),
    );
    const renderMoreOptions = useMemoizedFn(() => {
        return (
            <div className="mt-2">
                <div className="mt-6">
                    {renderFormItem({
                        width: 350,
                        title: 'Website',
                        content: (
                            <InputText
                                placeholder="https://www.fairmeme.com (Optional)"
                                value={formValues.webSite}
                                className="h-[54px] w-[544px] border-[#1E2028] bg-[#1E2028] pl-2 focus:border-[#1E2028] focus:outline-none focus:ring-1 focus:ring-[#FFD41A]"
                                onChange={(e) => {
                                    setFormValues({ webSite: e.target.value });
                                }}
                            />
                        ),
                    })}
                </div>
                <div className="mt-6">
                    {renderFormItem({
                        width: 350,
                        title: 'X(Twitter)',
                        content: (
                            <InputText
                                placeholder="https://twitter.com/FairMeme (Optional)"
                                value={formValues.twitterUrl}
                                className="h-[54px] w-[544px] border-[#1E2028] bg-[#1E2028] pl-2 focus:border-[#1E2028] focus:outline-none focus:ring-1 focus:ring-[#FFD41A]"
                                onChange={(e) => {
                                    setFormValues({ twitterUrl: e.target.value });
                                }}
                            />
                        ),
                    })}
                </div>
                <div className="mt-6">
                    {renderFormItem({
                        width: 350,
                        title: 'Telegram',
                        content: (
                            <InputText
                                placeholder="https://t.me/FairMeme (Optional)"
                                value={formValues.telegramUrl}
                                className="h-[54px] w-[544px] border-[#1E2028] bg-[#1E2028] pl-2 focus:border-[#1E2028] focus:outline-none focus:ring-1 focus:ring-[#FFD41A]"
                                onChange={(e) => {
                                    setFormValues({ telegramUrl: e.target.value });
                                }}
                            />
                        ),
                    })}
                </div>
                {/* Farcaster */}
                {formValues.chainID === 'base' && (
                    <div className="mt-6">
                        {renderFormItem({
                            width: 350,
                            title: 'Farcaster',
                            content: (
                                <InputText
                                    value={formValues.farcaster}
                                    className="h-[54px] w-[544px] border-[#1E2028] bg-[#1E2028] focus:border-[#1E2028] focus:outline-none focus:ring-1 focus:ring-[#FFD41A]"
                                    onChange={(e) => {
                                        setFormValues({ farcaster: e.target.value });
                                    }}
                                />
                            ),
                        })}
                    </div>
                )}
            </div>
        );
    });

    const renderConfirmDialog = useMemoizedFn(() => {
        return (
            <Dialog
                header="Create Token"
                visible={confirmDialogVisible}
                className="w-[564px]"
                headerStyle={{ backgroundColor: '#171821', color: '#fff' }}
                contentStyle={{ backgroundColor: '#171821', color: '#fff' }}
                onHide={() => {
                    if (!confirmDialogVisible) return;
                    setConfirmDialogVisibleFalse();
                }}
            >
                <div className="">
                    The creation is almost done!
                    <p className="text-sm text-[#7A89A2] sm:mt-4">
                        As the creator, you have the priority and supposed to spend 1 SOL to purchase 500,000 $meme
                        token, which accounts for 0.05% of the total. The fund(1 SOL) will be used to automatically add
                        initial liquidity on FairMemeSwap.
                    </p>
                    <div className="mx-auto mt-4 flex h-[53px] w-[516px] items-center justify-center rounded-[3px] border-[1px] border-[#34363D] text-lg font-bold">
                        <Image src={Images.COMMON.SOLANA_SVG} width={24} height={24} alt="sol" className="mr-4" />1 SOL
                    </div>
                    <Button
                        loading={createLoading}
                        className="mt-8 flex h-[64px] w-[516px] cursor-pointer items-center justify-center rounded-sm border-none bg-[#FFD41A] text-xl font-bold text-[#333] hover:text-[#464A5A]"
                        onClick={handleCreateMeme}
                    >
                        {createLoading ? '' : 'Pay to Create Now'}
                    </Button>
                </div>
            </Dialog>
        );
    });

    // UI
    return (
        <div className="w-[544px]">
            <div>
                {/* chainID */}
                <SelectButton
                    allowEmpty={false}
                    value={formValues.chainID}
                    onChange={(e) => setFormValues({ chainID: e.value })}
                    options={options}
                    optionLabel="label"
                    optionValue="value"
                    itemTemplate={justifyTemplate}
                    pt={{
                        root: {
                            className:
                                'inline-flex bg-[#1E2028] border-[1px] inline-block border-solid border-[#34363D] rounded-[3px] p-[4px]',
                        },
                        button: ({ context }: any) => ({
                            className: safeMergeClassName(
                                'border-0 focus:shadow-none h-[56px] bg-transparent text-[#fff] text-[20px] rounded-[3px] px-[12px] w-[134px] font-bold flex justify-center',
                                {
                                    'bg-[#FFD41A] text-black-333': context.selected,
                                },
                            ),
                        }),
                    }}
                />
            </div>
            <div className="mt-6 flex justify-between">
                {/* Image */}
                <div>
                    {renderFormItem({
                        title: 'Image',
                        width: 171,
                        isRequired: true,
                        content: (
                            <>
                                {isLayoutFilled ? (
                                    <>
                                        {!formValues.tokenLogo ? (
                                            <FileUpload
                                                disabled={tokenLogoIsLoading}
                                                ref={fileUploadRef}
                                                mode="basic"
                                                name="file"
                                                // url="/api/v1/uploadFile/logo"
                                                accept="image/*"
                                                maxFileSize={4000000}
                                                customUpload
                                                uploadHandler={onUpload}
                                                auto
                                                headerStyle={{ width: 171, height: 171 }}
                                                chooseOptions={chooseOptions}
                                                emptyTemplate={emptyTemplate}
                                            />
                                        ) : (
                                            <div className="h-[171px] w-[171px]">
                                                <ExtendedImage
                                                    src={formValues.tokenLogo}
                                                    alt="Uploaded"
                                                    width="171"
                                                    height="171"
                                                    preview
                                                    onPreviewClick={onClear}
                                                />
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="custom-choose-btn p-button-outlined relative h-[171px] w-[171px] rounded-[3px] border-[1px] border-[#34363D] bg-[#1E2028]">
                                        <PrImage
                                            src={Images.COMMON.DEFAULT_IMG_SVG}
                                            width="64"
                                            height="64"
                                            alt="img"
                                            className="absolute left-[50%] top-8 -ml-[32px]"
                                        />
                                        <p className="absolute bottom-[17px] left-[50%] -ml-[78.15px] text-center text-sm text-[#464A5A]">
                                            JPEG/PNG/WEBP/GIF Less than 4MB
                                        </p>
                                    </div>
                                )}
                            </>
                        ),
                    })}
                </div>
                <div>
                    {renderFormItem({
                        width: 349,
                        title: 'Token Name',
                        counter: { maxLength: 15, currentLength: formValues.tokenName.length },
                        isRequired: true,
                        content: (
                            <InputText
                                value={formValues.tokenName}
                                className="h-[54px] w-[349px] border-[#1E2028] bg-[#1E2028] pl-2 focus:border-[#1E2028] focus:outline-none focus:ring-1 focus:ring-[#FFD41A]"
                                onChange={(e) => {
                                    const newValue = e.target.value.replace(/^\s+|\s+$/g, '').slice(0, 15);
                                    setFormValues((prev) => ({ ...prev, tokenName: newValue }));
                                }}
                            />
                        ),
                    })}
                    <div className="mt-6">
                        {renderFormItem({
                            width: 349,
                            title: 'Token Ticker',
                            isRequired: true,
                            counter: { maxLength: 10, currentLength: formValues.tokenTicker.length },
                            content: (
                                <InputText
                                    value={formValues.tokenTicker}
                                    className="h-[54px] w-[349px] border-[#1E2028] bg-[#1E2028] pl-2 focus:outline-none focus:ring-1 focus:ring-[#FFD41A]"
                                    onChange={(e) => {
                                        const newValue = e.target.value.replace(/^\s+|\s+$/g, '').slice(0, 10);
                                        setFormValues((prev) => ({ ...prev, tokenTicker: newValue }));
                                    }}
                                />
                            ),
                        })}
                    </div>
                </div>
            </div>
            <div className="mt-6">
                {renderFormItem({
                    width: 544,
                    title: 'Description',
                    isRequired: true,
                    counter: { maxLength: 500, currentLength: formValues.tokenDescribe.length },
                    content: (
                        <InputTextarea
                            autoResize
                            value={formValues.tokenDescribe}
                            placeholder="Say something about the token here"
                            className="h-[140px] w-[544px] border-[#1E2028] bg-[#1E2028] pl-2 pt-2 focus:outline-none focus:ring-1 focus:ring-[#FFD41A]"
                            onChange={(e) => {
                                const newValue = e.target.value.replace(/^\s+|\s+$/g, '').slice(0, 500);
                                setFormValues((prev) => ({ ...prev, tokenDescribe: newValue }));
                            }}
                        />
                    ),
                })}
            </div>
            <div className="mt-6">
                {renderFormItem({
                    width: 544,
                    title: 'Auction Time',
                    isRequired: true,
                    content: (
                        <div className="card justify-content-center flex">
                            <div className="flex flex-wrap gap-8 sm:gap-9">
                                <div className="align-items-center flex">
                                    <RadioButton
                                        inputId="ingredient1"
                                        name="1h"
                                        value="1"
                                        onChange={(e) => {
                                            setAuctionCycleForDay('');
                                            setFormValues({
                                                auctionCycle: e.value,
                                            });
                                        }}
                                        checked={formValues.auctionCycle === '1'}
                                    />
                                    <label htmlFor="ingredient1" className="ml-3">
                                        1h
                                    </label>
                                </div>
                                <div className="align-items-center flex">
                                    <RadioButton
                                        inputId="ingredient2"
                                        name="6h"
                                        value="6"
                                        onChange={(e) => {
                                            setAuctionCycleForDay('');
                                            setFormValues({
                                                auctionCycle: e.value,
                                            });
                                        }}
                                        checked={formValues.auctionCycle === '6'}
                                    />
                                    <label htmlFor="ingredient2" className="ml-3">
                                        6h
                                    </label>
                                </div>
                                <div className="align-items-center flex">
                                    <RadioButton
                                        inputId="ingredient3"
                                        name="12h"
                                        value="12"
                                        onChange={(e) => {
                                            setAuctionCycleForDay('');
                                            setFormValues({
                                                auctionCycle: e.value,
                                            });
                                        }}
                                        checked={formValues.auctionCycle === '12'}
                                    />
                                    <label htmlFor="ingredient3" className="ml-3">
                                        12h
                                    </label>
                                </div>
                                <div className="align-items-center flex">
                                    <RadioButton
                                        inputId="ingredient4"
                                        name="More..."
                                        value="0"
                                        onChange={(e) => {
                                            setFormValues({
                                                auctionCycle: e.value,
                                            });
                                        }}
                                        checked={formValues.auctionCycle === '0'}
                                    />
                                    <label htmlFor="ingredient4" className="relative ml-3">
                                        <div className="absolute -top-2 left-1 flex justify-between gap-3">
                                            <InputText
                                                placeholder="1~365"
                                                className="h-[42px] w-[95px] border-[#1E2028] bg-[#1E2028] text-[#fff] focus:outline-none focus:ring-1 focus:ring-[#FFD41A]"
                                                value={auctionCycleForDay}
                                                onChange={handleInputChange}
                                            />{' '}
                                            <span className="mt-2">Days</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    ),
                })}
            </div>
            <div className="mt-8">
                {renderFormItem({
                    width: 350,
                    title: 'More Options',
                    content: (
                        <InputSwitch
                            checked={needMore}
                            onChange={moreOptionToggle}
                            pt={{
                                slider: ({ props }: any) => ({
                                    className: classNames(
                                        'absolute cursor-pointer top-0 left-0 right-0 bottom-0 border border-transparent',
                                        'transition-colors duration-200 rounded-2xl',
                                        'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]',
                                        "before:absolute before:content-'' before:top-1/2 before:bg-white before:dark:bg-gray-900 before:w-5 before:h-5 before:left-1 before:-mt-2.5 before:rounded-full before:transition-duration-200",
                                        {
                                            'bg-[#FFD41A] before:transform before:translate-x-5': props.checked,
                                        },
                                    ),
                                }),
                            }}
                        />
                    ),
                })}
            </div>
            {needMore && renderMoreOptions()}
            <Button
                disabled={!isValid}
                loading={createLoading}
                className="mt-8 flex h-[64px] w-[544px] cursor-pointer items-center justify-center rounded-sm border-none bg-[#FFD41A] text-xl font-bold text-[#333] hover:text-[#464A5A]"
                onClick={() => {
                    if (!addressTokenStr) return handleOpenWalletModal();
                    if (!isValid) return;
                    setConfirmDialogVisibleTrue();
                }}
            >
                {!addressTokenStr
                    ? 'Connect Wallet'
                    : !isValid
                      ? 'Fill in information'
                      : createLoading
                        ? ''
                        : 'Create Token Now'}
            </Button>
            {/* Confirm Dialog */}
            {renderConfirmDialog()}
        </div>
    );
};

export default CreateForm;
