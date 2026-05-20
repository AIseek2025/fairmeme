import React, { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useAsyncEffect, useMemoizedFn, useRequest } from 'ahooks';
import { checkTwBind, membersPut } from '@/services/api/airdrop';
import twitterBlue from '@/assets/icon/twitter-blue.svg';
import Image from 'next/image';
import useWalletAddress from '@/hooks/useWalletAddress';
import { GetSummary } from '@/types/meme';
import useStore from '@/store/zustand';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';

type Props = {
    isUserChecked: boolean;
    summary: GetSummary.Response;
    getSummaryFn: () => void;
};

const ConnectTwitter = ({ isUserChecked, summary, getSummaryFn }: Props) => {
    const { showToast } = useToast();
    const { addressTokenStr } = useWalletAddress();
    const { data: session } = useSession();
    const loginId = useStore((state) => state.loginId);
    const [exists, setExists] = useState(false);
    const [bindTwitter, setBindTwitter] = useState(false);
    const [creatorAddress, setCreatorAddress] = useState('');
    useAsyncEffect(async () => {
        if (session?.user?.screen_name && loginId) {
            const res = await checkTwBind({
                twUserName: session?.user?.screen_name,
            });

            if (res.exists) {
                if (res.creatorAddress !== addressTokenStr) {
                    showToast({
                        severity: 'error',
                        detail: 'This Twitter account has already been linked to another wallet address and cannot be linked again.',
                        life: 5000,
                    });
                    signOut({ redirect: false });
                }

                setExists(true);
                setCreatorAddress(res.creatorAddress);
            } else {
                await membersPut({
                    twName: session?.user?.name ?? '',
                    twUserName: session?.user?.screen_name,
                    twAvatarUrl: session?.user?.image ?? '',
                    loginId,
                });
                setBindTwitter(true);
                getSummaryFn();
            }
        }
    }, [session, loginId, addressTokenStr]);
    const xClick = useMemoizedFn(() => {
        if (summary.twUserName ?? session?.user?.screen_name ?? bindTwitter) return;
        signIn('twitter');
    });

    if (!addressTokenStr) {
        return (
            <div className="mt-[1.5rem] flex h-[3rem] w-[10.5rem] cursor-not-allowed items-center justify-center rounded-[.1875rem] bg-[#252831] text-[.875rem] font-bold text-[#707070] sm:ml-[2.5rem]">
                CONNECT TWITTER
            </div>
        );
    }
    if (exists && creatorAddress && creatorAddress !== addressTokenStr) {
        return (
            <Link
                href={'https://twitter.com/logout'}
                className="mt-[1.5rem] flex h-[3rem] w-[10.5rem] cursor-pointer items-center justify-center rounded-[.1875rem] bg-[#FFD41A] text-[.875rem] font-bold text-[#333] sm:ml-[2.5rem]"
            >
                CONNECT TWITTER
            </Link>
        );
    }
    return (
        <div onClick={xClick}>
            {(session?.user ?? summary.twUserName) ? (
                <div className="mt-[1.5rem] inline-flex items-center border-[1px] border-solid border-[#2B3139] px-[1rem] py-[0.5rem] text-[.875rem] leading-[1.125rem] sm:ml-[2.5rem]">
                    <Image
                        src={session?.user?.image ?? summary.twAvatarUrl ?? ''}
                        alt=""
                        width={32}
                        height={32}
                        className="mr-[0.5rem] h-[2rem] w-[2rem] overflow-hidden rounded-full"
                    ></Image>
                    <div>
                        <div className="flex items-center">
                            <p className="font-bold">{session?.user?.name ?? summary.twName}</p>
                            <Image
                                src={twitterBlue}
                                alt=""
                                width={16}
                                height={16}
                                className="ml-[.25rem] h-[1rem] w-[1rem]"
                            ></Image>
                        </div>
                        <span className="text-[#707070]">@{session?.user?.screen_name ?? summary.twUserName}</span>
                    </div>
                </div>
            ) : (
                <div className="mt-[1.5rem] flex h-[3rem] w-[10.5rem] cursor-pointer items-center justify-center rounded-[.1875rem] bg-[#FFD41A] text-[.875rem] font-bold text-[#333] sm:ml-[2.5rem]">
                    CONNECT TWITTER
                </div>
            )}
        </div>
    );
};
export default ConnectTwitter;
