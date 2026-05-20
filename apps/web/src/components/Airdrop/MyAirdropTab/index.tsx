'use client';
import { MY_AIRDROP_TABS } from '@/constants/airdrop';
import { Suspense, useState } from 'react';
import { openExplorer, renderFieldsAirdrop, safeMergeClassName } from '@/utils/common';

import MyAirDropList from '../MyAirDropList';
import InvitationRewards from '../InvitationRewards';
import TradingRewards from '../TradingRewards';
import useWalletAddress from '@/hooks/useWalletAddress';
import useReferralSystem from '@/hooks/useReferralSystem';
import { useSearchParams } from 'next/navigation';
import { useCreation, useMemoizedFn } from 'ahooks';
import { Button } from 'primereact/button';
import CustomConnectButton from '@/components/connectbutton/CustomConnectButton';
import { ToastMessage } from 'primereact/toast';
import { useToast } from '@/context/ToastContext';

const MyAirdropTab = () => {
    const { showToast } = useToast();
    const searchParams = useSearchParams();
    const showToastFn = useMemoizedFn(
        (
            type: ToastMessage['severity'],
            message: string,
            description: string | React.ReactNode,
            signature?: string,
        ) => {
            showToast({
                severity: type,
                summary: message,
                detail: (
                    <>
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
                    </>
                ),
                life: 5000,
            });
        },
    );
    const {
        summary,
        establishReferralRelationship,
        getSummaryFn,
        isUserChecked,
        initLoading: getSummaryLoading,
        isLoading: establishReferralRelationshipLoading,
    } = useReferralSystem({
        showToastFn,
        referralCode: searchParams.get('code'),
    });

    const { addressTokenStr } = useWalletAddress();

    const [tab, setTab] = useState('myAirdrop');

    const checkEligibility = async () => {
        await establishReferralRelationship();
        getSummaryFn();
    };

    const getButtonText = useCreation(() => {
        // console.log('status', establishReferralRelationshipLoading, getSummaryLoading);
        if (establishReferralRelationshipLoading || getSummaryLoading) return '';
        if (isUserChecked) return 'Claim';
        return 'check eligibility';
    }, [isUserChecked, establishReferralRelationshipLoading, getSummaryLoading]);

    return (
        <>
            <div className="px-[1.5rem] pt-[3rem] font-helvetica lg:mx-auto lg:w-[73.75rem] lg:px-0">
                <div>
                    <p className="text-[1.25rem] font-bold">My Total Airdrop</p>
                    <div className="mt-[.75rem] text-[3.375rem] font-bold leading-[3.875rem]">
                        {isUserChecked ? renderFieldsAirdrop(summary.total) : ''}
                    </div>
                </div>
                {addressTokenStr ? (
                    <Button
                        onClick={checkEligibility}
                        disabled={isUserChecked}
                        loading={establishReferralRelationshipLoading || getSummaryLoading}
                        className={`mt-[2rem] flex h-[3rem] w-[16.25rem] cursor-pointer items-center justify-center rounded-[.1875rem] text-[.875rem] font-bold ${isUserChecked ? 'cursor-not-allowed bg-[#252831] text-[#707070]' : 'cursor-pointer bg-[#FFD41A] text-[#333]'}`}
                    >
                        {getButtonText}
                    </Button>
                ) : (
                    <CustomConnectButton
                        className={safeMergeClassName(
                            'mt-[2rem] flex h-[3rem] w-[16.25rem] cursor-pointer items-center justify-center rounded-[.1875rem] bg-[#FFD41A] text-[.875rem] font-bold text-[#333]',
                        )}
                    />
                )}

                <div className="mt-[2rem] flex h-[4rem] border-[1px] border-b-0 border-solid border-[#2B3139] px-[1.5rem]">
                    {MY_AIRDROP_TABS.map((i) => (
                        <div
                            onClick={() => setTab(i.key)}
                            className={`relative mr-[1.5rem] flex h-full cursor-pointer items-center text-[.875rem] font-bold hover:text-yellow ${i.key === tab ? 'text-[#fff]' : 'text-[#707070]'}`}
                            key={i.key}
                        >
                            <div
                                className={`absolute bottom-0 left-[50%] h-[.125rem] w-[2rem] -translate-x-[50%] rounded-[.1875rem] bg-[#FFD41A] ${i.key === tab ? 'visible' : 'invisible'}`}
                            ></div>
                            {i.title}
                        </div>
                    ))}
                </div>
                {tab === 'myAirdrop' ? (
                    <Suspense fallback="">
                        <MyAirDropList isUserChecked={isUserChecked} summary={summary} getSummaryFn={getSummaryFn} />
                    </Suspense>
                ) : tab === 'tradingRewards' ? (
                    <TradingRewards />
                ) : (
                    <InvitationRewards />
                )}
            </div>
        </>
    );
};
export default MyAirdropTab;
