'use client';
import Image from 'next/image';
import React from 'react';
import farcaster from '@/assets/icon/farcaster.svg';
import website from '@/assets/icon/website.svg';
import x from '@/assets/icon/x.svg';
import tg from '@/assets/icon/tg.svg';
import { useTokenInfo } from '@/services/hooks/useGetTokenInfo';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatTimestamp } from '@/utils/common';
import { AddressTokenRebuild } from '@/components/AddressToken/AddressTokenRebuild';

const MemeDescribe = () => {
    const { token }: { token: string } = useParams();
    const { data: tokenInfo, loading: tokenInfoLoading } = useTokenInfo(token);
    return (
        <div className="rounded-md bg-[#171821] p-6 text-[#7A89A2]">
            <div className="gap-6 flex-items-center">
                <div className="h-[6rem] w-[6rem] overflow-hidden">
                    {tokenInfo?.token.tokenLogo && (
                        <Image
                            src={tokenInfo?.token.tokenLogo}
                            alt=""
                            className="h-full w-full bg-white"
                            width={96}
                            height={96}
                        />
                    )}
                </div>

                <div>
                    <div className="mb-[1.25rem] flex text-[1.75rem]">
                        <h1 className="font-bold text-white">{tokenInfo?.token.tokenName.toUpperCase()}</h1>
                        <span>&nbsp;(${tokenInfo?.token.tokenTicker})</span>
                    </div>
                    <div className="gap-2 text-lg flex-items-center">
                        <span>Created by:</span>
                        <AddressTokenRebuild
                            address={tokenInfo?.token.creatorAddress}
                            className="gap-3"
                            addressClassName="text-yellow"
                            iconClassName="text-xl"
                            copyable={true}
                        />
                        {tokenInfo?.token.auctionTime && <span>{formatTimestamp(tokenInfo?.token.aucT)}</span>}
                    </div>
                </div>
            </div>
            {/* <p className="my-4 text-lg font-light">{tokenInfo?.token.tokenDescribe}</p> */}
            <p className="my-4 text-lg font-light">{tokenInfo?.token.tokenDescribe}</p>
            <div className="flex w-full justify-start gap-3">
                {tokenInfo?.token.webSite && (
                    <Link href={tokenInfo?.token.webSite} className="h-8 w-8">
                        <Image src={website} alt="webSite" width={32} height={32} className="h-full w-full" />
                    </Link>
                )}
                {tokenInfo?.token.telegramUrl && (
                    <Link href={tokenInfo?.token.telegramUrl} className="h-8 w-8">
                        <Image src={tg} alt="telegramUrl" width={32} height={32} className="h-full w-full" />
                    </Link>
                )}
                {tokenInfo?.token.twitterUrl && (
                    <Link href={tokenInfo?.token.webSite} className="h-8 w-8">
                        <Image src={x} alt="twitterUrl" width={32} height={32} className="h-full w-full" />
                    </Link>
                )}
                {tokenInfo?.token.farcaster && (
                    <Link href={tokenInfo?.token.farcaster} className="h-8 w-8">
                        <Image src={farcaster} alt="farcaster" width={32} height={32} className="h-full w-full" />
                    </Link>
                )}
            </div>
        </div>
    );
};

export default MemeDescribe;
