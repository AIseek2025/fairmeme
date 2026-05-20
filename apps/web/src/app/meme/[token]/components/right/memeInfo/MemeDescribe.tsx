'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { useTokenInfo } from '@/services/hooks/useGetTokenInfo';
import { useParams } from 'next/navigation';
import { formatAddress, safeMergeClassName } from '@/utils/common';
import { useMemeInfoStore } from '@/store/memeInfoStore';
import Link from 'next/link';
import { paths } from '@/utils/paths';

const MemeDescribe = () => {
    const { token }: { token: string } = useParams();
    const { data: tokenInfo, loading: tokenInfoLoading } = useTokenInfo(token);
    const { memeItem } = useMemeInfoStore();
    const [isZoomed, setIsZoomed] = useState(false);
    const toggleZoom = () => setIsZoomed(!isZoomed);
    return tokenInfoLoading ? null : (
        <div className="rounded-md bg-[#171821] p-6 text-[#7A89A2]">
            <div
                className={safeMergeClassName('flex w-full gap-3', {
                    'flex-col items-start': isZoomed,
                })}
            >
                <div
                    className={safeMergeClassName('h-auto w-[4.5rem] flex-items-center', {
                        'w-full': isZoomed,
                    })}
                    onClick={toggleZoom}
                >
                    {memeItem?.tokenLogo && (
                        <Image
                            src={memeItem?.tokenLogo}
                            alt=""
                            className="h-full w-full rounded-md bg-transparent object-contain"
                            width={72}
                            height={72}
                        />
                    )}
                </div>

                <div>
                    <div className="mb-2 text-sm">
                        <h1 className="font-bold text-white">{memeItem?.tokenName.toUpperCase()}</h1>
                        <h3> ticker: {memeItem?.tokenTicker}</h3>
                    </div>
                    <p className="text-[12px]">
                        Created by:
                        {memeItem?.memberName && (
                            <Link
                                className="cursor-pointer text-yellow underline decoration-1"
                                href={paths.profile(memeItem?.memberName)}
                            >
                                {memeItem?.memberName}
                            </Link>
                        )}
                        {/* <div className="cursor-pointer text-yellow underline decoration-1">
                            {formatAddress(memeItem?.creatorAddress!)}
                        </div> */}
                    </p>
                </div>
            </div>
            <div>
                <p className="my-4 w-full flex-wrap whitespace-normal text-wrap break-words text-sm font-light">
                    {memeItem?.tokenDescribe}
                </p>
            </div>

            <div className="flex w-full justify-end gap-3">
                {memeItem?.webSite && (
                    <i
                        className="pi pi-globe mr-[4px] text-[16px] hover:text-[#FFD41A]"
                        onClick={(e) => {
                            e.stopPropagation();
                            window.open(memeItem?.webSite);
                        }}
                    ></i>
                )}
                {memeItem?.telegramUrl && (
                    <i
                        className="pi pi-telegram mr-[4px] text-[16px] hover:text-[#FFD41A]"
                        onClick={(e) => {
                            e.stopPropagation();
                            window.open(memeItem?.telegramUrl);
                        }}
                    ></i>
                )}
                {memeItem?.twitterUrl && (
                    <i
                        className="pi pi-twitter mr-[4px] text-[16px] hover:text-[#FFD41A]"
                        onClick={(e) => {
                            e.stopPropagation();
                            window.open(memeItem?.twitterUrl);
                        }}
                    ></i>
                )}
                {/* {tokenInfo?.token.farcaster && (
                    <i
                        className="pi pi-globe mr-[4px] text-[16px] hover:text-[#FFD41A]"
                        onClick={(e) => {
                            e.stopPropagation();
                            window.open(tokenInfo?.token.farcaster);
                        }}
                    ></i>
                )} */}
            </div>
        </div>
    );
};

export default MemeDescribe;
