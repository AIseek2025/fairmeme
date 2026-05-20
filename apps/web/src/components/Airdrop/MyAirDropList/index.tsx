'use client';
import twitter from '@/assets/icon/twitter.svg';
import magic from '@/assets/icon/magic.svg';
import airdrop from '@/assets/icon/airdrop.svg';
import kline from '@/assets/icon/kline.svg';
import iconTrading from '@/assets/icon/trading.svg';
import Image from 'next/image';
import { useCopy } from '@/hooks/useCopy';
import ConnectTwitter from '../ConnectTwitter';
import useWalletAddress from '@/hooks/useWalletAddress';
import useStore from '@/store/zustand';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isNil, isNumber } from 'lodash-es';
import { formatNumber, renderFieldsAirdrop, unitFormatter } from '@/utils/common';
interface Props {
    isUserChecked: boolean;
    summary: any;
    getSummaryFn: () => void;
}
const MyAirDropList = ({ isUserChecked, summary, getSummaryFn }: Props) => {
    const { copy } = useCopy();
    const loginId = useStore((state) => state.loginId);
    const { addressTokenStr } = useWalletAddress();
    const pathname = usePathname();
    const [linkUrl, setLinkUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined' && loginId) {
            setLinkUrl(`${window.location.origin}/myAirdrop?code=${loginId}`);
        }
    }, [pathname, loginId]);

    const list = [
        {
            icon: twitter,
            title: 'Twitter Airdrop',
            amount: renderFieldsAirdrop(summary.twUserName ? summary.twTotal : '', true),
            desc: 'You will receive a Twitter airdrop based on your overall Twitter score.',
            children: <ConnectTwitter isUserChecked={isUserChecked} summary={summary} getSummaryFn={getSummaryFn} />,
        },
        {
            icon: airdrop,
            title: 'Address Airdrop',
            amount: renderFieldsAirdrop(isUserChecked ? summary.addressTotal : '', true),
            desc: (
                <>
                    If your account balance exceeds <span className="text-[#fff]">$500</span> at the time of the
                    snapshot, you will receive <span className="text-[#fff]">10,000 $FAIR</span>.
                </>
            ),
        },
        {
            icon: magic,
            title: 'Creation Rewards',
            amount: renderFieldsAirdrop(isUserChecked ? summary.createTotal : ''),
            desc: (
                <>
                    For every meme token you create, you will receive <span className="text-[#fff]">50,000 $FAIR</span>{' '}
                    as a reward.
                </>
            ),
            children: (
                <div className="mt-[1rem] border-t-[1px] border-dashed border-[#2B3139] pt-[1rem] text-[1.25rem] leading-[1.5rem] text-[#848E9C] sm:ml-[2.5rem]">
                    Creation{' '}
                    <span className="text-[#fff]">
                        {renderFieldsAirdrop(isUserChecked ? summary.creatorCount : '', false, '')}
                    </span>
                </div>
            ),
        },
        {
            icon: kline,
            title: 'Trading Rewards',
            amount: renderFieldsAirdrop(isUserChecked ? summary.tradeTotal : ''),
            desc: (
                <>
                    <p> You will receive trading rewards based on the amount of your trading volume. </p>
                    <p className="mt-1">
                        Trading Rewards=Trading Volume(sol)*<span className="text-white">1,000</span>.
                    </p>
                </>
            ),
            children: (
                <div className="mt-[1rem] border-t-[1px] border-dashed border-[#2B3139] pt-[1rem] text-[1.25rem] leading-[1.5rem] text-[#848E9C] sm:ml-[2.5rem]">
                    Trading Volume{' '}
                    <span className="text-[#fff]">
                        {renderFieldsAirdrop(isUserChecked ? summary.tradeVol : '', false, 'SOL')}
                    </span>
                </div>
            ),
        },
        {
            icon: iconTrading,
            title: 'Invitation Rewards',
            amount: renderFieldsAirdrop(isUserChecked ? summary.inviteTotal : ''),
            desc: (
                <>
                    You will receive <span className="text-[#fff]">10%</span> of the total airdrop amount earned by the
                    people you invite as a referral reward.
                </>
            ),
            children: (
                <div className="mt-[1rem] border-t-[1px] border-dashed border-[#2B3139] pt-[1rem] text-[1.25rem] leading-[1.5rem] text-[#848E9C] sm:ml-[2.5rem]">
                    Invitees{' '}
                    <span className="text-[#fff]">
                        {renderFieldsAirdrop(isUserChecked ? summary.inviteCount : '', false, '')}
                    </span>
                </div>
            ),
        },
    ];
    return (
        <div className="border-[1px] border-b-0 border-solid border-[#2B3139] px-[1.5rem] pb-[3.125rem]">
            {list.map((i, index) => (
                <div key={index} className="border-b-[1px] border-solid border-[#2B3139] py-[2rem]">
                    <div className="flex items-start justify-between">
                        <div className="flex">
                            <Image
                                src={i.icon}
                                alt="twitter"
                                className={`mr-[0.5rem] hidden h-[2rem] w-[2rem] sm:block`}
                            ></Image>
                            <div>
                                <p className="text-[1.25rem] font-bold leading-[1.5rem]">{i.title}</p>
                                <div className="block text-[2rem] font-bold sm:hidden">{i.amount}</div>
                                <div className="mt-[.75rem] text-[.875rem] leading-[1rem] text-[#848E9C]">{i.desc}</div>
                            </div>
                        </div>
                        <div className="hidden text-[2rem] font-bold sm:block">{i.amount}</div>
                    </div>
                    {i.children}
                </div>
            ))}
            {addressTokenStr && linkUrl && (
                <div className="mt-[2rem] inline-block rounded-[.1875rem] border-[1px] border-solid border-[#2B3139] bg-[#181A20] p-[1.5rem]">
                    <p className="font-bold">Invite Link</p>
                    <div className="flex items-center text-[#848E9C]">
                        <div>{linkUrl}</div>
                        <i
                            onClick={(e) => {
                                e.stopPropagation();
                                copy(linkUrl);
                            }}
                            className="pi pi-copy ml-[1rem] cursor-pointer text-[1rem] hover:text-yellow"
                        ></i>
                    </div>
                </div>
            )}
        </div>
    );
};
export default MyAirDropList;
