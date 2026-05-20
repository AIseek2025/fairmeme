'use client';
import React, { useState } from 'react';
import { calculatePercentage, formatNumber, safeMergeClassName } from '@/utils/common';
import { ProgressBar } from 'primereact/progressbar';
import { useRequest } from 'ahooks';
import { useParams } from 'next/navigation';
import { getTradeDetail } from '@/services/api/meme';
type Props = {
    leftVolume: string | number;
    rightVolume: string | number;
    percent: number;
};

const BuyAndSellInfo = ({ leftVolume, rightVolume, percent }: Props) => {
    return (
        <div className="flex w-[80%] flex-col gap-2">
            <ProgressBar value={percent} color="#00C47A" showValue={false} className="h-[6px] rounded-full bg-red" />
            <div className="justify-between text-[10px] flex-items-center">
                <div className="gap-1 flex-items-center">
                    <span className="h-[5px] w-[5px] rounded-full bg-[#00C47A]"></span>
                    <div className="text-[#7A89A2]">BUYS</div>
                    <div className="pl-4 text-[10px]">{leftVolume}</div>
                </div>
                <div className="gap-1 flex-items-center">
                    <span className="h-[5px] w-[5px] rounded-full bg-[#FF3B54]"></span>
                    <div className="text-[#7A89A2]">SELLS</div>
                    <div className="pl-4 text-[10px]">{rightVolume}</div>
                </div>
            </div>
        </div>
    );
};
const HourData = () => {
    const { token }: { token: string } = useParams();
    const [activeTime, setActiveTime] = useState(1);
    const { data: tradeDetailData } = useRequest(
        () =>
            getTradeDetail({
                tokenAddress: token,
                hours: activeTime,
            }),
        {
            refreshDeps: [activeTime],
        },
    );

    return (
        <div className="flex w-full flex-col overflow-hidden rounded-lg bg-[#171821] p-4">
            <div className="mb-4 flex w-full overflow-hidden rounded-md border border-r-0 border-[#34363D]">
                <div
                    className={safeMergeClassName(
                        'flex h-12 flex-1 flex-col items-center justify-center border-r border-[#34363D]',
                        activeTime === 1 ? 'bg-[#34363D]' : '',
                    )}
                    onClick={() => setActiveTime(1)}
                >
                    <div className="text-[12px] leading-none text-[#7A89A2]">1h</div>
                    {/* <div className="text-[14px] text-white">{tokenListData?.items[0]?.change1}%</div> */}
                </div>
                <div
                    className={safeMergeClassName(
                        'flex h-12 flex-1 flex-col items-center justify-center border-r border-[#34363D]',
                        activeTime === 6 ? 'bg-[#34363D]' : '',
                    )}
                    onClick={() => setActiveTime(6)}
                >
                    <div className="text-[12px] leading-none text-[#7A89A2]">6h</div>
                    {/* <div className="text-[14px] text-white">{tokenListData?.items[0]?.change6}%</div> */}
                </div>
                <div
                    className={safeMergeClassName(
                        'flex h-12 flex-1 flex-col items-center justify-center border-r border-[#34363D]',
                        activeTime === 12 ? 'bg-[#34363D]' : '',
                    )}
                    onClick={() => setActiveTime(12)}
                >
                    <div className="text-[12px] leading-none text-[#7A89A2]">{'12h'}</div>
                    {/* <div className="text-[14px] text-white">{tokenListData?.items[0]?.change12}%</div> */}
                </div>
                <div
                    className={safeMergeClassName(
                        'flex h-12 flex-1 flex-col items-center justify-center border-r border-[#34363D]',
                        activeTime === 24 ? 'bg-[#34363D]' : '',
                    )}
                    onClick={() => setActiveTime(24)}
                >
                    <div className="text-[12px] leading-none text-[#7A89A2]">24h</div>
                    {/* <div className="text-[14px] text-white">
                        {tokenListData?.items == null ? '-' : tokenListData?.items[0]?.change24}%
                    </div> */}
                </div>
            </div>

            <div className="flex w-full flex-col gap-4">
                <div className="justify-between flex-items-center">
                    <div>
                        <p className="text-[10px] text-[#848E9C]">TXNS</p>
                        <p className="text-[12px] text-[#EAECEF]">{tradeDetailData?.trade_cnt}</p>
                    </div>
                    <BuyAndSellInfo
                        leftVolume={tradeDetailData?.buy_cnt?.toString()}
                        rightVolume={tradeDetailData?.sell_cnt?.toString()}
                        percent={
                            Number(calculatePercentage(tradeDetailData?.buy_cnt, tradeDetailData?.trade_cnt)) === 0 &&
                            Number(tradeDetailData?.trade_cnt) === 0
                                ? 50
                                : Number(calculatePercentage(tradeDetailData?.buy_cnt, tradeDetailData?.trade_cnt))
                        }
                    />
                </div>
                <div className="justify-between flex-items-center">
                    <div>
                        <p className="text-[10px] text-[#848E9C]">VOLUME</p>
                        <p className="text-[12px] text-[#EAECEF]">${formatNumber(tradeDetailData?.trade_amt)}</p>
                    </div>
                    <BuyAndSellInfo
                        leftVolume={`$${formatNumber(tradeDetailData?.buy_amt)}`}
                        rightVolume={`$${formatNumber(tradeDetailData?.sell_amt)}`}
                        percent={
                            Number(calculatePercentage(tradeDetailData?.buy_amt, tradeDetailData?.trade_amt)) === 0 &&
                            Number(tradeDetailData?.trade_amt) === 0
                                ? 50
                                : Number(calculatePercentage(tradeDetailData?.buy_amt, tradeDetailData?.trade_amt))
                        }
                    />
                </div>
                <div className="justify-between flex-items-center">
                    <div>
                        <p className="text-[10px] text-[#848E9C]">MAKERS</p>
                        <p className="text-[12px] text-[#EAECEF]">{formatNumber(tradeDetailData?.total_users)}</p>
                    </div>
                    <BuyAndSellInfo
                        leftVolume={formatNumber(tradeDetailData?.buyers)}
                        rightVolume={formatNumber(tradeDetailData?.sellers)}
                        percent={
                            Number(calculatePercentage(tradeDetailData?.buyers, tradeDetailData?.total_users)) === 0 &&
                            Number(tradeDetailData?.total_users) === 0
                                ? 50
                                : Number(calculatePercentage(tradeDetailData?.buyers, tradeDetailData?.total_users))
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default HourData;
