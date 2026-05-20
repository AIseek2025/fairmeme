import { useRef, useState } from 'react';
import Image from 'next/image';
import { formatNumber, formatTimestamp, getAddressDisplayName, safeMergeClassName } from '@/utils/common';
import starGray from '@/assets/icon/star-gray.png';

import Link from 'next/link';
import { ProgressBar } from 'primereact/progressbar';
import farcaster from '@/assets/icon/farcaster.svg';
import farcasterYellow from '@/assets/icon/farcaster-yellow.svg';
import starYellow from '@/assets/icon/star-yellow.png';
import { useMemoizedFn } from 'ahooks';
import { useHover } from 'ahooks';

interface Props {
    list: FairMemeHome.Item[];
    toMemeIndex: (address: string) => void;
    switchCard: boolean;
    followedHandle: (tokenAddress: string) => void;
}
const CardItem = ({
    item,
    toMemeIndex,
    switchCard,
    followedHandle,
}: {
    switchCard: boolean;
    item: FairMemeHome.Item;
    toMemeIndex: (address: string) => void;
    followedHandle: (tokenAddress: string) => void;
}) => {
    const ref = useRef(null);
    const isHovering = useHover(ref);
    const [imgLoading, setImgLoading] = useState<boolean>(true);

    const handleImageLoad = () => {
        setImgLoading(false);
    };
    const {
        change1,
        change6,
        change12,
        change24,
        vol1,
        vol6,
        vol12,
        vol24,
        turnover1,
        turnover6,
        turnover12,
        turnover24,
        txs1,
        txs6,
        txs12,
        txs24,
    } = item;
    const list = [
        {
            title: 'Price Change',
            valueArr: [`${change1}%`, `${change6}%`, `${change12}%`, `${change24}%`],
        },
        {
            title: 'Volume',
            valueArr: [
                `$${formatNumber(vol1)}`,
                `$${formatNumber(vol6)}`,
                `$${formatNumber(vol12)}`,
                `$${formatNumber(vol24)}`,
            ],
        },
        {
            title: 'Turnover',
            valueArr: [
                `${formatNumber(turnover1)}%`,
                `${formatNumber(turnover6)}%`,
                `${formatNumber(turnover12)}%`,
                `${formatNumber(turnover24)}%`,
            ],
        },
        {
            title: 'TXs',
            valueArr: [
                `${formatNumber(txs1, 0)}`,
                `${formatNumber(txs6, 0)}`,
                `${formatNumber(txs12, 0)}`,
                `${formatNumber(txs24, 0)}`,
            ],
        },
    ];
    const handleClick = useMemoizedFn((event: any) => {
        event.stopPropagation();
    });
    return (
        <div
            className="flex origin-center transform cursor-pointer flex-col overflow-hidden rounded-[3px] border-[1px] border-solid border-[#34363D] bg-[#1E2028] transition duration-500 hover:scale-105 hover:bg-[#303843] hover:shadow-[0px_0px_20px_1px_rgba(0,0,0,0.9)]"
            onClick={() => toMemeIndex(item.tokenAddress)}
            role="listitem"
            aria-hidden
        >
            <div
                className={safeMergeClassName(
                    'relative mx-auto flex h-[34.875rem] w-[34.875rem] sm:h-[19.75rem] sm:w-[19.75rem]',
                )}
            >
                <Image
                    onLoadingComplete={handleImageLoad}
                    src={item.tokenLogo}
                    layout="fill"
                    objectFit="contain"
                    alt=""
                />
            </div>
            {switchCard ? (
                <div className="flex flex-1 flex-col justify-between px-[.625rem] py-[.625rem] text-[.625rem] text-[#848E9C]">
                    <div>
                        <div className="flex justify-between">
                            <div className="auto-wrap overflow-hidden text-[.875rem] leading-[1rem] text-[#fff]">
                                <span className="font-bold">{item.tokenName}</span>
                                <span className="text-[#7A89A2]"> ({item.tokenTicker})</span>
                            </div>
                            <div className="font-helvetica text-[.875rem] text-[#FFD41A]">
                                ${formatNumber(item.tokenPrice, 9)}
                            </div>
                        </div>
                        <div className="mt-[3px] flex items-center justify-between leading-[10px] text-[#848E9C]">
                            <div className="flex items-center">
                                Views{' '}
                                <div className="ml-[.375rem] text-[#EAECEF]">{formatNumber(item.viewCount, 0)}</div>
                            </div>
                            <div className="flex items-center">
                                Watchers{' '}
                                <div className="ml-[.375rem] text-[#EAECEF]">{formatNumber(item.watchers, 0)}</div>
                            </div>
                            <div className="flex items-center">
                                holders{' '}
                                <div className="ml-[.375rem] text-[#EAECEF]">{formatNumber(item.holders, 0)}</div>
                            </div>
                        </div>
                    </div>
                    {list.map(({ title, valueArr }, idx) => (
                        <div key={idx} className="mt-[.75rem] leading-[.625rem]">
                            <div className="mb-[10px]">{title}</div>

                            <div className="mt-[3px] flex w-full text-[#EAECEF]">
                                {valueArr.map((i, id) => (
                                    <div
                                        className="mr-[.1875rem] border-[1px] border-solid border-[#34363D] px-[.25rem] py-[.3125rem] text-[#7A89A2] last:mr-0"
                                        key={id}
                                    >
                                        {!(id * 6) ? 1 : id * 6}h <span className="text-[#fff]">{i}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="overflow-hidden px-[1rem] py-[.625rem] text-[.875rem] leading-[1rem]">
                    <div className="relative flex justify-between">
                        <div className="flex flex-col items-start">
                            <div className="auto-wrap mt-[3px] overflow-hidden text-[#fff]">
                                <span className="font-bold">{item.tokenName}</span>
                                <span className="text-[#7A89A2]"> ({item.tokenTicker})</span>
                            </div>
                            <div className="mt-[0.5rem] text-[#7A89A2]">
                                Created by{' '}
                                <span className="text-[#FFD41A]">{getAddressDisplayName(item.creatorAddress, 4)}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                            <Image
                                src={item.followed ? starYellow : starGray}
                                alt=""
                                width={20}
                                height={20}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    followedHandle(item.tokenAddress);
                                }}
                                className="h-[1.25rem] w-[1.25rem]"
                            />
                            <div className="text-[1rem] text-[#7A89A2]">{formatTimestamp(item.created)}</div>
                        </div>
                    </div>
                    {item.tokenDescribe && (
                        <div className="mt-[1.5rem] line-clamp-3 text-[1rem] text-[#fff]">{item.tokenDescribe}</div>
                    )}
                    <div className="mt-[1.5rem] flex flex-wrap items-center justify-between text-[.625rem] text-[#7A89A2]">
                        <div className="mr-[6px] mt-[3px] flex items-center">
                            <div className="mr-[3px] h-[6px] w-[6px] rounded-full bg-[#FFD41A]"></div>
                            MC:
                            <div className="text-[#EAECEF]">${formatNumber(item.marketCap)}</div>
                        </div>
                        <div className="mr-[6px] mt-[3px] flex items-center">
                            <div className="mr-[3px] h-[6px] w-[6px] rounded-full bg-[#00E0FF]"></div>
                            FDMC:
                            <div className="text-[#EAECEF]">${formatNumber(item.fdmc)}</div>
                        </div>
                        <div className="mr-[6px] mt-[3px] flex items-center">
                            <div className="mr-[3px] h-[6px] w-[6px] rounded-full bg-[#0ECB81]"></div>
                            LIQ:
                            <div className="text-[#EAECEF]">${formatNumber(item.liquidity)}</div>
                        </div>
                    </div>

                    <div className="flex items-end justify-between text-[.625rem]">
                        <div>
                            <span className="top-1">
                                <span className="text-[#848E9C]">Auction Time/Progress:</span>
                                <span className="text-yellow">
                                    {formatTimestamp(item.aucT)}/{item.aucP}%
                                </span>
                            </span>
                            <ProgressBar
                                color="#FFD41A"
                                showValue={false}
                                pt={{
                                    root: {
                                        className: safeMergeClassName('bg-[#848E9C] h-[6px] w-full mt-[.625rem]'),
                                    },
                                }}
                                value={Number(item.aucP)}
                            />
                        </div>
                        <div className="ml-[6px] flex">
                            {item.webSite && (
                                <i
                                    className="pi pi-globe text-16px mr-[4px] hover:text-[#FFD41A]"
                                    onClick={(e) => {
                                        handleClick(e);
                                        window.open(item.webSite);
                                    }}
                                ></i>
                            )}

                            {item.telegramUrl && (
                                <i
                                    className="pi pi-telegram text-16px mr-[4px] hover:text-[#FFD41A]"
                                    onClick={(e) => {
                                        handleClick(e);
                                        window.open(item.telegramUrl);
                                    }}
                                ></i>
                            )}
                            {item.twitterUrl && (
                                <i
                                    className="pi pi-twitter text-16px mr-[4px] hover:text-[#FFD41A]"
                                    onClick={(e) => {
                                        handleClick(e);
                                        window.open(item.twitterUrl);
                                    }}
                                ></i>
                            )}
                            {item.farcaster && (
                                <Image
                                    ref={ref}
                                    src={isHovering ? farcasterYellow : farcaster}
                                    alt=""
                                    width={16}
                                    height={16}
                                    onClick={(e) => {
                                        handleClick(e);
                                        window.open(item.farcaster);
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
const CardList = ({ list, toMemeIndex, switchCard, followedHandle }: Props) => {
    return (
        <div
            className={safeMergeClassName(
                'mx-auto mt-[25px] grid w-full grid-cols-1 gap-[24px] sm:w-[19.625rem] lg:w-auto lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
            )}
        >
            {list?.map((item: FairMemeHome.Item, index) => (
                <CardItem
                    switchCard={switchCard}
                    toMemeIndex={toMemeIndex}
                    followedHandle={followedHandle}
                    key={index}
                    item={item}
                />
            ))}
        </div>
    );
};
export default CardList;
